import type { Metadata } from "next";
import { isAdmin, adminPasswordConfigured } from "@/lib/auth";
import {
  listSubmissions,
  listCorrections,
  hasPersistentStore,
  type Submission,
  type Correction,
} from "@/lib/storage";
import { AdminLogin } from "@/components/AdminLogin";
import {
  approveAction,
  saveAction,
  rejectAction,
  resolveCorrectionAction,
  logoutAction,
} from "./actions";

export const metadata: Metadata = {
  title: "Review queue — Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!adminPasswordConfigured()) {
    return (
      <Wrapper>
        <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          <p className="font-semibold">Admin is not configured yet.</p>
          <p className="mt-1">
            Set an <code className="font-mono">ADMIN_PASSWORD</code> environment variable (locally in{" "}
            <code className="font-mono">.env.local</code>, and in your Vercel project settings) to
            enable the review queue.
          </p>
        </div>
      </Wrapper>
    );
  }

  if (!(await isAdmin())) {
    return (
      <Wrapper>
        <p className="mb-4 text-sm text-slate-600">Sign in to review submissions.</p>
        <AdminLogin />
      </Wrapper>
    );
  }

  const pending = await listSubmissions("pending");
  const corrections = await listCorrections("open");

  return (
    <Wrapper>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-slate-600">
          {pending.length} {pending.length === 1 ? "submission" : "submissions"} awaiting review
          {corrections.length > 0 && ` · ${corrections.length} open correction request${corrections.length === 1 ? "" : "s"}`}
          .
        </p>
        <form action={logoutAction}>
          <button className="text-sm text-slate-500 hover:text-slate-800">Sign out</button>
        </form>
      </div>

      {!hasPersistentStore() && (
        <div className="mb-6 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          <strong>No persistent database connected.</strong> Submissions are being stored in a local
          file that will not persist on Vercel. Connect Upstash Redis from the Vercel Marketplace and
          set its env vars before going live.
        </div>
      )}

      <details className="mb-6 rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-700">
        <summary className="cursor-pointer font-medium text-slate-900">
          Reviewer checklist — open each proof link and confirm before publishing
        </summary>
        <ol className="mt-3 list-decimal space-y-1.5 pl-5">
          <li>
            <strong>It&apos;s a conviction</strong> — the source shows a guilty verdict or guilty/
            no-contest plea, not an arrest, charge, indictment, or allegation.
          </li>
          <li>
            <strong>Right person, right office</strong> — the convicted individual is the official
            named, and the office/level is correct.
          </li>
          <li>
            <strong>Party is sourced</strong> — the party-proof link actually establishes their
            affiliation at the time.
          </li>
          <li>
            <strong>Year matches the conviction</strong> — use the year of the verdict/plea, not the
            year of the arrest, resignation, or sentencing.
          </li>
          <li>
            <strong>It&apos;s a child sex crime</strong> — the offense of conviction fits, stated as
            the statute/charge rather than your own characterization.
          </li>
          <li>
            <strong>Not overturned</strong> — the conviction still stands (no later reversal on
            appeal). If unsure, don&apos;t publish.
          </li>
          <li>
            <strong>Fix anything off, then publish.</strong> Edit the fields above to match the
            sources before clicking Save &amp; publish.
          </li>
        </ol>
      </details>

      <h2 className="mb-3 text-lg font-semibold text-slate-900">Submissions</h2>
      {pending.length === 0 ? (
        <p className="text-sm text-slate-500">Nothing in the submission queue right now.</p>
      ) : (
        <ul className="space-y-5">
          {pending.map((s) => (
            <SubmissionCard key={s.id} s={s} />
          ))}
        </ul>
      )}

      <h2 className="mb-3 mt-10 text-lg font-semibold text-slate-900">
        Correction &amp; removal requests
      </h2>
      {corrections.length === 0 ? (
        <p className="text-sm text-slate-500">No open correction requests.</p>
      ) : (
        <ul className="space-y-4">
          {corrections.map((c) => (
            <CorrectionCard key={c.id} c={c} />
          ))}
        </ul>
      )}
    </Wrapper>
  );
}

