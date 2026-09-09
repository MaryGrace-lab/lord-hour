import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { StudentDetailForm } from "@/components/admin/StudentDetailForm";

export default async function StudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      studentProfile: { include: { programme: true } },
      enrollments: { include: { course: true } },
    },
  });

  if (!user || user.role !== "STUDENT") notFound();

  const programmes = await prisma.programme.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-primary">Student Details</h2>
      <StudentDetailForm user={user} programmes={programmes} />
    </div>
  );
}