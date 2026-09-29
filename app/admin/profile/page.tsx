import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { AdminProfileForm } from "@/components/admin/AdminProfileForm";
import { formatRelativeTime } from "@/lib/admin-activity";
import {
  FaUser,
  FaPlus,
  FaFileAlt,
  FaChalkboardTeacher,
  FaBook,
  FaHistory,
} from "react-icons/fa";

const DATE_FORMAT = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

const DATE_TIME_FORMAT = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const ACTION_LABELS: Record<string, string> = {
  APPLICATION_APPROVED: "Application approved",
  APPLICATION_REJECTED: "Application rejected",
  APPLICATION_CONTACTED: "Application marked contacted",
  APPLICATION_REVERTED: "Application reverted to pending",
  STUDENT_CREATED: "Student created",
  STUDENT_UPDATED: "Student updated",
  STUDENT_TOGGLED: "Student status changed",
  STUDENT_DELETED: "Student deleted",
  TEACHER_CREATED: "Teacher created",
  TEACHER_UPDATED: "Teacher updated",
  TEACHER_TOGGLED: "Teacher status changed",
  TEACHER_DELETED: "Teacher deleted",
  COURSE_CREATED: "Course created",
  COURSE_VISIBILITY_TOGGLED: "Course visibility changed",
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

export default async function AdminProfilePage() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== Role.ADMIN) {
    redirect("/bible-college/portal/login");
  }
  const adminId = session.user.id;

  const [admin, recentActivity] = await Promise.all([
    prisma.user.findUnique({
      where: { id: adminId },
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.auditLog.findMany({
      where: { userId: adminId },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        action: true,
        entity: true,
        entityId: true,
        createdAt: true,
      },
    }),
  ]);

  if (!admin) notFound();

  // Derive initials from the display name or username.
  const displayName = admin.name?.trim() || admin.username;
  const initials =
    displayName
      .split(/\s+/)
      .map((part) => part[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || admin.username.slice(0, 2).toUpperCase();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-primary">My Profile</h1>

      {/* Identity card */}
      <section className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div
            className="shrink-0 w-20 h-20 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold"
            aria-hidden
          >
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-semibold text-gray-900 truncate">
              {displayName}
            </h2>
            <p className="text-sm text-gray-500">@{admin.username}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full bg-primary/10 text-primary">
                Administrator
              </span>
              <span
                className={`inline-block px-2.5 py-0.5 text-xs font-medium rounded-full ${
                  admin.isActive
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {admin.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Account details + Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Account details */}
        <section
          className="bg-white rounded-lg shadow-sm p-6"
          aria-labelledby="account-details-heading"
        >
          <h2
            id="account-details-heading"
            className="font-semibold text-primary mb-4"
          >
            Account Details
          </h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-gray-500">Username</dt>
              <dd className="text-gray-900 font-medium text-right break-all">
                {admin.username}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-gray-500">Role</dt>
              <dd className="text-gray-900 font-medium">Administrator</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-gray-500">Member since</dt>
              <dd className="text-gray-900 font-medium">
                <time dateTime={admin.createdAt.toISOString()}>
                  {DATE_FORMAT.format(admin.createdAt)}
                </time>
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-gray-500">Last profile update</dt>
              <dd className="text-gray-900 font-medium">
                <time dateTime={admin.updatedAt.toISOString()}>
                  {DATE_TIME_FORMAT.format(admin.updatedAt)}
                </time>
              </dd>
            </div>
          </dl>
        </section>

        {/* Quick actions */}
        <section
          className="bg-white rounded-lg shadow-sm p-6"
          aria-labelledby="quick-actions-heading"
        >
          <h2
            id="quick-actions-heading"
            className="font-semibold text-primary mb-4"
          >
            Quick Actions
          </h2>
          <ul className="space-y-2">
            <QuickAction
              href="/admin/students/new"
              icon={FaUser}
              label="Add a student"
            />
            <QuickAction
              href="/admin/teachers/new"
              icon={FaChalkboardTeacher}
              label="Add a teacher"
            />
            <QuickAction
              href="/admin/courses/new"
              icon={FaBook}
              label="Create a course"
            />
            <QuickAction
              href="/admin/applications"
              icon={FaFileAlt}
              label="Review applications"
            />
            <QuickAction
              href="/admin/audit-logs"
              icon={FaHistory}
              label="View audit logs"
            />
          </ul>
        </section>
      </div>

      {/* Editable name */}
      <section
        className="bg-white rounded-lg shadow-sm p-6"
        aria-labelledby="update-name-heading"
      >
        <h2
          id="update-name-heading"
          className="font-semibold text-primary mb-1"
        >
          Update Display Name
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          This name appears on the admin dashboard greeting and in audit
          logs.
        </p>
        <AdminProfileForm adminName={admin.name} />
      </section>

      {/* Recent activity */}
      <section
        className="bg-white rounded-lg shadow-sm p-6"
        aria-labelledby="recent-activity-heading"
      >
        <h2
          id="recent-activity-heading"
          className="font-semibold text-primary mb-4"
        >
          Your Recent Activity
        </h2>
        {recentActivity.length === 0 ? (
          <p className="text-sm text-gray-500">
            No activity recorded yet. Your actions will appear here.
          </p>
        ) : (
          <ul className="divide-y">
            {recentActivity.map((log) => (
              <li
                key={log.id}
                className="py-3 flex items-start justify-between gap-4"
              >
                <div className="min-w-0">
                  <p className="text-sm text-gray-800">
                    {ACTION_LABELS[log.action] || log.action}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {log.entity}
                    {log.entityId
                      ? ` · ${log.entityId.slice(0, 10)}…`
                      : ""}
                  </p>
                </div>
                <time
                  dateTime={log.createdAt.toISOString()}
                  className="shrink-0 text-xs text-gray-400"
                  title={DATE_TIME_FORMAT.format(log.createdAt)}
                >
                  {formatRelativeTime(log.createdAt)}
                </time>
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="text-xs text-gray-400 text-center">
        Need to change your username or password? Contact the system
        administrator.
      </p>
    </div>
  );
}

function QuickAction({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: typeof FaUser;
  label: string;
}) {
  return (
    <li>
      <Link
        href={href}
        className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <Icon className="text-accent shrink-0" size={14} aria-hidden />
        <span>{label}</span>
      </Link>
    </li>
  );
}