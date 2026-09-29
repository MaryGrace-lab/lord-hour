import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { TeacherDetailForm } from "@/components/admin/TeacherDetailForm";
import { Role } from "@prisma/client";
import { z } from "zod";

const cuidSchema = z.string().cuid();

export default async function TeacherDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const parsed = cuidSchema.safeParse(id);
  if (!parsed.success) notFound();

  const user = await prisma.user.findUnique({
    where: { id: parsed.data },
    include: {
      teacherProfile: true,
      coursesTeaching: {
        select: { id: true, title: true },
        orderBy: { title: "asc" },
      },
    },
  });

  if (!user || user.role !== Role.TEACHER) notFound();

  return (
    <div className="space-y-8">
      <Link
        href="/admin/teachers"
        className="text-sm text-accent hover:underline inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
      >
        ← Back to Teachers
      </Link>

      <h1 className="text-2xl font-bold text-primary">Teacher Details</h1>

      <TeacherDetailForm user={user} />
    </div>
  );
}