import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AssignmentStatus, Role, SubmissionStatus } from "@prisma/client";
import { FaClipboardList, FaCheckCircle, FaClock } from "react-icons/fa";

export const revalidate = 30;

const DATE_FORMAT = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export default async function StudentAssignmentsPage() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== Role.STUDENT) {
    redirect("/bible-college/portal/login");
  }
  const studentId = session.user.id;

  const enrollments = await prisma.enrollment.findMany({
    where: { studentId },
    select: { courseId: true },
  });
  const courseIds = enrollments.map((e) => e.courseId);

  const assignments = await prisma.assignment.findMany({
    where: {
      courseId: { in: courseIds },
      status: AssignmentStatus.PUBLISHED,
    },
    include: {
      course: { select: { title: true } },
      submissions: {
        where: { studentId },
        select: {
          id: true,
          status: true,
          score: true,
          submittedAt: true,
        },
      },
    },
    orderBy: { dueDate: "asc" },
  });

  const now = new Date();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-primary">My Assignments</h1>

      {assignments.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">
          <FaClipboardList
            className="text-gray-300 mx-auto mb-3"
            size={32}
            aria-hidden
          />
          <p>You have no assignments at the moment.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {assignments.map((assignment) => {
            const submission = assignment.submissions[0];
            const isSubmitted = !!submission;
            const isGraded = submission?.status === SubmissionStatus.GRADED;
            const isLate = submission?.status === SubmissionStatus.LATE;
            const isOverdue = !isSubmitted && assignment.dueDate < now;

            let statusLabel = "Not Submitted";
            let statusColor = "bg-gray-100 text-gray-700";

            if (isGraded) {
              statusLabel = "Graded";
              statusColor = "bg-green-100 text-green-700";
            } else if (isSubmitted && isLate) {
              statusLabel = "Submitted (Late)";
              statusColor = "bg-yellow-100 text-yellow-700";
            } else if (isSubmitted) {
              statusLabel = "Submitted";
              statusColor = "bg-blue-100 text-blue-700";
            } else if (isOverdue) {
              statusLabel = "Overdue";
              statusColor = "bg-red-100 text-red-700";
            }

            return (
              <Link
                key={assignment.id}
                href={`/student/assignments/${assignment.id}`}
                className="block bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <FaClipboardList
                        className="text-accent shrink-0"
                        aria-hidden
                      />
                      <h2 className="font-semibold text-lg">
                        {assignment.title}
                      </h2>
                    </div>
                    <p className="text-sm text-gray-500">
                      {assignment.course.title}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <FaClock className="text-gray-400" aria-hidden />
                        Due:{" "}
                        <time dateTime={assignment.dueDate.toISOString()}>
                          {DATE_FORMAT.format(assignment.dueDate)}
                        </time>
                      </span>
                      <span>Max Score: {assignment.maxScore}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${statusColor}`}
                    >
                      {statusLabel}
                    </span>
                    {isGraded && submission?.score != null && (
                      <span className="text-sm font-medium flex items-center gap-1">
                        <FaCheckCircle
                          className="text-green-600"
                          aria-hidden
                        />
                        {submission.score}/{assignment.maxScore}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}