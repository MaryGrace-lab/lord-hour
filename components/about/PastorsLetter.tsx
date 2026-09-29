"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  FaQuoteLeft,
  FaChurch,
  FaCirclePlay,
  FaHandsPraying,
  FaArrowRight,
  FaAward,
} from "react-icons/fa6";

// ────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────
type QuickAction = {
  id: string;
  Icon: typeof FaChurch;
  label: string;
  description: string;
  href: string;
  accentFrom: string;
  iconBg: string;
  iconFg: string;
};

// ────────────────────────────────────────────────
// Quick actions
// ────────────────────────────────────────────────
const quickActions: QuickAction[] = [
  {
    id: "visit",
    Icon: FaChurch,
    label: "Plan a Visit",
    description: "Find service times and directions to a branch near you.",
    href: "/branches",
    accentFrom: "from-blue-500/20",
    iconBg: "bg-blue-50",
    iconFg: "text-blue-600",
  },
  {
    id: "sermon",
    Icon: FaCirclePlay,
    label: "Watch Latest Sermon",
    description: "Catch up on this week's message or browse our archive.",
    href: "/media/sermons",
    accentFrom: "from-accent/25",
    iconBg: "bg-accent/15",
    iconFg: "text-accent",
  },
  {
    id: "prayer",
    Icon: FaHandsPraying,
    label: "Request Prayer",
    description: "Our prayer team is ready to stand with you in faith.",
    href: "/contact",
    accentFrom: "from-purple-500/20",
    iconBg: "bg-purple-50",
    iconFg: "text-purple-600",
  },
];

