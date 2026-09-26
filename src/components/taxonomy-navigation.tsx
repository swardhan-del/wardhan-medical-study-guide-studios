import { SearchBreadcrumbs } from "./search-breadcrumbs";
import { topicBreadcrumbs, resourceBreadcrumbs } from "@/lib/search-breadcrumbs";
import type { Breadcrumb } from "@/lib/structured-data";
import { FigureThumbnail } from "./educational-figure";
import { figuresForTopic } from "@/lib/figures";
import Link from "next/link";
import { resourceHref } from "@/lib/catalog-types";
import {
  taxonomyNodes,
  topicHref,
  recordsForNode,
  type TaxonomyNode,
} from "@/lib/taxonomy";
export function LibraryBreadcrumbs({ node, current }: { node?: TaxonomyNode; current?: Breadcrumb }) {
  const items = topicBreadcrumbs(node?.id);
  return <SearchBreadcrumbs items={current ? [...items, current] : items} />;
}
export function ResourceBreadcrumbs({ id }: { id: string }) {
  return <SearchBreadcrumbs items={resourceBreadcrumbs(id)} />;
}
export function TopicCards({
  subject,
  parentId = null,
}: {
  subject: string;
  parentId?: string | null;
}) {
  const nodes = taxonomyNodes.filter(
    (n) => n.subject === subject && n.parentId === parentId,
  );
  const destination = (node: TaxonomyNode) => {
    const records = recordsForNode(node);
    return records.length === 1 && !taxonomyNodes.some(child => child.parentId === node.id) ? resourceHref(records[0]) : topicHref(node.id);
  };
  return (
    <div className="resource-grid taxonomy-grid">
      {nodes.map((n) => (
        <article className="resource-card" key={n.id}>
          <FigureThumbnail figure={figuresForTopic(n.id)[0]} />
          <p className="eyebrow">
            {n.kind} · {recordsForNode(n).length}{" "}
            {recordsForNode(n).length === 1 ? "resource" : "resources"}
          </p>
          <h2>
            <Link href={destination(n)}>{n.title}</Link>
          </h2>
          <p>{n.description}</p>
          <Link className="text-link" href={destination(n)}>
            Open available learning →
          </Link>
        </article>
      ))}
    </div>
  );
}
