"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin portal error:", error);
  }, [error]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-8 max-w-lg mx-auto text-center">
      <h1 className="text-xl font-bold text-primary mb-3">
        Something went wrong
      </h1>
      <p className="text-sm text-gray-600 mb-6">
        An unexpected error occurred while loading this admin page. Please try
        again. If the problem continues, sign out and sign back in.
      </p>
      {error.digest && (
        <p className="text-xs text-gray-400 mb-4 font-mono">
          Reference: {error.digest}
        </p>
      )}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          type="button"
          onClick={reset}
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-light text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          Try Again
        </button>
        <Link
          href="/admin"
          className="bg-white border border-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-50 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}