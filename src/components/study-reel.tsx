"use client";
import { useId, useState } from "react";
export function StudyReel({ title, slides }: { title: string; slides: { title: string; body: string; prompt?: string }[] }) {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const id = useId();
  return <section className="study-reel study-panel" id="recap" aria-labelledby={id}>
    <p className="eyebrow">Active recall · answer before revealing</p>
    <h2 id={id}>{title}</h2>
    <div className="reel-frame" aria-live="polite" aria-atomic="true">
      <p className="reel-counter">Card {index + 1} of {slides.length}</p>
      <h3>{slides[index].title}</h3>
      <p>{slides[index].prompt ?? `Without looking back, explain “${slides[index].title}” and give the reason it matters.`}</p>
      <button className="button button-secondary" aria-expanded={revealed} aria-controls={id + "-answer"} onClick={() => setRevealed(!revealed)}>{revealed ? "Hide answer" : "Reveal answer"}</button>
      <p id={id + "-answer"} hidden={!revealed}>{slides[index].body}</p>
    </div>
    <div className="reel-controls">
      <button className="button button-secondary" disabled={index === 0} onClick={() => { setIndex(i => i - 1); setRevealed(false); }}>Previous card</button>
      <button className="button button-primary" disabled={index === slides.length - 1} onClick={() => { setIndex(i => i + 1); setRevealed(false); }}>Next card</button>
    </div>
    <p className="muted-note">Pause after each idea and explain it aloud. The cards advance only when you choose.</p>
  </section>;
}
