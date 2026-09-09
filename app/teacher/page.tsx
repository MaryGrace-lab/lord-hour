import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { FaBook, FaUsers, FaClipboardList, FaQuestionCircle } from "react-icons/fa";

export default async function TeacherDashboardPage() {
  const session = await auth();
  const teacherId = session?.user.id;

  // Fetch teacher's courses
  const courses = await prisma.course.findMany({
    where: { teachers: { some: { id: teacherId } } },
    include: {
      _count: { select: { enrollments: true, assignments: true, quizzes: true } },
    },
  });

  const totalStudents = courses.reduce((sum, c) => sum + c._count.enrollments, 0);
  const totalAssignments = courses.reduce((sum, c) => sum + c._count.assignments, 0);
  const totalQuizzes = courses.reduce((sum, c) => sum + c._count.quizzes, 0);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-primary">
        Good morning, {session?.user.name}
      </h2>
      <p className="text-gray-600">Here&apos;s an overview of your teaching activities.</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <FaBook className="text-accent text-2xl mb-2" />
          <p className="text-2xl font-bold">{courses.length}</p>
          <p className="text-sm text-gray-600">My Courses</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <FaUsers className="text-accent text-2xl mb-2" />
          <p className="text-2xl font-bold">{totalStudents}</p>
          <p className="text-sm text-gray-600">Students</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <FaClipboardList className="text-accent text-2xl mb-2" />
          <p className="text-2xl font-bold">{totalAssignments}</p>
          <p className="text-sm text-gray-600">Assignments</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <FaQuestionCircle className="text-accent text-2xl mb-2" />
          <p className="text-2xl font-bold">{totalQuizzes}</p>
          <p className="text-sm text-gray-600">Quizzes</p>
        </div>
      </div>
    </div>
  );
}