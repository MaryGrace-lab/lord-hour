import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/forms/ContactForm";
import {
  FaLocationDot,
  FaPhone,
  FaEnvelope,
  FaClock,
  FaWhatsapp,
  FaDiamondTurnRight,
  FaChurch,
  FaGlobe,
} from "react-icons/fa6";

const PAGE_TITLE = "Contact Us";
const PAGE_DESCRIPTION =
  "Get in touch with The Lord's Hour Ministries. Find our contact information, service times, and send us a message.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/contact" },
  openGraph: {
    title: `${PAGE_TITLE} | The Lord's Hour Ministries`,
    description: PAGE_DESCRIPTION,
    url: "/contact",
  },
  twitter: {
    title: `${PAGE_TITLE} | The Lord's Hour Ministries`,
    description: PAGE_DESCRIPTION,
  },
};

const branches = [
  {
    id: "nigeria",
    name: "Nigeria Branch",
    flag: "🇳🇬",
    city: "Benin City",
    tag: "West Africa Time · WAT",
    address: "Boundary Street, Off Egba Road, Benin City, Edo State",
    phone: "07085073850",
    phoneHref: "tel:+2347085073850",
    email: "thelordshourministriesinc@gmail.com",
    directionsUrl:
      "https://www.google.com/maps/dir/?api=1&destination=Boundary+Street+Off+Egba+Road+Benin+City+Edo+State+Nigeria",
    services: [
      { day: "Sunday Worship", time: "9:30 AM" },
      { day: "Bible Study", time: "Wed · 5:00 PM" },
      { day: "Prayer Meeting", time: "Fri · 5:00 PM" },
    ],
    isHeadquarters: false,
  },
  {
    id: "italy",
    name: "Italy Branch",
    flag: "🇮🇹",
    city: "San Donato",
    tag: "Central European Time · CET",
    address: "Via Cappi 26 Castelleone 26012 (C.R)",
    phone: "+39 351 194 3365",
    phoneHref: "tel:+393511943365",
    email: "thelordshourministriesinc@gmail.com",
    directionsUrl:
      "https://www.google.com/maps/dir/?api=1&destination=Via+Cappi+26+Castelleone+26012+CR+Italy",
    services: [
      { day: "Sunday Worship", time: "10:00 AM" },
      { day: "Bible Study", time: "Wed · 6:00 PM" },
      { day: "Prayer Meeting", time: "Fri · 6:00 PM" },
    ],
    isHeadquarters: true,
  },
];

const WHATSAPP_NUMBER = "2347085073850";
const WHATSAPP_DISPLAY = "+234 708 507 3850";

