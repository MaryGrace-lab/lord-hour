import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { updateLesson } from "@/lib/teacher-actions";

export default async function LessonDetailPage({
  params,
}: {
  params: Promise<{ courseId: string; lessonId: string }>;
}) {
  const { courseId, lessonId } = await params;
  const session = await auth();
  const teacherId = session?.user.id;

  const lesson = await prisma.lesson.findFirst({
    where: {
      id: lessonId,
      module: { courseId, course: { teachers: { some: { id: teacherId } } } },
    },
    include: { module: true },
  });

  if (!lesson) return <div>Lesson not found or access denied.</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-primary">{lesson.title}</h3>
        <Link
          href={`/teacher/courses/${courseId}/lessons`}
          className="text-accent hover:underline"
        >
          ← Back to Lessons
        </Link>
      </div>

      <form action={updateLesson} className="bg-white rounded-lg shadow-sm p-6 space-y-4">
        <input type="hidden" name="lessonId" value={lesson.id} />
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input name="title" defaultValue={lesson.title} className="w-full border px-3 py-2 rounded-md" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Content</label>
          <textarea
            name="content"
            rows={10}
            defaultValue={lesson.content || ""}
            className="w-full border px-3 py-2 rounded-md"
          />
        </div>
        <button type="submit" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-light">
          Save Changes
        </button>
      </form>
    </div>
  );
}