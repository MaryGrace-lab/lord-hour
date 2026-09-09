"use client";

import { useActionState, useEffect } from "react";
import { createCourse } from "@/lib/admin-actions";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

const initialState = { success: false, error: "" };

type Programme = { id: string; name: string };
type AcademicSession = { id: string; name: string };
type Semester = { id: string; name: string };

export function CourseForm({
  programmes,
  sessions,
  semesters,
}: {
  programmes: Programme[];
  sessions: AcademicSession[];
  semesters: Semester[];
}) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(createCourse, initialState);

  useEffect(() => {
    if (state.success) {
      toast.success("Course created successfully!");
      router.push("/admin/courses");
    }
    if (state.error) toast.error(state.error);
  }, [state, router]);

  return (
    <form action={formAction} className="bg-white rounded-lg shadow-sm p-6 space-y-4 max-w-2xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Course Code</label>
          <input name="code" required className="w-full border px-3 py-2 rounded-md" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Course Title</label>
          <input name="title" required className="w-full border px-3 py-2 rounded-md" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea name="description" rows={3} className="w-full border px-3 py-2 rounded-md" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Credit Units</label>
          <input name="creditUnits" type="number" defaultValue={2} className="w-full border px-3 py-2 rounded-md" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select name="status" className="w-full border px-3 py-2 rounded-md">
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Programme</label>
          <select name="programmeId" className="w-full border px-3 py-2 rounded-md">
            <option value="">Select programme</option>
            {programmes.map((prog) => (
              <option key={prog.id} value={prog.id}>{prog.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Academic Session</label>
          <select name="sessionId" className="w-full border px-3 py-2 rounded-md">
            <option value="">Select session</option>
            {sessions.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Semester</label>
          <select name="semesterId" className="w-full border px-3 py-2 rounded-md">
            <option value="">Select semester</option>
            {semesters.map((sem) => (
              <option key={sem.id} value={sem.id}>{sem.name}</option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-light disabled:opacity-50"
      >
        {isPending ? "Creating..." : "Create Course"}
      </button>
    </form>
  );
}