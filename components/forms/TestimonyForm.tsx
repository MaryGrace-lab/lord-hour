"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import {
  FaUser,
  FaEnvelope,
  FaLocationDot,
  FaHeart,
  FaCircleCheck,
  FaPaperPlane,
  FaChevronDown,
  FaArrowRight,
  FaFileLines,
} from "react-icons/fa6";
import { submitTestimony } from "@/lib/testimony-actions";
import { TESTIMONY_CATEGORIES } from "@/lib/validations";

type TestimonyState = { success: boolean; error?: string };

const initialState: TestimonyState = { success: false };

export function TestimonyForm() {
  const [state, formAction, isPending] = useActionState(
    submitTestimony,
    initialState
  );
  const [submitted, setSubmitted] = useState(false);
  const [anonymous, setAnonymous] = useState(false);
  const [contentLength, setContentLength] = useState(0);
  const renderedAtRef = useRef<number>(Date.now());
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      setSubmitted(true);
      toast.success("Testimony submitted for review!");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state]);

  // ────────────────────────────────────────────────
  // Success screen
  // ────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="relative bg-white rounded-3xl border border-gray-100 shadow-[0_25px_50px_-20px_rgba(0,0,0,0.12)] overflow-hidden">
        <div
          className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent"
          aria-hidden
        />

        <div className="p-8 sm:p-10 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <FaCircleCheck className="text-green-600 text-4xl" aria-hidden />
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-primary mb-3">
            Testimony Received
          </h2>
          <p className="text-gray-600 max-w-md mx-auto leading-relaxed mb-6">
            Thank you for sharing what God has done in your life. Your
            testimony will be reviewed by our team before being published on
            the website.
          </p>

          <div className="inline-flex items-center gap-2 text-sm text-gray-500 bg-gray-50 rounded-full px-4 py-2 border border-gray-100 mb-8">
            <FaHeart size={11} className="text-accent" aria-hidden />
            Your story matters to us
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={() => router.push("/testimonies")}
              className="inline-flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-md hover:bg-primary-light transition-colors text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Back to Testimonies
              <FaArrowRight size={11} aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                setContentLength(0);
                renderedAtRef.current = Date.now();
              }}
              className="inline-flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-50 transition-colors text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Share Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ────────────────────────────────────────────────
  // Form
  // ────────────────────────────────────────────────
  return (
    <div className="relative bg-white rounded-3xl border border-gray-100 shadow-[0_25px_50px_-20px_rgba(0,0,0,0.12)] overflow-hidden">
      <div
        className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent"
        aria-hidden
      />

      <form
        action={formAction}
        noValidate
        className="p-6 sm:p-8 md:p-10 space-y-6"
      >
        <input
          type="hidden"
          name="renderedAt"
          value={String(renderedAtRef.current)}
        />

        {/* Honeypot */}
        <div
          aria-hidden="true"
          className="absolute left-[-9999px] top-[-9999px] w-px h-px overflow-hidden"
        >
          <label htmlFor="testimony-website">Leave this field empty</label>
          <input
            id="testimony-website"
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            defaultValue=""
          />
        </div>

        {/* Name + Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField
            id="testimony-name"
            label="Your Name"
            required
            Icon={FaUser}
          >
            <input
              id="testimony-name"
              name="name"
              required
              placeholder="e.g., Sister Grace"
              autoComplete="name"
              maxLength={100}
              className="w-full bg-transparent border-0 outline-none text-[15px] text-gray-900 placeholder:text-gray-400 py-3.5 pr-4"
            />
          </FormField>

          <FormField
            id="testimony-location"
            label="Location"
            hint="Optional"
            Icon={FaLocationDot}
          >
            <input
              id="testimony-location"
              name="location"
              placeholder="e.g., Benin City"
              maxLength={100}
              className="w-full bg-transparent border-0 outline-none text-[15px] text-gray-900 placeholder:text-gray-400 py-3.5 pr-4"
            />
          </FormField>
        </div>

        {/* Email */}
        <FormField
          id="testimony-email"
          label="Email"
          hint="Optional"
          Icon={FaEnvelope}
        >
          <input
            id="testimony-email"
            name="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            maxLength={200}
            className="w-full bg-transparent border-0 outline-none text-[15px] text-gray-900 placeholder:text-gray-400 py-3.5 pr-4"
          />
        </FormField>
        <p className="-mt-3 text-xs text-gray-500">
          We may contact you if we have questions. Not published publicly.
        </p>

        {/* Category */}
        <div>
          <label
            htmlFor="testimony-category"
            className="flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] font-semibold text-gray-500 mb-2"
          >
            <FaHeart size={11} className="text-accent" aria-hidden />
            Category{" "}
            <span className="text-accent" aria-hidden>
              *
            </span>
            <span className="sr-only">(required)</span>
          </label>
          <div className="relative rounded-xl border border-gray-200 bg-white focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20 transition-all">
            <select
              id="testimony-category"
              name="category"
              required
              defaultValue=""
              className="w-full appearance-none bg-transparent border-0 outline-none text-[15px] text-gray-900 py-3.5 pl-4 pr-10 cursor-pointer"
            >
              <option value="" disabled>
                Select a category
              </option>
              {TESTIMONY_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <FaChevronDown
              size={11}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              aria-hidden
            />
          </div>
        </div>

        {/* Content */}
        <div>
          <label
            htmlFor="testimony-content"
            className="flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] font-semibold text-gray-500 mb-2"
          >
            <FaFileLines size={11} className="text-accent" aria-hidden />
            Your Testimony{" "}
            <span className="text-accent" aria-hidden>
              *
            </span>
            <span className="sr-only">(required)</span>
          </label>
          <div className="rounded-xl border border-gray-200 bg-white focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20 transition-all">
            <textarea
              id="testimony-content"
              name="content"
              required
              rows={7}
              maxLength={3000}
              placeholder="Share how God has worked in your life..."
              onChange={(e) => setContentLength(e.target.value.length)}
              className="w-full bg-transparent border-0 outline-none resize-none text-[15px] text-gray-900 placeholder:text-gray-400 px-4 py-3.5"
            />
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-gray-500">
              Minimum 30 characters
            </p>
            <p
              className={`text-xs ${
                contentLength > 2900 ? "text-amber-600" : "text-gray-400"
              }`}
              aria-live="polite"
            >
              {contentLength} / 3000
            </p>
          </div>
        </div>

        {/* Anonymous */}
        <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors">
          <div className="flex items-start gap-3">
            <input
              id="testimony-anonymous"
              type="checkbox"
              name="anonymous"
              checked={anonymous}
              onChange={(e) => setAnonymous(e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-primary shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
            <label htmlFor="testimony-anonymous" className="cursor-pointer">
              <p className="text-sm font-semibold text-gray-800">
                Publish my testimony anonymously
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                Your name will be shown as &ldquo;Anonymous&rdquo; on the
                public page.
              </p>
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="group w-full inline-flex items-center justify-center gap-2 bg-accent text-midnight px-6 py-4 rounded-xl font-semibold text-sm tracking-wide shadow-lg shadow-accent/25 hover:bg-accent-light hover:-translate-y-0.5 hover:shadow-xl hover:shadow-accent/35 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {isPending ? (
              <>
                <span
                  className="w-4 h-4 rounded-full border-2 border-midnight/30 border-t-midnight animate-spin"
                  aria-hidden
                />
                Submitting...
              </>
            ) : (
              <>
                Submit Testimony
                <FaPaperPlane
                  size={13}
                  className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200"
                  aria-hidden
                />
              </>
            )}
          </button>
          <p className="text-xs text-gray-500 text-center mt-3">
            Your testimony will be reviewed before appearing on the website.
          </p>
        </div>
      </form>
    </div>
  );
}

function FormField({
  id,
  label,
  required,
  hint,
  Icon,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  Icon: typeof FaUser;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] font-semibold text-gray-500 mb-2"
      >
        <Icon size={11} className="text-accent" aria-hidden />
        {label}
        {required && (
          <>
            <span className="text-accent" aria-hidden>
              *
            </span>
            <span className="sr-only">(required)</span>
          </>
        )}
        {hint && (
          <span className="text-gray-400 normal-case tracking-normal font-normal">
            · {hint}
          </span>
        )}
      </label>
      <div className="flex items-center rounded-xl border border-gray-200 bg-white focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20 transition-all px-4">
        {children}
      </div>
    </div>
  );
}