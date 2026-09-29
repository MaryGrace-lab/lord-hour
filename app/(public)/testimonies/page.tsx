import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { TestimonyStatus } from "@prisma/client";
import {
  FaQuoteLeft,
  FaLocationDot,
  FaHeart,
  FaArrowRight,
} from "react-icons/fa6";

const PAGE_TITLE = "Testimonies";
const PAGE_DESCRIPTION =
  "Read testimonies of God's faithfulness from our church family at The Lord's Hour Ministries.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/testimonies" },
  openGraph: {
    title: `${PAGE_TITLE} | The Lord's Hour Ministries`,
    description: PAGE_DESCRIPTION,
    url: "/testimonies",
  },
  twitter: {
    title: `${PAGE_TITLE} | The Lord's Hour Ministries`,
    description: PAGE_DESCRIPTION,
  },
};

export const revalidate = 60;

const CATEGORY_COLORS: Record<string, string> = {
  Healing: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Provision: "bg-amber-50 text-amber-700 border-amber-200",
  Restoration: "bg-purple-50 text-purple-700 border-purple-200",
  Breakthrough: "bg-blue-50 text-blue-700 border-blue-200",
  Salvation: "bg-rose-50 text-rose-700 border-rose-200",
  Protection: "bg-cyan-50 text-cyan-700 border-cyan-200",
  Guidance: "bg-indigo-50 text-indigo-700 border-indigo-200",
  Family: "bg-pink-50 text-pink-700 border-pink-200",
  Career: "bg-teal-50 text-teal-700 border-teal-200",
  Other: "bg-gray-50 text-gray-700 border-gray-200",
};

const AVATAR_GRADIENTS = [
  "from-midnight to-[#0a1330]",
  "from-accent to-amber-600",
  "from-purple-700 to-purple-900",
  "from-emerald-700 to-emerald-900",
  "from-blue-700 to-blue-900",
  "from-rose-700 to-rose-900",
];

function getAvatarGradient(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++)
    hash = (hash + name.charCodeAt(i)) % 1000;
  return AVATAR_GRADIENTS[hash % AVATAR_GRADIENTS.length];
}

export default async function TestimoniesPage() {
  const testimonies = await prisma.testimony.findMany({
    where: { status: TestimonyStatus.APPROVED },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="bg-white">
      <section
        className="relative pt-24 md:pt-32 pb-12 md:pb-16 overflow-hidden"
        aria-labelledby="testimonies-heading"
      >
        <p
          className="absolute inset-x-0 top-16 md:top-24 text-center font-heading text-[6rem] sm:text-[9rem] md:text-[14rem] font-bold text-midnight/[0.03] select-none pointer-events-none leading-none tracking-tighter"
          aria-hidden="true"
        >
          STORIES
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
            Testimonies
          </p>
          <h1
            id="testimonies-heading"
            className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-primary leading-[1.05] mb-6"
          >
            What God Has Done
          </h1>
          <div className="w-16 h-1 bg-accent rounded-full mx-auto mb-6" aria-hidden />
          <p className="text-gray-600 text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-8">
            Real stories of God&apos;s faithfulness from our church family.
          </p>

          <Link
            href="/testimonies/submit"
            className="group inline-flex items-center gap-2 bg-accent text-midnight px-7 py-3.5 rounded-md font-semibold text-sm tracking-wide shadow-lg shadow-accent/25 hover:bg-accent-light hover:-translate-y-0.5 hover:shadow-xl hover:shadow-accent/35 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Share Your Testimony
            <FaArrowRight
              size={11}
              className="group-hover:translate-x-1 transition-transform duration-200"
              aria-hidden
            />
          </Link>
        </div>
      </section>

      <section className="pb-16 md:pb-24">
        <div className="w-full max-w-6xl mx-auto px-5 sm:px-6">
          {testimonies.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-10 sm:p-14 text-center max-w-lg mx-auto">
              <div className="w-16 h-16 bg-accent/15 rounded-full flex items-center justify-center mx-auto mb-5">
                <FaHeart className="text-accent" size={22} aria-hidden />
              </div>
              <h2 className="font-heading text-xl font-bold text-primary mb-3">
                Be the First to Share
              </h2>
              <p className="text-gray-500 mb-6 leading-relaxed">
                No testimonies have been published yet. Yours could be the
                first to encourage someone today.
              </p>
              <Link
                href="/testimonies/submit"
                className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-md hover:bg-primary-light transition-colors text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                Share Your Testimony
                <FaArrowRight size={11} aria-hidden />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
              {testimonies.map((t) => {
                const displayName = t.anonymous ? "Anonymous" : t.name;
                const initial = displayName.charAt(0).toUpperCase();
                const gradient = getAvatarGradient(displayName);
                const categoryClass =
                  CATEGORY_COLORS[t.category] || CATEGORY_COLORS.Other;

                return (
                  <article
                    key={t.id}
                    className="group relative bg-white rounded-2xl border border-gray-100 p-6 sm:p-7 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.08)] hover:shadow-[0_25px_50px_-20px_rgba(0,0,0,0.15)] hover:-translate-y-1 transition-all duration-300 flex flex-col"
                  >
                    <div className="mb-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold border ${categoryClass}`}
                      >
                        {t.category}
                      </span>
                    </div>

                    <FaQuoteLeft
                      className="text-accent/20 mb-3"
                      size={20}
                      aria-hidden
                    />

                    <p className="text-gray-700 leading-relaxed italic mb-6 flex-1">
                      &ldquo;{t.content}&rdquo;
                    </p>

                    <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                      <div
                        className={`w-10 h-10 rounded-full bg-gradient-to-br ${gradient} text-white flex items-center justify-center text-sm font-bold shrink-0`}
                        aria-hidden
                      >
                        {initial}
                      </div>
                      <div className="min-w-0">
                        <p className="font-heading text-sm font-semibold text-primary">
                          {displayName}
                        </p>
                        {t.location && (
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                            <FaLocationDot
                              size={9}
                              className="text-accent"
                              aria-hidden
                            />
                            {t.location}
                          </p>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
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
                Your Story Matters
              </p>
              <h2 className="font-heading text-2xl md:text-3xl text-white mb-4 leading-tight">
                Has God done something in your life?
              </h2>
              <p className="text-gray-400 text-sm md:text-base mb-8">
                Share your testimony and encourage others in the faith.
              </p>

              <Link
                href="/testimonies/submit"
                className="group inline-flex items-center gap-2 bg-accent text-midnight px-7 py-3.5 rounded-md font-semibold text-sm tracking-wide shadow-lg shadow-accent/20 hover:bg-accent-light hover:-translate-y-0.5 hover:shadow-xl hover:shadow-accent/30 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Share Your Testimony
                <FaArrowRight
                  size={11}
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