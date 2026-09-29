import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import {
  FaBook,
  FaUpload,
  FaClipboardList,
  FaQuestionCircle,
  FaUsers,
  FaLayerGroup,
} from "react-icons/fa";
import { z } from "zod";

const cuidSchema = z.string().cuid();

export default async function CourseOverviewPage({
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
    include: {
      _count: {
        select: {
          enrollments: true,
          modules: true,
          assignments: true,
          quizzes: true,
        },
      },
    },
  });

  if (!course) notFound();

  const tabs = [
    { name: "Overview", href: `/teacher/courses/${course.id}`, icon: FaBook },
    {
      name: "Lessons",
      href: `/teacher/courses/${course.id}/lessons`,
      icon: FaLayerGroup,
    },
    {
      name: "Materials",
      href: `/teacher/courses/${course.id}/materials`,
      icon: FaUpload,
    },
    {
      name: "Assignments",
      href: `/teacher/courses/${course.id}/assignments`,
      icon: FaClipboardList,
    },
    {
      name: "Quizzes",
      href: `/teacher/courses/${course.id}/quizzes`,
      icon: FaQuestionCircle,
    },
    {
      name: "Students",
      href: `/teacher/courses/${course.id}/students`,
      icon: FaUsers,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-primary">{course.title}</h1>
        <Link
          href="/teacher/courses"
          className="text-sm text-accent hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
        >
          ← Back to My Courses
        </Link>
      </div>

      <nav
        aria-label="Course sections"
        className="flex flex-wrap gap-2 border-b border-gray-200 pb-2"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <Icon size={14} aria-hidden />
              {tab.name}
            </Link>
          );
        })}
      </nav>

      <section
        className="bg-white rounded-lg shadow-sm p-6"
        aria-labelledby="course-details-heading"
      >
        <h2
          id="course-details-heading"
          className="font-semibold text-lg mb-2 text-primary"
        >
          Course Details
        </h2>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <dt className="text-sm font-medium text-gray-500">Title</dt>
            <dd className="text-gray-900">{course.title}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">
              Description
            </dt>
            <dd className="text-gray-900 whitespace-pre-wrap break-words">
              {course.description || "No description"}
            </dd>
          </div>
        </dl>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <Stat value={course._count.enrollments} label="Students" />
          <Stat value={course._count.modules} label="Modules" />
          <Stat value={course._count.assignments} label="Assignments" />
          <Stat value={course._count.quizzes} label="Quizzes" />
        </div>
      </section>
    </div>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm text-gray-600">{label}</p>
    </div>
  );
}