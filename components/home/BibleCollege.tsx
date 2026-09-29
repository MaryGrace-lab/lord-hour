import Link from "next/link";
import Image from "next/image";
import {
  FaGraduationCap,
  FaBookOpen,
  FaUsers,
  FaClock,
  FaArrowRight,
} from "react-icons/fa";

const features = [
  {
    Icon: FaGraduationCap,
    label: "Certificate Programs",
    detail: "Earn a recognized credential",
  },
  {
    Icon: FaClock,
    label: "Flexible Options",
    detail: "Online & On-Campus",
  },
  {
    Icon: FaUsers,
    label: "Leadership Focused",
    detail: "Practical ministry training",
  },
];

export function BibleCollege() {
  return (
    <section
      className="relative py-16 sm:py-20 md:py-28 bg-midnight overflow-hidden"
      aria-labelledby="bible-college-heading"
    >
      <div className="absolute inset-0" aria-hidden>
        <Image
          src="/bible-library.jpg"
          alt=""
          fill
          sizes="100vw"
          quality={60}
          className="object-cover opacity-40"
          loading="lazy"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-midnight via-midnight/90 to-midnight/40" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-t from-midnight/60 via-transparent to-transparent" aria-hidden />

      <div className="relative w-full max-w-7xl mx-auto px-5 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shrink-0">
                <div className="relative w-11 h-11 sm:w-12 sm:h-12">
                  <Image
                    src="/school-logo.jpg"
                    alt="School of the Spirit Bible College"
                    fill
                    sizes="64px"
                    className="object-contain rounded-full"
                  />
                </div>
              </div>
              <div>
                <p className="text-accent text-[10px] sm:text-xs tracking-[0.28em] uppercase font-medium">
                  Now Accepting Applications
                </p>
                <p className="text-white/60 text-[11px] tracking-wide mt-0.5">
                  Inaugural Session · September 2026
                </p>
              </div>
            </div>

            <p className="text-accent text-xs tracking-[0.3em] uppercase mb-4 font-medium">
              School of the Spirit
            </p>

            <h2
              id="bible-college-heading"
              className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-bold text-white leading-[1.1] tracking-tight mb-6"
            >
              Bible College
              <span className="block text-accent/90 text-2xl sm:text-3xl md:text-4xl mt-2 font-normal italic">
                Equipping. Empowering. Expanding.
              </span>
            </h2>

            <div className="w-16 h-px bg-accent mb-6" aria-hidden />

            <p className="text-gray-200/90 text-base sm:text-lg leading-relaxed max-w-xl mb-8">
              A Bible college dedicated to raising spirit-filled leaders
              through sound theological education and practical ministry
              training — for the family, the church, and the mission field.
            </p>

            <ul className="flex flex-wrap gap-2.5 sm:gap-3 mb-10">
              {features.map(({ Icon, label, detail }) => (
                <li
                  key={label}
                  className="group flex items-center gap-2.5 bg-white/[0.06] hover:bg-white/[0.1] backdrop-blur-sm border border-white/10 hover:border-accent/40 rounded-full pl-2 pr-4 py-2 transition-all duration-300"
                >
                  <span className="w-7 h-7 rounded-full bg-accent/15 text-accent flex items-center justify-center shrink-0 group-hover:bg-accent/25 transition-colors">
                    <Icon size={12} aria-hidden />
                  </span>
                  <span className="flex flex-col leading-tight">
                    <span className="text-[12px] sm:text-[13px] font-semibold text-white">
                      {label}
                    </span>
                    <span className="text-[10px] text-white/50">
                      {detail}
                    </span>
                  </span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link
                href="/bible-college/apply"
                className="group inline-flex items-center justify-center gap-2 bg-accent text-midnight px-7 py-3.5 rounded-md font-semibold text-sm tracking-wide shadow-lg shadow-accent/20 hover:bg-accent-light hover:-translate-y-0.5 hover:shadow-xl hover:shadow-accent/30 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Apply Now
                <FaArrowRight
                  size={12}
                  className="group-hover:translate-x-1 transition-transform duration-200"
                  aria-hidden
                />
              </Link>
              <Link
                href="/bible-college"
                className="inline-flex items-center justify-center gap-2 border border-white/40 bg-white/5 backdrop-blur-sm text-white px-7 py-3.5 rounded-md font-semibold text-sm tracking-wide hover:bg-white/15 hover:border-white/60 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Visit College Site
              </Link>
            </div>

            {/* Why choose us — now visible on mobile too */}
            <div className="mt-12 lg:hidden">
              <div className="bg-white/[0.06] backdrop-blur-md rounded-2xl border border-white/10 p-6">
                <div className="h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent mb-6" aria-hidden />
                <p className="text-accent text-[10px] tracking-[0.28em] uppercase font-medium mb-4">
                  Why Choose Us
                </p>
                <ul className="space-y-4">
                  <FeatureItem
                    Icon={FaBookOpen}
                    title="Holistic Leadership"
                    description="Beyond the pulpit — wisdom to lead your family and community."
                  />
                  <FeatureItem
                    Icon={FaGraduationCap}
                    title="Spirit-Empowered Learning"
                    description="Rigorous biblical study with real-world application."
                  />
                  <FeatureItem
                    Icon={FaUsers}
                    title="Mission-Minded Focus"
                    description="From local outreach to international evangelism."
                  />
                </ul>
              </div>
            </div>
          </div>

          <div className="hidden lg:block lg:col-span-5 relative">
            <div className="relative">
              <div className="absolute -inset-4 bg-accent/10 rounded-3xl blur-3xl" aria-hidden />

              <div className="relative bg-white/[0.06] backdrop-blur-md rounded-2xl border border-white/10 p-8 shadow-2xl">
                <div className="h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent mb-8" aria-hidden />

                <p className="text-accent text-[10px] tracking-[0.28em] uppercase font-medium mb-6">
                  Why Choose Us
                </p>

                <ul className="space-y-6">
                  <FeatureItem
                    Icon={FaBookOpen}
                    title="Holistic Leadership"
                    description="Beyond the pulpit — wisdom to lead your family and community."
                  />
                  <FeatureItem
                    Icon={FaGraduationCap}
                    title="Spirit-Empowered Learning"
                    description="Rigorous biblical study with real-world application."
                  />
                  <FeatureItem
                    Icon={FaUsers}
                    title="Mission-Minded Focus"
                    description="From local outreach to international evangelism."
                  />
                </ul>

                <div className="mt-8 pt-6 border-t border-white/10">
                  <p className="text-white/40 text-[11px] uppercase tracking-[0.2em]">
                    Opening September 2026
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureItem({
  Icon,
  title,
  description,
}: {
  Icon: typeof FaBookOpen;
  title: string;
  description: string;
}) {
  return (
    <li className="flex items-start gap-4 group">
      <div className="shrink-0 w-9 h-9 rounded-lg bg-accent/15 text-accent flex items-center justify-center group-hover:bg-accent/25 transition-colors">
        <Icon size={14} aria-hidden />
      </div>
      <div className="min-w-0">
        <h3 className="text-sm font-semibold text-white leading-tight mb-1">
          {title}
        </h3>
        <p className="text-xs text-white/60 leading-relaxed">{description}</p>
      </div>
    </li>
  );
}