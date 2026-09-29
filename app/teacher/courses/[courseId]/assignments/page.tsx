import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AssignmentStatus, Role } from "@prisma/client";
import { deleteAssignment, publishAssignment } from "@/lib/teacher-actions";
import { ServerActionForm } from "@/components/forms/ServerActionForm";
import { BackToCourse } from "@/components/teacher/BackToCourse";
import { z } from "zod";

const cuidSchema = z.string().cuid();

const DATE_FORMAT = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export const revalidate = 30;

export default async function CourseAssignmentsPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const parsedId = cuidSchema.safeParse(courseId);
  if (!parsedId.success) notFound();

  const session = await auth();
  if (!session?.user?.id || session.user.role !== Role.TEACHER) {
    redirect("/bible-college/portal/login");
  }
  const teacherId = session.user.id;

  const course = await prisma.course.findFirst({
    where: {
      id: parsedId.data,
      teachers: { some: { id: teacherId } },
    },
    include: {
      assignments: {
        include: { _count: { select: { submissions: true } } },
        orderBy: { dueDate: "desc" },
      },
    },
  });

  if (!course) notFound();

  return (
    <div className="space-y-6">
      <BackToCourse courseId={courseId} courseTitle={course.title} />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-xl font-bold text-primary">
          Assignments · {course.title}
        </h1>
        <Link
          href={`/teacher/courses/${courseId}/assignments/new`}
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-light text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          + New Assignment
        </Link>
      </div>

      {course.assignments.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">
          No assignments yet. Create your first assignment.
        </div>
      ) : (
        <div className="space-y-4">
          {course.assignments.map((assignment) => {
            const isPublished =
              assignment.status === AssignmentStatus.PUBLISHED;
            return (
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
                      isPublished
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {isPublished ? "Published" : "Draft"}
                  </span>
                </div>
                {assignment.description && (
                  <p className="text-sm text-gray-600 whitespace-pre-wrap break-words mb-2">
                    {assignment.description}
                  </p>
                )}
                <p className="text-sm text-gray-600">
                  Due{" "}
                  <time dateTime={assignment.dueDate.toISOString()}>
                    {DATE_FORMAT.format(assignment.dueDate)}
                  </time>{" "}
                  · Max {assignment.maxScore} · Submissions{" "}
                  {assignment._count.submissions}
                </p>

                <div className="mt-3 flex flex-wrap gap-3 items-center">
                  <Link
                    href={`/teacher/courses/${courseId}/assignments/${assignment.id}`}
                    className="text-accent hover:underline text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                  >
                    View Submissions
                  </Link>
                  <ServerActionForm
                    action={publishAssignment}
                    hiddenFields={{ assignmentId: assignment.id }}
                    confirmMessage={
                      isPublished
                        ? "Unpublish this assignment? Students will no longer see it."
                        : "Publish this assignment? Students in this course will be able to submit."
                    }
                    successMessage={
                      isPublished
                        ? "Assignment unpublished"
                        : "Assignment published"
                    }
                    pendingLabel="Updating..."
                    buttonLabel={isPublished ? "Unpublish" : "Publish"}
                    buttonClassName={`text-sm font-medium ${
                      isPublished
                        ? "text-amber-600 hover:text-amber-800"
                        : "text-green-600 hover:text-green-800"
                    }`}
                  />
                  <ServerActionForm
                    action={deleteAssignment}
                    hiddenFields={{ assignmentId: assignment.id }}
                    confirmMessage="Delete this assignment and all submissions? This cannot be undone."
                    successMessage="Assignment deleted"
                    pendingLabel="Deleting..."
                    buttonLabel="Delete"
                    buttonClassName="text-sm font-medium text-red-600 hover:text-red-800 focus-visible:ring-red-600"
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}