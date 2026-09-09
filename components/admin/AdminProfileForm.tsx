"use client";

import { useActionState, useEffect } from "react";
import { updateAdminProfile } from "@/lib/admin-actions";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

const initialState = { success: false, error: "" };

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
      toast.success("Profile updated successfully!");
      router.refresh(); // Refresh server component to show updated name
    }
    if (state.error) toast.error(state.error);
  }, [state, router]);

  // Split full name into first/last for initial values
  const nameParts = adminName?.trim().split(/\s+/) || [];
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";

  return (
    <form action={formAction} className="bg-white rounded-lg shadow-sm p-6 space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">First Name</label>
        <input
          name="firstName"
          defaultValue={firstName}
          className="w-full border px-3 py-2 rounded-md"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Last Name</label>
        <input
          name="lastName"
          defaultValue={lastName}
          className="w-full border px-3 py-2 rounded-md"
        />
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-light disabled:opacity-50"
      >
        {isPending ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}