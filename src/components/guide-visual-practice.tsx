import Image from "next/image";
import Link from "next/link";
import type { GuideVisualPractice as Practice } from "@/content/guide-visual-practice";
import { publicFigures } from "@/lib/figures";
import styles from "./guide-visual-practice.module.css";

function GuideVisual({ visual }: { visual: Practice["visual"] }) {
  if (visual.kind === "model") {
    const List = visual.ordered === false ? "ul" : "ol";
    return (
      <figure className={styles.model}>
        <figcaption>{visual.label}</figcaption>
        <List>{visual.steps.map(step => <li key={step}>{step}</li>)}</List>
      </figure>
    );
  }

  if (visual.kind === "spinal-section") {
    return (
      <figure className={styles.figure}>
        <Image
          src="/images/spinal-cord-practical/whole-section.webp"
          width={1280} height={907} sizes="(max-width: 720px) 90vw, 440px"
          alt="A spinal cord cross-section with a deep midline cleft at the lower edge and butterfly-shaped grey matter."
        />
        <figcaption>Spinal cord section. <a href="https://commons.wikimedia.org/wiki/File:Cross-section_through_the_spinal_cord.jpg">Didkov</a> · <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a> · rotated and resized.</figcaption>
      </figure>
    );
  }

  const figure = publicFigures.find(item => item.id === visual.id);
  if (!figure) throw new Error(`Practice figure not published: ${visual.id}`);
  const image = figure.variants.find(item => item.width === 640) ?? figure.variants[0];
  return (
    <figure className={styles.figure}>
      <Image src={image.src} width={image.width} height={image.height} alt={figure.alt} unoptimized />
      <figcaption>{figure.title} · <a href={figure.sourceUrl}>Source</a></figcaption>
    </figure>
  );
}

export function GuideVisualPractice({ practice, id, heading: Heading = "h2" }: { practice: Practice; id: string; heading?: "h2" | "h3" }) {
  return (
    <section className={styles.panel} id={id} aria-labelledby={id + "-title"}>
      <header className={styles.heading}>
        <p className={styles.kicker}>Visual practice</p>
        <Heading id={id + "-title"}>{practice.title}</Heading>
      </header>
      <GuideVisual visual={practice.visual} />
      <div className={styles.prompt}>
        <p>{practice.question}</p>
        <details><summary>Check your reasoning</summary><p>{practice.explanation}</p></details>
        <Link className="button button-primary" href={practice.href}>{practice.action}</Link>
      </div>
    </section>
  );
}
