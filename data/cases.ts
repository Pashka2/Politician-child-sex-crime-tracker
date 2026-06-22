// ---------------------------------------------------------------------------
// CURATED CASE DATA — SINGLE SOURCE OF TRUTH
// ---------------------------------------------------------------------------
// This file is the entire database. It is intentionally a plain, version-
// controlled TypeScript file so that EVERY change is reviewable in a git diff /
// pull request before it ever reaches the public site.
//
// HARD RULES (enforced by the schema + the review process, not by a scraper):
//   1. CONVICTIONS ONLY. An arrest, charge, indictment, or allegation is NOT a
//      conviction. Do not add it. Naming a living person as a convicted child
//      sex offender when they are not is defamation per se.
//   2. EVERY entry MUST have at least one primary source (court record, DOJ/AG
//      press release, or established news reporting that cites the conviction).
//      `sources` may not be empty.
//   3. Party and office must be recorded AS THEY WERE at the time of the
//      offense/conviction, with a source.
//   4. If a conviction is later vacated/overturned/pardoned, set `status`
//      accordingly — do not silently delete; the correction is part of the
//      record.
//
// The entries below are CLEARLY-LABELED FICTIONAL PLACEHOLDERS
// (`isPlaceholder: true`). They exist only to demonstrate the schema and the UI.
// They are NOT real people and NOT real cases. Real entries must be researched
// and verified against real sources before `isPlaceholder` is removed.
// ---------------------------------------------------------------------------

export type Party = "R" | "D" | "I" | "Other";

export type OfficeLevel = "federal" | "state" | "local";

/** What the person's relationship to the office was AT THE TIME OF THE OFFENSE. */
export type OfficeStatus = "in-office" | "former" | "candidate" | "appointed-official";

export type CaseStatus =
  | "convicted" // final conviction (trial or guilty/no-contest plea)
  | "overturned" // conviction vacated/reversed on appeal
  | "pardoned"; // convicted, later pardoned/commuted (conviction still stands as fact)

export type SourceType =
  | "court-record"
  | "doj-or-ag" // DOJ / state AG / prosecutor press release or filing
  | "news"
  | "other-official";

export interface Source {
  title: string;
  publisher: string;
  url: string;
  type: SourceType;
  /** ISO date the source was published, if known. */
  published?: string;
}

export interface Case {
  /** URL-safe stable identifier. */
  id: string;
  name: string;
  party: Party;
  officeLevel: OfficeLevel;
  /** e.g. "U.S. Representative", "State Senator", "School Board Member". */
  officeTitle: string;
  /** Two-letter state (or "US" for federal-at-large). */
  state: string;
  /** Whether they currently held office, or were a former/candidate, at offense time. */
  officeStatusAtOffense: OfficeStatus;
  status: CaseStatus;
  /** Year of conviction (kept coarse on purpose). */
  convictionYear: number;
  /**
   * Neutral, factual one-line summary of the offense of conviction. State the
   * statute/charge, not editorial characterization.
   */
  offenseSummary: string;
  sources: Source[];
  /** ISO date this entry was last human-reviewed. */
  lastReviewed: string;
  /**
   * TRUE for the demo/seed rows below. A real, verified entry sets this to
   * false (or omits it). The public site visibly flags placeholder rows.
   */
  isPlaceholder?: boolean;
}

// ---------------------------------------------------------------------------
// CURATED SEED CASES
// ---------------------------------------------------------------------------
// Verified, manually-curated cases live here (committed via git so every change
// is reviewable in a diff). Approved public submissions are added at runtime and
// merged with this list — see lib/storage.ts.
//
// Each entry MUST follow the HARD RULES at the top of this file: convictions
// only, at least one primary source, party/office recorded as of the offense,
// and overturned/pardoned outcomes marked rather than deleted.
//
// (Empty to start — populate with real verified cases.)
// ---------------------------------------------------------------------------

export const cases: Case[] = [];
