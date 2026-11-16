"use client";

import Image from "next/image";
import Link from "next/link";
import { updateLearning, useLearning } from "@/components/learning-store";
import { spinalCordPractical } from "@/content/spinal-cord-practical";
import { useRef, useState } from "react";
import styles from "./spinal-cord.module.css";

const stations = [
  {
    label: "Orient the slide",
    title: "Which side is ventral?",
    prompt: "Compare the outer edge with the grey matter inside it. Which marker sits on the deep midline cleft you can use to identify the ventral (anterior) surface?",
    hint: "Trace the midline from each outer edge. One side has a deep visible cleft. The other has a shallower surface groove.",
    choices: [
      { text: "A — the narrow horn", feedback: "A is in a thin projection of grey matter, away from the midline. It is on the dorsal side." },
      { text: "B — the broad horn", feedback: "B helps orient the section, but it marks grey matter inside the cord. The cleft starts at the surface." },
      { text: "C — the deep midline cleft", feedback: "The anterior median fissure marks the ventral surface. The broad ventral horns flank this side of the section." },
    ],
    answer: 2,
    marker: "C",
  },
  {
    label: "Find the motor region",
    title: "Where would you zoom in?",
    prompt: "The inset shows a large cell body with several processes. In which marked region would you look for the cell bodies of motor neurons that send axons to skeletal muscle?",
    hint: "A and B mark grey matter. Compare the narrow dorsal horn with the broader ventral horn next to the fissure.",
    choices: [
      { text: "A — the narrow dorsal horn", feedback: "The dorsal horn receives and processes sensory input. Look in the ventral grey matter for motor neuron cell bodies that supply skeletal muscle." },
      { text: "B — the broad ventral horn", feedback: "The ventral horn contains the cell bodies of lower motor neurons. The photo illustrates a large multipolar neuron. Location provides evidence for its role alongside its shape." },
      { text: "C — the anterior median fissure", feedback: "The fissure helps locate the ventral side. It is a cleft at the surface, outside the grey matter where those cell bodies sit." },
    ],
    answer: 1,
    marker: "B",
  },
  {
    label: "Trace the withdrawal reflex",
    title: "Follow the signal off the slide.",
    prompt: "A sharp edge activates a pain receptor in your hand. Which route links that sensory input to contraction of a flexor muscle on the same side?",
    hint: "A horn is grey matter inside the spinal cord. A root carries axons into or out of it.",
    choices: [
      { text: "Ventral root → dorsal horn → dorsal root", feedback: "This reverses the directions at both roots. Sensory input enters through the dorsal root, and motor output leaves through the ventral root." },
      { text: "Dorsal root → white matter → dorsal root", feedback: "White matter carries long pathways, but the local withdrawal circuit relays through spinal grey matter. The motor axon leaves through the ventral root." },
      { text: "Dorsal root → spinal grey matter → ventral root", feedback: "Input enters through the dorsal root. Spinal interneurons relay it to a motor neuron in the ventral horn. Its axon exits through the ventral root and activates the flexor." },
    ],
    answer: 2,
    marker: null,
  },
] as const;

const markers = [
  { name: "A", x: "37%", y: "39%" },
  { name: "B", x: "35%", y: "54%" },
  { name: "C", x: "52%", y: "76%" },
];

const reflex = [
  ["Dorsal root", "Sensory axon enters"],
  ["Spinal grey matter", "Interneurons relay to a motor neuron"],
  ["Ventral root", "Motor axon leaves for the flexor"],
];

