import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Methodology & corrections — Convicted Officials Tracker",
};

export default function MethodologyPage() {
  return (
    <div className="prose-slate max-w-2xl space-y-8 text-slate-700">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Methodology &amp; corrections
        </h1>
        <p className="text-sm text-slate-500">
          What this list is, what it is not, and how to challenge anything on it.
        </p>
      </header>

      <Section title="What counts as an entry">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Criminal convictions only.</strong> An arrest, charge, indictment, lawsuit, or
            allegation is <strong>not</strong> a conviction and is never listed. A conviction means
            a guilty verdict, a guilty plea, or a no-contest plea entered as a conviction.
          </li>
          <li>
            <strong>The person held or sought public office.</strong> Elected or appointed, at the
            local, state, or federal level. We record the office and party as they were at the time
            of the offense or conviction.
          </li>
          <li>
            <strong>The offense is a child sex crime</strong> as defined by the statute of
            conviction. We state the statute/charge rather than our own characterization.
          </li>
          <li>
            <strong>At least one primary source is required.</strong> No entry exists without a
            court record, a prosecutor/DOJ/AG document, or established reporting that cites the
            conviction. Entries with empty sources are not published.
          </li>
        </ul>
      </Section>

      <Section title="How entries are added">
        <p>
          The curated base list is a single, version-controlled file. Nothing is auto-scraped and
          auto-published. A scraper or news alert may surface a <em>candidate</em> for review, but a
          human must verify the conviction against primary sources and record the citation before it
          appears here. Every change is reviewable as a diff.
        </p>
      </Section>

      <Section title="Public submissions">
        <p>
          Anyone can <a className="underline" href="/submit">submit a case</a>. A submission asks for
          the official&apos;s name, party (with a link proving affiliation — e.g. Ballotpedia or a
          state party registration record), and one or more links proving the conviction (a court
          ruling, a prosecutor/DOJ/AG document, or established reporting).
        </p>
        <p className="rounded-lg border border-slate-300 bg-slate-100 px-4 py-3">
          <strong>A submission is not a publication.</strong> Everything sent through the form enters
          a private review queue. A human reviewer opens each proof link and confirms (a) the person
          held the stated office, (b) the party affiliation, and (c) that there is an actual{" "}
          <em>conviction</em> — not a charge or allegation. Only after that manual check is a case
          approved and added to the public list and the charts. Submissions that can&apos;t be
          verified are rejected and never appear.
        </p>
      </Section>

      <Section title="What the charts can and cannot tell you">
        <p className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-amber-900">
          Every case counted is a verified criminal conviction with a cited source. But these bars
          are <strong>not</strong> a complete census of every such conviction in the country, and
          they are not adjusted for the different numbers of officeholders, candidates, or news
          coverage each party has. Because the list is curated and not exhaustive, the totals should
          not be cited as a definitive comparison between parties.
        </p>
        <p>
          There is no single national database of these convictions. Records live across thousands of
          county, state, and federal court systems; party affiliation is not part of a court record
          and must be matched separately. A genuinely complete and unbiased count is not achievable
          from public data, which is exactly why we foreground these limits.
        </p>
      </Section>

      <Section title="Overturned, vacated, and pardoned convictions">
        <p>
          If a conviction is reversed or vacated on appeal, we mark it as overturned and exclude it
          from the headline counts — but we keep the record visible, because the correction is part
          of the public history. A pardon or commutation does not erase the fact of the conviction,
          so pardoned cases remain, clearly labeled.
        </p>
      </Section>

      <Section title="Corrections, disputes, and removal requests">
        <p>
          We take accuracy seriously: wrongly labeling someone is a serious harm. If you believe an
          entry is inaccurate, misidentifies a person, conflates a charge with a conviction, relies
          on a dead or misread source, or should be updated because a conviction was overturned, use
          the correction form:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            Go to the{" "}
            <a className="underline" href="/submit#correction">
              correction, dispute &amp; removal form
            </a>{" "}
            (at the bottom of the Submit a case page) and describe the specific problem.
          </li>
          <li>
            Include links to supporting documents (court records, appellate rulings) where possible.
          </li>
          <li>
            Disputed entries are reviewed promptly; entries we cannot substantiate are removed while
            under review rather than left up.
          </li>
        </ul>
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
