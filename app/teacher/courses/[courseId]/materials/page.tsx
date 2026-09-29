import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { deleteMaterial } from "@/lib/teacher-actions";
import { MaterialUploadForm } from "@/components/forms/MaterialUploadForm";
import { ConfirmDeleteButton } from "@/components/ConfirmDeleteButton";
import { BackToCourse } from "@/components/teacher/BackToCourse";
import { FaFileAlt } from "react-icons/fa";
import { z } from "zod";

const cuidSchema = z.string().cuid();

export default async function CourseMaterialsPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const parsedId = cuidSchema.safeParse(courseId);
  if (!parsedId.success) notFound();

  const session = await auth();
  if (!session?.user?.id || session.user.role !== Role.TEACHER) {
    redirect("/bible-college/portal/login");
  }
  const teacherId = session.user.id;

  const course = await prisma.course.findFirst({
    where: {
      id: parsedId.data,
      teachers: { some: { id: teacherId } },
    },
    include: {
      modules: {
        include: {
          lessons: {
            include: { materials: { orderBy: { createdAt: "desc" } } },
            orderBy: { order: "asc" },
          },
        },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!course) notFound();

  const allMaterials = course.modules.flatMap((m) =>
    m.lessons.flatMap((lesson) =>
      lesson.materials.map((material) => ({
        ...material,
        lessonTitle: lesson.title,
      }))
    )
  );

  const lessonOptions = course.modules.flatMap((m) =>
    m.lessons.map((lesson) => ({
      id: lesson.id,
      title: `${m.title} · ${lesson.title}`,
    }))
  );

  return (
    <div className="space-y-6">
      <BackToCourse courseId={courseId} courseTitle={course.title} />

      <h1 className="text-xl font-bold text-primary">
        Course Materials · {course.title}
      </h1>

      <section
        className="bg-white rounded-lg shadow-sm p-6"
        aria-labelledby="upload-material-heading"
      >
        <h2
          id="upload-material-heading"
          className="font-medium mb-3 text-primary"
        >
          Upload New Material
        </h2>
        <p className="text-sm text-gray-500 mb-3">
          Select a lesson and choose a file to upload.
        </p>
        {lessonOptions.length === 0 ? (
          <p className="text-sm text-gray-500">
            Create at least one lesson before uploading materials.
          </p>
        ) : (
          <MaterialUploadForm lessonOptions={lessonOptions} />
        )}
      </section>

      <section
        className="bg-white rounded-lg shadow-sm p-6"
        aria-labelledby="existing-materials-heading"
      >
        <h2
          id="existing-materials-heading"
          className="font-medium mb-3 text-primary"
        >
          Existing Materials ({allMaterials.length})
        </h2>
        {allMaterials.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No materials uploaded yet.
          </p>
        ) : (
          <ul className="divide-y">
            {allMaterials.map((material) => (
              <li
                key={material.id}
                className="py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
              >
                <div className="min-w-0">
                  <a
                    href={material.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline inline-flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                  >
                    <FaFileAlt aria-hidden />
                    <span className="truncate">{material.title}</span>
                    <span className="sr-only">(opens in new tab)</span>
                  </a>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {material.lessonTitle}
                  </p>
                </div>
                <ConfirmDeleteButton
                  formAction={deleteMaterial}
                  hiddenFields={{ materialId: material.id }}
                  confirmMessage="Delete this material? This action cannot be undone."
                >
                  Delete
                </ConfirmDeleteButton>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}