"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import {
  updateStudent,
  toggleStudentActive,
  enrollStudent,
  removeEnrollment,
  deleteStudent,
} from "@/lib/admin-actions";
import { ConfirmDeleteButton } from "@/components/ConfirmDeleteButton";
import { TypeToConfirmDelete } from "@/components/admin/TypeToConfirmDelete";

const initialState: { success: boolean; error?: string } = { success: false };

type CourseOption = { id: string; title: string };

type Enrollment = {
  id: string;
  enrolledAt: Date;
  course: {
    id: string;
    title: string;
    teachers: { username: string }[];
  };
};

type StudentDetailFormProps = {
  user: {
    id: string;
    username: string;
    isActive: boolean;
    studentProfile?: {
      studentId: string;
      firstName: string | null;
      lastName: string | null;
      email: string | null;
      phone: string | null;
    } | null;
    enrollments: Enrollment[];
  };
  availableCourses: CourseOption[];
};

export function StudentDetailForm({
  user,
  availableCourses,
}: StudentDetailFormProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    updateStudent,
    initialState
  );
  const [isToggling, setIsToggling] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);

  useEffect(() => {
    if (state.success) {
      toast.success("Student updated successfully!");
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
        } this student?`
      )
    ) {
      return;
    }
    setIsToggling(true);
    try {
      const formData = new FormData();
      formData.append("userId", user.id);
      const result = await toggleStudentActive(formData);
      if (!result.success) {
        toast.error(result.error || "Unable to change student status");
        return;
      }
      toast.success(
        `Student ${user.isActive ? "deactivated" : "activated"} successfully!`
      );
      router.refresh();
    } catch {
      toast.error("Unable to change student status");
    } finally {
      setIsToggling(false);
    }
  };

  const handleEnroll = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsEnrolling(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.append("studentId", user.id);

    try {
      await enrollStudent(formData);
      toast.success("Course assigned successfully!");
      form.reset();
      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to assign course";
      toast.error(message);
    } finally {
      setIsEnrolling(false);
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
                htmlFor="detail-username"
                className="block text-sm font-medium mb-1"
              >
                Username (Login)
              </label>
              <input
                id="detail-username"
                value={user.username}
                disabled
                className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100"
              />
            </div>
            <div>
              <label
                htmlFor="detail-student-id"
                className="block text-sm font-medium mb-1"
              >
                Student ID <span aria-hidden>*</span>
                <span className="sr-only">(required)</span>
              </label>
              <input
                id="detail-student-id"
                name="studentId"
                defaultValue={user.studentProfile?.studentId || ""}
                required
                maxLength={30}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>
            <div>
              <label
                htmlFor="detail-first-name"
                className="block text-sm font-medium mb-1"
              >
                First Name
              </label>
              <input
                id="detail-first-name"
                name="firstName"
                defaultValue={user.studentProfile?.firstName || ""}
                maxLength={50}
                autoComplete="given-name"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>
            <div>
              <label
                htmlFor="detail-last-name"
                className="block text-sm font-medium mb-1"
              >
                Last Name
              </label>
              <input
                id="detail-last-name"
                name="lastName"
                defaultValue={user.studentProfile?.lastName || ""}
                maxLength={50}
                autoComplete="family-name"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>
            <div className="md:col-span-2">
              <label
                htmlFor="detail-email"
                className="block text-sm font-medium mb-1"
              >
                Email
              </label>
              <input
                id="detail-email"
                name="email"
                type="email"
                defaultValue={user.studentProfile?.email || ""}
                maxLength={200}
                autoComplete="email"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>
            <div className="md:col-span-2">
              <label
                htmlFor="detail-phone"
                className="block text-sm font-medium mb-1"
              >
                Phone
              </label>
              <input
                id="detail-phone"
                name="phone"
                type="tel"
                defaultValue={user.studentProfile?.phone || ""}
                maxLength={30}
                autoComplete="tel"
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
            {isPending ? "Saving..." : "Save Changes"}
          </button>
        </form>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="font-semibold mb-3">Account Status</h2>
            <span
              role="status"
              aria-live="polite"
              className={`inline-block px-2 py-1 text-xs rounded-full ${
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
                ? "Deactivate Student"
                : "Activate Student"}
            </button>
          </div>
        </div>
      </div>

      <section
        className="bg-white rounded-lg shadow-sm p-6"
        aria-labelledby="assigned-courses-heading"
      >
        <h2
          id="assigned-courses-heading"
          className="font-semibold text-lg text-primary mb-4"
        >
          Assigned Courses ({user.enrollments.length})
        </h2>

        {user.enrollments.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No courses assigned to this student yet.
          </p>
        ) : (
          <ul className="divide-y">
            {user.enrollments.map((enrollment) => (
              <li
                key={enrollment.id}
                className="py-3 flex items-center justify-between gap-4"
              >
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">
                    {enrollment.course.title}
                  </p>
                  {enrollment.course.teachers.length > 0 && (
                    <p className="text-xs text-gray-500 truncate">
                      {enrollment.course.teachers
                        .map((t) => t.username)
                        .join(", ")}
                    </p>
                  )}
                </div>
                <ConfirmDeleteButton
                  formAction={removeEnrollment}
                  hiddenFields={{ enrollmentId: enrollment.id }}
                  confirmMessage={`Remove this student from ${enrollment.course.title}?`}
                >
                  Remove
                </ConfirmDeleteButton>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section
        className="bg-white rounded-lg shadow-sm p-6"
        aria-labelledby="assign-course-heading"
      >
        <h2
          id="assign-course-heading"
          className="font-semibold text-lg text-primary mb-4"
        >
          Assign a Course
        </h2>

        {availableCourses.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No more courses available to assign.
          </p>
        ) : (
          <form
            onSubmit={handleEnroll}
            className="flex flex-col sm:flex-row gap-3"
          >
            <label htmlFor="assign-course-select" className="sr-only">
              Select a course
            </label>
            <select
              id="assign-course-select"
              name="courseId"
              required
              className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <option value="">Select a course</option>
              {availableCourses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
            <button
              type="submit"
              disabled={isEnrolling}
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-light disabled:opacity-50 whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {isEnrolling ? "Assigning..." : "Assign Course"}
            </button>
          </form>
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
          Permanently delete this student account. This will also delete all
          their enrollments, assignment submissions, quiz attempts, and
          lesson progress. This action cannot be undone.
        </p>
        <TypeToConfirmDelete
          action={deleteStudent}
          hiddenFields={{ userId: user.id }}
          expectedText={user.username}
          title="Delete this student account?"
          description={`This permanently deletes the student account for "${user.username}" and all associated records: enrollments, assignment submissions, quiz attempts, and lesson completions. This cannot be undone.`}
          triggerLabel="Delete student account"
          successMessage="Student account deleted"
          successRedirect="/admin/students"
        />
      </section>
    </div>
  );
}