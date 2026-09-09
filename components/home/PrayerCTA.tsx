import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FaPrayingHands } from "react-icons/fa";

export function PrayerCTA() {
  return (
    <section className="py-12 bg-primary text-white text-center">
      <div className="container mx-auto px-4">
        <FaPrayingHands className="text-accent text-4xl mx-auto mb-4" />
        <h2 className="font-heading text-3xl md:text-4xl mb-4">Need Prayer?</h2>
        <p className="text-gray-200 mb-8 max-w-2xl mx-auto">
          Our prayer team is ready to stand with you. Submit a prayer request and we will pray for you.
        </p>
        <Button asChild size="lg" className="bg-accent text-primary hover:bg-accent-light">
          <Link href="/prayer-request">Request Prayer</Link>
        </Button>
      </div>
    </section>
  );
}