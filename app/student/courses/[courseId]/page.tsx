import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AssignmentStatus, QuizStatus, Role } from "@prisma/client";
import { FaCheckCircle, FaCircle, FaArrowRight } from "react-icons/fa";
import { z } from "zod";

const cuidSchema = z.string().cuid();

const DATE_FORMAT = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export default async function StudentCoursePage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const parsedId = cuidSchema.safeParse(courseId);
  if (!parsedId.success) notFound();

  const session = await auth();
  if (!session?.user?.id || session.user.role !== Role.STUDENT) {
    redirect("/bible-college/portal/login");
  }
  const studentId = session.user.id;

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      studentId_courseId: { studentId, courseId: parsedId.data },
    },
    select: { id: true },
  });
  if (!enrollment) notFound();

  const course = await prisma.course.findUnique({
    where: { id: parsedId.data },
    include: {
      teachers: { select: { username: true } },
      modules: {
        include: {
          lessons: {
            orderBy: { order: "asc" },
            select: { id: true, title: true, order: true },
          },
        },
        orderBy: { order: "asc" },
      },
      quizzes: {
        where: { status: QuizStatus.PUBLISHED },
        select: { id: true, title: true, passingScore: true },
      },
      assignments: {
        where: { status: AssignmentStatus.PUBLISHED },
        select: { id: true, title: true, dueDate: true, maxScore: true },
      },
    },
  });
  if (!course) notFound();

  const completions = await prisma.lessonCompletion.findMany({
    where: { studentId },
    select: { lessonId: true },
  });
  const completedLessonIds = new Set(completions.map((c) => c.lessonId));

  const allLessons = course.modules.flatMap((m) => m.lessons);
  const totalLessons = allLessons.length;
  const completedCount = allLessons.filter((l) =>
    completedLessonIds.has(l.id)
  ).length;
  const progress =
    totalLessons === 0
      ? 0
      : Math.round((completedCount / totalLessons) * 100);

  const nextLesson =
    allLessons.find((l) => !completedLessonIds.has(l.id)) || allLessons[0];

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-primary">{course.title}</h1>
        <p className="mt-2 text-sm text-gray-700">
          <span className="font-medium">Instructor:</span>{" "}
          {course.teachers.map((t) => t.username).join(", ") || "Not assigned"}
        </p>

        {course.description && (
          <p className="mt-4 text-gray-700">{course.description}</p>
        )}

        <div className="mt-6">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progress</span>
            <span>
              {completedCount}/{totalLessons} lessons · {progress}%
            </span>
          </div>
          <div
            className="w-full bg-gray-200 rounded-full h-2"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Course progress"
          >
            <div
              className="bg-accent h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <section
        className="bg-white rounded-lg shadow-sm p-6"
        aria-labelledby="course-content-heading"
      >
        <h2
          id="course-content-heading"
          className="text-lg font-semibold text-primary mb-4"
        >
          Course Content
        </h2>

        {course.modules.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No lessons have been added to this course yet.
          </p>
        ) : (
          <div className="space-y-6">
            {course.modules.map((module) => (
              <div key={module.id}>
                <h3 className="font-medium text-gray-800 mb-2">
                  {module.title}
                </h3>
                <ul className="space-y-1">
                  {module.lessons.map((lesson) => {
                    const isCompleted = completedLessonIds.has(lesson.id);
                    return (
                      <li key={lesson.id}>
                        <Link
                          href={`/student/courses/${courseId}/lessons/${lesson.id}`}
                          className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        >
                          {isCompleted ? (
                            <FaCheckCircle
                              className="text-green-600 shrink-0"
                              aria-hidden
                            />
                          ) : (
                            <FaCircle
                              className="text-gray-300 shrink-0 text-xs"
                              aria-hidden
                            />
                          )}
                          <span
                            className={`text-sm ${
                              isCompleted
                                ? "text-gray-500 line-through"
                                : "text-gray-800"
                            }`}
                          >
                            {lesson.title}
                          </span>
                          <FaArrowRight
                            className="ml-auto text-gray-400 text-xs"
                            aria-hidden
                          />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>

      {(course.quizzes.length > 0 || course.assignments.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {course.assignments.length > 0 && (
            <section
              className="bg-white rounded-lg shadow-sm p-6"
              aria-labelledby="course-assignments-heading"
            >
              <h2
                id="course-assignments-heading"
                className="text-lg font-semibold text-primary mb-4"
              >
                Assignments
              </h2>
              <ul className="space-y-2">
                {course.assignments.map((a) => (
                  <li key={a.id}>
                    <Link
                      href={`/student/assignments/${a.id}`}
                      className="block text-sm text-gray-800 hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                    >
                      {a.title}
                      <span className="text-xs text-gray-500 block">
                        Due:{" "}
                        <time dateTime={a.dueDate.toISOString()}>
                          {DATE_FORMAT.format(a.dueDate)}
                        </time>{" "}
                        · Max: {a.maxScore}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {course.quizzes.length > 0 && (
            <section
              className="bg-white rounded-lg shadow-sm p-6"
              aria-labelledby="course-quizzes-heading"
            >
              <h2
                id="course-quizzes-heading"
                className="text-lg font-semibold text-primary mb-4"
              >
                Quizzes
              </h2>
              <ul className="space-y-2">
                {course.quizzes.map((q) => (
                  <li key={q.id}>
                    <Link
                      href={`/student/quizzes/${q.id}`}
                      className="block text-sm text-gray-800 hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                    >
                      {q.title}
                      <span className="text-xs text-gray-500 block">
                        Passing: {q.passingScore}%
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}

      {nextLesson && (
        <div className="text-center">
          <Link
            href={`/student/courses/${courseId}/lessons/${nextLesson.id}`}
            className="inline-block bg-primary text-white px-6 py-3 rounded-md hover:bg-primary-light focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {completedCount === 0 ? "Start Learning" : "Continue Learning"}
          </Link>
        </div>
      )}
    </div>
  );
}