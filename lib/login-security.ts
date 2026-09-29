import { prisma } from "@/lib/prisma";

// ─── Configuration ───
const WINDOW_MINUTES = 15;
const MAX_FAILED_PER_EMAIL = 5;
const MAX_FAILED_PER_IP = 20;

const WINDOW_MS = WINDOW_MINUTES * 60 * 1000;

// ─── Types ───
export type RateLimitResult =
  | { allowed: true }
  | { allowed: false; reason: "email" | "ip"; minutesRemaining: number };

/**
 * Checks whether a login attempt is allowed for the given identifier + IP.
 *
 * NOTE: The `email` column in LoginAttempt currently stores the username.
 * This is confusing — consider renaming the schema column to `identifier`.
 *
 * RACE NOTE: This is a check-then-act pattern. Concurrent requests can all
 * pass the check before any one of them records a failure. For a church
 * portal at this scale that's acceptable. If you ever see credential-stuffing
 * traffic, migrate the counters to Redis / Upstash with atomic INCR.
 */
export async function checkLoginRateLimit(
  identifier: string,
  ip: string
): Promise<RateLimitResult> {
  const windowStart = new Date(Date.now() - WINDOW_MS);

  const failedForIdentifier = await prisma.loginAttempt.count({
    where: {
      email: identifier,
      success: false,
      createdAt: { gte: windowStart },
    },
  });

  if (failedForIdentifier >= MAX_FAILED_PER_EMAIL) {
    const oldest = await prisma.loginAttempt.findFirst({
      where: {
        email: identifier,
        success: false,
        createdAt: { gte: windowStart },
      },
      orderBy: { createdAt: "asc" },
      select: { createdAt: true },
    });

    const minutesRemaining = oldest
      ? Math.max(
          1,
          Math.ceil(
            (oldest.createdAt.getTime() + WINDOW_MS - Date.now()) / 60000
          )
        )
      : WINDOW_MINUTES;

    return { allowed: false, reason: "email", minutesRemaining };
  }

  if (ip && ip !== "unknown") {
    const failedForIp = await prisma.loginAttempt.count({
      where: {
        ip,
        success: false,
        createdAt: { gte: windowStart },
      },
    });

    if (failedForIp >= MAX_FAILED_PER_IP) {
      const oldest = await prisma.loginAttempt.findFirst({
        where: {
          ip,
          success: false,
          createdAt: { gte: windowStart },
        },
        orderBy: { createdAt: "asc" },
        select: { createdAt: true },
      });

      const minutesRemaining = oldest
        ? Math.max(
            1,
            Math.ceil(
              (oldest.createdAt.getTime() + WINDOW_MS - Date.now()) / 60000
            )
          )
        : WINDOW_MINUTES;

      return { allowed: false, reason: "ip", minutesRemaining };
    }
  }

  return { allowed: true };
}

/**
 * Records a login attempt. Never throws — logging failure must not block auth.
 */
export async function recordLoginAttempt(
  identifier: string,
  ip: string,
  success: boolean
): Promise<void> {
  try {
    await prisma.loginAttempt.create({
      data: { email: identifier, ip, success },
    });
  } catch (error) {
    console.error("Failed to record login attempt:", error);
  }
}