"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Case, OfficeLevel, Party } from "@/data/cases";
import { PARTY_LABEL, LEVEL_LABEL, STATUS_LABEL } from "@/lib/stats";

const PARTY_BADGE: Record<Party, string> = {
  R: "bg-red-100 text-red-800 ring-red-200",
  D: "bg-blue-100 text-blue-800 ring-blue-200",
  I: "bg-purple-100 text-purple-800 ring-purple-200",
  Other: "bg-slate-100 text-slate-700 ring-slate-200",
};

type PartyFilter = Party | "all";
type LevelFilter = OfficeLevel | "all";

export function CaseExplorer({ cases }: { cases: Case[] }) {
  const [query, setQuery] = useState("");
  const [party, setParty] = useState<PartyFilter>("all");
  const [level, setLevel] = useState<LevelFilter>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return cases.filter((c) => {
      if (party !== "all" && c.party !== party) return false;
      if (level !== "all" && c.officeLevel !== level) return false;
      if (q) {
        const hay = `${c.name} ${c.officeTitle} ${c.state} ${c.offenseSummary}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [cases, query, party, level]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search name, office, state…"
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500 sm:max-w-xs"
        />
        <select
          value={party}
          onChange={(e) => setParty(e.target.value as PartyFilter)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
        >
          <option value="all">All parties</option>
          <option value="R">Republican</option>
          <option value="D">Democrat</option>
          <option value="I">Independent</option>
          <option value="Other">Other</option>
        </select>
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value as LevelFilter)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
        >
          <option value="all">All levels</option>
          <option value="federal">Federal</option>
          <option value="state">State</option>
          <option value="local">Local</option>
        </select>
      </div>

      <p className="text-sm text-slate-500">
        Showing {filtered.length} of {cases.length} {cases.length === 1 ? "case" : "cases"}.
      </p>

      <ul className="divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200 bg-white">
        {filtered.map((c) => (
          <li key={c.id}>
            <Link
              href={`/cases/${c.id}`}
              className="flex flex-col gap-1 px-4 py-3 hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-slate-900">{c.name}</span>
                  <span
                    className={`rounded px-1.5 py-0.5 text-xs font-medium ring-1 ${PARTY_BADGE[c.party]}`}
                  >
                    {PARTY_LABEL[c.party]}
                  </span>
                  {c.isPlaceholder && (
                    <span className="rounded bg-slate-200 px-1.5 py-0.5 text-xs text-slate-600">
                      placeholder
                    </span>
                  )}
                  {c.status !== "convicted" && (
                    <span className="rounded bg-amber-100 px-1.5 py-0.5 text-xs text-amber-800">
                      {STATUS_LABEL[c.status]}
                    </span>
                  )}
                </div>
                <p className="truncate text-sm text-slate-500">
                  {c.officeTitle} · {c.state} · {LEVEL_LABEL[c.officeLevel]}
                </p>
              </div>
              <span className="shrink-0 text-sm tabular-nums text-slate-400">
                {c.convictionYear}
              </span>
            </Link>
          </li>
        ))}
        {filtered.length === 0 && (
          <li className="px-4 py-8 text-center text-sm text-slate-500">
            No cases match those filters.
          </li>
        )}
      </ul>
    </div>
  );
}
