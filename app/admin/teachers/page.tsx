import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { FaChalkboardTeacher } from "react-icons/fa";

export const revalidate = 30;

export default async function AdminTeachersPage() {
  const teachers = await prisma.user.findMany({
    where: { role: Role.TEACHER },
    include: { teacherProfile: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
          <FaChalkboardTeacher className="text-accent" aria-hidden />
          Teachers
        </h1>
        <Link
          href="/admin/teachers/new"
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-light text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          + Add Teacher
        </Link>
      </div>

      {teachers.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">
          <FaChalkboardTeacher
            className="text-gray-300 mx-auto mb-3"
            size={32}
            aria-hidden
          />
          <p>No teachers found.</p>
          <Link
            href="/admin/teachers/new"
            className="text-accent hover:underline text-sm mt-2 inline-block font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
          >
            Add your first teacher →
          </Link>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block bg-white rounded-lg shadow-sm overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <caption className="sr-only">
                Teachers list. {teachers.length} teacher
                {teachers.length === 1 ? "" : "s"}.
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
                    Staff ID
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
                {teachers.map((teacher) => {
                  const displayName =
                    [
                      teacher.teacherProfile?.firstName,
                      teacher.teacherProfile?.lastName,
                    ]
                      .filter(Boolean)
                      .join(" ") || teacher.username;

                  return (
                    <tr key={teacher.id}>
                      <td className="px-6 py-4">
                        <p className="font-medium text-sm text-gray-900">
                          {displayName}
                        </p>
                        <p className="text-xs text-gray-500">
                          @{teacher.username}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {teacher.teacherProfile?.staffId || "—"}
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
            {teachers.map((teacher) => {
              const displayName =
                [
                  teacher.teacherProfile?.firstName,
                  teacher.teacherProfile?.lastName,
                ]
                  .filter(Boolean)
                  .join(" ") || teacher.username;

              return (
                <Link
                  key={teacher.id}
                  href={`/admin/teachers/${teacher.id}`}
                  className="block bg-white rounded-lg shadow-sm p-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 truncate">
                        {displayName}
                      </p>
                      <p className="text-xs text-gray-500">
                        @{teacher.username}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 px-2 py-1 text-xs rounded-full ${
                        teacher.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {teacher.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    <span className="text-gray-500">Staff ID:</span>{" "}
                    {teacher.teacherProfile?.staffId || "—"}
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