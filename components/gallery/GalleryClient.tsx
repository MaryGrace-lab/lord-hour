"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import {
  FaXmark,
  FaChevronLeft,
  FaChevronRight,
  FaMagnifyingGlassPlus,
  FaCamera,
} from "react-icons/fa6";

type GalleryCategory = "worship" | "youth" | "outreach" | "events";

type GalleryItem = {
  id: string;
  src: string;
  alt: string;
  title: string;
  category: GalleryCategory;
  date: string;
};

const CATEGORIES: { key: GalleryCategory | "all"; label: string }[] = [
  { key: "all", label: "All Moments" },
  { key: "worship", label: "Worship & Praise" },
  { key: "youth", label: "Youth & Children" },
  { key: "outreach", label: "Outreach & Missions" },
  { key: "events", label: "Special Events & Awards" },
];

const CATEGORY_CYCLE: GalleryCategory[] = [
  "worship",
  "youth",
  "events",
  "worship",
  "outreach",
  "youth",
  "events",
];

const TITLE_BY_CATEGORY: Record<GalleryCategory, string> = {
  worship: "Worship Service",
  youth: "Youth Fellowship",
  outreach: "Outreach Moment",
  events: "Special Event",
};

const GALLERY_ITEMS: GalleryItem[] = Array.from({ length: 49 }, (_, i) => {
  const n = i + 1;
  const category = CATEGORY_CYCLE[i % CATEGORY_CYCLE.length];
  return {
    id: `lord-hour-${n}`,
    src: `/lord-hour-${n}.jpeg`,
    alt: TITLE_BY_CATEGORY[category],
    title: `${TITLE_BY_CATEGORY[category]} ${n}`,
    category,
    date: "2026",
  };
});

