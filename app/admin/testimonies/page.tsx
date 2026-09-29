import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { TestimonyStatus } from "@prisma/client";
import { TestimonyActions } from "@/components/admin/TestimonyActions";
import { FaQuoteLeft, FaLocationDot, FaClock } from "react-icons/fa6";

export const revalidate = 30;

type SearchParams = Promise<{ status?: string }>;

const VALID_STATUSES = new Set<string>(Object.values(TestimonyStatus));

const FILTERS: { key: "ALL" | TestimonyStatus; label: string }[] = [
  { key: TestimonyStatus.PENDING, label: "Pending" },
  { key: TestimonyStatus.APPROVED, label: "Approved" },
  { key: TestimonyStatus.REJECTED, label: "Rejected" },
  { key: "ALL", label: "All" },
];

const STATUS_STYLES: Record<TestimonyStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  APPROVED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
};

const DATE_TIME_FORMAT = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export default async function AdminTestimoniesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { status } = await searchParams;

  const filterStatus: TestimonyStatus | undefined =
    status && VALID_STATUSES.has(status)
      ? (status as TestimonyStatus)
      : undefined;

  const [testimonies, counts] = await Promise.all([
    prisma.testimony.findMany({
      where: filterStatus ? { status: filterStatus } : {},
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
    prisma.testimony.groupBy({
      by: ["status"],
      _count: true,
    }),
  ]);

  const countMap: Record<string, number> = {
    ALL: 0,
    PENDING: 0,
    APPROVED: 0,
    REJECTED: 0,
  };
  counts.forEach((c) => {
    countMap[c.status] = c._count;
    countMap.ALL += c._count;
  });

  function buildHref(key: string): string {
    if (key === TestimonyStatus.PENDING) return "/admin/testimonies";
    return `/admin/testimonies?status=${key}`;
  }

  /**
   * A filter is active when:
   * - It's "ALL" AND no status filter is set, OR
   * - It's a status AND that status matches the current filter.
   *
   * This avoids a control-flow narrowing issue where TS would otherwise
   * narrow a combined `"ALL" | TestimonyStatus` variable to `TestimonyStatus`.
   */
  function isFilterActive(key: "ALL" | TestimonyStatus): boolean {
    if (key === "ALL") return filterStatus === undefined;
    return key === filterStatus;
  }

  // Human-readable label for the current filter, for the empty state.
  const activeLabel =
    filterStatus === undefined
      ? "all"
      : filterStatus.toLowerCase();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-bold text-primary">Testimonies</h1>
        <p className="text-sm text-gray-500" aria-live="polite">
          {countMap.PENDING} pending review
        </p>
      </div>

      <nav
        aria-label="Filter testimonies by status"
        className="flex flex-wrap gap-2"
      >
        {FILTERS.map((f) => {
          const active = isFilterActive(f.key);
          return (
            <Link
              key={f.key}
              href={buildHref(f.key)}
              aria-current={active ? "page" : undefined}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                active
                  ? "bg-primary text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {f.label}
              {countMap[f.key] > 0 && (
                <span
                  className={`ml-2 text-xs ${
                    active ? "text-white/80" : "text-gray-500"
                  }`}
                >
                  {countMap[f.key]}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {testimonies.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">
          <FaQuoteLeft
            className="text-gray-300 mx-auto mb-3"
            size={28}
            aria-hidden
          />
          <p>No {activeLabel === "all" ? "" : activeLabel + " "}testimonies.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {testimonies.map((t) => {
            const displayName = t.anonymous ? "Anonymous" : t.name;

            return (
              <article
                key={t.id}
                className="bg-white rounded-lg shadow-sm p-5 sm:p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`px-2 py-0.5 text-[11px] font-semibold rounded-full ${
                        STATUS_STYLES[t.status]
                      }`}
                    >
                      {t.status}
                    </span>
                    <span className="px-2 py-0.5 text-[11px] font-medium rounded-full bg-gray-100 text-gray-700">
                      {t.category}
                    </span>
                    {t.anonymous && (
                      <span className="px-2 py-0.5 text-[11px] rounded-full bg-blue-50 text-blue-700">
                        Anonymous
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <FaClock size={10} aria-hidden />
                    <time dateTime={t.createdAt.toISOString()}>
                      {DATE_TIME_FORMAT.format(t.createdAt)}
                    </time>
                  </span>
                </div>

                <div className="flex items-start gap-3 mb-4">
                  <FaQuoteLeft
                    className="text-accent/30 shrink-0 mt-1"
                    size={14}
                    aria-hidden
                  />
                  <p className="text-gray-700 leading-relaxed italic whitespace-pre-wrap break-words">
                    {t.content}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600 mb-4 pb-4 border-b border-gray-100">
                  <span>
                    <span className="text-gray-500">From:</span>{" "}
                    <strong className="text-gray-800">{displayName}</strong>
                  </span>
                  {t.location && (
                    <span className="flex items-center gap-1">
                      <FaLocationDot
                        size={10}
                        className="text-accent"
                        aria-hidden
                      />
                      {t.location}
                    </span>
                  )}
                  {t.email && (
                    <span className="text-xs text-gray-500 break-all">
                      <span className="text-gray-400">Contact:</span>{" "}
                      {t.email}
                    </span>
                  )}
                </div>

                <TestimonyActions testimonyId={t.id} status={t.status} />
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}