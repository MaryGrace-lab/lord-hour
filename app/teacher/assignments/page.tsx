import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { FaClipboardList } from "react-icons/fa";

export default async function TeacherAssignmentsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    return <div>Not authenticated</div>;
  }
  const teacherId = session.user.id;

  // Fetch assignments from courses taught by this teacher
  const assignments = await prisma.assignment.findMany({
    where: {
      course: {
        teachers: { some: { id: teacherId } },
      },
    },
    include: {
      course: true,
      _count: { select: { submissions: true } },
    },
    orderBy: { dueDate: "asc" },
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-primary">My Assignments</h2>
      {assignments.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">
          No assignments created yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assignments.map((assignment) => (
            <div key={assignment.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{assignment.title}</h3>
                  <p className="text-sm text-gray-500">{assignment.course.title}</p>
                  <p className="text-sm text-gray-600 mt-1">Due: {assignment.dueDate.toLocaleDateString()}</p>
                  <p className="text-sm text-gray-600">Submissions: {assignment._count.submissions}</p>
                  <p className="text-sm text-gray-600">Status: {assignment.status}</p>
                </div>
                <FaClipboardList className="text-accent text-2xl" />
              </div>
              <Link
                href={`/teacher/courses/${assignment.courseId}/assignments/${assignment.id}`}
                className="mt-3 inline-block text-accent hover:underline"
              >
                View Submissions
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}