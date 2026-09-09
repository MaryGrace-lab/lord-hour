import { prisma } from "@/lib/prisma";
import { CourseForm } from "@/components/admin/CourseForm";

export default async function NewCoursePage() {
  const programmes = await prisma.programme.findMany({ orderBy: { name: "asc" } });
  const sessions = await prisma.academicSession.findMany({ orderBy: { name: "desc" } });
  const semesters = await prisma.semester.findMany({
    include: { session: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-primary">Create Course</h2>
      <CourseForm
        programmes={programmes}
        sessions={sessions}
        semesters={semesters.map((s) => ({ id: s.id, name: `${s.name} (${s.session.name})` }))}
      />
    </div>
  );
}