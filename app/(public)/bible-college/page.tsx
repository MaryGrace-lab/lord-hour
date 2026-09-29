import type { Metadata } from "next";
import { BibleCollegeContent } from "@/components/bible-college/BibleCollegeContent";

const PAGE_TITLE = "School of the Spirit Bible College";
const PAGE_DESCRIPTION =
  "Equipping Believers. Empowering Leaders. Expanding the Kingdom. Explore our theology and ministry training programs — inaugural session September 2026.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/bible-college" },
  openGraph: {
    title: `${PAGE_TITLE} | The Lord's Hour Ministries`,
    description: PAGE_DESCRIPTION,
    url: "/bible-college",
  },
  twitter: {
    title: `${PAGE_TITLE} | The Lord's Hour Ministries`,
    description: PAGE_DESCRIPTION,
  },
};

export default function BibleCollegePage() {
  return <BibleCollegeContent />;
}