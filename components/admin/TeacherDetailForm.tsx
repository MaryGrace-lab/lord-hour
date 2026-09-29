"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import {
  updateTeacher,
  toggleTeacherActive,
  deleteTeacher,
} from "@/lib/admin-actions";
import { TypeToConfirmDelete } from "@/components/admin/TypeToConfirmDelete";

const initialState: { success: boolean; error?: string } = { success: false };

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
    coursesTeaching: { id: string; title: string }[];
  };
};

export function TeacherDetailForm({ user }: TeacherDetailFormProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    updateTeacher,
    initialState
  );
  const [isToggling, setIsToggling] = useState(false);

  useEffect(() => {
    if (state.success) {
      toast.success("Teacher updated successfully!");
      router.refresh();
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state, router]);

  const handleToggleActive = async () => {
    if (
      !window.confirm(
        `Are you sure you want to ${
          user.isActive ? "deactivate" : "activate"
        } this teacher?`
      )
    ) {
      return;
    }
    setIsToggling(true);
    try {
      const formData = new FormData();
      formData.append("userId", user.id);
      const result = await toggleTeacherActive(formData);
      if (!result.success) {
        toast.error(result.error || "Unable to change teacher status");
        return;
      }
      toast.success(
        `Teacher ${user.isActive ? "deactivated" : "activated"} successfully!`
      );
      router.refresh();
    } catch {
      toast.error("Unable to change teacher status");
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <form
          action={formAction}
          className="bg-white rounded-lg shadow-sm p-6 space-y-4 md:col-span-2"
        >
          <input type="hidden" name="userId" value={user.id} />

          <h2 className="font-semibold text-lg text-primary">
            Account Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="teacher-username"
                className="block text-sm font-medium mb-1"
              >
                Username (Login)
              </label>
              <input
                id="teacher-username"
                value={user.username}
                disabled
                className="w-full border px-3 py-2 rounded-md bg-gray-100"
              />
            </div>
            <div>
              <label
                htmlFor="teacher-staff-id"
                className="block text-sm font-medium mb-1"
              >
                Staff ID
              </label>
              <input
                id="teacher-staff-id"
                name="staffId"
                defaultValue={user.teacherProfile?.staffId || ""}
                maxLength={30}
                className="w-full border px-3 py-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>
            <div>
              <label
                htmlFor="teacher-first-name"
                className="block text-sm font-medium mb-1"
              >
                First Name
              </label>
              <input
                id="teacher-first-name"
                name="firstName"
                defaultValue={user.teacherProfile?.firstName || ""}
                maxLength={50}
                autoComplete="given-name"
                className="w-full border px-3 py-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>
            <div>
              <label
                htmlFor="teacher-last-name"
                className="block text-sm font-medium mb-1"
              >
                Last Name
              </label>
              <input
                id="teacher-last-name"
                name="lastName"
                defaultValue={user.teacherProfile?.lastName || ""}
                maxLength={50}
                autoComplete="family-name"
                className="w-full border px-3 py-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
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
            {isPending ? "Saving..." : "Save Changes"}
          </button>
        </form>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="font-semibold mb-3">Status</h2>
            <span
              role="status"
              aria-live="polite"
              className={`px-2 py-1 text-xs rounded-full ${
                user.isActive
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {user.isActive ? "Active" : "Inactive"}
            </span>
            <button
              type="button"
              onClick={handleToggleActive}
              disabled={isToggling}
              className="mt-4 w-full bg-accent text-primary px-4 py-2 rounded-md hover:bg-accent-light disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {isToggling
                ? "Processing..."
                : user.isActive
                ? "Deactivate Teacher"
                : "Activate Teacher"}
            </button>
          </div>
        </div>
      </div>

      <section
        className="bg-white rounded-lg shadow-sm p-6"
        aria-labelledby="teacher-courses-heading"
      >
        <h2 id="teacher-courses-heading" className="font-semibold mb-3">
          Assigned Courses ({user.coursesTeaching.length})
        </h2>
        {user.coursesTeaching.length === 0 ? (
          <p className="text-gray-500 text-sm">No courses assigned.</p>
        ) : (
          <ul className="space-y-2">
            {user.coursesTeaching.map((course) => (
              <li key={course.id} className="text-sm">
                {course.title}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section
        className="bg-white rounded-lg shadow-sm p-6 border border-red-200"
        aria-labelledby="danger-zone-heading"
      >
        <h2
          id="danger-zone-heading"
          className="font-semibold text-lg text-red-700 mb-2"
        >
          Danger Zone
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Permanently delete this teacher account. This will also delete their
          staff profile and any announcements they authored. Courses they
          teach will remain but lose them as a teacher. This action cannot be
          undone.
        </p>
        <TypeToConfirmDelete
          action={deleteTeacher}
          hiddenFields={{ userId: user.id }}
          expectedText={user.username}
          title="Delete this teacher account?"
          description={`This permanently deletes the teacher account for "${user.username}", their staff profile, and all announcements they authored. Courses they teach will remain but lose them as a teacher. This cannot be undone.`}
          triggerLabel="Delete teacher account"
          successMessage="Teacher account deleted"
          successRedirect="/admin/teachers"
        />
      </section>
    </div>
  );
}