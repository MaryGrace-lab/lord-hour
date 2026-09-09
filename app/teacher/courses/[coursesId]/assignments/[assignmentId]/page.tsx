import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { gradeSubmission } from "@/lib/teacher-actions";

export default async function AssignmentSubmissionsPage({
  params,
}: {
  params: Promise<{ courseId: string; assignmentId: string }>;
}) {
  const { courseId, assignmentId } = await params;
  const session = await auth();
  const teacherId = session?.user.id;

  const assignment = await prisma.assignment.findFirst({
    where: {
      id: assignmentId,
      courseId,
      course: { teachers: { some: { id: teacherId } } },
    },
    include: {
      submissions: { include: { student: true } },
    },
  });

  if (!assignment) return <div>Assignment not found or access denied.</div>;

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-primary">{assignment.title}</h3>
      <p className="text-gray-600">Submissions ({assignment.submissions.length})</p>

      <div className="space-y-4">
        {assignment.submissions.map((submission) => (
          <div key={submission.id} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{submission.student.username}</p>
                <p className="text-sm text-gray-500">Submitted: {submission.submittedAt.toLocaleString()}</p>
                {submission.content && <p className="mt-2 text-sm">{submission.content}</p>}
                {submission.fileUrl && (
                  <a href={submission.fileUrl} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                    Download file
                  </a>
                )}
              </div>
              <div>
                <p className="text-sm">Status: {submission.status}</p>
                {submission.score !== null && (
                  <p className="text-sm">Score: {submission.score}/{assignment.maxScore}</p>
                )}
              </div>
            </div>
            <form action={gradeSubmission} className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input type="hidden" name="submissionId" value={submission.id} />
              <input
                name="score"
                type="number"
                placeholder="Score"
                min={0}
                max={assignment.maxScore}
                className="border px-3 py-2 rounded-md"
                required
              />
              <input
                name="feedback"
                placeholder="Feedback"
                className="border px-3 py-2 rounded-md sm:col-span-2"
              />
              <button type="submit" className="bg-accent text-primary px-4 py-2 rounded-md hover:bg-accent-light sm:col-span-3">
                Save Grade
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}