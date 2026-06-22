import type { Metadata } from "next";
import Link from "next/link";
import { SubmitForm } from "@/components/SubmitForm";
import { CorrectionForm } from "@/components/CorrectionForm";

export const metadata: Metadata = {
  title: "Submit a case — Convicted Officials Tracker",
};

export default function SubmitPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Submit a case</h1>
        <p className="text-sm text-slate-600">
          Know of an official convicted of a child sex crime who should be listed? Submit the
          details and your proof below.
        </p>
      </header>

      <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-900">
        <p className="font-semibold">Nothing you submit is published automatically.</p>
        <p className="mt-1">
          Every submission goes into a review queue. A human checks your proof links against the
          conviction and the party affiliation before anything appears on the site. Submissions we
          cannot verify are not published. Please only submit{" "}
          <strong>criminal convictions</strong> — not arrests, charges, or allegations. See the{" "}
          <Link href="/methodology" className="underline">
            methodology
          </Link>{" "}
          for what qualifies.
        </p>
      </div>

      <SubmitForm />

      <hr className="border-slate-200" />

      <section id="correction" className="scroll-mt-20 space-y-3">
        <header className="space-y-1">
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Report a correction, dispute, or removal
          </h2>
          <p className="text-sm text-slate-600">
            Think an entry is wrong — wrong person, a charge mistaken for a conviction, an overturned
            conviction, a bad source — or should be removed? Tell us here and it goes straight to a
            reviewer. We take accuracy seriously; entries we cannot substantiate are removed while
            under review rather than left up.
          </p>
        </header>
        <CorrectionForm />
      </section>
    </div>
  );
}
