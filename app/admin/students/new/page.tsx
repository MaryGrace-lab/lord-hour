import { prisma } from "@/lib/prisma";
import { StudentForm } from "@/components/admin/StudentForm";
import Link from "next/link";
import { ApplicationStatus } from "@prisma/client";
import { z } from "zod";

type SearchParams = Promise<{ fromApplication?: string }>;

const cuidSchema = z.string().cuid();

export default async function NewStudentPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { fromApplication } = await searchParams;

  let application = null;

  // Validate the ID before hitting the database.
  if (fromApplication) {
    const parsed = cuidSchema.safeParse(fromApplication);

    if (parsed.success) {
      const found = await prisma.application.findUnique({
        where: { id: parsed.data },
        select: {
          id: true,
          fullName: true,
          email: true,
          phone: true,
          status: true,
          createdStudentId: true,
        },
      });

      // Only allow prefill for APPROVED applications not yet converted.
      if (
        found &&
        found.status === ApplicationStatus.APPROVED &&
        !found.createdStudentId
      ) {
        application = {
          id: found.id,
          fullName: found.fullName,
          email: found.email,
          phone: found.phone,
        };
      }
    }
  }

  return (
    <div className="space-y-6">
      <Link
        href="/admin/students"
        className="text-sm text-accent hover:underline inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
      >
        ← Back to Students
      </Link>

      <h1 className="text-2xl font-bold text-primary">
        {application ? "Create Student Account" : "Add New Student"}
      </h1>

      {application && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-lg mx-auto">
          <p className="text-sm text-blue-800">
            Creating a student account from the application of{" "}
            <span className="font-semibold">{application.fullName}</span>.
            Some fields have been pre-filled.
          </p>
        </div>
      )}

      <StudentForm application={application} />
    </div>
  );
}