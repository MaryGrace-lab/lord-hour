import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import {
  FaBook,
  FaUsers,
  FaClipboardList,
  FaQuestionCircle,
} from "react-icons/fa";

export const revalidate = 30;

export default async function TeacherDashboardPage() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== Role.TEACHER) {
    redirect("/bible-college/portal/login");
  }
  const teacherId = session.user.id;

  const courses = await prisma.course.findMany({
    where: { teachers: { some: { id: teacherId } } },
    select: {
      id: true,
      _count: {
        select: { enrollments: true, assignments: true, quizzes: true },
      },
    },
  });

  const totalStudents = courses.reduce(
    (sum, c) => sum + c._count.enrollments,
    0
  );
  const totalAssignments = courses.reduce(
    (sum, c) => sum + c._count.assignments,
    0
  );
  const totalQuizzes = courses.reduce((sum, c) => sum + c._count.quizzes, 0);

  const displayName = session.user.name || "Teacher";
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">
          {greeting}, {displayName}
        </h1>
        <p className="text-gray-600 mt-1">
          Here&apos;s an overview of your teaching activities.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          href="/teacher/courses"
          icon={<FaBook className="text-accent text-2xl mb-2" aria-hidden />}
          value={courses.length}
          label="My Courses"
        />
        <StatCard
          href="/teacher/students"
          icon={<FaUsers className="text-accent text-2xl mb-2" aria-hidden />}
          value={totalStudents}
          label="Students"
        />
        <StatCard
          href="/teacher/assignments"
          icon={
            <FaClipboardList
              className="text-accent text-2xl mb-2"
              aria-hidden
            />
          }
          value={totalAssignments}
          label="Assignments"
        />
        <StatCard
          href="/teacher/quizzes"
          icon={
            <FaQuestionCircle
              className="text-accent text-2xl mb-2"
              aria-hidden
            />
          }
          value={totalQuizzes}
          label="Quizzes"
        />
      </div>
    </div>
  );
}

function StatCard({
  href,
  icon,
  value,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  value: number;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      {icon}
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm text-gray-600">{label}</p>
    </Link>
  );
}