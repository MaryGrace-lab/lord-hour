import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ApplicationStatusBadge } from "@/components/admin/ApplicationStatusBadge";
import { ApplicationActions } from "@/components/admin/ApplicationActions";

const DATE_TIME_FORMAT = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export default async function AdminApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const application = await prisma.application.findUnique({
    where: { id },
    include: {
      course: true,
      reviewedBy: { select: { username: true } },
      createdStudent: { select: { id: true, username: true } },
    },
  });

  if (!application) notFound();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Link
        href="/admin/applications"
        className="text-sm text-accent hover:underline inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
      >
        ← Back to Applications
      </Link>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-primary break-words">
              {application.fullName}
            </h1>
            <p className="text-sm text-gray-500">
              Submitted{" "}
              <time dateTime={application.submittedAt.toISOString()}>
                {DATE_TIME_FORMAT.format(application.submittedAt)}
              </time>
            </p>
          </div>
          <div className="shrink-0">
            <ApplicationStatusBadge status={application.status} />
          </div>
        </div>
      </div>

      <section
        className="bg-white rounded-lg shadow-sm p-6"
        aria-labelledby="applicant-details-heading"
      >
        <h2
          id="applicant-details-heading"
          className="font-semibold text-primary mb-4"
        >
          Applicant Details
        </h2>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="min-w-0">
            <dt className="text-gray-500">Email</dt>
            <dd className="text-gray-900 break-all">{application.email}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Phone</dt>
            <dd className="text-gray-900 break-words">
              {application.phone}
            </dd>
          </div>
          {application.course && (
            <div>
              <dt className="text-gray-500">Course</dt>
              <dd className="text-gray-900">{application.course.title}</dd>
            </div>
          )}
        </dl>

        {application.notes && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-gray-500 mb-1">Message / Notes</p>
            <p className="text-sm text-gray-800 whitespace-pre-wrap break-words">
              {application.notes}
            </p>
          </div>
        )}
      </section>

      {application.reviewedBy && (
        <section
          className="bg-white rounded-lg shadow-sm p-6"
          aria-labelledby="review-info-heading"
        >
          <h2
            id="review-info-heading"
            className="font-semibold text-primary mb-3"
          >
            Review Info
          </h2>
          <p className="text-sm text-gray-700">
            Reviewed by{" "}
            <span className="font-medium">
              {application.reviewedBy.username}
            </span>
            {application.reviewedAt && (
              <>
                {" on "}
                <time dateTime={application.reviewedAt.toISOString()}>
                  {DATE_TIME_FORMAT.format(application.reviewedAt)}
                </time>
              </>
            )}
          </p>
        </section>
      )}

      {application.createdStudent && (
        <section
          className="bg-green-50 border border-green-200 rounded-lg p-6"
          aria-labelledby="student-created-heading"
        >
          <h2
            id="student-created-heading"
            className="font-semibold text-green-800 mb-2"
          >
            Student Account Created
          </h2>
          <p className="text-sm text-green-700">
            A student account has already been created for this application.
          </p>
          <Link
            href={`/admin/students/${application.createdStudent.id}`}
            className="text-sm text-green-800 hover:underline mt-2 inline-block font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-green-600 rounded"
          >
            View Student Account →
          </Link>
        </section>
      )}

      <section
        className="bg-white rounded-lg shadow-sm p-6"
        aria-labelledby="actions-heading"
      >
        <h2 id="actions-heading" className="font-semibold text-primary mb-4">
          Actions
        </h2>
        <ApplicationActions
          applicationId={application.id}
          status={application.status}
          hasCreatedStudent={!!application.createdStudent}
        />
      </section>
    </div>
  );
}