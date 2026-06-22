import Link from "next/link";

/**
 * The single most important UI element on the site. Displayed prominently
 * anywhere counts/charts appear, so a reader can never see a number without
 * the limitation attached to it.
 */
export function CaveatBanner() {
  return (
    <aside
      role="note"
      className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-900"
    >
      <p className="font-semibold">Read this before reading the charts.</p>
      <p className="mt-1">
        Every case counted here is a verified criminal conviction backed by a cited source. But this
        is a <strong>curated list, not a complete count</strong> of every such conviction in the
        United States — no complete national dataset exists. Because the list isn&apos;t exhaustive,
        the totals shouldn&apos;t be read as a definitive comparison of one party versus the other.{" "}
        <Link href="/methodology" className="underline">
          See how this list is built and what it can and cannot tell you.
        </Link>
      </p>
    </aside>
  );
}
