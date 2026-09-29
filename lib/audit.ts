import { prisma } from "@/lib/prisma";

export type AuditAction =
  | "APPLICATION_APPROVED"
  | "APPLICATION_REJECTED"
  | "APPLICATION_CONTACTED"
  | "APPLICATION_REVERTED"
  | "STUDENT_CREATED"
  | "STUDENT_UPDATED"
  | "STUDENT_TOGGLED"
  | "STUDENT_DELETED"
  | "TEACHER_CREATED"
  | "TEACHER_UPDATED"
  | "TEACHER_TOGGLED"
  | "TEACHER_DELETED"
  | "COURSE_CREATED"
  | "COURSE_VISIBILITY_TOGGLED"
  | "COURSE_DELETED"
  | "TEACHER_ASSIGNED"
  | "TEACHER_REMOVED"
  | "STUDENT_ENROLLED"
  | "STUDENT_UNENROLLED"
  | "STUDENT_ACTIVATED"
  | "ADMIN_PROFILE_UPDATED"
  | "TESTIMONY_APPROVED"
  | "TESTIMONY_REJECTED"
  | "TESTIMONY_PENDING"
  | "TESTIMONY_DELETED"
  | "ENROLLMENT_COMPLETED"
  | "ENROLLMENT_COMPLETION_REVERTED";

export type AuditEntity =
  | "Application"
  | "User"
  | "Course"
  | "Enrollment"
  | "Testimony";

type LogAuditParams = {
  userId: string | null;
  action: AuditAction;
  entity: AuditEntity;
  entityId?: string | null;
  metadata?: Record<string, unknown>;
};

const MAX_METADATA_LENGTH = 8000;

/**
 * Write an audit log entry.
 * Never throws — logging failure must not break the calling action.
 */
export async function logAudit(params: LogAuditParams): Promise<void> {
  try {
    const serialized = params.metadata
      ? JSON.stringify(params.metadata)
      : null;
    const metadata =
      serialized && serialized.length > MAX_METADATA_LENGTH
        ? serialized.slice(0, MAX_METADATA_LENGTH)
        : serialized;

    await prisma.auditLog.create({
      data: {
        userId: params.userId,
        action: params.action,
        entity: params.entity,
        entityId: params.entityId ?? null,
        metadata,
      },
    });
  } catch (error) {
    console.error("Audit log write failed:", error);
  }
}