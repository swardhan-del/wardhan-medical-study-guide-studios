import Link from "next/link";
import type { SubjectInterest } from "@/content/subjects";

export function SubjectCard({ subject }: { subject: SubjectInterest }) {
  return (
    <article className="subject-card" id={subject.id}>
      <div className="subject-card-topline">
        <span className="subject-number">{subject.number}</span>
        <span className="status-chip">Public release in preparation</span>
      </div>
      <h3>{subject.title}</h3>
      <p>{subject.description}</p>
      <Link className="card-link" href={`/subjects#${subject.id}`} aria-label={`View availability for ${subject.title}`}>
        View availability <span aria-hidden="true">↗</span>
      </Link>
    </article>
  );
}
