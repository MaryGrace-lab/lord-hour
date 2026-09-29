import { ApplicationStatus } from "@prisma/client";

type ApplicationStatusBadgeProps = {
  status: ApplicationStatus;
};

const styles: Record<ApplicationStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONTACTED: "bg-blue-100 text-blue-800",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
};

const labels: Record<ApplicationStatus, string> = {
  PENDING: "Pending",
  CONTACTED: "Contacted",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};

export function ApplicationStatusBadge({
  status,
}: ApplicationStatusBadgeProps) {
  return (
    <span
      className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}
      aria-label={`Application status: ${labels[status]}`}
    >
      {labels[status]}
    </span>
  );
}