import Link from "next/link";
import { notFound } from "next/navigation";
import { AnatomySystemDiagram } from "@/components/anatomy-system-diagram";
import { AnatomySystemExplorer } from "@/components/anatomy-system-explorer";
import { PracticeSequence } from "@/components/practice-sequence";
import { StudyVisual } from "@/components/study-visual";
import { anatomySystems, anatomySystemPractice, anatomySystemHref, anatomySystemSources, anatomySystemsPath } from "@/content/anatomy-systems";
import { searchMetadata } from "@/lib/search-metadata";
import styles from "@/components/anatomy-systems.module.css";

type Props = { params: Promise<{ system: string }> };

export function generateStaticParams() {
  return anatomySystems.map(({ id }) => ({ system: id }));
}

export async function generateMetadata({ params }: Props) {
  return searchMetadata(anatomySystemHref((await params).system));
}

export default async function AnatomySystemPage({ params }: Props) {
  const { system: id } = await params;
  const index = anatomySystems.findIndex(system => system.id === id);
  const system = anatomySystems[index];
  if (!system) notFound();

  const sources = anatomySystemSources(system);
  const practiceTitles = ["Identify the relationship", "Apply it to a new example", "Explain it in your own words"];
  const next = anatomySystems[index + 1];

  return <div className={`site-container study-page ${styles.page}`}>
    <nav aria-label="Breadcrumb" className="breadcrumbs"><Link href="/study/anatomy">Anatomy</Link><Link href={anatomySystemsPath}> / Body systems</Link><span aria-current="page"> / {system.name}</span></nav>
    <header className={styles.header}>
      <p className="eyebrow">{system.name} system</p>
      <h1>{system.title}</h1>
      <p>{system.objective}</p>
      <div className={styles.actions}><a className="button button-primary" href="#diagram">Explore the diagram</a><a href="#practice">Go to practice</a></div>
    </header>
    <StudyVisual id="diagram" headingLevel={2} title="Explore the landmarks"
      alt={system.landmarks.map(landmark => landmark.name + ". " + landmark.detail).join(" ")}
      caption={system.view}
      observe={system.observe}
      credit="Original schematic · Wardhan Medical Study Guide Studios. AI-assisted teaching adaptation."
      sources={sources}>
      <AnatomySystemExplorer landmarks={system.landmarks}><AnatomySystemDiagram id={system.id} /></AnatomySystemExplorer>
    </StudyVisual>
    <section id="practice" className={styles.practice} aria-labelledby="system-practice">
      <h2 id="system-practice">Check your understanding</h2>
      <PracticeSequence title="Body system practice" entries={anatomySystemPractice(system).map((item, index) => ({
        item, title: practiceTitles[index],
      }))} />
    </section>
    <section className="study-panel" aria-labelledby="system-next">
      <h2 id="system-next">Continue learning</h2>
      <p>Go deeper with the linked lesson or choose another body system.</p>
      <div className={styles.actions}>
        <Link className="button button-secondary" href={`/library/${system.lesson.id}`}>{system.lesson.title}</Link>
        {next && <Link href={anatomySystemHref(next.id)}>Next system: {next.name} →</Link>}
        <Link href={anatomySystemsPath}>All body systems</Link>
      </div>
      <p className="muted-note">Independent subject-specialist review is pending. The models cover selected relationships.</p>
    </section>
  </div>;
}
