"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Teacher portal error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md text-center">
        <h2 className="text-2xl font-bold text-primary mb-4">Something went wrong</h2>
        <p className="text-gray-600 mb-6">{error.message || "An unexpected error occurred."}</p>
        <button
          onClick={reset}
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-light"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}