export default function ContactPage() {
  const whatsappMessage = encodeURIComponent(
    "Hello, I would like to get in touch with The Lord's Hour Ministries."
  );
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`;

  return (
    <div className="bg-white">
      <section
        className="relative pt-24 md:pt-32 pb-12 md:pb-16 overflow-hidden"
        aria-labelledby="contact-heading"
      >
        <p
          className="absolute inset-x-0 top-16 md:top-24 text-center font-heading text-[6rem] sm:text-[9rem] md:text-[14rem] font-bold text-midnight/[0.03] select-none pointer-events-none leading-none tracking-tighter"
          aria-hidden="true"
        >
          CONNECT
        </p>

        <div
          className="pointer-events-none absolute -top-40 -right-40 w-96 h-96 rounded-full bg-accent/10 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-midnight/5 blur-3xl"
          aria-hidden
        />

        <div className="relative w-full max-w-3xl mx-auto px-5 sm:px-6 text-center">
          <p className="text-accent text-xs tracking-[0.3em] uppercase font-semibold mb-4">
            Get in Touch
          </p>
          <h1
            id="contact-heading"
            className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-primary leading-[1.05] mb-6"
          >
            Contact Us
          </h1>
          <div className="w-16 h-1 bg-accent rounded-full mx-auto mb-6" aria-hidden />
          <p className="text-gray-600 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            We would love to hear from you. Reach out to us for prayer,
            questions, or to plan a visit to one of our branches.
          </p>
        </div>
      </section>

      <section className="pb-16 md:pb-24">
        <div className="w-full max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10">
            <div className="lg:col-span-3">
              <ContactForm />
            </div>

            <div className="lg:col-span-2 space-y-6">
              {/* WhatsApp CTA */}
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#25D366] to-[#1ebe5b] p-6 shadow-[0_15px_40px_-15px_rgba(37,211,102,0.4)]">
                <div
                  className="pointer-events-none absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-2xl"
                  aria-hidden
                />
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4">
                    <FaWhatsapp className="text-white" size={22} aria-hidden />
                  </div>
                  <h2 className="font-heading text-lg font-bold text-white mb-1.5">
                    Chat with us on WhatsApp
                  </h2>
                  <p className="text-white/90 text-sm leading-relaxed mb-5">
                    Get quick answers or send a prayer request directly to our
                    team.
                  </p>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-white text-[#1ebe5b] px-5 py-3 rounded-md font-semibold text-sm tracking-wide hover:bg-gray-50 transition-colors shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    <FaWhatsapp size={16} aria-hidden />
                    Start Chat
                    <span className="sr-only"> (opens in new tab)</span>
                  </a>
                  <p className="text-[11px] text-white/80 mt-3">
                    {WHATSAPP_DISPLAY}
                  </p>
                </div>
              </div>

              {/* Branch cards */}
              {branches.map((branch) => (
                <article
                  key={branch.id}
                  className="relative bg-white rounded-2xl border border-gray-100 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_45px_-20px_rgba(0,0,0,0.12)] transition-shadow duration-300 overflow-hidden"
                >
                  <div
                    className="h-1 bg-gradient-to-r from-accent/30 via-accent to-accent/30"
                    aria-hidden
                  />

                  <div className="p-6">
                    <div className="flex items-start justify-between gap-3 mb-5">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl" aria-hidden="true">
                          {branch.flag}
                        </span>
                        <div>
                          <h3 className="font-heading text-lg font-bold text-primary leading-tight">
                            {branch.name}
                          </h3>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {branch.city}
                          </p>
                        </div>
                      </div>
                      {branch.isHeadquarters && (
                        <span className="shrink-0 px-2.5 py-1 rounded-full bg-accent text-midnight text-[10px] font-bold uppercase tracking-[0.14em]">
                          HQ
                        </span>
                      )}
                    </div>

                    <ul className="space-y-3 mb-5">
                      <li className="flex items-start gap-3">
                        <FaLocationDot
                          className="text-accent shrink-0 mt-0.5"
                          size={13}
                          aria-hidden
                        />
                        <span className="text-sm text-gray-700 leading-snug">
                          {branch.address}
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <FaPhone
                          className="text-accent shrink-0 mt-0.5"
                          size={12}
                          aria-hidden
                        />
                        <a
                          href={branch.phoneHref}
                          className="text-sm text-gray-700 hover:text-accent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                        >
                          {branch.phone}
                        </a>
                      </li>
                      <li className="flex items-start gap-3">
                        <FaEnvelope
                          className="text-accent shrink-0 mt-0.5"
                          size={12}
                          aria-hidden
                        />
                        <a
                          href={`mailto:${branch.email}`}
                          className="text-sm text-gray-700 hover:text-accent transition-colors break-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                        >
                          {branch.email}
                        </a>
                      </li>
                    </ul>

                    <div className="bg-gray-50 rounded-xl p-4 mb-5">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-[10px] uppercase tracking-[0.16em] font-bold text-gray-500 flex items-center gap-1.5">
                          <FaClock size={10} className="text-accent" aria-hidden />
                          Service Times
                        </p>
                        <span className="text-[9px] uppercase tracking-[0.14em] font-semibold text-gray-400">
                          {branch.tag}
                        </span>
                      </div>
                      <ul className="space-y-2">
                        {branch.services.map((s) => (
                          <li
                            key={s.day}
                            className="flex items-center justify-between text-sm"
                          >
                            <span className="text-gray-700">{s.day}</span>
                            <span className="font-semibold text-primary">
                              {s.time}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <a
                      href={branch.directionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 w-full bg-primary text-white px-4 py-2.5 rounded-md text-xs font-semibold tracking-wide hover:bg-primary-light transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      <FaDiamondTurnRight size={11} aria-hidden />
                      Get Directions
                      <span className="sr-only"> (opens in new tab)</span>
                    </a>
                  </div>
                </article>
              ))}

              <div className="bg-gray-50 rounded-2xl border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-accent/15 text-accent flex items-center justify-center shrink-0">
                    <FaChurch size={16} aria-hidden />
                  </div>
                  <div>
                    <h3 className="font-heading text-sm font-bold text-primary leading-tight">
                      Plan a Visit
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Join us any Sunday
                    </p>
                  </div>
                </div>
                <Link
                  href="/branches"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-accent hover:gap-2.5 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                >
                  <FaGlobe size={11} aria-hidden />
                  View all branches
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}