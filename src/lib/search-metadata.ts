import type { Metadata } from "next";
import { searchPage } from "./search-pages.ts";
import { getSiteUrl, isIndexable } from "./site-url.ts";
export const siteName = "Wardhan Medical Study Guide Studios";
export function searchMetadata(path: string): Metadata {
  const page = searchPage(path);
  const title = `${page?.title || "Page not found"} | Study Guide Studios`;
  const description = page?.description || "This page is not available. Browse the public medical study library to find a lesson.";
  const url = new URL(page?.canonical || path, getSiteUrl()).toString();
  const image = new URL(path.startsWith("/learn/renal") || path === "/practice/renal-challenge" ? "/learn/renal/opengraph-image" : "/opengraph-image", getSiteUrl()).toString();
  return {
    title: { absolute: title }, description,
    alternates: { canonical: url },
    robots: { index: isIndexable() && Boolean(page?.index), follow: !path.startsWith("/review") },
    openGraph: { type: "website", siteName, title, description, url, locale: "en_GB", images: [{ url: image, width: 1200, height: 630, alt: siteName + " — Free medical-science study resources" }] },
    twitter: { card: "summary_large_image", title, description, images: [{ url: image, alt: siteName + " — Free medical-science study resources" }] },
  };
}
