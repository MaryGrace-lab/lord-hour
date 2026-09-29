import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { deleteQuizQuestion } from "@/lib/teacher-actions";
import { ServerActionForm } from "@/components/forms/ServerActionForm";
import { AddQuestionForm } from "@/components/teacher/AddQuestionForm";
import { z } from "zod";

const cuidSchema = z.string().cuid();

export const revalidate = 30;

export default async function ManageQuizPage({
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
    include: {
      questions: { orderBy: { order: "asc" } },
    },
  });

  if (!quiz) notFound();

  return (
    <div className="space-y-6">
      <Link
        href={`/teacher/courses/${courseId}`}
        className="text-sm text-accent hover:underline inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
      >
        ← Back to Course
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-xl font-bold text-primary">{quiz.title}</h1>
        <Link
          href={`/teacher/courses/${courseId}/quizzes`}
          className="text-sm text-accent hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
        >
          All Quizzes
        </Link>
      </div>

      <section
        className="bg-white rounded-lg shadow-sm p-6"
        aria-labelledby="add-question-heading"
      >
        <h2
          id="add-question-heading"
          className="font-medium mb-3 text-primary"
        >
          Add Question
        </h2>
        <AddQuestionForm quizId={quizId} />
      </section>

      <section
        className="bg-white rounded-lg shadow-sm p-6"
        aria-labelledby="questions-heading"
      >
        <h2
          id="questions-heading"
          className="font-medium mb-3 text-primary"
        >
          Questions ({quiz.questions.length})
        </h2>
        {quiz.questions.length === 0 ? (
          <p className="text-gray-500 text-sm">No questions added yet.</p>
        ) : (
          <ul className="space-y-2">
            {quiz.questions.map((q, idx) => (
              <li
                key={q.id}
                className="flex justify-between items-start border-b pb-2 gap-3"
              >
                <div className="min-w-0">
                  <p className="font-medium">
                    Q{idx + 1}: {q.questionText}
                  </p>
                  <p className="text-sm text-gray-500">
                    Type: {q.questionType} · Marks: {q.marks}
                  </p>
                </div>
                <ServerActionForm
                  action={deleteQuizQuestion}
                  hiddenFields={{ questionId: q.id }}
                  confirmMessage="Delete this question? This action cannot be undone."
                  successMessage="Question deleted"
                  pendingLabel="Deleting..."
                  buttonLabel="Delete"
                  buttonClassName="text-red-600 hover:text-red-800 text-sm font-medium focus-visible:ring-red-600"
                />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}