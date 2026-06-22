import "server-only";
import { Redis } from "@upstash/redis";
import { promises as fs } from "node:fs";
import path from "node:path";
import {
  cases as seedCases,
  type Case,
  type Party,
  type OfficeLevel,
  type OfficeStatus,
} from "@/data/cases";

// ---------------------------------------------------------------------------
// Submission model
// ---------------------------------------------------------------------------
// A Submission is what a member of the public sends in. It is NEVER shown on the
// public site until an admin approves it. Approval maps it into a published Case.

export interface Submission {
  id: string;
  name: string;
  party: Party;
  officeLevel: OfficeLevel;
  officeTitle: string;
  state: string;
  /** Office relationship at the time of the offense. May be absent on old rows. */
  officeStatusAtOffense?: OfficeStatus;
  convictionYear: number;
  offenseSummary: string;
  /** Proof of party affiliation (Ballotpedia, state party registration, etc.). */
  partyProofUrl: string;
  /** One or more links proving the conviction (court ruling, DOJ/AG, reporting). */
  convictionProofUrls: string[];
  /** Optional — lets the reviewer follow up. Never published. */
  submitterEmail?: string;
  submittedAt: string; // ISO
  status: "pending" | "approved" | "rejected";
  /** ISO timestamp set when an admin approves/rejects. */
  reviewedAt?: string;
}

export type SubmissionInput = Omit<Submission, "id" | "submittedAt" | "status" | "reviewedAt">;

// ---------------------------------------------------------------------------
// Storage backend: Upstash Redis in production, local JSON file in dev.
// ---------------------------------------------------------------------------

const SUBMISSIONS_KEY = "submissions:v1";
const CORRECTIONS_KEY = "corrections:v1";
const SUBMISSIONS_FILE = "submissions.json";
const CORRECTIONS_FILE = "corrections.json";

export function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
  if (url && token) return new Redis({ url, token });
  return null;
}

function localFile(name: string): string {
  return path.join(process.cwd(), ".data", name);
}

async function readList<T>(key: string, file: string): Promise<T[]> {
  const redis = getRedis();
  if (redis) {
    const data = await redis.get<T[]>(key);
    return data ?? [];
  }
  // Local dev fallback — does NOT persist on Vercel (read-only FS at runtime).
  try {
    return JSON.parse(await fs.readFile(localFile(file), "utf8")) as T[];
  } catch {
    return [];
  }
}

async function writeList<T>(key: string, file: string, items: T[]): Promise<void> {
  const redis = getRedis();
  if (redis) {
    await redis.set(key, items);
    return;
  }
  await fs.mkdir(path.dirname(localFile(file)), { recursive: true });
  await fs.writeFile(localFile(file), JSON.stringify(items, null, 2), "utf8");
}

const readAll = () => readList<Submission>(SUBMISSIONS_KEY, SUBMISSIONS_FILE);
const writeAll = (items: Submission[]) =>
  writeList<Submission>(SUBMISSIONS_KEY, SUBMISSIONS_FILE, items);

/** True when a real persistent backend is configured. */
export function hasPersistentStore(): boolean {
  return getRedis() !== null;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

function slugify(name: string, year: number): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `sub-${base || "case"}-${year}`;
}

export async function addSubmission(input: SubmissionInput): Promise<Submission> {
  const items = await readAll();
  let id = slugify(input.name, input.convictionYear);
  // Ensure uniqueness.
  if (items.some((s) => s.id === id)) id = `${id}-${items.length + 1}`;
  const submission: Submission = {
    ...input,
    id,
    submittedAt: new Date().toISOString(),
    status: "pending",
  };
  items.push(submission);
  await writeAll(items);
  return submission;
}

export async function listSubmissions(status?: Submission["status"]): Promise<Submission[]> {
  const items = await readAll();
  const filtered = status ? items.filter((s) => s.status === status) : items;
  return filtered.sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
}

export async function getSubmission(id: string): Promise<Submission | undefined> {
  const items = await readAll();
  return items.find((s) => s.id === id);
}

