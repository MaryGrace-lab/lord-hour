import { Hero } from "@/components/home/Hero";
import { ServiceTimes } from "@/components/home/ServiceTimes";
import { LiveStreamCTA } from "@/components/home/LiveStreamCTA";
import { TestimoniesFlipbook } from "@/components/home/TestimoniesFlipbook";
import { BibleCollege } from "@/components/home/BibleCollege";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServiceTimes />
      <LiveStreamCTA />
      <TestimoniesFlipbook />
      <BibleCollege />
    </>
  );
}