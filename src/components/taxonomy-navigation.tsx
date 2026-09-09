import { FigureThumbnail } from "./educational-figure";
import { figuresForTopic } from "@/lib/figures";
import Link from "next/link";
import { resourceHref } from "@/lib/catalog-types";
import {
  ancestors,
  librarySubjects,
  resourceNodes,
  taxonomyNodes,
  topicHref,
  recordsForNode,
  type TaxonomyNode,
} from "@/lib/taxonomy";
export function LibraryBreadcrumbs({
  node,
  title,
}: {
  node?: TaxonomyNode;
  title?: string;
}) {
  const subject = librarySubjects.find((s) => s.id === node?.subject);
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <Link href="/library">Library</Link>
      {subject && (
        <>
          <span aria-hidden="true">/</span>
          <Link href={"/subjects/" + subject.id}>{subject.title}</Link>
        </>
      )}
      {node &&
        ancestors(node).map((n) => (
          <span key={n.id}>
            <span aria-hidden="true"> / </span>
            <Link
              href={topicHref(n.id)}
              aria-current={!title && n.id === node.id ? "page" : undefined}
            >
              {n.title}
            </Link>
          </span>
        ))}
      {title && <span aria-current="page"> / {title}</span>}
    </nav>
  );
}
export function ResourceBreadcrumbs({ id }: { id: string }) {
  return <LibraryBreadcrumbs node={resourceNodes(id)[0]} />;
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