export async function setSubmissionStatus(
  id: string,
  status: "approved" | "rejected",
): Promise<void> {
  const items = await readAll();
  const next = items.map((s) =>
    s.id === id ? { ...s, status, reviewedAt: new Date().toISOString() } : s,
  );
  await writeAll(next);
}

/** Fields a reviewer may correct before publishing (e.g. fix a wrong year). */
export type SubmissionEdit = Pick<
  Submission,
  | "name"
  | "party"
  | "officeLevel"
  | "officeTitle"
  | "state"
  | "officeStatusAtOffense"
  | "convictionYear"
  | "offenseSummary"
>;

export async function updateSubmission(id: string, patch: Partial<SubmissionEdit>): Promise<void> {
  const items = await readAll();
  await writeAll(items.map((s) => (s.id === id ? { ...s, ...patch } : s)));
}

/** Map an approved submission into the published Case shape used by the site. */
function submissionToCase(s: Submission): Case {
  return {
    id: s.id,
    name: s.name,
    party: s.party,
    officeLevel: s.officeLevel,
    officeTitle: s.officeTitle,
    state: s.state,
    officeStatusAtOffense: s.officeStatusAtOffense ?? "in-office",
    status: "convicted",
    convictionYear: s.convictionYear,
    offenseSummary: s.offenseSummary,
    sources: [
      {
        title: "Party affiliation record",
        publisher: "Submitted source",
        url: s.partyProofUrl,
        type: "other-official",
      },
      ...s.convictionProofUrls.map((url, i) => ({
        title: `Conviction record ${i + 1}`,
        publisher: "Submitted source",
        url,
        type: "court-record" as const,
      })),
    ],
    lastReviewed: (s.reviewedAt ?? s.submittedAt).slice(0, 10),
    isPlaceholder: false,
  };
}

/** Seed (curated git file) + approved public submissions = what the site shows. */
export async function getPublishedCases(): Promise<Case[]> {
  const approved = (await listSubmissions("approved")).map(submissionToCase);
  return [...seedCases, ...approved];
}

export async function getPublishedCase(id: string): Promise<Case | undefined> {
  return (await getPublishedCases()).find((c) => c.id === id);
}

// ---------------------------------------------------------------------------
// Correction / dispute / removal requests
// ---------------------------------------------------------------------------
// Submitted by anyone via /submit. Emailed to the operator AND stored here, so
// a correction or removal request is never lost if an email fails to deliver.

export interface Correction {
  id: string;
  /** URL or name of the case the report is about (optional). */
  caseRef?: string;
  /** What is wrong / what should change. */
  problem: string;
  submitterEmail?: string;
  submittedAt: string; // ISO
  status: "open" | "resolved";
}

export type CorrectionInput = Omit<Correction, "id" | "submittedAt" | "status">;

export async function addCorrection(input: CorrectionInput): Promise<Correction> {
  const items = await readList<Correction>(CORRECTIONS_KEY, CORRECTIONS_FILE);
  const now = new Date();
  const correction: Correction = {
    ...input,
    id: `corr-${items.length + 1}-${now.getTime().toString(36)}`,
    submittedAt: now.toISOString(),
    status: "open",
  };
  items.push(correction);
  await writeList<Correction>(CORRECTIONS_KEY, CORRECTIONS_FILE, items);
  return correction;
}

export async function listCorrections(status?: Correction["status"]): Promise<Correction[]> {
  const items = await readList<Correction>(CORRECTIONS_KEY, CORRECTIONS_FILE);
  const filtered = status ? items.filter((c) => c.status === status) : items;
  return filtered.sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
}

export async function setCorrectionStatus(id: string, status: Correction["status"]): Promise<void> {
  const items = await readList<Correction>(CORRECTIONS_KEY, CORRECTIONS_FILE);
  await writeList<Correction>(
    CORRECTIONS_KEY,
    CORRECTIONS_FILE,
    items.map((c) => (c.id === id ? { ...c, status } : c)),
  );
}
