"use client";

import { useFormStatus } from "react-dom";
import { toast } from "react-hot-toast";
import { addQuizQuestion } from "@/lib/teacher-actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-accent text-primary px-4 py-2 rounded-md hover:bg-accent-light disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      {pending ? "Adding..." : "Add Question"}
    </button>
  );
}

export function AddQuestionForm({ quizId }: { quizId: string }) {
  async function handleSubmit(formData: FormData) {
    try {
      await addQuizQuestion(formData);
      toast.success("Question added");
      const form = document.getElementById(
        "add-question-form"
      ) as HTMLFormElement | null;
      form?.reset();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to add question";
      toast.error(message);
    }
  }

  return (
    <form id="add-question-form" action={handleSubmit} className="space-y-3">
      <input type="hidden" name="quizId" value={quizId} />

      <div>
        <label
          htmlFor="q-text"
          className="block text-sm font-medium mb-1"
        >
          Question Text <span aria-hidden>*</span>
          <span className="sr-only">(required)</span>
        </label>
        <textarea
          id="q-text"
          name="questionText"
          required
          maxLength={2000}
          rows={3}
          className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="q-type"
            className="block text-sm font-medium mb-1"
          >
            Question Type
          </label>
          <select
            id="q-type"
            name="questionType"
            className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <option value="multiple_choice">Multiple Choice</option>
            <option value="true_false">True/False</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="q-marks"
            className="block text-sm font-medium mb-1"
          >
            Marks
          </label>
          <input
            id="q-marks"
            name="marks"
            type="number"
            defaultValue={1}
            min={1}
            max={100}
            required
            className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="q-options"
          className="block text-sm font-medium mb-1"
        >
          Options (for MCQ, JSON array)
        </label>
        <input
          id="q-options"
          name="options"
          placeholder='["Option A","Option B","Option C"]'
          maxLength={5000}
          className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        />
      </div>

      <div>
        <label
          htmlFor="q-answer"
          className="block text-sm font-medium mb-1"
        >
          Correct Answer <span aria-hidden>*</span>
          <span className="sr-only">(required)</span>
        </label>
        <input
          id="q-answer"
          name="correctAnswer"
          required
          maxLength={500}
          className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        />
        <p className="text-xs text-gray-500 mt-1">
          For MCQ: must exactly match one of the options. For True/False:
          &quot;true&quot; or &quot;false&quot;.
        </p>
      </div>

      <SubmitButton />
    </form>
  );
}