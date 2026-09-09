import { createLesson } from "@/lib/teacher-actions";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export default async function NewLessonPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const session = await auth();
  const teacherId = session?.user.id;

  // Ensure course exists and belongs to teacher
  const course = await prisma.course.findFirst({
    where: {
      id: courseId,
      teachers: { some: { id: teacherId } },
    },
    include: { modules: true },
  });

  if (!course) return <div>Course not found or access denied.</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <h3 className="text-xl font-bold text-primary mb-4">Create Lesson</h3>
      <form action={createLesson} className="bg-white rounded-lg shadow-sm p-6 space-y-4">
        <input type="hidden" name="courseId" value={courseId} />
        <div>
          <label className="block text-sm font-medium mb-1">Module</label>
          <select name="moduleId" className="w-full border px-3 py-2 rounded-md" required>
            <option value="">Select module</option>
            {course.modules.map((m) => (
              <option key={m.id} value={m.id}>{m.title}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Lesson Title</label>
          <input name="title" className="w-full border px-3 py-2 rounded-md" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Content</label>
          <textarea
            name="content"
            rows={8}
            placeholder="Write lesson content..."
            className="w-full border px-3 py-2 rounded-md"
          />
        </div>
        <button type="submit" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-light">
          Save Lesson
        </button>
      </form>
    </div>
  );
}