export function SpinalCordPractical() {
  const [activeIndex, setActiveIndex] = useState<number>();
  const [selected, setSelected] = useState<number>();
  const titleRef = useRef<HTMLHeadingElement>(null);
  const { data, ready } = useLearning();
  const solved = data.practicals[spinalCordPractical.id]?.solved ?? [];
  const firstUnfinished = stations.findIndex((_, step) => !solved.includes(step));
  const index = activeIndex ?? (firstUnfinished < 0 ? stations.length - 1 : firstUnfinished);
  const station = stations[index];
  const correct = selected === station.answer;
  const finished = firstUnfinished < 0;
  const laterUnfinished = stations.findIndex((_, step) => step > index && !solved.includes(step));

  function openStation(next: number) {
    setSelected(undefined);
    setActiveIndex(next);
    requestAnimationFrame(() => titleRef.current?.focus());
  }

  function answer(choice: number) {
    setActiveIndex(index);
    setSelected(choice);
    if (choice !== station.answer) return;
    updateLearning(state => {
      const previous = state.practicals[spinalCordPractical.id]?.solved ?? [];
      const updated = [...new Set([...previous, index])];
      return { ...state, practicals: { ...state.practicals, [spinalCordPractical.id]: { solved: updated, at: Date.now() } } };
    });
  }

  return (
    <section className={styles.practical} id="practical" aria-labelledby="practical-heading">
      <div className={styles.practicalHeading}>
        <h2 id="practical-heading">From slide to signal</h2>
        <p>{ready ? `${solved.length} of ${stations.length} complete` : "Loading progress…"}</p>
      </div>
      <nav className={styles.stations} aria-label="Practical stations">
        {stations.map((item, step) => (
          <button type="button" key={item.label} disabled={!ready} aria-current={step === index ? "step" : undefined} onClick={() => openStation(step)}>
            <span className={styles.step} aria-hidden="true">{solved.includes(step) ? "✓" : step + 1}</span>
            {item.label}
            {solved.includes(step) && <span className="sr-only">, complete</span>}
          </button>
        ))}
      </nav>

      <h3 className={styles.stationTitle} tabIndex={-1} ref={titleRef} id="station-title">{station.title}</h3>
      <div className={styles.bench}>
        <div className={styles.viewer}>
          <figure>
            <div className={styles.slide}>
              <Image
                src="/images/spinal-cord-practical/whole-section.webp"
                width={1280}
                height={907}
                sizes="(max-width: 800px) 92vw, 50vw"
                alt="Spinal cord cross-section. A is on a narrow upper arm of the central butterfly-shaped tissue. B is on a broader lower arm. C is on the cleft at the bottom midline."
              />
              {markers.map(mark => (
                <span
                  key={mark.name}
                  aria-hidden="true"
                  className={correct && mark.name === station.marker ? styles.correctMark : styles.mark}
                  style={{ left: mark.x, top: mark.y }}
                >{mark.name}</span>
              ))}
            </div>
            <figcaption>Whole transverse section · markers A–C</figcaption>
          </figure>
          {index === 1 && (
            <figure className={styles.inset}>
              <Image
                src="/images/spinal-cord-practical/motor-neuron.webp"
                width={1200}
                height={677}
                sizes="(max-width: 800px) 80vw, 32vw"
                alt="A large, purple-stained neuron with several long processes among smaller stained nuclei."
              />
              <figcaption>Motor neuron · separate specimen at higher magnification</figcaption>
            </figure>
          )}
          <p className={styles.scaleNote}>The whole section shows landmarks. The higher-magnification image shows cell shape.</p>
        </div>

        <div className={styles.challenge}>
          <p>{station.prompt}</p>
          <div className={styles.choices} role="group" aria-labelledby="station-title">
            {station.choices.map((choice, number) => (
              <button
                type="button"
                key={choice.text}
                disabled={!ready}
                aria-pressed={selected === number}
                onClick={() => answer(number)}
              >{choice.text}</button>
            ))}
          </div>
          <details key={station.label} className={styles.hint}>
            <summary>Show a visual clue</summary>
            <p>{station.hint}</p>
          </details>
          <div role="status">
            {selected !== undefined && (
              <p className={correct ? styles.success : styles.retry}>
                <strong>{correct ? "Correct. " : "Try again. "}</strong>{station.choices[selected].feedback}
              </p>
            )}
          </div>
          {index === 2 && correct && <ol className={styles.pathway} aria-label="Withdrawal reflex in order">
            {reflex.map(([place, action]) => <li key={place}><strong>{place}</strong><span>{action}</span></li>)}
          </ol>}
          {finished ? (
            <div className={styles.finish}>
              <p><strong>Practical complete.</strong> Look away from the slide and explain how to find the ventral side and where the signal leaves the cord.</p>
              <div className="action-row">
                <Link className="button button-primary" href={spinalCordPractical.next.href}>Next lesson: {spinalCordPractical.next.title}</Link>
                <button type="button" onClick={() => {
                  updateLearning(state => ({ ...state, practicals: { ...state.practicals, [spinalCordPractical.id]: { solved: [], at: Date.now() } } }));
                  openStation(0);
                }}>Try the practical again</button>
              </div>
            </div>
          ) : correct ? (
            <button className={styles.next} type="button" onClick={() => openStation(laterUnfinished < 0 ? firstUnfinished : laterUnfinished)}>Next station <span aria-hidden="true">→</span></button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
