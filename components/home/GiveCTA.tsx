import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FaHandHoldingHeart } from "react-icons/fa";

export function GiveCTA() {
  return (
    <section className="py-12 bg-gray-50 text-center">
      <div className="container mx-auto px-4">
        <FaHandHoldingHeart className="text-accent text-4xl mx-auto mb-4" />
        <h2 className="font-heading text-3xl md:text-4xl mb-4 text-primary">
          Support the Ministry
        </h2>
        <p className="text-gray-700 mb-8 max-w-2xl mx-auto">
          Your giving enables us to reach more souls and spread the gospel of Jesus Christ.
        </p>
        <Button asChild size="lg" variant="default" className="bg-primary text-white hover:bg-primary-light">
          <Link href="/give">Give Now</Link>
        </Button>
      </div>
    </section>
  );
}