// ────────────────────────────────────────────────
// Main component
// ────────────────────────────────────────────────
export function PastorsLetter() {
  const [photoVisible, setPhotoVisible] = useState(false);
  const [letterVisible, setLetterVisible] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const photoRef = useRef<HTMLDivElement>(null);
  const letterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    const makeObserver = (
      ref: React.RefObject<HTMLDivElement | null>,
      setter: (v: boolean) => void
    ) => {
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              setter(true);
              obs.disconnect();
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
      );
      if (ref.current) obs.observe(ref.current);
      observers.push(obs);
    };

    makeObserver(photoRef, setPhotoVisible);
    makeObserver(letterRef, setLetterVisible);

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <div className="relative">
      {/* ══════════════════════════════════════════
          Editorial grid: portrait + letter
      ══════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* ── Portrait column ── */}
        <div
          ref={photoRef}
          className={`lg:col-span-5 lg:sticky lg:top-24 transition-all duration-1000 ease-out ${
            photoVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <div className="relative max-w-md mx-auto lg:mx-0">
            {/* Decorative gold offset frame */}
            <div
              className="absolute -top-3 -left-3 w-full h-full rounded-2xl border-2 border-accent/40 pointer-events-none"
              aria-hidden="true"
            />

            {/* Portrait frame */}
            <div className="group relative aspect-[4/5] rounded-2xl overflow-hidden shadow-[0_25px_50px_-20px_rgba(15,26,58,0.35)] border border-white/10">
              {!imageFailed ? (
                <Image
                  src="/pastor-couple.jpeg"
                  alt="Apostle Oghale B. Uwubiti and Rev. Abies Uwubiti Imarhia"
                  fill
                  sizes="(max-width: 1024px) 100vw, 400px"
                  className="object-cover object-center group-hover:scale-[1.04] transition-transform duration-700"
                  priority
                  onError={() => setImageFailed(true)}
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-midnight via-[#0a1330] to-[#050b1e] flex items-center justify-center">
                  <span className="font-heading text-7xl font-bold text-white/95">
                    OU
                  </span>
                </div>
              )}

              {/* Bottom fade */}
              <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-midnight/90 via-midnight/40 to-transparent" />

              {/* Name badge overlay */}
              <div className="absolute bottom-5 left-5 right-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-[0.18em] bg-accent text-midnight">
                    <FaAward size={9} />
                    Founder & Senior Pastor
                  </span>
                </div>
                <p className="font-heading text-lg sm:text-xl font-bold text-white leading-tight">
                  Apostle Oghale B. Uwubiti
                </p>
                <p className="text-white/70 text-xs">
                  &amp; Rev. Abies Uwubiti Imarhia
                </p>
              </div>
            </div>

            {/* Floating accent badge */}
            <div className="absolute -bottom-5 -right-5 bg-white rounded-xl shadow-xl border border-gray-100 px-4 py-3 hidden sm:block">
              <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-semibold">
                Est.
              </p>
              <p className="font-heading text-lg font-bold text-primary leading-none">
                2015
              </p>
            </div>
          </div>
        </div>

        {/* ── Letter column ── */}
        <div
          ref={letterRef}
          className={`lg:col-span-7 transition-all duration-1000 delay-200 ease-out ${
            letterVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <div className="relative">
            {/* Watermark quote mark behind the letter */}
            <FaQuoteLeft
              className="absolute -top-6 -left-2 text-accent/[0.08] pointer-events-none"
              size={120}
              aria-hidden="true"
            />

            <article className="relative bg-white rounded-3xl border border-gray-100 shadow-[0_15px_40px_-20px_rgba(0,0,0,0.1)] p-7 sm:p-10 md:p-12">
              {/* Top gold accent */}
              <div className="absolute top-0 left-10 right-10 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />

              {/* Salutation */}
              <p className="text-accent text-[11px] tracking-[0.3em] uppercase font-semibold mb-5">
                A Message from Our Pastor
              </p>

              <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-primary leading-tight mb-8">
                Dear Beloved,
              </h2>

              {/* Opening paragraph with drop cap */}
              <p className="text-gray-700 leading-[1.85] text-base md:text-lg mb-6">
                <span
                  className="float-left font-heading text-accent text-6xl sm:text-7xl leading-[0.8] font-bold mr-3 mt-1 select-none"
                  aria-hidden="true"
                >
                  W
                </span>
                <span className="sr-only">W</span>
                elcome to The Lord&apos;s Hour Ministries — a people prepared
                for His coming. It is our joy to have you visit with us,
                whether online or in person.
              </p>

              <p className="text-gray-700 leading-[1.85] text-base md:text-lg mb-6">
                Our ministry is built upon the mandate to liberate mankind from
                darkness into the marvelous light of Christ.
              </p>

              {/* Pull quote */}
              <blockquote className="relative my-8 md:my-10 pl-6 sm:pl-8 py-2 border-l-4 border-accent">
                <FaQuoteLeft
                  className="absolute -left-2 -top-3 text-accent text-xl"
                  aria-hidden="true"
                />
                <p className="font-heading text-xl sm:text-2xl md:text-[1.65rem] italic text-primary leading-snug">
                  &ldquo;We would love to connect with you, pray with you, and
                  help you grow in your walk with God.&rdquo;
                </p>
              </blockquote>

              <p className="text-gray-700 leading-[1.85] text-base md:text-lg mb-6">
                I encourage you to explore our site, learn more about our
                vision and mission, and discover how you can be part of what
                God is doing through this ministry.
              </p>

              <p className="text-gray-700 leading-[1.85] text-base md:text-lg mb-10">
                May the Lord bless you richly as you seek Him.
              </p>

              {/* Signature block */}
              <div className="pt-8 border-t border-gray-100">
                <p className="text-sm text-gray-500 italic mb-4">
                  In His service,
                </p>

                {/* Stylized signature */}
                <p className="font-heading text-3xl sm:text-4xl italic text-primary leading-none mb-2 tracking-tight">
                  Oghale B. Uwubiti
                </p>

                <div className="flex flex-wrap items-center gap-3 mt-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/10 text-accent text-[11px] font-semibold uppercase tracking-[0.15em] border border-accent/25">
                    Apostle
                  </span>
                  <span className="text-sm text-gray-600">
                    Founder &amp; Senior Pastor
                  </span>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          Quick actions
      ══════════════════════════════════════════ */}
      <div className="mt-20 md:mt-24">
        <div className="text-center mb-10 md:mb-12">
          <p className="text-accent text-xs tracking-[0.3em] uppercase font-semibold mb-3">
            Where Would You Like to Go Next?
          </p>
          <h3 className="font-heading text-2xl md:text-3xl text-primary">
            Continue Your Journey
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {quickActions.map(({ id, Icon, label, description, href, accentFrom, iconBg, iconFg }) => (
            <Link
              key={id}
              href={href}
              className="group relative bg-white rounded-2xl border border-gray-100 p-6 md:p-7 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.08)] hover:shadow-[0_25px_50px_-20px_rgba(0,0,0,0.15)] hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
            >
              {/* Top gradient accent */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${accentFrom} to-transparent`}
              />

              <div
                className={`w-12 h-12 rounded-xl ${iconBg} ${iconFg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
              >
                <Icon size={20} />
              </div>

              <h4 className="font-heading text-lg font-bold text-primary mb-2 leading-tight">
                {label}
              </h4>

              <p className="text-gray-600 text-sm leading-relaxed flex-1 mb-5">
                {description}
              </p>

              <span className="inline-flex items-center gap-1.5 text-accent text-xs font-semibold uppercase tracking-[0.14em] group-hover:gap-2.5 transition-all duration-200">
                Continue
                <FaArrowRight size={10} className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}