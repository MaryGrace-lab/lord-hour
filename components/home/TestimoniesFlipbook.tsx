"use client";

import { useState } from "react";
import { FaChevronLeft, FaChevronRight, FaQuoteLeft } from "react-icons/fa";

/**
 * Sample testimonies (approved only). Replace with database data later.
 * Each object represents one page of the flipbook.
 */
const testimonies = [
  {
    id: 1,
    content:
      "God answered my prayer for healing. I am forever grateful to The Lord's Hour Ministry.",
    name: "Anonymous",
    location: "Benin City",
  },
  {
    id: 2,
    content:
      "Through the teachings, I have grown spiritually and now live a life of excellence.",
    name: "Bro. John",
    location: "Italy",
  },
  {
    id: 3,
    content:
      "The prayer meetings transformed my family. Praise God!",
    name: "Sis. Grace",
    location: "Benin City",
  },
  {
    id: 4,
    content:
      "I found hope and direction after attending the Bible study sessions.",
    name: "Mr. Daniel",
    location: "Italy",
  },
];

export function TestimoniesFlipbook() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevTestimony = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonies.length - 1 : prev - 1));
  };

  const nextTestimony = () => {
    setCurrentIndex((prev) => (prev === testimonies.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="py-12 bg-gray-100">
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-heading text-3xl md:text-4xl mb-8 text-primary">
          What God Has Done
        </h2>

        <div className="max-w-2xl mx-auto relative">
          <div className="perspective-1000">
            <div
              className="relative bg-white shadow-xl rounded-lg p-8 md:p-10 transition-transform duration-500 transform-gpu"
              style={{
                transformStyle: "preserve-3d",
                transform: `rotateY(0deg)`,
              }}
            >
              <FaQuoteLeft className="text-accent text-3xl mb-4 mx-auto" />

              <p className="text-gray-700 italic text-lg md:text-xl leading-relaxed mb-6">
                &ldquo;{testimonies[currentIndex].content}&rdquo;
              </p>

              <p className="font-semibold text-primary">
                — {testimonies[currentIndex].name}
              </p>
              <p className="text-sm text-gray-500">
                {testimonies[currentIndex].location}
              </p>

              <p className="text-xs text-gray-400 mt-4">
                {currentIndex + 1} / {testimonies.length}
              </p>
            </div>
          </div>

          <button
            onClick={prevTestimony}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
            aria-label="Previous testimony"
          >
            <FaChevronLeft className="text-primary text-xl" />
          </button>
          <button
            onClick={nextTestimony}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
            aria-label="Next testimony"
          >
            <FaChevronRight className="text-primary text-xl" />
          </button>
        </div>

        <p className="mt-6 text-sm text-gray-600">
          Have a testimony?{" "}
          <a href="/testimonies/submit" className="text-accent hover:underline">
            Share it with us
          </a>
        </p>
      </div>
    </section>
  );
}