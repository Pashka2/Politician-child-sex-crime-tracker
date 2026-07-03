"use client";

import { useActionState } from "react";
import { submitCase, type SubmitState } from "@/app/submit/actions";

const initial: SubmitState = { ok: false };

const field = "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500";
const labelCls = "block text-sm font-medium text-slate-700";

export function SubmitForm() {
  const [state, action, pending] = useActionState(submitCase, initial);

  if (state.ok) {
    return (
      <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-6 text-emerald-900">
        <h2 className="text-lg font-semibold">Submission received</h2>
        <p className="mt-1 text-sm">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-5">
      {state.error && (
        <p className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800">
          {state.error}
        </p>
      )}

      {/* Honeypot — visually hidden; bots fill it, humans don't. */}
      <div aria-hidden className="absolute left-[-9999px]" tabIndex={-1}>
        <label>
          Website
          <input name="website" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="space-y-1.5">
        <label className={labelCls} htmlFor="name">
          Official&apos;s full name
        </label>
        <input id="name" name="name" required className={field} placeholder="Jane Q. Public" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className={labelCls} htmlFor="party">
            Political party
          </label>
          <select id="party" name="party" required defaultValue="" className={field}>
            <option value="" disabled>
              Choose…
            </option>
            <option value="R">Republican</option>
            <option value="D">Democrat</option>
            <option value="I">Independent</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label className={labelCls} htmlFor="officeLevel">
            Level of office
          </label>
          <select id="officeLevel" name="officeLevel" required defaultValue="" className={field}>
            <option value="" disabled>
              Choose…
            </option>
            <option value="federal">Federal</option>
            <option value="state">State</option>
            <option value="local">Local</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1.5 sm:col-span-2">
          <label className={labelCls} htmlFor="officeTitle">
            Office held
          </label>
          <input
            id="officeTitle"
            name="officeTitle"
            required
            className={field}
            placeholder="State Senator"
          />
        </div>
        <div className="space-y-1.5">
          <label className={labelCls} htmlFor="state">
            State
          </label>
          <input id="state" name="state" required maxLength={4} className={field} placeholder="CA" />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className={labelCls} htmlFor="officeStatusAtOffense">
          Their status at the time of the offense
        </label>
        <select
          id="officeStatusAtOffense"
          name="officeStatusAtOffense"
          defaultValue="in-office"
          className={field}
        >
          <option value="in-office">In office at the time</option>
          <option value="former">Former / out of office at the time</option>
          <option value="candidate">Candidate (not yet in office)</option>
          <option value="appointed-official">Appointed official at the time</option>
          <option value="before-office">Before they held office (private citizen)</option>
        </select>
        <p className="text-xs text-slate-500">
          When the offense happened — not when they were convicted.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className={labelCls} htmlFor="convictionYear">
            Year of conviction
          </label>
          <input
            id="convictionYear"
            name="convictionYear"
            type="number"
            min={1950}
            max={2100}
            required
            className={field}
            placeholder="2022"
          />
        </div>
        <div className="space-y-1.5">
          <label className={labelCls} htmlFor="submitterEmail">
            Your email <span className="font-normal text-slate-400">(optional, never published)</span>
          </label>
          <input
            id="submitterEmail"
            name="submitterEmail"
            type="email"
            className={field}
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className={labelCls} htmlFor="offenseSummary">
          Offense of conviction
        </label>
        <textarea
          id="offenseSummary"
          name="offenseSummary"
          required
          rows={2}
          className={field}
          placeholder="State the statute / charge of conviction — not a characterization."
        />
      </div>

      <div className="space-y-1.5">
        <label className={labelCls} htmlFor="partyProofUrl">
          Proof of party affiliation
        </label>
        <input
          id="partyProofUrl"
          name="partyProofUrl"
          type="url"
          required
          className={field}
          placeholder="https://ballotpedia.org/…"
        />
        <p className="text-xs text-slate-500">
          A link establishing the party — Ballotpedia, a state party registration record, or similar.
        </p>
      </div>

      <div className="space-y-1.5">
        <label className={labelCls} htmlFor="convictionProofUrls">
          Proof of conviction
        </label>
        <textarea
          id="convictionProofUrls"
          name="convictionProofUrls"
          required
          rows={3}
          className={field}
          placeholder="https://court-record-url… &#10;https://doj.gov/press-release…"
        />
        <p className="text-xs text-slate-500">
          One link per line. Court ruling, DOJ/AG press release, or established reporting that cites
          the conviction. <strong>Convictions only</strong> — not arrests, charges, or allegations.
        </p>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-60"
      >
        {pending ? "Submitting…" : "Submit for review"}
      </button>
    </form>
  );
}
