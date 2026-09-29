"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  FaChurch,
  FaGlobe,
  FaHandsPraying,
  FaSeedling,
} from "react-icons/fa6";

// ────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────
type Milestone = {
  id: string;
  year: string;
  title: string;
  location: string;
  description: string;
  image: string;
  badge: string;
  Icon: typeof FaChurch;
};

// ────────────────────────────────────────────────
// Data
// ────────────────────────────────────────────────
const milestones: Milestone[] = [
  {
    id: "2015",
    year: "2015",
    title: "The Divine Mandate",
    location: "A calling received through prayer",
    description:
      "The mandate for The Lord's Hour Ministry International was given to Apostle Oghale B. Uwubiti in 2015 through divine consultation. Further consultations through prayer were made to seek ministerial guidance on when, where, and how.",
    image: "/church-1.jpeg",
    badge: "The Beginning",
    Icon: FaHandsPraying,
  },
  {
    id: "2019",
    year: "August 11, 2019",
    title: "International Headquarters",
    location: "San Donato, Italy",
    description:
      "The answers regarding when and where soon became clear. This led to the creation of our first church in San Donato, Italy. Today, this location serves as our international headquarters and is led by Apostle Oghale B. Uwubiti alongside his wife, Rev. Abies Uwubiti Imarhia.",
    image: "/church-2.jpeg",
    badge: "Foundation",
    Icon: FaChurch,
  },
  {
    id: "2020",
    year: "2020",
    title: "Expansion to Nigeria",
    location: "Benin City & Iwu",
    description:
      "The vision for a church in Nigeria came from God through Apostle's wife. This resulted in the establishment of our first local branch in Benin City, followed by the Iwu church. Today, we have churches both locally and internationally, all to the glory of God.",
    image: "/church-3.jpeg",
    badge: "Growth",
    Icon: FaSeedling,
  },
  {
    id: "present",
    year: "Present Day",
    title: "A Global Ministry",
    location: "Across Continents",
    description:
      "The Lord's Hour Ministry has never run dry and has always operated in excellence. This ministry has raised men and women of great excellence — for the family, the church, and the mission field.",
    image: "/church-4.jpeg",
    badge: "Continuing",
    Icon: FaGlobe,
  },
];

// ────────────────────────────────────────────────
// Component
// ────────────────────────────────────────────────
export function HistoryTimeline() {
  const [visibleIds, setVisibleIds] = useState<Set<string>>(new Set());
  const itemsRef = useRef<Map<string, HTMLLIElement>>(new Map());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = (entry.target as HTMLElement).dataset.milestoneId;
            if (id) {
              setVisibleIds((prev) => {
                if (prev.has(id)) return prev;
                const next = new Set(prev);
                next.add(id);
                return next;
              });
            }
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -100px 0px" }
    );

    itemsRef.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative">
      {/* Central timeline spine — desktop only */}
      <div
        className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-gray-200 to-transparent"
        aria-hidden="true"
      />

      <ol className="relative space-y-12 md:space-y-20">
        {milestones.map((milestone, index) => {
          const isVisible = visibleIds.has(milestone.id);
          const isLeft = index % 2 === 0;
          const Icon = milestone.Icon;

          return (
            <li
              key={milestone.id}
              data-milestone-id={milestone.id}
              ref={(el) => {
                if (el) itemsRef.current.set(milestone.id, el);
                else itemsRef.current.delete(milestone.id);
              }}
              className={`relative flex flex-col md:flex-row md:items-center transition-all duration-700 ease-out ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              {/* ── Content column ── */}
              <div
                className={`w-full md:w-1/2 px-0 md:px-10 ${
                  isLeft ? "md:order-1 md:text-right" : "md:order-2"
                }`}
              >
                {/* Year badge — mobile shows inline, desktop shows above card */}
                <div
                  className={`flex items-center gap-3 mb-4 md:mb-3 ${
                    isLeft ? "md:justify-end" : ""
                  }`}
                >
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 text-accent text-xs font-semibold tracking-wide">
                    <Icon size={11} />
                    {milestone.year}
                  </span>
                  <span className="text-xs text-gray-400 uppercase tracking-widest">
                    {milestone.badge}
                  </span>
                </div>

                {/* Card */}
                <div className="group bg-white rounded-2xl border border-gray-100 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_25px_50px_-20px_rgba(0,0,0,0.15)] hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                  {/* Mobile image (top) */}
                  <div className="relative aspect-[16/10] md:hidden">
                    <Image
                      src={milestone.image}
                      alt={milestone.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 0px"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  </div>

                  <div className="p-6 md:p-8">
                    <h3 className="font-heading text-xl md:text-2xl font-bold text-primary leading-tight mb-2">
                      {milestone.title}
                    </h3>
                    <p className="text-accent text-sm font-medium mb-4">
                      {milestone.location}
                    </p>
                    <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                      {milestone.description}
                    </p>
                  </div>

                  {/* Desktop image (bottom of card, only on md+) */}
                  <div className="relative aspect-[16/9] hidden md:block">
                    <Image
                      src={milestone.image}
                      alt={milestone.title}
                      fill
                      sizes="(max-width: 768px) 0px, 400px"
                      className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                </div>
              </div>

              {/* ── Center node ── */}
              <div
                className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
                aria-hidden="true"
              >
                <div className="relative">
                  <span
                    className={`block w-4 h-4 rounded-full border-4 border-white bg-accent transition-all duration-500 ${
                      isVisible
                        ? "shadow-[0_0_0_6px_rgba(201,168,76,0.15)]"
                        : "shadow-none"
                    }`}
                  />
                  {isVisible && (
                    <span className="absolute inset-0 rounded-full bg-accent animate-ping opacity-30" />
                  )}
                </div>
              </div>

              {/* ── Spacer column (desktop only) ── */}
              <div
                className={`hidden md:block md:w-1/2 ${
                  isLeft ? "md:order-2" : "md:order-1"
                }`}
              />
            </li>
          );
        })}
      </ol>
    </div>
  );
}