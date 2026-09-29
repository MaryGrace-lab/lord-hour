import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { createQuiz } from "@/lib/teacher-actions";
import { BackToCourse } from "@/components/teacher/BackToCourse";
import { z } from "zod";

const cuidSchema = z.string().cuid();

export default async function NewQuizPage({
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
    select: { id: true, title: true },
  });

  if (!course) notFound();

  return (
    <div className="max-w-md mx-auto space-y-6">
      <BackToCourse courseId={courseId} courseTitle={course.title} />

      <h1 className="text-xl font-bold text-primary">
        Create Quiz · {course.title}
      </h1>

      <form
        action={createQuiz}
        className="bg-white rounded-lg shadow-sm p-6 space-y-4"
      >
        <input type="hidden" name="courseId" value={course.id} />

        <div>
          <label
            htmlFor="quiz-title"
            className="block text-sm font-medium mb-1"
          >
            Title <span aria-hidden>*</span>
            <span className="sr-only">(required)</span>
          </label>
          <input
            id="quiz-title"
            name="title"
            required
            maxLength={200}
            className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
        </div>

        <div>
          <label
            htmlFor="quiz-desc"
            className="block text-sm font-medium mb-1"
          >
            Description
          </label>
          <textarea
            id="quiz-desc"
            name="description"
            rows={3}
            maxLength={2000}
            className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="quiz-duration"
              className="block text-sm font-medium mb-1"
            >
              Time Limit (min)
            </label>
            <input
              id="quiz-duration"
              name="durationMinutes"
              type="number"
              defaultValue={30}
              min={1}
              max={600}
              required
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>
          <div>
            <label
              htmlFor="quiz-passing"
              className="block text-sm font-medium mb-1"
            >
              Passing Score (%)
            </label>
            <input
              id="quiz-passing"
              name="passingScore"
              type="number"
              defaultValue={50}
              min={0}
              max={100}
              required
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary-light focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          Create Quiz
        </button>
      </form>

      <p className="text-xs text-gray-500 text-center">
        After creating the quiz, add questions and then publish it.
      </p>
    </div>
  );
}