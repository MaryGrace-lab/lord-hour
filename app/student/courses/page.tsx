import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EnrollmentStatus, Role } from "@prisma/client";
import { FaCheckCircle } from "react-icons/fa";

export const revalidate = 30;

export default async function StudentCoursesPage() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== Role.STUDENT) {
    redirect("/bible-college/portal/login");
  }
  const studentId = session.user.id;

  const [enrollments, completions] = await Promise.all([
    prisma.enrollment.findMany({
      where: { studentId },
      include: {
        course: {
          include: {
            teachers: { select: { username: true } },
            modules: {
              include: { lessons: { select: { id: true } } },
            },
            _count: { select: { quizzes: true, assignments: true } },
          },
        },
      },
      orderBy: { enrolledAt: "desc" },
    }),
    prisma.lessonCompletion.findMany({
      where: { studentId },
      select: { lessonId: true },
    }),
  ]);

  const completedLessonIds = new Set(completions.map((c) => c.lessonId));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-primary">My Courses</h1>

      {enrollments.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">
          You are not enrolled in any courses yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {enrollments.map((enrollment) => {
            const { course } = enrollment;
            const isComplete =
              enrollment.status === EnrollmentStatus.COMPLETED;

            const allLessonIds = course.modules.flatMap((m) =>
              m.lessons.map((l) => l.id)
            );
            const totalLessons = allLessonIds.length;
            const completedLessons = allLessonIds.filter((id) =>
              completedLessonIds.has(id)
            ).length;
            const progress =
              totalLessons === 0
                ? 0
                : Math.round((completedLessons / totalLessons) * 100);

            return (
              <div
                key={course.id}
                className="bg-white rounded-lg shadow-sm p-6 flex flex-col"
              >
                <div className="flex items-start justify-between gap-2">
                  <h2 className="font-semibold text-lg">{course.title}</h2>
                  {isComplete && (
                    <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-700">
                      <FaCheckCircle aria-hidden size={10} />
                      Completed
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                  {course.description || "No description"}
                </p>

                <div className="mt-4 text-sm text-gray-600 space-y-1">
                  <p>
                    <span className="font-medium">Instructor:</span>{" "}
                    {course.teachers.map((t) => t.username).join(", ") ||
                      "Not assigned"}
                  </p>
                  <p>
                    <span className="font-medium">{totalLessons}</span>{" "}
                    lesson{totalLessons === 1 ? "" : "s"} ·{" "}
                    <span className="font-medium">
                      {course._count.quizzes}
                    </span>{" "}
                    quiz{course._count.quizzes === 1 ? "" : "zes"} ·{" "}
                    <span className="font-medium">
                      {course._count.assignments}
                    </span>{" "}
                    assignment{course._count.assignments === 1 ? "" : "s"}
                  </p>
                </div>

                <div
                  className="w-full bg-gray-200 rounded-full h-2 mt-4 mb-2"
                  role="progressbar"
                  aria-valuenow={progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`Progress for ${course.title}`}
                >
                  <div
                    className={`h-2 rounded-full transition-all ${
                      isComplete ? "bg-green-500" : "bg-accent"
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600 mb-4">
                  {completedLessons}/{totalLessons} lessons · {progress}%
                </p>

                <Link
                  href={`/student/courses/${course.id}`}
                  className="mt-auto bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-light text-sm text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {isComplete
                    ? "Review Course"
                    : progress === 0
                    ? "Start Course"
                    : "Continue Course"}
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}