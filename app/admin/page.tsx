import Link from "next/link";
import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaBook,
  FaCheckCircle,
  FaFileAlt,
} from "react-icons/fa";
import { RecentActivity } from "@/components/admin/RecentActivity";
import { prisma } from "@/lib/prisma";
import { ApplicationStatus, Role } from "@prisma/client";

export const revalidate = 30;

export default async function AdminDashboardPage() {
  const [
    totalStudents,
    totalTeachers,
    totalCourses,
    activeCourses,
    pendingApplications,
  ] = await Promise.all([
    prisma.user.count({ where: { role: Role.STUDENT } }),
    prisma.user.count({ where: { role: Role.TEACHER } }),
    prisma.course.count(),
    prisma.course.count({ where: { isPublished: true } }),
    prisma.application.count({ where: { status: ApplicationStatus.PENDING } }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-primary">Admin Dashboard</h1>
        <p className="text-gray-600">Overview of the Theology School</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
        <StatCard
          icon={
            <FaUserGraduate
              className="text-accent text-3xl mb-2"
              aria-hidden
            />
          }
          value={totalStudents}
          label="Total Students"
        />
        <StatCard
          icon={
            <FaChalkboardTeacher
              className="text-accent text-3xl mb-2"
              aria-hidden
            />
          }
          value={totalTeachers}
          label="Total Teachers"
        />
        <StatCard
          icon={
            <FaBook className="text-accent text-3xl mb-2" aria-hidden />
          }
          value={totalCourses}
          label="Total Courses"
        />
        <StatCard
          icon={
            <FaCheckCircle
              className="text-accent text-3xl mb-2"
              aria-hidden
            />
          }
          value={activeCourses}
          label="Active Courses"
        />
        <Link
          href="/admin/applications?status=PENDING"
          className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label={`${pendingApplications} pending applications — view list`}
        >
          <FaFileAlt
            className="text-accent text-3xl mb-2"
            aria-hidden
          />
          <p className="text-2xl font-bold">{pendingApplications}</p>
          <p className="text-sm text-gray-600">Pending Applications</p>
        </Link>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-primary mb-4">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/applications"
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-light focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            View Applications
          </Link>
          <Link
            href="/admin/students/new"
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-light focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Add Student
          </Link>
          <Link
            href="/admin/teachers/new"
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-light focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Add Teacher
          </Link>
          <Link
            href="/admin/courses/new"
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-light focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Create Course
          </Link>
          <Link
            href="/admin/assignments"
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-light focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Assign Course
          </Link>
        </div>
      </div>

      <RecentActivity />
    </div>
  );
}

function StatCard({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {icon}
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm text-gray-600">{label}</p>
    </div>
  );
}