"use client";

import { useActionState, useEffect } from "react";
import { createTeacher } from "@/lib/admin-actions";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

const initialState: { success: boolean; error?: string } = { success: false };

export function TeacherForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    createTeacher,
    initialState
  );

  useEffect(() => {
    if (state.success) {
      toast.success("Teacher created successfully!");
      router.push("/admin/teachers");
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state, router]);

  return (
    <form
      action={formAction}
      className="bg-white rounded-lg shadow-sm p-6 space-y-4 max-w-lg mx-auto"
    >
      <div>
        <label
          htmlFor="teacher-username-new"
          className="block text-sm font-medium mb-1"
        >
          Username <span aria-hidden>*</span>
          <span className="sr-only">(required)</span>
        </label>
        <input
          id="teacher-username-new"
          name="username"
          required
          minLength={3}
          maxLength={50}
          autoComplete="off"
          className="w-full border px-3 py-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        />
        <p className="text-xs text-gray-500 mt-1">
          Lowercase letters, numbers, dots, underscores, and hyphens only.
        </p>
      </div>

      <div>
        <label
          htmlFor="teacher-password-new"
          className="block text-sm font-medium mb-1"
        >
          Password <span aria-hidden>*</span>
          <span className="sr-only">(required)</span>
        </label>
        <input
          id="teacher-password-new"
          name="password"
          type="password"
          required
          minLength={8}
          maxLength={100}
          autoComplete="new-password"
          className="w-full border px-3 py-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        />
        <p className="text-xs text-gray-500 mt-1">Minimum 8 characters.</p>
      </div>

      <div>
        <label
          htmlFor="teacher-first-name-new"
          className="block text-sm font-medium mb-1"
        >
          First Name
        </label>
        <input
          id="teacher-first-name-new"
          name="firstName"
          maxLength={50}
          autoComplete="given-name"
          className="w-full border px-3 py-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        />
      </div>

      <div>
        <label
          htmlFor="teacher-last-name-new"
          className="block text-sm font-medium mb-1"
        >
          Last Name
        </label>
        <input
          id="teacher-last-name-new"
          name="lastName"
          maxLength={50}
          autoComplete="family-name"
          className="w-full border px-3 py-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        />
      </div>

      <div>
        <label
          htmlFor="teacher-staff-id-new"
          className="block text-sm font-medium mb-1"
        >
          Staff ID
        </label>
        <input
          id="teacher-staff-id-new"
          name="staffId"
          maxLength={30}
          autoComplete="off"
          className="w-full border px-3 py-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        />
      </div>

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
        className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-light disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        {isPending ? "Creating..." : "Create Teacher"}
      </button>
    </form>
  );
}