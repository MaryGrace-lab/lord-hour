import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function StudentDetailPage({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = await params;
  const session = await auth();
  if (!session?.user?.id) return <div>Not authenticated</div>;
  const teacherId = session.user.id;

  const enrollments = await prisma.enrollment.findMany({
    where: {
      studentId,
      course: {
        teachers: { some: { id: teacherId } },
      },
    },
    include: {
      student: true, // <-- Fix: include the student relation
      course: {
        include: {
          assignments: {
            include: {
              submissions: { where: { studentId } },
            },
          },
          quizzes: {
            include: {
              attempts: { where: { studentId } },
            },
          },
        },
      },
    },
  });

  if (enrollments.length === 0) notFound();

  const student = enrollments[0].student;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-primary">{student.username}</h2>
        <Link href="/teacher/students" className="text-sm text-accent hover:underline">
          ← Back to Students
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="font-semibold mb-3">Student Information</h3>
          <p><span className="font-medium">Username:</span> {student.username}</p>
          <p><span className="font-medium">Role:</span> {student.role}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="font-semibold mb-3">Enrolled Courses</h3>
          <ul className="space-y-2">
            {enrollments.map((enrollment) => (
              <li key={enrollment.id}>
                {enrollment.course.title} ({enrollment.course.code})
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 md:col-span-2">
          <h3 className="font-semibold mb-3">Academic Records</h3>
          <div className="space-y-4">
            {enrollments.map((enrollment) => (
              <div key={enrollment.id} className="border-b pb-4">
                <h4 className="font-medium text-primary">{enrollment.course.title}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Assignments</p>
                    {enrollment.course.assignments.length === 0 ? (
                      <p className="text-sm text-gray-500">No assignments</p>
                    ) : (
                      <ul className="text-sm space-y-1">
                        {enrollment.course.assignments.map((assignment) => {
                          const submission = assignment.submissions[0];
                          return (
                            <li key={assignment.id}>
                              {assignment.title}:{" "}
                              {submission?.score !== null && submission?.score !== undefined
                                ? `${submission.score}/${assignment.maxScore}`
                                : "Not graded"}
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Quizzes</p>
                    {enrollment.course.quizzes.length === 0 ? (
                      <p className="text-sm text-gray-500">No quizzes</p>
                    ) : (
                      <ul className="text-sm space-y-1">
                        {enrollment.course.quizzes.map((quiz) => {
                          const attempt = quiz.attempts[0];
                          return (
                            <li key={quiz.id}>
                              {quiz.title}:{" "}
                              {attempt
                                ? `${attempt.score} (${attempt.passed ? "Passed" : "Failed"})`
                                : "Not attempted"}
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}