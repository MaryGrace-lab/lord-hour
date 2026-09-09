export type Branch = {
  name: string;
  slug: string;
  country: string;
  city: string;
  address: string;
  phone?: string;
  email?: string;
  pastor?: string;
  assistantPastor?: string;
  serviceTimes: { day: string; time: string }[];
  description?: string;
  imageUrl?: string;
  mapEmbedUrl?: string; // Google Maps embed URL (without API key)
};

export const branches: Branch[] = [
  {
    name: "The Lord's Hour Ministries – San Donato (Headquarters)",
    slug: "san-donato",
    country: "Italy (Headquarter)",
    city: "San Donato",
    address: "Via Cappi 26 Castelleone 26012 (C.R), Italy",
    phone: "+39 (please add phone)",
    email: "Thelordshourministriesinc@gmail.com",
    pastor: "Apostle Oghale B. Uwubiti",
    assistantPastor: "Rev. Abies Uwubiti Imarhia",
    serviceTimes: [
      { day: "Sunday Worship", time: "10:00 AM" },
      { day: "Bible Study (Wednesday)", time: "6:00 PM" },
      { day: "Prayer Meeting (Friday)", time: "6:00 PM" },
    ],
    description:
      "Our international headquarters, established in 2019, leads the global vision of The Lord's Hour Ministries from Italy.",
    imageUrl: "/lord-hour-1.jpeg", // Replace with actual image path
    mapEmbedUrl:
      "https://www.google.com/maps?q=Via%20Cappi%2026%20Castelleone%2026012%20C.R%2C%20Italy&output=embed",
  },
  {
    name: "The Lord's Hour Ministries – Benin City",
    slug: "benin-city",
    country: "Nigeria",
    city: "Benin City",
    address: "Boundary Street, Off Egba Road, Benin City, Edo State, Nigeria",
    phone: "07085073850",
    email: "Thelordshourministriesinc@gmail.com",
    pastor: "Pastor Martins Igbodo",
    assistantPastor: "Mins. Stanley Agbai",
    serviceTimes: [
      { day: "Sunday Worship", time: "9:30 AM" },
      { day: "Bible Study (Wednesday)", time: "5:00 PM" },
      { day: "Prayer Meeting (Friday)", time: "5:00 PM" },
    ],
    description:
      "Our Benin City branch is the first local branch established in Nigeria. It serves as a center for worship, discipleship, and community outreach in Edo State.",
    imageUrl: "/church-1.jpeg", // Replace with actual image path
    mapEmbedUrl:
      "https://www.google.com/maps?q=Boundary%20Street%2C%20Off%20Egba%20Road%2C%20Benin%20City%2C%20Edo%20State%2C%20Nigeria&output=embed",
  },
];