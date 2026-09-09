import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminCoursesPage() {
  const courses = await prisma.course.findMany({
    include: {
      programme: true,
      teachers: true,
      semester: { include: { session: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-primary">Courses</h2>
        <Link href="/admin/courses/new" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-light">
          + Create Course
        </Link>
      </div>

      {courses.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">
          No courses created yet.
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Teacher</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {courses.map((course) => (
                <tr key={course.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{course.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{course.code}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {course.teachers.map(t => t.username).join(", ") || "Not assigned"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{course.status}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link href={`/admin/courses/${course.id}`} className="text-accent hover:underline">Edit</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}