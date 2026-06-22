import Link from "next/link";
import { CaveatBanner } from "@/components/CaveatBanner";
import { BarChart } from "@/components/BarChart";
import { getPublishedCases } from "@/lib/storage";
import { countableCases, countByParty, countByLevelAndParty, LEVEL_LABEL } from "@/lib/stats";
import type { OfficeLevel, Party } from "@/data/cases";

export const dynamic = "force-dynamic";

const PARTY_ORDER: Party[] = ["R", "D", "I"];
const LEVELS: OfficeLevel[] = ["federal", "state", "local"];

export default async function Home() {
  const all = await getPublishedCases();
  const countable = countableCases(all);
  const byParty = countByParty(countable);
  const byLevel = countByLevelAndParty(countable);

  const placeholderCount = all.filter((c) => c.isPlaceholder).length;
  const verifiedCount = all.length - placeholderCount;

  const overallData = PARTY_ORDER.map((p) => ({ party: p, count: byParty[p] }));

  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Officials convicted of child sex crimes
        </h1>
        <p className="max-w-2xl text-slate-600">
          A curated, citation-required record of U.S. elected and appointed officials — local,
          state, and federal — who have been criminally <strong>convicted</strong> of child sex
          crimes. Every case links to a primary source. You can inspect each data point yourself.
        </p>

        {placeholderCount > 0 && (
          <div className="rounded-lg border border-slate-300 bg-slate-100 px-4 py-3 text-sm text-slate-700">
            <strong>Demo data notice:</strong> this site is currently showing {placeholderCount}{" "}
            clearly-labeled <em>fictional placeholder</em> entries and {verifiedCount} verified{" "}
            {verifiedCount === 1 ? "entry" : "entries"}. The placeholders exist to demonstrate the
            format and are not real people or cases.
          </div>
        )}
      </section>

      <CaveatBanner />

      <section className="grid gap-6 md:grid-cols-2">
        <BarChart
          title="Convictions in this list, by party"
          caption="Standing convictions only. Curated subset — not a total count."
          data={overallData}
        />
        <BarChart
          title="Which bar is bigger?"
          caption="Same data, framed as the head-to-head people ask about — with the caveat above."
          data={overallData.filter((d) => d.party === "R" || d.party === "D")}
        />
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Breakdown by level of office</h2>
          <p className="text-sm text-slate-500">
            Local, state, and federal differ enormously in number of officeholders and in how much
            coverage convictions receive — another reason raw bars across levels are not directly
            comparable.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {LEVELS.map((level) => (
            <BarChart
              key={level}
              title={LEVEL_LABEL[level]}
              data={PARTY_ORDER.map((p) => ({ party: p, count: byLevel[level][p] }))}
            />
          ))}
        </div>
      </section>

      <section className="flex flex-wrap gap-3">
        <Link
          href="/cases"
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          Inspect every case →
        </Link>
        <Link
          href="/submit"
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Submit a case
        </Link>
        <Link
          href="/methodology"
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          How this list is built
        </Link>
      </section>
    </div>
  );
}
