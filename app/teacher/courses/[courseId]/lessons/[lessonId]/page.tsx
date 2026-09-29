import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { updateLesson } from "@/lib/teacher-actions";
import { BackToCourse } from "@/components/teacher/BackToCourse";
import { z } from "zod";

const cuidSchema = z.string().cuid();

export default async function LessonDetailPage({
  params,
}: {
  params: Promise<{ courseId: string; lessonId: string }>;
}) {
  const { courseId, lessonId } = await params;
  const parsedCourseId = cuidSchema.safeParse(courseId);
  const parsedLessonId = cuidSchema.safeParse(lessonId);
  if (!parsedCourseId.success || !parsedLessonId.success) notFound();

  const session = await auth();
  if (!session?.user?.id || session.user.role !== Role.TEACHER) {
    redirect("/bible-college/portal/login");
  }
  const teacherId = session.user.id;

  const lesson = await prisma.lesson.findFirst({
    where: {
      id: parsedLessonId.data,
      module: {
        courseId: parsedCourseId.data,
        course: { teachers: { some: { id: teacherId } } },
      },
    },
    select: {
      id: true,
      title: true,
      content: true,
      module: {
        select: {
          title: true,
          course: { select: { id: true, title: true } },
        },
      },
    },
  });

  if (!lesson) notFound();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <BackToCourse
          courseId={courseId}
          courseTitle={lesson.module.course.title}
        />
        <Link
          href={`/teacher/courses/${courseId}/lessons`}
          className="text-sm text-accent hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
        >
          All Lessons
        </Link>
      </div>

      <h1 className="text-xl font-bold text-primary">
        Edit Lesson · {lesson.title}
      </h1>

      <form
        action={updateLesson}
        className="bg-white rounded-lg shadow-sm p-6 space-y-4"
      >
        <input type="hidden" name="lessonId" value={lesson.id} />

        <div>
          <label
            htmlFor="lesson-edit-title"
            className="block text-sm font-medium mb-1"
          >
            Title <span aria-hidden>*</span>
            <span className="sr-only">(required)</span>
          </label>
          <input
            id="lesson-edit-title"
            name="title"
            defaultValue={lesson.title}
            required
            maxLength={200}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
        </div>

        <div>
          <label
            htmlFor="lesson-edit-content"
            className="block text-sm font-medium mb-1"
          >
            Content
          </label>
          <textarea
            id="lesson-edit-content"
            name="content"
            rows={10}
            maxLength={50000}
            defaultValue={lesson.content || ""}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
        </div>

        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-light focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}