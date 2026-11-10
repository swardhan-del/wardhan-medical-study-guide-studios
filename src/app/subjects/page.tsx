import { searchMetadata } from "@/lib/search-metadata";
import { FigureThumbnail } from "@/components/educational-figure";
import { figureForSubject } from "@/lib/figures";
import Link from "next/link";
import {
  librarySubjects,
  taxonomyNodes,
  recordsForNode,
  subjectRecords,
} from "@/lib/taxonomy";
import { studySubjects, subjectLessons } from "@/lib/study-collections";
import { TopicSearch } from "@/components/topic-search";
export const metadata = searchMetadata("/subjects");
export default function SubjectsPage() {
  const available = (id: string) => subjectRecords(id);
  const landing = (id: string) => `/study/${id}`;
  return (
    <div className="site-container library-page">
      <header className="library-heading">
        <p className="eyebrow">Medical library</p>
        <h1>Explore the medical sciences</h1>
        <p className="interior-lede">
          Choose a subject learning path to start a lesson and see topic coverage. Use the directory below each path to explore resources by topic.
        </p>
      </header>
      <section
        aria-label="Browse by subject"
        className="directory-subject-grid"
      >
        {studySubjects.map((s) => (
          <article className="directory-subject-card" key={s.id}>
            <FigureThumbnail figure={figureForSubject(s.id)} />
            <h2>
              <Link href={landing(s.id)}>{s.title}</Link>
            </h2>
            <p>{s.description}</p>
            <p>{available(s.id).length ? `${subjectLessons(s.id).length} focused introductions${s.id === "physiology" ? " + 8 renal course lessons" : ""}` : "No public lessons released yet"}</p>
            <p className="muted-note">Focused introductions and practice; full syllabus coverage is not yet available.</p>
            {s.id === "histology" && <nav className="quick-links" aria-label="Histology course filters"><Link href="/subjects/histology-i">Histology I learning path</Link><Link href="/subjects/histology-ii">Histology II learning path</Link></nav>}
            {s.id === "genetics" && <nav className="quick-links" aria-label="Genetics and immunology filters"><Link href="/subjects/genetics">Medical Genetics learning path</Link><Link href="/subjects/immunology">Immunology learning path</Link></nav>}
            {available(s.id).length > 0 && <p><Link className="button button-primary" href={landing(s.id)}>Open available lessons</Link></p>}
            <Link
              className="text-link"
              aria-label={"Explore subject for " + s.title}
              href={s.id === "genetics" ? "/library?subject=genetics-all" : "/subjects/" + s.id}
            >
              Reference directory →
            </Link>
          </article>
        ))}
      </section>
      <section className="study-panel" aria-labelledby="statistics-foundations"><h2 id="statistics-foundations">Biostatistics foundations</h2><p>Start with four worked introductions to histograms, centre, spread and the uncertainty of a mean. The wider statistics curriculum is still being developed.</p><div className="quick-links"><Link href="/library/histogram-bin-counts-example">Start with histograms</Link><Link href="/subjects/biostatistics">Explore Biostatistics</Link></div></section>
      <h2 className="native-section-title">Find a topic across subjects</h2>
      <TopicSearch
        items={taxonomyNodes.map((n) => ({
          id: n.id,
          title: taxonomyNodes.some(other => other.id !== n.id && other.subject === n.subject && other.title === n.title) ? `${n.title} — ${n.parentId ? "focused topic" : "topic collection"}` : n.title,
          subject: librarySubjects.find(s => s.id === n.subject)?.learningSubject || n.subject,
          subjectTitle: studySubjects.find(s => s.id === (librarySubjects.find(item => item.id === n.subject)?.learningSubject || n.subject))?.title || librarySubjects.find(s => s.id === n.subject)!.title,
          kind: n.kind,
          count: recordsForNode(n).length,
        }))}
      />
    </div>
  );
}
