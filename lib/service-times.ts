export type ServiceKind = "worship" | "bible" | "prayer";

export type Service = {
  dayOfWeek: number;
  day: string;
  name: string;
  time: string;
  time24: string;
  kind: ServiceKind;
};

export type ServiceLocation = {
  country: string;
  flagEmoji: string;
  city: string;
  address: string;
  services: Service[];
};

export const SERVICE_LOCATIONS: ServiceLocation[] = [
  {
    country: "Nigeria",
    flagEmoji: "🇳🇬",
    city: "Benin City",
    address: "Boundary Street, Off Egba Road, Benin City, Edo State",
    services: [
      { dayOfWeek: 0, day: "Sunday", name: "Worship Service", time: "9:30 AM", time24: "09:30", kind: "worship" },
      { dayOfWeek: 3, day: "Wednesday", name: "Bible Study", time: "5:00 PM", time24: "17:00", kind: "bible" },
      { dayOfWeek: 5, day: "Friday", name: "Prayer Meeting", time: "5:00 PM", time24: "17:00", kind: "prayer" },
    ],
  },
  {
    country: "Italy",
    flagEmoji: "🇮🇹",
    city: "Castelleone",
    address: "Via Cappi 26 Castelleone 26012 (C.R)",
    services: [
      { dayOfWeek: 0, day: "Sunday", name: "Worship Service", time: "10:00 AM", time24: "10:00", kind: "worship" },
      { dayOfWeek: 3, day: "Wednesday", name: "Bible Study", time: "6:00 PM", time24: "18:00", kind: "bible" },
      { dayOfWeek: 5, day: "Friday", name: "Prayer Meeting", time: "6:00 PM", time24: "18:00", kind: "prayer" },
    ],
  },
];

export type UpcomingInfo = {
  location: string;
  flagEmoji: string;
  day: string;
  name: string;
  time: string;
  isLive: boolean;
};

export function findNextService(
  now: Date,
  locations: ServiceLocation[] = SERVICE_LOCATIONS
): UpcomingInfo | null {
  const currentDay = now.getDay();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  let best: { whenMinutes: number; service: UpcomingInfo } | null = null;

  for (const loc of locations) {
    for (const svc of loc.services) {
      const [h, m] = svc.time24.split(":").map(Number);
      const svcMinutes = h * 60 + m;
      let dayOffset = (svc.dayOfWeek - currentDay + 7) % 7;
      let minutesUntil = dayOffset * 24 * 60 + svcMinutes - currentMinutes;

      const isLive =
        dayOffset === 0 &&
        currentMinutes >= svcMinutes &&
        currentMinutes <= svcMinutes + 60;

      if (isLive) {
        minutesUntil = -1;
      } else if (minutesUntil < 0) {
        dayOffset = dayOffset === 0 ? 7 : dayOffset;
        minutesUntil = dayOffset * 24 * 60 + svcMinutes - currentMinutes;
      }

      const info: UpcomingInfo = {
        location: loc.city,
        flagEmoji: loc.flagEmoji,
        day: svc.day,
        name: svc.name,
        time: svc.time,
        isLive,
      };

      if (!best || minutesUntil < best.whenMinutes) {
        best = { whenMinutes: minutesUntil, service: info };
      }
    }
  }

  return best?.service ?? null;
}