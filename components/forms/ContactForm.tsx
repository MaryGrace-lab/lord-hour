"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCommentDots,
  FaPaperPlane,
  FaCircleCheck,
  FaHandsPraying,
  FaBookBible,
  FaHeart,
  FaComments,
  FaChevronDown,
  FaArrowRight,
} from "react-icons/fa6";
import { submitContactMessage } from "@/lib/contact-actions";

type InquiryType = "general" | "prayer" | "counseling" | "testimony";

type InquiryOption = {
  key: InquiryType;
  label: string;
  Icon: typeof FaComments;
};

const INQUIRY_OPTIONS: InquiryOption[] = [
  { key: "general", label: "General Inquiry", Icon: FaComments },
  { key: "prayer", label: "Prayer Request", Icon: FaHandsPraying },
  { key: "counseling", label: "Pastoral Counseling", Icon: FaBookBible },
  { key: "testimony", label: "Testimony", Icon: FaHeart },
];

const COUNTRY_CODES = [
  { code: "+234", label: "🇳🇬 +234" },
  { code: "+39", label: "🇮🇹 +39" },
  { code: "+44", label: "🇬🇧 +44" },
  { code: "+1", label: "🇺🇸 +1" },
  { code: "+27", label: "🇿🇦 +27" },
  { code: "+233", label: "🇬🇭 +233" },
  { code: "+254", label: "🇰🇪 +254" },
];

type ContactState = { success: boolean; error?: string };

