import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AssignmentStatus, Role, QuizStatus } from "@prisma/client";
import { z } from "zod";

const cuidSchema = z.string().cuid();

export default async function StudentDetailPage({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = await params;
  const parsedId = cuidSchema.safeParse(studentId);
  if (!parsedId.success) notFound();

  const session = await auth();
  if (!session?.user?.id || session.user.role !== Role.TEACHER) {
    redirect("/bible-college/portal/login");
  }
  const teacherId = session.user.id;

  const enrollments = await prisma.enrollment.findMany({
    where: {
      studentId: parsedId.data,
      course: { teachers: { some: { id: teacherId } } },
    },
    include: {
      student: {
        select: {
          id: true,
          username: true,
          name: true,
          studentProfile: {
            select: {
              firstName: true,
              lastName: true,
              studentId: true,
              email: true,
            },
          },
        },
      },
      course: {
        select: {
          id: true,
          title: true,
          assignments: {
            where: { status: AssignmentStatus.PUBLISHED },
            select: {
              id: true,
              title: true,
              maxScore: true,
              submissions: {
                where: { studentId: parsedId.data },
                select: { score: true, status: true },
              },
            },
          },
          quizzes: {
            where: { status: QuizStatus.PUBLISHED },
            select: {
              id: true,
              title: true,
              attempts: {
                where: { studentId: parsedId.data },
                orderBy: { attemptedAt: "desc" },
                select: { score: true, passed: true },
              },
            },
          },
        },
      },
    },
  });

  if (enrollments.length === 0) notFound();

  const student = enrollments[0].student;
  const displayName =
    [
      student.studentProfile?.firstName,
      student.studentProfile?.lastName,
    ]
      .filter(Boolean)
      .join(" ") ||
    student.name ||
    student.username;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-bold text-primary">{displayName}</h1>
        <Link
          href="/teacher/students"
          className="text-sm text-accent hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
        >
          ← Back to Students
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="font-semibold mb-3 text-primary">
            Student Information
          </h2>
          <dl className="space-y-2 text-sm">
            <div>
              <dt className="text-gray-500 inline">Username: </dt>
              <dd className="inline text-gray-900">{student.username}</dd>
            </div>
            {student.studentProfile?.studentId && (
              <div>
                <dt className="text-gray-500 inline">Student ID: </dt>
                <dd className="inline text-gray-900">
                  {student.studentProfile.studentId}
                </dd>
              </div>
            )}
            {student.studentProfile?.email && (
              <div>
                <dt className="text-gray-500 inline">Email: </dt>
                <dd className="inline text-gray-900 break-all">
                  {student.studentProfile.email}
                </dd>
              </div>
            )}
          </dl>
        </section>

        <section className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="font-semibold mb-3 text-primary">
            Enrolled Courses
          </h2>
          <ul className="space-y-1 text-sm">
            {enrollments.map((e) => (
              <li key={e.id} className="text-gray-900">
                {e.course.title}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="font-semibold mb-4 text-primary">
          Academic Records
        </h2>
        <div className="space-y-6">
          {enrollments.map((enrollment) => (
            <div
              key={enrollment.id}
              className="border-b pb-6 last:border-0 last:pb-0"
            >
              <h3 className="font-medium text-primary mb-3">
                {enrollment.course.title}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Assignments
                  </h4>
                  {enrollment.course.assignments.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      No assignments
                    </p>
                  ) : (
                    <ul className="text-sm space-y-1">
                      {enrollment.course.assignments.map((a) => {
                        const sub = a.submissions[0];
                        return (
                          <li key={a.id} className="text-gray-700">
                            {a.title}:{" "}
                            {sub?.score != null
                              ? `${sub.score}/${a.maxScore}`
                              : "Not graded"}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Quizzes
                  </h4>
                  {enrollment.course.quizzes.length === 0 ? (
                    <p className="text-sm text-gray-500">No quizzes</p>
                  ) : (
                    <ul className="text-sm space-y-1">
                      {enrollment.course.quizzes.map((q) => {
                        const attempt = q.attempts[0];
                        return (
                          <li key={q.id} className="text-gray-700">
                            {q.title}:{" "}
                            {attempt
                              ? `${attempt.score} (${
                                  attempt.passed ? "Passed" : "Failed"
                                })`
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
      </section>
    </div>
  );
}