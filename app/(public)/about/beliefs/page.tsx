import type { Metadata } from "next";
import Link from "next/link";
import { BeliefsGrid } from "@/components/about/BeliefsGrid";
import { FaArrowRight } from "react-icons/fa6";

const PAGE_TITLE = "What We Believe";
const PAGE_DESCRIPTION =
  "Our core beliefs at The Lord's Hour Ministries — rooted in the Word of God.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/about/beliefs" },
  openGraph: {
    title: `${PAGE_TITLE} | The Lord's Hour Ministries`,
    description: PAGE_DESCRIPTION,
    url: "/about/beliefs",
  },
  twitter: {
    title: `${PAGE_TITLE} | The Lord's Hour Ministries`,
    description: PAGE_DESCRIPTION,
  },
};

export default function BeliefsPage() {
  return (
    <div className="bg-white">
      <section
        className="relative pt-24 md:pt-32 pb-12 md:pb-16 overflow-hidden"
        aria-labelledby="beliefs-heading"
      >
        <p
          className="absolute inset-x-0 top-16 md:top-24 text-center font-heading text-[6rem] sm:text-[9rem] md:text-[14rem] font-bold text-midnight/[0.03] select-none pointer-events-none leading-none tracking-tighter"
          aria-hidden="true"
        >
          FAITH
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
            Our Beliefs
          </p>
          <h1
            id="beliefs-heading"
            className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-primary leading-[1.05] mb-6"
          >
            What We Believe
          </h1>
          <div className="w-16 h-1 bg-accent rounded-full mx-auto mb-6" aria-hidden />
          <p className="text-gray-600 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            Our faith is rooted in the unchanging Word of God. These are the
            foundational truths that shape everything we do at The
            Lord&apos;s Hour Ministries.
          </p>
        </div>
      </section>

      <section
        className="pb-16 md:pb-24"
        aria-label="Foundational beliefs"
      >
        <div className="w-full max-w-6xl mx-auto px-5 sm:px-6">
          <BeliefsGrid />
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
                Continue Exploring
              </p>
              <h2 className="font-heading text-2xl md:text-3xl text-white mb-4 leading-tight">
                Want to meet the people behind the ministry?
              </h2>
              <p className="text-gray-400 text-sm md:text-base mb-8">
                Meet our leadership team and hear from our Senior Pastor.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/about/leadership"
                  className="group inline-flex items-center justify-center gap-2 bg-accent text-midnight px-7 py-3.5 rounded-md font-semibold text-sm tracking-wide shadow-lg shadow-accent/20 hover:bg-accent-light hover:-translate-y-0.5 hover:shadow-xl hover:shadow-accent/30 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  Our Leadership
                  <FaArrowRight
                    size={12}
                    className="group-hover:translate-x-1 transition-transform duration-200"
                    aria-hidden
                  />
                </Link>
                <Link
                  href="/about/pastors-message"
                  className="inline-flex items-center justify-center gap-2 border border-white/30 bg-white/5 backdrop-blur-sm text-white px-7 py-3.5 rounded-md font-semibold text-sm tracking-wide hover:bg-white/15 hover:border-white/60 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  Pastor&apos;s Message
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}