import { PARTY_COLOR, PARTY_LABEL } from "@/lib/stats";
import type { Party } from "@/data/cases";

interface BarDatum {
  party: Party;
  count: number;
}

/**
 * Accessible, dependency-free horizontal bar chart. Server-rendered. Each bar
 * is also stated as plain text so the number is never conveyed by length alone.
 */
export function BarChart({
  title,
  data,
  caption,
}: {
  title: string;
  data: BarDatum[];
  caption?: string;
}) {
  const max = Math.max(1, ...data.map((d) => d.count));

  return (
    <figure className="rounded-xl border border-slate-200 bg-white p-5">
      <figcaption className="mb-4">
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
        {caption ? <p className="mt-0.5 text-xs text-slate-500">{caption}</p> : null}
      </figcaption>
      <ul className="space-y-3">
        {data.map((d) => {
          const pct = (d.count / max) * 100;
          return (
            <li key={d.party}>
              <div className="mb-1 flex items-baseline justify-between text-sm">
                <span className="font-medium text-slate-700">{PARTY_LABEL[d.party]}</span>
                <span className="tabular-nums text-slate-900">
                  {d.count} {d.count === 1 ? "case" : "cases"}
                </span>
              </div>
              <div
                className="h-6 w-full overflow-hidden rounded bg-slate-100"
                role="img"
                aria-label={`${PARTY_LABEL[d.party]}: ${d.count} cases`}
              >
                <div
                  className={`h-full ${PARTY_COLOR[d.party]} transition-all`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </figure>
  );
}
