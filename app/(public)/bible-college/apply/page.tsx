import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ApplicationForm } from "@/components/forms/ApplicationForm";
import {
  FaArrowLeft,
  FaCircleCheck,
  FaGraduationCap,
  FaCalendarDays,
  FaLaptopCode,
  FaEnvelope,
  FaPhone,
  FaHandHoldingHeart,
} from "react-icons/fa6";

const PAGE_TITLE = "Apply | School of the Spirit Bible College";
const PAGE_DESCRIPTION =
  "Apply to the School of the Spirit Bible College at The Lord's Hour Ministries. Inaugural session opening September 2026.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/bible-college/apply" },
  openGraph: {
    title: `${PAGE_TITLE} | The Lord's Hour Ministries`,
    description: PAGE_DESCRIPTION,
    url: "/bible-college/apply",
  },
  twitter: {
    title: `${PAGE_TITLE} | The Lord's Hour Ministries`,
    description: PAGE_DESCRIPTION,
  },
};

// The course list is fetched live. Without this, the build fails if
// Neon is asleep or unreachable during prerender.
export const revalidate = 300;

const highlights = [
  {
    Icon: FaGraduationCap,
    label: "Diploma & Certificate Programs",
    detail: "Multiple academic tracks available",
  },
  {
    Icon: FaCalendarDays,
    label: "Next Cohort",
    detail: "Opening September 2026",
  },
  {
    Icon: FaLaptopCode,
    label: "Flexible Study",
    detail: "Online & On-Campus options",
  },
];

const nextSteps = [
  "Submit your application using the form.",
  "Our admissions team reviews your details.",
  "You receive an email with your enrollment decision.",
  "Once approved, you set your password and begin learning.",
];

export default async function ApplyPage() {
  let courses: { id: string; title: string }[] = [];
  try {
    courses = await prisma.course.findMany({
      where: { isPublished: true },
      orderBy: { title: "asc" },
      select: { id: true, title: true },
    });
  } catch (err) {
    console.error("Failed to load courses for application form:", err);
    // Continue with an empty list so the form still renders.
  }

  return (
    <div className="bg-white">
      <section
        className="relative pt-20 md:pt-24 pb-8 md:pb-10 overflow-hidden"
        aria-labelledby="apply-heading"
      >
        <div
          className="pointer-events-none absolute -top-40 -right-40 w-96 h-96 rounded-full bg-accent/10 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-midnight/5 blur-3xl"
          aria-hidden
        />

        <div className="relative w-full max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <Link
            href="/bible-college"
            className="inline-flex items-center gap-1.5 text-sm text-accent hover:underline mb-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
          >
            <FaArrowLeft size={11} aria-hidden />
            Back to Bible College
          </Link>

          <div className="max-w-2xl">
            <p className="text-accent text-xs tracking-[0.3em] uppercase font-semibold mb-4">
              Admissions
            </p>
            <h1
              id="apply-heading"
              className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-primary leading-[1.1] mb-4"
            >
              Apply to the School of the Spirit Bible College
            </h1>
            <p className="text-gray-600 text-base md:text-lg leading-relaxed">
              Fill in the form below to submit your application. Our team will
              review it and contact you with next steps.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-16 md:pb-24">
        <div className="w-full max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            <aside className="lg:col-span-5 lg:sticky lg:top-24 lg:self-start space-y-6">
              <div className="bg-gray-50 rounded-2xl border border-gray-100 p-6 sm:p-7">
                <h2 className="font-heading text-xl font-bold text-primary mb-5">
                  Why Apply?
                </h2>

                <ul className="space-y-4">
                  {highlights.map(({ Icon, label, detail }) => (
                    <li key={label} className="flex items-start gap-3">
                      <div className="shrink-0 w-10 h-10 rounded-xl bg-white border border-gray-200 text-accent flex items-center justify-center">
                        <Icon size={15} aria-hidden />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-primary leading-tight">
                          {label}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {detail}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-7">
                <h2 className="font-heading text-xl font-bold text-primary mb-5 flex items-center gap-2">
                  <FaCircleCheck className="text-accent" size={16} aria-hidden />
                  What Happens After You Apply
                </h2>

                <ol className="space-y-3">
                  {nextSteps.map((step, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-accent/15 text-accent text-xs font-bold flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      <span className="text-sm text-gray-700 leading-relaxed pt-0.5">
                        {step}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="relative bg-gradient-to-br from-midnight via-[#0a1330] to-[#050b1e] rounded-2xl border border-white/5 p-6 sm:p-7 overflow-hidden">
                <div
                  className="pointer-events-none absolute -top-10 -right-10 w-40 h-40 rounded-full bg-accent/15 blur-3xl"
                  aria-hidden
                />
                <div className="relative">
                  <p className="font-heading text-lg md:text-xl italic text-white/95 leading-snug mb-4">
                    &ldquo;Study to show thyself approved unto God, a workman
                    that needeth not to be ashamed, rightly dividing the word
                    of truth.&rdquo;
                  </p>
                  <p className="text-accent text-xs uppercase tracking-[0.2em] font-semibold">
                    2 Timothy 2:15
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-7">
                <h2 className="font-heading text-base font-bold text-primary mb-4 flex items-center gap-2">
                  <FaHandHoldingHeart className="text-accent" size={14} aria-hidden />
                  Need Help?
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed mb-5">
                  Have a question about admissions? Our team is happy to help.
                </p>
                <div className="space-y-3">
                  <a
                    href="mailto:thelordshourministriesinc@gmail.com"
                    className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                  >
                    <div className="w-9 h-9 rounded-lg bg-accent/15 text-accent flex items-center justify-center shrink-0 group-hover:bg-accent group-hover:text-white transition-colors">
                      <FaEnvelope size={13} aria-hidden />
                    </div>
                    <span className="text-sm text-gray-700 group-hover:text-accent transition-colors break-all">
                      thelordshourministriesinc@gmail.com
                    </span>
                  </a>
                  <a
                    href="tel:+2347085073850"
                    className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                  >
                    <div className="w-9 h-9 rounded-lg bg-accent/15 text-accent flex items-center justify-center shrink-0 group-hover:bg-accent group-hover:text-white transition-colors">
                      <FaPhone size={13} aria-hidden />
                    </div>
                    <span className="text-sm text-gray-700 group-hover:text-accent transition-colors">
                      +234 708 507 3850
                    </span>
                  </a>
                </div>
              </div>
            </aside>

            <div className="lg:col-span-7">
              <ApplicationForm courses={courses} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}