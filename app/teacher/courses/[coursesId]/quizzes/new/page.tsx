import { createQuiz } from "@/lib/teacher-actions";

export default async function NewQuizPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  return (
    <div className="max-w-md mx-auto">
      <h3 className="text-xl font-bold text-primary mb-4">Create Quiz</h3>
      <form action={createQuiz} className="bg-white rounded-lg shadow-sm p-6 space-y-4">
        <input type="hidden" name="courseId" value={courseId} />
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input name="title" className="w-full border px-3 py-2 rounded-md" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea name="description" rows={3} className="w-full border px-3 py-2 rounded-md" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Time Limit (minutes)</label>
            <input name="durationMinutes" type="number" defaultValue={30} className="w-full border px-3 py-2 rounded-md" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Passing Score</label>
            <input name="passingScore" type="number" defaultValue={50} className="w-full border px-3 py-2 rounded-md" required />
          </div>
        </div>
        <button type="submit" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-light">
          Create Quiz
        </button>
      </form>
    </div>
  );
}