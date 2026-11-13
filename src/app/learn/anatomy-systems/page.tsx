import Link from "next/link";
import { AnatomySystemDiagram } from "@/components/anatomy-system-diagram";
import { anatomySystems, anatomySystemHref, anatomySystemsPath } from "@/content/anatomy-systems";
import { searchMetadata } from "@/lib/search-metadata";
import styles from "@/components/anatomy-systems.module.css";

export const metadata = searchMetadata(anatomySystemsPath);

export default function AnatomySystemsPage() {
  return <div className={`site-container study-page ${styles.page}`}>
    <nav aria-label="Breadcrumb" className="breadcrumbs"><Link href="/study/anatomy">Anatomy</Link><span aria-current="page"> / Body systems</span></nav>
    <header className={styles.header}>
      <p className="eyebrow">Interactive anatomy</p>
      <h1>Explore the body systems</h1>
      <p>Choose a system, inspect its landmarks, then explain how the structures work together.</p>
      <Link href="/library/anatomy-foundations">New to anatomy? Start with positions and planes →</Link>
    </header>
    <ul className={styles.cards} aria-label="Body systems">
      {anatomySystems.map(system => <li key={system.id}>
        <Link className={styles.card} href={anatomySystemHref(system.id)}>
          <AnatomySystemDiagram id={system.id} />
          <div><h2>{system.name}</h2><p>{system.title}</p></div>
        </Link>
      </li>)}
    </ul>
  </div>;
}
