"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  FaChevronLeft,
  FaChevronRight,
  FaQuoteLeft,
  FaLocationDot,
  FaHeart,
} from "react-icons/fa6";

type TestimonyInput = {
  id: string;
  content: string;
  name: string;
  anonymous: boolean;
  location: string | null;
  category: string;
};

type TestimonyDisplay = {
  id: string;
  content: string;
  name: string;
  location: string;
  category: string;
  categoryClass: string;
  initials: string;
  avatarClass: string;
};

const CATEGORY_STYLES: Record<
  string,
  { badge: string; avatar: string }
> = {
  Healing: {
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    avatar: "from-emerald-600 to-emerald-800",
  },
  Provision: {
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    avatar: "from-amber-600 to-amber-800",
  },
  Restoration: {
    badge: "bg-purple-50 text-purple-700 border-purple-200",
    avatar: "from-purple-600 to-purple-800",
  },
  Breakthrough: {
    badge: "bg-blue-50 text-blue-700 border-blue-200",
    avatar: "from-blue-600 to-blue-800",
  },
  Salvation: {
    badge: "bg-rose-50 text-rose-700 border-rose-200",
    avatar: "from-rose-600 to-rose-800",
  },
  Protection: {
    badge: "bg-cyan-50 text-cyan-700 border-cyan-200",
    avatar: "from-cyan-600 to-cyan-800",
  },
  Guidance: {
    badge: "bg-indigo-50 text-indigo-700 border-indigo-200",
    avatar: "from-indigo-600 to-indigo-800",
  },
  Family: {
    badge: "bg-pink-50 text-pink-700 border-pink-200",
    avatar: "from-pink-600 to-pink-800",
  },
  Career: {
    badge: "bg-teal-50 text-teal-700 border-teal-200",
    avatar: "from-teal-600 to-teal-800",
  },
  Other: {
    badge: "bg-gray-50 text-gray-700 border-gray-200",
    avatar: "from-gray-600 to-gray-800",
  },
};

const DEFAULT_STYLE = {
  badge: "bg-gray-50 text-gray-700 border-gray-200",
  avatar: "from-gray-600 to-gray-800",
};

const SLIDE_DURATION = 7000;

