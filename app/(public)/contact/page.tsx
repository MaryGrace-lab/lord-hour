import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/ContactForm";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from "react-icons/fa";

export const metadata: Metadata = {
  title: "Contact Us | The Lord's Hour Ministries",
  description:
    "Get in touch with The Lord's Hour Ministries. Find our contact information, service times, and send us a message.",
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-6xl">
      {/* Page Header */}
      <header className="text-center mb-12">
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-4">
          Get in Touch
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          We would love to hear from you. Reach out to us for prayer, questions,
          or to plan a visit to one of our branches.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Contact Form – now first */}
        <div className="lg:col-span-3">
          <ContactForm />
        </div>

        {/* Contact Information Sidebar */}
        <div className="lg:col-span-2 space-y-6">
          {/* Nigeria Branch Card */}
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="font-heading text-xl font-bold text-primary mb-4">
              Nigeria Branch
            </h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <FaMapMarkerAlt className="text-accent mt-1 shrink-0" />
                <span>
                  Boundary Street, Off Egba Road, Benin City, Edo State, Nigeria
                </span>
              </li>
              <li className="flex items-start gap-2">
                <FaPhone className="text-accent mt-1 shrink-0" />
                <span>07085073850</span>
              </li>
              <li className="flex items-start gap-2">
                <FaEnvelope className="text-accent mt-1 shrink-0" />
                <span>Thelordshourministriesinc@gmail.com</span>
              </li>
            </ul>
          </section>

          {/* Italy Branch Card (Headquarters) */}
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="font-heading text-xl font-bold text-primary mb-4">
              Italy Branch (Headquarters)
            </h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <FaMapMarkerAlt className="text-accent mt-1 shrink-0" />
                <span>Via Cappi 26 Castelleone 26012 (C.R), Italy</span>
              </li>
              <li className="flex items-start gap-2">
                <FaPhone className="text-accent mt-1 shrink-0" />
                <span>+39 (please add phone)</span>
              </li>
              <li className="flex items-start gap-2">
                <FaEnvelope className="text-accent mt-1 shrink-0" />
                <span>Thelordshourministriesinc@gmail.com</span>
              </li>
            </ul>
          </section>

          {/* Service Times Quick Info */}
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="font-heading text-xl font-bold text-primary mb-4">
              Service Times
            </h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-center gap-2">
                <FaClock className="text-accent shrink-0" />
                <span>Sunday Worship: 9:30 AM (Nigeria) / 10:00 AM (Italy)</span>
              </li>
              <li className="flex items-center gap-2">
                <FaClock className="text-accent shrink-0" />
                <span>Bible Study: Wednesday 5:00 PM (Nigeria) / 6:00 PM (Italy)</span>
              </li>
              <li className="flex items-center gap-2">
                <FaClock className="text-accent shrink-0" />
                <span>Prayer Meeting: Friday 5:00 PM (Nigeria) / 6:00 PM (Italy)</span>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}