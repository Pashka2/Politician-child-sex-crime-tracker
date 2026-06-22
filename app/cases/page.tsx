import type { Metadata } from "next";
import { getPublishedCases } from "@/lib/storage";
import { CaseExplorer } from "@/components/CaseExplorer";
import { CaveatBanner } from "@/components/CaveatBanner";

export const metadata: Metadata = {
  title: "Browse cases — Convicted Officials Tracker",
};

export const dynamic = "force-dynamic";

export default async function CasesPage() {
  const all = await getPublishedCases();
  const sorted = [...all].sort((a, b) => b.convictionYear - a.convictionYear);

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Browse every case</h1>
        <p className="max-w-2xl text-sm text-slate-600">
          Each row is one documented case. Click any entry to see the office held, the offense of
          conviction, and the primary sources behind it. Filter by party, level of office, or
          search by name.
        </p>
      </header>

      <CaveatBanner />

      <CaseExplorer cases={sorted} />
    </div>
  );
}
