import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { FaChalkboardTeacher } from "react-icons/fa";

export default async function AdminTeachersPage() {
  const teachers = await prisma.user.findMany({
    where: { role: "TEACHER" },
    include: { teacherProfile: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
          <FaChalkboardTeacher className="text-accent" />
          Teachers
        </h2>
        <Link
          href="/admin/teachers/new"
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-light"
        >
          + Add Teacher
        </Link>
      </div>

      {teachers.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">
          No teachers found.
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Staff ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {teachers.map((teacher) => (
                <tr key={teacher.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{teacher.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {teacher.teacherProfile?.id || "—"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        teacher.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {teacher.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      href={`/admin/teachers/${teacher.id}`}
                      className="text-accent hover:underline"
                    >
                      View / Edit
                    </Link>
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