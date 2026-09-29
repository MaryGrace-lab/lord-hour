import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { StudentDetailForm } from "@/components/admin/StudentDetailForm";
import Link from "next/link";
import { Role } from "@prisma/client";
import { z } from "zod";

const cuidSchema = z.string().cuid();

export default async function StudentDetailPage({
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
      studentProfile: true,
      enrollments: {
        include: {
          course: {
            include: { teachers: { select: { username: true } } },
          },
        },
        orderBy: { enrolledAt: "desc" },
      },
    },
  });

  if (!user || user.role !== Role.STUDENT) notFound();

  const enrolledCourseIds = user.enrollments.map((e) => e.courseId);

  const availableCourses = await prisma.course.findMany({
    where: {
      ...(enrolledCourseIds.length > 0
        ? { id: { notIn: enrolledCourseIds } }
        : {}),
      isPublished: true,
    },
    orderBy: { title: "asc" },
    select: { id: true, title: true },
  });

  return (
    <div className="space-y-8">
      <Link
        href="/admin/students"
        className="text-sm text-accent hover:underline inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
      >
        ← Back to Students
      </Link>

      <h1 className="text-2xl font-bold text-primary">Student Details</h1>

      <StudentDetailForm user={user} availableCourses={availableCourses} />
    </div>
  );
}