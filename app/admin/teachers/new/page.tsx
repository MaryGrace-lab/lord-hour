import Link from "next/link";
import { TeacherForm } from "@/components/admin/TeacherForm";

export default function NewTeacherPage() {
  return (
    <div className="space-y-6">
      <Link
        href="/admin/teachers"
        className="text-sm text-accent hover:underline inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
      >
        ← Back to Teachers
      </Link>

      <h1 className="text-2xl font-bold text-primary">Add New Teacher</h1>

      <TeacherForm />
    </div>
  );
}