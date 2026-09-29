import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { ApplicationStatus, Role } from "@prisma/client";

export type ActivityType =
  | "application_submitted"
  | "application_approved"
  | "application_rejected"
  | "application_contacted"
  | "student_created"
  | "teacher_created"
  | "course_created"
  | "student_enrolled";

export type ActivityItem = {
  id: string;
  type: ActivityType;
  description: string;
  href?: string;
  /**
   * Timestamp in milliseconds since epoch.
   *
   * Deliberately a number, not a Date: `unstable_cache` serializes values
   * through JSON, which turns Date into string. Numbers survive round-tripping
   * cleanly, so the render layer can reconstruct a Date whenever it needs one.
   */
  timestamp: number;
};

/**
 * Fetch the most recent admin-relevant activities across the system.
 * Cached for 30 seconds; invalidated by revalidateTag("admin-activity")
 * from lib/admin-actions.ts and friends.
 */
export const getRecentActivity = unstable_cache(
  async (limit = 8): Promise<ActivityItem[]> => {
    const fetchLimit = limit * 2;

    const [
      recentApplications,
      reviewedApplications,
      recentStudents,
      recentTeachers,
      recentCourses,
      recentEnrollments,
    ] = await Promise.all([
      prisma.application.findMany({
        take: fetchLimit,
        orderBy: { submittedAt: "desc" },
        select: { id: true, fullName: true, submittedAt: true },
      }),

      prisma.application.findMany({
        where: {
          reviewedAt: { not: null },
          status: {
            in: [
              ApplicationStatus.APPROVED,
              ApplicationStatus.REJECTED,
              ApplicationStatus.CONTACTED,
            ],
          },
        },
        take: fetchLimit,
        orderBy: { reviewedAt: "desc" },
        select: {
          id: true,
          fullName: true,
          status: true,
          reviewedAt: true,
        },
      }),

      prisma.user.findMany({
        where: { role: Role.STUDENT },
        take: fetchLimit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          username: true,
          createdAt: true,
          studentProfile: {
            select: { firstName: true, lastName: true },
          },
        },
      }),

      prisma.user.findMany({
        where: { role: Role.TEACHER },
        take: fetchLimit,
        orderBy: { createdAt: "desc" },
        select: { id: true, username: true, createdAt: true },
      }),

      prisma.course.findMany({
        take: fetchLimit,
        orderBy: { createdAt: "desc" },
        select: { id: true, title: true, createdAt: true },
      }),

      prisma.enrollment.findMany({
        take: fetchLimit,
        orderBy: { enrolledAt: "desc" },
        select: {
          id: true,
          enrolledAt: true,
          student: { select: { username: true } },
          course: { select: { id: true, title: true } },
        },
      }),
    ]);

    const items: ActivityItem[] = [];

    recentApplications.forEach((a) => {
      items.push({
        id: `app-sub-${a.id}`,
        type: "application_submitted",
        description: `New application received from ${a.fullName}`,
        href: `/admin/applications/${a.id}`,
        timestamp: a.submittedAt.getTime(),
      });
    });

    reviewedApplications.forEach((a) => {
      if (!a.reviewedAt) return;
      const label =
        a.status === ApplicationStatus.APPROVED
          ? "approved"
          : a.status === ApplicationStatus.REJECTED
          ? "rejected"
          : "marked as contacted";
      const type: ActivityType =
        a.status === ApplicationStatus.APPROVED
          ? "application_approved"
          : a.status === ApplicationStatus.REJECTED
          ? "application_rejected"
          : "application_contacted";

      items.push({
        id: `app-rev-${a.id}-${a.status}`,
        type,
        description: `Application from ${a.fullName} was ${label}`,
        href: `/admin/applications/${a.id}`,
        timestamp: a.reviewedAt.getTime(),
      });
    });

    recentStudents.forEach((s) => {
      const displayName =
        [s.studentProfile?.firstName, s.studentProfile?.lastName]
          .filter(Boolean)
          .join(" ") || s.username;
      items.push({
        id: `stu-${s.id}`,
        type: "student_created",
        description: `Student account created for ${displayName}`,
        href: `/admin/students/${s.id}`,
        timestamp: s.createdAt.getTime(),
      });
    });

    recentTeachers.forEach((t) => {
      items.push({
        id: `tea-${t.id}`,
        type: "teacher_created",
        description: `Teacher account created for ${t.username}`,
        href: `/admin/teachers/${t.id}`,
        timestamp: t.createdAt.getTime(),
      });
    });

    recentCourses.forEach((c) => {
      items.push({
        id: `crs-${c.id}`,
        type: "course_created",
        description: `Course "${c.title}" was created`,
        href: `/admin/courses/${c.id}`,
        timestamp: c.createdAt.getTime(),
      });
    });

    recentEnrollments.forEach((e) => {
      items.push({
        id: `enr-${e.id}`,
        type: "student_enrolled",
        description: `${e.student.username} was enrolled in "${e.course.title}"`,
        href: `/admin/students`,
        timestamp: e.enrolledAt.getTime(),
      });
    });

    return items
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  },
  ["admin-recent-activity"],
  { revalidate: 30, tags: ["admin-activity"] }
);

/**
 * Format a timestamp as a short relative time string.
 * Accepts Date or epoch milliseconds — useful because callers may hold
 * either depending on where the value came from.
 */
export function formatRelativeTime(input: Date | number): string {
  const ms = input instanceof Date ? input.getTime() : input;
  const diff = Date.now() - ms;
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  const years = Math.floor(months / 12);
  return `${years}y ago`;
}