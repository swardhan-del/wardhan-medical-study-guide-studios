import Link from "next/link";
import { notFound } from "next/navigation";
import { subjectInterests } from "@/content/subjects";
import { publicCatalog } from "@/lib/catalog";
import { CatalogBrowser } from "@/components/catalog-browser";
import { AnatomyVolumes } from "@/components/anatomy-volumes";
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
        <ul className="topic-list" aria-label="Subject areas">
          {subject.topics.map((topic) => (
            <li key={topic}>{topic}</li>
          ))}
        </ul>
      </header>
      {slug === "anatomy" ? <AnatomyVolumes /> : null}
      {slug !== "anatomy" || publicCatalog.some((record) => record.subject === slug) ? <CatalogBrowser
        records={publicCatalog.filter((record) => record.subject === slug)}
        initialSubject={slug}
      /> : null}
    </div>
  );
}
