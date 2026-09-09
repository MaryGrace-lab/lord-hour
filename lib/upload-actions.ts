"use server";

import cloudinary from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// Allowed file extensions (lowercase)
const ALLOWED_EXTENSIONS = ["pdf", "doc", "docx", "ppt", "pptx", "png", "jpg", "jpeg", "txt"];
const MAX_FILE_SIZE_MB = 10;

type CloudinaryUploadResult = {
  secure_url: string;
};

export async function uploadMaterial(formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== "TEACHER") {
    throw new Error("Unauthorized");
  }
  const teacherId = session.user.id;

  const lessonId = formData.get("lessonId")?.toString();
  const file = formData.get("file") as File;

  if (!lessonId || !file) {
    throw new Error("Lesson and file are required");
  }

  const maxSizeBytes = MAX_FILE_SIZE_MB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    throw new Error("File is too large (max 10 MB)");
  }

  const fileName = file.name;
  const fileExt = fileName.split(".").pop()?.toLowerCase() || "";
  if (!ALLOWED_EXTENSIONS.includes(fileExt)) {
    throw new Error("File type not allowed");
  }

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      module: {
        include: {
          course: {
            include: {
              teachers: { where: { id: teacherId } },
            },
          },
        },
      },
    },
  });

  if (!lesson || lesson.module.course.teachers.length === 0) {
    throw new Error("You are not authorized to upload to this lesson");
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const uploadResult = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "course_materials",
        resource_type: "auto",
        public_id: `${Date.now()}_${fileName.replace(/\s+/g, "_")}`,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(buffer);
  });

  const secureUrl = (uploadResult as CloudinaryUploadResult).secure_url;

  await prisma.material.create({
    data: {
      title: fileName,
      fileUrl: secureUrl,
      type: fileExt,
      lessonId,
    },
  });

  revalidatePath(`/teacher/courses/${lesson.module.course.id}`);
}