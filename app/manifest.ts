import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "The Lord's Hour Ministries International",
    short_name: "Lord's Hour",
    description:
      "A People Prepared for His Coming — Isaiah 42:6-7. A Bible-believing church committed to prayer, the Word, and raising disciples of Jesus Christ.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0f1a3a",
    theme_color: "#0f1a3a",
    lang: "en",
    dir: "ltr",
    categories: ["education", "lifestyle", "religion"],
    icons: [
        {
            src: "/icon-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
        },
        {
            src: "/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
        },
        {
            src: "/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
        },
        ],
    shortcuts: [
      {
        name: "Bible College",
        short_name: "College",
        description: "School of the Spirit Bible College",
        url: "/bible-college",
      },
      {
        name: "Branches",
        short_name: "Branches",
        description: "Find a branch near you",
        url: "/branches",
      },
      {
        name: "Give",
        short_name: "Give",
        description: "Support the ministry",
        url: "/give",
      },
      {
        name: "Contact",
        short_name: "Contact",
        description: "Get in touch with us",
        url: "/contact",
      },
    ],
  };
}