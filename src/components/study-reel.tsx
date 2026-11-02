"use client";
import { useEffect, useId, useRef, useState } from "react";
export function StudyReel({ title, slides }: { title: string; slides: { title: string; body: string; prompt?: string }[] }) {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [practice, setPractice] = useState(false);
  const [round, setRound] = useState(() => slides.map((_, i) => i));
  const [finished, setFinished] = useState(false);
  const [drafts, setDrafts] = useState<Record<number, string>>({});
  const [checks, setChecks] = useState<Record<number, "again" | "explained">>({});
  const heading = useRef<HTMLHeadingElement>(null);
  const focusRequested = useRef(false);
  const id = useId();
  useEffect(() => {
    if (!focusRequested.current) return;
    heading.current?.focus({ preventScroll: true });
    heading.current?.scrollIntoView({ block: "start", behavior: "instant" });
    focusRequested.current = false;
  }, [index, finished, practice, round]);
  if (!slides.length) return null;
  const activeIndex = practice ? round[index] : index;
  const slide = slides[activeIndex] ?? slides[0];
  const weaker = round.filter(position => checks[position] === "again");
  const explained = round.filter(position => checks[position] === "explained").length;
  function move(next: number) {
    focusRequested.current = true;
    setIndex(next);
    setRevealed(false);
  }
  function startRound(positions: number[]) {
    focusRequested.current = true;
    setPractice(true);
    setRound(positions);
    setIndex(0);
    setRevealed(false);
    setFinished(false);
    setDrafts({});
    setChecks({});
  }
  return <section className="study-reel study-panel" id="recap" aria-labelledby={id}>
    <p className="eyebrow">Active recall · answer before revealing</p>
    <h2 id={id}>{title}</h2>
    <p>Use the published explanations as model answers. Practise explaining each idea before comparing your response.</p>
    <div className="action-row">
      {!practice && <button className="button button-primary" onClick={() => startRound(slides.map((_, i) => i))}>Practise these cards</button>}
      {practice && <button className="button button-secondary" onClick={() => { focusRequested.current = true; setPractice(false); setFinished(false); setIndex(0); setRevealed(false); }}>Browse the cards</button>}
    </div>
    {finished ? <div className="reel-frame">
      <h3 ref={heading} tabIndex={-1}>Your recall round</h3>
      <p role="status">{explained} of {round.length} prompts self-checked as explained; {weaker.length} need more practice.</p>
      <p>These are your own checks, not an automatic accuracy assessment or an examination score. Compare your reasoning with the model and revisit anything uncertain.</p>
      {weaker.length > 0 && <><h4>Revisit these ideas</h4><ul>{weaker.map(position => <li key={position}>{slides[position].title}</li>)}</ul></>}
      <div className="action-row">
        {weaker.length > 0 && <button className="button button-primary" onClick={() => startRound(weaker)}>Practise weaker cards</button>}
        <button className="button button-secondary" onClick={() => startRound(slides.map((_, i) => i))}>Try all cards again</button>
      </div>
    </div> : <>
    <div className="reel-frame">
      <p className="reel-counter" role="status">{practice ? "Prompt" : "Card"} {index + 1} of {practice ? round.length : slides.length}</p>
      <h3 ref={heading} tabIndex={-1}>{slide.title}</h3>
      <p>{slide.prompt ?? `Without looking back, explain “${slide.title}” and give the reason it matters.`}</p>
      {practice && <div className="saved-recall"><label htmlFor={id + "-draft"}>My answer, before comparing</label>
        <textarea id={id + "-draft"} rows={4} maxLength={5000} value={drafts[activeIndex] ?? ""} onChange={event => setDrafts(previous => ({ ...previous, [activeIndex]: event.target.value }))} aria-describedby={id + "-privacy"} />
        <p id={id + "-privacy"} className="muted-note">You can also answer aloud. Drafts and self-checks stay in this tab for this visit and clear on reload. They are not sent for AI grading or added to your quiz score.</p>
      </div>}
      <button className="button button-secondary" aria-expanded={revealed} aria-controls={id + "-answer"} onClick={() => setRevealed(!revealed)}>{revealed ? "Hide answer" : "Reveal answer"}</button>
      <p id={id + "-answer"} hidden={!revealed}>{slide.body}</p>
      {practice && revealed && <div className="recall-self-check">
        <p>Compare with the model: did you explain the main idea and its reasoning?</p>
        <div className="action-row">
          <button className="button button-secondary" aria-pressed={checks[activeIndex] === "again"} onClick={() => setChecks(previous => ({ ...previous, [activeIndex]: "again" }))}>Needs more practice</button>
          <button className="button button-secondary" aria-pressed={checks[activeIndex] === "explained"} onClick={() => setChecks(previous => ({ ...previous, [activeIndex]: "explained" }))}>I can explain this</button>
        </div>
        <p role="status">{checks[activeIndex] === "again" ? "Marked for another practice round. Revisit the model, then try explaining it without looking." : checks[activeIndex] === "explained" ? "Self-check recorded for this round. Revisit the idea after a break to check your recall." : "Choose a self-check before continuing."}</p>
      </div>}
    </div>
    <div className="reel-controls">
      <button className="button button-secondary" disabled={index === 0} onClick={() => move(index - 1)}>Previous card</button>
      {practice ? <button className="button button-primary" disabled={!checks[activeIndex]} onClick={() => {
        if (index < round.length - 1) move(index + 1);
        else { focusRequested.current = true; setFinished(true); }
      }}>{index === round.length - 1 ? "Finish recall round" : "Next card"}</button> : <button className="button button-primary" disabled={index === slides.length - 1} onClick={() => move(index + 1)}>Next card</button>}
    </div>
    </>}
    <p className="muted-note">The cards advance only when you choose. Return after a break for another attempt; a successful self-check does not prove mastery.</p>
  </section>;
}
