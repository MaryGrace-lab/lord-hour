import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { addQuizQuestion, deleteQuizQuestion } from "@/lib/teacher-actions";

export default async function ManageQuizPage({
  params,
}: {
  params: Promise<{ courseId: string; quizId: string }>;
}) {
  const { courseId, quizId } = await params;
  const session = await auth();
  const teacherId = session?.user.id;

  const quiz = await prisma.quiz.findFirst({
    where: {
      id: quizId,
      courseId,
      course: { teachers: { some: { id: teacherId } } },
    },
    include: {
      questions: { orderBy: { order: "asc" } },
    },
  });

  if (!quiz) return <div>Quiz not found or access denied.</div>;

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-primary">{quiz.title}</h3>
      <p className="text-gray-600">Add questions to this quiz.</p>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h4 className="font-medium mb-3">Add Question</h4>
        <form action={addQuizQuestion} className="space-y-3">
          <input type="hidden" name="quizId" value={quizId} />
          <div>
            <label className="block text-sm font-medium mb-1">Question Text</label>
            <textarea name="questionText" className="w-full border px-3 py-2 rounded-md" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Question Type</label>
              <select name="questionType" className="w-full border px-3 py-2 rounded-md">
                <option value="multiple_choice">Multiple Choice</option>
                <option value="true_false">True/False</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Marks</label>
              <input name="marks" type="number" defaultValue={1} className="w-full border px-3 py-2 rounded-md" required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Options (for MCQ, JSON array)</label>
            <input name="options" placeholder='["Option A","Option B","Option C"]' className="w-full border px-3 py-2 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Correct Answer</label>
            <input name="correctAnswer" className="w-full border px-3 py-2 rounded-md" required />
          <p className="text-xs text-gray-500 mt-1">
            For MCQ: index or exact option text. For True/False: &quot;true&quot; or &quot;false&quot;.
          </p>
          </div>
          <button type="submit" className="bg-accent text-primary px-4 py-2 rounded-md hover:bg-accent-light">
            Add Question
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h4 className="font-medium mb-3">Questions ({quiz.questions.length})</h4>
        {quiz.questions.length === 0 ? (
          <p className="text-gray-500">No questions added yet.</p>
        ) : (
          <ul className="space-y-2">
            {quiz.questions.map((q, idx) => (
              <li key={q.id} className="flex justify-between items-start border-b pb-2">
                <div>
                  <p className="font-medium">Q{idx+1}: {q.questionText}</p>
                  <p className="text-sm text-gray-500">Marks: {q.marks}</p>
                </div>
                <form action={deleteQuizQuestion}>
                  <input type="hidden" name="questionId" value={q.id} />
                  <button className="text-red-600 hover:text-red-800">Delete</button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}