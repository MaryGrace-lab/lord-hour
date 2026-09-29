import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { FaQuestionCircle } from "react-icons/fa";

export const revalidate = 30;

export default async function TeacherQuizzesPage() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== Role.TEACHER) {
    redirect("/bible-college/portal/login");
  }
  const teacherId = session.user.id;

  const quizzes = await prisma.quiz.findMany({
    where: {
      course: { teachers: { some: { id: teacherId } } },
    },
    include: {
      course: { select: { id: true, title: true } },
      _count: { select: { questions: true, attempts: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
        <FaQuestionCircle className="text-accent" aria-hidden />
        My Quizzes
      </h1>

      {quizzes.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">
          No quizzes created yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <h2 className="font-semibold text-lg">{quiz.title}</h2>
                <span
                  className={`shrink-0 px-2 py-1 text-xs rounded-full ${
                    quiz.status === "PUBLISHED"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {quiz.status === "PUBLISHED" ? "Published" : "Draft"}
                </span>
              </div>
              <p className="text-sm text-gray-500">{quiz.course.title}</p>
              <p className="text-sm text-gray-600 mt-2">
                Questions: {quiz._count.questions} · Attempts:{" "}
                {quiz._count.attempts}
              </p>
              <div className="mt-3 flex gap-3">
                <Link
                  href={`/teacher/courses/${quiz.course.id}/quizzes/${quiz.id}`}
                  className="text-accent hover:underline text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                >
                  Manage Questions
                </Link>
                <Link
                  href={`/teacher/courses/${quiz.course.id}/quizzes/${quiz.id}/results`}
                  className="text-accent hover:underline text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                >
                  Results
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}