"use client";

import { useFormStatus } from "react-dom";
import { toast } from "react-hot-toast";
import { assignTeacher } from "@/lib/admin-actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-light disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      {pending ? "Assigning..." : "Assign"}
    </button>
  );
}

export function AssignTeacherForm({
  courses,
  teachers,
}: {
  courses: { id: string; title: string }[];
  teachers: { id: string; username: string }[];
}) {
  async function handleAction(formData: FormData) {
    try {
      await assignTeacher(formData);
      toast.success("Teacher assigned successfully");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to assign teacher";
      toast.error(message);
      throw err;
    }
  }

  return (
    <form
      action={handleAction}
      className="grid grid-cols-1 md:grid-cols-3 gap-3"
    >
      <div>
        <label
          htmlFor="assign-course"
          className="block text-sm font-medium mb-1"
        >
          Course <span aria-hidden>*</span>
          <span className="sr-only">(required)</span>
        </label>
        <select
          id="assign-course"
          name="courseId"
          required
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <option value="">Select course</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="assign-teacher"
          className="block text-sm font-medium mb-1"
        >
          Teacher <span aria-hidden>*</span>
          <span className="sr-only">(required)</span>
        </label>
        <select
          id="assign-teacher"
          name="teacherId"
          required
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <option value="">Select teacher</option>
          {teachers.map((t) => (
            <option key={t.id} value={t.id}>
              {t.username}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-end">
        <SubmitButton />
      </div>
    </form>
  );
}