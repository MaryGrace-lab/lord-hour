"use client";

import { useRef, useState } from "react";
import { recordMaterial } from "@/lib/upload-actions";

type LessonOption = {
  id: string;
  title: string;
};

type MaterialUploadFormProps = {
  lessonId?: string;
  lessonOptions?: LessonOption[];
};

type SignResponse = {
  timestamp: number;
  signature: string;
  apiKey: string;
  cloudName: string;
  folder: string;
  allowedFormats: string;
};

type CloudinaryUploadResponse = {
  secure_url: string;
  public_id: string;
  format: string;
  bytes: number;
};

const ALLOWED_EXTENSIONS = [
  "pdf",
  "doc",
  "docx",
  "ppt",
  "pptx",
  "png",
  "jpg",
  "jpeg",
  "txt",
] as const;

const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

function getExtension(fileName: string): string {
  const parts = fileName.split(".");
  return parts.length > 1 ? parts.pop()!.toLowerCase() : "";
}

export function MaterialUploadForm({
  lessonId,
  lessonOptions,
}: MaterialUploadFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsUploading(true);
    setMessage("");
    setIsError(false);

    const form = event.currentTarget;
    const formData = new FormData(form);

    // Resolve lessonId: either fixed by prop or chosen in the select.
    const selectedLessonId = lessonId ?? (formData.get("lessonId") as string | null);
    if (!selectedLessonId) {
      setMessage("Please select a lesson.");
      setIsError(true);
      setIsUploading(false);
      return;
    }

    const file = formData.get("file");
    if (!(file instanceof File) || file.size === 0) {
      setMessage("Please choose a file to upload.");
      setIsError(true);
      setIsUploading(false);
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setMessage(`File is too large (max ${MAX_FILE_SIZE_MB} MB).`);
      setIsError(true);
      setIsUploading(false);
      return;
    }

    const extension = getExtension(file.name);
    if (!ALLOWED_EXTENSIONS.includes(extension as (typeof ALLOWED_EXTENSIONS)[number])) {
      setMessage("File type not allowed.");
      setIsError(true);
      setIsUploading(false);
      return;
    }

    try {
      // ─── 1. Get a signed upload token from the server ───
      const signRes = await fetch("/api/cloudinary/sign", { method: "POST" });
      if (!signRes.ok) {
        if (signRes.status === 401) {
          throw new Error("Your session has expired. Please log in again.");
        }
        throw new Error("Unable to prepare upload. Please try again.");
      }
      const sign = (await signRes.json()) as SignResponse;

      // ─── 2. Upload the file directly to Cloudinary ───
      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("api_key", sign.apiKey);
      uploadData.append("timestamp", String(sign.timestamp));
      uploadData.append("signature", sign.signature);
      uploadData.append("folder", sign.folder);
      uploadData.append("allowed_formats", sign.allowedFormats);

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${sign.cloudName}/auto/upload`,
        { method: "POST", body: uploadData }
      );

      if (!uploadRes.ok) {
        const errBody = await uploadRes.json().catch(() => null);
        const detail =
          errBody && typeof errBody.error?.message === "string"
            ? errBody.error.message
            : "Upload to Cloudinary failed.";
        throw new Error(detail);
      }

      const uploaded = (await uploadRes.json()) as CloudinaryUploadResponse;

      // ─── 3. Persist metadata via the server action ───
      const recordData = new FormData();
      recordData.append("lessonId", selectedLessonId);
      recordData.append("title", file.name);
      recordData.append("fileUrl", uploaded.secure_url);
      recordData.append("type", extension);

      const result = await recordMaterial({ success: false }, recordData);

      if (!result.success) {
        throw new Error(result.error || "Unable to save material.");
      }

      setMessage("Upload successful!");
      setIsError(false);
      form.reset();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Upload failed";
      setMessage(errorMessage);
      setIsError(true);
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-3">
      {!lessonId && lessonOptions && lessonOptions.length > 0 && (
        <div>
          <label
            htmlFor="material-lesson"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Select Lesson
          </label>
          <select
            id="material-lesson"
            name="lessonId"
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
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

      <div>
        <label
          htmlFor="material-file"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          File
        </label>
        <input
          id="material-file"
          type="file"
          name="file"
          accept=".pdf,.doc,.docx,.ppt,.pptx,.png,.jpg,.jpeg,.txt"
          required
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-light"
        />
        <p className="mt-1 text-xs text-gray-500">
          Max {MAX_FILE_SIZE_MB} MB. Allowed: PDF, Word, PowerPoint, image, or text.
        </p>
      </div>

      <button
        type="submit"
        disabled={isUploading}
        className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-light disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        {isUploading ? "Uploading..." : "Upload"}
      </button>

      {message && (
        <p
          role="status"
          aria-live="polite"
          className={`text-sm ${isError ? "text-red-600" : "text-green-700"}`}
        >
          {message}
        </p>
      )}
    </form>
  );
}