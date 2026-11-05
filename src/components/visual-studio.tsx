"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { nodeLandmarks, organPatterns, slideStages, visualReels, studioSources } from "@/content/visual-studio";
import styles from "./visual-studio.module.css";
import { StudyVisual } from "./study-visual";

const media = "/media/visual-studio/";

export function NodeExplorer() {
  const [selected, setSelected] = useState(0);
  const [route, setRoute] = useState<"none" | "lymph" | "blood">("none");
  const [challenge, setChallenge] = useState(false);
  const [question, setQuestion] = useState(0);
  const [correct, setCorrect] = useState(false);
  const [feedback, setFeedback] = useState("");
  const landmark = nodeLandmarks[selected];
  function choose(index: number) {
    setSelected(index);
    if (challenge) {
      setCorrect(index === question);
      setFeedback(index === question ? `Matched: ${nodeLandmarks[index].name}. ${nodeLandmarks[index].detail}` : `That is ${nodeLandmarks[index].name}. Look again: ${nodeLandmarks[question].clue}`);
    }
  }
  return <section id="node" className={styles.activity} aria-labelledby="node-explorer-title">
    <header className={styles.activityHeader}><span className={styles.number}>01</span><div><p className={styles.kicker}>Click a landmark · trace a route</p><h2 id="node-explorer-title">A lymph node has more than one way in.</h2><p>Explore the numbered points, then find the structures from clues. Each point has a matching button below the diagram.</p></div></header>
    <div className={styles.explorerGrid}>
      <div>
        <StudyVisual title="Map the compartments" alt={nodeLandmarks.map((l,i)=>`${i+1}. ${l.name}: ${l.detail}`).join(" ")} caption="Original lymph-node schematic. Shapes, colours and widths explain relationships; this is not a microscope specimen or a measurement." observe="Locate a boundary, a follicle and a blood vessel, then explain why the entry routes differ." credit="Original programmed teaching diagram · Wardhan Medical Study Guide Studios; AI-assisted." sources={studioSources.slice(0,2)}><div className={styles.diagram}>
          <Image src={media + "node.svg"} width={720} height={520} alt="Original lymph-node schematic: outer capsule and sinus, cortical follicles, deeper paracortex, medullary cords and sinuses toward the hilum, and a blood vessel in the paracortex." unoptimized />
          {route !== "none" && <svg className={styles.routeOverlay} viewBox="0 0 720 520" role="img" aria-label={route === "lymph" ? "Lymph route: afferent lymphatic, subcapsular and deeper sinuses, medullary sinuses, efferent lymphatic." : "Blood entry: blood vessel to paracortical HEV; lymphocytes cross into tissue."}>
            <defs><marker id="studio-arrow" markerWidth="8" markerHeight="8" refX="5" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6" fill="none" stroke={route === "lymph" ? "#b8fff0" : "#ffc0a2"} strokeWidth="1.5"/></marker></defs>
            <path d={route === "lymph" ? "M190 28 L202 64 Q97 130 128 321 Q174 431 369 399 Q416 374 419 341 Q418 304 456 305 L505 306 Q534 321 548 348 L632 374" : "M627 277 L532 281 L414 312 L347 338"} fill="none" stroke={route === "lymph" ? "#b8fff0" : "#ffc0a2"} strokeWidth="9" strokeDasharray={route === "lymph" ? "16 10" : undefined} markerEnd="url(#studio-arrow)"/>
          </svg>}
          {nodeLandmarks.map((item,i) => <span key={item.name} className={styles.marker} style={{left:`${item.x}%`,top:`${item.y}%`}} aria-hidden="true">{i+1}</span>)}
          {nodeLandmarks.map((item, i) => <button key={item.name} type="button" className={styles.hotspot} style={{ left: `${item.x}%`, top: `${item.y}%` }} aria-label={`Landmark ${i + 1}`} aria-pressed={selected === i} aria-controls="node-detail" onClick={() => choose(i)}>{i + 1}</button>)}
        </div></StudyVisual>
        <div className={styles.controls} aria-label="Trace an entry route"><button type="button" aria-pressed={route === "lymph"} onClick={() => setRoute(route === "lymph" ? "none" : "lymph")}>Trace lymph</button><button type="button" aria-pressed={route === "blood"} onClick={() => setRoute(route === "blood" ? "none" : "blood")}>Trace blood entry</button></div>
        <p className={styles.routeText} aria-live="polite">{route === "lymph" ? "Lymph: afferent lymphatic → subcapsular and deeper sinuses → medullary sinuses → efferent lymphatic at the hilum." : route === "blood" ? "Blood: a circulating lymphocyte can cross a postcapillary HEV into paracortical tissue. This is not the afferent-lymph route." : "Choose a route to compare lymph flow with lymphocyte entry from blood."}</p>
      </div>
      <div className={styles.evidence}>
        <div className={styles.controls}><button type="button" aria-pressed={challenge} onClick={() => { setChallenge(!challenge); setQuestion(0); setCorrect(false); setFeedback(""); }}> {challenge ? "Return to exploration" : "Test me: find the landmark"}</button></div>
        {challenge && <div className={styles.challenge}><p className={styles.kicker}>Find it · {question + 1} of {nodeLandmarks.length}</p><h3>{nodeLandmarks[question].clue}</h3><p>Choose a number on the diagram or use its matching button.</p></div>}
        <div className={styles.landmarks} aria-label="Diagram landmarks">{nodeLandmarks.map((item, i) => <button key={item.name} type="button" aria-label={challenge ? `Choose point ${i+1}` : `${i+1} ${item.name}`} aria-pressed={selected === i} onClick={() => choose(i)}><span>{i + 1}</span>{challenge ? `Choose point ${i + 1}` : item.name}</button>)}</div>
        <div id="node-detail" className={styles.detail} aria-live="polite" hidden={challenge && !feedback}><p className={styles.kicker}>Point {selected + 1} · {challenge ? "Compare your reasoning" : "What to notice"}</p><h3>{landmark.name}</h3><p>{landmark.detail}</p><p className={styles.insight}><strong>Why it matters:</strong> {landmark.why}</p></div>
        <p role="status" className={styles.feedback}>{feedback}</p>
        {challenge && correct && (question < nodeLandmarks.length - 1 ? <button className={styles.primary} onClick={() => { setQuestion(question + 1); setCorrect(false); setFeedback(""); }}>Next clue →</button> : <p className={styles.success}>All five clues matched. Now explain why an HEV and an afferent lymphatic are different.</p>)}
      </div>
    </div>
    <div className={styles.nextStep}><Link href="/library/lymphoid-organs">Continue with the full lymphoid-organ lesson →</Link><a href="https://histologyguide.org/slideview/MH-076-077-078-lymph-node/10-slide-1.html">Try these landmarks on a real external slide ↗</a></div>
  </section>;
}