function CorrectionCard({ c }: { c: Correction }) {
  return (
    <li className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
        <span className="text-sm font-medium text-slate-700">
          {c.caseRef ? `About: ${c.caseRef}` : "About: (not specified)"}
        </span>
        <span className="text-xs text-slate-400">received {c.submittedAt.slice(0, 10)}</span>
      </div>
      <p className="mb-3 whitespace-pre-wrap text-sm text-slate-800">{c.problem}</p>
      {c.submitterEmail && (
        <p className="mb-3 text-sm text-slate-500">
          Reply to:{" "}
          <a href={`mailto:${c.submitterEmail}`} className="text-blue-700 underline">
            {c.submitterEmail}
          </a>
        </p>
      )}
      <form action={resolveCorrectionAction}>
        <input type="hidden" name="id" value={c.id} />
        <button className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
          Mark resolved
        </button>
      </form>
    </li>
  );
}

const inputCls =
  "w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm outline-none focus:border-slate-500";

function SubmissionCard({ s }: { s: Submission }) {
  return (
    <li className="rounded-xl border border-slate-200 bg-white p-5">
      <form>
        <input type="hidden" name="id" value={s.id} />

        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
          <p className="text-xs text-slate-400">Correct any field below before publishing.</p>
          <span className="text-xs text-slate-400">submitted {s.submittedAt.slice(0, 10)}</span>
        </div>

        <div className="mb-4 grid gap-3 sm:grid-cols-2">
          <Field label="Name">
            <input name="name" defaultValue={s.name} className={inputCls} />
          </Field>
          <Field label="Party">
            <select name="party" defaultValue={s.party} className={inputCls}>
              <option value="R">Republican</option>
              <option value="D">Democrat</option>
              <option value="I">Independent</option>
              <option value="Other">Other</option>
            </select>
          </Field>
          <Field label="Office title">
            <input name="officeTitle" defaultValue={s.officeTitle} className={inputCls} />
          </Field>
          <Field label="Level">
            <select name="officeLevel" defaultValue={s.officeLevel} className={inputCls}>
              <option value="federal">Federal</option>
              <option value="state">State</option>
              <option value="local">Local</option>
            </select>
          </Field>
          <Field label="State">
            <input name="state" defaultValue={s.state} maxLength={4} className={inputCls} />
          </Field>
          <Field label="Status at time of offense">
            <select
              name="officeStatusAtOffense"
              defaultValue={s.officeStatusAtOffense ?? "in-office"}
              className={inputCls}
            >
              <option value="in-office">In office</option>
              <option value="former">Former / out of office</option>
              <option value="candidate">Candidate</option>
              <option value="appointed-official">Appointed official</option>
            </select>
          </Field>
          <Field label="Conviction year">
            <input
              name="convictionYear"
              type="number"
              defaultValue={s.convictionYear}
              className={inputCls}
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Offense">
              <textarea
                name="offenseSummary"
                defaultValue={s.offenseSummary}
                rows={2}
                className={inputCls}
              />
            </Field>
          </div>
        </div>

        {s.submitterEmail && (
          <p className="mb-3 text-xs text-slate-500">Submitter: {s.submitterEmail}</p>
        )}

        <div className="mb-4 space-y-2 rounded-lg bg-slate-50 p-3 text-sm">
          <p className="font-medium text-slate-700">Verify these against the fields above:</p>
          <p>
            <span className="text-slate-500">Party proof: </span>
            <ProofLink url={s.partyProofUrl} />
          </p>
          <div>
            <span className="text-slate-500">Conviction proof:</span>
            <ul className="ml-4 list-disc">
              {s.convictionProofUrls.map((u, i) => (
                <li key={i}>
                  <ProofLink url={u} />
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            formAction={approveAction}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
          >
            Save &amp; publish
          </button>
          <button
            formAction={saveAction}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Save changes
          </button>
          <button
            formAction={rejectAction}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Reject
          </button>
        </div>
      </form>
    </li>
  );
}

function ProofLink({ url }: { url: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="break-all text-blue-700 underline underline-offset-2 hover:text-blue-900"
    >
      {url}
    </a>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </span>
      {children}
    </label>
  );
}

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-3xl space-y-2">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">Submission review queue</h1>
      <div className="pt-4">{children}</div>
    </div>
  );
}
