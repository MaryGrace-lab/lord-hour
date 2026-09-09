import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { deleteMaterial } from "@/lib/teacher-actions";
import { MaterialUploadForm } from "@/components/forms/MaterialUploadForm";
import { ConfirmDeleteButton } from "@/components/ConfirmDeleteButton";

export default async function CourseMaterialsPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const session = await auth();
  const teacherId = session?.user.id;

  const course = await prisma.course.findFirst({
    where: {
      id: courseId,
      teachers: { some: { id: teacherId } },
    },
    include: {
      modules: {
        include: {
          lessons: { include: { materials: true } },
        },
      },
    },
  });

  if (!course) return <div>Course not found or access denied.</div>;

  // Gather all materials from all lessons
  const allMaterials = course.modules.flatMap((module) =>
    module.lessons.flatMap((lesson) =>
      lesson.materials.map((material) => ({ ...material, lessonTitle: lesson.title }))
    )
  );

  // Prepare lesson options for the upload form
  const lessonOptions = course.modules.flatMap((module) =>
    module.lessons.map((lesson) => ({
      id: lesson.id,
      title: lesson.title,
    }))
  );

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-primary">Course Materials</h3>

      {/* Upload new material */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h4 className="font-medium mb-3">Upload New Material</h4>
        <p className="text-sm text-gray-500 mb-3">Select a lesson and upload file</p>
        <MaterialUploadForm lessonOptions={lessonOptions} />
      </div>

      {/* Existing materials */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h4 className="font-medium mb-3">Existing Materials</h4>
        {allMaterials.length === 0 ? (
          <p className="text-gray-500">No materials uploaded yet.</p>
        ) : (
          <ul className="divide-y">
            {allMaterials.map((material) => (
              <li key={material.id} className="py-3 flex justify-between items-center">
                <div>
                  <a
                    href={material.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {material.title}
                  </a>
                  <p className="text-xs text-gray-500">{material.lessonTitle}</p>
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
      </div>
    </div>
  );
}