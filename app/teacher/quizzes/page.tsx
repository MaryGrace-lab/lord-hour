import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { FaQuestionCircle } from "react-icons/fa";

export default async function TeacherQuizzesPage() {
  const session = await auth();
  if (!session?.user?.id) {
    return <div>Not authenticated</div>;
  }
  const teacherId = session.user.id;

  const quizzes = await prisma.quiz.findMany({
    where: {
      course: {
        teachers: { some: { id: teacherId } },
      },
    },
    include: {
      course: true,
      _count: { select: { questions: true, attempts: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-primary">My Quizzes</h2>
      {quizzes.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">
          No quizzes created yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{quiz.title}</h3>
                  <p className="text-sm text-gray-500">{quiz.course.title}</p>
                  <p className="text-sm text-gray-600 mt-1">Questions: {quiz._count.questions}</p>
                  <p className="text-sm text-gray-600">Attempts: {quiz._count.attempts}</p>
                  <p className="text-sm text-gray-600">Status: {quiz.status}</p>
                </div>
                <FaQuestionCircle className="text-accent text-2xl" />
              </div>
              <div className="mt-3 flex gap-3">
                <Link
                  href={`/teacher/courses/${quiz.courseId}/quizzes/${quiz.id}`}
                  className="text-accent hover:underline"
                >
                  Manage Questions
                </Link>
                <Link
                  href={`/teacher/courses/${quiz.courseId}/quizzes/${quiz.id}/results`}
                  className="text-accent hover:underline"
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