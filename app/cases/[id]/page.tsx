import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublishedCase } from "@/lib/storage";
import { PARTY_LABEL, LEVEL_LABEL, STATUS_LABEL, OFFICE_STATUS_LABEL } from "@/lib/stats";
import type { SourceType } from "@/data/cases";

export const dynamic = "force-dynamic";

const SOURCE_TYPE_LABEL: Record<SourceType, string> = {
  "court-record": "Court record",
  "doj-or-ag": "Prosecutor / DOJ / AG",
  news: "News report",
  "other-official": "Other official record",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const c = await getPublishedCase(id);
  return { title: c ? `${c.name} — Case record` : "Case not found" };
}

export default async function CaseDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const c = await getPublishedCase(id);
  if (!c) notFound();

  return (
    <article className="space-y-8">
      <Link href="/cases" className="text-sm text-slate-500 hover:text-slate-800">
        ← Back to all cases
      </Link>

      {c.isPlaceholder && (
        <div className="rounded-lg border border-slate-300 bg-slate-100 px-4 py-3 text-sm text-slate-700">
          <strong>Fictional placeholder.</strong> This is not a real person or case. It exists only
          to demonstrate the record format.
        </div>
      )}

      <header className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">{c.name}</h1>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="rounded bg-slate-200 px-2 py-0.5 font-medium text-slate-700">
            {PARTY_LABEL[c.party]}
          </span>
          <span className="text-slate-500">
            {c.officeTitle} · {c.state} · {LEVEL_LABEL[c.officeLevel]}
          </span>
        </div>
      </header>

      <dl className="grid gap-x-8 gap-y-4 rounded-xl border border-slate-200 bg-white p-5 sm:grid-cols-2">
        <Field label="Status">{STATUS_LABEL[c.status]}</Field>
        <Field label="Year of conviction">{c.convictionYear}</Field>
        <Field label="Office at time of offense">
          {OFFICE_STATUS_LABEL[c.officeStatusAtOffense]}
        </Field>
        <Field label="Last reviewed">{c.lastReviewed}</Field>
        <div className="sm:col-span-2">
          <Field label="Offense of conviction">{c.offenseSummary}</Field>
        </div>
      </dl>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">Sources</h2>
        <p className="text-sm text-slate-500">
          Every claim on this page should be checkable against the sources below. If a source is
          dead, wrong, or does not support the entry, please report it via the{" "}
          <Link href="/methodology" className="underline">
            corrections process
          </Link>
          .
        </p>
        <ul className="space-y-3">
          {c.sources.map((s, i) => (
            <li
              key={i}
              className="rounded-lg border border-slate-200 bg-white p-4 text-sm"
            >
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <span className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-medium text-slate-600">
                  {SOURCE_TYPE_LABEL[s.type]}
                </span>
                {s.published && <span className="text-xs text-slate-400">{s.published}</span>}
              </div>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-slate-900 underline underline-offset-2 hover:text-slate-600"
              >
                {s.title}
              </a>
              <p className="text-slate-500">{s.publisher}</p>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</dt>
      <dd className="mt-0.5 text-slate-800">{children}</dd>
    </div>
  );
}
