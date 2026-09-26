import Link from "next/link";
import { topicGuides } from "@/content/topic-guides";

export function TopicGuideLinks({ subject, lessonId }: { subject?: string; lessonId?: string }) {
  const guides = topicGuides.filter(guide => (!subject || (guide.subjects as readonly string[]).includes(subject)) && (!lessonId || guide.stages.some(stage => stage.id === lessonId)));
  if (!guides.length) return null;
  return <section className="study-panel topic-guide-links" aria-label="Guided topic sequences">
    <p className="eyebrow">Connect your learning</p>
    <h2>Follow a focused topic sequence</h2>
    <ul>{guides.map(guide => <li key={guide.slug}><Link href={`/learn/topics/${guide.slug}`}>{guide.title}</Link><p>{guide.summary}</p></li>)}</ul>
    <Link className="text-link" href="/learn/topics">Explore all guided topic sequences →</Link>
  </section>;
}
