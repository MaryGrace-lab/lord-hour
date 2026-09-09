import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { FaNewspaper } from "react-icons/fa";

const news = [
  {
    title: "School of the Spirit Bible College Opens September 2026",
    date: "Aug 1, 2026",
    slug: "bible-college-launch",
  },
  {
    title: "Special Thanksgiving Service",
    date: "Jul 25, 2026",
    slug: "thanksgiving-service",
  },
];

export function NewsPreview() {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="font-heading text-3xl md:text-4xl text-center mb-8 text-primary">
          News & Announcements
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {news.map((item) => (
            <Link key={item.slug} href={`/news/${item.slug}`}>
              <Card className="border-0 shadow-md hover:shadow-lg transition-shadow h-full">
                <CardContent className="pt-6 flex items-start gap-3">
                  <FaNewspaper className="text-accent text-2xl shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-500">{item.date}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}