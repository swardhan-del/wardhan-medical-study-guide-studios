import Image from "next/image";
import Link from "next/link";
import styles from "./visual-studio.module.css";

const media="/media/visual-studio/";

export function VisualStudioInvitation({ compact = false }: { compact?: boolean }) {
  return <section className={`${styles.invitation} ${compact ? styles.compact : ""}`} aria-labelledby={compact ? "lesson-studio-title" : "home-studio-title"}>
    <div><p className={styles.kicker}>Learn by looking · free visual studio</p>
      <h2 id={compact ? "lesson-studio-title" : "home-studio-title"}>See it. Explore it. Explain it.</h2>
      <p>Trace a route through a lymph node, compare three organs, or follow a specimen to a slide. Make a prediction, then reveal the reason.</p>
      <Link href="/learn/visual-studio" className={styles.primary}>Enter the visual studio <span aria-hidden="true">↗</span></Link>
      <p className={styles.small}>3 visual activities · 3 short captioned videos · no account needed</p>
    </div>
    <Link href="/learn/visual-studio" className={styles.coverLink} aria-label="Explore the visual study studio"><Image src={media + "node.svg"} width={720} height={520} alt="" unoptimized /></Link>
  </section>;
}

