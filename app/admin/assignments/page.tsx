import { prisma } from "@/lib/prisma";
import { assignTeacher, removeTeacher } from "@/lib/admin-actions";

export default async function AdminAssignmentsPage() {
  const courses = await prisma.course.findMany({
    include: { teachers: true },
  });
  const teachers = await prisma.user.findMany({ where: { role: "TEACHER" } });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-primary">Course Assignments</h2>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="font-semibold mb-3">Assign Teacher to Course</h3>
        <form action={assignTeacher} className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <select name="courseId" className="border px-3 py-2 rounded-md">
            <option value="">Select course</option>
            {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
          <select name="teacherId" className="border px-3 py-2 rounded-md">
            <option value="">Select teacher</option>
            {teachers.map(t => <option key={t.id} value={t.id}>{t.username}</option>)}
          </select>
          <button type="submit" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-light">Assign</button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">Course</th>
              <th className="px-6 py-3 text-left">Teacher</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {courses.map(course => course.teachers.map(teacher => (
              <tr key={`${course.id}-${teacher.id}`}>
                <td className="px-6 py-4">{course.title}</td>
                <td className="px-6 py-4">{teacher.username}</td>
                <td className="px-6 py-4">
                  <form action={removeTeacher}>
                    <input type="hidden" name="courseId" value={course.id} />
                    <input type="hidden" name="teacherId" value={teacher.id} />
                    <button className="text-red-600 hover:text-red-800">Remove</button>
                  </form>
                </td>
              </tr>
            )))}
          </tbody>
        </table>
      </div>
    </div>
  );
}