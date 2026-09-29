"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaGraduationCap,
  FaCircleCheck,
  FaPaperPlane,
  FaBuildingColumns,
  FaWhatsapp,
  FaCopy,
  FaArrowRight,
  FaClock,
  FaCircleInfo,
  FaFileLines,
  FaChevronDown,
} from "react-icons/fa6";
import { submitApplication } from "@/lib/application-actions";
import { Textarea } from "@/components/ui/textarea";

type Course = {
  id: string;
  title: string;
};

const PAYMENT = {
  bankName: "Moniepoint MFB",
  accountName: "Ogheale Uwubiti",
  accountNumber: "9153548482",
  amount: "₦43,000",
  amountBreakdown: "Course registration, study materials & certificate",
  whatsappNumber: "2347085073850",
  whatsappDisplay: "+234 708 507 3850",
};

const COUNTRY_CODES = [
  { code: "+234", label: "🇳🇬 +234" },
  { code: "+39", label: "🇮🇹 +39" },
  { code: "+44", label: "🇬🇧 +44" },
  { code: "+1", label: "🇺🇸 +1" },
  { code: "+27", label: "🇿🇦 +27" },
  { code: "+233", label: "🇬🇭 +233" },
  { code: "+254", label: "🇰🇪 +254" },
];

const STEPS = [
  { n: 1, label: "Application", active: true },
  { n: 2, label: "Review", active: false },
  { n: 3, label: "Enrollment", active: false },
];

type ApplicationState = { success: boolean; error?: string };

const initialState: ApplicationState = { success: false };

