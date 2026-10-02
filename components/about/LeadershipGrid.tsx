"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaEnvelope,
  FaXmark,
  FaLocationDot,
  FaUser,
} from "react-icons/fa6";

// ────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────
export type LeaderTier = "executive" | "branch";

export type Leader = {
  id: string;
  name: string;
  role: string;
  tier: LeaderTier;
  location?: string;
  flag?: string;
  bio: string;
  image?: string;
  email?: string;
};

// ────────────────────────────────────────────────
// Data
// ────────────────────────────────────────────────
const leaders: Leader[] = [
  {
    id: "ogbale",
    name: "Apostle Oghale B. Uwubiti",
    role: "Senior Pastor / Founder",
    tier: "executive",
    location: "San Donato, Italy",
    flag: "🇮🇹",
    image: "/apostle-oghale.jpeg",
    bio: "Apostle Oghale is the founder and senior pastor of The Lord's Hour Ministries International. He received the divine mandate in 2015 through prayer and oversees the global vision of the ministry. Alongside his wife, Rev. Abies, he leads the international headquarters in San Donato, Italy.",
    email: "thelordshourministriesinc@gmail.com",
  },
  {
    id: "abies",
    name: "Rev. Abies Uwubiti Imarhia",
    role: "Co-Pastor",
    tier: "executive",
    location: "San Donato, Italy",
    flag: "🇮🇹",
    image: "/rev-abies.jpeg",
    bio: "Rev. Abies partners with Apostle Oghale in leading the ministry. She plays a key role in pastoral care and the spiritual development of the church. In 2020, the vision for the Nigerian branch came to her from God, and she continues to shepherd the church with grace and wisdom.",
    email: "thelordshourministriesinc@gmail.com",
  },
  {
    id: "martins",
    name: "Pastor Martins Igbodo",
    role: "Branch Pastor",
    tier: "branch",
    location: "Benin City, Nigeria",
    flag: "🇳🇬",
    image: "/pastor-martins.jpeg",
    bio: "Pastor Martins serves as the branch pastor for our Nigerian church in Benin City, providing leadership and shepherding to the congregation.",
    // No image → will render initials avatar
  },
  {
    id: "stanley",
    name: "Minister Stanley Agbai",
    role: "Branch Assistant",
    tier: "branch",
    location: "Benin City, Nigeria",
    flag: "🇳🇬",
    image: "/minister-stanley.jpeg",
    bio: "Minister Stanley assists the branch pastor in the day-to-day operations and ministry of the Nigerian branch, serving the congregation faithfully.",
    // No image → will render initials avatar
  },
    {
    id: "owolabi",
    name: "Oluwakemi Owolabi",
    role: "Women Leader/Choir Director",
    tier: "executive",
    location: "San Donato, Italy",
    flag: "🇮🇹",
    image: "/oluwakemi-owolabi.jpeg",
    bio: "Oluwakemi Owolabi serves as a women leader and choir director in our international ministry, providing guidance and support to the female congregation and leading the choir in worship.",
    // No image → will render initials avatar
  },
  {
    id: "joshua",
    name: "Minister Joshua Owolabi",
    role: "Program Director",
    tier: "executive",
    location: "San Donato, Italy",
    flag: "🇮🇹",
    image: "/minister-joshua.jpeg",
    bio: "Minister Joshua oversees the program development and implementation for our international ministry, ensuring alignment with the vision and mission of the organization.",
    // No image → will render initials avatar
  },
    {
    id: "larry",
    name: "Elder Larry Oboh",
    role: "Elder of the Church",
    tier: "executive",
    location: "San Donato, Italy",
    flag: "🇮🇹",
    image: "/elder-larry.jpeg",
    bio: "Elder Larry serves as an elder in our international ministry, providing spiritual guidance and leadership to the congregation."
    // No image → will render initials avatar
  },
];

// ────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────
function getInitials(name: string) {
  const parts = name.replace(/^(Apostle|Rev\.|Pastor|Minister)\s+/i, "").split(" ");
  const first = parts[0]?.[0] || "";
  const last = parts[parts.length - 1]?.[0] || "";
  return (first + last).toUpperCase();
}

// Deterministic color per leader id
const AVATAR_GRADIENTS = [
  "from-midnight to-[#0a1330]",
  "from-accent to-amber-600",
  "from-purple-700 to-purple-900",
  "from-emerald-700 to-emerald-900",
  "from-blue-700 to-blue-900",
  "from-rose-700 to-rose-900",
];