export function GalleryClient() {
  const [activeCategory, setActiveCategory] = useState<
    GalleryCategory | "all"
  >("all");
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const [visibleCount, setVisibleCount] = useState(16);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const filteredItems = useMemo(() => {
    if (activeCategory === "all") return GALLERY_ITEMS;
    return GALLERY_ITEMS.filter((i) => i.category === activeCategory);
  }, [activeCategory]);

  const visibleItems = useMemo(
    () => filteredItems.slice(0, visibleCount),
    [filteredItems, visibleCount]
  );

  const hasMore = visibleCount < filteredItems.length;

  // Reset visible count when category changes
  useEffect(() => {
    setVisibleCount(16);
  }, [activeCategory]);

  // Infinite scroll
  useEffect(() => {
    if (!hasMore) return;
    const el = loadMoreRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((c) => Math.min(c + 16, filteredItems.length));
        }
      },
      { rootMargin: "300px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, filteredItems.length]);

  // Lightbox navigation
  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = useCallback(() => setLightboxIndex(-1), []);

  const showPrev = useCallback(() => {
    setLightboxIndex((prev) =>
      prev <= 0 ? visibleItems.length - 1 : prev - 1
    );
  }, [visibleItems.length]);

  const showNext = useCallback(() => {
    setLightboxIndex((prev) =>
      prev >= visibleItems.length - 1 ? 0 : prev + 1
    );
  }, [visibleItems.length]);

  // Keyboard shortcuts
  useEffect(() => {
    if (lightboxIndex < 0) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowLeft") showPrev();
      else if (e.key === "ArrowRight") showNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex, showPrev, showNext, closeLightbox]);

  // Body scroll lock + focus close button when lightbox opens
  useEffect(() => {
    if (lightboxIndex < 0) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // Give the DOM a frame to mount the lightbox before focusing.
    const id = window.setTimeout(() => closeButtonRef.current?.focus(), 50);
    return () => {
      document.body.style.overflow = original;
      window.clearTimeout(id);
    };
  }, [lightboxIndex]);

  const currentImage =
    lightboxIndex >= 0 ? visibleItems[lightboxIndex] : null;

  return (
    <>
      {/* Category filter pills */}
      <div
        role="group"
        aria-label="Filter gallery by category"
        className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10 md:mb-12"
      >
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.key;
          return (
            <button
              key={cat.key}
              type="button"
              onClick={() => setActiveCategory(cat.key)}
              aria-pressed={isActive}
              className={`relative px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                isActive
                  ? "text-midnight"
                  : "text-gray-600 hover:text-primary bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {isActive && (
                <span
                  className="absolute inset-0 rounded-full bg-accent shadow-lg shadow-accent/30"
                  style={{ animation: "filterPillIn 240ms ease-out" }}
                  aria-hidden="true"
                />
              )}
              <span className="relative">{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Masonry grid */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <FaCamera
            className="text-gray-300 text-4xl mx-auto mb-4"
            aria-hidden
          />
          <p className="text-gray-500">No photos in this category yet.</p>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 [&>*]:mb-4">
          {visibleItems.map((item, index) => (
            <GalleryCard
              key={item.id}
              item={item}
              onClick={() => openLightbox(index)}
            />
          ))}
        </div>
      )}

      {/* Load more sentinel */}
      {hasMore && (
        <div
          ref={loadMoreRef}
          className="mt-12 flex justify-center"
          role="status"
          aria-live="polite"
        >
          <div className="flex flex-col items-center gap-3">
            <div
              className="w-8 h-8 rounded-full border-2 border-accent/30 border-t-accent animate-spin"
              aria-hidden
            />
            <p className="text-xs text-gray-500 uppercase tracking-[0.16em]">
              Loading more photos...
            </p>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {currentImage && (
        <div
          className="fixed inset-0 z-[9999] bg-[#050b1e]/95 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-label={`${currentImage.title} — photo ${lightboxIndex + 1} of ${visibleItems.length}`}
          onClick={closeLightbox}
        >
          <div className="relative w-full h-full flex flex-col">
            {/* Top bar */}
            <div className="flex items-center justify-between p-4 sm:p-5 z-30 shrink-0">
              <div
                className="px-3 py-2 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-xs font-mono tracking-widest"
                aria-live="polite"
              >
                {String(lightboxIndex + 1).padStart(2, "0")} /{" "}
                {String(visibleItems.length).padStart(2, "0")}
              </div>

              <button
                ref={closeButtonRef}
                type="button"
                onClick={closeLightbox}
                className="w-11 h-11 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                aria-label="Close gallery"
              >
                <FaXmark size={18} aria-hidden />
              </button>
            </div>

            {/* Image area */}
            <div className="flex-1 relative min-h-0 px-4 sm:px-20">
              {visibleItems.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    showPrev();
                  }}
                  className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  aria-label="Previous photo"
                >
                  <FaChevronLeft size={16} aria-hidden />
                </button>
              )}

              <div
                className="relative w-full h-full"
                onClick={(e) => e.stopPropagation()}
                style={{ animation: "lightboxIn 280ms ease-out" }}
              >
                <Image
                  key={currentImage.id}
                  src={currentImage.src}
                  alt={currentImage.alt}
                  fill
                  sizes="100vw"
                  className="object-contain"
                  priority
                />
              </div>

              {visibleItems.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    showNext();
                  }}
                  className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  aria-label="Next photo"
                >
                  <FaChevronRight size={16} aria-hidden />
                </button>
              )}
            </div>

            {/* Caption bar */}
            <div className="relative z-30 p-5 sm:p-6 text-center shrink-0 pointer-events-none">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-accent/25 border border-accent/40 text-accent text-[10px] uppercase tracking-[0.18em] font-semibold mb-2">
                {CATEGORIES.find((c) => c.key === currentImage.category)
                  ?.label || currentImage.category}
              </span>
              <h3 className="font-heading text-lg sm:text-xl font-bold text-white leading-tight">
                {currentImage.title}
              </h3>
              <p className="text-gray-400 text-xs mt-1">
                {currentImage.date}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function GalleryCard({
  item,
  onClick,
}: {
  item: GalleryItem;
  onClick: () => void;
}) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const categoryLabel =
    CATEGORIES.find((c) => c.key === item.category)?.label || item.category;

  if (failed) return null;

  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative block w-full break-inside-avoid rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      aria-label={`View ${item.title}`}
    >
      {!loaded && (
        <div
          className="absolute inset-0 bg-gray-200 animate-pulse"
          aria-hidden
        />
      )}

      <Image
        src={item.src}
        alt={item.alt}
        width={600}
        height={800}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        className={`w-full h-auto object-cover transition-all duration-700 group-hover:scale-[1.04] ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-midnight/90 via-midnight/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-left">
        <div className="translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-accent/90 text-midnight text-[10px] uppercase tracking-[0.14em] font-semibold mb-2">
            {categoryLabel}
          </span>
          <p className="text-white text-sm font-semibold leading-tight">
            {item.title}
          </p>
        </div>
      </div>

      <div className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/95 backdrop-blur-md flex items-center justify-center text-primary opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
        <FaMagnifyingGlassPlus size={13} aria-hidden />
      </div>
    </button>
  );
}