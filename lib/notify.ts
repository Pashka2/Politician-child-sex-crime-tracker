import "server-only";
import type { Submission, Correction } from "@/lib/storage";

function resendConfig() {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFY_EMAIL;
  if (!apiKey || !to) return null;
  const from = process.env.NOTIFY_FROM ?? "Tracker <onboarding@resend.dev>";
  return { apiKey, to, from };
}

async function sendEmail(subject: string, text: string): Promise<void> {
  const cfg = resendConfig();
  if (!cfg) return; // not configured — skip silently
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${cfg.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: cfg.from, to: cfg.to, subject, text }),
    });
  } catch {
    // Never let a notification failure break the user-facing flow.
  }
}

// Sends an email when a new submission arrives — but only if Resend is
// configured. Until you set RESEND_API_KEY (and NOTIFY_EMAIL), this is a no-op,
// so the app works fine without it. Uses Resend's REST API directly (no SDK).
//
// Env vars:
//   RESEND_API_KEY  — from https://resend.com (free tier)
//   NOTIFY_EMAIL    — where to send the alert (defaults to the from address)
//   NOTIFY_FROM     — verified sender; defaults to onboarding@resend.dev
//                     (Resend lets you send to your own account email with this)

function adminUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL
    ? `${process.env.NEXT_PUBLIC_SITE_URL}/admin`
    : "/admin";
}

export async function notifyNewSubmission(s: Submission): Promise<void> {
  const lines = [
    `New case submission awaiting review:`,
    ``,
    `Name: ${s.name}`,
    `Party: ${s.party}`,
    `Office: ${s.officeTitle} (${s.officeLevel}, ${s.state})`,
    `Conviction year: ${s.convictionYear}`,
    `Offense: ${s.offenseSummary}`,
    `Party proof: ${s.partyProofUrl}`,
    `Conviction proof: ${s.convictionProofUrls.join(", ")}`,
    s.submitterEmail ? `Submitter: ${s.submitterEmail}` : ``,
    ``,
    `Review it: ${adminUrl()}`,
  ].filter(Boolean);

  await sendEmail(`New submission for review: ${s.name}`, lines.join("\n"));
}

export async function notifyCorrection(c: Correction): Promise<void> {
  const lines = [
    `New correction / dispute / removal request:`,
    ``,
    c.caseRef ? `About: ${c.caseRef}` : `About: (not specified)`,
    ``,
    `Details:`,
    c.problem,
    ``,
    c.submitterEmail ? `Reply to: ${c.submitterEmail}` : `Reply to: (not provided)`,
    ``,
    `Manage it: ${adminUrl()}`,
  ].filter(Boolean);

  await sendEmail(`Correction/removal request received`, lines.join("\n"));
}
