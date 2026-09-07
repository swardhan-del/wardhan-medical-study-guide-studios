import { FigureThumbnail } from "@/components/educational-figure";
import { figureForSubject } from "@/lib/figures";
import Link from "next/link";
import {
  librarySubjects,
  taxonomyNodes,
  recordsForNode,
  subjectRecords,
} from "@/lib/taxonomy";
import { TopicSearch } from "@/components/topic-search";
export const metadata = {
  title: "Medical subjects",
  description:
    "Browse medical subjects, systems, topics and released resources on this website.",
  alternates: { canonical: "/subjects" },
};
export default function SubjectsPage() {
  return (
    <div className="site-container library-page">
      <header className="library-heading">
        <p className="eyebrow">Medical library</p>
        <h1>Your subjects. Connected.</h1>
        <p className="interior-lede">
          Explore systems and topics, read a lesson, then practice or download a
          released resource.
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
              <Link href={"/subjects/" + s.id}>{s.title}</Link>
            </h2>
            <p>{s.description}</p>
            <p>{subjectRecords(s.id).length} resources available</p>
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
