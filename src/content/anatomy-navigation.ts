export const anatomyTopicLinks = [
  { slug: "regional-anatomy", label: "Regional anatomy" },
  { slug: "thorax", label: "Thorax" },
  { slug: "abdomen", label: "Abdomen" },
  { slug: "musculoskeletal", label: "Musculoskeletal system" },
  { slug: "embryology", label: "Embryology" },
] as const;

export function anatomyTopicHref(slug: string) {
  return `/subjects/anatomy/${slug}`;
}
