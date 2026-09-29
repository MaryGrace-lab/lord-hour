"use client";

import { useFormStatus } from "react-dom";
import { toast } from "react-hot-toast";
import { gradeSubmission } from "@/lib/teacher-actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-accent text-primary px-4 py-2 rounded-md hover:bg-accent-light disabled:opacity-50 sm:col-span-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      {pending ? "Saving..." : "Save Grade"}
    </button>
  );
}

export function GradeSubmissionForm({
  submissionId,
  maxScore,
  initialScore,
  initialFeedback,
}: {
  submissionId: string;
  maxScore: number;
  initialScore: number | null;
  initialFeedback: string | null;
}) {
  async function handleSubmit(formData: FormData) {
    try {
      await gradeSubmission(formData);
      toast.success("Grade saved");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to save grade";
      toast.error(message);
    }
  }

  return (
    <form
      action={handleSubmit}
      className="grid grid-cols-1 sm:grid-cols-3 gap-3"
    >
      <input type="hidden" name="submissionId" value={submissionId} />

      <div className="sm:col-span-1">
        <label htmlFor={`score-${submissionId}`} className="sr-only">
          Score
        </label>
        <input
          id={`score-${submissionId}`}
          name="score"
          type="number"
          min={0}
          max={maxScore}
          step={1}
          placeholder={`Score (max ${maxScore})`}
          defaultValue={initialScore ?? ""}
          required
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        />
      </div>

      <div className="sm:col-span-2">
        <label htmlFor={`feedback-${submissionId}`} className="sr-only">
          Feedback
        </label>
        <input
          id={`feedback-${submissionId}`}
          name="feedback"
          placeholder="Feedback (optional)"
          defaultValue={initialFeedback ?? ""}
          maxLength={2000}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        />
      </div>

      <SubmitButton />
    </form>
  );
}