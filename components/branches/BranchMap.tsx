"use client";

import { useState } from "react";
import { FaMapLocationDot, FaCircleNotch } from "react-icons/fa6";

export function BranchMap({
  embedUrl,
  directionsUrl,
  branchName,
}: {
  embedUrl: string;
  directionsUrl: string;
  branchName: string;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const hasDirections = directionsUrl.trim().length > 0;

  return (
    <div className="relative rounded-2xl overflow-hidden border border-gray-100 shadow-[0_15px_40px_-20px_rgba(0,0,0,0.12)] bg-gray-100">
      {isLoading && (
        <div
          className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-gray-50"
          aria-hidden
        >
          <FaCircleNotch className="text-accent text-2xl animate-spin" />
          <p className="text-xs uppercase tracking-[0.16em] text-gray-500">
            Loading map...
          </p>
        </div>
      )}

      <iframe
        src={embedUrl}
        className="w-full h-[380px] md:h-[460px] border-0"
        loading="lazy"
        title={`Map of ${branchName}`}
        onLoad={() => setIsLoading(false)}
        referrerPolicy="no-referrer-when-downgrade"
      />

      {hasDirections && (
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-4 right-4 inline-flex items-center gap-2 bg-white text-primary px-4 py-3 rounded-xl shadow-lg shadow-black/10 border border-gray-100 hover:bg-primary hover:text-white hover:-translate-y-0.5 transition-all duration-300 text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <FaMapLocationDot size={14} aria-hidden />
          Get Directions
          <span className="sr-only"> (opens in new tab)</span>
        </a>
      )}
    </div>
  );
}