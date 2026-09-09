import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "The Lord's Hour Ministries",
  description: "A People Prepared for His Coming — Isaiah 42:6-7",
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