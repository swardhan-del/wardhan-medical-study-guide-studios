import Link from "next/link";
import { topicGuides } from "@/content/topic-guides";
import lessonData from "@/content/library-lessons.json";

export function TopicGuideLinks({ subject, lessonId }: { subject?: string; lessonId?: string }) {
  const guides = topicGuides.filter(guide => (!subject || (guide.subjects as readonly string[]).includes(subject)) && (!lessonId || guide.stages.some(stage => stage.id === lessonId)));
  if (!guides.length) return null;
  return <section className="study-panel topic-guide-links" aria-label="Guided topic sequences">
    <p className="eyebrow">Connect your learning</p>
    <h2>Follow a focused topic sequence</h2>
    <ul>{guides.map(guide => {
      const index = guide.stages.findIndex(stage => stage.id === lessonId);
      const next = index >= 0 ? guide.stages[index + 1] : undefined;
      const nextLesson = next ? lessonData.lessons.find(lesson => lesson.id === next.id) : undefined;
      return <li key={guide.slug}><Link href={`/learn/topics/${guide.slug}`}>{guide.title}</Link><p>{guide.summary}</p>
        {index >= 0 && <nav aria-label={`Continue ${guide.title}`}>
          <p>Step {index + 1} of {guide.stages.length} in this sequence.</p>
          {nextLesson ? <Link href={`/library/${nextLesson.id}`}>Next in this sequence: {nextLesson.title} →</Link>
            : <Link href={`/learn/topics/${guide.slug}#review-connections`}>Review the connections in this sequence →</Link>}
        </nav>}
      </li>;
    })}</ul>
    <Link className="text-link" href="/learn/topics">Explore all guided topic sequences →</Link>
  </section>;
}
