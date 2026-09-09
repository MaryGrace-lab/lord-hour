import { Card, CardContent } from "@/components/ui/card";
import { FaChurch, FaBible, FaPrayingHands } from "react-icons/fa";

/**
 * Service times data for each branch.
 * This will eventually be fetched from the database.
 * For now, replace with actual Italy service times when available.
 */
const branches = [
  {
    country: "Nigeria",
    flag: "🇳🇬", // Optional emoji flag
    services: [
      { day: "Sunday Worship", time: "9:30 AM", icon: FaChurch },
      { day: "Bible Study (Wednesday)", time: "5:00 PM", icon: FaBible },
      { day: "Prayer Meeting (Friday)", time: "5:00 PM", icon: FaPrayingHands },
    ],
    address: "Boundary Street, Off Egba Road, Benin City, Edo State, Nigeria",
  },
  {
    country: "Italy",
    flag: "🇮🇹",
    services: [
      // PLACEHOLDER: Replace with actual Italy service times
      { day: "Sunday Worship", time: "10:00 AM", icon: FaChurch },
      { day: "Bible Study (Wednesday)", time: "6:00 PM", icon: FaBible },
      { day: "Prayer Meeting (Friday)", time: "6:00 PM", icon: FaPrayingHands },
    ],
    address: "Via Cappi 26 Castelleone 26012 (C.R)",
  },
];

export function ServiceTimes() {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="font-heading text-3xl md:text-4xl text-center mb-8 text-primary">
          Worship With Us
        </h2>

        {/* Responsive grid: 2 columns on medium+ screens */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {branches.map((branch) => (
            <div key={branch.country} className="bg-gray-50 rounded-lg p-6 shadow-md">
              <div className="flex items-center justify-center gap-3 mb-6">
                <span className="text-3xl">{branch.flag}</span>
                <h3 className="font-heading text-2xl font-bold text-primary">
                  {branch.country}
                </h3>
              </div>

              {/* Service cards for this branch */}
              <div className="space-y-4">
                {branch.services.map((service) => (
                  <Card key={service.day} className="border-0 shadow-sm bg-white">
                    <CardContent className="flex items-center gap-4 pt-4 pb-4">
                      <service.icon className="text-primary text-2xl shrink-0" />
                      <div>
                        <p className="font-semibold">{service.day}</p>
                        <p className="text-accent font-heading text-lg">{service.time}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Branch address */}
              <p className="text-sm text-gray-600 mt-4 text-center">
                {branch.address}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}