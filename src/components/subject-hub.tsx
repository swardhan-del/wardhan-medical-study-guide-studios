import Link from "next/link";
import { subjectHubs } from "@/content/subject-hubs";
import styles from "./subject-hub.module.css";

export function SubjectHubOverview({ subject }: { subject: string }) {
  const hub = subjectHubs[subject];
  if (!hub) return null;
  return <section className={`study-panel ${styles.overview}`} aria-labelledby="subject-overview-title">
    <div>
      <h2 id="subject-overview-title">What you will study</h2><p>{hub.covers}</p>
      <h3>Why it matters</h3><p>{hub.why}</p>
    </div>
    <div className={styles.firstLesson}>
      <p className="eyebrow">Recommended first lesson · Free</p>
      <h3>{hub.firstTitle}</h3><p>{hub.firstReason}</p>
      <div className="action-row">
        <Link className="button button-primary" href={`/library/${hub.firstLesson}`}>Start learning</Link>
        <Link className="text-link" href={`/library/${hub.firstLesson}#concept-check-title`}>Try the first quiz</Link>
      </div>
      <p className="muted-note">No account needed. Questions, notes and review selections are saved in this browser when storage is available.</p>
    </div>
  </section>;
}

export function SubjectTopicMap({ subject }: { subject: string }) {
  const hub = subjectHubs[subject];
  if (!hub?.topics.length) return null;
  return <section className="study-panel" id="subject-topic-map" aria-labelledby="subject-topic-map-title">
    <p className="eyebrow">Suggested course map</p>
    <h2 id="subject-topic-map-title">{hub.name} topic map</h2>
    <p>Follow the sequence or choose the topic you need. Each stage links to an available lesson; this map is a starting route through the library, not a complete university syllabus.</p>
    <ol className={styles.topicMap}>{hub.topics.map((topic, index) => <li key={topic.lesson}>
      <span className={styles.number} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
      <div><h3><Link href={`/library/${topic.lesson}`}>{topic.title} →</Link></h3><p>{topic.description}</p></div>
    </li>)}</ol>
    <nav className="action-row" aria-label="Continue through the subject">
      <a className="text-link" href="#subject-lessons">Browse every available lesson</a>
      <Link className="text-link" href="/library">Return to the library</Link>
    </nav>
  </section>;
}
