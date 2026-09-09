import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { FaChild, FaUsers, FaFemale, FaMale, FaGlobe } from "react-icons/fa";

const ministries = [
  { name: "Children's Ministry", icon: FaChild, slug: "children" },
  { name: "Youth Ministry", icon: FaUsers, slug: "youth" },
  { name: "Women's Ministry", icon: FaFemale, slug: "women" },
  { name: "Men's Ministry", icon: FaMale, slug: "men" },
  { name: "Evangelism", icon: FaGlobe, slug: "evangelism" },
];

export function MinistriesPreview() {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="font-heading text-3xl md:text-4xl text-center mb-8 text-primary">
          Our Ministries
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-5xl mx-auto">
          {ministries.map((ministry) => (
            <Link key={ministry.slug} href={`/ministries/${ministry.slug}`}>
              <Card className="border-0 shadow-md hover:shadow-lg transition-shadow h-full">
                <CardContent className="pt-6 text-center">
                  <ministry.icon className="text-primary mx-auto mb-3 text-3xl" />
                  <h3 className="font-medium text-sm md:text-base">{ministry.name}</h3>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}