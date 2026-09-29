import Link from "next/link";
import { CourseForm } from "@/components/admin/CourseForm";

export default function NewCoursePage() {
  return (
    <div className="space-y-6">
      <Link
        href="/admin/courses"
        className="text-sm text-accent hover:underline inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
      >
        ← Back to Courses
      </Link>

      <h1 className="text-2xl font-bold text-primary">Create Course</h1>

      <CourseForm />
    </div>
  );
}