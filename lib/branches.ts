export type Branch = {
  name: string;
  slug: string;
  country: string;
  region: "Africa" | "Europe";
  flag: string;
  city: string;
  address: string;
  phone?: string;
  email?: string;
  pastor?: string;
  assistantPastor?: string;
  serviceTimes: { day: string; time: string }[];
  description?: string;
  imageUrl?: string;
  /** OpenStreetMap embed URL — no API key needed, never blocked */
  mapEmbedUrl?: string;
  /** Google Maps directions link */
  directionsUrl?: string;
};

export const branches: Branch[] = [
  {
    name: "The Lord's Hour Ministries – San Donato (Headquarters)",
    slug: "san-donato",
    country: "Italy",
    region: "Europe",
    flag: "🇮🇹",
    city: "San Donato",
    address: "Via Cappi 26 Castelleone 26012 (C.R), Italy",
    phone: "+39 351 194 3365",
    email: "thelordshourministriesinc@gmail.com",
    pastor: "Apostle Oghale B. Uwubiti",
    assistantPastor: "Rev. Abies Uwubiti Imarhia",
    serviceTimes: [
      { day: "Sunday Worship", time: "10:00 AM" },
      { day: "Bible Study (Wednesday)", time: "6:00 PM" },
      { day: "Prayer Meeting (Friday)", time: "6:00 PM" },
    ],
    description:
      "Our international headquarters, established in 2019, leads the global vision of The Lord's Hour Ministries from Italy.",
    imageUrl: "/church-1.jpeg",
    mapEmbedUrl:
      "https://www.openstreetmap.org/export/embed.html?bbox=9.7150%2C45.3400%2C9.7850%2C45.3950&layer=mapnik&marker=45.3667%2C9.7500",
    directionsUrl:
      "https://www.google.com/maps/dir/?api=1&destination=Via+Cappi+26+Castelleone+26012+CR+Italy",
  },
  {
    name: "The Lord's Hour Ministries – Benin City",
    slug: "benin-city",
    country: "Nigeria",
    region: "Africa",
    flag: "🇳🇬",
    city: "Benin City",
    address: "Boundary Street, Off Egba Road, Benin City, Edo State, Nigeria",
    phone: "+234 708 507 3850",
    email: "thelordshourministriesinc@gmail.com",
    pastor: "Pastor Martins Igbodo",
    assistantPastor: "Mins. Stanley Agbai",
    serviceTimes: [
      { day: "Sunday Worship", time: "9:30 AM" },
      { day: "Bible Study (Wednesday)", time: "5:00 PM" },
      { day: "Prayer Meeting (Friday)", time: "5:00 PM" },
    ],
    description:
      "Our Benin City branch is the first local branch established in Nigeria. It serves as a center for worship, discipleship, and community outreach in Edo State.",
    imageUrl: "/church-2.jpeg",
    mapEmbedUrl:
      "https://www.openstreetmap.org/export/embed.html?bbox=5.5750%2C6.3100%2C5.6350%2C6.3650&layer=mapnik&marker=6.3350%2C5.6037",
    directionsUrl:
      "https://www.google.com/maps/dir/?api=1&destination=Boundary+Street+Off+Egba+Road+Benin+City+Edo+State+Nigeria",
  },
];