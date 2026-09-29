import { prisma } from "@/lib/prisma";
import { formatRelativeTime } from "@/lib/admin-activity";
import { FaHistory } from "react-icons/fa";

export const revalidate = 30;

const ACTION_LABELS: Record<string, string> = {
  APPLICATION_APPROVED: "Application approved",
  APPLICATION_REJECTED: "Application rejected",
  APPLICATION_CONTACTED: "Application marked contacted",
  APPLICATION_REVERTED: "Application reverted to pending",
  STUDENT_CREATED: "Student created",
  STUDENT_UPDATED: "Student updated",
  STUDENT_TOGGLED: "Student status changed",
  TEACHER_CREATED: "Teacher created",
  TEACHER_UPDATED: "Teacher updated",
  TEACHER_TOGGLED: "Teacher status changed",
  COURSE_CREATED: "Course created",
  COURSE_ARCHIVED: "Course archived",
  COURSE_DELETED: "Course deleted",
  TEACHER_ASSIGNED: "Teacher assigned to course",
  TEACHER_REMOVED: "Teacher removed from course",
  STUDENT_ENROLLED: "Student enrolled in course",
  STUDENT_UNENROLLED: "Student removed from course",
  ADMIN_PROFILE_UPDATED: "Admin profile updated",
  TESTIMONY_APPROVED: "Testimony approved",
  TESTIMONY_REJECTED: "Testimony rejected",
  TESTIMONY_PENDING: "Testimony reverted to pending",
  TESTIMONY_DELETED: "Testimony deleted",
};

const DATE_TIME_FORMAT = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export default async function AuditLogsPage() {
  const logs = await prisma.auditLog.findMany({
    take: 100,
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { username: true, name: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
          <FaHistory className="text-accent" aria-hidden />
          Audit Logs
        </h1>
        <p className="text-sm text-gray-500">
          Showing the most recent {logs.length} entries
        </p>
      </div>

      {logs.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">
          <FaHistory
            className="text-gray-300 mx-auto mb-3"
            size={32}
            aria-hidden
          />
          <p>No activity recorded yet.</p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block bg-white rounded-lg shadow-sm overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <caption className="sr-only">
                Audit log. {logs.length} entries, most recent first.
              </caption>
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    When
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    Who
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    Action
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden lg:table-cell"
                  >
                    Target
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                      <div>
                        <time dateTime={log.createdAt.toISOString()}>
                          {formatRelativeTime(log.createdAt)}
                        </time>
                      </div>
                      <div className="text-xs text-gray-400">
                        {DATE_TIME_FORMAT.format(log.createdAt)}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                      {log.user?.name || log.user?.username || "System"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800">
                      {ACTION_LABELS[log.action] || log.action}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-xs text-gray-500 font-mono">
                      {log.entity}
                      {log.entityId ? `: ${log.entityId.slice(0, 12)}…` : ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {logs.map((log) => (
              <div
                key={log.id}
                className="bg-white rounded-lg shadow-sm p-4"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="font-medium text-sm text-gray-900">
                    {ACTION_LABELS[log.action] || log.action}
                  </p>
                  <time
                    dateTime={log.createdAt.toISOString()}
                    className="text-xs text-gray-400 shrink-0"
                  >
                    {formatRelativeTime(log.createdAt)}
                  </time>
                </div>
                <p className="text-xs text-gray-500 mb-1">
                  By {log.user?.name || log.user?.username || "System"}
                </p>
                <p className="text-xs text-gray-400 font-mono break-all">
                  {log.entity}
                  {log.entityId ? `: ${log.entityId.slice(0, 12)}…` : ""}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}