import Link from "next/link";
import {
  FaFileAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaPhoneAlt,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaBook,
  FaUserPlus,
} from "react-icons/fa";
import { IconType } from "react-icons";
import {
  getRecentActivity,
  formatRelativeTime,
  ActivityType,
  ActivityItem,
} from "@/lib/admin-activity";

const iconMap: Record<ActivityType, IconType> = {
  application_submitted: FaFileAlt,
  application_approved: FaCheckCircle,
  application_rejected: FaTimesCircle,
  application_contacted: FaPhoneAlt,
  student_created: FaUserGraduate,
  teacher_created: FaChalkboardTeacher,
  course_created: FaBook,
  student_enrolled: FaUserPlus,
};

const colorMap: Record<ActivityType, string> = {
  application_submitted: "text-blue-600 bg-blue-50",
  application_approved: "text-green-600 bg-green-50",
  application_rejected: "text-red-600 bg-red-50",
  application_contacted: "text-yellow-700 bg-yellow-50",
  student_created: "text-primary bg-gray-100",
  teacher_created: "text-primary bg-gray-100",
  course_created: "text-primary bg-gray-100",
  student_enrolled: "text-accent bg-gray-100",
};

function ActivityRow({ activity }: { activity: ActivityItem }) {
  const Icon = iconMap[activity.type];
  const colors = colorMap[activity.type];

  // `activity.timestamp` is epoch ms (see ActivityItem). Reconstruct a Date
  // for the machine-readable `<time dateTime>` attribute.
  const date = new Date(activity.timestamp);

  const inner = (
    <div className="flex items-start gap-3 py-3">
      <div
        className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${colors}`}
      >
        <Icon size={14} aria-hidden />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-800 leading-snug">
          {activity.description}
        </p>
        <p className="text-xs text-gray-500 mt-0.5">
          <time dateTime={date.toISOString()}>
            {formatRelativeTime(activity.timestamp)}
          </time>
        </p>
      </div>
    </div>
  );

  if (!activity.href) return inner;

  return (
    <Link
      href={activity.href}
      className="block hover:bg-gray-50 -mx-2 px-2 rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      {inner}
    </Link>
  );
}

export async function RecentActivity() {
  const activities = await getRecentActivity(8);

  return (
    <section
      className="bg-white rounded-lg shadow-sm p-6"
      aria-labelledby="recent-activity-heading"
    >
      <div className="flex items-center justify-between mb-4">
        <h2
          id="recent-activity-heading"
          className="font-semibold text-lg text-primary"
        >
          Recent Activity
        </h2>
      </div>

      {activities.length === 0 ? (
        <p className="text-gray-500 text-sm">No recent activity yet.</p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {activities.map((activity) => (
            <li key={activity.id}>
              <ActivityRow activity={activity} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}