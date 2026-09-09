import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { FaUserGraduate, FaChalkboardTeacher, FaBook, FaCheckCircle } from "react-icons/fa";

export default async function AdminDashboardPage() {
  const totalStudents = await prisma.user.count({ where: { role: "STUDENT" } });
  const totalTeachers = await prisma.user.count({ where: { role: "TEACHER" } });
  const totalCourses = await prisma.course.count();
  const activeCourses = await prisma.course.count({ where: { status: "PUBLISHED" } });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-primary">Admin Dashboard</h2>
        <p className="text-gray-600">Overview of the Theology School</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <FaUserGraduate className="text-accent text-3xl mb-2" />
          <p className="text-2xl font-bold">{totalStudents}</p>
          <p className="text-sm text-gray-600">Total Students</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <FaChalkboardTeacher className="text-accent text-3xl mb-2" />
          <p className="text-2xl font-bold">{totalTeachers}</p>
          <p className="text-sm text-gray-600">Total Teachers</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <FaBook className="text-accent text-3xl mb-2" />
          <p className="text-2xl font-bold">{totalCourses}</p>
          <p className="text-sm text-gray-600">Total Courses</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <FaCheckCircle className="text-accent text-3xl mb-2" />
          <p className="text-2xl font-bold">{activeCourses}</p>
          <p className="text-sm text-gray-600">Active Courses</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-semibold text-primary mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/students/new" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-light">Add Student</Link>
          <Link href="/admin/teachers/new" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-light">Add Teacher</Link>
          <Link href="/admin/courses/new" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-light">Create Course</Link>
          <Link href="/admin/assignments" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-light">Assign Course</Link>
        </div>
      </div>

      {/* Recent Activity (optional, simple) */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="font-semibold mb-3">Recent Activity</h3>
        <p className="text-gray-500">No recent activity.</p>
      </div>
    </div>
  );
}