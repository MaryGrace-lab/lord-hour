import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { BackToCourse } from "@/components/teacher/BackToCourse";
import { z } from "zod";
import { FaChartBar } from "react-icons/fa";

const cuidSchema = z.string().cuid();

const DATE_TIME_FORMAT = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export const revalidate = 30;

export default async function QuizResultsPage({
  params,
}: {
  params: Promise<{ courseId: string; quizId: string }>;
}) {
  const { courseId, quizId } = await params;
  const pCourse = cuidSchema.safeParse(courseId);
  const pQuiz = cuidSchema.safeParse(quizId);
  if (!pCourse.success || !pQuiz.success) notFound();

  const session = await auth();
  if (!session?.user?.id || session.user.role !== Role.TEACHER) {
    redirect("/bible-college/portal/login");
  }
  const teacherId = session.user.id;

  const quiz = await prisma.quiz.findFirst({
    where: {
      id: pQuiz.data,
      courseId: pCourse.data,
      course: { teachers: { some: { id: teacherId } } },
    },
    select: {
      id: true,
      title: true,
      passingScore: true,
      course: { select: { id: true, title: true } },
      questions: { select: { marks: true } },
      attempts: {
        orderBy: { attemptedAt: "desc" },
        select: {
          id: true,
          score: true,
          passed: true,
          attemptedAt: true,
          student: {
            select: {
              username: true,
              name: true,
              studentProfile: {
                select: { firstName: true, lastName: true, studentId: true },
              },
            },
          },
        },
      },
    },
  });

  if (!quiz) notFound();

  const totalMarks = quiz.questions.reduce((sum, q) => sum + q.marks, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <BackToCourse
          courseId={courseId}
          courseTitle={quiz.course.title}
        />
        <Link
          href={`/teacher/courses/${courseId}/quizzes`}
          className="text-sm text-accent hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
        >
          All Quizzes
        </Link>
      </div>

      <h1 className="text-xl font-bold text-primary flex items-center gap-2">
        <FaChartBar className="text-accent" aria-hidden />
        {quiz.title} — Results
      </h1>

      <p className="text-sm text-gray-600">
        Total marks: {totalMarks} · Passing: {quiz.passingScore}%
      </p>

      {quiz.attempts.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">
          No attempts yet.
        </div>
      ) : (
        <>
          <div className="hidden md:block bg-white rounded-lg shadow-sm overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <caption className="sr-only">
                Quiz attempts. {quiz.attempts.length} attempt
                {quiz.attempts.length === 1 ? "" : "s"}.
              </caption>
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    Student
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    Score
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    Result
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    Attempted
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {quiz.attempts.map((attempt) => {
                  const displayName =
                    [
                      attempt.student.studentProfile?.firstName,
                      attempt.student.studentProfile?.lastName,
                    ]
                      .filter(Boolean)
                      .join(" ") ||
                    attempt.student.name ||
                    attempt.student.username;
                  const percentage =
                    totalMarks === 0
                      ? 0
                      : Math.round((attempt.score / totalMarks) * 100);
                  return (
                    <tr key={attempt.id}>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium">{displayName}</p>
                        <p className="text-xs text-gray-500">
                          @{attempt.student.username}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {attempt.score}/{totalMarks}{" "}
                        <span className="text-gray-500">
                          ({percentage}%)
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {attempt.passed ? (
                          <span className="text-green-600 text-sm font-medium">
                            Passed
                          </span>
                        ) : (
                          <span className="text-red-600 text-sm font-medium">
                            Failed
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <time dateTime={attempt.attemptedAt.toISOString()}>
                          {DATE_TIME_FORMAT.format(attempt.attemptedAt)}
                        </time>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="md:hidden space-y-3">
            {quiz.attempts.map((attempt) => {
              const displayName =
                [
                  attempt.student.studentProfile?.firstName,
                  attempt.student.studentProfile?.lastName,
                ]
                  .filter(Boolean)
                  .join(" ") ||
                attempt.student.name ||
                attempt.student.username;
              const percentage =
                totalMarks === 0
                  ? 0
                  : Math.round((attempt.score / totalMarks) * 100);
              return (
                <div
                  key={attempt.id}
                  className="bg-white rounded-lg shadow-sm p-4"
                >
                  <div className="flex justify-between items-start gap-3 mb-1">
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 truncate">
                        {displayName}
                      </p>
                      <p className="text-xs text-gray-500">
                        @{attempt.student.username}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 text-sm font-medium ${
                        attempt.passed
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {attempt.passed ? "Passed" : "Failed"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">
                    Score: {attempt.score}/{totalMarks} ({percentage}%)
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    <time dateTime={attempt.attemptedAt.toISOString()}>
                      {DATE_TIME_FORMAT.format(attempt.attemptedAt)}
                    </time>
                  </p>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}