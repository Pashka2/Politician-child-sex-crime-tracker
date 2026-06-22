"use client";

import { useActionState } from "react";
import { submitCorrection, type CorrectionState } from "@/app/submit/actions";

const initial: CorrectionState = { ok: false };

const field =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500";
const labelCls = "block text-sm font-medium text-slate-700";

export function CorrectionForm() {
  const [state, action, pending] = useActionState(submitCorrection, initial);

  if (state.ok) {
    return (
      <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-6 text-emerald-900">
        <h3 className="text-base font-semibold">Message received</h3>
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

      {/* Honeypot */}
      <div aria-hidden className="absolute left-[-9999px]" tabIndex={-1}>
        <label>
          Website
          <input name="website" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="space-y-1.5">
        <label className={labelCls} htmlFor="caseRef">
          Which case is this about?{" "}
          <span className="font-normal text-slate-400">(link or name — optional)</span>
        </label>
        <input
          id="caseRef"
          name="caseRef"
          className={field}
          placeholder="Paste the case URL, or type the person's name"
        />
      </div>

      <div className="space-y-1.5">
        <label className={labelCls} htmlFor="problem">
          What needs to be corrected, disputed, or removed?
        </label>
        <textarea
          id="problem"
          name="problem"
          required
          rows={4}
          className={field}
          placeholder="Describe the problem — e.g. wrong person, this was a charge not a conviction, the conviction was overturned, the source is wrong or dead, etc. Include links to supporting documents if you have them."
        />
      </div>

      <div className="space-y-1.5">
        <label className={labelCls} htmlFor="correctionEmail">
          Your email{" "}
          <span className="font-normal text-slate-400">(optional, so we can follow up)</span>
        </label>
        <input
          id="correctionEmail"
          name="correctionEmail"
          type="email"
          className={field}
          placeholder="you@example.com"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
      >
        {pending ? "Sending…" : "Submit a correction / removal / dispute"}
      </button>
    </form>
  );
}
