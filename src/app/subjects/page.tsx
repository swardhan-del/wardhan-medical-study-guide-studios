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
export const metadata = {
  title: "Medical subjects",
  description:
    "Browse medical subjects, systems, topics and available study resources.",
  alternates: { canonical: "/subjects" },
};
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
            {s.id === "histology" && <nav className="quick-links" aria-label="Histology course filters"><Link href="/library?subject=histology-i">Histology I subset</Link><Link href="/library?subject=histology-ii">Histology II subset</Link></nav>}
            {s.id === "genetics" && <nav className="quick-links" aria-label="Genetics and immunology filters"><Link href="/library?subject=genetics">Medical Genetics subset</Link><Link href="/library?subject=immunology">Immunology subset</Link></nav>}
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
      <section className="study-panel" aria-labelledby="planned-subjects"><h2 id="planned-subjects">Subjects without published lessons</h2><p>Microbiology &amp; Antimicrobials and Biostatistics do not yet have public lessons. Choose one of the seven subjects above to study now.</p><div className="quick-links"><Link href="/subjects/microbiology">Microbiology availability</Link><Link href="/subjects/biostatistics">Biostatistics availability</Link></div></section>
      <h2 className="native-section-title">Find a topic across subjects</h2>
      <TopicSearch
        items={taxonomyNodes.map((n) => ({
          id: n.id,
          title: taxonomyNodes.some(other => other.id !== n.id && other.subject === n.subject && other.title === n.title) ? `${n.title} — ${n.parentId ? "focused topic" : "topic collection"}` : n.title,
          subject: librarySubjects.find(s => s.id === n.subject)?.learningSubject || n.subject,
          subjectTitle: studySubjects.find(s => s.id === (librarySubjects.find(item => item.id === n.subject)?.learningSubject || n.subject))!.title,
          kind: n.kind,
          count: recordsForNode(n).length,
        }))}
      />
    </div>
  );
}
