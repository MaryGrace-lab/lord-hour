import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { deleteModule, deleteLesson } from "@/lib/teacher-actions";
import { ConfirmDeleteButton } from "@/components/ConfirmDeleteButton";
import { AddModuleForm } from "@/components/teacher/AddModuleForm";
import { AddLessonForm } from "@/components/teacher/AddLessonForm";
import { BackToCourse } from "@/components/teacher/BackToCourse";
import { z } from "zod";

const cuidSchema = z.string().cuid();

export default async function CourseLessonsPage({
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
      modules: {
        include: { lessons: { orderBy: { order: "asc" } } },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!course) notFound();

  return (
    <div className="space-y-6">
      <BackToCourse courseId={courseId} courseTitle={course.title} />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-xl font-bold text-primary">
          Lessons · {course.title}
        </h1>
        <Link
          href={`/teacher/courses/${courseId}/lessons/new`}
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-light text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          + Add Lesson
        </Link>
      </div>

      <section
        className="bg-white rounded-lg shadow-sm p-6"
        aria-labelledby="add-module-heading"
      >
        <h2
          id="add-module-heading"
          className="font-semibold mb-3 text-primary"
        >
          Add Module
        </h2>
        <AddModuleForm courseId={course.id} />
      </section>

      {course.modules.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">
          No modules yet. Create a module first.
        </div>
      ) : (
        course.modules.map((courseModule) => (
          <section
            key={courseModule.id}
            className="bg-white rounded-lg shadow-sm p-6"
            aria-labelledby={`module-${courseModule.id}-heading`}
          >
            <div className="flex justify-between items-start mb-4 gap-3">
              <h2
                id={`module-${courseModule.id}-heading`}
                className="font-semibold text-lg"
              >
                {courseModule.title}
              </h2>
              <ConfirmDeleteButton
                formAction={deleteModule}
                hiddenFields={{ moduleId: courseModule.id }}
                confirmMessage="Delete this module and all its lessons? This action cannot be undone."
              >
                Delete Module
              </ConfirmDeleteButton>
            </div>

            {courseModule.lessons.length === 0 ? (
              <p className="text-gray-500 text-sm">
                No lessons in this module.
              </p>
            ) : (
              <ul className="space-y-2">
                {courseModule.lessons.map((lesson) => (
                  <li
                    key={lesson.id}
                    className="flex justify-between items-center border-b pb-2 gap-3"
                  >
                    <Link
                      href={`/teacher/courses/${courseId}/lessons/${lesson.id}`}
                      className="font-medium text-primary hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                    >
                      {lesson.title}
                    </Link>
                    <ConfirmDeleteButton
                      formAction={deleteLesson}
                      hiddenFields={{ lessonId: lesson.id }}
                      confirmMessage="Delete this lesson? This action cannot be undone."
                    >
                      Delete
                    </ConfirmDeleteButton>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Add a lesson to this module
              </h3>
              <AddLessonForm
                courseId={course.id}
                moduleId={courseModule.id}
              />
            </div>
          </section>
        ))
      )}
    </div>
  );
}