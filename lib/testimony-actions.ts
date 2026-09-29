"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { TestimonyStatus } from "@prisma/client";
import { sendNewTestimonyNotificationToAdmin } from "@/lib/email";
import { submitTestimonySchema, validationError } from "@/lib/validations";
import { getClientIp } from "@/lib/ip";

// ────────────────────────────────────────────────
// Rate limit config
// ────────────────────────────────────────────────
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_PER_IP_PER_HOUR = 3;

// Minimum time between form render and submission.
const MIN_RENDER_TIME_MS = 3000;

export async function submitTestimony(
  _prevState: { success: boolean; error?: string },
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  // ─── 1. Honeypot ───
  const honeypot = formData.get("website")?.toString() ?? "";
  if (honeypot.trim().length > 0) {
    console.warn("[testimony] honeypot triggered");
    return { success: true }; // fake success
  }

  // ─── 2. Time check ───
  const renderedAtRaw = formData.get("renderedAt")?.toString();
  const renderedAt = renderedAtRaw ? Number(renderedAtRaw) : NaN;
  if (Number.isFinite(renderedAt)) {
    const elapsed = Date.now() - renderedAt;
    if (elapsed < MIN_RENDER_TIME_MS) {
      console.warn("[testimony] too-fast submission:", elapsed, "ms");
      return { success: true };
    }
  }

  // ─── 3. Validate ───
  const parsed = submitTestimonySchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email") || undefined,
    location: formData.get("location") || undefined,
    category: formData.get("category"),
    content: formData.get("content"),
    anonymous: formData.get("anonymous") === "on",
  });

  if (!parsed.success) return validationError(parsed.error);

  const { name, email, location, category, content, anonymous } = parsed.data;

  try {
    const ip = await getClientIp();

    // ─── 4. Rate limit by IP ───
    if (ip !== "unknown") {
      const recent = await prisma.testimony.count({
        where: {
          ipAddress: ip,
          createdAt: { gte: new Date(Date.now() - RATE_LIMIT_WINDOW_MS) },
        },
      });

      if (recent >= MAX_PER_IP_PER_HOUR) {
        return {
          success: false,
          error:
            "You have submitted several testimonies recently. Please try again later.",
        };
      }
    }

    // ─── 5. Save as PENDING ───
    await prisma.testimony.create({
      data: {
        name,
        email: email ?? null,
        location: location ?? null,
        category,
        content,
        anonymous,
        status: TestimonyStatus.PENDING,
        ipAddress: ip === "unknown" ? null : ip,
      },
    });

    revalidatePath("/admin/testimonies");

    // ─── 6. Notify admin ───
    try {
      await sendNewTestimonyNotificationToAdmin({
        submitterName: anonymous ? "Anonymous" : name,
        category,
        preview: content.slice(0, 200),
      });
    } catch (e) {
      console.error("Admin notification email failed:", e);
    }

    return { success: true };
  } catch (error) {
    console.error("Submit testimony error:", error);
    return {
      success: false,
      error: "Unable to submit your testimony. Please try again.",
    };
  }
}