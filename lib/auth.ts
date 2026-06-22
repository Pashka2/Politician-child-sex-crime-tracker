import "server-only";
import { cookies } from "next/headers";
import crypto from "node:crypto";

const COOKIE = "admin_session";

function expectedToken(): string | null {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return null;
  return crypto.createHash("sha256").update(`${pw}::convicted-officials-admin`).digest("hex");
}

export function adminPasswordConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD);
}

export async function isAdmin(): Promise<boolean> {
  const tok = expectedToken();
  if (!tok) return false;
  const store = await cookies();
  return store.get(COOKIE)?.value === tok;
}

/** Returns true on success. Only callable from a server action / route handler. */
export async function login(password: string): Promise<boolean> {
  const tok = expectedToken();
  if (!tok || password !== process.env.ADMIN_PASSWORD) return false;
  const store = await cookies();
  store.set(COOKIE, tok, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 8, // 8 hours
  });
  return true;
}

export async function logout(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE);
}
