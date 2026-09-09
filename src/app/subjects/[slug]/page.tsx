import { studySubjects } from "@/lib/study-collections";
import { AnatomyTopicNav } from "@/components/anatomy-topic-nav";
import { SubjectLearningPath } from "@/components/subject-learning-path";
import Link from "next/link";
import { notFound } from "next/navigation";
import { librarySubjects, subjectRecords } from "@/lib/taxonomy";
import { TopicCards } from "@/components/taxonomy-navigation";
import { CatalogBrowser } from "@/components/catalog-browser";
import { AnatomyVolumes } from "@/components/anatomy-volumes";
import { HistologyOverview } from "@/components/histology-overview";
type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() {
  return librarySubjects.map((s) => ({ slug: s.id }));
}
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const s = librarySubjects.find((s) => s.id === slug);
  return {
    title: s?.title || "Subject not found",
    description: s?.description,
    alternates: { canonical: "/subjects/" + slug },
  };
}
export default async function SubjectPage({ params }: Props) {
  const { slug } = await params;
  const s = librarySubjects.find((s) => s.id === slug);
  if (!s) notFound();
  const records = subjectRecords(slug);
  return (
    <div className="site-container library-page">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link href="/library">Library</Link>
        <span aria-hidden="true">/</span>
        <Link href="/subjects">Subjects</Link>
        <span aria-current="page"> / {s.title}</span>
      </nav>
      <header className="library-heading">
        <p className="eyebrow">Subject reference directory</p>
        <h1>{s.title}</h1>
        <p className="interior-lede">{slug === "histology" ? "Learn to identify tissues by their architecture, cells, and extracellular features. Connect what you see with how the tissue functions and develops." : s.description}</p>
      </header>
      {studySubjects.some(study => study.id === (s.learningSubject || slug)) && <div className="action-row"><Link className="button button-primary" href={s.learningSubject !== slug || slug === "genetics" ? "/library?subject=" + slug : "/study/" + slug}>Open subject lessons</Link></div>}
      {slug === "anatomy" && <AnatomyTopicNav />}
      {records.length === 0 ? (
        <section className="catalog-empty"><h2>No public lessons yet</h2><p>No resources have been released for this subject yet. Choose another subject to begin studying today.</p><Link className="button button-primary" href="/subjects">Choose a subject with lessons</Link></section>
      ) : (
        <section id="website-lessons">
          <span id="authored-guides" />
          <h2 className="native-section-title">Lessons and study resources</h2>
          <CatalogBrowser records={records} />
        </section>
      )}
      {records.length > 0 && <details className="study-details"><summary>Browse the regional directory and suggested sequence</summary>
      <SubjectLearningPath subject={slug === "immunology" ? slug : s.learningSubject || slug} />
      <section id="archive-directory" aria-label="Systems and topics">
        <span id="dropbox-directory" />
        <h2>Systems and topics</h2>
        <TopicCards subject={slug} />
      </section>
      </details>}
      {slug === "anatomy" && <AnatomyVolumes />}
      {slug === "histology" && <HistologyOverview />}
    </div>
  );
}
