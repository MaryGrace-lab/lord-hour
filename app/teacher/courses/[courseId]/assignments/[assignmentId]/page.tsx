import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AssignmentStatus, Role, SubmissionStatus } from "@prisma/client";
import { GradeSubmissionForm } from "@/components/teacher/GradeSubmissionForm";
import { z } from "zod";

const cuidSchema = z.string().cuid();

const DATE_TIME_FORMAT = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export const revalidate = 30;

export default async function AssignmentSubmissionsPage({
  params,
}: {
  params: Promise<{ courseId: string; assignmentId: string }>;
}) {
  const { courseId, assignmentId } = await params;
  const pCourse = cuidSchema.safeParse(courseId);
  const pAssignment = cuidSchema.safeParse(assignmentId);
  if (!pCourse.success || !pAssignment.success) notFound();

  const session = await auth();
  if (!session?.user?.id || session.user.role !== Role.TEACHER) {
    redirect("/bible-college/portal/login");
  }
  const teacherId = session.user.id;

  const assignment = await prisma.assignment.findFirst({
    where: {
      id: pAssignment.data,
      courseId: pCourse.data,
      course: { teachers: { some: { id: teacherId } } },
    },
    select: {
      id: true,
      title: true,
      maxScore: true,
      status: true,
      dueDate: true,
      course: { select: { title: true } },
      submissions: {
        orderBy: { submittedAt: "desc" },
        select: {
          id: true,
          content: true,
          fileUrl: true,
          score: true,
          feedback: true,
          status: true,
          submittedAt: true,
          student: {
            select: {
              id: true,
              username: true,
              name: true,
              studentProfile: {
                select: { firstName: true, lastName: true },
              },
            },
          },
        },
      },
    },
  });

  if (!assignment) notFound();

  return (
    <div className="space-y-6">
      <Link
        href={`/teacher/courses/${courseId}`}
        className="text-sm text-accent hover:underline inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
      >
        ← Back to Course
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-primary">
            {assignment.title}
          </h1>
          <p className="text-sm text-gray-500">
            {assignment.course.title} ·{" "}
            {assignment.status === AssignmentStatus.PUBLISHED
              ? "Published"
              : "Draft"}{" "}
            · Due{" "}
            <time dateTime={assignment.dueDate.toISOString()}>
              {DATE_TIME_FORMAT.format(assignment.dueDate)}
            </time>
          </p>
        </div>
        <Link
          href={`/teacher/courses/${courseId}/assignments`}
          className="text-sm text-accent hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
        >
          All Assignments
        </Link>
      </div>

      <p className="text-gray-600">
        Submissions ({assignment.submissions.length})
      </p>

      {assignment.submissions.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">
          No submissions yet.
        </div>
      ) : (
        <div className="space-y-4">
          {assignment.submissions.map((submission) => {
            const displayName =
              [
                submission.student.studentProfile?.firstName,
                submission.student.studentProfile?.lastName,
              ]
                .filter(Boolean)
                .join(" ") ||
              submission.student.name ||
              submission.student.username;

            return (
              <article
                key={submission.id}
                className="bg-white rounded-lg shadow-sm p-6"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between gap-4 mb-4">
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900">
                      {displayName}
                    </p>
                    <p className="text-xs text-gray-500">
                      @{submission.student.username}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Submitted{" "}
                      <time dateTime={submission.submittedAt.toISOString()}>
                        {DATE_TIME_FORMAT.format(submission.submittedAt)}
                      </time>
                    </p>
                    {submission.content && (
                      <p className="mt-2 text-sm text-gray-800 whitespace-pre-wrap break-words">
                        {submission.content}
                      </p>
                    )}
                    {submission.fileUrl && (
                      <a
                        href={submission.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent hover:underline text-sm inline-block mt-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                      >
                        Open attached file
                        <span className="sr-only">
                          {" "}
                          (opens in new tab)
                        </span>
                      </a>
                    )}
                  </div>
                  <div className="shrink-0 text-sm">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                        submission.status === SubmissionStatus.GRADED
                          ? "bg-green-100 text-green-700"
                          : submission.status === SubmissionStatus.LATE
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {submission.status}
                    </span>
                    {submission.score !== null && (
                      <p className="mt-2 font-medium">
                        {submission.score}/{assignment.maxScore}
                      </p>
                    )}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h2 className="font-medium text-sm text-gray-700 mb-2">
                    Grade this submission
                  </h2>
                  <GradeSubmissionForm
                    submissionId={submission.id}
                    maxScore={assignment.maxScore}
                    initialScore={submission.score}
                    initialFeedback={submission.feedback}
                  />
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}