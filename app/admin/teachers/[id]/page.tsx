import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { TeacherDetailForm } from "@/components/admin/TeacherDetailForm";

export default async function TeacherDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      teacherProfile: true,
      coursesTeaching: true,
    },
  });

  if (!user || user.role !== "TEACHER") notFound();

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-primary">Teacher Details</h2>
      <TeacherDetailForm user={user} />
    </div>
  );
}