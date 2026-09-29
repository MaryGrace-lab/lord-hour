import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { FaClipboardList } from "react-icons/fa";

export const revalidate = 30;

const DATE_FORMAT = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export default async function TeacherAssignmentsPage() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== Role.TEACHER) {
    redirect("/bible-college/portal/login");
  }
  const teacherId = session.user.id;

  const assignments = await prisma.assignment.findMany({
    where: {
      course: { teachers: { some: { id: teacherId } } },
    },
    include: {
      course: { select: { id: true, title: true } },
      _count: { select: { submissions: true } },
    },
    orderBy: { dueDate: "asc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
        <FaClipboardList className="text-accent" aria-hidden />
        My Assignments
      </h1>

      {assignments.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">
          No assignments created yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assignments.map((assignment) => (
            <div
              key={assignment.id}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <h2 className="font-semibold text-lg">
                  {assignment.title}
                </h2>
                <span
                  className={`shrink-0 px-2 py-1 text-xs rounded-full ${
                    assignment.status === "PUBLISHED"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {assignment.status === "PUBLISHED" ? "Published" : "Draft"}
                </span>
              </div>
              <p className="text-sm text-gray-500">
                {assignment.course.title}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Due{" "}
                <time dateTime={assignment.dueDate.toISOString()}>
                  {DATE_FORMAT.format(assignment.dueDate)}
                </time>{" "}
                · Submissions {assignment._count.submissions}
              </p>
              <Link
                href={`/teacher/courses/${assignment.course.id}/assignments/${assignment.id}`}
                className="mt-3 inline-block text-accent hover:underline text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
              >
                View Submissions →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}