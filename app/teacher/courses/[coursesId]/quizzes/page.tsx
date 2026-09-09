import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { deleteQuiz, publishQuiz } from "@/lib/teacher-actions";
import { ConfirmDeleteButton } from "@/components/ConfirmDeleteButton";

export default async function CourseQuizzesPage({
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
      quizzes: { include: { _count: { select: { questions: true, attempts: true } } } },
    },
  });

  if (!course) return <div>Course not found or access denied.</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-primary">Quizzes</h3>
        <Link
          href={`/teacher/courses/${courseId}/quizzes/new`}
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-light"
        >
          + New Quiz
        </Link>
      </div>
      {course.quizzes.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">
          No quizzes yet.
        </div>
      ) : (
        <div className="space-y-4">
          {course.quizzes.map((quiz) => (
            <div key={quiz.id} className="bg-white rounded-lg shadow-sm p-6">
              <h4 className="font-semibold">{quiz.title}</h4>
              <p className="text-sm text-gray-600">{quiz.description}</p>
              <p className="text-sm">Questions: {quiz._count.questions}</p>
              <p className="text-sm">Attempts: {quiz._count.attempts}</p>
              <p className="text-sm">Status: {quiz.status}</p>
              <div className="mt-3 flex gap-3 items-center">
                <Link
                  href={`/teacher/courses/${courseId}/quizzes/${quiz.id}`}
                  className="text-accent hover:underline"
                >
                  Manage Questions
                </Link>
                <Link
                  href={`/teacher/courses/${courseId}/quizzes/${quiz.id}/results`}
                  className="text-accent hover:underline"
                >
                  Results
                </Link>
                <form action={publishQuiz}>
                  <input type="hidden" name="quizId" value={quiz.id} />
                  <button className="text-green-600 hover:text-green-800">
                    {quiz.status === "PUBLISHED" ? "Unpublish" : "Publish"}
                  </button>
                </form>
                <ConfirmDeleteButton
                  formAction={deleteQuiz}
                  hiddenFields={{ quizId: quiz.id }}
                  confirmMessage="Delete this quiz? This action cannot be undone."
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