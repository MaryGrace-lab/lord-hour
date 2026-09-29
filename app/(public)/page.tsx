import { Hero } from "@/components/home/Hero";
import { ServiceTimes } from "@/components/home/ServiceTimes";
import { TestimoniesFlipbook } from "@/components/home/TestimoniesFlipbook";
import { BibleCollege } from "@/components/home/BibleCollege";
import { prisma } from "@/lib/prisma";
import { TestimonyStatus } from "@prisma/client";
import { findNextService } from "@/lib/service-times";

export const revalidate = 300;

type HomepageTestimony = {
  id: string;
  content: string;
  name: string;
  anonymous: boolean;
  location: string | null;
  category: string;
};

export default async function HomePage() {
  let testimonies: HomepageTestimony[] = [];
  try {
    testimonies = await prisma.testimony.findMany({
      where: { status: TestimonyStatus.APPROVED },
      orderBy: { createdAt: "desc" },
      take: 8,
      select: {
        id: true,
        content: true,
        name: true,
        anonymous: true,
        location: true,
        category: true,
      },
    });
  } catch (err) {
    console.error("Homepage testimony fetch failed:", err);
  }

  const initialNext = findNextService(new Date());

  return (
    <>
      <Hero />
      <ServiceTimes initialNext={initialNext} />
      <TestimoniesFlipbook testimonies={testimonies} />
      <BibleCollege />
    </>
  );
}