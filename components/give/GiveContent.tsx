"use client";

import { toast } from "react-hot-toast";
import {
  FaCopy,
  FaBuildingColumns,
  FaWhatsapp,
  FaCircleCheck,
  FaHandHoldingDollar,
  FaChurch,
  FaGlobe,
  FaBookBible,
  FaSeedling,
} from "react-icons/fa6";

const BANK = {
  bankName: "Moniepoint MFB",
  accountName: "Ogheale Uwubiti",
  accountNumber: "9153548482",
};

const WHATSAPP_NUMBER = "2347085073850";
const WHATSAPP_DISPLAY = "+234 708 507 3850";

const PURPOSE = [
  {
    Icon: FaChurch,
    title: "Local Ministry",
    description:
      "Support the day-to-day running of our churches — worship, pastoral care, and discipleship.",
    accent: "from-blue-500/20",
    iconBg: "bg-blue-50",
    iconFg: "text-blue-600",
  },
  {
    Icon: FaGlobe,
    title: "Global Missions",
    description:
      "Help us reach across Nigeria, Italy, and beyond with the gospel of Jesus Christ.",
    accent: "from-accent/25",
    iconBg: "bg-accent/15",
    iconFg: "text-accent",
  },
  {
    Icon: FaBookBible,
    title: "Bible College",
    description:
      "Fund scholarships and resources for the School of the Spirit Bible College.",
    accent: "from-purple-500/20",
    iconBg: "bg-purple-50",
    iconFg: "text-purple-600",
  },
  {
    Icon: FaSeedling,
    title: "Outreach & Charity",
    description:
      "Support community outreach, relief efforts, and benevolence to those in need.",
    accent: "from-emerald-500/20",
    iconBg: "bg-emerald-50",
    iconFg: "text-emerald-600",
  },
];

