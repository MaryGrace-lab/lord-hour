"use client";

import { useFormStatus } from "react-dom";
import { toast } from "react-hot-toast";
import { markLessonComplete } from "@/lib/student-actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-accent text-primary px-6 py-2 rounded-md hover:bg-accent-light font-medium disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      {pending ? "Marking..." : "Mark as Complete"}
    </button>
  );
}

export function MarkLessonCompleteButton({ lessonId }: { lessonId: string }) {
  async function handleAction(formData: FormData) {
    try {
      await markLessonComplete(formData);
      toast.success("Lesson marked as complete");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to mark lesson complete";
      toast.error(message);
      throw err;
    }
  }

  return (
    <form action={handleAction}>
      <input type="hidden" name="lessonId" value={lessonId} />
      <SubmitButton />
    </form>
  );
}