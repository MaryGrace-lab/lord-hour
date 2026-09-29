"use client";

import { useActionState, useEffect, useState } from "react";
import { createStudent } from "@/lib/admin-actions";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

const initialState: { success: boolean; error?: string } = { success: false };

type ApplicationPrefill = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
} | null;

export function StudentForm({
  application = null,
}: {
  application?: ApplicationPrefill;
}) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    createStudent,
    initialState
  );
  const [sendActivation, setSendActivation] = useState(true);

  useEffect(() => {
    if (state.success) {
      toast.success(
        sendActivation
          ? "Student created. Activation email sent."
          : "Student created successfully!"
      );
      router.push("/admin/students");
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state, router, sendActivation]);

  const nameParts = application?.fullName?.trim().split(/\s+/) || [];
  const prefillFirstName = nameParts[0] || "";
  const prefillLastName = nameParts.slice(1).join(" ") || "";

  return (
    <form
      action={formAction}
      className="bg-white rounded-lg shadow-sm p-6 space-y-4 max-w-lg mx-auto"
    >
      {application && (
        <input type="hidden" name="applicationId" value={application.id} />
      )}

      <div>
        <label
          htmlFor="student-username"
          className="block text-sm font-medium mb-1"
        >
          Username (Login) <span aria-hidden>*</span>
          <span className="sr-only">(required)</span>
        </label>
        <input
          id="student-username"
          name="username"
          defaultValue={application?.email || ""}
          required
          maxLength={50}
          autoComplete="off"
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        />
        <p className="text-xs text-gray-500 mt-1">
          Used to log in. Default is the email.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="student-first-name"
            className="block text-sm font-medium mb-1"
          >
            First Name
          </label>
          <input
            id="student-first-name"
            name="firstName"
            defaultValue={prefillFirstName}
            maxLength={50}
            autoComplete="given-name"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
        </div>
        <div>
          <label
            htmlFor="student-last-name"
            className="block text-sm font-medium mb-1"
          >
            Last Name
          </label>
          <input
            id="student-last-name"
            name="lastName"
            defaultValue={prefillLastName}
            maxLength={50}
            autoComplete="family-name"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="student-id"
          className="block text-sm font-medium mb-1"
        >
          Student ID <span aria-hidden>*</span>
          <span className="sr-only">(required)</span>
        </label>
        <input
          id="student-id"
          name="studentId"
          required
          maxLength={30}
          placeholder="e.g., THS-2026-001"
          autoComplete="off"
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        />
      </div>

      <div>
        <label
          htmlFor="student-email"
          className="block text-sm font-medium mb-1"
        >
          Email {sendActivation && <span aria-hidden>*</span>}
          {sendActivation && <span className="sr-only">(required)</span>}
        </label>
        <input
          id="student-email"
          name="email"
          type="email"
          defaultValue={application?.email || ""}
          required={sendActivation}
          maxLength={200}
          autoComplete="email"
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        />
      </div>

      <div>
        <label
          htmlFor="student-phone"
          className="block text-sm font-medium mb-1"
        >
          Phone (optional)
        </label>
        <input
          id="student-phone"
          name="phone"
          type="tel"
          defaultValue={application?.phone || ""}
          maxLength={30}
          autoComplete="tel"
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        />
      </div>

      <div className="border-t pt-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="sendActivation"
            checked={sendActivation}
            onChange={(e) => setSendActivation(e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
          <div>
            <p className="font-medium text-sm text-gray-800">
              Send activation email to student
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              The student will receive a secure link to set their own password.
            </p>
          </div>
        </label>
      </div>

      {!sendActivation && (
        <div>
          <label
            htmlFor="student-password"
            className="block text-sm font-medium mb-1"
          >
            Password <span aria-hidden>*</span>
            <span className="sr-only">(required)</span>
          </label>
          <input
            id="student-password"
            name="password"
            type="password"
            required
            minLength={8}
            maxLength={100}
            autoComplete="new-password"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
          <p className="text-xs text-gray-500 mt-1">Minimum 8 characters.</p>
        </div>
      )}

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
        {isPending ? "Creating..." : "Create Student"}
      </button>
    </form>
  );
}