import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export default async function QuizResultsPage({
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
      attempts: { include: { student: true } },
    },
  });

  if (!quiz) return <div>Quiz not found or access denied.</div>;

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-primary">{quiz.title} - Results</h3>
      {quiz.attempts.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">
          No attempts yet.
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Attempted At</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {quiz.attempts.map((attempt) => (
                <tr key={attempt.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{attempt.student.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{attempt.score}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {attempt.passed ? (
                      <span className="text-green-600">Passed</span>
                    ) : (
                      <span className="text-red-600">Failed</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{attempt.attemptedAt.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}