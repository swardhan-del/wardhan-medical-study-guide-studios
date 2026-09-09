"use client";

import { useState, type ReactNode } from "react";

type Part = { id: string; title: string; content: ReactNode; answers: ReactNode };

export function PrintableGuide({ parts }: { parts: Part[] }) {
  const [selected, setSelected] = useState(() => parts.map(p => p.id));
  const [showAnswers, setShowAnswers] = useState(true);
  const active = parts.filter(p => selected.includes(p.id));
  return <>
    <fieldset className="print-control guide-selector">
      <legend>Choose the parts to print</legend>
      <p>Select a smaller study session, then use “Print revision notes” above. Your selection also controls the answer key.</p>
      <div className="action-row"><button type="button" onClick={() => setSelected(parts.map(p => p.id))}>Select all parts</button><button type="button" onClick={() => setSelected([])}>Clear selection</button></div>
      <div className="guide-options">{parts.map(p => <label key={p.id}><input type="checkbox" checked={selected.includes(p.id)} onChange={e => { const checked = e.target.checked; setSelected(previous => checked ? [...previous, p.id] : previous.filter(id => id !== p.id)); }} /> {p.title}</label>)}</div>
      <label><input type="checkbox" checked={showAnswers} onChange={e => setShowAnswers(e.target.checked)} /> Include answer key</label>
    </fieldset>
    <p className="print-control" role="status">{active.length} of {parts.length} parts selected.</p>
    {active.length === 0 ? <p>Select at least one part to prepare your printable notes.</p> : <>
      <nav className="guide-contents" aria-label="Printable contents"><h2>Contents</h2><ol>{active.map(p => <li key={p.id}><a href={"#" + p.id}>{p.title}</a></li>)}</ol></nav>
      {active.map(p => <section id={p.id} key={p.id} className="revision-section">{p.content}</section>)}
      {showAnswers && <section className="revision-answers"><h2>Answer key and explanation prompts</h2>{active.map(p => <div key={p.id}>{p.answers}</div>)}</section>}
    </>}
  </>;
}
