import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { FaGraduationCap, FaBookOpen, FaUsers, FaGlobe, FaLock } from "react-icons/fa";

export const metadata: Metadata = {
  title: "School of the Spirit Bible College | The Lord's Hour Ministries",
  description:
    "Equipping Believers. Empowering Leaders. Expanding the Kingdom. Explore our theology and ministry training programs.",
};

export default function BibleCollegePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section with background */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1600&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="relative h-24 w-24 md:h-32 md:w-32 mx-auto mb-6">
            <Image
              src="/school-logo.jpeg" // Replace with actual school logo
              alt="School of the Spirit Bible College Logo"
              fill
              className="object-contain"
            />
          </div>
          <h1 className="font-heading text-4xl md:text-6xl font-bold text-white mb-4">
            School of the Spirit Bible College
          </h1>
          <p className="text-yellow-300 text-lg md:text-xl italic mb-6">
            Equipping Believers. Empowering Leaders. Expanding the Kingdom.
          </p>
          <p className="text-gray-200 max-w-2xl mx-auto mb-8">
            Are you ready to step into your God-given calling and lead with
            purpose? Our college is opening its doors this September 2026.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-primary text-white hover:bg-primary-light">
              <Link href="/contact">Enroll Now</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              <Link href="#academic-offerings">View Programs</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-6">
            Our Mission
          </h2>
          <p className="text-gray-700 leading-relaxed text-lg">
            At the core of our institution is a singular, unwavering mandate: to
            raise and equip believers for dynamic leadership in the family, the
            church, and field missions. We believe that true spiritual leadership
            starts in the home, strengthens the local congregation, and extends
            to the farthest corners of the earth. Our goal is to nurture
            passionate, Spirit-led individuals who are prepared to make a
            tangible kingdom impact wherever they are called.
          </p>
        </div>
      </section>

      {/* Academic Offerings */}
      <section id="academic-offerings" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary text-center mb-12">
            Academic Offerings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Ordinary Programs Card */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <FaBookOpen className="text-accent text-4xl mb-4" />
              <h3 className="font-heading text-2xl font-bold text-primary mb-4">
                Ordinary Programs
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Foundational certificate and diploma courses designed for
                everyday believers seeking to deepen their understanding of the
                Word, enhance their prayer lives, and apply biblical principles
                to daily living.
              </p>
            </div>
            {/* Degree Programs Card */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <FaGraduationCap className="text-accent text-4xl mb-4" />
              <h3 className="font-heading text-2xl font-bold text-primary mb-4">
                Degree Programs
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Comprehensive undergraduate and advanced academic tracks for
                those called to vocational ministry, specialized church
                leadership, or global field missions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary text-center mb-12">
            Why Choose Us?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <FaUsers className="text-accent text-4xl mx-auto mb-4" />
              <h3 className="font-heading text-xl font-bold text-primary mb-2">
                Holistic Leadership Training
              </h3>
              <p className="text-gray-600">
                We go beyond the pulpit, ensuring you are equipped with the wisdom
                to lead your family and community effectively.
              </p>
            </div>
            <div className="text-center">
              <FaGlobe className="text-accent text-4xl mx-auto mb-4" />
              <h3 className="font-heading text-xl font-bold text-primary mb-2">
                Spirit-Empowered Learning
              </h3>
              <p className="text-gray-600">
                Our curriculum marries rigorous biblical study with
                transformative, real-world spiritual application.
              </p>
            </div>
            <div className="text-center">
              <FaBookOpen className="text-accent text-4xl mx-auto mb-4" />
              <h3 className="font-heading text-xl font-bold text-primary mb-2">
                Mission-Minded Focus
              </h3>
              <p className="text-gray-600">
                From local outreach to international evangelism, our training is
                designed to launch laborers into the harvest fields.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Portal Login / CTA */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <FaLock className="text-yellow-300 text-4xl mx-auto mb-4" />
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            Student & Tutor Portal
          </h2>
          <p className="text-gray-200 max-w-2xl mx-auto mb-8">
            Access class notes, course materials, and resources. Log in to your
            account to continue your studies.
          </p>
          <Button asChild size="lg" className="bg-accent text-primary hover:bg-accent-light">
            <Link href="/bible-college/portal/login">Portal Login</Link>
          </Button>
        </div>
      </section>

      {/* Closing statement */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <p className="text-gray-700 text-lg leading-relaxed">
            Prepare to be challenged, transformed, and thoroughly equipped for
            the work of the ministry. Join our pioneering class this September
            2026 as we embark on a journey of faith, learning, and divine
            purpose.
          </p>
        </div>
      </section>
    </div>
  );
}