export function OrganDetective() {
  const [active, setActive] = useState(0);
  const [question, setQuestion] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const organ = organPatterns[active];
  return <section id="organs" className={styles.activity} aria-labelledby="organ-detective-title">
    <header className={styles.activityHeader}><span className={styles.number}>02</span><div><p className={styles.kicker}>Compare · predict · explain</p><h2 id="organ-detective-title">Same lymphoid family. Different architecture.</h2><p>Select a drawing to compare its layout. Then solve a different clue below.</p></div></header>
    <StudyVisual title="Three architectural patterns" alt={organPatterns.map(o=>`${o.name}: ${o.pattern}; ${o.anchor}. ${o.contrast}`).join(" ")} caption="Original simplified organ schematics. A cropped field may omit the deciding landmark; colour alone is insufficient." observe="Compare the distribution of lymphoid tissue and the structure surrounding each pale area." credit="Original programmed comparisons · Wardhan Medical Study Guide Studios; AI-assisted." sources={[studioSources[0],studioSources[2]]}><div className={styles.organChoices}>{organPatterns.map((item, i) => <button key={item.id} type="button" aria-pressed={i === active} onClick={() => setActive(i)}><Image src={media + item.image + ".svg"} width={720} height={520} alt="" unoptimized /><span>{item.name}</span></button>)}</div></StudyVisual>
    <div className={styles.organDetail} aria-live="polite"><div><p className={styles.kicker}>{organ.name} · look at the relationships</p><h3>{organ.pattern}</h3></div><div><p><strong>Anchor your identification:</strong> {organ.anchor}.</p><p>{organ.contrast}</p></div></div>
    <div className={styles.challenge}><p className={styles.kicker}>Your turn · clue {question + 1} of 3</p><h3>{organPatterns[question].question}</h3><div className={styles.controls}>{organPatterns.map((item,i) => <button key={item.id} type="button" onClick={() => setChoice(i)} aria-pressed={choice === i}>{item.name}</button>)}</div><p role="status" className={styles.feedback}>{choice === null ? "Choose an organ before comparing the explanation." : choice === question ? `Matched. ${organPatterns[question].answer}` : `${organPatterns[choice].name} has a different arrangement: ${organPatterns[choice].pattern.toLowerCase()}. Reconsider the relationship in the clue.`}</p><button type="button" className={styles.secondary} onClick={() => { setQuestion((question+1)%3); setChoice(null); }}>Try another clue →</button></div>
    <p className={styles.caption}>These original drawings simplify a whole-organ pattern. A cropped real field may omit the deciding landmark. A single colour, pale patch or follicle is insufficient.</p>
  </section>;
}

