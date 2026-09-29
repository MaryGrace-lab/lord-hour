import Link from "next/link";
import Image from "next/image";
import {
  FaLocationDot,
  FaPhone,
  FaEnvelope,
  FaArrowRight,
} from "react-icons/fa6";

// Only links to routes that exist.
const quickLinks: { name: string; href: string }[] = [
  { name: "About Us", href: "/about" },
  { name: "Bible College", href: "/bible-college" },
  { name: "Testimonies", href: "/testimonies" },
  { name: "Branches", href: "/branches" },
  { name: "Give", href: "/give" },
];

const legalLinks: { name: string; href: string }[] = [
  { name: "Contact", href: "/contact" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative text-white overflow-hidden">
      <div className="relative bg-gradient-to-b from-midnight via-[#0a1330] to-[#050b1e]">
        <div className="h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

        <div className="pointer-events-none absolute top-0 -left-40 w-96 h-96 rounded-full bg-accent/5 blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute bottom-0 -right-40 w-96 h-96 rounded-full bg-accent/5 blur-3xl" aria-hidden />

        <div className="relative w-full max-w-7xl mx-auto px-5 sm:px-6 py-14 md:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-5">
              <div className="flex items-center gap-3 mb-5">
                <div className="relative w-12 h-12 rounded-full bg-white/5 border border-white/10 p-1.5 shrink-0">
                  <div className="relative w-full h-full">
                    <Image
                      src="/church-logo.jpg"
                      alt="The Lord's Hour Ministries Logo"
                      fill
                      sizes="48px"
                      className="object-contain rounded-full"
                    />
                  </div>
                </div>
                <div className="min-w-0">
                  <p className="font-heading text-base font-bold tracking-tight leading-tight">
                    THE LORD&apos;S{" "}
                    <span className="text-accent">HOUR</span> MINISTRIES
                  </p>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-gray-400 mt-0.5">
                    Liberation Centre
                  </p>
                </div>
              </div>

              <p className="text-gray-300/90 text-sm leading-relaxed mb-6 max-w-sm">
                A people prepared for His coming. Liberating mankind from the
                prison house of darkness into the marvelous light of Christ
                (Isaiah 42:6–7).
              </p>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5">
                <span className="text-sm" aria-hidden="true">
                  🇳🇬
                </span>
                <span className="text-gray-300 text-xs">Nigeria</span>
                <span className="text-gray-500 text-xs">•</span>
                <span className="text-sm" aria-hidden="true">
                  🇮🇹
                </span>
                <span className="text-gray-300 text-xs">Italy</span>
              </div>
            </div>

            {/* Quick Links */}
            <nav aria-label="Footer quick links" className="lg:col-span-3">
              <h2 className="font-heading text-sm font-semibold text-white mb-5 uppercase tracking-[0.16em]">
                Quick Links
              </h2>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-2 text-sm text-gray-400 hover:text-accent transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
                    >
                      <span className="w-0 group-hover:w-3 overflow-hidden transition-all duration-300">
                        <FaArrowRight
                          size={10}
                          className="text-accent"
                          aria-hidden
                        />
                      </span>
                      <span>{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Contact */}
            <div className="lg:col-span-4">
              <h2 className="font-heading text-sm font-semibold text-white mb-5 uppercase tracking-[0.16em]">
                Contact
              </h2>
              <ul className="space-y-4">
                <ContactRow
                  Icon={FaPhone}
                  label="Nigeria"
                  value="+234 708 507 3850"
                  href="tel:+2347085073850"
                />
                <ContactRow
                  Icon={FaEnvelope}
                  label="Email"
                  value="thelordshourministriesinc@gmail.com"
                  href="mailto:thelordshourministriesinc@gmail.com"
                  breakAll
                />
                <ContactRow
                  Icon={FaLocationDot}
                  label="Nigeria"
                  value="Boundary Street, Off Egba Road, Benin City, Edo State"
                />
                <ContactRow
                  Icon={FaLocationDot}
                  label="Italy"
                  value="Via Cappi 26 Castelleone 26012 (C.R)"
                />
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="relative border-t border-white/5">
          <div className="w-full max-w-7xl mx-auto px-5 sm:px-6 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-gray-500 text-xs text-center md:text-left">
                © {currentYear} The Lord&apos;s Hour Ministries. All rights
                reserved.
              </p>

              <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
                {legalLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-xs text-gray-500 hover:text-accent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function ContactRow({
  Icon,
  label,
  value,
  href,
  breakAll = false,
}: {
  Icon: typeof FaPhone;
  label: string;
  value: string;
  href?: string;
  breakAll?: boolean;
}) {
  const content = (
    <div className="flex items-start gap-3 group">
      <div className="shrink-0 w-9 h-9 rounded-full bg-accent/15 text-accent flex items-center justify-center group-hover:bg-accent group-hover:text-midnight transition-colors duration-200">
        <Icon size={13} aria-hidden />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] uppercase tracking-[0.18em] text-gray-500 mb-0.5">
          {label}
        </p>
        <p
          className={`text-sm text-gray-200 leading-snug ${
            breakAll ? "break-all" : ""
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );

  if (href) {
    return (
      <li>
        <a
          href={href}
          className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
        >
          {content}
        </a>
      </li>
    );
  }

  return <li>{content}</li>;
}