import Link from "next/link";
import { subjectHubs } from "@/content/subject-hubs";
import { studentEntryPaths } from "@/content/study-paths";
import subjectDirectory from "@/content/subject-directory.json";
import styles from "./subject-hub.module.css";

export function StudentEntryModes({ subject, combinedGenetics = false }: { subject?: string; combinedGenetics?: boolean }) {
  const entry = studentEntryPaths(subject, combinedGenetics);
  if (!entry) return null;
  return <section className="study-panel" id="study-entry" aria-labelledby="study-entry-title">
    <h2 id="study-entry-title">How would you like to study?</h2>
    <p>{entry.preparation}</p>
    {subject === "histology" && <nav className="quick-links" aria-label="Choose a histology course"><Link href="/subjects/histology-i">Histology I learning path</Link><Link href="/subjects/histology-ii">Histology II learning path</Link></nav>}
    {subject === "genetics" && combinedGenetics && <nav className="quick-links" aria-label="Choose genetics or immunology"><Link href="/subjects/genetics">Medical Genetics learning path</Link><Link href="/subjects/immunology">Immunology learning path</Link></nav>}
    <div className={styles.entryModes}>
      <article><h3>Begin from Zero</h3><p>Build the starting vocabulary and work through the first explanation before its questions.</p><Link className="button button-primary" href={entry.begin}>Begin from Zero</Link>{entry.prerequisite && <p><Link href={entry.prerequisite.href}>{entry.prerequisite.title}</Link></p>}</article>
      <article><h3>Explain a Confusing Concept</h3><p>Search the available lessons for the term or relationship you want to understand.</p><Link className="button button-secondary" href={entry.concept}>Explain a Confusing Concept</Link></article>
      <article><h3>Examination Preparation</h3><p>Choose knowledge checks, applications, worked calculations, identification or oral prompts. Return to your saved mistakes for review.</p><Link className="button button-secondary" href={entry.practice}>Examination Preparation</Link></article>
    </div>
    <p className="muted-note">Practice results show what to revisit; they do not establish full syllabus coverage or examination readiness.</p>
  </section>;
}

export function SubjectHubOverview({ subject, combinedGenetics = false }: { subject: string; combinedGenetics?: boolean }) {
  const hub = subjectHubs[subject];
  if (!hub) return <StudentEntryModes subject={subject} combinedGenetics={combinedGenetics} />;
  const covers = subject === "genetics" && !combinedGenetics
    ? subjectDirectory.subjects.find(item => item.id === subject)!.description
    : hub.covers;
  return <><StudentEntryModes subject={subject} combinedGenetics={combinedGenetics} /><section className={`study-panel ${styles.overview}`} aria-labelledby="subject-overview-title">
    <div>
      <h2 id="subject-overview-title">What you will study</h2><p>{covers}</p>
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
  </section></>;
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
