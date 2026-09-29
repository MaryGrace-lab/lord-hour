import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

export const revalidate = 30;

const DATE_FORMAT = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export default async function AdminStudentsPage() {
  const students = await prisma.user.findMany({
    where: { role: Role.STUDENT },
    include: { studentProfile: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-bold text-primary">Students</h1>
        <Link
          href="/admin/students/new"
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-light text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          + Add Student
        </Link>
      </div>

      {students.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">
          <p>No students found.</p>
          <Link
            href="/admin/students/new"
            className="text-accent hover:underline text-sm mt-2 inline-block font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
          >
            Add your first student →
          </Link>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block bg-white rounded-lg shadow-sm overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <caption className="sr-only">
                Students list. {students.length} student
                {students.length === 1 ? "" : "s"}.
              </caption>
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    Student ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden lg:table-cell"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    Status
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
                {students.map((student) => {
                  const displayName =
                    [
                      student.studentProfile?.firstName,
                      student.studentProfile?.lastName,
                    ]
                      .filter(Boolean)
                      .join(" ") || student.username;

                  return (
                    <tr key={student.id}>
                      <td className="px-6 py-4">
                        <p className="font-medium text-sm text-gray-900">
                          {displayName}
                        </p>
                        <p className="text-xs text-gray-500">
                          @{student.username}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {student.studentProfile?.studentId || "—"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell text-sm text-gray-600">
                        {student.studentProfile?.email || "—"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            student.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {student.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          href={`/admin/students/${student.id}`}
                          className="text-accent hover:underline text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                        >
                          View / Edit
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
            {students.map((student) => {
              const displayName =
                [
                  student.studentProfile?.firstName,
                  student.studentProfile?.lastName,
                ]
                  .filter(Boolean)
                  .join(" ") || student.username;

              return (
                <Link
                  key={student.id}
                  href={`/admin/students/${student.id}`}
                  className="block bg-white rounded-lg shadow-sm p-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 truncate">
                        {displayName}
                      </p>
                      <p className="text-xs text-gray-500">
                        @{student.username}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 px-2 py-1 text-xs rounded-full ${
                        student.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {student.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    <span className="text-gray-500">ID:</span>{" "}
                    {student.studentProfile?.studentId || "—"}
                  </p>
                  {student.studentProfile?.email && (
                    <p className="text-sm text-gray-600 truncate">
                      {student.studentProfile.email}
                    </p>
                  )}
                </Link>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}