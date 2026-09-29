"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  FaBookBible,
  FaGraduationCap,
  FaCalendarDays,
  FaLaptopCode,
  FaArrowRight,
  FaCircleCheck,
  FaFileLines,
  FaUserPlus,
  FaClipboardCheck,
  FaAward,
  FaSchool,
  FaUsers,
  FaRightToBracket,
} from "react-icons/fa6";

type Program = {
  id: string;
  Icon: typeof FaGraduationCap;
  title: string;
  duration: string;
  description: string;
  accent: string;
  iconBg: string;
  iconFg: string;
};

type AdmissionStep = {
  step: number;
  Icon: typeof FaUserPlus;
  title: string;
  description: string;
};

const programs: Program[] = [
  {
    id: "diploma",
    Icon: FaGraduationCap,
    title: "Diploma in Ministry",
    duration: "2 Years · Full Program",
    description:
      "A comprehensive track for those called to vocational ministry — covering theology, pastoral care, and practical leadership.",
    accent: "from-accent/25",
    iconBg: "bg-accent/15",
    iconFg: "text-accent",
  },
  {
    id: "certificate",
    Icon: FaBookBible,
    title: "Certificate in Biblical Studies",
    duration: "1 Year · Foundational",
    description:
      "Deepen your understanding of Scripture — ideal for everyday believers who want to know the Word and live it well.",
    accent: "from-blue-500/20",
    iconBg: "bg-blue-50",
    iconFg: "text-blue-600",
  },
  {
    id: "leadership",
    Icon: FaUsers,
    title: "Leadership Track",
    duration: "18 Months · Advanced",
    description:
      "For emerging leaders ready to shepherd families, congregations, and mission fields with wisdom and excellence.",
    accent: "from-purple-500/20",
    iconBg: "bg-purple-50",
    iconFg: "text-purple-600",
  },
];

const admissionSteps: AdmissionStep[] = [
  {
    step: 1,
    Icon: FaFileLines,
    title: "Submit Application",
    description:
      "Fill in the online application form with your details and programme of interest.",
  },
  {
    step: 2,
    Icon: FaClipboardCheck,
    title: "Application Review",
    description:
      "Our admissions team reviews your application and contacts you with next steps.",
  },
  {
    step: 3,
    Icon: FaUserPlus,
    title: "Account Creation",
    description:
      "Once approved, we create your student account and email you an activation link.",
  },
  {
    step: 4,
    Icon: FaAward,
    title: "Begin Learning",
    description:
      "Set your password, log in, and start your journey in the School of the Spirit.",
  },
];

/**
 * Fades + slides an element in when it scrolls into view.
 * Respects prefers-reduced-motion.
 */
