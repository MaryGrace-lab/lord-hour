import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { branches } from "@/lib/branches";
import { BranchMap } from "@/components/branches/BranchMap";
import {
  FaLocationDot,
  FaPhone,
  FaEnvelope,
  FaClock,
  FaUser,
  FaArrowLeft,
  FaDiamondTurnRight,
  FaBuildingColumns,
  FaCircleInfo,
} from "react-icons/fa6";

type Props = {
  params: Promise<{ slug: string }>;
};

// ────────────────────────────────────────────────
// Metadata
// ────────────────────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const branch = branches.find((b) => b.slug === slug);

  if (!branch) {
    return { title: "Branch Not Found" };
  }

  const description =
    branch.description ||
    `Visit ${branch.name} in ${branch.city}, ${branch.country}.`;

  return {
    title: branch.city,  // Template adds site name
    description,
    alternates: { canonical: `/branches/${branch.slug}` },
    openGraph: {
      title: `${branch.city} | The Lord's Hour Ministries`,
      description,
      url: `/branches/${branch.slug}`,
      ...(branch.imageUrl
        ? { images: [{ url: branch.imageUrl }] }
        : {}),
    },
    twitter: {
      title: `${branch.city} | The Lord's Hour Ministries`,
      description,
      ...(branch.imageUrl ? { images: [branch.imageUrl] } : {}),
    },
  };
}

// ────────────────────────────────────────────────
// Static params
// ────────────────────────────────────────────────
export function generateStaticParams() {
  return branches.map((branch) => ({ slug: branch.slug }));
}

