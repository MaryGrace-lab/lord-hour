import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { FaUsers, FaClipboardList, FaQuestionCircle, FaLayerGroup } from "react-icons/fa";

export default async function TeacherCoursesPage() {
  const session = await auth();
  const teacherId = session?.user.id;

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
      <h2 className="text-2xl font-bold text-primary">My Courses</h2>
      {courses.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">
          No courses assigned yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map((course) => (
            <div key={course.id} className="bg-white rounded-lg shadow-sm p-6 flex flex-col">
              <h3 className="font-semibold text-lg">{course.title}</h3>
              <p className="text-sm text-gray-500">{course.code}</p>
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">{course.description}</p>
              <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <FaUsers size={14} /> {course._count.enrollments}
                </span>
                <span className="flex items-center gap-1">
                  <FaLayerGroup size={14} /> {course._count.modules}
                </span>
                <span className="flex items-center gap-1">
                  <FaClipboardList size={14} /> {course._count.assignments}
                </span>
                <span className="flex items-center gap-1">
                  <FaQuestionCircle size={14} /> {course._count.quizzes}
                </span>
              </div>
              <Link
                href={`/teacher/courses/${course.id}`}
                className="mt-4 text-accent hover:underline"
              >
                Manage Course
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}