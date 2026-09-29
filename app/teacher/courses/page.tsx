import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import {
  FaUsers,
  FaClipboardList,
  FaQuestionCircle,
  FaLayerGroup,
} from "react-icons/fa";

export const revalidate = 30;

export default async function TeacherCoursesPage() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== Role.TEACHER) {
    redirect("/bible-college/portal/login");
  }
  const teacherId = session.user.id;

  const courses = await prisma.course.findMany({
    where: { teachers: { some: { id: teacherId } } },
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
    orderBy: { title: "asc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-primary">My Courses</h1>

      {courses.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">
          <p>No courses assigned yet.</p>
          <p className="text-sm mt-2">
            Contact the administrator if you believe this is an error.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-lg shadow-sm p-6 flex flex-col"
            >
              <h2 className="font-semibold text-lg">{course.title}</h2>
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                {course.description || "No description"}
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <FaUsers size={14} aria-hidden />
                  <span className="sr-only">Enrollments:</span>
                  {course._count.enrollments}
                </span>
                <span className="flex items-center gap-1">
                  <FaLayerGroup size={14} aria-hidden />
                  <span className="sr-only">Modules:</span>
                  {course._count.modules}
                </span>
                <span className="flex items-center gap-1">
                  <FaClipboardList size={14} aria-hidden />
                  <span className="sr-only">Assignments:</span>
                  {course._count.assignments}
                </span>
                <span className="flex items-center gap-1">
                  <FaQuestionCircle size={14} aria-hidden />
                  <span className="sr-only">Quizzes:</span>
                  {course._count.quizzes}
                </span>
              </div>
              <Link
                href={`/teacher/courses/${course.id}`}
                className="mt-4 text-accent hover:underline font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
              >
                Manage Course →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}