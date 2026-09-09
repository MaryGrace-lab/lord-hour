import { createAssignment } from "@/lib/teacher-actions";

export default async function NewAssignmentPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  return (
    <div className="max-w-md mx-auto">
      <h3 className="text-xl font-bold text-primary mb-4">Create Assignment</h3>
      <form action={createAssignment} className="bg-white rounded-lg shadow-sm p-6 space-y-4">
        <input type="hidden" name="courseId" value={courseId} />
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input name="title" className="w-full border px-3 py-2 rounded-md" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Instructions</label>
          <textarea name="description" rows={4} className="w-full border px-3 py-2 rounded-md" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Due Date</label>
            <input name="dueDate" type="datetime-local" className="w-full border px-3 py-2 rounded-md" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Maximum Score</label>
            <input name="maxScore" type="number" defaultValue={20} className="w-full border px-3 py-2 rounded-md" required />
          </div>
        </div>
        <button type="submit" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-light">
          Create Assignment
        </button>
      </form>
    </div>
  );
}