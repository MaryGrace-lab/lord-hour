"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { updateTeacherProfileAction } from "@/lib/teacher-actions";

const initialState = {
  success: false,
  error: "",
};

export function EditTeacherProfileForm({
  teacher,
}: {
  teacher?: { firstName: string | null; lastName: string | null } | null;
}) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    updateTeacherProfileAction,
    initialState
  );

  useEffect(() => {
    if (state.success) {
      toast.success("Changes saved successfully!");
      const timer = setTimeout(() => {
        router.push("/teacher/profile");
      }, 1200);
      return () => clearTimeout(timer);
    }
    if (state.error) {
      toast.error(state.error);
    }
  }, [state, router]);

  return (
    <div className="max-w-md mx-auto">
      <h3 className="text-xl font-bold text-primary mb-4">Edit Profile</h3>
      <form action={formAction} className="bg-white rounded-lg shadow-sm p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">First Name</label>
          <input
            name="firstName"
            defaultValue={teacher?.firstName || ""}
            className="w-full border px-3 py-2 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Last Name</label>
          <input
            name="lastName"
            defaultValue={teacher?.lastName || ""}
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
    </div>
  );
}