import "server-only";
import { Ratelimit } from "@upstash/ratelimit";
import { headers } from "next/headers";
import { getRedis } from "@/lib/storage";

// Allow a small burst, then throttle, per IP. Tune by editing the windows.
const limiters: Record<string, Ratelimit | null> = {};

function getLimiter(prefix: string, max: number, window: `${number} m`): Ratelimit | null {
  const redis = getRedis();
  if (!redis) return null; // no Redis (local dev) → rate limiting disabled
  limiters[prefix] ??= new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(max, window),
    prefix,
    analytics: false,
  });
  return limiters[prefix];
}

export async function clientIp(): Promise<string> {
  const h = await headers();
  const fwd = h.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return h.get("x-real-ip") ?? "anonymous";
}

async function withinLimit(lim: Ratelimit | null): Promise<boolean> {
  if (!lim) return true;
  const { success } = await lim.limit(await clientIp());
  return success;
}

/** Returns true if the request is within the rate limit (or limiting is off). */
export async function allowSubmission(): Promise<boolean> {
  return withinLimit(getLimiter("rl:submit", 5, "10 m"));
}

export async function allowCorrection(): Promise<boolean> {
  return withinLimit(getLimiter("rl:correction", 5, "10 m"));
}