export function ApplicationForm({ courses }: { courses: Course[] }) {
  const [state, formAction, isPending] = useActionState(
    submitApplication,
    initialState
  );
  const [submitted, setSubmitted] = useState(false);
  const [submittedName, setSubmittedName] = useState("");
  const [countryCode, setCountryCode] = useState("+234");
  const [phone, setPhone] = useState("");
  const renderedAtRef = useRef<number>(Date.now());
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      setSubmitted(true);
      toast.success("Application submitted successfully!");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state]);

  function handleCopy(text: string, label: string) {
    navigator.clipboard.writeText(text).then(
      () => toast.success(`${label} copied`),
      () => toast.error("Could not copy — please copy manually")
    );
  }

  const whatsappMessage = encodeURIComponent(
    `Hello, I just submitted my application to the School of the Spirit Bible College.${
      submittedName ? ` My name is ${submittedName}.` : ""
    } I have made the payment of ${PAYMENT.amount}. Here is my receipt:`
  );
  const whatsappUrl = `https://wa.me/${PAYMENT.whatsappNumber}?text=${whatsappMessage}`;

  // ────────────────────────────────────────────────
  // Success + Payment screen
  // ────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="relative bg-white rounded-3xl border border-gray-100 shadow-[0_25px_50px_-20px_rgba(0,0,0,0.12)] overflow-hidden">
          <div
            className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent"
            aria-hidden
          />

          <div className="p-8 sm:p-10 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <FaCircleCheck className="text-green-600 text-4xl" aria-hidden />
            </div>
            <h2 className="font-heading text-3xl font-bold text-primary mb-3">
              Application Received
            </h2>
            <p className="text-gray-600 max-w-lg mx-auto leading-relaxed">
              Thank you for applying to The Lord&apos;s Hour Ministries
              Theology School. Your application is now under review.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_25px_50px_-20px_rgba(0,0,0,0.12)] overflow-hidden">
          <div className="p-6 sm:p-8 border-b border-gray-100">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-accent/15 rounded-xl flex items-center justify-center shrink-0">
                <FaBuildingColumns className="text-accent" size={18} aria-hidden />
              </div>
              <div className="min-w-0">
                <h3 className="font-heading text-xl font-bold text-primary leading-tight">
                  Complete Your Payment
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {PAYMENT.amountBreakdown}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-5">
            <div className="bg-gradient-to-br from-midnight via-[#0a1330] to-[#050b1e] rounded-2xl p-5 text-center relative overflow-hidden">
              <div
                className="pointer-events-none absolute -top-10 -right-10 w-32 h-32 rounded-full bg-accent/20 blur-2xl"
                aria-hidden
              />
              <p className="text-accent text-[11px] uppercase tracking-[0.24em] font-semibold mb-2 relative">
                Amount Due
              </p>
              <p className="font-heading text-4xl font-bold text-white relative">
                {PAYMENT.amount}
              </p>
            </div>

            <div className="space-y-3">
              <BankRow
                label="Bank"
                value={PAYMENT.bankName}
                onCopy={() => handleCopy(PAYMENT.bankName, "Bank name")}
              />
              <BankRow
                label="Account Name"
                value={PAYMENT.accountName}
                onCopy={() => handleCopy(PAYMENT.accountName, "Account name")}
              />
              <BankRow
                label="Account Number"
                value={PAYMENT.accountNumber}
                onCopy={() =>
                  handleCopy(PAYMENT.accountNumber, "Account number")
                }
                mono
                large
              />
            </div>

            <div className="pt-5 border-t border-gray-100">
              <p className="text-sm text-gray-600 mb-3">
                After payment, please send your receipt to our WhatsApp:
              </p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white px-6 py-3.5 rounded-md hover:bg-[#1ebe5b] font-semibold text-sm tracking-wide transition-colors w-full sm:w-auto shadow-lg shadow-[#25D366]/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <FaWhatsapp size={18} aria-hidden />
                Send Receipt on WhatsApp
                <span className="sr-only"> (opens in new tab)</span>
              </a>
              <p className="text-xs text-gray-500 mt-2">
                {PAYMENT.whatsappDisplay}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 sm:p-7">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
              <FaClock className="text-amber-700" size={14} aria-hidden />
            </div>
            <h3 className="font-heading text-lg font-bold text-amber-900 leading-tight mt-1">
              What Happens Next?
            </h3>
          </div>
          <ol className="space-y-3 pl-3">
            {[
              "Check your email regularly for updates on your admission status.",
              "Once your payment is verified, we will review your application.",
              "After approval, you will receive an activation email to set your password.",
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-amber-200 text-amber-900 text-xs font-bold flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                <span className="text-sm text-amber-900 leading-relaxed pt-0.5">
                  {step}
                </span>
              </li>
            ))}
          </ol>
        </div>

        <div className="text-center">
          <button
            type="button"
            onClick={() => router.push("/bible-college")}
            className="text-sm text-accent hover:underline inline-flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
          >
            <FaArrowRight size={11} className="rotate-180" aria-hidden />
            Back to Bible College
          </button>
        </div>
      </div>
    );
  }

  // ────────────────────────────────────────────────
  // Application form
  // ────────────────────────────────────────────────
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_25px_50px_-20px_rgba(0,0,0,0.12)] overflow-hidden">
      <div
        className="h-1 bg-gradient-to-r from-transparent via-accent to-transparent"
        aria-hidden
      />

      <div className="border-b border-gray-100 bg-gray-50/50 px-6 sm:px-8 py-5">
        <ol className="flex items-center justify-between max-w-md mx-auto">
          {STEPS.map((step, i) => (
            <li key={step.n} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <span
                  aria-current={step.active ? "step" : undefined}
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step.active
                      ? "bg-accent text-midnight shadow-lg shadow-accent/30"
                      : "bg-white border-2 border-gray-200 text-gray-400"
                  }`}
                >
                  {step.n}
                </span>
                <span
                  className={`text-[10px] uppercase tracking-[0.14em] mt-2 font-semibold ${
                    step.active ? "text-primary" : "text-gray-400"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className="h-px bg-gray-200 flex-1 -mt-5 mx-1"
                  aria-hidden
                />
              )}
            </li>
          ))}
        </ol>
      </div>

      <form
        action={formAction}
        noValidate
        className="p-6 sm:p-8 md:p-10 space-y-6"
        onSubmit={(e) => {
          const fd = new FormData(e.currentTarget);
          setSubmittedName(fd.get("fullName")?.toString() || "");
        }}
      >
        <input
          type="hidden"
          name="phone"
          value={`${countryCode}${phone.replace(/[^\d]/g, "")}`}
        />
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
          <label htmlFor="application-website">Leave this field empty</label>
          <input
            id="application-website"
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            defaultValue=""
          />
        </div>

        {/* Name */}
        <FormField
          id="application-fullname"
          label="Full Name"
          required
          Icon={FaUser}
        >
          <input
            id="application-fullname"
            name="fullName"
            required
            maxLength={100}
            placeholder="Enter your full name"
            autoComplete="name"
            className="w-full bg-transparent border-0 outline-none text-[15px] text-gray-900 placeholder:text-gray-400 py-3.5 pr-4"
          />
        </FormField>

        {/* Email + Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField
            id="application-email"
            label="Email Address"
            required
            Icon={FaEnvelope}
          >
            <input
              id="application-email"
              name="email"
              type="email"
              required
              maxLength={200}
              placeholder="you@example.com"
              autoComplete="email"
              className="w-full bg-transparent border-0 outline-none text-[15px] text-gray-900 placeholder:text-gray-400 py-3.5 pr-4"
            />
          </FormField>

          <FormField
            id="application-phone"
            label="Phone Number"
            required
            Icon={FaPhone}
          >
            <div className="relative flex items-center shrink-0 border-r border-gray-200 mr-2 pr-2">
              <label htmlFor="application-country-code" className="sr-only">
                Country code
              </label>
              <select
                id="application-country-code"
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
              id="application-phone"
              type="tel"
              inputMode="numeric"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              maxLength={20}
              placeholder="800 000 0000"
              autoComplete="tel"
              className="w-full bg-transparent border-0 outline-none text-[15px] text-gray-900 placeholder:text-gray-400 py-3.5"
            />
          </FormField>
        </div>

        {/* Course */}
        <FormField
          id="application-course"
          label="Course of Interest"
          Icon={FaGraduationCap}
          hint="Optional"
        >
          <div className="relative w-full">
            <select
              id="application-course"
              name="courseId"
              defaultValue=""
              className="w-full appearance-none bg-transparent border-0 outline-none text-[15px] text-gray-900 py-3.5 pr-8 cursor-pointer"
            >
              <option value="">Select a course</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
            <FaChevronDown
              size={11}
              className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              aria-hidden
            />
          </div>
        </FormField>

        {/* Message */}
        <div>
          <label
            htmlFor="application-notes"
            className="flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] font-semibold text-gray-500 mb-2"
          >
            <FaFileLines size={11} className="text-accent" aria-hidden />
            Message
            <span className="text-gray-400 normal-case tracking-normal font-normal">
              · Optional
            </span>
          </label>
          <div className="relative rounded-xl border border-gray-200 bg-white focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20 transition-all">
            <Textarea
              id="application-notes"
              name="notes"
              rows={4}
              maxLength={2000}
              placeholder="Tell us why you want to join, or any questions you have..."
              className="border-0 shadow-none focus-visible:ring-0 resize-none text-[15px] px-4 py-3.5 bg-transparent"
            />
          </div>
        </div>

        {/* Info callout */}
        <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <FaCircleInfo
            className="text-blue-600 shrink-0 mt-0.5"
            size={14}
            aria-hidden
          />
          <p className="text-sm text-blue-900 leading-relaxed">
            You will receive a confirmation email once your application is
            received. Please check your inbox (and spam) regularly.
          </p>
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
                Submitting Application...
              </>
            ) : (
              <>
                Submit Application
                <FaPaperPlane
                  size={13}
                  className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200"
                  aria-hidden
                />
              </>
            )}
          </button>
          <p className="text-xs text-gray-500 text-center mt-3">
            By submitting, you agree to be contacted by The Lord&apos;s Hour
            Ministries regarding your application.
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

function BankRow({
  label,
  value,
  onCopy,
  mono = false,
  large = false,
}: {
  label: string;
  value: string;
  onCopy: () => void;
  mono?: boolean;
  large?: boolean;
}) {
  return (
    <div className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-xl p-4">
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-[0.16em] text-gray-500 font-semibold mb-0.5">
          {label}
        </p>
        <p
          className={`text-gray-900 ${large ? "text-xl" : "text-base"} ${
            mono ? "font-mono tracking-wider" : "font-medium"
          } break-all`}
        >
          {value}
        </p>
      </div>
      <button
        type="button"
        onClick={onCopy}
        className="shrink-0 w-11 h-11 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-accent hover:border-accent/40 transition-colors ml-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-label={`Copy ${label}`}
      >
        <FaCopy size={13} aria-hidden />
      </button>
    </div>
  );
}