// ────────────────────────────────────────────────
// Page
// ────────────────────────────────────────────────
export default async function BranchDetailPage({ params }: Props) {
  const { slug } = await params;
  const branch = branches.find((b) => b.slug === slug);

  if (!branch) notFound();

  const isHeadquarters = branch.slug === "san-donato";

  return (
    <div className="bg-white">
      {/* ══════════════════════════════════════════
          Hero banner
      ══════════════════════════════════════════ */}
      <section className="relative overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          {branch.imageUrl && (
            <Image
              src={branch.imageUrl}
              alt=""
              fill
              sizes="100vw"
              className="object-cover object-center"
              priority
              aria-hidden="true"
            />
          )}
        </div>

        {/* Dark scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/85 to-midnight/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-midnight/70 via-transparent to-transparent" />

        {/* Content */}
        <div className="relative w-full max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-20 md:pt-28 pb-16 md:pb-20">
          {/* Back link */}
          <Link
            href="/branches"
            className="inline-flex items-center gap-1.5 text-sm text-white/80 hover:text-accent transition-colors mb-8"
          >
            <FaArrowLeft size={11} />
            All Locations
          </Link>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-5">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-white/60 shadow-sm">
              <span className="text-base" aria-hidden="true">
                {branch.flag}
              </span>
              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-midnight">
                {branch.country}
              </span>
            </span>

            {isHeadquarters ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent text-midnight shadow-lg shadow-accent/30">
                <FaBuildingColumns size={10} />
                <span className="text-[10px] font-bold uppercase tracking-[0.14em]">
                  International Headquarters
                </span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white">
                <span className="text-[10px] font-bold uppercase tracking-[0.14em]">
                  Regional Branch
                </span>
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-[1.05] tracking-tight mb-3 max-w-3xl">
            {branch.city}
          </h1>
          <p className="text-lg md:text-xl text-gray-200/90 mb-8">
            {branch.address}
          </p>

          {/* Quick actions */}
          <div className="flex flex-wrap gap-3">
            {branch.directionsUrl && (
              <a
                href={branch.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 bg-accent text-midnight px-6 py-3.5 rounded-md font-semibold text-sm tracking-wide shadow-lg shadow-accent/25 hover:bg-accent-light hover:-translate-y-0.5 transition-all duration-300"
              >
                <FaDiamondTurnRight size={12} />
                Get Directions
              </a>
            )}
            {branch.phone && !branch.phone.includes("please add") && (
              <a
                href={`tel:${branch.phone.replace(/\s+/g, "")}`}
                className="inline-flex items-center gap-2 border border-white/40 bg-white/10 backdrop-blur-md text-white px-6 py-3.5 rounded-md font-semibold text-sm tracking-wide hover:bg-white/20 transition-all duration-300"
              >
                <FaPhone size={12} />
                Call Branch
              </a>
            )}
            <a
              href="#visit"
              className="inline-flex items-center gap-2 border border-white/40 bg-white/10 backdrop-blur-md text-white px-6 py-3.5 rounded-md font-semibold text-sm tracking-wide hover:bg-white/20 transition-all duration-300"
            >
              <FaCircleInfo size={12} />
              Plan Your Visit
            </a>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          Info grid
      ══════════════════════════════════════════ */}
      <section id="visit" className="py-16 md:py-20">
        <div className="w-full max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {/* ── Service Times ── */}
            <article className="relative bg-white rounded-2xl border border-gray-100 p-6 sm:p-7 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_45px_-20px_rgba(0,0,0,0.15)] hover:-translate-y-1 transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent/30 via-accent to-accent/30" />

              <div className="w-12 h-12 rounded-xl bg-accent/15 text-accent flex items-center justify-center mb-5">
                <FaClock size={18} />
              </div>
              <h2 className="font-heading text-xl font-bold text-primary mb-5">
                Service Times
              </h2>
              <ul className="space-y-4">
                {branch.serviceTimes.map((s) => (
                  <li key={s.day} className="flex items-start justify-between gap-3">
                    <span className="text-sm text-gray-700 leading-snug">
                      {s.day}
                    </span>
                    <span className="font-heading text-base font-bold text-accent whitespace-nowrap">
                      {s.time}
                    </span>
                  </li>
                ))}
              </ul>
            </article>

            {/* ── Leadership ── */}
            <article className="relative bg-white rounded-2xl border border-gray-100 p-6 sm:p-7 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_45px_-20px_rgba(0,0,0,0.15)] hover:-translate-y-1 transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500/30 via-blue-500 to-blue-500/30" />

              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5">
                <FaUser size={18} />
              </div>
              <h2 className="font-heading text-xl font-bold text-primary mb-5">
                Leadership
              </h2>
              <ul className="space-y-4">
                {branch.pastor && (
                  <li>
                    <p className="text-[10px] uppercase tracking-[0.16em] font-semibold text-gray-500 mb-1">
                      Branch Pastor
                    </p>
                    <p className="font-heading text-base font-bold text-primary leading-tight">
                      {branch.pastor}
                    </p>
                  </li>
                )}
                {branch.assistantPastor && (
                  <li>
                    <p className="text-[10px] uppercase tracking-[0.16em] font-semibold text-gray-500 mb-1">
                      Assistant Pastor
                    </p>
                    <p className="font-heading text-base font-bold text-primary leading-tight">
                      {branch.assistantPastor}
                    </p>
                  </li>
                )}
              </ul>
            </article>

            {/* ── Contact ── */}
            <article className="relative bg-white rounded-2xl border border-gray-100 p-6 sm:p-7 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_45px_-20px_rgba(0,0,0,0.15)] hover:-translate-y-1 transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500/30 via-purple-500 to-purple-500/30" />

              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-5">
                <FaLocationDot size={18} />
              </div>
              <h2 className="font-heading text-xl font-bold text-primary mb-5">
                Contact
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <FaLocationDot
                    className="text-accent shrink-0 mt-0.5"
                    size={13}
                  />
                  <span className="text-sm text-gray-700 leading-snug">
                    {branch.address}
                  </span>
                </li>
                {branch.phone && !branch.phone.includes("please add") && (
                  <li className="flex items-start gap-3">
                    <FaPhone className="text-accent shrink-0 mt-0.5" size={12} />
                    <a
                      href={`tel:${branch.phone.replace(/\s+/g, "")}`}
                      className="text-sm text-gray-700 hover:text-accent transition-colors"
                    >
                      {branch.phone}
                    </a>
                  </li>
                )}
                {branch.email && (
                  <li className="flex items-start gap-3">
                    <FaEnvelope
                      className="text-accent shrink-0 mt-0.5"
                      size={12}
                    />
                    <a
                      href={`mailto:${branch.email}`}
                      className="text-sm text-gray-700 hover:text-accent transition-colors break-all"
                    >
                      {branch.email}
                    </a>
                  </li>
                )}
              </ul>
            </article>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          About + Map
      ══════════════════════════════════════════ */}
      <section className="pb-16 md:pb-24">
        <div className="w-full max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          {/* About block */}
          {branch.description && (
            <div className="relative bg-gradient-to-br from-midnight via-[#0a1330] to-[#050b1e] rounded-2xl p-8 md:p-10 mb-8 overflow-hidden shadow-2xl">
              <div className="pointer-events-none absolute -top-20 -right-20 w-64 h-64 rounded-full bg-accent/15 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-accent/10 blur-3xl" />

              <div className="relative max-w-3xl">
                <p className="text-accent text-[11px] uppercase tracking-[0.28em] font-semibold mb-3">
                  About This Branch
                </p>
                <h2 className="font-heading text-2xl md:text-3xl text-white leading-tight mb-5">
                  {branch.city} Branch
                </h2>
                <p className="text-gray-300 text-base md:text-lg leading-relaxed">
                  {branch.description}
                </p>
              </div>
            </div>
          )}

          {/* Map */}
          {branch.mapEmbedUrl && (
            <BranchMap
              embedUrl={branch.mapEmbedUrl}
              directionsUrl={branch.directionsUrl || ""}
              branchName={branch.name}
            />
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          Bottom CTA
      ══════════════════════════════════════════ */}
      <section className="py-16 md:py-20 bg-gray-50 border-t border-gray-100">
        <div className="w-full max-w-3xl mx-auto px-5 sm:px-6 text-center">
          <p className="text-accent text-xs tracking-[0.3em] uppercase font-semibold mb-3">
            Find Another Location
          </p>
          <h2 className="font-heading text-2xl md:text-3xl text-primary mb-4">
            Explore all our branches
          </h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            We have multiple locations across Nigeria and Italy. Find the
            branch closest to you.
          </p>
          <Link
            href="/branches"
            className="group inline-flex items-center gap-2 bg-primary text-white px-7 py-3.5 rounded-md font-semibold text-sm tracking-wide hover:bg-primary-light hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300"
          >
            View All Locations
            <FaArrowLeft
              size={11}
              className="rotate-180 group-hover:translate-x-1 transition-transform duration-200"
            />
          </Link>
        </div>
      </section>
    </div>
  );
}