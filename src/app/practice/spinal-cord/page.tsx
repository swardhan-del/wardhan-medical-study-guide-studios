import Image from "next/image";
import Link from "next/link";
import { spinalCordPractical } from "@/content/spinal-cord-practical";
import { searchMetadata } from "@/lib/search-metadata";
import { SpinalCordPractical } from "./practical";
import styles from "./spinal-cord.module.css";

export const metadata = searchMetadata(spinalCordPractical.href);

const guideHref = "/study/histology/guide#histology-part-14";

export default function SpinalCordPracticePage() {
  return (
    <article className={"site-container " + styles.page}>
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link href={guideHref}>Histology Part 14</Link>
        <span aria-current="page"> / Spinal cord practical</span>
      </nav>
      <header className={styles.hero}>
        <Image
          className={styles.heroImage}
          src="/images/spinal-cord-practical/motor-neuron.webp"
          alt=""
          fill
          preload
          sizes="(max-width: 720px) 100vw, 70vw"
        />
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>Microscopic Anatomy II · Part 14</p>
          <h1>{spinalCordPractical.title}</h1>
          <p>Orient a real tissue section, find the motor region and follow the signal that pulls your hand away from a sharp edge.</p>
          <a href="#practical">Start the practical <span aria-hidden="true">↓</span></a>
        </div>
      </header>

      <noscript>
        <section className="study-panel">
          <h2>Read the practical</h2>
          <ol>
            <li>Find the midline cleft at C in the whole section. The cleft marks the ventral side.</li>
            <li>Look for lower motor neuron cell bodies in the broad ventral horn at B. The narrow dorsal horn at A receives sensory input.</li>
            <li>Trace withdrawal from the dorsal root to spinal grey matter. Interneurons relay the signal to a lower motor neuron whose axon leaves through the ventral root.</li>
          </ol>
        </section>
      </noscript>
      <SpinalCordPractical />

      <section className={styles.references} aria-labelledby="references-heading">
        <h2 id="references-heading">Sources and further study</h2>
        <p>Practise at a different scale with the <a href="https://www.histologyguide.com/slideview/UCSF-163-spinal-cord/06-slide-1.html?page=2">Histology Guide cresyl-violet slide</a>. Use the outline and the shape of the grey matter to orient each section. Colours can change with preparation.</p>
        <ul>
          <li>Whole section by Didkov, rotated 180° and resized. <a href="https://commons.wikimedia.org/wiki/File:Cross-section_through_the_spinal_cord.jpg">Image source</a> · <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a></li>
          <li>Motor neuron and banner by Berkshire Community College Bioscience Image Library, resized. <a href="https://commons.wikimedia.org/wiki/File:Nervous_Tissue_Spinal_Cord_Motor_Neuron_(41850850452).jpg">Image source</a> · <a href="https://creativecommons.org/publicdomain/zero/1.0/">CC0 1.0</a></li>
          <li>OpenStax, <a href="https://openstax.org/books/anatomy-and-physiology/pages/13-2-the-central-nervous-system">The Central Nervous System</a> and <a href="https://openstax.org/books/anatomy-and-physiology/pages/14-3-motor-responses">Motor Responses</a></li>
        </ul>
        <p><Link href={spinalCordPractical.next.href}>Continue with spinal cord tracts</Link> · <Link href={guideHref}>Back to the Part 14 course map</Link></p>
      </section>
    </article>
  );
}
