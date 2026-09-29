import type { Metadata } from "next";
import Link from "next/link";
import { LeadershipGrid } from "@/components/about/LeadershipGrid";
import { FaArrowRight } from "react-icons/fa6";

const PAGE_TITLE = "Administration & Leadership";
const PAGE_DESCRIPTION =
  "Meet the leadership team of The Lord's Hour Ministries, led by Apostle Oghale B. Uwubiti.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/about/leadership" },
  openGraph: {
    title: `${PAGE_TITLE} | The Lord's Hour Ministries`,
    description: PAGE_DESCRIPTION,
    url: "/about/leadership",
  },
  twitter: {
    title: `${PAGE_TITLE} | The Lord's Hour Ministries`,
    description: PAGE_DESCRIPTION,
  },
};

export default function LeadershipPage() {
  return (
    <div className="bg-white">
      <section
        className="relative pt-24 md:pt-32 pb-12 md:pb-16 overflow-hidden"
        aria-labelledby="leadership-heading"
      >
        <p
          className="absolute inset-x-0 top-16 md:top-24 text-center font-heading text-[6rem] sm:text-[9rem] md:text-[14rem] font-bold text-midnight/[0.03] select-none pointer-events-none leading-none tracking-tighter"
          aria-hidden="true"
        >
          LEADERS
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
            About Us
          </p>
          <h1
            id="leadership-heading"
            className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-primary leading-[1.05] mb-6"
          >
            Administration &amp; Leadership
          </h1>
          <div className="w-16 h-1 bg-accent rounded-full mx-auto mb-6" aria-hidden />
          <p className="text-gray-600 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            Called to lead, equipped to serve. Meet the men and women God has
            placed to shepherd The Lord&apos;s Hour Ministries.
          </p>
        </div>
      </section>

      <section
        className="pb-16 md:pb-20"
        aria-label="Leadership team"
      >
        <div className="w-full max-w-6xl mx-auto px-5 sm:px-6">
          <LeadershipGrid />
        </div>
      </section>

      <section className="py-16 md:py-20 bg-gray-50 border-t border-gray-100">
        <div className="w-full max-w-4xl mx-auto px-5 sm:px-6">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-midnight via-[#0a1330] to-[#050b1e] p-8 md:p-12 shadow-2xl">
            <div
              className="pointer-events-none absolute -top-20 -right-20 w-64 h-64 rounded-full bg-accent/15 blur-3xl"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-accent/10 blur-3xl"
              aria-hidden
            />

            <div className="relative text-center max-w-2xl mx-auto">
              <p className="text-accent text-[11px] tracking-[0.3em] uppercase font-semibold mb-3">
                Hear From Our Pastor
              </p>
              <h2 className="font-heading text-2xl md:text-3xl text-white mb-4 leading-tight">
                A message from Apostle Oghale B. Uwubiti
              </h2>
              <p className="text-gray-400 text-sm md:text-base mb-8">
                Read a welcome message from our Founder and Senior Pastor.
              </p>

              <Link
                href="/about/pastors-message"
                className="group inline-flex items-center justify-center gap-2 bg-accent text-midnight px-7 py-3.5 rounded-md font-semibold text-sm tracking-wide shadow-lg shadow-accent/20 hover:bg-accent-light hover:-translate-y-0.5 hover:shadow-xl hover:shadow-accent/30 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Pastor&apos;s Message
                <FaArrowRight
                  size={12}
                  className="group-hover:translate-x-1 transition-transform duration-200"
                  aria-hidden
                />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}