import type { Metadata } from "next";
import Link from "next/link";
import { TestimonyForm } from "@/components/forms/TestimonyForm";
import {
  FaArrowLeft,
  FaHeart,
  FaCircleCheck,
  FaLock,
  FaClock,
} from "react-icons/fa6";

const PAGE_TITLE = "Share Your Testimony";
const PAGE_DESCRIPTION =
  "Share how God has worked in your life. Your testimony will be reviewed by our team before appearing on the website.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/testimonies/submit" },
  openGraph: {
    title: `${PAGE_TITLE} | The Lord's Hour Ministries`,
    description: PAGE_DESCRIPTION,
    url: "/testimonies/submit",
  },
  twitter: {
    title: `${PAGE_TITLE} | The Lord's Hour Ministries`,
    description: PAGE_DESCRIPTION,
  },
};

const guidelines = [
  {
    Icon: FaHeart,
    title: "Be Authentic",
    description: "Share from the heart — your real story encourages others.",
  },
  {
    Icon: FaCircleCheck,
    title: "Give God the Glory",
    description: "Focus on what God has done, not just what happened.",
  },
  {
    Icon: FaLock,
    title: "Your Privacy Matters",
    description:
      "Your email is never published. You can share anonymously if you prefer.",
  },
  {
    Icon: FaClock,
    title: "Reviewed Before Publishing",
    description:
      "Every testimony is reviewed by our team before it appears online.",
  },
];

export default function SubmitTestimonyPage() {
  return (
    <div className="bg-white">
      <section
        className="relative pt-20 md:pt-24 pb-8 md:pb-10 overflow-hidden"
        aria-labelledby="submit-testimony-heading"
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
            href="/testimonies"
            className="inline-flex items-center gap-1.5 text-sm text-accent hover:underline mb-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
          >
            <FaArrowLeft size={11} aria-hidden />
            Back to Testimonies
          </Link>

          <div className="max-w-2xl">
            <p className="text-accent text-xs tracking-[0.3em] uppercase font-semibold mb-4">
              Share Your Story
            </p>
            <h1
              id="submit-testimony-heading"
              className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-primary leading-[1.1] mb-4"
            >
              Share Your Testimony
            </h1>
            <p className="text-gray-600 text-base md:text-lg leading-relaxed">
              Has God done something in your life? We would love to hear about
              it and celebrate with you.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-16 md:pb-24">
        <div className="w-full max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            <aside
              className="lg:col-span-5 lg:sticky lg:top-24 lg:self-start space-y-6"
              aria-labelledby="guidelines-heading"
            >
              <div className="bg-gray-50 rounded-2xl border border-gray-100 p-6 sm:p-7">
                <h2
                  id="guidelines-heading"
                  className="font-heading text-xl font-bold text-primary mb-5"
                >
                  A Few Guidelines
                </h2>
                <ul className="space-y-5">
                  {guidelines.map(({ Icon, title, description }) => (
                    <li key={title} className="flex items-start gap-3">
                      <div className="shrink-0 w-10 h-10 rounded-xl bg-white border border-gray-200 text-accent flex items-center justify-center">
                        <Icon size={14} aria-hidden />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-primary leading-tight">
                          {title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                          {description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="relative bg-gradient-to-br from-midnight via-[#0a1330] to-[#050b1e] rounded-2xl border border-white/5 p-6 sm:p-7 overflow-hidden">
                <div
                  className="pointer-events-none absolute -top-10 -right-10 w-40 h-40 rounded-full bg-accent/15 blur-3xl"
                  aria-hidden
                />
                <div className="relative">
                  <p className="font-heading text-lg italic text-white/95 leading-snug mb-4">
                    &ldquo;And they overcame him by the blood of the Lamb, and
                    by the word of their testimony.&rdquo;
                  </p>
                  <p className="text-accent text-xs uppercase tracking-[0.2em] font-semibold">
                    Revelation 12:11
                  </p>
                </div>
              </div>
            </aside>

            <div className="lg:col-span-7">
              <TestimonyForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}