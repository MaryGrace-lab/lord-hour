import type { Metadata } from "next";
import { branches } from "@/lib/branches";
import { BranchesDirectory } from "@/components/branches/BranchesDirectory";
import { FaGlobe, FaLocationDot } from "react-icons/fa6";

const PAGE_TITLE = "Branches";
const PAGE_DESCRIPTION =
  "Find a Lord's Hour Ministries branch near you. We have locations in Nigeria and Italy.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/branches" },
  openGraph: {
    title: `${PAGE_TITLE} | The Lord's Hour Ministries`,
    description: PAGE_DESCRIPTION,
    url: "/branches",
  },
  twitter: {
    title: `${PAGE_TITLE} | The Lord's Hour Ministries`,
    description: PAGE_DESCRIPTION,
  },
};

export default function BranchesPage() {
  const totalBranches = branches.length;
  const totalCountries = new Set(branches.map((b) => b.country)).size;

  return (
    <div className="bg-white">
      <section
        className="relative pt-24 md:pt-32 pb-12 md:pb-16 overflow-hidden"
        aria-labelledby="branches-heading"
      >
        <p
          className="absolute inset-x-0 top-16 md:top-24 text-center font-heading text-[6rem] sm:text-[9rem] md:text-[14rem] font-bold text-midnight/[0.03] select-none pointer-events-none leading-none tracking-tighter"
          aria-hidden="true"
        >
          LOCATIONS
        </p>

        <div
          className="pointer-events-none absolute -top-40 -right-40 w-96 h-96 rounded-full bg-accent/10 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-midnight/5 blur-3xl"
          aria-hidden
        />

        <div className="relative w-full max-w-3xl mx-auto px-5 sm:px-6 text-center">
          <p className="text-accent text-xs tracking-[0.3em] uppercase font-semibold mb-4">
            Find Us
          </p>
          <h1
            id="branches-heading"
            className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-primary leading-[1.05] mb-6"
          >
            Our Locations
          </h1>
          <div className="w-16 h-1 bg-accent rounded-full mx-auto mb-6" aria-hidden />
          <p className="text-gray-600 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            The Lord&apos;s Hour Ministries is reaching the world from
            multiple locations. Find a branch near you and join us for
            worship.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-10">
            <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
              <div className="w-9 h-9 rounded-lg bg-accent/15 text-accent flex items-center justify-center shrink-0">
                <FaLocationDot size={13} aria-hidden />
              </div>
              <div className="text-left">
                <p className="font-heading text-lg font-bold text-primary leading-none">
                  {totalBranches}
                </p>
                <p className="text-[10px] uppercase tracking-[0.14em] text-gray-500 mt-0.5">
                  Branches
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
              <div className="w-9 h-9 rounded-lg bg-accent/15 text-accent flex items-center justify-center shrink-0">
                <FaGlobe size={13} aria-hidden />
              </div>
              <div className="text-left">
                <p className="font-heading text-lg font-bold text-primary leading-none">
                  {totalCountries}
                </p>
                <p className="text-[10px] uppercase tracking-[0.14em] text-gray-500 mt-0.5">
                  Countries
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-16 md:pb-24">
        <div className="w-full max-w-7xl mx-auto px-5 sm:px-6">
          <BranchesDirectory branches={branches} />
        </div>
      </section>
    </div>
  );
}