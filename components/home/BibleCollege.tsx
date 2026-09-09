import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function BibleCollege() {
  return (
    <section className="relative py-12 md:py-16 overflow-hidden">
      {/* Background image from Unsplash – theology books */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1600&q=80')",
        }}
      />
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content container */}
      <div className="relative z-10 container mx-auto px-4 max-w-3xl text-center">
        {/* School logo – now larger */}
        <div className="relative h-24 w-24 md:h-28 md:w-28 mx-auto mb-6">
          <Image
            src="/school-logo.jpeg" // Replace with actual school logo file path
            alt="School of the Spirit Bible College Logo"
            fill
            className="object-contain"
            priority={false}
          />
        </div>

        {/* Short school name and tagline */}
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-2">
          School of the Spirit Bible College
        </h2>
        <p className="text-yellow-300 italic mb-6">
          Equipping Believers. Empowering Leaders. Expanding the Kingdom.
        </p>

        {/* Short description */}
        <p className="text-gray-200 leading-relaxed max-w-2xl mx-auto mb-8">
          A Bible college dedicated to raising spirit-filled leaders through sound theological
          education and practical ministry training.
        </p>

        {/* Call-to-action button */}
        <Button asChild variant="default" size="lg" className="bg-primary text-white hover:bg-primary-light">
          <Link href="/bible-college">
            Visit Website
          </Link>
        </Button>
      </div>
    </section>
  );
}