export function SlideJourney() {
  const [stage, setStage] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const item = slideStages[stage];
  function move(next: number) { setStage(next); setRevealed(false); }
  return <section id="preparation" className={styles.activity} aria-labelledby="slide-journey-title">
    <header className={styles.activityHeader}><span className={styles.number}>03</span><div><p className={styles.kicker}>Step through the process</p><h2 id="slide-journey-title">A slide is made, not simply found.</h2><p>Follow a routine paraffin preparation and ask what each stage changes.</p></div></header>
    <div className={styles.stageStrip} aria-label="Preparation stages">{slideStages.map((s,i) => <button key={s.title} type="button" aria-pressed={stage === i} onClick={() => move(i)}><span>{i+1}</span>{s.short}</button>)}</div>
    <div className={styles.explorerGrid}><div><StudyVisual title={`Preparation view ${stage+1}`} alt={item.body} caption="An original conceptual workflow, not a laboratory recipe. Frozen-section and other preparations differ." observe={item.prompt} credit="Original programmed teaching illustration · Wardhan Medical Study Guide Studios; AI-assisted." sources={[studioSources[3]]}><Image className={styles.stageImage} src={media + `slide-${stage}.svg`} width={720} height={520} alt={`Original illustration of stage ${stage+1}: ${item.title}.`} unoptimized /></StudyVisual></div><div className={styles.stageCopy}><p className={styles.kicker}>Stage {stage+1} of 6</p><h3>{item.title}</h3><p>{item.body}</p><div className={styles.challenge}><h4>Predict before revealing</h4><p>{item.prompt}</p><button className={styles.secondary} aria-expanded={revealed} aria-controls="stage-answer" onClick={() => setRevealed(!revealed)}>{revealed ? "Hide the explanation" : "Reveal the explanation"}</button><p id="stage-answer" hidden={!revealed}>{item.answer}</p></div><div className={styles.controls}><button type="button" disabled={stage === 0} onClick={() => move(stage-1)}>← Previous stage</button><button type="button" disabled={stage === slideStages.length-1} onClick={() => move(stage+1)}>Next stage →</button></div></div></div>
    <div className={styles.nextStep}><Link href="/library/microscopy#preparation-sequence-title">Now build the preparation sequence yourself →</Link><Link href="/library/microscopy">Read the full microscopy lesson →</Link></div>
  </section>;
}

export function VisualReelGallery() {
  const [failed, setFailed] = useState<string[]>([]);
  return <section id="visual-minutes" className={styles.activity} aria-labelledby="visual-minutes-title"><header className={styles.activityHeader}><span className={styles.number}>▶</span><div><p className={styles.kicker}>Watch · pause · predict</p><h2 id="visual-minutes-title">One idea in a visual minute.</h2><p>Three short silent videos with on-screen explanations, captions and full transcripts. Playback starts when you choose.</p></div></header><div className={styles.reelGrid}>{visualReels.map(reel => <article key={reel.id} className={styles.reelCard}><div className={styles.reelHeading}><p className={styles.kicker}>{reel.seconds} seconds · captioned</p><h3>{reel.title}</h3></div><video controls playsInline preload="none" width="720" height="1280" poster={media + reel.id + "-poster.png"} aria-label={reel.title} onError={() => setFailed(items => [...items,reel.id])}><source src={media + reel.id + ".mp4"} type="video/mp4" onError={() => setFailed(items => [...items,reel.id])}/><track kind="captions" src={media + reel.id + ".vtt"} srcLang="en" label="English" default/>Your browser cannot play this video. Read the transcript below.</video>{failed.includes(reel.id) && <p role="status">Video unavailable. The complete explanation is in the transcript below.</p>}<p>{reel.description}</p><details><summary>Read the full transcript</summary><ol className={styles.transcript}>{reel.transcript.map(cue => <li key={cue.start}><strong>0:{String(cue.start).padStart(2,"0")}</strong> {cue.text}</li>)}</ol></details><Link href={`/library/${reel.lesson}`}>Continue to the full lesson →</Link></article>)}</div></section>;
}
