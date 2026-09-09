import { availableLessons, studentSubjects, subjectDestination } from "@/lib/student-subjects";
import Link from "next/link";

export function SubjectCard({ subject }: { subject: { id: string; title: string; description: string } }) {
  const count = availableLessons(subject.id).length;
  return (
    <article className="subject-card" id={subject.id}>
      <div className="subject-card-topline">
        <span className="subject-number">{String(studentSubjects.findIndex(s => s.id === subject.id) + 1).padStart(2, "0")}</span>
        <span className="status-chip">
          {count ? `${count} available lessons` : "No public lessons released"}
        </span>
      </div>
      <h3>{subject.title}</h3>
      <p>{subject.description}</p>
      <Link
        className="card-link"
        href={subjectDestination(subject.id)}
        aria-label={`Explore subject for ${subject.title}`}
      >
        Explore subject <span aria-hidden="true">↗</span>
      </Link>
    </article>
  );
}
