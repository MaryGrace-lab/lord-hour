import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portal Login",
  description:
    "Sign in to the Bible College student, teacher, or administrator portal at The Lord's Hour Ministries.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}