import type { Metadata } from "next";
import { GalleryClient } from "@/components/gallery/GalleryClient";

export const metadata: Metadata = {
  title: "Gallery | The Lord's Hour Ministries",
  description:
    "Explore photos from worship services, conferences, youth events, and more at The Lord's Hour Ministries.",
};

export default function GalleryPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-7xl">
      {/* Page Header */}
      <header className="text-center mb-12">
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-4">
          Gallery
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          A glimpse into the life of our ministry — worship, fellowship, and
          outreach moments captured for the glory of God.
        </p>
      </header>

      {/* Gallery grid with filtering and lightbox */}
      <GalleryClient />
    </div>
  );
}