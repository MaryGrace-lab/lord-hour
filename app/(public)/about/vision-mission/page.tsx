import type { Metadata } from "next";
import Link from "next/link";
import {
  FaEye,
  FaCrosshairs,
  FaLockOpen,
  FaBookOpen,
  FaTrophy,
  FaGlobe,
  FaArrowRight,
  FaQuoteLeft,
} from "react-icons/fa6";

const PAGE_TITLE = "Vision & Mission";
const PAGE_DESCRIPTION =
  "The vision and mission of The Lord's Hour Ministries — liberating mankind and raising men of excellence through the Word.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/about/vision-mission" },
  openGraph: {
    title: `${PAGE_TITLE} | The Lord's Hour Ministries`,
    description: PAGE_DESCRIPTION,
    url: "/about/vision-mission",
  },
  twitter: {
    title: `${PAGE_TITLE} | The Lord's Hour Ministries`,
    description: PAGE_DESCRIPTION,
  },
};

type CoreValue = {
  id: string;
  Icon: typeof FaEye;
  title: string;
  description: string;
  accentColor: string;
  iconBg: string;
  iconFg: string;
};

const coreValues: CoreValue[] = [
  {
    id: "liberation",
    Icon: FaLockOpen,
    title: "Liberation",
    description:
      "Freedom from the prison house of darkness — through the finished work of Christ.",
    accentColor: "from-emerald-500/20 to-transparent",
    iconBg: "bg-emerald-50",
    iconFg: "text-emerald-600",
  },
  {
    id: "word",
    Icon: FaBookOpen,
    title: "The Uncompromised Word",
    description:
      "Grounded in Biblical truth — the inspired, inerrant Word of God.",
    accentColor: "from-blue-500/20 to-transparent",
    iconBg: "bg-blue-50",
    iconFg: "text-blue-600",
  },
  {
    id: "excellence",
    Icon: FaTrophy,
    title: "Excellence",
    description:
      "Raising men and women of high standards — for family, church, and mission.",
    accentColor: "from-accent/25 to-transparent",
    iconBg: "bg-accent/15",
    iconFg: "text-accent",
  },
  {
    id: "global",
    Icon: FaGlobe,
    title: "Global Reach",
    description:
      "Impacting nations — from our headquarters in Italy to branches across Nigeria and beyond.",
    accentColor: "from-purple-500/20 to-transparent",
    iconBg: "bg-purple-50",
    iconFg: "text-purple-600",
  },
];

