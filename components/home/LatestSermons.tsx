import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaPlayCircle, FaHeadphones } from "react-icons/fa";

const sermons = [
  {
    title: "The Power of Prayer",
    speaker: "Apostle Oghale B. Uwubiti",
    date: "Aug 16, 2026",
    slug: "power-of-prayer",
  },
  {
    title: "Walking in Excellence",
    speaker: "Rev. Abies Uwubiti Imarhia",
    date: "Aug 9, 2026",
    slug: "walking-in-excellence",
  },
  {
    title: "The Mandate",
    speaker: "Apostle Oghale B. Uwubiti",
    date: "Aug 2, 2026",
    slug: "the-mandate",
  },
];

export function LatestSermons() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="font-heading text-3xl md:text-4xl text-center mb-8 text-primary">
          Latest Sermons
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {sermons.map((sermon) => (
            <Card key={sermon.slug} className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-1">{sermon.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{sermon.speaker}</p>
                <p className="text-xs text-gray-500 mb-4">{sermon.date}</p>
                <div className="flex gap-2">
                  <Button asChild variant="outline" size="sm" className="flex-1">
                    <Link href={`/media/sermons/${sermon.slug}`}>
                      <FaPlayCircle className="mr-1" /> Watch
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="flex-1">
                    <Link href={`/media/sermons/${sermon.slug}`}>
                      <FaHeadphones className="mr-1" /> Listen
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center mt-8">
          <Button asChild variant="default" className="bg-primary text-white hover:bg-primary-light">
            <Link href="/media/sermons">All Sermons</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}