import Link from "next/link";
import { resolvedLinks } from "@/lib/content-quality";
import { qualityLessons } from "@/lib/quality-lessons";
import type { LessonQuality } from "@/lib/content-quality-types";

const labels = { prerequisite: "Useful preparation", next: "Next lesson", related: "Related lessons", compare: "Compare these concepts" };
export function RelatedLearning({ lessonId, links }: { lessonId: string; links: LessonQuality["links"] }) {
  const groups = resolvedLinks(lessonId, links, qualityLessons);
  if (!groups.length) return null;
  return <nav aria-label="Related learning" className="quality-learning-links">
    {groups.map(group => <div key={group.kind}>
      <h3>{labels[group.kind]}</h3>
      <ul>{group.lessons.map(lesson => <li key={lesson.id}><Link href={lesson.href}>{lesson.title}</Link></li>)}</ul>
    </div>)}
  </nav>;
}
