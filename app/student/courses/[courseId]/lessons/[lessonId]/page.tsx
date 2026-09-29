import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import {
  FaCheckCircle,
  FaFileAlt,
  FaDownload,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import { z } from "zod";
import { MarkLessonCompleteButton } from "@/components/student/MarkLessonCompleteButton";

const cuidSchema = z.string().cuid();

export default async function StudentLessonPage({
  params,
}: {
  params: Promise<{ courseId: string; lessonId: string }>;
}) {
  const { courseId, lessonId } = await params;

  const parsedCourseId = cuidSchema.safeParse(courseId);
  const parsedLessonId = cuidSchema.safeParse(lessonId);
  if (!parsedCourseId.success || !parsedLessonId.success) notFound();

  const session = await auth();
  if (!session?.user?.id || session.user.role !== Role.STUDENT) {
    redirect("/bible-college/portal/login");
  }
  const studentId = session.user.id;

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      studentId_courseId: {
        studentId,
        courseId: parsedCourseId.data,
      },
    },
    select: { id: true },
  });
  if (!enrollment) notFound();

  const lesson = await prisma.lesson.findUnique({
    where: { id: parsedLessonId.data },
    include: {
      module: { include: { course: true } },
      materials: true,
    },
  });
  if (!lesson || lesson.module.courseId !== parsedCourseId.data) notFound();

  const modules = await prisma.module.findMany({
    where: { courseId: parsedCourseId.data },
    include: {
      lessons: {
        orderBy: { order: "asc" },
        select: { id: true, title: true },
      },
    },
    orderBy: { order: "asc" },
  });

  const allLessons = modules.flatMap((m) => m.lessons);
  const currentIndex = allLessons.findIndex((l) => l.id === parsedLessonId.data);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const completion = await prisma.lessonCompletion.findUnique({
    where: {
      studentId_lessonId: { studentId, lessonId: parsedLessonId.data },
    },
    select: { id: true },
  });
  const isCompleted = !!completion;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href={`/student/courses/${courseId}`}
          className="text-sm text-accent hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
        >
          ← Back to {lesson.module.course.title}
        </Link>
        {isCompleted && (
          <span
            className="flex items-center gap-1 text-sm text-green-600"
            role="status"
          >
            <FaCheckCircle aria-hidden /> Completed
          </span>
        )}
      </div>

      <article className="bg-white rounded-lg shadow-sm p-6 md:p-8">
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-primary mb-2">
          {lesson.title}
        </h1>
        <p className="text-sm text-gray-500 mb-6">{lesson.module.title}</p>

        {lesson.content ? (
          <div className="whitespace-pre-wrap text-gray-800 leading-relaxed break-words">
            {lesson.content}
          </div>
        ) : (
          <p className="text-gray-500 italic">
            This lesson has no text content yet.
          </p>
        )}
      </article>

      {lesson.materials.length > 0 && (
        <section
          className="bg-white rounded-lg shadow-sm p-6"
          aria-labelledby="materials-heading"
        >
          <h2
            id="materials-heading"
            className="font-semibold text-primary mb-3"
          >
            Lesson Materials
          </h2>
          <ul className="space-y-2">
            {lesson.materials.map((m) => (
              <li key={m.id}>
                <a
                  href={m.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-gray-800 hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                >
                  <FaFileAlt className="text-accent shrink-0" aria-hidden />
                  <span className="flex-1">{m.title}</span>
                  <span className="text-xs uppercase text-gray-500">
                    {m.type}
                  </span>
                  <FaDownload className="text-gray-400" aria-hidden />
                  <span className="sr-only">(opens in new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {!isCompleted && (
        <div className="text-center">
          <MarkLessonCompleteButton lessonId={lesson.id} />
        </div>
      )}

      <nav
        aria-label="Lesson navigation"
        className="flex justify-between items-center pt-4 gap-4"
      >
        {prevLesson ? (
          <Link
            href={`/student/courses/${courseId}/lessons/${prevLesson.id}`}
            className="flex items-center gap-2 text-sm text-primary hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
          >
            <FaArrowLeft aria-hidden />{" "}
            <span className="truncate max-w-[12rem]">{prevLesson.title}</span>
          </Link>
        ) : (
          <span />
        )}

        {nextLesson ? (
          <Link
            href={`/student/courses/${courseId}/lessons/${nextLesson.id}`}
            className="flex items-center gap-2 text-sm text-primary hover:text-accent text-right focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
          >
            <span className="truncate max-w-[12rem]">{nextLesson.title}</span>{" "}
            <FaArrowRight aria-hidden />
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </div>
  );
}