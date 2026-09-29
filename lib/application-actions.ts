"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { ApplicationStatus } from "@prisma/client";
import {
  sendNewApplicationNotificationToAdmin,
  sendApplicationReceivedEmail,
} from "@/lib/email";
import { applicationSchema, validationError } from "@/lib/validations";

const MIN_RENDER_TIME_MS = 3000;

export async function submitApplication(
  _prevState: { success: boolean; error?: string },
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  // ─── 1. Honeypot ───
  const honeypot = formData.get("website")?.toString() ?? "";
  if (honeypot.trim().length > 0) {
    console.warn("[application] honeypot triggered");
    return { success: true }; // fake success
  }

  // ─── 2. Time check ───
  const renderedAtRaw = formData.get("renderedAt")?.toString();
  const renderedAt = renderedAtRaw ? Number(renderedAtRaw) : NaN;
  if (Number.isFinite(renderedAt)) {
    const elapsed = Date.now() - renderedAt;
    if (elapsed < MIN_RENDER_TIME_MS) {
      console.warn("[application] too-fast submission:", elapsed, "ms");
      return { success: true };
    }
  }

  // ─── 3. Validate ───
  const parsed = applicationSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    courseId: formData.get("courseId") || undefined,
    notes: formData.get("notes") || undefined,
  });

  if (!parsed.success) return validationError(parsed.error);

  const { fullName, email, phone, courseId, notes } = parsed.data;

  try {
    // ─── 4. Duplicate check ───
    const existing = await prisma.application.findFirst({
      where: {
        email,
        status: {
          in: [ApplicationStatus.PENDING, ApplicationStatus.CONTACTED],
        },
      },
      select: { id: true },
    });

    if (existing) {
      return {
        success: false,
        error:
          "An application with this email is already pending review. Please wait to be contacted.",
      };
    }

    // ─── 5. Create ───
    const application = await prisma.application.create({
      data: {
        fullName,
        email,
        phone,
        courseId: courseId ?? null,
        notes: notes ?? null,
        status: ApplicationStatus.PENDING,
      },
      include: { course: { select: { title: true } } },
    });

    revalidatePath("/admin/applications");

    // ─── 6. Emails (non-blocking) ───
    try {
      await sendNewApplicationNotificationToAdmin({
        applicantName: application.fullName,
        applicantEmail: application.email,
        applicantPhone: application.phone,
        courseTitle: application.course?.title ?? null,
        applicationId: application.id,
      });
    } catch (e) {
      console.error("Admin notification email failed:", e);
    }

    try {
      await sendApplicationReceivedEmail({
        applicantName: application.fullName,
        applicantEmail: application.email,
        courseTitle: application.course?.title ?? null,
      });
    } catch (e) {
      console.error("Applicant confirmation email failed:", e);
    }

    return { success: true };
  } catch (error) {
    console.error("Submit application error:", error);
    return {
      success: false,
      error: "Unable to submit your application. Please try again.",
    };
  }
}