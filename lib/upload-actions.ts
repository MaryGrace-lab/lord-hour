"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { Role } from "@prisma/client";
import { recordMaterialSchema, validationError } from "@/lib/validations";

/**
 * Records a material that was uploaded directly to Cloudinary by the browser.
 * The actual file upload happens client-side (see app/api/cloudinary/sign),
 * bypassing Next.js server-action body-size limits.
 */
export async function recordMaterial(
  _prevState: { success: boolean; error?: string },
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const session = await auth();
  if (!session || session.user.role !== Role.TEACHER) {
    return { success: false, error: "Unauthorized" };
  }

  const parsed = recordMaterialSchema.safeParse({
    lessonId: formData.get("lessonId"),
    title: formData.get("title"),
    fileUrl: formData.get("fileUrl"),
    type: formData.get("type"),
  });
  if (!parsed.success) return validationError(parsed.error);

  const { lessonId, title, fileUrl, type } = parsed.data;

  // Ownership: this teacher must be assigned to the course that owns the lesson.
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      module: {
        include: {
          course: {
            include: { teachers: { where: { id: session.user.id } } },
          },
        },
      },
    },
  });

  if (!lesson || lesson.module.course.teachers.length === 0) {
    return { success: false, error: "Not authorized for this lesson" };
  }

  try {
    await prisma.material.create({
      data: { title, fileUrl, type, lessonId },
    });

    revalidatePath(`/teacher/courses/${lesson.module.course.id}`);
    return { success: true };
  } catch (error) {
    console.error("Record material error:", error);
    return { success: false, error: "Unable to save material" };
  }
}