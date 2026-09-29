import type { MetadataRoute } from "next";
import { branches } from "@/lib/branches";

/**
 * Base URL for the site. Falls back to the production domain if the env
 * variable isn't set (e.g. during a fresh `next build` on a dev machine).
 */
const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
  "https://thelordshourministry.org";

/**
 * Static public pages. Only pages that should be indexed by search engines
 * belong here. Do NOT add:
 *   - /admin, /teacher, /student (behind auth)
 *   - /bible-college/portal/login (robots-blocked)
 *   - /activate/[token] (robots-blocked, ephemeral)
 *   - /api/* (never indexed)
 */
const STATIC_PAGES: {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
}[] = [
  {
    path: "/",
    priority: 1.0,
    changeFrequency: "weekly",
  },
  {
    path: "/about",
    priority: 0.8,
    changeFrequency: "monthly",
  },
  {
    path: "/about/vision-mission",
    priority: 0.7,
    changeFrequency: "yearly",
  },
  {
    path: "/about/beliefs",
    priority: 0.7,
    changeFrequency: "yearly",
  },
  {
    path: "/about/leadership",
    priority: 0.7,
    changeFrequency: "monthly",
  },
  {
    path: "/about/pastors-message",
    priority: 0.7,
    changeFrequency: "monthly",
  },
  {
    path: "/bible-college",
    priority: 0.9,
    changeFrequency: "weekly",
  },
  {
    path: "/bible-college/apply",
    priority: 0.9,
    changeFrequency: "weekly",
  },
  {
    path: "/branches",
    priority: 0.8,
    changeFrequency: "monthly",
  },
  {
    path: "/contact",
    priority: 0.8,
    changeFrequency: "yearly",
  },
  {
    path: "/give",
    priority: 0.8,
    changeFrequency: "yearly",
  },
  {
    path: "/testimonies",
    priority: 0.7,
    changeFrequency: "weekly",
  },
  {
    path: "/testimonies/submit",
    priority: 0.6,
    changeFrequency: "yearly",
  },
  {
    path: "/media/gallery",
    priority: 0.6,
    changeFrequency: "monthly",
  },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_PAGES.map((page) => ({
    url: `${BASE_URL}${page.path}`,
    lastModified: now,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));

  const branchEntries: MetadataRoute.Sitemap = branches.map((branch) => ({
    url: `${BASE_URL}/branches/${branch.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticEntries, ...branchEntries];
}