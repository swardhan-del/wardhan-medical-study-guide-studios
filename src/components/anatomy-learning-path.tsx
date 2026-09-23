import Link from "next/link";
import styles from "./anatomy-foundations.module.css";

const stages = [
  ["Foundations", "anatomy-foundations", "Position, directions, planes, cavities and tissue-to-organ organisation. Begin here; no previous Anatomy lesson is required."],
  ["Thorax", "thoracic-cage-landmarks", "Use landmarks to orient the chest, then connect its wall, lungs, heart and major pathways."],
  ["Abdomen", "abdominal-surface-map", "Move from surface regions to organ relations, peritoneal organisation and vessels."],
  ["Pelvis and urogenital anatomy", "pelvic-boundaries", "Establish boundaries before studying support, urinary pathways and reproductive structures."],
  ["Head, neck and neuroanatomy", "neck-triangles", "Organise complex relationships by regions, fascial spaces and nerve pathways."],
  ["Musculoskeletal anatomy", "bones-and-connections", "Connect bones and joints to muscle actions, limb compartments and neurovascular routes."],
];

export function AnatomyLearningPath() {
  return <section className="study-panel" id="anatomy-course-map" aria-labelledby="anatomy-course-map-heading">
    <p className="eyebrow">Free course · Start here</p>
    <h2 id="anatomy-course-map-heading">Anatomy course map</h2>
    <p>Build a shared anatomical vocabulary, then apply it region by region. The foundation lesson leads into the existing five-volume course of 120 regional lessons. All linked lessons are available without an account.</p>
    <ol className={styles.courseMap}>{stages.map(([title, id, description], index) => <li key={id}>
      <span className={styles.stageNumber} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
      <div><h3><Link href={`/library/${id}`}>{title} →</Link></h3><p>{description}</p>{index === 0 && <p className="muted-note">35 minutes · Labelled diagrams · Explained questions · Saved summary checklist</p>}</div>
    </li>)}</ol>
    <div className="action-row"><Link className="button button-primary" href="/library/anatomy-foundations">Begin Anatomy Foundations</Link><Link className="text-link" href="/study/anatomy/guide">Browse all regional lessons</Link><Link className="text-link" href="/start/anatomy">Three-minute orientation refresher</Link></div>
    <p className="muted-note">Work through the questions, explain the relationships aloud, then use the summary checklist before moving on. Answers and notes are saved in this browser when storage is available; use My Study to review them. This is a learning sequence, not a statement of complete university syllabus coverage.</p>
  </section>;
}
