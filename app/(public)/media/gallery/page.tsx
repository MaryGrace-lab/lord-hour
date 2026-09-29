import type { Metadata } from "next";
import { GalleryClient } from "@/components/gallery/GalleryClient";

const PAGE_TITLE = "Gallery";
const PAGE_DESCRIPTION =
  "Explore moments from worship services, youth events, outreach, and special occasions at The Lord's Hour Ministries.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/media/gallery" },
  openGraph: {
    title: `${PAGE_TITLE} | The Lord's Hour Ministries`,
    description: PAGE_DESCRIPTION,
    url: "/media/gallery",
  },
  twitter: {
    title: `${PAGE_TITLE} | The Lord's Hour Ministries`,
    description: PAGE_DESCRIPTION,
  },
};

export default function GalleryPage() {
  return (
    <div className="bg-white">
      <section
        className="relative pt-24 md:pt-32 pb-12 md:pb-16 overflow-hidden"
        aria-labelledby="gallery-heading"
      >
        <p
          className="absolute inset-x-0 top-16 md:top-24 text-center font-heading text-[6rem] sm:text-[9rem] md:text-[14rem] font-bold text-midnight/[0.03] select-none pointer-events-none leading-none tracking-tighter"
          aria-hidden="true"
        >
          MOMENTS
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
            Media
          </p>
          <h1
            id="gallery-heading"
            className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-primary leading-[1.05] mb-6"
          >
            Gallery
          </h1>
          <div className="w-16 h-1 bg-accent rounded-full mx-auto mb-6" aria-hidden />
          <p className="text-gray-600 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            A glimpse into the life of our ministry — worship, fellowship,
            outreach, and moments captured for the glory of God.
          </p>
        </div>
      </section>

      <section className="pb-16 md:pb-24">
        <div className="w-full max-w-7xl mx-auto px-5 sm:px-6">
          <GalleryClient />
        </div>
      </section>
    </div>
  );
}