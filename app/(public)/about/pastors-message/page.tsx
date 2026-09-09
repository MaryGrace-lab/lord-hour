import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Pastor's Message | The Lord's Hour Ministries",
  description:
    "A welcome message from Apostle Oghale B. Uwubiti, founder of The Lord's Hour Ministries.",
};

export default function PastorsMessagePage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-6xl">
      {/* Page Header */}
      <header className="mb-12 text-center">
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-4">
          Pastor&apos;s Message
        </h1>
      </header>

      {/* Two-column layout: image left, message right */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
        {/* Couple's Photo (left) */}
        <div className="md:col-span-2 flex justify-center md:justify-start">
          <div className="relative h-72 w-72 md:h-96 md:w-full max-w-sm rounded-lg overflow-hidden shadow-lg">
            <Image
              src="/pastor-couple.jpeg" // Replace with actual file name
              alt="Apostle Oghale B. Uwubiti and Rev. Abies Uwubiti Imarhia"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Message Content (right) */}
        <div className="md:col-span-3 bg-white rounded-lg shadow-md p-8 md:p-10">
          <p className="text-gray-700 leading-relaxed mb-6">
            Dear beloved,
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            Welcome to The Lord&apos;s Hour Ministries, a people prepared for His
            coming. It is our joy to have you visit with us, whether online or in
            person. Our ministry is built upon the mandate to liberate mankind
            from darkness into the marvellous light of Christ.
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            I encourage you to explore our site, learn more about our vision and
            mission, and discover how you can be part of what God is doing through
            this ministry. We would love to connect with you, pray with you, and
            help you grow in your walk with God.
          </p>
          <p className="text-gray-700 leading-relaxed">
            May the Lord bless you richly as you seek Him.
          </p>
          <p className="mt-8 font-semibold text-primary">
            In His service,
          </p>
          <p className="font-heading text-xl font-bold">
            Apostle Oghale B. Uwubiti
          </p>
          <p className="text-gray-600">Senior Pastor</p>
        </div>
      </div>
    </div>
  );
}