import "@/lib/env";
import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

/**
 * Absolute base URL for all metadata (og:image, canonical, etc.).
 * Must be set correctly in production so social previews resolve.
 */
const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ??
  "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),

  // %s is replaced by child page titles; final title becomes
  // "<Page Title> | The Lord's Hour Ministries International"
  title: {
    default: "The Lord's Hour Ministries International",
    template: "%s | The Lord's Hour Ministries International",
  },
  description:
    "A People Prepared for His Coming — Isaiah 42:6-7. The Lord's Hour Ministries International is a Bible-believing church committed to prayer, the Word, and raising disciples of Jesus Christ.",

  applicationName: "The Lord's Hour Ministries International",
  authors: [{ name: "The Lord's Hour Ministries International" }],
  generator: "Next.js",

  // Sensible defaults; individual pages can override.
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  // Canonical is set per page; this is a fallback.
  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    siteName: "The Lord's Hour Ministries International",
    title: "The Lord's Hour Ministries International",
    description:
      "A People Prepared for His Coming — Isaiah 42:6-7.",
    url: APP_URL,
    locale: "en_NG",
    images: [
      {
        // Replace with an actual OG image (1200x630) in /public
        url: "/church-logo.jpg",
        width: 1200,
        height: 630,
        alt: "The Lord's Hour Ministries International",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "The Lord's Hour Ministries International",
    description:
      "A People Prepared for His Coming — Isaiah 42:6-7.",
    images: ["/church-logo.jpg"],
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground antialiased font-sans">
        <Toaster position="top-right" />
        {children}
      </body>
    </html>
  );
}