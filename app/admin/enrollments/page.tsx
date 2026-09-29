import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { EnrollmentStatus } from "@prisma/client";
import { FaUserGraduate } from "react-icons/fa";

export const revalidate = 30;

const DATE_FORMAT = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export default async function AdminEnrollmentsPage() {
  const enrollments = await prisma.enrollment.findMany({
    include: {
      student: {
        select: {
          id: true,
          username: true,
          studentProfile: {
            select: { firstName: true, lastName: true, studentId: true },
          },
        },
      },
      course: {
        select: { id: true, title: true },
      },
    },
    orderBy: { enrolledAt: "desc" },
    take: 500,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
          <FaUserGraduate className="text-accent" aria-hidden />
          Enrollments
        </h1>
        <p className="text-sm text-gray-500">
          {enrollments.length} enrollment
          {enrollments.length === 1 ? "" : "s"}
        </p>
      </div>

      {enrollments.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">
          <FaUserGraduate
            className="text-gray-300 mx-auto mb-3"
            size={32}
            aria-hidden
          />
          <p>No enrollments yet.</p>
          <p className="text-sm mt-2">
            Enroll students from each student&apos;s detail page.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block bg-white rounded-lg shadow-sm overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <caption className="sr-only">
                All enrollments. {enrollments.length} row
                {enrollments.length === 1 ? "" : "s"}.
              </caption>
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    Student
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    Course
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden lg:table-cell"
                  >
                    Enrolled
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {enrollments.map((e) => {
                  const displayName =
                    [
                      e.student.studentProfile?.firstName,
                      e.student.studentProfile?.lastName,
                    ]
                      .filter(Boolean)
                      .join(" ") || e.student.username;

                  return (
                    <tr key={e.id}>
                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/students/${e.student.id}`}
                          className="font-medium text-sm text-gray-900 hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                        >
                          {displayName}
                        </Link>
                        {e.student.studentProfile?.studentId && (
                          <p className="text-xs text-gray-500">
                            ID: {e.student.studentProfile.studentId}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        <div className="flex items-center gap-2">
                          <span>{e.course.title}</span>
                          {e.status === EnrollmentStatus.COMPLETED && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-full bg-green-100 text-green-700">
                              Completed
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell text-sm text-gray-600">
                        <time dateTime={e.enrolledAt.toISOString()}>
                          {DATE_FORMAT.format(e.enrolledAt)}
                        </time>
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/students/${e.student.id}`}
                          className="text-accent hover:underline text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                        >
                          Manage
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
            {enrollments.map((e) => {
              const displayName =
                [
                  e.student.studentProfile?.firstName,
                  e.student.studentProfile?.lastName,
                ]
                  .filter(Boolean)
                  .join(" ") || e.student.username;
              const isComplete = e.status === EnrollmentStatus.COMPLETED;

              return (
                <Link
                  key={e.id}
                  href={`/admin/students/${e.student.id}`}
                  className="block bg-white rounded-lg shadow-sm p-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <p className="font-semibold text-gray-900">
                    {displayName}
                  </p>
                  {e.student.studentProfile?.studentId && (
                    <p className="text-xs text-gray-500 mb-1">
                      ID: {e.student.studentProfile.studentId}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm text-gray-700">
                      {e.course.title}
                    </span>
                    {isComplete && (
                      <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded-full bg-green-100 text-green-700">
                        Completed
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Enrolled{" "}
                    <time dateTime={e.enrolledAt.toISOString()}>
                      {DATE_FORMAT.format(e.enrolledAt)}
                    </time>
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