import Link from "next/link";
import { curriculumOrders } from "@/content/curriculum-order";
import styles from "./anatomy-foundations.module.css";

const stages = curriculumOrders.anatomy.stages;

export function AnatomyLearningPath() {
  return <section className="study-panel" id="anatomy-course-map" aria-labelledby="anatomy-course-map-heading">
    <p className="eyebrow">Free course · Start here</p>
    <h2 id="anatomy-course-map-heading">Anatomy course map</h2>
    <p>Build a shared anatomical vocabulary, then apply it region by region. The foundation lesson leads into the existing five-volume course of 120 regional lessons. All linked lessons are available without an account.</p>
    <ol className={styles.courseMap}>{stages.map(({ title, id, description, links }, index) => <li key={id}>
      <span className={styles.stageNumber} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
      <div><h3><Link href={links[0].href}>{title} →</Link></h3><p>{description}</p>{index === 0 && <p className="muted-note">35 minutes · Labelled diagrams · Explained questions · Saved summary checklist</p>}</div>
    </li>)}</ol>
    <div className="action-row"><Link className="button button-primary" href="/library/anatomy-foundations">Begin Anatomy Foundations</Link><Link className="text-link" href="/study/anatomy/guide">Browse all regional lessons</Link><Link className="text-link" href="/start/anatomy">Three-minute orientation refresher</Link></div>
    <p className="muted-note">Work through the questions, explain the relationships aloud, then use the summary checklist before moving on. Answers and notes are saved in this browser when storage is available; use My Study to review them. This is a learning sequence, not a statement of complete university syllabus coverage.</p>
  </section>;
}
