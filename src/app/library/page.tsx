import { ExamPreparation } from "@/components/exam-preparation";
import lessonData from "@/content/library-lessons.json";
import { TopicGuideLinks } from "@/components/topic-guide-links";
import { searchMetadata } from "@/lib/search-metadata";
import { subjectHubs } from "@/content/subject-hubs";
import { librarySubjects } from "@/lib/taxonomy";
import Link from "next/link";
import { studySubjects } from "@/lib/study-collections";
import { CatalogBrowser } from "@/components/catalog-browser";
import { publicCatalog } from "@/lib/catalog";
export const metadata = searchMetadata("/library");
export default async function LibraryPage({
  searchParams,
}: {
  searchParams: Promise<{ subject?: string; q?: string; mode?: string; type?: string }>;
}) {
  const filters = await searchParams;
  const subject =
    typeof filters.subject === "string" &&
    (filters.subject === "genetics-all" || librarySubjects.some((s) => s.id === filters.subject))
      ? filters.subject
      : "";
  const query = typeof filters.q === "string" ? filters.q.slice(0, 200) : "";
  const mode = filters.mode === "exam" ? "exam" : filters.mode === "concept" ? "concept" : "browse";
  const conceptLinks = lessonData.lessons.map(l => ({ id: l.id, title: l.title, worked: "workedExample" in l, prerequisites: ("prerequisites" in l && l.prerequisites ? l.prerequisites : []).flatMap(id => { const p = lessonData.lessons.find(x => x.id === id); return p ? [{ id, title: p.title }] : []; }) }));
  return (
    <div className="site-container library-page">
      <header className="library-heading">
        <p className="eyebrow">Study library</p>
        <h1>{mode === "exam" ? "Examination Preparation" : mode === "concept" ? "Explain a Confusing Concept" : "Find the topic you need"}</h1>
        <p className="interior-lede">
          Browse lessons, practice activities, and available revision resources. Search for a topic or filter by subject and format.
        </p>
      </header>
      <nav className="action-row" aria-label="Library starting points"><Link href="/start#choose-subject">Choose your first free lesson</Link><Link href="/study">Continue my learning</Link><Link href="/starter-pack">Free Study Guide starter pack</Link></nav>
      <details className="study-details"><summary>Choose a free subject learning path</summary><p>Choose a subject, read its recommended first lesson and try the explained quiz. Each lesson links back to this library.</p><nav className="quick-links" aria-label="Free subject learning paths">{Object.entries(subjectHubs).map(([id, hub]) => <Link key={id} href={`/study/${id}`}>{hub.name}</Link>)}</nav></details>
      <details className="study-details" id="printable-notes"><summary>Printable revision notes for all seven subjects</summary><p>Open a subject’s web revision notes, then use Print / Save as PDF. These collect the published lessons and questions; they are not complete source textbooks.</p><nav className="quick-links" aria-label="Printable revision subjects">{studySubjects.map(s => <Link key={s.id} href={`/study/${s.id}/revision`}>{s.title}</Link>)}</nav></details>
      {mode === "exam" ? <ExamPreparation subject={subject} query={query} type={typeof filters.type === "string" ? filters.type : "knowledge"} /> : <CatalogBrowser key={`${subject}:${query}:${mode}`} records={publicCatalog} initialSubject={subject} initialQuery={query} conceptMode={mode === "concept"} conceptLinks={mode === "concept" ? conceptLinks : []} />}
      <TopicGuideLinks />
      <details className="study-details"><summary>Subject directories and video recaps</summary>
      <nav className="library-subjects" aria-label="Explore subjects and topics">
        {studySubjects.map(s => <Link key={s.id} href={s.id === "genetics" ? "/study/genetics" : "/subjects/" + s.id}>{s.title}</Link>)}
      </nav><Link href="/videos">Browse the video library →</Link></details>
      <aside className="library-source-note">
        <p className="eyebrow">Study and revise</p>
        <h2>Read. Connect. Recall.</h2>
        <p>
          Use the explanations, practice questions and available source notes as you study. Save useful resources to return to them in My Study.
        </p>
        <Link href="/study#saved-learning" className="text-link">
          Open My Study →
        </Link>
      </aside>
    </div>
  );
}
