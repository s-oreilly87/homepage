import type { Metadata } from "next";
import { DM_Mono, Geist } from "next/font/google";
import "./globals.css";

const dmMono = DM_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-dm-mono",
  display: "swap",
});

const geist = Geist({
  weight: ["400", "600"],
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sean O'Reilly",
  description:
    "Full-stack developer. Building web applications with Laravel, Next.js, FastAPI and everything in between.",
  metadataBase: new URL("https://about.seanoreilly.dev"),
  openGraph: {
    title: "Sean O'Reilly",
    description: "Full-stack developer. Laravel · Next.js · FastAPI",
    url: "https://about.seanoreilly.dev",
    siteName: "Sean O'Reilly",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Sean O'Reilly",
    description: "Full-stack developer. Laravel · Next.js · FastAPI",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${dmMono.variable} ${geist.variable} scheme-only-dark antialiased`}
    >
      <body className="grain-overlay">{children}</body>
    </html>
  );
}
