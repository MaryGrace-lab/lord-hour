"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath, revalidateTag } from "next/cache";
import { Role, TestimonyStatus } from "@prisma/client";
import { logAudit } from "@/lib/audit";
import { idOnlySchema } from "@/lib/validations";

async function requireAdmin() {
  const session = await auth();
  if (!session || session.user.role !== Role.ADMIN) {
    throw new Error("Unauthorized");
  }
  return session;
}

async function setTestimonyStatus(
  id: string,
  status: TestimonyStatus,
  session: { user: { id: string } }
) {
  const existing = await prisma.testimony.findUnique({
    where: { id },
    select: { id: true, status: true, name: true },
  });
  if (!existing) throw new Error("Testimony not found");
  if (existing.status === status) return existing;

  await prisma.testimony.update({
    where: { id },
    data: { status },
  });

  const action =
    status === TestimonyStatus.APPROVED
      ? "TESTIMONY_APPROVED"
      : status === TestimonyStatus.REJECTED
      ? "TESTIMONY_REJECTED"
      : "TESTIMONY_PENDING";

  await logAudit({
    userId: session.user.id,
    action,
    entity: "Testimony",
    entityId: id,
    metadata: { submitterName: existing.name, newStatus: status },
  });

  revalidatePath("/admin/testimonies");
  revalidatePath("/testimonies");
  revalidatePath("/");
  revalidateTag("admin-activity", "max");
  revalidateTag("testimonies", "max");
}

export async function approveTestimony(formData: FormData) {
  const session = await requireAdmin();
  const parsed = idOnlySchema.safeParse({ id: formData.get("id") });
  if (!parsed.success) throw new Error("Invalid testimony ID");

  await setTestimonyStatus(
    parsed.data.id,
    TestimonyStatus.APPROVED,
    session
  );
}

export async function rejectTestimony(formData: FormData) {
  const session = await requireAdmin();
  const parsed = idOnlySchema.safeParse({ id: formData.get("id") });
  if (!parsed.success) throw new Error("Invalid testimony ID");

  await setTestimonyStatus(
    parsed.data.id,
    TestimonyStatus.REJECTED,
    session
  );
}

export async function revertTestimonyToPending(formData: FormData) {
  const session = await requireAdmin();
  const parsed = idOnlySchema.safeParse({ id: formData.get("id") });
  if (!parsed.success) throw new Error("Invalid testimony ID");

  await setTestimonyStatus(parsed.data.id, TestimonyStatus.PENDING, session);
}

export async function deleteTestimony(formData: FormData) {
  const session = await requireAdmin();
  const parsed = idOnlySchema.safeParse({ id: formData.get("id") });
  if (!parsed.success) throw new Error("Invalid testimony ID");

  const existing = await prisma.testimony.findUnique({
    where: { id: parsed.data.id },
    select: { id: true, name: true, status: true },
  });
  if (!existing) throw new Error("Testimony not found");

  await prisma.testimony.delete({ where: { id: parsed.data.id } });

  await logAudit({
    userId: session.user.id,
    action: "TESTIMONY_DELETED",
    entity: "Testimony",
    entityId: existing.id,
    metadata: {
      submitterName: existing.name,
      previousStatus: existing.status,
    },
  });

  revalidatePath("/admin/testimonies");
  revalidatePath("/testimonies");
  revalidatePath("/");
  revalidateTag("testimonies", "max");
}