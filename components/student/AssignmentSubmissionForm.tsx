"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { submitAssignment } from "@/lib/student-actions";

type SubmissionState = {
  success: boolean;
  error?: string;
  isLate?: boolean;
};

const initialState: SubmissionState = { success: false };

const MAX_CONTENT_LENGTH = 10000;

export function AssignmentSubmissionForm({
  assignmentId,
  isResubmit = false,
}: {
  assignmentId: string;
  isResubmit?: boolean;
}) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    submitAssignment,
    initialState
  );

  useEffect(() => {
    if (state.success) {
      toast.success(
        state.isLate
          ? "Assignment submitted (marked as late)."
          : "Assignment submitted successfully."
      );
      router.refresh();
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state, router]);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="assignmentId" value={assignmentId} />

      <div>
        <label
          htmlFor="submission-content"
          className="block text-sm font-medium mb-1"
        >
          Submission Text / Notes
        </label>
        <textarea
          id="submission-content"
          name="content"
          rows={6}
          maxLength={MAX_CONTENT_LENGTH}
          placeholder="Write your answer or notes here..."
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        />
        <p className="text-xs text-gray-500 mt-1">
          Up to {MAX_CONTENT_LENGTH.toLocaleString()} characters.
        </p>
      </div>

      <div>
        <label
          htmlFor="submission-file-url"
          className="block text-sm font-medium mb-1"
        >
          File URL (optional)
        </label>
        <input
          id="submission-file-url"
          name="fileUrl"
          type="url"
          maxLength={2000}
          placeholder="https://..."
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        />
        <p className="text-xs text-gray-500 mt-1">
          If you have uploaded your work to a cloud drive, paste the link here.
        </p>
      </div>

      <p className="text-xs text-gray-500">
        You must provide either text content or a file URL.
      </p>

      {state.error && (
        <p
          role="alert"
          aria-live="assertive"
          className="text-sm text-red-600"
        >
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-light disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        {isPending
          ? "Submitting..."
          : isResubmit
          ? "Resubmit Assignment"
          : "Submit Assignment"}
      </button>
    </form>
  );
}