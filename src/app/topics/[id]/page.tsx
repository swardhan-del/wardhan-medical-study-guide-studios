import { FigureGallery } from "@/components/educational-figure";
import { figuresForTopic } from "@/lib/figures";
import Link from "next/link";
import { notFound } from "next/navigation";
import { taxonomyNodes, recordsForNode, topicHref } from "@/lib/taxonomy";
import {
  LibraryBreadcrumbs,
  TopicCards,
} from "@/components/taxonomy-navigation";
import { CatalogBrowser } from "@/components/catalog-browser";
import { resourceHref } from "@/lib/catalog-types";
type Props = { params: Promise<{ id: string }> };
export function generateStaticParams() {
  return taxonomyNodes.map((n) => ({ id: n.id }));
}
export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const n = taxonomyNodes.find((n) => n.id === id);
  return {
    title: n?.title || "Topic not found",
    description: n?.description,
    alternates: { canonical: topicHref(id) },
  };
}
export default async function TopicPage({ params }: Props) {
  const { id } = await params;
  const n = taxonomyNodes.find((n) => n.id === id);
  if (!n) notFound();
  const resources = recordsForNode(n);
  const siblings = taxonomyNodes.filter(
    (s) =>
      s.subject === n.subject && s.parentId === n.parentId && s.id !== n.id,
  );
  return (
    <div className="site-container library-page">
      <LibraryBreadcrumbs node={n} />
      <header className="library-heading">
        <p className="eyebrow">{n.kind}</p>
        <h1>{n.title}</h1>
        <p className="interior-lede">{n.description}</p>
      </header>
      <TopicCards subject={n.subject} parentId={n.id} />
      <section aria-label="Topic resources">
        <h2 className="native-section-title">Available resources</h2>
        {resources.length === 1 ? <article className="study-panel"><h3>{resources[0].title}</h3><p>{resources[0].summary}</p><Link className="button button-primary" href={resourceHref(resources[0])}>{resources[0].kind.includes("outline") || resources[0].id === "anatomy-musculoskeletal" ? "Open available study outline" : "Open learning resource"}</Link></article> : <CatalogBrowser records={resources} />}
      </section>
      <FigureGallery
        figures={figuresForTopic(n.id)}
        comparison={
          n.id.includes("epithelia") || n.id.includes("basic-tissues")
        }
      />
      {siblings.length > 0 && (
        <nav className="native-related" aria-label="Related topics">
          <h2>Continue exploring</h2>
          <ul>
            {siblings.map((s) => (
              <li key={s.id}>
                <Link href={topicHref(s.id)}>{s.title}</Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
