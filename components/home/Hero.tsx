"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const heroImages = [
  "/church-1.jpeg",
  "/church-2.jpeg",
  "/church-3.jpeg",
  "/church-4.jpeg",
  "/church-5.jpeg",
  "/church-6.jpeg",
  "/church-7.jpeg",
];

export function Hero() {
  // Track the index of the currently displayed image
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    // Change the background image every 6 seconds
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 6000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-[70vh] md:h-[80vh] lg:h-[90vh] overflow-hidden">
      {/* Background images with crossfade transition */}
      {heroImages.map((image, index) => (
        <div
          key={image}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
            index === currentImageIndex ? "opacity-100" : "opacity-0"
          }`}
          style={{ backgroundImage: `url(${image})` }}
        />
      ))}

      {/* Dark overlay to improve text readability */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content container */}
      <div className="relative z-10 container mx-auto px-4 h-full flex items-center justify-center text-center">
        <div className="max-w-4xl">
          <h1 className="font-heading text-4xl md:text-6xl font-bold text-white leading-tight mb-4">
            WELCOME TO THE LORD&apos;S <span className="text-accent">HOUR</span> MINISTRIES
            <span className="block text-2xl md:text-4xl mt-2">
              Liberation Centre
            </span>
          </h1>
          <p className="text-lg md:text-xl text-accent font-medium mb-4">
            WORSHIP WITH US TODAY
          </p>
          <p className="text-lg md:text-xl text-gray-200 mb-2">
            A People Prepared for His Coming
          </p>
          <p className="text-sm text-accent font-medium mb-8">Isaiah 42:6-7</p>
          <p className="text-base md:text-lg text-gray-200 max-w-3xl mx-auto mb-10">
            Experience God&apos;s presence. Grow in His Word. Live for His purpose.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" variant="default" className="bg-accent text-primary hover:bg-accent-light">
              <Link href="/contact">Join Us</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              <Link href="/media/live">Watch Live</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}