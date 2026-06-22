import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About — Convicted Officials Tracker",
};

export default function AboutPage() {
  return (
    <div className="max-w-2xl space-y-8 text-slate-700">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">About this project</h1>
        <p className="text-sm text-slate-500">Who runs it, why it exists, and what it stands for.</p>
      </header>

      <Section title="What this is">
        <p>
          The Convicted Officials Tracker is a public, source-backed record of U.S. elected and
          appointed officials — local, state, and federal — who have been criminally{" "}
          <strong>convicted</strong> of child sex crimes. Every entry links to a primary source so
          you can check it yourself. The aim is simple: accurate, verifiable accountability.
        </p>
      </Section>

      <Section title="Who runs it">
        <p>
          This project is run by Pasha, an independent developer. It is not affiliated with any
          political party, campaign, candidate, government agency, or news organization, and it
          accepts no funding from any of them. It is built and maintained independently, and any{" "}
          <a className="underline" href="https://buymeacoffee.com/pashka2" target="_blank" rel="noopener noreferrer">
            reader support
          </a>{" "}
          goes toward keeping it online and funding the research that keeps it accurate.
        </p>
      </Section>

      <Section title="Non-partisan by design">
        <p>
          This is not a tool for attacking one side. It includes convictions regardless of party,
          and the charts come with a standing caveat that they are a curated list — not a complete
          census — so they should not be read as a definitive comparison between parties. The value
          here is in the individual, verified records, not in a partisan scoreboard.
        </p>
      </Section>

      <Section title="The standards we hold">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Convictions only.</strong> Never arrests, charges, or allegations.
          </li>
          <li>
            <strong>Every entry is sourced.</strong> Nothing is published without a court record,
            an official document, or established reporting that cites the conviction.
          </li>
          <li>
            <strong>Human-verified.</strong> Nothing is auto-published. A person checks every
            submission against its sources before it appears.
          </li>
          <li>
            <strong>Corrected openly.</strong> Overturned convictions are marked, and entries we
            cannot substantiate are removed while under review rather than left up.
          </li>
        </ul>
        <p>
          The full details are on the{" "}
          <Link className="underline" href="/methodology">
            methodology &amp; corrections
          </Link>{" "}
          page.
        </p>
      </Section>

      <Section title="How you can help">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <Link className="underline" href="/submit">
              Submit a case
            </Link>{" "}
            you can document with sources.
          </li>
          <li>
            <Link className="underline" href="/submit#correction">
              Report a correction, dispute, or removal
            </Link>{" "}
            if you believe something here is wrong.
          </li>
          <li>
            <a className="underline" href="https://buymeacoffee.com/pashka2" target="_blank" rel="noopener noreferrer">
              Support the project
            </a>{" "}
            to help cover hosting and a proper domain.
          </li>
        </ul>
      </Section>

      <Section title="Contact">
        <p>
          The best way to reach the project is through the on-site forms: use{" "}
          <Link className="underline" href="/submit">
            Submit a case
          </Link>{" "}
          to add an entry, or the{" "}
          <Link className="underline" href="/submit#correction">
            correction / removal form
          </Link>{" "}
          for anything that needs fixing. Both go straight to the person who maintains the list.
        </p>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      {children}
    </section>
  );
}
