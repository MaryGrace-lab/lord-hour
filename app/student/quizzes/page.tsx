import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { QuizStatus, Role } from "@prisma/client";
import { FaQuestionCircle, FaClock, FaCheckCircle } from "react-icons/fa";

export const revalidate = 30;

export default async function StudentQuizzesPage() {
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

  const quizzes = await prisma.quiz.findMany({
    where: {
      courseId: { in: courseIds },
      status: QuizStatus.PUBLISHED,
    },
    include: {
      course: { select: { title: true } },
      _count: { select: { questions: true } },
      attempts: {
        where: { studentId },
        orderBy: { attemptedAt: "desc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const now = new Date();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-primary">My Quizzes</h1>

      {quizzes.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">
          <FaQuestionCircle
            className="text-gray-300 mx-auto mb-3"
            size={32}
            aria-hidden
          />
          <p>You have no available quizzes.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {quizzes.map((quiz) => {
            const lastAttempt = quiz.attempts[0];
            const attemptCount = quiz.attempts.length;
            const canAttempt = attemptCount < quiz.maxAttempts;

            const hasNotStarted =
              quiz.startDate && now < quiz.startDate;
            const hasClosed = quiz.endDate && now > quiz.endDate;

            return (
              <div
                key={quiz.id}
                className="bg-white rounded-lg shadow-sm p-6"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <FaQuestionCircle
                        className="text-accent shrink-0"
                        aria-hidden
                      />
                      <h2 className="font-semibold text-lg">
                        {quiz.title}
                      </h2>
                    </div>
                    <p className="text-sm text-gray-500">
                      {quiz.course.title}
                    </p>

                    <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-700">
                      <span>
                        <span className="font-medium">
                          {quiz._count.questions}
                        </span>{" "}
                        question{quiz._count.questions === 1 ? "" : "s"}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaClock className="text-gray-400" aria-hidden />
                        {quiz.durationMinutes} minutes
                      </span>
                      <span>
                        <span className="font-medium">Passing:</span>{" "}
                        {quiz.passingScore}%
                      </span>
                      <span>
                        <span className="font-medium">Attempts:</span>{" "}
                        {attemptCount}/{quiz.maxAttempts}
                      </span>
                    </div>

                    {lastAttempt && (
                      <p className="mt-3 text-sm">
                        <span className="font-medium">Last score:</span>{" "}
                        {lastAttempt.score}{" "}
                        {lastAttempt.passed ? (
                          <span className="text-green-600 font-medium">
                            Passed
                          </span>
                        ) : (
                          <span className="text-red-600 font-medium">
                            Failed
                          </span>
                        )}
                      </p>
                    )}
                  </div>

                  <div className="shrink-0">
                    {hasNotStarted ? (
                      <div className="text-sm text-gray-500">
                        Opens{" "}
                        <time dateTime={quiz.startDate!.toISOString()}>
                          {quiz.startDate!.toLocaleDateString()}
                        </time>
                      </div>
                    ) : hasClosed ? (
                      <div className="text-sm text-gray-500">
                        Quiz has closed
                      </div>
                    ) : canAttempt ? (
                      <Link
                        href={`/student/quizzes/${quiz.id}`}
                        className="inline-block bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-light text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      >
                        {lastAttempt ? "Retake Quiz" : "Start Quiz"}
                      </Link>
                    ) : (
                      <div className="flex items-center gap-2 text-sm text-green-700">
                        <FaCheckCircle aria-hidden /> Completed
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}