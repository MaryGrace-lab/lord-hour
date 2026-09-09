import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { branches } from "@/lib/branches";
import { FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";

export const metadata: Metadata = {
  title: "Branches | The Lord's Hour Ministries",
  description:
    "Find a Lord's Hour Ministries branch near you in Nigeria and Italy.",
};

export default function BranchesPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-6xl">
      {/* Page Header */}
      <header className="text-center mb-12">
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-4">
          Our Locations
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          The Lord&apos;s Hour Ministries is reaching the world from multiple
          locations. Find a branch near you and join us for worship.
        </p>
      </header>

      {/* Single grid with all branches – cards will be side by side on md+ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {branches.map((branch) => (
          <Link
            key={branch.slug}
            href={`/branches/${branch.slug}`}
            className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
          >
            {/* Branch image */}
            <div className="relative h-48 w-full">
              <Image
                src={branch.imageUrl || "/lord-hour-1.jpeg"}
                alt={branch.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            {/* Branch info */}
            <div className="p-6">
              <h3 className="font-heading text-xl font-bold text-primary mb-2">
                {branch.city}
              </h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p className="flex items-start gap-2">
                  <FaMapMarkerAlt className="text-accent mt-1 shrink-0" />
                  <span>{branch.address}</span>
                </p>
                {branch.phone && (
                  <p className="flex items-center gap-2">
                    <FaPhone className="text-accent shrink-0" />
                    <span>{branch.phone}</span>
                  </p>
                )}
                {branch.email && (
                  <p className="flex items-center gap-2">
                    <FaEnvelope className="text-accent shrink-0" />
                    <span>{branch.email}</span>
                  </p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}