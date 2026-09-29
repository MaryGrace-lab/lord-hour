import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { FaUsers } from "react-icons/fa";

export const revalidate = 30;

export default async function TeacherStudentsPage() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== Role.TEACHER) {
    redirect("/bible-college/portal/login");
  }
  const teacherId = session.user.id;

  const enrollments = await prisma.enrollment.findMany({
    where: {
      course: { teachers: { some: { id: teacherId } } },
    },
    select: {
      id: true,
      studentId: true,
      student: {
        select: {
          id: true,
          username: true,
          name: true,
          studentProfile: {
            select: { firstName: true, lastName: true, studentId: true },
          },
        },
      },
      course: { select: { title: true } },
    },
    orderBy: { student: { username: "asc" } },
  });

  // Group by student
  const studentMap = new Map<
    string,
    {
      student: (typeof enrollments)[number]["student"];
      courses: string[];
    }
  >();
  for (const e of enrollments) {
    const existing = studentMap.get(e.studentId);
    if (existing) {
      existing.courses.push(e.course.title);
    } else {
      studentMap.set(e.studentId, {
        student: e.student,
        courses: [e.course.title],
      });
    }
  }
  const students = Array.from(studentMap.values());

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
        <FaUsers className="text-accent" aria-hidden />
        My Students
      </h1>

      {students.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">
          No students enrolled in your courses yet.
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block bg-white rounded-lg shadow-sm overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <caption className="sr-only">
                Students enrolled in your courses. {students.length} student
                {students.length === 1 ? "" : "s"}.
              </caption>
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Student
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Courses
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map(({ student, courses }) => {
                  const displayName =
                    [
                      student.studentProfile?.firstName,
                      student.studentProfile?.lastName,
                    ]
                      .filter(Boolean)
                      .join(" ") ||
                    student.name ||
                    student.username;
                  return (
                    <tr key={student.id}>
                      <td className="px-6 py-4">
                        <p className="font-medium text-sm">{displayName}</p>
                        <p className="text-xs text-gray-500">
                          @{student.username}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {courses.join(", ")}
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/teacher/students/${student.id}`}
                          className="text-accent hover:underline text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {students.map(({ student, courses }) => {
              const displayName =
                [
                  student.studentProfile?.firstName,
                  student.studentProfile?.lastName,
                ]
                  .filter(Boolean)
                  .join(" ") ||
                student.name ||
                student.username;
              return (
                <Link
                  key={student.id}
                  href={`/teacher/students/${student.id}`}
                  className="block bg-white rounded-lg shadow-sm p-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <p className="font-semibold text-gray-900">{displayName}</p>
                  <p className="text-xs text-gray-500 mb-2">
                    @{student.username}
                  </p>
                  <p className="text-sm text-gray-700">
                    {courses.join(", ")}
                  </p>
                </Link>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}