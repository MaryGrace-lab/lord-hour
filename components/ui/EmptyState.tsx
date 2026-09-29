import Link from "next/link";
import { ReactNode } from "react";
import { IconType } from "react-icons";

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
}: {
  icon: IconType;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-10 text-center">
      <Icon
        className="text-gray-300 mx-auto mb-4"
        size={40}
        aria-hidden
      />
      <p className="font-medium text-gray-700 mb-1">{title}</p>
      {description && (
        <p className="text-sm text-gray-500 max-w-sm mx-auto mb-4">
          {description}
        </p>
      )}
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="inline-block mt-2 text-accent hover:underline text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
        >
          {actionLabel} →
        </Link>
      )}
    </div>
  );
}