import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const routes = ["/", "/about", "/subjects", "/contact"];

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date("2026-09-04T00:00:00.000Z"),
    changeFrequency: "monthly",
    priority: route === "/" ? 1 : 0.7,
  }));
}
