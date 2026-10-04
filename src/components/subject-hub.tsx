import Link from "next/link";
import { subjectHubs } from "@/content/subject-hubs";
import { curriculumOrders, curriculumStartHref } from "@/content/curriculum-order";
import styles from "./subject-hub.module.css";

export function SubjectHubOverview({ subject }: { subject: string }) {
  const hub = subjectHubs[subject];
  if (!hub) return null;
  const order = curriculumOrders[subject];
  const hasPlannedStart = !order.orientation;
  return <section className={`study-panel ${styles.overview}`} aria-labelledby="subject-overview-title">
    <div>
      <h2 id="subject-overview-title">What you will study</h2><p>{hub.covers}</p>
      <h3>Why it matters</h3><p>{hub.why}</p>
    </div>
    <div className={styles.firstLesson}>
      <p className="eyebrow">{hasPlannedStart ? `Start here · ${order.stages[0].title}` : "Recommended first lesson · Free"}</p>
      {hasPlannedStart && <p>{hub.firstReason}</p>}
      {hasPlannedStart && <><p className="muted-note">The full first foundation is planned. The course map distinguishes available teaching from gaps.</p><Link className="text-link" href={curriculumStartHref(subject)}>View the beginner-first sequence</Link></>}
      <h3>{hasPlannedStart ? "Available lesson to try: " : ""}{hub.firstTitle}</h3>
      {!hasPlannedStart && <p>{hub.firstReason}</p>}
      <div className="action-row">
        <Link className="button button-primary" href={`/library/${hub.firstLesson}`}>Start learning</Link>
        <Link className="text-link" href={`/library/${hub.firstLesson}#concept-check-title`}>Try the first quiz</Link>
      </div>
      <p className="muted-note">No account needed. Questions, notes and review selections are saved in this browser when storage is available.</p>
    </div>
  </section>;
}

// The same stages serve the subject map, directory path and Start Here preview.
export function CurriculumStages({ subject, limit }: { subject: string; limit?: number }) {
  return <ol className={styles.topicMap} data-curriculum={subject}>{curriculumOrders[subject].stages.slice(0, limit).map((stage, index) => <li key={stage.id} data-curriculum-stage={stage.id}>
    <span className={styles.number} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
    <div><h3>{curriculumOrders[subject].orientation ? <Link href={stage.links[0].href}>{stage.title} →</Link> : <>{index === 0 && "Start here: "}{stage.title}</>}</h3><p>{stage.description}</p>
      {stage.planned?.map(gap => <p className="muted-note" key={gap}><strong>Planned:</strong> {gap}</p>)}
      {!curriculumOrders[subject].orientation && stage.links.length > 0 && <ul className={styles.stageLinks}>{stage.links.map(link => <li key={link.href}><Link href={link.href}>{link.title} →</Link></li>)}</ul>}
    </div>
  </li>)}</ol>;
}

export function SubjectTopicMap({ subject }: { subject: string }) {
  const hub = subjectHubs[subject];
  if (!hub || subject === "anatomy") return null;
  return <section className="study-panel" id="subject-topic-map" aria-labelledby="subject-topic-map-title">
    <p className="eyebrow">Suggested course map</p>
    <h2 id="subject-topic-map-title">{hub.name} topic map</h2>
    <p>{curriculumOrders[subject].reason}</p>
    <p>Follow the sequence or choose a topic to review. Links open existing teaching; planned foundations have no lesson link. This map is not a complete university syllabus or a statement of review approval.</p>
    <CurriculumStages subject={subject} />
    <nav className="action-row" aria-label="Continue through the subject">
      <Link className="text-link" href={`/study/${subject}#subject-lessons`}>Browse every available lesson</Link>
      <Link className="text-link" href="/library">Return to the library</Link>
    </nav>
  </section>;
}
