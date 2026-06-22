"use server";

import { checkBotId } from "botid/server";
import { addSubmission, addCorrection } from "@/lib/storage";
import { allowSubmission, allowCorrection } from "@/lib/ratelimit";
import { notifyNewSubmission, notifyCorrection } from "@/lib/notify";
import type { OfficeLevel, Party, OfficeStatus } from "@/data/cases";

export interface SubmitState {
  ok: boolean;
  error?: string;
  message?: string;
}

const PARTIES: Party[] = ["R", "D", "I", "Other"];
const LEVELS: OfficeLevel[] = ["federal", "state", "local"];
const OFFICE_STATUSES: OfficeStatus[] = ["in-office", "former", "candidate", "appointed-official"];

function isHttpUrl(v: string): boolean {
  try {
    const u = new URL(v);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export async function submitCase(
  _prev: SubmitState,
  formData: FormData,
): Promise<SubmitState> {
  // Honeypot: real users never fill this hidden field. Bots do.
  if ((formData.get("website") as string)?.trim()) {
    return { ok: true, message: "Thank you. Your submission has been received for review." };
  }

  // BotID: block automated/scripted submissions.
  const { isBot } = await checkBotId();
  if (isBot) {
    return fail("Your submission was blocked by bot protection. If you are a person, try again.");
  }

  // Rate limit: cap submissions per IP to stop floods.
  if (!(await allowSubmission())) {
    return fail("Too many submissions from your network. Please try again later.");
  }

  const name = (formData.get("name") as string)?.trim() ?? "";
  const party = formData.get("party") as Party;
  const officeLevel = formData.get("officeLevel") as OfficeLevel;
  const officeTitle = (formData.get("officeTitle") as string)?.trim() ?? "";
  const state = (formData.get("state") as string)?.trim().toUpperCase() ?? "";
  const officeStatusRaw = (formData.get("officeStatusAtOffense") as string)?.trim() ?? "";
  const officeStatusAtOffense: OfficeStatus = OFFICE_STATUSES.includes(
    officeStatusRaw as OfficeStatus,
  )
    ? (officeStatusRaw as OfficeStatus)
    : "in-office";
  const convictionYearRaw = (formData.get("convictionYear") as string)?.trim() ?? "";
  const offenseSummary = (formData.get("offenseSummary") as string)?.trim() ?? "";
  const partyProofUrl = (formData.get("partyProofUrl") as string)?.trim() ?? "";
  const convictionProofRaw = (formData.get("convictionProofUrls") as string)?.trim() ?? "";
  const submitterEmail = (formData.get("submitterEmail") as string)?.trim() || undefined;

  const convictionYear = Number.parseInt(convictionYearRaw, 10);

  // --- validation ---
  if (name.length < 3) return fail("Please enter the official's full name.");
  if (!PARTIES.includes(party)) return fail("Please choose a political party.");
  if (!LEVELS.includes(officeLevel)) return fail("Please choose the level of office.");
  if (officeTitle.length < 2) return fail("Please enter the office held (e.g. State Senator).");
  if (state.length < 2 || state.length > 4) return fail("Please enter a valid state abbreviation.");
  if (!Number.isFinite(convictionYear) || convictionYear < 1950 || convictionYear > 2100)
    return fail("Please enter a valid year of conviction.");
  if (offenseSummary.length < 10)
    return fail("Please describe the offense of conviction (the statute/charge).");
  if (!isHttpUrl(partyProofUrl))
    return fail("Please provide a valid link proving party affiliation (e.g. Ballotpedia).");

  const convictionProofUrls = convictionProofRaw
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (convictionProofUrls.length === 0)
    return fail("Please provide at least one link proving the conviction.");
  if (!convictionProofUrls.every(isHttpUrl))
    return fail("One of the conviction proof links is not a valid URL.");

  try {
    const submission = await addSubmission({
      name,
      party,
      officeLevel,
      officeTitle,
      state,
      officeStatusAtOffense,
      convictionYear,
      offenseSummary,
      partyProofUrl,
      convictionProofUrls,
      submitterEmail,
    });
    await notifyNewSubmission(submission);
  } catch {
    return fail("Something went wrong saving your submission. Please try again.");
  }

  return {
    ok: true,
    message:
      "Thank you. Your submission has been received and will not appear on the site until a human reviewer verifies the sources.",
  };
}

function fail(error: string): SubmitState {
  return { ok: false, error };
}

// ---------------------------------------------------------------------------
// Correction / dispute / removal requests
// ---------------------------------------------------------------------------

export interface CorrectionState {
  ok: boolean;
  error?: string;
  message?: string;
}

export async function submitCorrection(
  _prev: CorrectionState,
  formData: FormData,
): Promise<CorrectionState> {
  // Honeypot.
  if ((formData.get("website") as string)?.trim()) {
    return { ok: true, message: "Thank you. Your message has been received." };
  }

  const { isBot } = await checkBotId();
  if (isBot) {
    return { ok: false, error: "Blocked by bot protection. If you are a person, try again." };
  }

  if (!(await allowCorrection())) {
    return { ok: false, error: "Too many messages from your network. Please try again later." };
  }

  const caseRef = (formData.get("caseRef") as string)?.trim() || undefined;
  const problem = (formData.get("problem") as string)?.trim() ?? "";
  const submitterEmail = (formData.get("correctionEmail") as string)?.trim() || undefined;

  if (problem.length < 15) {
    return {
      ok: false,
      error: "Please describe the problem in a bit more detail (at least a sentence).",
    };
  }

  try {
    const correction = await addCorrection({ caseRef, problem, submitterEmail });
    await notifyCorrection(correction);
  } catch {
    return { ok: false, error: "Something went wrong sending your message. Please try again." };
  }

  return {
    ok: true,
    message:
      "Thank you. Your correction, dispute, or removal request has been sent for review. If you left an email, we may follow up.",
  };
}