export function TestimoniesFlipbook({
  testimonies: rawTestimonies,
}: {
  testimonies: TestimonyInput[];
}) {
  // Memoize the display transformation — this only needs to run when the
  // input array actually changes.
  const testimonies = useMemo<TestimonyDisplay[]>(
    () =>
      rawTestimonies.map((t) => {
        const displayName = t.anonymous ? "Anonymous" : t.name;
        const style = CATEGORY_STYLES[t.category] || DEFAULT_STYLE;
        return {
          id: t.id,
          content: t.content,
          name: displayName,
          location: t.location || "",
          category: t.category,
          categoryClass: style.badge,
          initials: displayName.charAt(0).toUpperCase(),
          avatarClass: style.avatar,
        };
      }),
    [rawTestimonies]
  );

  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef<number>(0);

  const goTo = useCallback(
    (nextIndex: number, dir: "next" | "prev" = "next") => {
      setDirection(dir);
      setIndex(nextIndex);
    },
    []
  );

  const prev = useCallback(() => {
    if (testimonies.length === 0) return;
    goTo(index === 0 ? testimonies.length - 1 : index - 1, "prev");
  }, [index, goTo, testimonies.length]);

  const next = useCallback(() => {
    if (testimonies.length === 0) return;
    goTo(index === testimonies.length - 1 ? 0 : index + 1, "next");
  }, [index, goTo, testimonies.length]);

  // Auto-advance
  useEffect(() => {
    if (isPaused || testimonies.length <= 1) return;
    const interval = setInterval(next, SLIDE_DURATION);
    return () => clearInterval(interval);
  }, [next, isPaused, testimonies.length]);

  // Reset index if testimonies array length changes
  useEffect(() => {
    setIndex(0);
  }, [testimonies.length]);

  // Keyboard navigation
  useEffect(() => {
    if (testimonies.length <= 1) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, testimonies.length]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
    setIsPaused(true);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  };
  const onTouchEnd = () => {
    if (Math.abs(touchDeltaX.current) > 50) {
      if (touchDeltaX.current < 0) next();
      else prev();
    }
    touchStartX.current = null;
    touchDeltaX.current = 0;
    setIsPaused(false);
  };

  // ────────────────────────────────────────────────
  // Empty state
  // ────────────────────────────────────────────────
  if (testimonies.length === 0) {
    return (
      <section
        className="relative py-16 sm:py-20 md:py-28 bg-gradient-to-b from-gray-50 to-white overflow-hidden"
        aria-labelledby="testimonies-heading"
      >
        <div className="pointer-events-none absolute top-20 -right-40 w-96 h-96 rounded-full bg-accent/5 blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-midnight/5 blur-3xl" aria-hidden />

        <div className="w-full max-w-2xl mx-auto px-5 sm:px-6 text-center relative">
          <p className="text-accent text-xs tracking-[0.3em] uppercase mb-3 font-medium">
            Testimonies
          </p>
          <h2
            id="testimonies-heading"
            className="font-heading text-3xl sm:text-4xl md:text-5xl text-primary mb-6"
          >
            What God Has Done
          </h2>
          <div className="w-12 h-px bg-accent mx-auto mb-8" aria-hidden />
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <p className="text-gray-500 mb-5">
              Be the first to share what God has done in your life.
            </p>
            <Link
              href="/testimonies/submit"
              className="inline-block bg-primary text-white px-6 py-3 rounded-md hover:bg-primary-light transition-colors text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Share Your Testimony
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const current = testimonies[index] ?? testimonies[0];

  return (
    <section
      className="relative py-16 sm:py-20 md:py-28 bg-gradient-to-b from-gray-50 to-white overflow-hidden"
      aria-labelledby="testimonies-heading"
    >
      <div className="pointer-events-none absolute top-20 -right-40 w-96 h-96 rounded-full bg-accent/5 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-midnight/5 blur-3xl" aria-hidden />

      <div className="w-full max-w-5xl mx-auto px-5 sm:px-6 relative">
        <div className="text-center mb-10 sm:mb-14">
          <p className="text-accent text-xs tracking-[0.3em] uppercase mb-3 font-medium">
            Testimonies
          </p>
          <h2
            id="testimonies-heading"
            className="font-heading text-3xl sm:text-4xl md:text-5xl text-primary"
          >
            What God Has Done
          </h2>
          <div className="w-12 h-px bg-accent mx-auto mt-5" aria-hidden />
          <p className="text-gray-500 text-sm sm:text-base mt-5 max-w-xl mx-auto">
            Real stories of God&apos;s faithfulness from our church family.
          </p>
        </div>

        <div
          className="relative"
          role="region"
          aria-label="Testimonies carousel"
          aria-roledescription="carousel"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div className="relative bg-white rounded-2xl shadow-[0_30px_60px_-20px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-accent/30 via-accent to-accent/30" aria-hidden />

            <div
              className="relative p-6 sm:p-10 md:p-14 min-h-[360px] sm:min-h-[340px] flex items-center justify-center overflow-hidden"
              aria-live="polite"
              aria-atomic="true"
            >
              <FaQuoteLeft
                className="absolute top-8 left-8 sm:top-12 sm:left-12 text-accent/10"
                size={80}
                aria-hidden
              />

              <div
                key={current.id}
                className="relative w-full max-w-2xl text-center"
                style={{
                  animation:
                    direction === "next"
                      ? "testimonyInNext 500ms ease-out"
                      : "testimonyInPrev 500ms ease-out",
                }}
              >
                <div className="flex justify-center mb-6">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border ${current.categoryClass}`}
                  >
                    <FaHeart size={9} aria-hidden />
                    {current.category}
                  </span>
                </div>

                <blockquote className="font-heading text-lg sm:text-xl md:text-2xl text-gray-800 leading-relaxed md:leading-relaxed italic mb-8">
                  &ldquo;{current.content}&rdquo;
                </blockquote>

                <div className="flex items-center justify-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-full bg-gradient-to-br ${current.avatarClass} text-white flex items-center justify-center text-sm font-bold shrink-0 shadow-md`}
                    aria-hidden
                  >
                    {current.initials}
                  </div>
                  <div className="text-left">
                    <p className="font-heading text-base font-semibold text-primary leading-tight">
                      {current.name}
                    </p>
                    {current.location && (
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <FaLocationDot
                          size={9}
                          className="text-accent"
                          aria-hidden
                        />
                        {current.location}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {testimonies.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prev}
                    aria-label="Previous testimony"
                    className="hidden md:flex absolute left-4 lg:left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white border border-gray-200 shadow-sm items-center justify-center text-primary hover:bg-accent hover:text-midnight hover:border-accent hover:scale-105 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    <FaChevronLeft size={14} aria-hidden />
                  </button>
                  <button
                    type="button"
                    onClick={next}
                    aria-label="Next testimony"
                    className="hidden md:flex absolute right-4 lg:right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white border border-gray-200 shadow-sm items-center justify-center text-primary hover:bg-accent hover:text-midnight hover:border-accent hover:scale-105 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    <FaChevronRight size={14} aria-hidden />
                  </button>
                </>
              )}
            </div>

            <div className="border-t border-gray-100 px-6 sm:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-1">
                {testimonies.map((t, i) => {
                  const isActive = i === index;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => goTo(i, i > index ? "next" : "prev")}
                      aria-label={`Go to testimony ${i + 1} of ${testimonies.length}`}
                      aria-current={isActive ? "true" : undefined}
                      className="group relative min-w-[36px] min-h-[36px] flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
                    >
                      <span
                        className={`block h-1 rounded-full transition-all duration-300 ${
                          isActive
                            ? "w-10 bg-accent/25"
                            : "w-2 bg-gray-200 group-hover:bg-gray-300"
                        }`}
                      />
                      {isActive && !isPaused && (
                        <span
                          key={`progress-${index}`}
                          className="absolute top-1/2 -translate-y-1/2 h-1 w-10 bg-accent rounded-full origin-left"
                          style={{
                            animation: `testimonyProgress ${SLIDE_DURATION}ms linear forwards`,
                          }}
                          aria-hidden
                        />
                      )}
                      {isActive && isPaused && (
                        <span
                          className="absolute top-1/2 -translate-y-1/2 h-1 w-10 bg-accent rounded-full"
                          aria-hidden
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-4">
                <span className="text-xs font-mono tracking-widest text-gray-400">
                  <span className="text-primary font-semibold">
                    {String(index + 1).padStart(2, "0")}
                  </span>{" "}
                  / {String(testimonies.length).padStart(2, "0")}
                </span>

                {testimonies.length > 1 && (
                  <div className="flex md:hidden items-center gap-2">
                    <button
                      type="button"
                      onClick={prev}
                      aria-label="Previous testimony"
                      className="w-11 h-11 rounded-full bg-gray-100 text-primary flex items-center justify-center hover:bg-accent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    >
                      <FaChevronLeft size={11} aria-hidden />
                    </button>
                    <button
                      type="button"
                      onClick={next}
                      aria-label="Next testimony"
                      className="w-11 h-11 rounded-full bg-gray-100 text-primary flex items-center justify-center hover:bg-accent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    >
                      <FaChevronRight size={11} aria-hidden />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 sm:mt-12">
          <Link
            href="/testimonies/submit"
            className="group block bg-midnight rounded-2xl p-6 sm:p-8 shadow-[0_20px_40px_-15px_rgba(15,26,58,0.25)] hover:shadow-[0_30px_60px_-20px_rgba(15,26,58,0.35)] hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
              <div>
                <h3 className="font-heading text-xl sm:text-2xl text-white mb-1.5">
                  Has God done something in your life?
                </h3>
                <p className="text-sm text-gray-300">
                  Share your testimony and encourage others in the faith.
                </p>
              </div>
              <span className="shrink-0 inline-flex items-center gap-2 bg-accent text-midnight px-6 py-3 rounded-md font-semibold text-sm tracking-wide group-hover:bg-accent-light transition-colors">
                Share Your Testimony
                <span
                  aria-hidden="true"
                  className="group-hover:translate-x-1 transition-transform duration-200"
                >
                  →
                </span>
              </span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}