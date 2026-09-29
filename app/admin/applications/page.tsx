import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ApplicationStatus, Prisma } from "@prisma/client";
import { ApplicationStatusBadge } from "@/components/admin/ApplicationStatusBadge";
import { FaFileAlt } from "react-icons/fa";

export const revalidate = 30;

type SearchParams = Promise<{
  status?: string;
  q?: string;
}>;

const VALID_STATUSES = new Set<string>(Object.values(ApplicationStatus));

const DATE_FORMAT = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const FILTERS: { key: "ALL" | ApplicationStatus; label: string }[] = [
  { key: "ALL", label: "All" },
  { key: ApplicationStatus.PENDING, label: "Pending" },
  { key: ApplicationStatus.CONTACTED, label: "Contacted" },
  { key: ApplicationStatus.APPROVED, label: "Approved" },
  { key: ApplicationStatus.REJECTED, label: "Rejected" },
];

export default async function AdminApplicationsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { status, q } = await searchParams;

  const filterStatus: ApplicationStatus | undefined =
    status && VALID_STATUSES.has(status)
      ? (status as ApplicationStatus)
      : undefined;

  const search = q?.trim().slice(0, 100) || undefined;

  const where: Prisma.ApplicationWhereInput = {};
  if (filterStatus) where.status = filterStatus;
  if (search) {
    where.OR = [
      { fullName: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }

  const [applications, counts] = await Promise.all([
    prisma.application.findMany({
      where,
      include: { course: { select: { title: true } } },
      orderBy: { submittedAt: "desc" },
    }),
    prisma.application.groupBy({
      by: ["status"],
      _count: true,
    }),
  ]);

  const countMap: Record<string, number> = {
    ALL: 0,
    PENDING: 0,
    CONTACTED: 0,
    APPROVED: 0,
    REJECTED: 0,
  };
  counts.forEach((c) => {
    countMap[c.status] = c._count;
    countMap.ALL += c._count;
  });

  function buildHref(key: string, query?: string): string {
    const params = new URLSearchParams();
    if (key !== "ALL") params.set("status", key);
    if (query) params.set("q", query);
    const qs = params.toString();
    return `/admin/applications${qs ? `?${qs}` : ""}`;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
          <FaFileAlt className="text-accent" aria-hidden />
          Applications
        </h1>
        <p className="text-sm text-gray-500" aria-live="polite">
          {countMap.PENDING} pending
        </p>
      </div>

      <nav
        aria-label="Filter applications by status"
        className="-mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto"
      >
        <div className="flex gap-2 w-max sm:w-auto sm:flex-wrap pb-1">
          {FILTERS.map((f) => {
            const isActive = f.key === filterStatus || (f.key === "ALL" && !filterStatus);
            return (
              <Link
                key={f.key}
                href={buildHref(f.key, search)}
                aria-current={isActive ? "page" : undefined}
                className={`shrink-0 px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  isActive
                    ? "bg-primary text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {f.label}
                {countMap[f.key] > 0 && (
                  <span
                    className={`ml-2 text-xs ${
                      isActive ? "text-white/80" : "text-gray-500"
                    }`}
                  >
                    {countMap[f.key]}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      <form method="get" className="flex flex-col sm:flex-row gap-2">
        {filterStatus && (
          <input type="hidden" name="status" value={filterStatus} />
        )}
        <label htmlFor="applications-search" className="sr-only">
          Search applications by name or email
        </label>
        <input
          id="applications-search"
          name="q"
          type="search"
          defaultValue={search || ""}
          maxLength={100}
          placeholder="Search by name or email..."
          className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        />
        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-light text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          Search
        </button>
      </form>

      {applications.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">
          <FaFileAlt
            className="text-gray-300 mx-auto mb-3"
            size={32}
            aria-hidden
          />
          <p>No applications found.</p>
        </div>
      ) : (
        <>
          <div className="hidden md:block bg-white rounded-lg shadow-sm overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <caption className="sr-only">
                Applications list. {applications.length} result
                {applications.length === 1 ? "" : "s"}.
              </caption>
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    Applicant
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    Contact
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden lg:table-cell"
                  >
                    Interested In
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden lg:table-cell"
                  >
                    Submitted
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {applications.map((app) => (
                  <tr key={app.id}>
                    <td className="px-4 py-3">
                      <p className="font-medium text-sm">{app.fullName}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm break-all">{app.email}</p>
                      <p className="text-xs text-gray-500">{app.phone}</p>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <p className="text-sm">{app.course?.title || "—"}</p>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-sm text-gray-600">
                      <time dateTime={app.submittedAt.toISOString()}>
                        {DATE_FORMAT.format(app.submittedAt)}
                      </time>
                    </td>
                    <td className="px-4 py-3">
                      <ApplicationStatusBadge status={app.status} />
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/applications/${app.id}`}
                        className="text-accent hover:underline text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden space-y-3">
            {applications.map((app) => (
              <Link
                key={app.id}
                href={`/admin/applications/${app.id}`}
                className="block bg-white rounded-lg shadow-sm p-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <p className="font-semibold text-gray-900">{app.fullName}</p>
                  <ApplicationStatusBadge status={app.status} />
                </div>
                <p className="text-sm text-gray-600 truncate">{app.email}</p>
                <p className="text-sm text-gray-600">{app.phone}</p>
                {app.course?.title && (
                  <p className="text-xs text-gray-500 mt-2">
                    Interested in: {app.course.title}
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  Submitted{" "}
                  <time dateTime={app.submittedAt.toISOString()}>
                    {DATE_FORMAT.format(app.submittedAt)}
                  </time>
                </p>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}