export function GiveContent() {
  function handleCopy(text: string, label: string) {
    navigator.clipboard.writeText(text).then(
      () => toast.success(`${label} copied`),
      () => toast.error("Could not copy — please copy manually")
    );
  }

  const whatsappMessage = encodeURIComponent(
    "Hello, I have made a donation to The Lord's Hour Ministries. Here is my receipt:"
  );
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`;

  return (
    <div className="space-y-16 md:space-y-20">
      <section>
        <div className="relative max-w-3xl mx-auto text-center">
          <p className="font-heading text-xl sm:text-2xl md:text-[1.65rem] italic text-primary leading-snug mb-5">
            &ldquo;Every man according as he purposeth in his heart, so let
            him give; not grudgingly, or of necessity: for God loveth a
            cheerful giver.&rdquo;
          </p>
          <p className="text-accent text-xs uppercase tracking-[0.24em] font-semibold">
            2 Corinthians 9:7
          </p>
        </div>
      </section>

      <section>
        <div className="max-w-3xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-midnight via-[#0a1330] to-[#050b1e] shadow-2xl">
            <div
              className="pointer-events-none absolute -top-20 -right-20 w-64 h-64 rounded-full bg-accent/15 blur-3xl"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-accent/10 blur-3xl"
              aria-hidden
            />

            <div
              className="h-1 bg-gradient-to-r from-transparent via-accent to-transparent"
              aria-hidden
            />

            <div className="relative p-7 sm:p-10">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent/20 border border-accent/40 mb-4">
                  <FaBuildingColumns className="text-accent" size={22} aria-hidden />
                </div>
                <h2 className="font-heading text-2xl md:text-3xl font-bold text-white mb-2">
                  Give by Bank Transfer
                </h2>
                <p className="text-gray-400 text-sm max-w-md mx-auto">
                  Use the details below to make your donation. Every gift — no
                  matter the size — makes a difference.
                </p>
              </div>

              <div className="space-y-3">
                <BankRow
                  label="Bank"
                  value={BANK.bankName}
                  onCopy={() => handleCopy(BANK.bankName, "Bank name")}
                />
                <BankRow
                  label="Account Name"
                  value={BANK.accountName}
                  onCopy={() => handleCopy(BANK.accountName, "Account name")}
                />
                <BankRow
                  label="Account Number"
                  value={BANK.accountNumber}
                  onCopy={() =>
                    handleCopy(BANK.accountNumber, "Account number")
                  }
                  mono
                  large
                />
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                <p className="text-sm text-gray-300 mb-3">
                  After transferring, please send your receipt to us on
                  WhatsApp so we can acknowledge your gift:
                </p>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white px-6 py-3.5 rounded-md hover:bg-[#1ebe5b] font-semibold text-sm tracking-wide transition-colors w-full sm:w-auto shadow-lg shadow-[#25D366]/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <FaWhatsapp size={18} aria-hidden />
                  Send Receipt on WhatsApp
                  <span className="sr-only"> (opens in new tab)</span>
                </a>
                <p className="text-xs text-gray-500 mt-2">
                  {WHATSAPP_DISPLAY}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="text-center mb-10 md:mb-14">
          <p className="text-accent text-xs tracking-[0.3em] uppercase font-semibold mb-3">
            Your Generosity In Action
          </p>
          <h2 className="font-heading text-2xl md:text-3xl text-primary mb-3">
            How Your Giving Helps
          </h2>
          <div className="w-12 h-1 bg-accent rounded-full mx-auto" aria-hidden />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {PURPOSE.map(({ Icon, title, description, accent, iconBg, iconFg }) => (
            <article
              key={title}
              className="group relative bg-white rounded-2xl border border-gray-100 p-6 md:p-7 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.08)] hover:shadow-[0_25px_50px_-20px_rgba(0,0,0,0.15)] hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              <div
                className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${accent} to-transparent`}
                aria-hidden
              />
              <div
                className={`w-12 h-12 rounded-xl ${iconBg} ${iconFg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
              >
                <Icon size={18} aria-hidden />
              </div>
              <h3 className="font-heading text-base font-bold text-primary mb-2 leading-tight">
                {title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section>
        <div className="max-w-3xl mx-auto">
          <div className="bg-gray-50 rounded-2xl border border-gray-100 p-6 sm:p-8">
            <h2 className="font-heading text-xl font-bold text-primary mb-5 flex items-center gap-2">
              <FaHandHoldingDollar className="text-accent" size={18} aria-hidden />
              Other Ways to Give
            </h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <FaCircleCheck
                  className="text-accent shrink-0 mt-0.5"
                  size={14}
                  aria-hidden
                />
                <div>
                  <p className="text-sm font-semibold text-primary">
                    In Person
                  </p>
                  <p className="text-sm text-gray-600 mt-0.5 leading-relaxed">
                    Give during any of our worship services at our Nigeria or
                    Italy branches.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <FaCircleCheck
                  className="text-accent shrink-0 mt-0.5"
                  size={14}
                  aria-hidden
                />
                <div>
                  <p className="text-sm font-semibold text-primary">
                    By Bank Transfer
                  </p>
                  <p className="text-sm text-gray-600 mt-0.5 leading-relaxed">
                    Use the account details above from any Nigerian bank or
                    international transfer service.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <FaCircleCheck
                  className="text-accent shrink-0 mt-0.5"
                  size={14}
                  aria-hidden
                />
                <div>
                  <p className="text-sm font-semibold text-primary">
                    Special Seeds &amp; Pledges
                  </p>
                  <p className="text-sm text-gray-600 mt-0.5 leading-relaxed">
                    For special seeds, pledges, or partnership, contact the
                    ministry office directly.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <div className="max-w-2xl mx-auto text-center">
          <p className="font-heading text-lg md:text-xl text-primary leading-relaxed mb-4">
            Thank you for partnering with us in the work of the Lord.
          </p>
          <p className="text-sm text-gray-500 leading-relaxed">
            Your giving enables us to reach more souls with the gospel,
            disciple believers, and raise leaders of excellence for the
            Kingdom of God. May the Lord bless you abundantly.
          </p>
        </div>
      </section>
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
    <div className="flex items-center justify-between bg-white/[0.06] backdrop-blur-md border border-white/10 rounded-xl p-4 hover:bg-white/[0.09] transition-colors">
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-[0.18em] text-gray-400 font-semibold mb-1">
          {label}
        </p>
        <p
          className={`text-white ${large ? "text-2xl" : "text-base"} ${
            mono ? "font-mono tracking-wider" : "font-medium"
          } break-all`}
        >
          {value}
        </p>
      </div>
      <button
        type="button"
        onClick={onCopy}
        className="shrink-0 w-11 h-11 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center text-gray-300 hover:text-accent hover:border-accent/40 hover:bg-accent/10 transition-all ml-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        aria-label={`Copy ${label}`}
      >
        <FaCopy size={14} aria-hidden />
      </button>
    </div>
  );
}