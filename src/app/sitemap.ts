import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";
import { subjectInterests } from "@/content/subjects";
import { publicCatalog } from "@/lib/catalog";
import { anatomyTopicLinks, anatomyTopicHref } from "@/content/anatomy-navigation";
export default function sitemap(): MetadataRoute.Sitemap {
  const origin = getSiteUrl();
  const routes = [
    "/",
    "/about",
    "/subjects",
    "/library",
    "/contact",
    "/privacy",
    ...anatomyTopicLinks.map((topic) => anatomyTopicHref(topic.slug)),
    ...subjectInterests.map((subject) => `/subjects/${subject.id}`),
  ];
  return [
    ...routes.map((route) => ({
      url: `${origin}${route}`,
      priority: route === "/" ? 1 : 0.7,
    })),
    ...publicCatalog.map((record) => ({
      url: `${origin}/library/${record.id}`,
      lastModified: record.updatedAt,
      priority: 0.8,
    })),
  ];
}
