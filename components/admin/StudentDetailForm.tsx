"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { updateStudent } from "@/lib/admin-actions";
import { toggleStudentActive } from "@/lib/admin-actions";

const initialState = { success: false, error: "" };

type StudentDetailFormProps = {
  user: {
    id: string;
    username: string;
    isActive: boolean;
    studentProfile?: {
      studentId: string;
      firstName: string | null;
      lastName: string | null;
      programmeId: string | null;
      programme?: { id: string; name: string } | null;
    } | null;
    enrollments: { id: string; course: { title: string; code: string } }[];
  };
  programmes: { id: string; name: string }[];
};

export function StudentDetailForm({ user, programmes }: StudentDetailFormProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(updateStudent, initialState);
  const [isToggling, setIsToggling] = useState(false);

  useEffect(() => {
    if (state.success) {
      toast.success("Student updated successfully!");
      router.refresh();
    }
    if (state.error) toast.error(state.error);
  }, [state, router]);

  const handleToggleActive = async () => {
    if (!window.confirm(`Are you sure you want to ${user.isActive ? "deactivate" : "activate"} this student?`)) {
      return;
    }
    setIsToggling(true);
    try {
      const formData = new FormData();
      formData.append("userId", user.id);
      await toggleStudentActive(formData);
      toast.success(`Student ${user.isActive ? "deactivated" : "activated"} successfully!`);
      router.refresh();
    } catch {
      toast.error("Unable to change student status");
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Edit form */}
      <form action={formAction} className="bg-white rounded-lg shadow-sm p-6 space-y-4 md:col-span-2">
        <input type="hidden" name="userId" value={user.id} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Username (Login)</label>
            <input value={user.username} disabled className="w-full border px-3 py-2 rounded-md bg-gray-100" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Student ID</label>
            <input
              name="studentId"
              defaultValue={user.studentProfile?.studentId || ""}
              required
              className="w-full border px-3 py-2 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">First Name</label>
            <input
              name="firstName"
              defaultValue={user.studentProfile?.firstName || ""}
              className="w-full border px-3 py-2 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Last Name</label>
            <input
              name="lastName"
              defaultValue={user.studentProfile?.lastName || ""}
              className="w-full border px-3 py-2 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Programme</label>
            <select
              name="programmeId"
              defaultValue={user.studentProfile?.programmeId || ""}
              className="w-full border px-3 py-2 rounded-md"
            >
              <option value="">Select programme</option>
              {programmes.map((prog) => (
                <option key={prog.id} value={prog.id}>
                  {prog.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-light disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Save Changes"}
        </button>
      </form>

      {/* Status and enrolled courses */}
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="font-semibold mb-3">Status</h3>
          <span
            className={`px-2 py-1 text-xs rounded-full ${
              user.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {user.isActive ? "Active" : "Inactive"}
          </span>
          <button
            onClick={handleToggleActive}
            disabled={isToggling}
            className="mt-4 w-full bg-accent text-primary px-4 py-2 rounded-md hover:bg-accent-light disabled:opacity-50"
          >
            {isToggling ? "Processing..." : user.isActive ? "Deactivate Student" : "Activate Student"}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="font-semibold mb-3">Enrolled Courses</h3>
          {user.enrollments.length === 0 ? (
            <p className="text-gray-500 text-sm">No courses enrolled.</p>
          ) : (
            <ul className="space-y-2">
              {user.enrollments.map((enrollment) => (
                <li key={enrollment.id} className="text-sm">
                  {enrollment.course.title} ({enrollment.course.code})
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}