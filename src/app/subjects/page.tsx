import { FigureThumbnail } from "@/components/educational-figure";
import { figureForSubject } from "@/lib/figures";
import Link from "next/link";
import {
  librarySubjects,
  taxonomyNodes,
  recordsForNode,
  subjectRecords,
} from "@/lib/taxonomy";
import { subjectLessons } from "@/lib/study-collections";
import { TopicSearch } from "@/components/topic-search";
export const metadata = {
  title: "Medical subjects",
  description:
    "Browse medical subjects, systems, topics and available study resources.",
  alternates: { canonical: "/subjects" },
};
export default function SubjectsPage() {
  const available = (id: string) => subjectRecords(id);
  const lessonCount = (id: string) => available(id).filter(r => r.kind === "Study lesson" || r.kind === "Renal course lesson").length;
  const landing = (id: string) => subjectLessons(id).length && id !== "genetics" ? `/study/${id}` : available(id).length ? `/library?subject=${id}` : `/subjects/${id}`;
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
        {librarySubjects.map((s) => (
          <article className="directory-subject-card" key={s.id}>
            <FigureThumbnail figure={figureForSubject(s.id)} />
            <h2>
              <Link href={landing(s.id)}>{s.title}</Link>
            </h2>
            <p>{s.description}</p>
            <p>{available(s.id).length ? `${lessonCount(s.id)} concept/course lessons · ${available(s.id).length - lessonCount(s.id)} activities, topic collections or revision resources` : "No public lessons released yet"}</p>
            {s.learningSubject && s.learningSubject !== s.id && <p className="muted-note">A filtered part of the {s.learningSubject === "genetics" ? "genetics and immunology" : s.learningSubject} collection. Shared lessons are not additional content.</p>}
            {available(s.id).length > 0 && <p><Link className="button button-primary" href={landing(s.id)}>Open available lessons</Link></p>}
            <Link
              className="text-link"
              aria-label={"Explore subject for " + s.title}
              href={"/subjects/" + s.id}
            >
              Reference directory →
            </Link>
          </article>
        ))}
      </section>
      <h2 className="native-section-title">Find a topic across subjects</h2>
      <TopicSearch
        items={taxonomyNodes.map((n) => ({
          id: n.id,
          title: n.title,
          subject: n.subject,
          subjectTitle: librarySubjects.find((s) => s.id === n.subject)!.title,
          kind: n.kind,
          count: recordsForNode(n).length,
        }))}
      />
    </div>
  );
}
