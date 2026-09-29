"use client";

import { useEffect, useState } from "react";
import {
  FaChurch,
  FaBookOpen,
  FaPrayingHands,
  FaMapMarkerAlt,
  FaClock,
} from "react-icons/fa";
import {
  SERVICE_LOCATIONS,
  findNextService,
  type Service,
  type ServiceKind,
  type ServiceLocation,
  type UpcomingInfo,
} from "@/lib/service-times";

const kindStyles: Record<
  ServiceKind,
  { Icon: typeof FaChurch; bg: string; fg: string }
> = {
  worship: { Icon: FaChurch, bg: "bg-accent/15", fg: "text-accent" },
  bible: { Icon: FaBookOpen, bg: "bg-blue-500/10", fg: "text-blue-600" },
  prayer: { Icon: FaPrayingHands, bg: "bg-purple-500/10", fg: "text-purple-600" },
};

export function ServiceTimes({
  initialNext,
}: {
  initialNext: UpcomingInfo | null;
}) {
  const [next, setNext] = useState<UpcomingInfo | null>(initialNext);

  useEffect(() => {
    const update = () => setNext(findNextService(new Date()));
    update();
    const interval = setInterval(update, 60_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative py-14 sm:py-20 md:py-28 bg-gray-50 overflow-hidden">
      <div className="pointer-events-none absolute -top-40 -right-40 w-96 h-96 rounded-full bg-accent/5 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-midnight/5 blur-3xl" aria-hidden />

      <div className="w-full max-w-6xl mx-auto px-5 sm:px-6 relative">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <p className="text-accent text-xs sm:text-[11px] md:text-xs tracking-[0.3em] uppercase mb-3 font-medium">
            Join Us
          </p>
          <h2 className="font-heading text-3xl sm:text-3xl md:text-4xl lg:text-5xl text-primary">
            Worship With Us
          </h2>
          <div className="w-12 h-px bg-accent mx-auto mt-5 md:mt-6" aria-hidden />
        </div>

        {next && (
          <div className="flex justify-center mb-8 sm:mb-10 md:mb-12">
            <div className="inline-flex items-center gap-2 sm:gap-3 bg-white border border-gray-200 rounded-full px-4 sm:px-5 py-2.5 shadow-sm hover:shadow-md transition-shadow">
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span
                  className={`absolute inline-flex h-full w-full rounded-full opacity-75 motion-safe:animate-ping ${
                    next.isLive ? "bg-red-500" : "bg-emerald-500"
                  }`}
                  aria-hidden
                />
                <span
                  className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                    next.isLive ? "bg-red-500" : "bg-emerald-500"
                  }`}
                  aria-hidden
                />
              </span>
              <span className="text-xs sm:text-[11px] uppercase tracking-[0.15em] text-gray-500 font-semibold">
                {next.isLive ? "Live" : "Next"}
              </span>
              <span className="w-px h-4 bg-gray-200" aria-hidden />
              <span className="text-sm font-semibold text-gray-900">
                {next.day} · {next.time}
              </span>
              <span aria-hidden="true" className="text-base">
                {next.flagEmoji}
              </span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 lg:gap-8">
          {SERVICE_LOCATIONS.map((loc) => (
            <LocationCard key={loc.country} location={loc} />
          ))}
        </div>
      </div>
    </section>
  );
}

function LocationCard({ location }: { location: ServiceLocation }) {
  return (
    <div className="group relative bg-white rounded-2xl border border-gray-100 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.07)] hover:shadow-[0_30px_60px_-20px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300">
      <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" aria-hidden />

      <div className="p-5 sm:p-6 md:p-8">
        <div className="flex items-center gap-3.5 mb-5 sm:mb-6 md:mb-7">
          <span className="text-3xl shrink-0" aria-hidden="true">
            {location.flagEmoji}
          </span>
          <div className="min-w-0">
            <h3 className="font-heading text-xl md:text-2xl font-bold text-primary leading-tight">
              {location.country}
            </h3>
            <p className="text-xs uppercase tracking-[0.18em] text-gray-400 mt-0.5">
              {location.city}
            </p>
          </div>
        </div>

        <ul className="space-y-3">
          {location.services.map((svc) => (
            <ServiceRow key={svc.day + svc.name} service={svc} />
          ))}
        </ul>

        <div className="mt-5 md:mt-7 pt-4 md:pt-6 border-t border-gray-100 flex items-start gap-2.5 text-sm text-gray-500">
          <FaMapMarkerAlt className="text-accent shrink-0 mt-0.5" size={13} aria-hidden />
          <span className="leading-relaxed">{location.address}</span>
        </div>
      </div>
    </div>
  );
}

function ServiceRow({ service }: { service: Service }) {
  const { Icon, bg, fg } = kindStyles[service.kind];

  return (
    <li className="group/row flex items-start gap-3.5 p-3 rounded-xl border border-transparent hover:border-accent/20 hover:bg-accent/[0.03] transition-all duration-200">
      <div
        className={`shrink-0 w-11 h-11 md:w-12 md:h-12 rounded-full ${bg} ${fg} flex items-center justify-center group-hover/row:scale-105 transition-transform duration-200`}
      >
        <Icon size={18} aria-hidden />
      </div>

      <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-4">
        <div className="min-w-0">
          <p className="text-[11px] md:text-[13px] uppercase tracking-[0.14em] text-gray-400 font-medium mb-0.5">
            {service.day}
          </p>
          <h4 className="font-heading text-base font-semibold text-gray-900 leading-snug">
            {service.name}
          </h4>
        </div>

        <div className="shrink-0 self-start md:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-gray-50 border border-gray-100 group-hover/row:border-accent/30 group-hover/row:bg-accent/5 transition-all duration-200">
          <FaClock size={11} className="text-accent" aria-hidden />
          <span className="text-sm font-semibold text-primary whitespace-nowrap">
            {service.time}
          </span>
        </div>
      </div>
    </li>
  );
}