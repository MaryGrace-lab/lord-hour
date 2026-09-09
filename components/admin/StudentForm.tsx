"use client";

import { useActionState, useEffect } from "react";
import { createStudent } from "@/lib/admin-actions";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

const initialState = { success: false, error: "" };

type Programme = {
  id: string;
  name: string;
};

export function StudentForm({ programmes }: { programmes: Programme[] }) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(createStudent, initialState);

  useEffect(() => {
    if (state.success) {
      toast.success("Student created successfully!");
      router.push("/admin/students");
    }
    if (state.error) toast.error(state.error);
  }, [state, router]);

  return (
    <form action={formAction} className="bg-white rounded-lg shadow-sm p-6 space-y-4 max-w-lg mx-auto">
      <div>
        <label className="block text-sm font-medium mb-1">Username</label>
        <input name="username" required className="w-full border px-3 py-2 rounded-md" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Password</label>
        <input name="password" type="password" required className="w-full border px-3 py-2 rounded-md" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">First Name</label>
        <input name="firstName" className="w-full border px-3 py-2 rounded-md" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Last Name</label>
        <input name="lastName" className="w-full border px-3 py-2 rounded-md" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Student ID</label>
        <input name="studentId" required className="w-full border px-3 py-2 rounded-md" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Programme</label>
        <select name="programmeId" className="w-full border px-3 py-2 rounded-md">
          <option value="">Select programme</option>
          {programmes.map((prog) => (
            <option key={prog.id} value={prog.id}>
              {prog.name}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-light disabled:opacity-50"
      >
        {isPending ? "Creating..." : "Create Student"}
      </button>
    </form>
  );
}