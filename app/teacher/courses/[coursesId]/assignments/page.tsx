import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { deleteAssignment, publishAssignment } from "@/lib/teacher-actions";
import { ConfirmDeleteButton } from "@/components/ConfirmDeleteButton";

export default async function CourseAssignmentsPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const session = await auth();
  const teacherId = session?.user.id;

  const course = await prisma.course.findFirst({
    where: {
      id: courseId,
      teachers: { some: { id: teacherId } },
    },
    include: {
      assignments: { include: { _count: { select: { submissions: true } } } },
    },
  });

  if (!course) return <div>Course not found or access denied.</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-primary">Assignments</h3>
        <Link
          href={`/teacher/courses/${courseId}/assignments/new`}
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-light"
        >
          + New Assignment
        </Link>
      </div>
      {course.assignments.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">
          No assignments yet.
        </div>
      ) : (
        <div className="space-y-4">
          {course.assignments.map((assignment) => (
            <div key={assignment.id} className="bg-white rounded-lg shadow-sm p-6">
              <h4 className="font-semibold">{assignment.title}</h4>
              <p className="text-sm text-gray-600">{assignment.description}</p>
              <p className="text-sm">Due: {assignment.dueDate.toLocaleDateString()}</p>
              <p className="text-sm">Submissions: {assignment._count.submissions}</p>
              <div className="mt-3 flex gap-3 items-center">
                <Link
                  href={`/teacher/courses/${courseId}/assignments/${assignment.id}`}
                  className="text-accent hover:underline"
                >
                  View Submissions
                </Link>
                <form action={publishAssignment}>
                  <input type="hidden" name="assignmentId" value={assignment.id} />
                  <button className="text-green-600 hover:text-green-800">
                    {assignment.status === "PUBLISHED" ? "Unpublish" : "Publish"}
                  </button>
                </form>
                <ConfirmDeleteButton
                  formAction={deleteAssignment}
                  hiddenFields={{ assignmentId: assignment.id }}
                  confirmMessage="Delete this assignment? This action cannot be undone."
                >
                  Delete
                </ConfirmDeleteButton>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}