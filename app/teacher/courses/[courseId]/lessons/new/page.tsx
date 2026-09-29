import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { createLesson } from "@/lib/teacher-actions";
import { BackToCourse } from "@/components/teacher/BackToCourse";
import { z } from "zod";

const cuidSchema = z.string().cuid();

export default async function NewLessonPage({
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
    include: { modules: { select: { id: true, title: true } } },
  });

  if (!course) notFound();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <BackToCourse courseId={courseId} courseTitle={course.title} />

      <h1 className="text-xl font-bold text-primary">Create Lesson</h1>

      {course.modules.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-6 text-center text-gray-600">
          <p>This course has no modules yet.</p>
          <p className="mt-2 text-sm">
            Go back to the course and create a module first.
          </p>
        </div>
      ) : (
        <form
          action={createLesson}
          className="bg-white rounded-lg shadow-sm p-6 space-y-4"
        >
          <input type="hidden" name="courseId" value={courseId} />

          <div>
            <label
              htmlFor="new-lesson-module"
              className="block text-sm font-medium mb-1"
            >
              Module <span aria-hidden>*</span>
              <span className="sr-only">(required)</span>
            </label>
            <select
              id="new-lesson-module"
              name="moduleId"
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <option value="">Select module</option>
              {course.modules.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="new-lesson-title"
              className="block text-sm font-medium mb-1"
            >
              Lesson Title <span aria-hidden>*</span>
              <span className="sr-only">(required)</span>
            </label>
            <input
              id="new-lesson-title"
              name="title"
              required
              maxLength={200}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>

          <div>
            <label
              htmlFor="new-lesson-content"
              className="block text-sm font-medium mb-1"
            >
              Content
            </label>
            <textarea
              id="new-lesson-content"
              name="content"
              rows={8}
              maxLength={50000}
              placeholder="Write lesson content..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>

          <button
            type="submit"
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-light focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Save Lesson
          </button>
        </form>
      )}
    </div>
  );
}