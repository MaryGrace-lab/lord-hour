import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export default async function TeacherStudentsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    return <div>Not authenticated</div>;
  }
  const teacherId = session.user.id;

  // Get unique students across all courses taught by teacher
  const enrollments = await prisma.enrollment.findMany({
    where: {
      course: {
        teachers: { some: { id: teacherId } },
      },
    },
    include: {
      student: true,
      course: true,
    },
    orderBy: { student: { username: "asc" } },
  });

  // Group by student
  const studentMap = new Map<string, { student: typeof enrollments[0]["student"]; courses: typeof enrollments[0]["course"][] }>();
  for (const enrollment of enrollments) {
    if (!studentMap.has(enrollment.studentId)) {
      studentMap.set(enrollment.studentId, {
        student: enrollment.student,
        courses: [],
      });
    }
    studentMap.get(enrollment.studentId)!.courses.push(enrollment.course);
  }

  const students = Array.from(studentMap.values());

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-primary">My Students</h2>
      {students.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">
          No students enrolled in your courses yet.
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Courses</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map(({ student, courses }) => (
                <tr key={student.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{student.username}</td>
                  <td className="px-6 py-4">
                    {courses.map((c) => c.title).join(", ")}
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