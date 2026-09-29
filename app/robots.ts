import type { MetadataRoute } from "next";

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
  "https://thelordshourministry.org";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          // Authenticated portals — never indexed
          "/admin/",
          "/teacher/",
          "/student/",
          // API routes — no crawlable content
          "/api/",
          // Login + activation are ephemeral
          "/bible-college/portal/login",
          "/activate/",
          // Next.js internal build artifacts
          "/_next/",
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}