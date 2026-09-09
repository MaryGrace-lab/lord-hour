"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { updateTeacher, toggleTeacherActive } from "@/lib/admin-actions";

const initialState = { success: false, error: "" };

type TeacherDetailFormProps = {
  user: {
    id: string;
    username: string;
    isActive: boolean;
    teacherProfile?: {
      firstName: string | null;
      lastName: string | null;
      staffId: string | null;
    } | null;
    coursesTeaching: { id: string; title: string; code: string }[];
  };
};

export function TeacherDetailForm({ user }: TeacherDetailFormProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(updateTeacher, initialState);
  const [isToggling, setIsToggling] = useState(false);

  useEffect(() => {
    if (state.success) {
      toast.success("Teacher updated successfully!");
      router.refresh();
    }
    if (state.error) toast.error(state.error);
  }, [state, router]);

  const handleToggleActive = async () => {
    if (!window.confirm(`Are you sure you want to ${user.isActive ? "deactivate" : "activate"} this teacher?`)) {
      return;
    }
    setIsToggling(true);
    try {
      const formData = new FormData();
      formData.append("userId", user.id);
      await toggleTeacherActive(formData);
      toast.success(`Teacher ${user.isActive ? "deactivated" : "activated"} successfully!`);
      router.refresh();
    } catch {
      toast.error("Unable to change teacher status");
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
            <label className="block text-sm font-medium mb-1">Staff ID</label>
            <input
              name="staffId"
              defaultValue={user.teacherProfile?.staffId || ""}
              className="w-full border px-3 py-2 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">First Name</label>
            <input
              name="firstName"
              defaultValue={user.teacherProfile?.firstName || ""}
              className="w-full border px-3 py-2 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Last Name</label>
            <input
              name="lastName"
              defaultValue={user.teacherProfile?.lastName || ""}
              className="w-full border px-3 py-2 rounded-md"
            />
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

      {/* Status and assigned courses */}
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
            {isToggling ? "Processing..." : user.isActive ? "Deactivate Teacher" : "Activate Teacher"}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="font-semibold mb-3">Assigned Courses</h3>
          {user.coursesTeaching.length === 0 ? (
            <p className="text-gray-500 text-sm">No courses assigned.</p>
          ) : (
            <ul className="space-y-2">
              {user.coursesTeaching.map((course) => (
                <li key={course.id} className="text-sm">
                  {course.title} ({course.code})
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}