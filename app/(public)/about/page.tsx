import type { Metadata } from "next";
import Link from "next/link";
import { HistoryTimeline } from "@/components/about/HistoryTimeline";
import {
  FaGlobe,
  FaChurch,
  FaGraduationCap,
  FaArrowRight,
} from "react-icons/fa6";

const PAGE_TITLE = "Our History";
const PAGE_DESCRIPTION =
  "The journey of The Lord's Hour Ministries — from a divine mandate in 2015 to an international ministry across Nigeria and Italy.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/about" },
  openGraph: {
    title: `${PAGE_TITLE} | The Lord's Hour Ministries`,
    description: PAGE_DESCRIPTION,
    url: "/about",
  },
  twitter: {
    title: `${PAGE_TITLE} | The Lord's Hour Ministries`,
    description: PAGE_DESCRIPTION,
  },
};

const stats = [
  { value: "2015", label: "Divine Mandate", Icon: FaGraduationCap },
  { value: "2", label: "Countries", Icon: FaGlobe },
  { value: "4+", label: "Branches", Icon: FaChurch },
];

export default function AboutHistoryPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section
        className="relative py-16 md:py-24 overflow-hidden"
        aria-labelledby="about-history-heading"
      >
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
            id="about-history-heading"
            className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-5 leading-[1.1]"
          >
            Our History
          </h1>
          <div className="w-16 h-1 bg-accent rounded-full mx-auto mb-6" aria-hidden />
          <p className="text-gray-600 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            The journey of The Lord&apos;s Hour Ministries — from a divine
            mandate received in prayer to a growing international ministry
            spanning Nigeria and Italy.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-10">
            {stats.map(({ value, label, Icon }) => (
              <div
                key={label}
                className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 shadow-sm hover:shadow-md hover:border-accent/40 transition-all duration-300"
              >
                <div className="w-9 h-9 rounded-lg bg-accent/15 text-accent flex items-center justify-center shrink-0">
                  <Icon size={14} aria-hidden />
                </div>
                <div className="text-left">
                  <p className="font-heading text-lg font-bold text-primary leading-none">
                    {value}
                  </p>
                  <p className="text-[10px] uppercase tracking-[0.14em] text-gray-500 mt-0.5">
                    {label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section
        className="py-12 md:py-16"
        aria-labelledby="about-timeline-heading"
      >
        <div className="w-full max-w-6xl mx-auto px-5 sm:px-6">
          <div className="text-center mb-14 md:mb-20">
            <p className="text-accent text-xs tracking-[0.3em] uppercase font-semibold mb-3">
              The Journey
            </p>
            <h2
              id="about-timeline-heading"
              className="font-heading text-2xl md:text-3xl text-primary"
            >
              Milestones Along the Way
            </h2>
          </div>

          <HistoryTimeline />
        </div>
      </section>

      {/* Closing statement */}
      <section className="py-16 md:py-20 bg-gray-50 border-t border-gray-100">
        <div className="w-full max-w-3xl mx-auto px-5 sm:px-6 text-center">
          <p className="font-heading text-xl md:text-2xl text-primary italic leading-relaxed mb-10 max-w-2xl mx-auto">
            &ldquo;The Lord&apos;s Hour Ministry has never run dry and has
            always operated in excellence. Yes, this ministry has raised men
            of great excellence!&rdquo;
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/about/vision-mission"
              className="group inline-flex items-center justify-center gap-2 bg-primary text-white px-7 py-3.5 rounded-md font-semibold text-sm tracking-wide hover:bg-primary-light hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Vision &amp; Mission
              <FaArrowRight
                size={12}
                className="group-hover:translate-x-1 transition-transform duration-200"
                aria-hidden
              />
            </Link>
            <Link
              href="/about/pastors-message"
              className="group inline-flex items-center justify-center gap-2 border-2 border-primary/15 text-primary px-7 py-3.5 rounded-md font-semibold text-sm tracking-wide hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
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
      </section>
    </div>
  );
}