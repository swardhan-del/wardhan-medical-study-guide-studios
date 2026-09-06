import { LearningAnalytics } from "@/components/learning-analytics";
import type { Metadata, Viewport } from "next";
import { SiteShell } from "@/components/site-shell";
import { getSiteUrl, isIndexable } from "@/lib/site-url";
import "./globals.css";

const siteTitle = "Wardhan Medical Study Guide Studios";
const siteDescription =
  "Free renal physiology lessons, interactive models and explained quizzes. Build understanding, save your progress and review your mistakes.";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: siteTitle,
    template: `%s | ${siteTitle}`,
  },
  description: siteDescription,
  applicationName: siteTitle,
  verification: { google: process.env.GOOGLE_SITE_VERIFICATION || undefined },
  keywords: ["medical sciences", "learning resources", "study guides"],
  openGraph: {
    type: "website",
    siteName: siteTitle,
    title: siteTitle,
    description: siteDescription,
    url: "/",
    locale: "en_US",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `${siteTitle} — Helping students learn medical sciences.`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/opengraph-image"],
  },
  robots: {
    index: isIndexable(),
    follow: isIndexable(),
  },
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#14252c",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <SiteShell>{children}</SiteShell>
        <LearningAnalytics />
      </body>
    </html>
  );
}
