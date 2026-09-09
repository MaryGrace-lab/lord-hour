"use client";

import { useRef, useState } from "react";
import { uploadMaterial } from "@/lib/upload-actions";

type LessonOption = {
  id: string;
  title: string;
};

type MaterialUploadFormProps = {
  lessonId?: string;
  lessonOptions?: LessonOption[];
};

export function MaterialUploadForm({ lessonId, lessonOptions }: MaterialUploadFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsUploading(true);
    setMessage("");

    const formData = new FormData(event.currentTarget);
    if (lessonId) {
      formData.append("lessonId", lessonId);
    }

    try {
      await uploadMaterial(formData);
      setMessage("Upload successful!");
      formRef.current?.reset();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Upload failed";
      setMessage(errorMessage);
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-3">
      {!lessonId && lessonOptions && lessonOptions.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Lesson
          </label>
          <select
            name="lessonId"
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="">Choose a lesson</option>
            {lessonOptions.map((lesson) => (
              <option key={lesson.id} value={lesson.id}>
                {lesson.title}
              </option>
            ))}
          </select>
        </div>
      )}

      <input
        type="file"
        name="file"
        accept=".pdf,.doc,.docx,.ppt,.pptx,.png,.jpg,.jpeg,.txt"
        required
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-light"
      />
      <button
        type="submit"
        disabled={isUploading}
        className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-light disabled:opacity-50"
      >
        {isUploading ? "Uploading..." : "Upload"}
      </button>
      {message && <p className="text-sm text-gray-600">{message}</p>}
    </form>
  );
}