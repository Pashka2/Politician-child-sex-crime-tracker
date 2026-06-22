import { cases, type Case, type Party, type OfficeLevel, type OfficeStatus } from "@/data/cases";

export const PARTY_LABEL: Record<Party, string> = {
  R: "Republican",
  D: "Democrat",
  I: "Independent",
  Other: "Other",
};

export const PARTY_COLOR: Record<Party, string> = {
  R: "bg-red-600",
  D: "bg-blue-600",
  I: "bg-purple-600",
  Other: "bg-slate-500",
};

export const LEVEL_LABEL: Record<OfficeLevel, string> = {
  federal: "Federal",
  state: "State",
  local: "Local",
};

export const STATUS_LABEL: Record<Case["status"], string> = {
  convicted: "Convicted",
  overturned: "Conviction overturned",
  pardoned: "Convicted (later pardoned)",
};

export const OFFICE_STATUS_LABEL: Record<OfficeStatus, string> = {
  "in-office": "In office at the time of the offense",
  former: "Former / out of office at the time of the offense",
  candidate: "Candidate at the time of the offense",
  "appointed-official": "Appointed official at the time of the offense",
};

/**
 * Cases that count toward the headline comparison: standing convictions only.
 * Overturned convictions are intentionally excluded from the count (but still
 * listed on the site for transparency).
 */
export function countableCases(all: Case[] = cases): Case[] {
  return all.filter((c) => c.status === "convicted" || c.status === "pardoned");
}

export function countByParty(all: Case[] = countableCases()): Record<Party, number> {
  const out: Record<Party, number> = { R: 0, D: 0, I: 0, Other: 0 };
  for (const c of all) out[c.party] += 1;
  return out;
}

export function countByLevelAndParty(
  all: Case[] = countableCases(),
): Record<OfficeLevel, Record<Party, number>> {
  const empty = (): Record<Party, number> => ({ R: 0, D: 0, I: 0, Other: 0 });
  const out: Record<OfficeLevel, Record<Party, number>> = {
    federal: empty(),
    state: empty(),
    local: empty(),
  };
  for (const c of all) out[c.officeLevel][c.party] += 1;
  return out;
}

