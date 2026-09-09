import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { FaMapMarkerAlt } from "react-icons/fa";

const branches = [
  { name: "Benin City, Nigeria", slug: "benin-city" },
  { name: "Iwu, Nigeria", slug: "iwu" },
  { name: "San Donato, Italy", slug: "san-donato" },
];

export function BranchesPreview() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-heading text-3xl md:text-4xl mb-8 text-primary">
          Our Locations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {branches.map((branch) => (
            <Link key={branch.slug} href={`/branches/${branch.slug}`}>
              <Card className="border-0 shadow-md hover:shadow-lg transition-shadow h-full">
                <CardContent className="pt-6 text-center">
                  <FaMapMarkerAlt className="text-accent mx-auto mb-3 text-3xl" />
                  <h3 className="font-semibold">{branch.name}</h3>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}