function getAvatarGradient(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash + id.charCodeAt(i)) % 1000;
  return AVATAR_GRADIENTS[hash % AVATAR_GRADIENTS.length];
}

// ────────────────────────────────────────────────
// Component
// ────────────────────────────────────────────────
export function LeadershipGrid() {
  const [selected, setSelected] = useState<Leader | null>(null);
  const [visibleIds, setVisibleIds] = useState<Set<string>>(new Set());
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Scroll-in animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = (entry.target as HTMLElement).dataset.leaderId;
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
  }, []);

  // Escape key closes modal
  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  // Body scroll lock
  useEffect(() => {
    if (!selected) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [selected]);

  const executives = leaders.filter((l) => l.tier === "executive");
  const branches = leaders.filter((l) => l.tier === "branch");

  return (
    <>
      {/* ────────────────────────────────────────
          Executive tier
      ──────────────────────────────────────── */}
      <div className="mb-16 md:mb-20">
        <div className="text-center mb-10 md:mb-12">
          <p className="text-accent text-xs tracking-[0.3em] uppercase font-semibold mb-3">
            Senior Leadership
          </p>
          <h2 className="font-heading text-2xl md:text-3xl text-primary">
            Founders &amp; Pastors
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
          {executives.map((leader, i) => (
            <LeaderCard
              key={leader.id}
              leader={leader}
              size="large"
              isVisible={visibleIds.has(leader.id)}
              delay={i * 100}
              onOpen={() => setSelected(leader)}
              refCallback={(el) => {
                if (el) cardRefs.current.set(leader.id, el);
                else cardRefs.current.delete(leader.id);
              }}
            />
          ))}
        </div>
      </div>

      {/* ────────────────────────────────────────
          Branch tier
      ──────────────────────────────────────── */}
      <div>
        <div className="text-center mb-10 md:mb-12">
          <p className="text-accent text-xs tracking-[0.3em] uppercase font-semibold mb-3">
            Branch Leadership
          </p>
          <h2 className="font-heading text-2xl md:text-3xl text-primary">
            Serving Our Locations
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 max-w-3xl mx-auto">
          {branches.map((leader, i) => (
            <LeaderCard
              key={leader.id}
              leader={leader}
              size="compact"
              isVisible={visibleIds.has(leader.id)}
              delay={i * 100}
              onOpen={() => setSelected(leader)}
              refCallback={(el) => {
                if (el) cardRefs.current.set(leader.id, el);
                else cardRefs.current.delete(leader.id);
              }}
            />
          ))}
        </div>
      </div>

      {/* ────────────────────────────────────────
          Bio modal
      ──────────────────────────────────────── */}
      {selected && (
        <BioModal leader={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}

// ────────────────────────────────────────────────
// Leader card
// ────────────────────────────────────────────────
function LeaderCard({
  leader,
  size,
  isVisible,
  delay,
  onOpen,
  refCallback,
}: {
  leader: Leader;
  size: "large" | "compact";
  isVisible: boolean;
  delay: number;
  onOpen: () => void;
  refCallback: (el: HTMLDivElement | null) => void;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const isLarge = size === "large";

  return (
    <div
      data-leader-id={leader.id}
      ref={refCallback}
      className="transition-all duration-700 ease-out"
      style={{
        transitionDelay: `${delay}ms`,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(24px)",
      }}
    >
      <button
        type="button"
        onClick={onOpen}
        className={`group relative w-full text-left bg-white rounded-2xl overflow-hidden shadow-[0_10px_30px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_25px_50px_-20px_rgba(0,0,0,0.18)] hover:-translate-y-1.5 transition-all duration-300 border ${
          isLarge ? "border-accent/30" : "border-gray-100"
        }`}
        aria-label={`View ${leader.name}'s profile`}
      >
        {/* Executive gold top accent */}
        {isLarge && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent z-10" />
        )}

        {/* Image container */}
        <div
          className={`relative w-full overflow-hidden ${
            isLarge ? "aspect-[4/5]" : "aspect-[4/5]"
          }`}
        >
          {leader.image && !imageFailed ? (
            <>
              <Image
                src={leader.image}
                alt={leader.name}
                fill
                sizes={isLarge ? "(max-width: 768px) 100vw, 400px" : "(max-width: 640px) 100vw, 320px"}
                className="object-cover object-top group-hover:scale-[1.05] transition-transform duration-500"
                onError={() => setImageFailed(true)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </>
          ) : (
            /* Initials fallback */
            <div
              className={`absolute inset-0 bg-gradient-to-br ${getAvatarGradient(
                leader.id
              )} flex items-center justify-center`}
            >
              <span className="font-heading text-6xl md:text-7xl font-bold text-white/95 tracking-tight">
                {getInitials(leader.name)}
              </span>
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
          )}

          {/* Role badge overlay (bottom of image) */}
          <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold backdrop-blur-md border ${
                isLarge
                  ? "bg-accent/95 text-midnight border-accent"
                  : "bg-white/95 text-midnight border-white/60"
              }`}
            >
              {leader.role}
            </span>
            {leader.location && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[11px] font-medium bg-midnight/85 backdrop-blur-md text-white border border-white/10">
                <span aria-hidden="true">{leader.flag}</span>
                {leader.location.split(",")[0]}
              </span>
            )}
          </div>
        </div>

        {/* Card body */}
        <div className={`${isLarge ? "p-6 md:p-7" : "p-5 md:p-6"}`}>
          <h3
            className={`font-heading font-bold text-primary leading-tight mb-2 ${
              isLarge ? "text-xl md:text-2xl" : "text-lg md:text-xl"
            }`}
          >
            {leader.name}
          </h3>

          <p
            className={`text-gray-600 leading-relaxed mb-4 ${
              isLarge ? "text-sm md:text-base" : "text-sm"
            } ${isLarge ? "" : "line-clamp-3"}`}
          >
            {leader.bio}
          </p>

          <span className="inline-flex items-center gap-1.5 text-accent text-xs font-semibold uppercase tracking-[0.14em] group-hover:gap-2.5 transition-all duration-200">
            Read Full Bio
            <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5">
              →
            </span>
          </span>
        </div>
      </button>
    </div>
  );
}

// ────────────────────────────────────────────────
// Bio modal
// ────────────────────────────────────────────────
function BioModal({ leader, onClose }: { leader: Leader; onClose: () => void }) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`${leader.name} biography`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-midnight/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden bg-white rounded-2xl shadow-2xl"
        style={{ animation: "modalIn 260ms ease-out" }}
      >
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close profile"
          className="absolute top-3 right-3 z-20 w-10 h-10 rounded-full bg-white/95 backdrop-blur-md border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-accent hover:text-white hover:border-accent transition-colors"
        >
          <FaXmark size={16} />
        </button>

        <div className="overflow-y-auto max-h-[90vh]">
          {/* Image header */}
          <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] bg-gray-100">
            {leader.image && !imageFailed ? (
              <Image
                src={leader.image}
                alt={leader.name}
                fill
                sizes="(max-width: 768px) 100vw, 672px"
                className="object-cover object-top"
                onError={() => setImageFailed(true)}
              />
            ) : (
              <div
                className={`absolute inset-0 bg-gradient-to-br ${getAvatarGradient(
                  leader.id
                )} flex items-center justify-center`}
              >
                <span className="font-heading text-7xl md:text-8xl font-bold text-white/95">
                  {getInitials(leader.name)}
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Name overlay on image */}
            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
              <div className="flex flex-wrap gap-2 mb-2">
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-[11px] font-semibold bg-accent text-midnight">
                  {leader.role}
                </span>
                {leader.location && (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-medium bg-white/15 backdrop-blur-md text-white border border-white/20">
                    <span aria-hidden="true">{leader.flag}</span>
                    {leader.location}
                  </span>
                )}
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white leading-tight">
                {leader.name}
              </h2>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 sm:p-8">
            <h3 className="text-[11px] uppercase tracking-[0.24em] text-gray-500 font-semibold mb-4 flex items-center gap-2">
              <FaUser size={11} className="text-accent" />
              Biography
            </h3>
            <p className="text-gray-700 leading-relaxed text-sm sm:text-base mb-6">
              {leader.bio}
            </p>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-primary text-white px-5 py-3 rounded-md font-medium text-sm hover:bg-primary-light transition-colors"
            >
              <FaEnvelope size={13} />
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}