const initialState: ContactState = { success: false };

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(
    submitContactMessage,
    initialState
  );
  const [inquiryType, setInquiryType] = useState<InquiryType>("general");
  const [countryCode, setCountryCode] = useState("+234");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  // Timestamp of when the form was first rendered.
  const renderedAtRef = useRef<number>(Date.now());

  useEffect(() => {
    if (state.success) {
      setSubmitted(true);
      toast.success("Message sent successfully!");
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state]);

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
            Message Received
          </h2>
          <p className="text-gray-600 max-w-md mx-auto leading-relaxed mb-6">
            Thank you for reaching out to us. We have received your message
            and our team will get back to you shortly.
          </p>

          <div className="inline-flex items-center gap-2 text-sm text-gray-500 bg-gray-50 rounded-full px-4 py-2 border border-gray-100">
            <FaPaperPlane size={12} className="text-accent" aria-hidden />
            Response time: Usually within 24 hours
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                setPhone("");
                // Reset the render timestamp so the next submission
                // gets a fair time check.
                renderedAtRef.current = Date.now();
              }}
              className="text-sm text-accent hover:underline inline-flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
            >
              Send another message
              <FaArrowRight size={10} aria-hidden />
            </button>
          </div>
        </div>
      </div>
    );
  }

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
        <input type="hidden" name="inquiryType" value={inquiryType} />
        <input
          type="hidden"
          name="phone"
          value={phone ? `${countryCode}${phone.replace(/[^\d]/g, "")}` : ""}
        />
        <input
          type="hidden"
          name="renderedAt"
          value={String(renderedAtRef.current)}
        />

        {/* Honeypot — visually hidden, off the tab order, bots fill it. */}
        <div
          aria-hidden="true"
          className="absolute left-[-9999px] top-[-9999px] w-px h-px overflow-hidden"
        >
          <label htmlFor="website">Leave this field empty</label>
          <input
            id="website"
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            defaultValue=""
          />
        </div>

        {/* Header */}
        <div>
          <h2 className="font-heading text-2xl font-bold text-primary mb-1">
            Send Us a Message
          </h2>
          <p className="text-sm text-gray-500">
            Choose a reason and we&apos;ll route your message to the right
            team.
          </p>
        </div>

        {/* Inquiry type */}
        <fieldset>
          <legend className="flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] font-semibold text-gray-500 mb-3">
            <FaCommentDots size={11} className="text-accent" aria-hidden />
            How Can We Help?
          </legend>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {INQUIRY_OPTIONS.map(({ key, label, Icon }) => {
              const isActive = inquiryType === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setInquiryType(key)}
                  aria-pressed={isActive}
                  className={`relative flex flex-col items-center justify-center gap-1.5 px-3 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                    isActive
                      ? "border-accent bg-accent/10 shadow-sm"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <Icon
                    size={14}
                    className={isActive ? "text-accent" : "text-gray-400"}
                    aria-hidden
                  />
                  <span
                    className={`text-[11px] font-semibold text-center leading-tight ${
                      isActive ? "text-primary" : "text-gray-600"
                    }`}
                  >
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
        </fieldset>

        {/* Name + Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField
            id="contact-name"
            label="Full Name"
            required
            Icon={FaUser}
          >
            <input
              id="contact-name"
              name="name"
              required
              maxLength={100}
              placeholder="Your full name"
              autoComplete="name"
              className="w-full bg-transparent border-0 outline-none text-[15px] text-gray-900 placeholder:text-gray-400 py-3.5 pr-4"
            />
          </FormField>

          <FormField
            id="contact-email"
            label="Email"
            hint="Optional"
            Icon={FaEnvelope}
          >
            <input
              id="contact-email"
              name="email"
              type="email"
              maxLength={200}
              placeholder="you@example.com"
              autoComplete="email"
              className="w-full bg-transparent border-0 outline-none text-[15px] text-gray-900 placeholder:text-gray-400 py-3.5 pr-4"
            />
          </FormField>
        </div>

        {/* Phone */}
        <FormField
          id="contact-phone"
          label="Phone"
          required
          Icon={FaPhone}
        >
          <div className="relative flex items-center shrink-0 border-r border-gray-200 mr-2 pr-2">
            <label htmlFor="contact-country-code" className="sr-only">
              Country code
            </label>
            <select
              id="contact-country-code"
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="appearance-none bg-transparent border-0 outline-none text-sm font-medium text-gray-700 pr-5 py-3.5 cursor-pointer"
            >
              {COUNTRY_CODES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.label}
                </option>
              ))}
            </select>
            <FaChevronDown
              size={9}
              className="absolute right-2 text-gray-400 pointer-events-none"
              aria-hidden
            />
          </div>
          <input
            id="contact-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            maxLength={20}
            placeholder="800 000 0000"
            autoComplete="tel"
            className="w-full bg-transparent border-0 outline-none text-[15px] text-gray-900 placeholder:text-gray-400 py-3.5"
          />
        </FormField>

        {/* Subject */}
        <FormField
          id="contact-subject"
          label="Subject"
          hint="Optional"
          Icon={FaCommentDots}
        >
          <input
            id="contact-subject"
            name="subject"
            maxLength={200}
            placeholder="How can we help?"
            className="w-full bg-transparent border-0 outline-none text-[15px] text-gray-900 placeholder:text-gray-400 py-3.5 pr-4"
          />
        </FormField>

        {/* Message */}
        <div>
          <label
            htmlFor="contact-message"
            className="flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] font-semibold text-gray-500 mb-2"
          >
            <FaCommentDots size={11} className="text-accent" aria-hidden />
            Message <span className="text-accent">*</span>
          </label>
          <div className="rounded-xl border border-gray-200 bg-white focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20 transition-all">
            <textarea
              id="contact-message"
              name="message"
              required
              rows={5}
              maxLength={5000}
              placeholder="Write your message here..."
              className="w-full bg-transparent border-0 outline-none resize-none text-[15px] text-gray-900 placeholder:text-gray-400 px-4 py-3.5"
            />
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
                Sending Message...
              </>
            ) : (
              <>
                Send Message
                <FaPaperPlane
                  size={13}
                  className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200"
                  aria-hidden
                />
              </>
            )}
          </button>
          <p className="text-xs text-gray-500 text-center mt-3">
            We respect your privacy. Your details are never shared.
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