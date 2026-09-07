import { SubjectLearningPath } from "@/components/subject-learning-path";
import { LearningCollection } from "@/components/learning-collection";
import Link from "next/link";
import { notFound } from "next/navigation";
import { subjectInterests } from "@/content/subjects";
import { publicCatalog } from "@/lib/catalog";
import { CatalogBrowser } from "@/components/catalog-browser";
import { AnatomyVolumes } from "@/components/anatomy-volumes";
import { AnatomyTopicNav } from "@/components/anatomy-topic-nav";
import { SubjectDirectory } from "@/components/subject-directory";
import { directorySubjects } from "@/lib/subject-directory";
import { AuthoredGuides } from "@/components/authored-guides";
import { HistologyOverview } from "@/components/histology-overview";
import histologyGuides from "@/content/histology-guides.json";
type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() {
  return [
    ...new Set([...subjectInterests, ...directorySubjects].map((s) => s.id)),
  ].map((slug) => ({ slug }));
}
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const subject =
    directorySubjects.find((item) => item.id === slug) ||
    subjectInterests.find((item) => item.id === slug);
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
  const directorySubject = directorySubjects.find((item) => item.id === slug);
  if (!subject && !directorySubject) notFound();
  const title = directorySubject?.title || subject!.title;
  const description = directorySubject?.description || subject!.description;
  const learningId = directorySubject?.learningSubject || subject?.id;
  const isHistology = ["histology", "histology-i", "histology-ii"].includes(slug);
  return (
    <div className="site-container library-page">
      <header className="library-heading">
        <Link href="/subjects" className="text-link">
          ← All subjects
        </Link>
        <p className="eyebrow subject-eyebrow">Subject directory</p>
        <h1>{title}</h1>
        <p className="interior-lede">{description}</p>
        <p>
          {(slug === "genetics" || slug === "immunology" || isHistology) && (
            <><a className="text-link" href="#authored-guides">Open selected study guides ↓</a>{" · "}</>
          )}
          <a className="text-link" href="#archive-directory">
            Browse Dropbox guides & subtopics ↓
          </a>
          {learningId && (
            <>
              {" "}
              ·{" "}
              <a className="text-link" href="#website-lessons">
                Study related website lessons ↓
              </a>
            </>
          )}
        </p>
        {slug === "anatomy" ? (
          <AnatomyTopicNav />
        ) : (
          <ul className="topic-list" aria-label="Subject areas">
            {(subject?.topics || []).map((topic) => (
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
      <SubjectLearningPath subject={slug === "immunology" ? "immunology" : learningId || slug} />
      {learningId && (
        <section
          id="website-lessons"
          className="directory-web-lessons"
          aria-label="Related website lessons"
        >
          <h2>Study related topics on this website</h2>
          <p>
            These web lessons and activities are available here without opening
            Dropbox.
          </p>
          <CatalogBrowser records={publicCatalog} initialSubject={learningId} />
        </section>
      )}
      {isHistology && <HistologyOverview />}
      {isHistology && <AuthoredGuides
        key={slug}
        collection={histologyGuides}
        initialCourse={slug === "histology" ? "" : slug}
        title="Open the curated histology study guides."
        introduction="Read a focused chapter, compare its structures with a slide collection, then explain what you recognize. These nine selected Word guides come directly from the curated Microscopic Anatomy and Histology folder."
        searchHint="Try epithelium, kidney, placenta or retina"
        accessNote="These links open curated study copies; they do not make the source documents public downloads."
      />}
      {(slug === "genetics" || slug === "immunology") && <AuthoredGuides />}
      <details className="study-details archive-disclosure" id="archive-directory"><summary>Explore the Dropbox archive and full subtopic directory</summary><SubjectDirectory id={slug} /></details>

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
    </div>
  );
}
