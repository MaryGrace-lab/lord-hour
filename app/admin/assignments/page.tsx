import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { AssignTeacherForm } from "@/components/admin/AssignTeacherForm";
import { RemoveTeacherButton } from "@/components/admin/RemoveTeacherButton";
import { FaHandshake } from "react-icons/fa";

export const revalidate = 30;

export default async function AdminAssignmentsPage() {
  const [courses, teachers] = await Promise.all([
    prisma.course.findMany({
      select: {
        id: true,
        title: true,
        teachers: {
          select: { id: true, username: true },
          orderBy: { username: "asc" },
        },
      },
      orderBy: { title: "asc" },
    }),
    prisma.user.findMany({
      where: { role: Role.TEACHER, isActive: true },
      select: { id: true, username: true },
      orderBy: { username: "asc" },
    }),
  ]);

  const totalAssignments = courses.reduce(
    (sum, c) => sum + c.teachers.length,
    0
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
          <FaHandshake className="text-accent" aria-hidden />
          Course Assignments
        </h1>
        <p className="text-sm text-gray-500">
          {totalAssignments} active assignment
          {totalAssignments === 1 ? "" : "s"}
        </p>
      </div>

      <section
        className="bg-white rounded-lg shadow-sm p-6"
        aria-labelledby="assign-form-heading"
      >
        <h2
          id="assign-form-heading"
          className="font-semibold mb-3 text-primary"
        >
          Assign Teacher to Course
        </h2>

        {courses.length === 0 || teachers.length === 0 ? (
          <p className="text-sm text-gray-500">
            {courses.length === 0
              ? "No courses available yet."
              : "No active teachers available."}
          </p>
        ) : (
          <AssignTeacherForm
            courses={courses.map((c) => ({ id: c.id, title: c.title }))}
            teachers={teachers}
          />
        )}
      </section>

      {totalAssignments === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">
          No teacher assignments yet. Use the form above to assign a teacher.
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block bg-white rounded-lg shadow-sm overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <caption className="sr-only">
                Course-teacher assignments. {totalAssignments} row
                {totalAssignments === 1 ? "" : "s"}.
              </caption>
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    Course
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    Teacher
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {courses.flatMap((course) =>
                  course.teachers.map((teacher) => (
                    <tr key={`${course.id}-${teacher.id}`}>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {course.title}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        @{teacher.username}
                      </td>
                      <td className="px-6 py-4">
                        <RemoveTeacherButton
                          courseId={course.id}
                          teacherId={teacher.id}
                          courseTitle={course.title}
                          teacherUsername={teacher.username}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {courses.flatMap((course) =>
              course.teachers.map((teacher) => (
                <div
                  key={`${course.id}-${teacher.id}`}
                  className="bg-white rounded-lg shadow-sm p-4"
                >
                  <p className="font-medium text-sm text-gray-900 mb-1">
                    {course.title}
                  </p>
                  <p className="text-sm text-gray-600 mb-3">
                    @{teacher.username}
                  </p>
                  <RemoveTeacherButton
                    courseId={course.id}
                    teacherId={teacher.id}
                    courseTitle={course.title}
                    teacherUsername={teacher.username}
                  />
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}