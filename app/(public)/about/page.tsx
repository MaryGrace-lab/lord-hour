import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our History | The Lord's Hour Ministries",
  description:
    "Learn about the history of The Lord's Hour Ministries, from its divine mandate in 2015 to its international presence today.",
};

export default function AboutHistoryPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      {/* Page Header */}
      <header className="mb-12 text-center">
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-4">
          Our History
        </h1>
        <p className="text-gray-600 italic">
          The journey of The Lord&apos;s Hour Ministries
        </p>
      </header>

      {/* History Content */}
      <div className="space-y-6 text-gray-700 leading-relaxed">
        <p>
          The mandate for The Lord&apos;s Hour Ministry International was given to
          Apostle Oghale B. Uwubiti in 2015 through divine consultation. Further
          consultations through prayer were made to seek ministerial guidance on
          when, where, and how.
        </p>
        <p>
          The answers regarding when and where soon became clear. This led to the
          creation of our first church in San Donato, Italy, on August 11, 2019.
          Today, this location serves as our international headquarters and is
          headed by Apostle Oghale B. Uwubiti, alongside his wife, Rev. Abies
          Uwubiti Imarhia.
        </p>
        <p>
          In 2020, the vision for a church in Nigeria came from God through his
          wife. This resulted in the establishment of this church—the great
          Lord&apos;s Hour Ministry—which became our first local branch.
          Subsequently, the Iwu church was also created. Today, we have churches
          both locally and internationally, all to the glory of God.
        </p>
        <p>
          The Lord&apos;s Hour Ministry has never run dry and has always operated in
          excellence. Yes, this ministry has raised men of great excellence!
        </p>
      </div>

      {/* Optional CTA */}
      <div className="mt-10 text-center">
        <a
          href="/about/vision-mission"
          className="inline-block bg-primary text-white px-6 py-3 rounded-md hover:bg-primary-light transition-colors"
        >
          Read Our Vision & Mission
        </a>
      </div>
    </div>
  );
}