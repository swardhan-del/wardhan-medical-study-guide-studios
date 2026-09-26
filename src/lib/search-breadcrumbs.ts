import catalog from "../content/public-catalog.json" with { type: "json" };
import taxonomy from "../content/library-taxonomy.json" with { type: "json" };
import { canonicalResourcePath } from "./search-pages.ts";
import type { Breadcrumb } from "./structured-data.ts";

export function topicBreadcrumbs(id?: string): Breadcrumb[] {
  const items: Breadcrumb[] = [{ name: "Library", href: "/library" }];
  let node = taxonomy.nodes.find(node => node.id === id);
  if (!node) return items;
  const subjectId = node.subject;
  const subject = taxonomy.subjects.find(subject => subject.id === subjectId)!;
  items.push({ name: subject.title, href: `/subjects/${subject.id}` });
  const lineage = [node];
  while (node.parentId) {
    node = taxonomy.nodes.find(parent => parent.id === node!.parentId)!;
    lineage.unshift(node);
  }
  return [...items, ...lineage.map(node => ({ name: node.title, href: `/topics/${node.id}` }))];
}

export function resourceBreadcrumbs(id: string): Breadcrumb[] {
  const record = catalog.records.find(record => record.id === id);
  if (!record) return [{ name: "Library", href: "/library" }];
  const node = taxonomy.nodes.find(node => node.resources.includes(id));
  return [...topicBreadcrumbs(node?.id), { name: record.title, href: canonicalResourcePath(record) }];
}