export default function VisionMissionPage() {
  return (
    <div className="bg-white">
      <section
        className="relative pt-24 md:pt-32 pb-16 md:pb-20 overflow-hidden"
        aria-labelledby="vision-mission-heading"
      >
        <p
          className="absolute inset-x-0 top-16 md:top-24 text-center font-heading text-[6rem] sm:text-[9rem] md:text-[14rem] font-bold text-midnight/[0.03] select-none pointer-events-none leading-none tracking-tighter"
          aria-hidden="true"
        >
          OUR PURPOSE
        </p>

        <div
          className="pointer-events-none absolute -top-40 -right-40 w-96 h-96 rounded-full bg-accent/10 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-midnight/5 blur-3xl"
          aria-hidden
        />

        <div className="relative w-full max-w-4xl mx-auto px-5 sm:px-6 text-center">
          <p className="text-accent text-xs tracking-[0.3em] uppercase font-semibold mb-4">
            About Us
          </p>
          <h1
            id="vision-mission-heading"
            className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-primary leading-[1.05] mb-6"
          >
            Vision &amp; Mission
          </h1>
          <div className="w-16 h-1 bg-accent rounded-full mx-auto mb-6" aria-hidden />
          <p className="text-gray-600 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            The two anchors that guide everything we do — the why and the how
            of The Lord&apos;s Hour Ministries.
          </p>
        </div>
      </section>

      <section
        className="pb-16 md:pb-20"
        aria-label="Vision and Mission statements"
      >
        <div className="w-full max-w-6xl mx-auto px-5 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {/* Vision card */}
            <article className="group relative rounded-3xl overflow-hidden bg-gradient-to-br from-midnight via-[#0a1330] to-[#050b1e] p-8 md:p-10 shadow-[0_25px_50px_-20px_rgba(15,26,58,0.5)] hover:shadow-[0_35px_70px_-25px_rgba(15,26,58,0.7)] hover:-translate-y-1.5 transition-all duration-500">
              <div
                className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute -top-20 -right-20 w-64 h-64 rounded-full bg-accent/10 blur-3xl"
                aria-hidden
              />

              <div className="relative">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 mb-6 relative">
                  <FaEye className="text-accent text-2xl relative z-10" aria-hidden />
                  <span
                    className="absolute inset-0 rounded-2xl bg-accent/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    aria-hidden
                  />
                </div>

                <p className="text-accent text-[11px] tracking-[0.3em] uppercase font-semibold mb-3">
                  Our Vision
                </p>

                <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                  To Liberate Mankind
                </h2>

                <blockquote className="relative pl-5 border-l-2 border-accent/60 mb-6">
                  <FaQuoteLeft
                    className="absolute -left-1 -top-1 text-accent/40"
                    size={14}
                    aria-hidden="true"
                  />
                  <p className="text-gray-200 italic leading-relaxed">
                    From the prison house of darkness into the marvelous light
                    of Christ.
                  </p>
                  <cite className="block text-accent text-xs tracking-[0.2em] uppercase font-medium mt-3 not-italic">
                    Isaiah 42:6–7
                  </cite>
                </blockquote>

                <p className="text-gray-400 text-sm leading-relaxed">
                  Every soul has a place in the light of Christ — our vision is
                  to see that freedom become reality in lives across every
                  nation we reach.
                </p>
              </div>
            </article>

            {/* Mission card */}
            <article className="group relative rounded-3xl overflow-hidden bg-white border-2 border-gray-100 hover:border-accent/60 p-8 md:p-10 shadow-[0_25px_50px_-20px_rgba(0,0,0,0.1)] hover:shadow-[0_35px_70px_-25px_rgba(201,168,76,0.35)] hover:-translate-y-1.5 transition-all duration-500">
              <div
                className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-accent/10 to-transparent rounded-bl-full"
                aria-hidden
              />

              <div className="relative">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/15 border border-accent/30 mb-6 relative">
                  <FaCrosshairs className="text-accent text-2xl relative z-10" aria-hidden />
                  <span
                    className="absolute inset-0 rounded-2xl bg-accent/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    aria-hidden
                  />
                </div>

                <p className="text-accent text-[11px] tracking-[0.3em] uppercase font-semibold mb-3">
                  Our Mission
                </p>

                <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-6 leading-tight">
                  To Raise Men &amp; Women of{" "}
                  <span className="text-accent">Excellence</span>
                </h2>

                <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-6">
                  To use the Word to raise men who will live exemplary lives
                  full of excellence.
                </p>

                <p className="text-gray-500 text-sm leading-relaxed">
                  In the family, in the church, and in the mission field — we
                  train leaders whose lives reflect the standard of the Word.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section
        className="py-16 md:py-20 bg-gray-50 border-y border-gray-100"
        aria-labelledby="core-values-heading"
      >
        <div className="w-full max-w-6xl mx-auto px-5 sm:px-6">
          <div className="text-center mb-12 md:mb-16">
            <p className="text-accent text-xs tracking-[0.3em] uppercase font-semibold mb-3">
              Our Pillars
            </p>
            <h2
              id="core-values-heading"
              className="font-heading text-3xl md:text-4xl text-primary mb-3"
            >
              What We Stand For
            </h2>
            <div className="w-12 h-1 bg-accent rounded-full mx-auto" aria-hidden />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {coreValues.map((value) => {
              const Icon = value.Icon;
              return (
                <article
                  key={value.id}
                  className="group relative bg-white rounded-2xl border border-gray-100 p-6 md:p-7 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.08)] hover:shadow-[0_25px_50px_-20px_rgba(0,0,0,0.15)] hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                >
                  <div
                    className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${value.accentColor}`}
                    aria-hidden
                  />

                  <div
                    className={`w-12 h-12 rounded-xl ${value.iconBg} ${value.iconFg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon size={20} aria-hidden />
                  </div>

                  <h3 className="font-heading text-lg font-bold text-primary mb-2 leading-tight">
                    {value.title}
                  </h3>

                  <p className="text-gray-600 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
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
                Want to know the story behind the vision?
              </h2>
              <p className="text-gray-400 text-sm md:text-base mb-8">
                Discover how a mandate received in prayer grew into a ministry
                spanning two continents.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/about"
                  className="group inline-flex items-center justify-center gap-2 bg-accent text-midnight px-7 py-3.5 rounded-md font-semibold text-sm tracking-wide shadow-lg shadow-accent/20 hover:bg-accent-light hover:-translate-y-0.5 hover:shadow-xl hover:shadow-accent/30 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  Our Story
                  <FaArrowRight
                    size={12}
                    className="group-hover:translate-x-1 transition-transform duration-200"
                    aria-hidden
                  />
                </Link>
                <Link
                  href="/about/beliefs"
                  className="inline-flex items-center justify-center gap-2 border border-white/30 bg-white/5 backdrop-blur-sm text-white px-7 py-3.5 rounded-md font-semibold text-sm tracking-wide hover:bg-white/15 hover:border-white/60 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  Our Beliefs
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}