"use client";

import { useState } from "react";
import Image from "next/image";
import { FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";

/**
 * Generate array of 49 gallery images from local files.
 * Images are located in the public folder with names lord-hour-1.jpeg ... lord-hour-49.jpeg.
 * All images are assigned to the "All" category for now.
 * You can later edit the `category` for each item if needed.
 */
const galleryImages = Array.from({ length: 49 }, (_, i) => ({
  src: `/lord-hour-${i + 1}.jpeg`,
  alt: `Church photo ${i + 1}`,
  caption: `Church photo ${i + 1}`,
  category: "All",
}));

// Only "All" category is currently used.
const categories = ["All"];

export function GalleryClient() {
  // Active category filter (currently only "All")
  const [activeCategory, setActiveCategory] = useState("All");
  // Lightbox state (index of selected image, -1 means closed)
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  // Since all images have category "All", filteredImages equals galleryImages.
  const filteredImages =
    activeCategory === "All"
      ? galleryImages
      : galleryImages.filter((img) => img.category === activeCategory);

  // Lightbox navigation
  const showPrevious = () => {
    setLightboxIndex((prev) =>
      prev === 0 ? filteredImages.length - 1 : prev - 1
    );
  };

  const showNext = () => {
    setLightboxIndex((prev) =>
      prev === filteredImages.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <>
      {/* Category filter buttons (only "All" for now) */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === category
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Gallery grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredImages.map((image, index) => (
          <button
            key={image.src}
            onClick={() => setLightboxIndex(index)}
            className="group relative aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
            {/* Hover overlay with caption */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end justify-center">
              <p className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity pb-3">
                {image.caption}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxIndex >= 0 && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxIndex(-1)}
        >
          {/* Close button */}
          <button
            className="absolute top-4 right-4 text-white text-3xl hover:text-gray-300"
            onClick={() => setLightboxIndex(-1)}
            aria-label="Close lightbox"
          >
            <FaTimes />
          </button>

          {/* Previous arrow */}
          <button
            className="absolute left-4 text-white text-3xl hover:text-gray-300"
            onClick={(e) => {
              e.stopPropagation();
              showPrevious();
            }}
            aria-label="Previous image"
          >
            <FaChevronLeft />
          </button>

          {/* Current image */}
          <div className="relative w-full max-w-5xl h-[80vh]">
            <Image
              src={filteredImages[lightboxIndex].src}
              alt={filteredImages[lightboxIndex].alt}
              fill
              className="object-contain"
            />
          </div>

          {/* Next arrow */}
          <button
            className="absolute right-4 text-white text-3xl hover:text-gray-300"
            onClick={(e) => {
              e.stopPropagation();
              showNext();
            }}
            aria-label="Next image"
          >
            <FaChevronRight />
          </button>

          {/* Caption */}
          <div className="absolute bottom-6 left-0 right-0 text-center text-white text-lg font-medium">
            {filteredImages[lightboxIndex].caption}
          </div>
        </div>
      )}
    </>
  );
}