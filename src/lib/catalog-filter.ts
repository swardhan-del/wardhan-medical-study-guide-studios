import type { CatalogRecord } from "./catalog-types";
const normalize = (value: string) =>
  value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[–—−]/g, "-");
export function matchesCatalogQuery(
  record: CatalogRecord,
  query: string,
  subjectTitle = "",
) {
  const haystack = normalize(
    [
      record.title,
      record.summary,
      record.kind,
      subjectTitle,
      ...(record.tags ?? []),
    ].join(" "),
  );
  return normalize(query)
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => haystack.includes(word));
}
