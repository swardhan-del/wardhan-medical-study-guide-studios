"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import styles from "./home-study-activity.module.css";

const explanation =
  "One layer of cells lines each of these tubules. Trace a clear lumen and look at the cells between the open space and the surrounding tissue. Count layers at that boundary one tubule at a time.";

const choices = [
  { label: "One layer", feedback: "Correct. " + explanation },
  {
    label: "Several layers",
    feedback: "Look again at one open tubule. The nuclei in neighbouring tubules belong to different linings. " + explanation,
  },
];

export function HomeStudyActivity() {
  const [choice, setChoice] = useState<number>();

  return (
    <section className={styles.activity} id="home-study-activity" aria-labelledby="home-study-heading">
      <p className={styles.label}>One-minute histology</p>
      <h2 id="home-study-heading">How many layers line a tubule?</h2>
      <Image
        className={styles.image}
        src="/images/figures/cuboidal-section-640.webp"
        alt="Kidney micrograph showing pale openings, with purple nuclei side by side around their borders."
        width={640}
        height={361}
        unoptimized
      />
      <p className={styles.prompt}>Pick one pale opening and trace the cells along its edge.</p>
      <div className={styles.choices} role="group" aria-label="Choose how many layers you see">
        {choices.map(({ label }, index) => (
          <button key={label} type="button" aria-pressed={choice === index} onClick={() => setChoice(index)}>
            {label}
          </button>
        ))}
      </div>
      <div className={choice === undefined ? undefined : styles.feedback} role="status">
        {choice === undefined ? null : choices[choice].feedback}
      </div>
      <noscript>
        <details><summary>Show the reasoning</summary><p>{explanation}</p></details>
      </noscript>
      <div className={styles.links}>
        <Link href="/library/epithelia">Continue to the epithelia lesson</Link>
        <Link href="/learn/visual-studio#epithelial-comparison">Explore the visual studio</Link>
      </div>
      <p className={styles.credit}>Kidney micrograph · <a href="https://commons.wikimedia.org/wiki/File:Epithelial_Tissues_Simple_Cuboidal_Epithelium_(39914418360).jpg">Berkshire Community College, CC0</a></p>
    </section>
  );
}
