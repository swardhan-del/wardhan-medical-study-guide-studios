import { LearningCollection } from "@/components/learning-collection";
import Link from "next/link";
import { notFound } from "next/navigation";
import { subjectInterests } from "@/content/subjects";
import { publicCatalog } from "@/lib/catalog";
import { CatalogBrowser } from "@/components/catalog-browser";
import { AnatomyVolumes } from "@/components/anatomy-volumes";
import { AnatomyTopicNav } from "@/components/anatomy-topic-nav";
type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() {
  return subjectInterests.map((subject) => ({ slug: subject.id }));
}
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const subject = subjectInterests.find((item) => item.id === slug);
  return subject
    ? {
        title: subject.title,
        description: subject.description,
        alternates: { canonical: `/subjects/${slug}` },
      }
    : { title: "Subject not found" };
}
export default async function SubjectPage({ params }: Props) {
  const { slug } = await params;
  const subject = subjectInterests.find((item) => item.id === slug);
  if (!subject) notFound();
  return (
    <div className="site-container library-page">
      <header className="library-heading">
        <Link href="/subjects" className="text-link">
          ← All subjects
        </Link>
        <p className="eyebrow subject-eyebrow">Subject {subject.number}</p>
        <h1>{subject.title}</h1>
        <p className="interior-lede">{subject.description}</p>
        {slug === "anatomy" ? (
          <AnatomyTopicNav />
        ) : (
          <ul className="topic-list" aria-label="Subject areas">
            {subject.topics.map((topic) => (
              <li key={topic}>
                <Link
                  href={`/library?subject=${slug}&q=${encodeURIComponent(topic)}`}
                >
                  {topic}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </header>
      <CatalogBrowser records={publicCatalog} initialSubject={slug} />
      {slug === "anatomy" ? <AnatomyVolumes /> : null}
      {slug === "physiology" && <LearningCollection compact />}
      {slug === "histology" && (
        <section className="study-panel">
          <h2>Histology detective</h2>
          <p>
            Identify renal tubules from structural clues, then connect their
            appearance to their transport functions.
          </p>
          <Link className="button button-primary" href="/practice/histology">
            Explore the renal tubule schematics →
          </Link>
        </section>
      )}
      {!["anatomy", "physiology", "histology"].includes(slug) &&
        !publicCatalog.some((record) => record.subject === slug) && (
          <section className="study-panel">
            <h2>This collection is in preparation.</h2>
            <p>
              Explore the free renal course and existing anatomy pages while
              more subject lessons are prepared.
            </p>
            <Link className="text-link" href="/library">
              Explore the learning library →
            </Link>
          </section>
        )}
    </div>
  );
}
