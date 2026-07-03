import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Convicted Officials Tracker — Methodology-First",
  description:
    "A curated, citation-required record of U.S. elected and appointed officials convicted of child sex crimes. This is a curated list, not a complete census.",
};

const navLinks = [
  { href: "/", label: "Overview" },
  { href: "/cases", label: "Browse cases" },
  { href: "/submit", label: "Submit a case" },
  { href: "/methodology", label: "Methodology" },
  { href: "/about", label: "About" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <header className="border-b border-slate-200 bg-white">
          <nav className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-4">
            <Link href="/" className="font-semibold tracking-tight text-slate-900">
              Convicted Officials Tracker
            </Link>
            <ul className="flex items-center gap-5 text-sm text-slate-600">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-slate-900">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </header>

        <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-8">{children}</main>

        <footer className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-5xl px-5 py-6 text-xs leading-relaxed text-slate-500">
            <p className="mb-2 font-medium text-slate-700">
              This is a curated list, not a complete count of all convictions.
            </p>
            <p>
              Entries are limited to documented criminal convictions and require a primary source.
              Party totals reflect only the cases that have been researched and added here, so they
              must not be read as a definitive comparison between parties. See the{" "}
              <Link href="/methodology" className="underline hover:text-slate-700">
                methodology &amp; corrections
              </Link>{" "}
              page. To report an error or request a correction/removal, use the contact process on
              that page.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
