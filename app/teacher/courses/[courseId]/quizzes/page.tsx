import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { QuizStatus, Role } from "@prisma/client";
import { deleteQuiz, publishQuiz } from "@/lib/teacher-actions";
import { ServerActionForm } from "@/components/forms/ServerActionForm";
import { BackToCourse } from "@/components/teacher/BackToCourse";
import { z } from "zod";

const cuidSchema = z.string().cuid();

export const revalidate = 30;

export default async function CourseQuizzesPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const parsedId = cuidSchema.safeParse(courseId);
  if (!parsedId.success) notFound();

  const session = await auth();
  if (!session?.user?.id || session.user.role !== Role.TEACHER) {
    redirect("/bible-college/portal/login");
  }
  const teacherId = session.user.id;

  const course = await prisma.course.findFirst({
    where: {
      id: parsedId.data,
      teachers: { some: { id: teacherId } },
    },
    include: {
      quizzes: {
        include: {
          _count: { select: { questions: true, attempts: true } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!course) notFound();

  return (
    <div className="space-y-6">
      <BackToCourse courseId={courseId} courseTitle={course.title} />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-xl font-bold text-primary">
          Quizzes · {course.title}
        </h1>
        <Link
          href={`/teacher/courses/${courseId}/quizzes/new`}
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-light text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          + New Quiz
        </Link>
      </div>

      {course.quizzes.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">
          No quizzes yet. Create your first quiz.
        </div>
      ) : (
        <div className="space-y-4">
          {course.quizzes.map((quiz) => {
            const isPublished = quiz.status === QuizStatus.PUBLISHED;
            return (
              <div
                key={quiz.id}
                className="bg-white rounded-lg shadow-sm p-6"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h2 className="font-semibold text-lg">{quiz.title}</h2>
                  <span
                    className={`shrink-0 px-2 py-1 text-xs rounded-full ${
                      isPublished
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {isPublished ? "Published" : "Draft"}
                  </span>
                </div>
                {quiz.description && (
                  <p className="text-sm text-gray-600 mb-2 whitespace-pre-wrap break-words">
                    {quiz.description}
                  </p>
                )}
                <p className="text-sm text-gray-600">
                  Questions: {quiz._count.questions} · Attempts:{" "}
                  {quiz._count.attempts}
                </p>

                <div className="mt-3 flex flex-wrap gap-3 items-center">
                  <Link
                    href={`/teacher/courses/${courseId}/quizzes/${quiz.id}`}
                    className="text-accent hover:underline text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                  >
                    Manage Questions
                  </Link>
                  <Link
                    href={`/teacher/courses/${courseId}/quizzes/${quiz.id}/results`}
                    className="text-accent hover:underline text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                  >
                    Results
                  </Link>
                  <ServerActionForm
                    action={publishQuiz}
                    hiddenFields={{ quizId: quiz.id }}
                    confirmMessage={
                      isPublished
                        ? "Unpublish this quiz? Students will no longer see it."
                        : "Publish this quiz? Students in this course will be able to take it."
                    }
                    successMessage={
                      isPublished ? "Quiz unpublished" : "Quiz published"
                    }
                    pendingLabel="Updating..."
                    buttonLabel={isPublished ? "Unpublish" : "Publish"}
                    buttonClassName={`text-sm font-medium ${
                      isPublished
                        ? "text-amber-600 hover:text-amber-800"
                        : "text-green-600 hover:text-green-800"
                    }`}
                  />
                  <ServerActionForm
                    action={deleteQuiz}
                    hiddenFields={{ quizId: quiz.id }}
                    confirmMessage="Delete this quiz and all its questions and attempts? This cannot be undone."
                    successMessage="Quiz deleted"
                    pendingLabel="Deleting..."
                    buttonLabel="Delete"
                    buttonClassName="text-sm font-medium text-red-600 hover:text-red-800 focus-visible:ring-red-600"
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}