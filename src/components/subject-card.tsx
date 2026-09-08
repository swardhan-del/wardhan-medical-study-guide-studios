import { publicCatalog } from "@/lib/catalog";
import Link from "next/link";
import type { SubjectInterest } from "@/content/subjects";

export function SubjectCard({ subject }: { subject: SubjectInterest }) {
  const count = publicCatalog.filter(
    (record) => record.subject === subject.id,
  ).length;
  return (
    <article className="subject-card" id={subject.id}>
      <div className="subject-card-topline">
        <span className="subject-number">{subject.number}</span>
        <span className="status-chip">
          {count ? `${count} study resources` : "No resources available yet"}
        </span>
      </div>
      <h3>{subject.title}</h3>
      <p>{subject.description}</p>
      <Link
        className="card-link"
        href={`/subjects/${subject.id}`}
        aria-label={`Explore subject for ${subject.title}`}
      >
        Explore subject <span aria-hidden="true">↗</span>
      </Link>
    </article>
  );
}
