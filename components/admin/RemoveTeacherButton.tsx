"use client";

import { useFormStatus } from "react-dom";
import { toast } from "react-hot-toast";
import { removeTeacher } from "@/lib/admin-actions";

function RemoveButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 rounded"
    >
      {pending ? "Removing..." : "Remove"}
    </button>
  );
}

export function RemoveTeacherButton({
  courseId,
  teacherId,
  courseTitle,
  teacherUsername,
}: {
  courseId: string;
  teacherId: string;
  courseTitle: string;
  teacherUsername: string;
}) {
  async function handleAction(formData: FormData) {
    try {
      await removeTeacher(formData);
      toast.success("Teacher removed from course");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to remove teacher";
      toast.error(message);
      throw err;
    }
  }

  return (
    <form
      action={handleAction}
      onSubmit={(e) => {
        if (
          !window.confirm(
            `Remove ${teacherUsername} from "${courseTitle}"?`
          )
        ) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="courseId" value={courseId} />
      <input type="hidden" name="teacherId" value={teacherId} />
      <RemoveButton />
    </form>
  );
}