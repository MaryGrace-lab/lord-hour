import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AssignmentStatus, Role, SubmissionStatus } from "@prisma/client";
import { AssignmentSubmissionForm } from "@/components/student/AssignmentSubmissionForm";
import {
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
} from "react-icons/fa";
import { z } from "zod";

const cuidSchema = z.string().cuid();

const DATE_TIME_FORMAT = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export default async function StudentAssignmentDetailPage({
  params,
}: {
  params: Promise<{ assignmentId: string }>;
}) {
  const { assignmentId } = await params;
  const parsedId = cuidSchema.safeParse(assignmentId);
  if (!parsedId.success) notFound();

  const session = await auth();
  if (!session?.user?.id || session.user.role !== Role.STUDENT) {
    redirect("/bible-college/portal/login");
  }
  const studentId = session.user.id;

  const assignment = await prisma.assignment.findUnique({
    where: { id: parsedId.data },
    include: {
      course: {
        include: { teachers: { select: { username: true } } },
      },
      submissions: {
        where: { studentId },
      },
    },
  });

  if (!assignment || assignment.status !== AssignmentStatus.PUBLISHED) {
    notFound();
  }

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      studentId_courseId: {
        studentId,
        courseId: assignment.courseId,
      },
    },
    select: { id: true },
  });
  if (!enrollment) notFound();

  const submission = assignment.submissions[0];
  const now = new Date();
  const isOverdue = now > assignment.dueDate;
  const isGraded = submission?.status === SubmissionStatus.GRADED;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link
        href="/student/assignments"
        className="text-sm text-accent hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
      >
        ← Back to Assignments
      </Link>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="font-heading text-2xl font-bold text-primary mb-1">
          {assignment.title}
        </h1>
        <p className="text-sm text-gray-500 mb-4">
          {assignment.course.title}
        </p>

        <dl className="flex flex-wrap gap-4 text-sm text-gray-700 mb-4">
          <div className="flex items-center gap-1">
            <FaClock className="text-gray-400" aria-hidden />
            <dt className="sr-only">Due date</dt>
            <dd>
              Due:{" "}
              <time dateTime={assignment.dueDate.toISOString()}>
                {DATE_TIME_FORMAT.format(assignment.dueDate)}
              </time>
            </dd>
          </div>
          <div>
            <dt className="sr-only">Maximum score</dt>
            <dd>
              <span className="font-medium">Max Score:</span>{" "}
              {assignment.maxScore}
            </dd>
          </div>
          <div>
            <dt className="sr-only">Instructor</dt>
            <dd>
              <span className="font-medium">Instructor:</span>{" "}
              {assignment.course.teachers.map((t) => t.username).join(", ") ||
                "Not assigned"}
            </dd>
          </div>
        </dl>

        {isOverdue && !submission && (
          <div
            className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-800 rounded-md p-3 text-sm mb-4"
            role="alert"
          >
            <FaExclamationTriangle
              className="mt-0.5 shrink-0"
              aria-hidden
            />
            <span>
              This assignment is past its due date. Your submission will be
              marked as late.
            </span>
          </div>
        )}

        {assignment.description && (
          <div>
            <h2 className="font-semibold text-gray-800 mb-2">
              Instructions
            </h2>
            <div className="whitespace-pre-wrap text-gray-800 leading-relaxed break-words">
              {assignment.description}
            </div>
          </div>
        )}
      </div>

      {submission ? (
        <section
          className="bg-white rounded-lg shadow-sm p-6 space-y-4"
          aria-labelledby="submission-heading"
        >
          <div className="flex items-center gap-2">
            <FaCheckCircle className="text-green-600" aria-hidden />
            <h2 id="submission-heading" className="font-semibold text-lg">
              {isGraded ? "Graded" : "Submitted"}
            </h2>
          </div>

          <div className="text-sm text-gray-700">
            <p>
              <span className="font-medium">Submitted:</span>{" "}
              <time dateTime={submission.submittedAt.toISOString()}>
                {DATE_TIME_FORMAT.format(submission.submittedAt)}
              </time>
            </p>
            <p>
              <span className="font-medium">Status:</span>{" "}
              {submission.status}
            </p>
          </div>

          {submission.content && (
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">
                Your Submission
              </h3>
              <p className="text-sm text-gray-800 whitespace-pre-wrap break-words">
                {submission.content}
              </p>
            </div>
          )}

          {submission.fileUrl && (
            <a
              href={submission.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
            >
              View submitted file
              <span className="sr-only"> (opens in new tab)</span>
            </a>
          )}

          {isGraded && (
            <div className="border-t pt-4">
              <h3 className="font-semibold text-gray-800 mb-2">
                Grade & Feedback
              </h3>
              <p className="text-lg font-bold text-primary mb-2">
                {submission.score} / {assignment.maxScore}
              </p>
              {submission.feedback && (
                <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">
                  {submission.feedback}
                </p>
              )}
            </div>
          )}

          <p className="text-xs text-gray-500 border-t pt-4">
            You have already submitted this assignment. To make a change,
            contact your instructor.
          </p>
        </section>
      ) : (
        <section
          className="bg-white rounded-lg shadow-sm p-6"
          aria-labelledby="submit-heading"
        >
          <h2 id="submit-heading" className="font-semibold text-lg mb-4">
            Submit Assignment
          </h2>
          <AssignmentSubmissionForm assignmentId={assignment.id} />
        </section>
      )}
    </div>
  );
}