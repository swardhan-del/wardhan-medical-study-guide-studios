import type { BreadcrumbList, Course, Graph, LearningResource } from "schema-dts";

export type Breadcrumb = { name: string; href: string };
export const studioName = "Wardhan Medical Study Guide Studios";
const absolute = (path: string, origin: string) => new URL(path, origin).toString();

export function websiteGraph(origin: string): Graph {
  return { "@context": "https://schema.org", "@graph": [
    { "@type": "Organization", "@id": `${origin}/#studio`, name: studioName, url: origin },
    { "@type": "WebSite", "@id": `${origin}/#website`, name: studioName, url: origin, inLanguage: "en-GB", publisher: { "@id": `${origin}/#studio` } },
  ] };
}

export function breadcrumbSchema(items: readonly Breadcrumb[], origin: string): BreadcrumbList {
  return {
    "@type": "BreadcrumbList", "@id": `${absolute(items.at(-1)!.href, origin)}#breadcrumbs`,
    itemListElement: items.map((item, i) => ({ "@type": "ListItem", position: i + 1, name: item.name, item: absolute(item.href, origin) })),
  };
}

export function lessonSchema(lesson: {
  path: string; title: string; summary: string; citation: string | string[];
  updatedAt?: string; minutes?: number; objectives?: string[]; resourceType?: string;
}, origin: string): LearningResource {
  const url = absolute(lesson.path, origin);
  return {
    "@type": "LearningResource", "@id": `${url}#lesson`, name: lesson.title, description: lesson.summary,
    url, mainEntityOfPage: url, isPartOf: { "@id": `${origin}/#website` },
    learningResourceType: lesson.resourceType ?? "Study lesson", educationalLevel: "Undergraduate",
    inLanguage: "en-GB", isAccessibleForFree: true, author: { "@id": `${origin}/#studio` }, citation: lesson.citation,
    ...(lesson.updatedAt ? { dateModified: lesson.updatedAt } : {}),
    ...(lesson.minutes ? { timeRequired: `PT${lesson.minutes}M` } : {}),
    ...(lesson.objectives ? { teaches: lesson.objectives } : {}),
  };
}

export function courseSchema(course: {
  path: string; title: string; summary: string; lessons: { title: string; path: string }[];
}, origin: string): Course {
  const url = absolute(course.path, origin);
  return {
    "@type": "Course", "@id": `${url}#course`, name: course.title, description: course.summary, url,
    provider: { "@type": "Organization", "@id": `${origin}/#studio`, name: studioName, url: origin },
    inLanguage: "en-GB", isAccessibleForFree: true,
    hasPart: course.lessons.map((lesson) => ({ "@type": "LearningResource", "@id": `${absolute(lesson.path, origin)}#lesson`, name: lesson.title, url: absolute(lesson.path, origin) })),
  };
}

export function collectionGraph(title: string, summary: string, path: string, items: { name: string; href: string }[], origin: string): Graph {
  const url = absolute(path, origin);
  return { "@context": "https://schema.org", "@graph": [
    { "@type": "CollectionPage", "@id": url, name: title, description: summary, url, inLanguage: "en-GB", isPartOf: { "@id": `${origin}/#website` }, mainEntity: { "@id": `${url}#sequence` } },
    { "@type": "ItemList", "@id": `${url}#sequence`, itemListOrder: "https://schema.org/ItemListOrderAscending", numberOfItems: items.length,
      itemListElement: items.map((item, i) => ({ "@type": "ListItem", position: i + 1, name: item.name, url: absolute(item.href, origin) })) },
  ] };
}

export function serializeStructuredData(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
}
