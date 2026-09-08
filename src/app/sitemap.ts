import { publicVideos } from "@/lib/videos";
import { renalLessons, renalLessonHref } from "@/content/renal-course";
import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";
import { subjectInterests } from "@/content/subjects";
import { publicCatalog } from "@/lib/catalog";
import {
  librarySubjects as directorySubjects,
  taxonomyNodes,
  topicHref,
} from "@/lib/taxonomy";
import {
  anatomyTopicLinks,
  anatomyTopicHref,
} from "@/content/anatomy-navigation";
export default function sitemap(): MetadataRoute.Sitemap {
  const origin = getSiteUrl();
  const routes = [
    "/",
    "/about",
    "/subjects",
    "/library",
    "/videos",
    ...publicVideos.map((v) => "/videos/" + v.id),
    ...taxonomyNodes.map((n) => topicHref(n.id)),
    "/contact",
    "/privacy",
    "/learn/renal",
    "/practice/renal-challenge",
    "/practice/physiology",
    "/practice/oral",
    "/practice/histology",
    ...renalLessons.map((l) => renalLessonHref(l.slug)),
    ...anatomyTopicLinks.map((topic) => anatomyTopicHref(topic.slug)),
    ...[
      ...new Set(
        [...subjectInterests, ...directorySubjects].map(
          (subject) => subject.id,
        ),
      ),
    ].map((id) => `/subjects/${id}`),
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
