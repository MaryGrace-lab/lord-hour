"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaLocationDot,
  FaPhone,
  FaEnvelope,
  FaClock,
  FaUser,
  FaArrowRight,
  FaMagnifyingGlass,
  FaDiamondTurnRight,
  FaGlobe,
} from "react-icons/fa6";
import type { Branch } from "@/lib/branches";

type FilterKey = "all" | "Italy" | "Nigeria";

const FILTERS: { key: FilterKey; label: string; flag?: string }[] = [
  { key: "all", label: "All Locations", flag: "🌍" },
  { key: "Italy", label: "Italy", flag: "🇮🇹" },
  { key: "Nigeria", label: "Nigeria", flag: "🇳🇬" },
];

export function BranchesDirectory({ branches }: { branches: Branch[] }) {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    let list = branches;
    if (activeFilter !== "all") {
      list = list.filter((b) => b.country === activeFilter);
    }
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (b) =>
          b.city.toLowerCase().includes(q) ||
          b.country.toLowerCase().includes(q) ||
          b.address.toLowerCase().includes(q) ||
          (b.pastor?.toLowerCase().includes(q) ?? false)
      );
    }
    return list;
  }, [branches, activeFilter, query]);

  return (
    <>
      {/* Filter bar */}
      <div className="mb-10 md:mb-14">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Country filter tabs */}
          <div
            role="group"
            aria-label="Filter branches by country"
            className="flex flex-wrap items-center gap-2"
          >
            {FILTERS.map((f) => {
              const isActive = activeFilter === f.key;
              return (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setActiveFilter(f.key)}
                  aria-pressed={isActive}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    isActive
                      ? "bg-accent text-midnight shadow-lg shadow-accent/25"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-primary"
                  }`}
                >
                  {f.flag && (
                    <span className="text-base" aria-hidden="true">
                      {f.flag}
                    </span>
                  )}
                  {f.label}
                </button>
              );
            })}
          </div>

          {/* Search */}
          <div className="relative w-full md:w-72">
            <label htmlFor="branch-search" className="sr-only">
              Search branches by city, country, or pastor
            </label>
            <FaMagnifyingGlass
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={13}
              aria-hidden="true"
            />
            <input
              id="branch-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              maxLength={100}
              placeholder="Search by city, country..."
              className="w-full bg-white border border-gray-200 rounded-full pl-10 pr-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
            />
          </div>
        </div>

        {/* Result count */}
        <p className="text-xs text-gray-500 mt-4" aria-live="polite">
          Showing{" "}
          <span className="font-semibold text-primary">
            {filtered.length}
          </span>{" "}
          {filtered.length === 1 ? "location" : "locations"}
        </p>
      </div>

      {/* Branch cards */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center max-w-lg mx-auto">
          <FaGlobe
            className="text-gray-300 text-4xl mx-auto mb-4"
            aria-hidden
          />
          <p className="text-gray-500 mb-1">
            No locations match your search.
          </p>
          <p className="text-xs text-gray-400">
            Try a different city, country, or clear the search.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {filtered.map((branch) => (
            <BranchCard key={branch.slug} branch={branch} />
          ))}
        </div>
      )}
    </>
  );
}

function BranchCard({ branch }: { branch: Branch }) {
  return (
    <article className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-[0_10px_30px_-15px_rgba(0,0,0,0.08)] hover:shadow-[0_25px_50px_-20px_rgba(0,0,0,0.15)] hover:-translate-y-1 transition-all duration-300 flex flex-col">
      {/* Image header */}
      <div className="relative aspect-[16/9] overflow-hidden">
        {branch.imageUrl ? (
          <Image
            src={branch.imageUrl}
            alt={branch.name}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover group-hover:scale-[1.04] transition-transform duration-500"
          />
        ) : (
          <div
            className="absolute inset-0 bg-gradient-to-br from-midnight to-[#0a1330]"
            aria-hidden
          />
        )}

        {/* Dark gradient for legibility */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-midnight/85 via-midnight/20 to-transparent"
          aria-hidden
        />

        {/* Flag badge — top left */}
        <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-white/60 shadow-sm">
          <span className="text-base" aria-hidden="true">
            {branch.flag}
          </span>
          <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-midnight">
            {branch.country}
          </span>
        </div>

        {/* HQ badge — top right */}
        {branch.slug === "san-donato" && (
          <div className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent text-midnight shadow-lg shadow-accent/30">
            <span className="text-[10px] font-bold uppercase tracking-[0.14em]">
              Headquarters
            </span>
          </div>
        )}

        {/* City name overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <h2 className="font-heading text-2xl font-bold text-white leading-tight drop-shadow-md">
            {branch.city}
          </h2>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 flex-1 flex flex-col">
        {/* Description */}
        {branch.description && (
          <p className="text-sm text-gray-600 leading-relaxed mb-5">
            {branch.description}
          </p>
        )}

        {/* Contact info */}
        <ul className="space-y-3 mb-5">
          <li className="flex items-start gap-3">
            <FaLocationDot
              className="text-accent shrink-0 mt-0.5"
              size={13}
              aria-hidden
            />
            <span className="text-sm text-gray-700 leading-snug">
              {branch.address}
            </span>
          </li>
          {branch.phone && (
            <li className="flex items-start gap-3">
              <FaPhone
                className="text-accent shrink-0 mt-0.5"
                size={12}
                aria-hidden
              />
              <a
                href={`tel:${branch.phone.replace(/\s+/g, "")}`}
                className="text-sm text-gray-700 hover:text-accent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
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
                aria-hidden
              />
              <a
                href={`mailto:${branch.email}`}
                className="text-sm text-gray-700 hover:text-accent transition-colors break-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
              >
                {branch.email}
              </a>
            </li>
          )}
        </ul>

        {/* Service times */}
        <div className="bg-gray-50 rounded-xl p-4 mb-5">
          <p className="text-[10px] uppercase tracking-[0.16em] font-bold text-gray-500 mb-3 flex items-center gap-1.5">
            <FaClock size={10} className="text-accent" aria-hidden />
            Service Times
          </p>
          <ul className="space-y-2">
            {branch.serviceTimes.map((s) => (
              <li
                key={s.day}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-gray-700">{s.day}</span>
                <span className="font-semibold text-primary">{s.time}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Leadership */}
        {(branch.pastor || branch.assistantPastor) && (
          <div className="flex items-start gap-3 mb-6 pb-5 border-b border-gray-100">
            <FaUser
              className="text-accent shrink-0 mt-0.5"
              size={12}
              aria-hidden
            />
            <div className="min-w-0">
              {branch.pastor && (
                <p className="text-sm text-gray-800 font-medium leading-snug">
                  {branch.pastor}
                </p>
              )}
              {branch.assistantPastor && (
                <p className="text-xs text-gray-500 mt-0.5">
                  {branch.assistantPastor}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="mt-auto grid grid-cols-2 gap-2.5">
          {branch.directionsUrl && (
            <a
              href={branch.directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-primary text-white px-4 py-2.5 rounded-md text-xs font-semibold tracking-wide hover:bg-primary-light transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <FaDiamondTurnRight size={11} aria-hidden />
              Directions
              <span className="sr-only"> (opens in new tab)</span>
            </a>
          )}
          <Link
            href={`/branches/${branch.slug}`}
            className="group/btn inline-flex items-center justify-center gap-2 bg-accent text-midnight px-4 py-2.5 rounded-md text-xs font-semibold tracking-wide hover:bg-accent-light transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            View Branch
            <FaArrowRight
              size={10}
              className="group-hover/btn:translate-x-0.5 transition-transform"
              aria-hidden
            />
          </Link>
        </div>
      </div>
    </article>
  );
}