function useReveal() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Skip animation for users who prefer reduced motion.
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        transitionDelay: `${delay}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transitionProperty: "opacity, transform",
        transitionDuration: "700ms",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {children}
    </div>
  );
}

export function BibleCollegeContent() {
  return (
    <div className="bg-white">
      {/* HERO */}
      <section
        className="relative min-h-[90vh] flex items-center overflow-hidden"
        aria-labelledby="bible-college-hero-heading"
      >
        <div className="absolute inset-0" aria-hidden>
          <Image
            src="/bible-library.jpg"
            alt=""
            fill
            sizes="100vw"
            quality={70}
            priority
            className="object-cover"
          />
        </div>

        <div
          className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/90 to-midnight/70"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-midnight/80 via-midnight/40 to-transparent"
          aria-hidden
        />

        <div className="relative w-full max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="relative">
                <span
                  className="absolute inset-0 rounded-full bg-accent/30 blur-lg opacity-70"
                  aria-hidden="true"
                />
                <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/20 p-2 flex items-center justify-center">
                  <div className="relative w-full h-full">
                    <Image
                      src="/school-logo.jpg"
                      alt="School of the Spirit Bible College"
                      fill
                      sizes="80px"
                      className="object-contain rounded-full"
                      priority
                    />
                  </div>
                </div>
              </div>
              <div>
                <p className="text-accent text-[10px] md:text-xs tracking-[0.28em] uppercase font-semibold">
                  Inaugural Session
                </p>
                <p className="text-white/70 text-[11px] tracking-wide mt-0.5">
                  Opening September 2026
                </p>
              </div>
            </div>

            <p className="text-accent text-xs tracking-[0.3em] uppercase font-semibold mb-4">
              The Lord&apos;s Hour Ministries
            </p>

            <h1
              id="bible-college-hero-heading"
              className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight mb-5"
            >
              School of the Spirit
              <span className="block text-accent text-3xl sm:text-4xl md:text-5xl mt-3 italic font-normal">
                Bible College
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-200 italic mb-6">
              Equipping Believers. Empowering Leaders. Expanding the Kingdom.
            </p>

            <div className="w-16 h-1 bg-accent rounded-full mb-6" aria-hidden />

            <p className="text-base md:text-lg text-gray-300 leading-relaxed max-w-2xl mb-10">
              Are you ready to step into your God-given calling and lead with
              purpose? Our college is opening its doors this September 2026 —
              raising spirit-filled leaders through sound theological
              education and practical ministry training.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-5">
              <Link
                href="/bible-college/apply"
                className="group inline-flex items-center justify-center gap-2 bg-accent text-midnight px-8 py-4 rounded-md font-semibold text-sm tracking-wide shadow-lg shadow-accent/25 hover:bg-accent-light hover:-translate-y-0.5 hover:shadow-xl hover:shadow-accent/35 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Apply for September 2026
                <FaArrowRight
                  size={12}
                  className="group-hover:translate-x-1 transition-transform duration-200"
                  aria-hidden
                />
              </Link>
              <Link
                href="#programs"
                className="inline-flex items-center justify-center gap-2 border border-white/40 bg-white/5 backdrop-blur-md text-white px-8 py-4 rounded-md font-semibold text-sm tracking-wide hover:bg-white/15 hover:border-white/60 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                View Programs
              </Link>
            </div>

            <Link
              href="/bible-college/portal/login"
              className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-accent transition-colors mb-14 group focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
            >
              <FaRightToBracket size={12} aria-hidden />
              <span className="border-b border-white/20 group-hover:border-accent pb-0.5 transition-colors">
                Already a student? Sign in to the Student Portal
              </span>
            </Link>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-2xl">
              <FeatureBadge
                Icon={FaBookBible}
                label="Theological & Practical"
                detail="Sound biblical education"
              />
              <FeatureBadge
                Icon={FaCalendarDays}
                label="Next Cohort"
                detail="September 2026"
              />
              <FeatureBadge
                Icon={FaLaptopCode}
                label="Flexible Study"
                detail="Online & On-Campus"
              />
            </div>
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section className="py-16 md:py-24 bg-white">
        <div className="w-full max-w-4xl mx-auto px-5 sm:px-6 text-center">
          <p className="text-accent text-xs tracking-[0.3em] uppercase font-semibold mb-4">
            Our Mission
          </p>
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl text-primary leading-tight mb-6">
            Raising Spirit-Filled Leaders
          </h2>
          <div className="w-12 h-1 bg-accent rounded-full mx-auto mb-8" aria-hidden />
          <p className="text-gray-700 text-base md:text-lg leading-relaxed">
            At the core of our institution is a singular, unwavering mandate:
            to raise and equip believers for dynamic leadership in the family,
            the church, and field missions. We believe that true spiritual
            leadership starts in the home, strengthens the local congregation,
            and extends to the farthest corners of the earth.
          </p>
        </div>
      </section>

      {/* PROGRAMS */}
      <section
        id="programs"
        className="py-16 md:py-24 bg-gray-50 border-y border-gray-100"
      >
        <div className="w-full max-w-6xl mx-auto px-5 sm:px-6">
          <div className="text-center mb-12 md:mb-16">
            <p className="text-accent text-xs tracking-[0.3em] uppercase font-semibold mb-3">
              Academic Programs
            </p>
            <h2 className="font-heading text-3xl md:text-4xl text-primary mb-3">
              Choose Your Path
            </h2>
            <div className="w-12 h-1 bg-accent rounded-full mx-auto" aria-hidden />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {programs.map((program, i) => {
              const Icon = program.Icon;
              return (
                <Reveal key={program.id} delay={i * 120}>
                  <div className="group relative h-full bg-white rounded-2xl border border-gray-100 p-7 md:p-8 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.08)] hover:shadow-[0_25px_50px_-20px_rgba(0,0,0,0.15)] hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">
                    <div
                      className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${program.accent} to-transparent`}
                      aria-hidden
                    />
                    <div
                      className={`w-14 h-14 rounded-2xl ${program.iconBg} ${program.iconFg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon size={22} aria-hidden />
                    </div>
                    <h3 className="font-heading text-xl md:text-2xl font-bold text-primary leading-tight mb-2">
                      {program.title}
                    </h3>
                    <p className="text-accent text-xs font-semibold uppercase tracking-[0.14em] mb-4">
                      {program.duration}
                    </p>
                    <p className="text-gray-600 leading-relaxed text-sm md:text-base flex-1">
                      {program.description}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ADMISSIONS */}
      <section className="py-16 md:py-24 bg-white">
        <div className="w-full max-w-6xl mx-auto px-5 sm:px-6">
          <div className="text-center mb-12 md:mb-16">
            <p className="text-accent text-xs tracking-[0.3em] uppercase font-semibold mb-3">
              Admissions
            </p>
            <h2 className="font-heading text-3xl md:text-4xl text-primary mb-3">
              How to Enroll
            </h2>
            <div className="w-12 h-1 bg-accent rounded-full mx-auto" aria-hidden />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-6 relative">
            <div
              className="hidden lg:block absolute top-[42px] left-[12%] right-[12%] h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent"
              aria-hidden="true"
            />

            {admissionSteps.map((step, i) => {
              const Icon = step.Icon;
              return (
                <Reveal key={step.step} delay={i * 100} className="relative text-center">
                  <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-white border-2 border-accent/30 mb-5 z-10 shadow-md">
                    <Icon size={26} className="text-accent" aria-hidden />
                    <span className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-accent text-midnight text-xs font-bold flex items-center justify-center shadow">
                      {step.step}
                    </span>
                  </div>
                  <h3 className="font-heading text-lg font-bold text-primary mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed max-w-xs mx-auto">
                    {step.description}
                  </p>
                </Reveal>
              );
            })}
          </div>

          <div className="mt-14 md:mt-16 bg-gray-50 rounded-2xl border border-gray-100 p-6 sm:p-8 max-w-3xl mx-auto">
            <h3 className="font-heading text-xl font-bold text-primary mb-5 flex items-center gap-2">
              <FaSchool className="text-accent" size={18} aria-hidden />
              Admission Requirements
            </h3>
            <ul className="space-y-3">
              {[
                "A personal relationship with Jesus Christ and a hunger for the Word.",
                "A teachable heart — open to the leading of the Holy Spirit.",
                "Basic literacy to engage with written materials and assignments.",
                "Reliable internet access for online learners (Wi-Fi or mobile data).",
                "Commitment to complete the programme with excellence.",
              ].map((req) => (
                <li key={req} className="flex items-start gap-3">
                  <FaCircleCheck
                    className="text-accent shrink-0 mt-0.5"
                    size={14}
                    aria-hidden
                  />
                  <span className="text-gray-700 text-sm leading-relaxed">
                    {req}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-midnight via-[#0a1330] to-[#050b1e] relative overflow-hidden">
        <div
          className="pointer-events-none absolute -top-40 -right-40 w-96 h-96 rounded-full bg-accent/15 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-accent/10 blur-3xl"
          aria-hidden
        />

        <div className="relative w-full max-w-3xl mx-auto px-5 sm:px-6 text-center">
          <p className="text-accent text-xs tracking-[0.3em] uppercase font-semibold mb-4">
            Your Next Step
          </p>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-white leading-tight mb-6">
            Prepare to be challenged, transformed &amp; equipped
          </h2>
          <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-10">
            Join our pioneering class this September 2026 as we embark on a
            journey of faith, learning, and divine purpose.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-5">
            <Link
              href="/bible-college/apply"
              className="group inline-flex items-center justify-center gap-2 bg-accent text-midnight px-8 py-4 rounded-md font-semibold text-sm tracking-wide shadow-lg shadow-accent/25 hover:bg-accent-light hover:-translate-y-0.5 hover:shadow-xl hover:shadow-accent/35 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Apply Now
              <FaArrowRight
                size={12}
                className="group-hover:translate-x-1 transition-transform duration-200"
                aria-hidden
              />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 border border-white/40 bg-white/5 backdrop-blur-md text-white px-8 py-4 rounded-md font-semibold text-sm tracking-wide hover:bg-white/15 hover:border-white/60 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Contact Admissions
            </Link>
          </div>

          <Link
            href="/bible-college/portal/login"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-accent transition-colors group focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
          >
            <FaRightToBracket size={12} aria-hidden />
            <span className="border-b border-white/20 group-hover:border-accent pb-0.5 transition-colors">
              Student Login
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}

function FeatureBadge({
  Icon,
  label,
  detail,
}: {
  Icon: typeof FaBookBible;
  label: string;
  detail: string;
}) {
  return (
    <div className="flex items-center gap-3 bg-white/[0.08] backdrop-blur-md border border-white/15 rounded-xl px-4 py-3 hover:bg-white/[0.12] hover:border-accent/40 transition-all duration-300">
      <div className="w-9 h-9 rounded-lg bg-accent/15 text-accent flex items-center justify-center shrink-0">
        <Icon size={14} aria-hidden />
      </div>
      <div className="min-w-0">
        <p className="text-[12px] font-semibold text-white leading-tight truncate">
          {label}
        </p>
        <p className="text-[10px] text-white/60 mt-0.5 truncate">{detail}</p>
      </div>
    </div>
  );
}