import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function AboutPreview() {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="relative h-64 md:h-96 rounded-lg overflow-hidden shadow-md">
          <Image
            src="/pastor.jpeg" // Replace with actual image
            alt="The Lord's Hour Ministry pastor"
            fill
            style={{ objectFit: "cover" }}
          />
        </div>
        <div>
          <h2 className="font-heading text-3xl md:text-4xl mb-4 text-primary">
            Welcome to The Lord&apos;s Hour Ministry
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            The Lord&apos;s Hour Ministry International is a church with a divine mandate to liberate mankind from darkness into the marvelous light of Christ. Our first church was established in San Donato, Italy, in 2019, and we now have branches in Nigeria and beyond. We invite you to join us as we raise men of excellence for the Kingdom.
          </p>
          <Button asChild variant="default" className="bg-primary text-white hover:bg-primary-light">
            <Link href="/about">Learn More</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}