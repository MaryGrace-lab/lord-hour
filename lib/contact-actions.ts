"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { InquiryType } from "@prisma/client";
import { sendNewContactMessageNotificationToAdmin } from "@/lib/email";
import { validationError } from "@/lib/validations";

// ────────────────────────────────────────────────
// Validation
// ────────────────────────────────────────────────
const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name")
    .max(100, "Name is too long"),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please enter a valid email address")
    .max(200)
    .optional()
    .or(z.literal("").transform(() => undefined)),
  phone: z
    .string()
    .trim()
    .min(7, "Please enter a valid phone number")
    .max(30, "Phone number is too long"),
  inquiryType: z.enum(["general", "prayer", "counseling", "testimony"]),
  subject: z
    .string()
    .trim()
    .max(200, "Subject is too long")
    .optional()
    .or(z.literal("").transform(() => undefined)),
  message: z
    .string()
    .trim()
    .min(10, "Please write at least 10 characters")
    .max(5000, "Message is too long"),
  // Honeypot — must be empty. Bots fill every field they see.
  website: z.string().max(0).optional(),
  // Rendering time check — submissions under 3 seconds are bots.
  renderedAt: z.coerce.number().optional(),
});

const INQUIRY_MAP: Record<
  "general" | "prayer" | "counseling" | "testimony",
  InquiryType
> = {
  general: InquiryType.GENERAL,
  prayer: InquiryType.PRAYER,
  counseling: InquiryType.COUNSELING,
  testimony: InquiryType.TESTIMONY,
};

const MIN_RENDER_TIME_MS = 3000;

// ────────────────────────────────────────────────
// Server action
// ────────────────────────────────────────────────
export async function submitContactMessage(
  _prevState: { success: boolean; error?: string },
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  // Honeypot check — if filled, silently pretend success and drop it.
  const honeypot = formData.get("website")?.toString() ?? "";
  if (honeypot.trim().length > 0) {
    // Log the attempt for future analysis, then return a fake success.
    console.warn("[contact] honeypot triggered");
    return { success: true };
  }

  // Time check — if submitted too quickly, treat as bot.
  const renderedAtRaw = formData.get("renderedAt")?.toString();
  const renderedAt = renderedAtRaw ? Number(renderedAtRaw) : NaN;
  if (Number.isFinite(renderedAt)) {
    const elapsed = Date.now() - renderedAt;
    if (elapsed < MIN_RENDER_TIME_MS) {
      console.warn("[contact] too-fast submission:", elapsed, "ms");
      return { success: true };
    }
  }

  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email") || undefined,
    phone: formData.get("phone"),
    inquiryType: formData.get("inquiryType"),
    subject: formData.get("subject") || undefined,
    message: formData.get("message"),
    website: honeypot || undefined,
    renderedAt: renderedAtRaw || undefined,
  });

  if (!parsed.success) return validationError(parsed.error);

  const { name, email, phone, inquiryType, subject, message } = parsed.data;

  try {
    await prisma.contactMessage.create({
      data: {
        name,
        email: email ?? null,
        phone,
        inquiryType: INQUIRY_MAP[inquiryType],
        subject: subject ?? null,
        message,
      },
    });

    try {
      await sendNewContactMessageNotificationToAdmin({
        name,
        email,
        phone,
        inquiryType,
        subject,
        message,
      });
    } catch (e) {
      console.error("Contact notification email failed:", e);
    }

    return { success: true };
  } catch (error) {
    console.error("Contact form error:", error);
    return {
      success: false,
      error: "Unable to send your message. Please try again.",
    };
  }
}