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
              <Link href={(subjectLessons(s.id).length ? "/study/" : "/subjects/") + s.id}>{s.title}</Link>
            </h2>
            <p>{s.description}</p>
            <p>{subjectLessons(s.id).length > 0 && <>{subjectLessons(s.id).length} lesson introductions · </>}{subjectRecords(s.id).length} library resources across formats</p>
            {subjectLessons(s.id).length > 0 && <p><Link className="button button-primary" href={"/study/" + s.id}>Open learning path and coverage</Link></p>}
            <Link
              className="text-link"
              aria-label={"Explore subject for " + s.title}
              href={"/subjects/" + s.id}
            >
              Browse subtopics →
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
