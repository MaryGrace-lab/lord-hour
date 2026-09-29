"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const heroImages = [
  { src: "/church-1.jpeg", alt: "Congregation worshipping" },
  { src: "/church-2.jpeg", alt: "Church gathering" },
  { src: "/church-3.jpeg", alt: "Ministry in session" },
  { src: "/church-4.jpeg", alt: "Worship service" },
  { src: "/church-5.jpeg", alt: "Fellowship" },
  { src: "/church-6.jpeg", alt: "Church community" },
  { src: "/church-7.jpeg", alt: "Service in progress" },
];

const SLIDE_DURATION = 6000;

export function Hero() {
  const [index, setIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev === heroImages.length - 1 ? 0 : prev + 1));
    }, SLIDE_DURATION);
    return () => clearInterval(interval);
  }, [reducedMotion]);

  return (
    <section className="relative h-[85dvh] min-h-[600px] max-h-[900px] overflow-hidden bg-midnight">
      {/* Slideshow — only the current + next image are rendered */}
      {heroImages.map((image, i) => {
        const distance = (i - index + heroImages.length) % heroImages.length;
        const isActive = i === index;
        const isNext = distance === 1;
        const shouldRender = isActive || isNext;

        if (!shouldRender) return null;

        return (
          <div
            key={image.src}
            className={`absolute inset-0 transition-opacity duration-[1200ms] ease-in-out ${
              isActive ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden={!isActive}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="100vw"
              priority={i === 0}
              quality={75}
              className="object-cover"
              style={{
                animation:
                  isActive && !reducedMotion
                    ? `heroKenBurns ${SLIDE_DURATION + 2500}ms ease-out forwards`
                    : "none",
              }}
            />
          </div>
        );
      })}

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-midnight/95 via-midnight/70 to-midnight/25" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-t from-midnight/70 via-transparent to-transparent" aria-hidden />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="w-full max-w-7xl mx-auto px-6 md:px-10 lg:px-16">
          <div className="max-w-xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="block w-10 h-px bg-accent" aria-hidden />
              <span className="text-accent text-[11px] md:text-xs tracking-[0.3em] uppercase font-medium">
                The Lord&apos;s Hour Ministries
              </span>
            </div>

            <h1 className="font-heading text-[2rem] sm:text-5xl md:text-6xl lg:text-[4.25rem] font-bold text-white leading-[1.08] tracking-tight mb-6">
              A People Prepared
              <br />
              for His <span className="text-accent">Coming</span>
            </h1>

            <p className="text-base md:text-lg text-gray-200/90 leading-relaxed max-w-md mb-10">
              Experience God&apos;s presence. Grow in His Word. Live for His
              purpose.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-accent text-midnight px-8 py-3.5 rounded-md font-semibold text-sm tracking-wide shadow-lg shadow-accent/20 hover:bg-accent-light hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Join Us
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-8 md:bottom-10 left-6 md:left-10 lg:left-16 z-10 flex items-center gap-4">
        <span className="text-white/90 text-xs font-mono tracking-widest">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="flex items-center gap-1">
          {heroImages.map((_, i) => {
            const isActive = i === index;
            return (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={isActive ? "true" : undefined}
                className="group relative min-w-[44px] min-h-[44px] flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
              >
                <span
                  className={`block h-0.5 rounded-full transition-all duration-500 ${
                    isActive
                      ? "w-10 bg-white/25"
                      : "w-3 bg-white/30 group-hover:bg-white/70"
                  }`}
                />
                {isActive && (
                  <span
                    key={`progress-${index}`}
                    className="absolute top-1/2 -translate-y-1/2 h-0.5 w-10 bg-accent rounded-full origin-left"
                    style={{
                      animation: reducedMotion
                        ? "none"
                        : `heroProgress ${SLIDE_DURATION}ms linear forwards`,
                    }}
                    aria-hidden
                  />
                )}
              </button>
            );
          })}
        </div>
        <span className="hidden md:inline text-white/40 text-xs font-mono tracking-widest">
          {String(heroImages.length).padStart(2, "0")}
        </span>
      </div>

      {/* Scroll cue */}
      <div
        className="hidden lg:flex absolute bottom-10 right-16 z-10 flex-col items-center gap-3 text-white/50"
        aria-hidden
      >
        <span className="text-[10px] tracking-[0.35em] uppercase">Scroll</span>
        <span className="block w-px h-10 bg-gradient-to-b from-white/60 to-transparent" />
      </div>
    </section>
  );
}