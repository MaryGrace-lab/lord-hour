import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AssignmentStatus, QuizStatus, Role } from "@prisma/client";
import {
  FaChartBar,
  FaQuestionCircle,
  FaClipboardList,
} from "react-icons/fa";

export const revalidate = 30;

export default async function StudentResultsPage() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== Role.STUDENT) {
    redirect("/bible-college/portal/login");
  }
  const studentId = session.user.id;

  const enrollments = await prisma.enrollment.findMany({
    where: { studentId },
    include: {
      course: {
        include: {
          quizzes: {
            where: { status: QuizStatus.PUBLISHED },
            include: {
              questions: { select: { marks: true } },
              attempts: {
                where: { studentId },
                orderBy: { attemptedAt: "desc" },
              },
            },
          },
          assignments: {
            where: { status: AssignmentStatus.PUBLISHED },
            include: {
              submissions: { where: { studentId } },
            },
          },
        },
      },
    },
    orderBy: { enrolledAt: "desc" },
  });

  const coursesWithResults = enrollments.filter((e) => {
    const hasQuizResults = e.course.quizzes.some(
      (q) => q.attempts.length > 0
    );
    const hasAssignmentResults = e.course.assignments.some(
      (a) =>
        a.submissions.length > 0 &&
        a.submissions[0].status === "GRADED"
    );
    return hasQuizResults || hasAssignmentResults;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <FaChartBar className="text-accent text-2xl" aria-hidden />
        <h1 className="text-2xl font-bold text-primary">My Results</h1>
      </div>

      {coursesWithResults.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">
          <FaChartBar
            className="text-gray-300 mx-auto mb-3"
            size={32}
            aria-hidden
          />
          <p>
            Your results will appear here after assessments have been graded.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {coursesWithResults.map(({ course }) => {
            const quizResults = course.quizzes
              .filter((q) => q.attempts.length > 0)
              .map((q) => {
                const totalMarks = q.questions.reduce(
                  (sum, x) => sum + x.marks,
                  0
                );
                const bestScore = Math.max(
                  ...q.attempts.map((a) => a.score)
                );
                const percentage =
                  totalMarks === 0
                    ? 0
                    : Math.round((bestScore / totalMarks) * 100);
                return {
                  id: q.id,
                  title: q.title,
                  bestScore,
                  totalMarks,
                  percentage,
                  passed: q.attempts.some((a) => a.passed),
                };
              });

            const assignmentResults = course.assignments
              .filter(
                (a) =>
                  a.submissions.length > 0 &&
                  a.submissions[0].status === "GRADED"
              )
              .map((a) => ({
                id: a.id,
                title: a.title,
                score: a.submissions[0].score ?? 0,
                maxScore: a.maxScore,
              }));

            return (
              <section
                key={course.id}
                className="bg-white rounded-lg shadow-sm p-6"
                aria-labelledby={`course-${course.id}-heading`}
              >
                <div className="flex items-start justify-between mb-4">
                  <h2
                    id={`course-${course.id}-heading`}
                    className="font-semibold text-lg"
                  >
                    {course.title}
                  </h2>
                  <Link
                    href={`/student/courses/${course.id}`}
                    className="text-sm text-accent hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                  >
                    View Course
                  </Link>
                </div>

                {quizResults.length > 0 && (
                  <div className="mb-4">
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                      <FaQuestionCircle className="text-accent" aria-hidden />{" "}
                      Quizzes
                    </h3>
                    <ul className="space-y-2">
                      {quizResults.map((r) => (
                        <li
                          key={r.id}
                          className="flex items-center justify-between text-sm border-b pb-2 gap-3"
                        >
                          <Link
                            href={`/student/quizzes/${r.id}`}
                            className="text-gray-800 hover:text-accent truncate focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                          >
                            {r.title}
                          </Link>
                          <span className="flex items-center gap-2 shrink-0">
                            <span className="font-medium">
                              {r.percentage}%
                            </span>
                            {r.passed ? (
                              <span className="text-green-600 text-xs font-medium">
                                Passed
                              </span>
                            ) : (
                              <span className="text-red-600 text-xs font-medium">
                                Failed
                              </span>
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {assignmentResults.length > 0 && (
                  <div>
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                      <FaClipboardList className="text-accent" aria-hidden />{" "}
                      Assignments
                    </h3>
                    <ul className="space-y-2">
                      {assignmentResults.map((r) => (
                        <li
                          key={r.id}
                          className="flex items-center justify-between text-sm border-b pb-2 gap-3"
                        >
                          <Link
                            href={`/student/assignments/${r.id}`}
                            className="text-gray-800 hover:text-accent truncate focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                          >
                            {r.title}
                          </Link>
                          <span className="font-medium shrink-0">
                            {r.score}/{r.maxScore}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}