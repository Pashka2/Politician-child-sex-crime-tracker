# Convicted Officials Tracker

A curated, **citation-required** record of U.S. elected and appointed officials (local, state,
federal) criminally **convicted** of child sex crimes, with party-level bar charts and an
inspectable case database. Built with Next.js (App Router) + Tailwind, deployable on Vercel.

## The non-negotiable rules

This project deliberately does **not** auto-scrape-and-publish names. Wrongly labeling a living
person a convicted child sex offender is defamation per se. Every entry must:

1. Be a real criminal **conviction** — never an arrest, charge, indictment, or allegation.
2. Carry at least one **primary source** (court record, prosecutor/DOJ/AG document, or established
   reporting). `sources` may not be empty.
3. Record office + party **as they were at the time of the offense/conviction**.
4. Mark overturned/vacated/pardoned outcomes instead of being silently deleted.

The charts are framed as a **curated subset, not a complete census**, with prominent caveats —
because no complete, unbiased national dataset of these convictions exists.

## Data model

The entire dataset is one version-controlled file: [`data/cases.ts`](data/cases.ts). Every change
is reviewable as a git diff before it reaches the site. It currently ships with **clearly-labeled
fictional placeholder entries** (`isPlaceholder: true`) to demonstrate the format — these are not
real people. Replace them with verified cases (and remove the placeholder flag) through a review
process.

## Public submissions + review queue

Anyone can submit a case at `/submit` (name, party + proof link, conviction proof links). **Nothing
is published automatically** — submissions land in a private queue at `/admin`, where a reviewer
opens each proof link and either approves (it becomes a published case and the charts update) or
rejects it.

- **Storage:** [`lib/storage.ts`](lib/storage.ts) uses **Upstash Redis** when its env vars are
  present, and a local `.data/` JSON file otherwise. The local file does **not** persist on Vercel,
  so connect Upstash (Vercel Marketplace → Upstash) before going live. The admin queue shows a
  warning until a real store is connected.
- **Admin auth:** a single `ADMIN_PASSWORD` env var gates `/admin` (httpOnly session cookie). Minimal
  by design — see `lib/auth.ts`. Harden (real accounts, BotID) before scale.
- **Published list** = the curated seed in `data/cases.ts` **+** approved submissions.

### Required environment variables

See [`.env.example`](.env.example). Set `ADMIN_PASSWORD` and the Upstash vars locally in
`.env.local` and in your Vercel project settings.

## Project structure

- `data/cases.ts` — the curated seed database + schema and rules.
- `lib/storage.ts` — submission store + published-cases assembly (seed + approved).
- `lib/auth.ts` — admin password gate.
- `lib/stats.ts` — aggregation helpers (counts by party / office level).
- `components/` — `BarChart`, `CaveatBanner`, `CaseExplorer`, `SubmitForm`, `AdminLogin`.
- `app/` — `/` charts, `/cases` browse, `/cases/[id]` detail, `/submit` form, `/admin` queue, `/methodology`.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (also typechecks)
```

## Deploy

```bash
npx vercel        # preview
npx vercel --prod # production
```

## Before going live with real data

Have a lawyer review the sourcing standard, the corrections/removal workflow, and handling of name
collisions and sealed/expunged records. Update the placeholder corrections email in
`app/methodology/page.tsx`. See that page for the full methodology.
