import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leadership | The Lord's Hour Ministries",
  description:
    "Meet the leadership team of The Lord's Hour Ministries, led by Apostle Oghale B. Uwubiti.",
};

// Temporary leader data – replace with database queries later
const leaders = [
  {
    name: "Apostle Oghale B. Uwubiti",
    title: "Senior Pastor / Founder",
    image: "/apostle-oghale.jpeg", // Replace with actual image path
    bio: "Apostle Oghale is the founder and senior pastor of The Lord's Hour Ministries International. He received the divine mandate in 2015 and oversees the global vision of the ministry.",
  },
  {
    name: "Rev. Abies Uwubiti Imarhia",
    title: "Co-Pastor",
    image: "/rev-abies.jpeg",
    bio: "Rev. Abies partners with Apostle Oghale in leading the ministry. She plays a key role in pastoral care and the spiritual development of the church.",
  },
  {
    name: "Pastor Martins Igbodo",
    title: "Branch Pastor – Nigeria",
    image: "/images/pastor-martins.jpg",
    bio: "Pastor Martins serves as the branch pastor for our Nigerian church, providing leadership and shepherding to the congregation.",
  },
  {
    name: "Minister Stanley Agbai",
    title: "Branch Assistant – Nigeria",
    image: "/images/min-stanley.jpg",
    bio: "Minister Stanley assists the branch pastor in the day-to-day operations and ministry of the Nigerian branch.",
  },
];

export default function LeadershipPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-6xl">
      {/* Page Header */}
      <header className="mb-12 text-center">
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-4">
          Administration / Leadership
        </h1>
        <p className="text-gray-600">
          Called to lead, equipped to serve.
        </p>
      </header>

      {/* Leadership Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {leaders.map((leader) => (
          <div
            key={leader.name}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Leader Image */}
            <div className="relative h-64 w-full">
              <Image
                src={leader.image}
                alt={leader.name}
                fill
                className="object-cover"
              />
            </div>
            {/* Leader Info */}
            <div className="p-5">
              <h2 className="font-heading text-xl font-bold text-primary">
                {leader.name}
              </h2>
              <p className="text-accent font-medium mb-2">{leader.title}</p>
              <p className="text-gray-600 text-sm leading-relaxed">
                {leader.bio}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}