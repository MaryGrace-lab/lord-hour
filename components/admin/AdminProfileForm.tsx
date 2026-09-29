"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { updateAdminProfile } from "@/lib/admin-actions";

type ProfileState = { success: boolean; error?: string };

const initialState: ProfileState = { success: false };

export function AdminProfileForm({
  adminName,
}: {
  adminName: string | null;
}) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    updateAdminProfile,
    initialState
  );

  useEffect(() => {
    if (state.success) {
      toast.success("Profile updated successfully");
      router.refresh();
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state, router]);

  const nameParts = adminName?.trim().split(/\s+/) || [];
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="admin-first-name"
            className="block text-sm font-medium mb-1"
          >
            First Name
          </label>
          <input
            id="admin-first-name"
            name="firstName"
            defaultValue={firstName}
            maxLength={50}
            autoComplete="given-name"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
        </div>
        <div>
          <label
            htmlFor="admin-last-name"
            className="block text-sm font-medium mb-1"
          >
            Last Name
          </label>
          <input
            id="admin-last-name"
            name="lastName"
            defaultValue={lastName}
            maxLength={50}
            autoComplete="family-name"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
        </div>
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
        {isPending ? "Saving..." : "Save Name"}
      </button>
    </form>
  );
}