import { headers } from "next/headers";

/**
 * Normalizes the client IP from a header getter.
 * Prefers the first value of x-forwarded-for (Vercel sets this safely),
 * falls back to x-real-ip, otherwise returns "unknown".
 */
function getIpFromHeaderGetter(
  get: (key: string) => string | null
): string {
  const forwarded = get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const real = get("x-real-ip");
  if (real) return real;
  return "unknown";
}

/**
 * For Route Handlers / Server Components: reads from `next/headers`.
 */
export async function getClientIp(): Promise<string> {
  const h = await headers();
  return getIpFromHeaderGetter((k) => h.get(k));
}

/**
 * For NextAuth's `authorize(request)` and any other place with a raw
 * Request object (no AsyncLocalStorage context).
 */
export function extractIpFromRequest(request: Request): string {
  return getIpFromHeaderGetter((k) => request.headers.get(k));
}