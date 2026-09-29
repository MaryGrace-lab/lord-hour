"use client";

import { useFormStatus } from "react-dom";
import { toast } from "react-hot-toast";
import { createLesson } from "@/lib/teacher-actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-accent text-primary px-4 py-2 rounded-md hover:bg-accent-light disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      {pending ? "Adding..." : "Add Lesson"}
    </button>
  );
}

export function AddLessonForm({
  courseId,
  moduleId,
}: {
  courseId: string;
  moduleId: string;
}) {
  async function handleAction(formData: FormData) {
    try {
      await createLesson(formData);
      toast.success("Lesson added");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Unable to add lesson"
      );
      throw err;
    }
  }

  return (
    <form action={handleAction} className="space-y-2">
      <input type="hidden" name="courseId" value={courseId} />
      <input type="hidden" name="moduleId" value={moduleId} />
      <label htmlFor={`lesson-title-${moduleId}`} className="sr-only">
        Lesson title
      </label>
      <input
        id={`lesson-title-${moduleId}`}
        name="title"
        placeholder="Lesson title"
        required
        maxLength={200}
        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      />
      <label htmlFor={`lesson-content-${moduleId}`} className="sr-only">
        Lesson content (optional)
      </label>
      <textarea
        id={`lesson-content-${moduleId}`}
        name="content"
        placeholder="Lesson content (optional)"
        rows={3}
        maxLength={50000}
        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      />
      <SubmitButton />
    </form>
  );
}