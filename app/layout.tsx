import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HornPub — The Word Hits Different",
  description: "A daily call to God's Word. Discover Bible verses for hope, strength, peace, and everyday life.",
  applicationName: "HornPub",
  openGraph: {
    title: "HornPub — The Word Hits Different",
    description: "Daily Scripture. Timeless wisdom. A little unexpected humor.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#11100e",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
