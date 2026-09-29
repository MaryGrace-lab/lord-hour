"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath, revalidateTag } from "next/cache";
import { Role, ApplicationStatus } from "@prisma/client";
import {
  sendApplicationApprovedEmail,
  sendApplicationRejectedEmail,
} from "@/lib/email";
import { logAudit } from "@/lib/audit";
import { z } from "zod";

const applicationIdSchema = z
  .string()
  .trim()
  .cuid("Invalid application ID");

const rejectReasonSchema = z
  .string()
  .trim()
  .max(1000, "Rejection reason is too long")
  .optional();

async function requireAdmin() {
  const session = await auth();
  if (!session || session.user.role !== Role.ADMIN) {
    throw new Error("Unauthorized");
  }
  return session;
}

/**
 * Atomically transition an application to a new status.
 * Refuses no-op transitions (e.g., re-approving an approved application)
 * and never overwrites the applicant's own `notes` field.
 */
async function transitionApplication(params: {
  applicationId: string;
  to: ApplicationStatus;
  reviewedById: string;
  rejectionReason?: string | null;
}) {
  const { applicationId, to, reviewedById, rejectionReason } = params;

  const existing = await prisma.application.findUnique({
    where: { id: applicationId },
    select: {
      id: true,
      status: true,
      fullName: true,
      email: true,
    },
  });
  if (!existing) throw new Error("Application not found");

  // Same-state transitions are no-ops. Return the existing record so callers
  // can still send the notification if they want.
  if (existing.status === to) {
    return existing;
  }

  // Approved or rejected applications should only be reversible to PENDING,
  // never re-decided without going back through PENDING first.
  if (
    (existing.status === ApplicationStatus.APPROVED ||
      existing.status === ApplicationStatus.REJECTED) &&
    (to === ApplicationStatus.APPROVED ||
      to === ApplicationStatus.REJECTED) &&
    existing.status !== to
  ) {
    throw new Error("Revert to pending before changing this decision");
  }

  const updated = await prisma.application.update({
    where: { id: applicationId },
    data: {
      status: to,
      reviewedById,
      reviewedAt: new Date(),
      // Preserve the applicant's original notes — never overwrite.
      // Rejection reason is stored in the audit log only.
    },
    select: {
      id: true,
      status: true,
      fullName: true,
      email: true,
    },
  });

  return updated;
}

export async function markApplicationContacted(formData: FormData) {
  const session = await requireAdmin();
  const parsed = applicationIdSchema.safeParse(formData.get("applicationId"));
  if (!parsed.success) throw new Error("Invalid application ID");
  const applicationId = parsed.data;

  await transitionApplication({
    applicationId,
    to: ApplicationStatus.CONTACTED,
    reviewedById: session.user.id,
  });

  await logAudit({
    userId: session.user.id,
    action: "APPLICATION_CONTACTED",
    entity: "Application",
    entityId: applicationId,
  });

  revalidatePath("/admin/applications");
  revalidatePath(`/admin/applications/${applicationId}`);
  revalidateTag("admin-activity", "max");
}

export async function rejectApplication(formData: FormData) {
  const session = await requireAdmin();
  const parsedId = applicationIdSchema.safeParse(
    formData.get("applicationId")
  );
  if (!parsedId.success) throw new Error("Invalid application ID");

  const parsedReason = rejectReasonSchema.safeParse(
    formData.get("reason")?.toString() || undefined
  );
  if (!parsedReason.success) {
    throw new Error(
      parsedReason.error.issues[0]?.message || "Invalid rejection reason"
    );
  }
  const reason = parsedReason.data ?? null;

  const application = await transitionApplication({
    applicationId: parsedId.data,
    to: ApplicationStatus.REJECTED,
    reviewedById: session.user.id,
    rejectionReason: reason,
  });

  await logAudit({
    userId: session.user.id,
    action: "APPLICATION_REJECTED",
    entity: "Application",
    entityId: parsedId.data,
    metadata: reason ? { reason } : undefined,
  });

  revalidatePath("/admin/applications");
  revalidatePath(`/admin/applications/${parsedId.data}`);
  revalidateTag("admin-activity", "max");

  // Send email after the state change. Failure here must not roll back
  // the admin's decision.
  try {
    await sendApplicationRejectedEmail({
      applicantName: application.fullName,
      applicantEmail: application.email,
      reason,
    });
  } catch (e) {
    console.error("Rejection email failed:", e);
  }
}

export async function approveApplication(formData: FormData) {
  const session = await requireAdmin();
  const parsed = applicationIdSchema.safeParse(formData.get("applicationId"));
  if (!parsed.success) throw new Error("Invalid application ID");
  const applicationId = parsed.data;

  const application = await transitionApplication({
    applicationId,
    to: ApplicationStatus.APPROVED,
    reviewedById: session.user.id,
  });

  await logAudit({
    userId: session.user.id,
    action: "APPLICATION_APPROVED",
    entity: "Application",
    entityId: applicationId,
    metadata: { applicantName: application.fullName },
  });

  revalidatePath("/admin/applications");
  revalidatePath(`/admin/applications/${applicationId}`);
  revalidateTag("admin-activity", "max");

  try {
    await sendApplicationApprovedEmail({
      applicantName: application.fullName,
      applicantEmail: application.email,
    });
  } catch (e) {
    console.error("Approval email failed:", e);
  }
}

export async function revertApplicationToPending(formData: FormData) {
  const session = await requireAdmin();
  const parsed = applicationIdSchema.safeParse(formData.get("applicationId"));
  if (!parsed.success) throw new Error("Invalid application ID");
  const applicationId = parsed.data;

  await transitionApplication({
    applicationId,
    to: ApplicationStatus.PENDING,
    reviewedById: session.user.id,
  });

  // Reverting to pending clears the reviewer attribution.
  await prisma.application.update({
    where: { id: applicationId },
    data: { reviewedById: null, reviewedAt: null },
  });

  await logAudit({
    userId: session.user.id,
    action: "APPLICATION_REVERTED",
    entity: "Application",
    entityId: applicationId,
  });

  revalidatePath("/admin/applications");
  revalidatePath(`/admin/applications/${applicationId}`);
  revalidateTag("admin-activity", "max");
}