"use client";

import { useEffect, useRef, useState } from "react";
import {
  FaBookBible,
  FaCrown,
  FaCross,
  FaDove,
  FaFire,
  FaChurch,
  FaArrowRight,
  FaChevronDown,
} from "react-icons/fa6";

// ────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────
type BeliefCategory = "core" | "trinity" | "salvation";

type Belief = {
  id: string;
  title: string;
  description: string;
  Icon: typeof FaBookBible;
  category: BeliefCategory;
  scriptures: string[];
  iconBg: string;
  iconFg: string;
  accentFrom: string;
};

// ────────────────────────────────────────────────
// Data
// ────────────────────────────────────────────────
const beliefs: Belief[] = [
  {
    id: "bible",
    title: "The Bible",
    description:
      "We believe the Bible is the inspired, infallible, and authoritative Word of God, revealing His will for humanity.",
    Icon: FaBookBible,
    category: "core",
    scriptures: ["2 Timothy 3:16", "Psalm 119:105"],
    iconBg: "bg-blue-50",
    iconFg: "text-blue-600",
    accentFrom: "from-blue-500/20",
  },
  {
    id: "god",
    title: "God",
    description:
      "We believe in one God, eternally existing in three persons: Father, Son, and Holy Spirit.",
    Icon: FaCrown,
    category: "trinity",
    scriptures: ["Deuteronomy 6:4", "Matthew 28:19"],
    iconBg: "bg-accent/15",
    iconFg: "text-accent",
    accentFrom: "from-accent/25",
  },
  {
    id: "jesus",
    title: "Jesus Christ",
    description:
      "We believe in the deity of our Lord Jesus Christ, His virgin birth, His sinless life, His miracles, His atoning death, His bodily resurrection, and His ascension to the right hand of the Father.",
    Icon: FaCross,
    category: "trinity",
    scriptures: ["John 1:1", "1 Corinthians 15:3–4"],
    iconBg: "bg-purple-50",
    iconFg: "text-purple-600",
    accentFrom: "from-purple-500/20",
  },
  {
    id: "salvation",
    title: "Salvation",
    description:
      "We believe that salvation is by grace through faith in Jesus Christ, not by works, and that all who repent and believe are born again.",
    Icon: FaDove,
    category: "salvation",
    scriptures: ["Ephesians 2:8–9", "John 3:3"],
    iconBg: "bg-emerald-50",
    iconFg: "text-emerald-600",
    accentFrom: "from-emerald-500/20",
  },
  {
    id: "spirit",
    title: "The Holy Spirit",
    description:
      "We believe in the present ministry of the Holy Spirit, who indwells and empowers believers for holy living and service.",
    Icon: FaFire,
    category: "trinity",
    scriptures: ["Acts 1:8", "John 14:26"],
    iconBg: "bg-rose-50",
    iconFg: "text-rose-600",
    accentFrom: "from-rose-500/20",
  },
  {
    id: "church",
    title: "The Church",
    description:
      "We believe in the spiritual unity of all believers in our Lord Jesus Christ and in the importance of the local church for worship, fellowship, and discipleship.",
    Icon: FaChurch,
    category: "core",
    scriptures: ["Hebrews 10:24–25", "Matthew 16:18"],
    iconBg: "bg-indigo-50",
    iconFg: "text-indigo-600",
    accentFrom: "from-indigo-500/20",
  },
];

// ────────────────────────────────────────────────
// Filter tabs
// ────────────────────────────────────────────────
const filters: { key: BeliefCategory | "all"; label: string }[] = [
  { key: "all", label: "All Beliefs" },
  { key: "core", label: "Core Faith" },
  { key: "trinity", label: "The Trinity" },
  { key: "salvation", label: "Salvation & Spirit" },
];

// ────────────────────────────────────────────────
// Component
// ────────────────────────────────────────────────
export function BeliefsGrid() {
  const [activeFilter, setActiveFilter] = useState<BeliefCategory | "all">(
    "all"
  );
  const [visibleIds, setVisibleIds] = useState<Set<string>>(new Set());
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Scroll-triggered visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = (entry.target as HTMLElement).dataset.beliefId;
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
      { threshold: 0.15, rootMargin: "0px 0px -80px 0px" }
    );

    cardRefs.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [activeFilter]);

  const filteredBeliefs =
    activeFilter === "all"
      ? beliefs
      : beliefs.filter((b) => b.category === activeFilter);

  return (
    <div>
      {/* ── Filter pills ── */}
      <div className="sticky top-20 z-20 bg-white/90 backdrop-blur-md border-b border-gray-100 py-4 mb-10 -mx-5 sm:-mx-6 px-5 sm:px-6">
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-6xl mx-auto">
          {filters.map((f) => {
            const isActive = activeFilter === f.key;
            return (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Beliefs grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 max-w-6xl mx-auto">
        {filteredBeliefs.map((belief, index) => {
          const Icon = belief.Icon;
          const isVisible = visibleIds.has(belief.id);

          return (
            <div
              key={belief.id}
              data-belief-id={belief.id}
              ref={(el) => {
                if (el) cardRefs.current.set(belief.id, el);
                else cardRefs.current.delete(belief.id);
              }}
              className="transition-all duration-700 ease-out"
              style={{
                transitionDelay: `${(index % 3) * 80}ms`,
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(24px)",
              }}
            >
              <BeliefCard belief={belief} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────
// Card sub-component
// ────────────────────────────────────────────────
function BeliefCard({ belief }: { belief: Belief }) {
  const { Icon } = belief;
  const [scripturesOpen, setScripturesOpen] = useState(false);

  return (
    <article className="group relative h-full bg-white rounded-2xl border border-gray-100 p-6 md:p-7 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.08)] hover:shadow-[0_25px_50px_-20px_rgba(0,0,0,0.15)] hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">
      {/* Top gradient hairline */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${belief.accentFrom} to-transparent`}
      />

      {/* Icon */}
      <div
        className={`w-14 h-14 rounded-2xl ${belief.iconBg} ${belief.iconFg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
      >
        <Icon size={24} />
      </div>

      {/* Title */}
      <h3 className="font-heading text-xl md:text-2xl font-bold text-primary mb-3 leading-tight">
        {belief.title}
      </h3>

      {/* Description */}
      <p className="text-gray-600 text-sm md:text-base leading-relaxed flex-1 mb-5">
        {belief.description}
      </p>

      {/* Scripture pills — toggle on mobile, always visible on desktop */}
      <div className="border-t border-gray-100 pt-4">
        <button
          onClick={() => setScripturesOpen((v) => !v)}
          className="w-full flex items-center justify-between text-xs uppercase tracking-[0.14em] text-gray-500 hover:text-accent font-medium transition-colors mb-2"
          aria-expanded={scripturesOpen}
        >
          <span>Scripture References</span>
          <FaChevronDown
            size={10}
            className={`transition-transform duration-200 ${
              scripturesOpen ? "rotate-180" : ""
            } md:hidden`}
          />
        </button>

        <div
          className={`flex flex-wrap gap-2 overflow-hidden transition-all duration-300 md:max-h-none md:opacity-100 ${
            scripturesOpen
              ? "max-h-40 opacity-100 mt-2"
              : "max-h-0 opacity-0 md:mt-0"
          }`}
        >
          {belief.scriptures.map((ref) => (
            <span
              key={ref}
              className="inline-flex items-center px-2.5 py-1 rounded-full bg-accent/10 text-accent text-[11px] font-semibold tracking-wide border border-accent/20"
            >
              {ref}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}