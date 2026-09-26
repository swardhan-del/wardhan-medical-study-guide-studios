import { subjectHubs } from "@/content/subject-hubs";
import { studySubjects, subjectLessons } from "@/lib/study-collections";
import Link from "next/link";

export function SubjectCard({ subject }: { subject: { id: string; title: string; description: string } }) {
  const hub = subjectHubs[subject.id];
  const count = subjectLessons(subject.id).length + (subject.id === "physiology" ? 8 : 0);
  return (
    <article className="subject-card" id={subject.id}>
      <div className="subject-card-topline">
        <span className="subject-number">{String(studySubjects.findIndex(s => s.id === subject.id) + 1).padStart(2, "0")}</span>
        <span className="status-chip">
          {count ? `${count} available lessons` : "No public lessons released"}
        </span>
      </div>
      <h3>{subject.title}</h3>
      <p>{subject.description}</p>
      <Link
        className="card-link"
        href={`/study/${subject.id}`}
        aria-label={`Explore subject for ${subject.title}`}
      >
        Explore subject <span aria-hidden="true">↗</span>
      </Link>
      <div className="action-row">
        <Link className="text-link" href={`/library/${hub.firstLesson}`} aria-label={`Start lesson for ${subject.title}`}>Start lesson</Link>
        <Link className="text-link" href={`/library/${hub.firstLesson}#concept-check-title`} aria-label={`Try the quiz for ${subject.title}`}>Try the quiz</Link>
      </div>
    </article>
  );
}
