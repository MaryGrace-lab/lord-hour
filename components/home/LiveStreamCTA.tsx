import { Button } from "@/components/ui/button";
import { FaCircle } from "react-icons/fa";

export function LiveStreamCTA() {
  // Static for now, will be dynamic from CMS
  const isLive = false;
  const nextLiveTitle = "Sunday Worship Service";
  const nextLiveTime = "9:30 AM";

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4 text-center">
        {isLive ? (
          <>
            <div className="flex items-center justify-center gap-2 text-red-600 mb-2">
              <FaCircle size={12} className="animate-pulse" />
              <span className="font-bold uppercase tracking-wide">Live Now</span>
            </div>
            <h2 className="font-heading text-3xl md:text-4xl mb-4 text-primary">
              {nextLiveTitle}
            </h2>
            <Button asChild size="lg" className="bg-accent text-primary hover:bg-accent-light">
              <a href="/media/live">Watch Live</a>
            </Button>
          </>
        ) : (
          <>
            <h2 className="font-heading text-3xl md:text-4xl mb-2 text-primary">
              Next Live Service
            </h2>
            <p className="text-xl text-gray-700 mb-4">
              {nextLiveTitle} at {nextLiveTime}
            </p>
            <Button asChild size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
              <a href="/media/live">View Schedule</a>
            </Button>
          </>
        )}
      </div>
    </section>
  );
}