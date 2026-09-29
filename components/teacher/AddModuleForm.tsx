"use client";

import { useFormStatus } from "react-dom";
import { toast } from "react-hot-toast";
import { addModule } from "@/lib/teacher-actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-accent text-primary px-4 py-2 rounded-md hover:bg-accent-light disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      {pending ? "Adding..." : "Add Module"}
    </button>
  );
}

export function AddModuleForm({ courseId }: { courseId: string }) {
  async function handleAction(formData: FormData) {
    try {
      await addModule(formData);
      toast.success("Module added");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Unable to add module"
      );
      throw err;
    }
  }

  return (
    <form action={handleAction} className="flex flex-col sm:flex-row gap-3">
      <input type="hidden" name="courseId" value={courseId} />
      <label htmlFor="module-title" className="sr-only">
        Module title
      </label>
      <input
        id="module-title"
        name="title"
        placeholder="Module title"
        required
        maxLength={200}
        className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      />
      <SubmitButton />
    </form>
  );
}