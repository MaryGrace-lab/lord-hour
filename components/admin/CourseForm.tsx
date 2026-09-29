"use client";

import { useActionState, useEffect } from "react";
import { createCourse } from "@/lib/admin-actions";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

const initialState: { success: boolean; error?: string } = {
  success: false,
};

export function CourseForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    createCourse,
    initialState
  );

  useEffect(() => {
    if (state.success) {
      toast.success("Course created successfully!");
      router.push("/admin/courses");
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state, router]);

  return (
    <form
      action={formAction}
      className="bg-white rounded-lg shadow-sm p-6 space-y-4 max-w-2xl mx-auto"
    >
      <div>
        <label
          htmlFor="course-title"
          className="block text-sm font-medium mb-1"
        >
          Course Title <span aria-hidden>*</span>
          <span className="sr-only">(required)</span>
        </label>
        <input
          id="course-title"
          name="title"
          required
          maxLength={200}
          placeholder="e.g., Theology"
          autoComplete="off"
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        />
      </div>

      <div>
        <label
          htmlFor="course-description"
          className="block text-sm font-medium mb-1"
        >
          Description (optional)
        </label>
        <textarea
          id="course-description"
          name="description"
          rows={4}
          maxLength={2000}
          placeholder="Short description of the course..."
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        />
      </div>

      <p className="text-sm text-gray-500">
        The course will be published immediately. You can hide it later from
        the courses list if needed.
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
        {isPending ? "Creating..." : "Create Course"}
      </button>
    </form>
  );
}