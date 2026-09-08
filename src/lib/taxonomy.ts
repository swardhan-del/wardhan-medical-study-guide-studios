import data from "@/content/library-taxonomy.json";
import catalog from "@/content/public-catalog.json";
import type { CatalogRecord } from "./catalog-types";
export const librarySubjects = data.subjects;
export const taxonomyNodes = data.nodes;
export type TaxonomyNode = (typeof taxonomyNodes)[number];
export const topicHref = (id: string) => "/topics/" + id;
export function ancestors(node: TaxonomyNode): TaxonomyNode[] {
  const result: TaxonomyNode[] = [];
  let current: TaxonomyNode | undefined = node;
  while (current) {
    result.unshift(current);
    current = taxonomyNodes.find((n) => n.id === current!.parentId);
  }
  return result;
}
export function resourceNodes(id: string) {
  return taxonomyNodes.filter((n) => n.resources.includes(id));
}
export function recordsForNode(node: TaxonomyNode): CatalogRecord[] {
  const ids = new Set(node.resources);
  const visit = (id: string) => {
    for (const child of taxonomyNodes.filter((n) => n.parentId === id)) {
      child.resources.forEach((r) => ids.add(r));
      visit(child.id);
    }
  };
  visit(node.id);
  return (catalog.records as CatalogRecord[]).filter((r) => ids.has(r.id));
}
export function subjectRecords(id: string): CatalogRecord[] {
  const ids = new Set(
    taxonomyNodes.filter((n) => n.subject === id).flatMap((n) => n.resources),
  );
  return (catalog.records as CatalogRecord[]).filter((r) => ids.has(r.id));
}
