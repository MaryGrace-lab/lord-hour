import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EnrollmentStatus, Role } from "@prisma/client";
import { FaUsers, FaCheckCircle } from "react-icons/fa";
import { markEnrollmentComplete, revertEnrollmentCompletion } from "@/lib/teacher-actions";
import { ServerActionForm } from "@/components/forms/ServerActionForm";
import { BackToCourse } from "@/components/teacher/BackToCourse";
import { z } from "zod";

const cuidSchema = z.string().cuid();

const DATE_FORMAT = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export const revalidate = 30;

export default async function CourseStudentsPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const parsedId = cuidSchema.safeParse(courseId);
  if (!parsedId.success) notFound();

  const session = await auth();
  if (!session?.user?.id || session.user.role !== Role.TEACHER) {
    redirect("/bible-college/portal/login");
  }
  const teacherId = session.user.id;

  const course = await prisma.course.findFirst({
    where: {
      id: parsedId.data,
      teachers: { some: { id: teacherId } },
    },
    select: {
      id: true,
      title: true,
      modules: {
        select: {
          lessons: { select: { id: true } },
        },
      },
      enrollments: {
        orderBy: { enrolledAt: "desc" },
        select: {
          id: true,
          enrolledAt: true,
          status: true,
          completedAt: true,
          studentId: true,
          student: {
            select: {
              id: true,
              username: true,
              name: true,
              isActive: true,
              studentProfile: {
                select: {
                  firstName: true,
                  lastName: true,
                  studentId: true,
                  email: true,
                  phone: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!course) notFound();

  const totalLessons = course.modules.reduce(
    (sum, m) => sum + m.lessons.length,
    0
  );
  const allLessonIds = course.modules.flatMap((m) =>
    m.lessons.map((l) => l.id)
  );

  // Fetch all lesson completions for enrolled students in one query.
  const studentIds = course.enrollments.map((e) => e.studentId);
  const completions = await prisma.lessonCompletion.findMany({
    where: {
      studentId: { in: studentIds },
      lessonId: { in: allLessonIds },
    },
    select: { studentId: true, lessonId: true },
  });

  const completionsByStudent = new Map<string, Set<string>>();
  for (const c of completions) {
    if (!completionsByStudent.has(c.studentId)) {
      completionsByStudent.set(c.studentId, new Set());
    }
    completionsByStudent.get(c.studentId)!.add(c.lessonId);
  }

  const enrollments = course.enrollments;

  return (
    <div className="space-y-6">
      <BackToCourse courseId={courseId} courseTitle={course.title} />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-xl font-bold text-primary flex items-center gap-2">
          <FaUsers className="text-accent" aria-hidden />
          Students · {course.title}
        </h1>
        <p className="text-sm text-gray-500">
          {enrollments.length} student
          {enrollments.length === 1 ? "" : "s"} · {totalLessons} lesson
          {totalLessons === 1 ? "" : "s"} total
        </p>
      </div>

      {enrollments.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">
          <FaUsers
            className="text-gray-300 mx-auto mb-3"
            size={32}
            aria-hidden
          />
          <p>No students enrolled in this course yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {enrollments.map((e) => {
            const displayName =
              [
                e.student.studentProfile?.firstName,
                e.student.studentProfile?.lastName,
              ]
                .filter(Boolean)
                .join(" ") ||
              e.student.name ||
              e.student.username;

            const studentCompleted = completionsByStudent.get(e.studentId);
            const completedCount = studentCompleted
              ? allLessonIds.filter((id) => studentCompleted.has(id)).length
              : 0;
            const progress =
              totalLessons === 0
                ? 0
                : Math.round((completedCount / totalLessons) * 100);
            const isFullyDone =
              totalLessons > 0 && completedCount >= totalLessons;
            const isMarkedComplete =
              e.status === EnrollmentStatus.COMPLETED;

            return (
              <article
                key={e.id}
                className="bg-white rounded-lg shadow-sm p-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2 sm:block">
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 truncate">
                          {displayName}
                        </p>
                        <p className="text-xs text-gray-500">
                          @{e.student.username}
                          {e.student.studentProfile?.studentId
                            ? ` · ID: ${e.student.studentProfile.studentId}`
                            : ""}
                        </p>
                      </div>
                      {isMarkedComplete && (
                        <span className="sm:hidden shrink-0 inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-700">
                          <FaCheckCircle aria-hidden size={10} />
                          Completed
                        </span>
                      )}
                    </div>

                    {/* Progress */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                        <span>
                          {completedCount}/{totalLessons} lessons completed
                        </span>
                        <span>{progress}%</span>
                      </div>
                      <div
                        className="w-full bg-gray-200 rounded-full h-1.5"
                        role="progressbar"
                        aria-valuenow={progress}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`Progress for ${displayName}`}
                      >
                        <div
                          className={`h-1.5 rounded-full transition-all ${
                            isFullyDone ? "bg-green-500" : "bg-accent"
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {e.student.studentProfile?.email && (
                      <p className="text-xs text-gray-500 mt-2 truncate">
                        {e.student.studentProfile.email}
                      </p>
                    )}
                  </div>

                  <div className="shrink-0 flex flex-col items-stretch sm:items-end gap-2">
                    {isMarkedComplete && (
                      <span className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                        <FaCheckCircle aria-hidden size={10} />
                        Completed{" "}
                        {e.completedAt && (
                          <time dateTime={e.completedAt.toISOString()}>
                            {DATE_FORMAT.format(e.completedAt)}
                          </time>
                        )}
                      </span>
                    )}

                    {isMarkedComplete ? (
                      <ServerActionForm
                        action={revertEnrollmentCompletion}
                        hiddenFields={{ enrollmentId: e.id }}
                        confirmMessage={`Revert course completion for ${displayName}? The student will lose their "completed" status.`}
                        successMessage="Completion reverted"
                        pendingLabel="Reverting..."
                        buttonLabel="Undo completion"
                        buttonClassName="text-sm font-medium text-amber-600 hover:text-amber-800"
                      />
                    ) : isFullyDone ? (
                      <ServerActionForm
                        action={markEnrollmentComplete}
                        hiddenFields={{ enrollmentId: e.id }}
                        confirmMessage={`Mark ${displayName} as having completed "${course.title}"? They will be notified by email and their student portal will show a completion banner.`}
                        successMessage="Course marked complete"
                        pendingLabel="Marking..."
                        buttonLabel="Mark course complete"
                        buttonClassName="bg-green-600 text-white px-3 py-1.5 rounded-md hover:bg-green-700 text-sm font-medium focus-visible:ring-green-600"
                      />
                    ) : (
                      <p className="text-xs text-gray-500 text-center sm:text-right max-w-[180px]">
                        Student must complete all {totalLessons} lesson
                        {totalLessons === 1 ? "" : "s"} before the course can
                        be marked complete.
                      </p>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <p className="text-xs text-gray-500 text-center">
        Marking a course complete sends the student an email with a WhatsApp
        link to request their certificate.
      </p>
    </div>
  );
}