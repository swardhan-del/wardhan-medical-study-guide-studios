import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";
import { indexablePages } from "@/lib/search-pages";

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = getSiteUrl();
  return indexablePages.map((page) => ({
    url: new URL(page.path, origin).toString(),
    ...(page.lastModified ? { lastModified: page.lastModified } : {}),
  }));
}
