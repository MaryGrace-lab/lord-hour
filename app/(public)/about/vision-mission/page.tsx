import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vision & Mission | The Lord's Hour Ministries",
  description:
    "Discover the vision and mission of The Lord's Hour Ministries: to liberate mankind from darkness and raise men of excellence.",
};

export default function VisionMissionPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      {/* Page Header */}
      <header className="mb-12 text-center">
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-4">
          Vision & Mission
        </h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Vision Card */}
        <section className="bg-white rounded-lg shadow-md p-8 border-t-4 border-accent">
          <h2 className="font-heading text-2xl font-bold text-primary mb-4">
            Our Vision
          </h2>
          <p className="text-gray-700 leading-relaxed">
            To liberate mankind from the prison house of darkness into the
            marvelous light of Christ (Isaiah 42:6–7).
          </p>
        </section>

        {/* Mission Card */}
        <section className="bg-white rounded-lg shadow-md p-8 border-t-4 border-accent">
          <h2 className="font-heading text-2xl font-bold text-primary mb-4">
            Our Mission
          </h2>
          <p className="text-gray-700 leading-relaxed">
            To use the Word to raise men who will live exemplary lives full of
            excellence.
          </p>
        </section>
      </div>
    </div>
  );
}