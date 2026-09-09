import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { deleteLesson } from "@/lib/teacher-actions";
import { ConfirmDeleteButton } from "@/components/ConfirmDeleteButton";

export default async function CourseLessonsPage({
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
      modules: {
        include: { lessons: { orderBy: { order: "asc" } } },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!course) return <div>Course not found or access denied.</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-primary">Lessons</h3>
        <Link
          href={`/teacher/courses/${courseId}/lessons/new`}
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-light"
        >
          + Add Lesson
        </Link>
      </div>

      {course.modules.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">
          No modules yet. Create a module first.
        </div>
      ) : (
        course.modules.map((module) => (
          <div key={module.id} className="bg-white rounded-lg shadow-sm p-6">
            <h4 className="font-semibold text-lg mb-3">{module.title}</h4>
            {module.lessons.length === 0 ? (
              <p className="text-gray-500 text-sm">No lessons in this module.</p>
            ) : (
              <ul className="space-y-2">
                {module.lessons.map((lesson) => (
                  <li key={lesson.id} className="flex justify-between items-center border-b pb-2">
                    <div>
                      <Link
                        href={`/teacher/courses/${courseId}/lessons/${lesson.id}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {lesson.title}
                      </Link>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Link
                        href={`/teacher/courses/${courseId}/lessons/${lesson.id}/edit`}
                        className="text-accent hover:underline"
                      >
                        Edit
                      </Link>
                      <ConfirmDeleteButton
                        formAction={deleteLesson}
                        hiddenFields={{ lessonId: lesson.id }}
                        confirmMessage="Delete this lesson? This action cannot be undone."
                      >
                        Delete
                      </ConfirmDeleteButton>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))
      )}
    </div>
  );
}