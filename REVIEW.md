# Research & review workflow

How a lead becomes a published case. The goal is simple: **nothing goes live that
isn't a real, current conviction, correctly attributed, backed by a primary
source.** When in doubt, don't publish.

## 1. Where leads come from

- **Public submissions** — the `/submit` form. These are *tips*, not facts. Treat
  every one as unverified until you confirm it yourself.
- **Your own research** — news of a conviction, a DOJ/AG press release, a court
  record. Add it as a submission (or directly to `data/cases.ts`) once verified.

## 2. Verify every lead (the checklist)

Open each proof link and confirm, in order:

1. **It's a conviction** — guilty verdict, or a guilty/no-contest plea. *Not* an
   arrest, charge, indictment, or allegation. This is the line that keeps you out
   of a defamation suit.
2. **Right person, right office** — the convicted person is the official named
   (watch for name collisions), and the office + level (local/state/federal) are
   correct.
3. **Party is sourced** — the party-proof link (Ballotpedia, state registration,
   official bio) actually establishes their affiliation.
4. **Year = year of conviction** — the verdict or plea year. Not the arrest year,
   not the resignation year, not the sentencing year if it slipped to the next
   year. (This is the exact error caught on the very first real submissions.)
5. **It's a child sex crime** — the offense of conviction fits. Record the
   statute/charge, not your own wording.
6. **Still stands** — not overturned/vacated on appeal. If you can't tell, hold.

## 3. Sourcing standard — strongest to weakest

1. **Court records** (dockets, judgments, sentencing orders).
2. **Government statements** — DOJ / U.S. Attorney / state AG / DA press releases.
3. **Established reporting** — reputable outlets that explicitly describe a
   *conviction*. Prefer two independent outlets if no official source exists.

Avoid: forums, social media posts, partisan blogs, or anything that only reports
an *accusation* or *charge*. A dead link is not a source — find a live one or an
archived copy.

## 4. Publish

In `/admin`:

1. Read the checklist (collapsible at the top).
2. Open every proof link.
3. **Correct any field** to match the sources (this is where you fix a wrong year,
   tidy the office title, or restate the offense).
4. **Save & publish.** It appears on the charts and `/cases` immediately.
5. Reject anything you can't substantiate.

For hand-curated entries you research yourself, you can also add them directly to
`data/cases.ts` (committed via git, fully reviewable in a diff).

## 5. After publishing

- Watch the **Correction & removal requests** section in `/admin`.
- If a credible request says an entry is wrong or a conviction was overturned:
  **pull or correct the entry first, confirm second.** Mark overturned cases with
  the `overturned` status rather than deleting them.

## Worked example (first two real submissions)

- **Mel Reynolds (D, US Rep IL-2)** — convicted Aug 22, 1995 (12 counts incl.
  criminal sexual assault of a 16-year-old). Party, office, year all verified
  against reporting → publish as submitted.
- **Ray Holmberg (R, ND State Senator)** — real conviction (pleaded guilty Aug
  2024, sentenced 10 yrs March 2025, per DOJ). Party/office/offense verified, but
  the submission's year "2022" was the **resignation** year → corrected to **2024**
  before publishing.
