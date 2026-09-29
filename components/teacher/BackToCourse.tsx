import Link from "next/link";

export function BackToCourse({
  courseId,
  courseTitle,
}: {
  courseId: string;
  courseTitle?: string;
}) {
  const label = courseTitle
    ? `← Back to ${courseTitle}`
    : "← Back to Course";

  return (
    <Link
      href={`/teacher/courses/${courseId}`}
      className="text-sm text-accent hover:underline inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
    >
      {label}
    </Link>
  );
}