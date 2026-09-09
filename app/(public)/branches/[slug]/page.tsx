import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { branches } from "@/lib/branches";
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaUser, FaClock } from "react-icons/fa";

type Props = {
  params: Promise<{ slug: string }>;
};

// Generate metadata dynamically based on branch
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const branch = branches.find((b) => b.slug === slug);
  if (!branch) {
    return { title: "Branch Not Found" };
  }
  return {
    title: `${branch.name} | The Lord's Hour Ministries`,
    description: branch.description || `Visit ${branch.name} in ${branch.city}, ${branch.country}.`,
  };
}

// Generate static paths for all branches
export function generateStaticParams() {
  return branches.map((branch) => ({ slug: branch.slug }));
}

export default async function BranchDetailPage({ params }: Props) {
  const { slug } = await params;
  const branch = branches.find((b) => b.slug === slug);

  if (!branch) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-5xl">
      {/* Page Header */}
      <header className="text-center mb-12">
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-2">
          {branch.name}
        </h1>
        <p className="text-gray-600">
          {branch.city}, {branch.country}
        </p>
      </header>

      {/* Branch Image */}
      <div className="relative h-64 md:h-96 rounded-lg overflow-hidden shadow-md mb-10">
        <Image
          src={branch.imageUrl || "/lord-hour-1.jpeg"}
          alt={branch.name}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left column: contact & address */}
        <div className="space-y-6">
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="font-heading text-xl font-bold text-primary mb-4">
              Contact Information
            </h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <FaMapMarkerAlt className="text-accent mt-1 shrink-0" />
                <span>{branch.address}</span>
              </li>
              {branch.phone && (
                <li className="flex items-start gap-2">
                  <FaPhone className="text-accent mt-1 shrink-0" />
                  <span>{branch.phone}</span>
                </li>
              )}
              {branch.email && (
                <li className="flex items-start gap-2">
                  <FaEnvelope className="text-accent mt-1 shrink-0" />
                  <span>{branch.email}</span>
                </li>
              )}
            </ul>
          </section>

          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="font-heading text-xl font-bold text-primary mb-4">
              Leadership
            </h2>
            <ul className="space-y-3 text-gray-700">
              {branch.pastor && (
                <li className="flex items-start gap-2">
                  <FaUser className="text-accent mt-1 shrink-0" />
                  <span>
                    <strong>Branch Pastor:</strong> {branch.pastor}
                  </span>
                </li>
              )}
              {branch.assistantPastor && (
                <li className="flex items-start gap-2">
                  <FaUser className="text-accent mt-1 shrink-0" />
                  <span>
                    <strong>Assistant Pastor:</strong> {branch.assistantPastor}
                  </span>
                </li>
              )}
            </ul>
          </section>
        </div>

        {/* Middle column: service times */}
        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="font-heading text-xl font-bold text-primary mb-4">
            Service Times
          </h2>
          <ul className="space-y-3">
            {branch.serviceTimes.map((service) => (
              <li
                key={service.day}
                className="flex items-start gap-3 text-gray-700"
              >
                <FaClock className="text-accent mt-1 shrink-0" />
                <div>
                  <p className="font-medium">{service.day}</p>
                  <p className="text-accent font-heading">{service.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Right column: description */}
        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="font-heading text-xl font-bold text-primary mb-4">
            About This Branch
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {branch.description}
          </p>
        </section>
      </div>

      {/* Google Map */}
      {branch.mapEmbedUrl && (
        <div className="mt-10 rounded-lg overflow-hidden shadow-md">
          <iframe
            src={branch.mapEmbedUrl}
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            title={`Map of ${branch.name}`}
          ></iframe>
        </div>
      )}
    </div>
  );
}