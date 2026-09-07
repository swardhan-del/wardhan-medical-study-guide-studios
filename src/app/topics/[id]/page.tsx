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
        <CatalogBrowser records={recordsForNode(n)} />
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
