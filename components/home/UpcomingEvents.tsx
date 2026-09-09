import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";

const events = [
  {
    title: "Night of Prayer",
    date: "Aug 25, 2026",
    time: "10:00 PM",
    location: "Benin City Branch",
    slug: "night-of-prayer",
  },
  {
    title: "Youth Conference",
    date: "Sep 12, 2026",
    time: "9:00 AM",
    location: "Italy HQ",
    slug: "youth-conference",
  },
  {
    title: "Bible College Launch",
    date: "Sep 20, 2026",
    time: "10:00 AM",
    location: "Online",
    slug: "bible-college-launch",
  },
];

export function UpcomingEvents() {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="font-heading text-3xl md:text-4xl text-center mb-8 text-primary">
          Upcoming Events
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {events.map((event) => (
            <Card key={event.slug} className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <FaCalendarAlt className="text-accent" />
                  <span>{event.date} at {event.time}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaMapMarkerAlt className="text-accent" />
                  <span>{event.location}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/events/${event.slug}`}>View Details</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="text-center mt-8">
          <Button asChild variant="default" className="bg-primary text-white hover:bg-primary-light">
            <Link href="/events">All Events</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}