"use client";

import { useState } from "react";

type Topic = { id: string; title: string; href: string | null; status: string };
type Group = { id: string; subject: string; title: string; sourceLabel: string; topics: Topic[] };
const subjects = [
  ["anatomy", "Anatomy"], ["histology", "Histology and embryology"],
  ["physiology", "Physiology"], ["cell-biology", "Molecular cell biology"],
  ["biochemistry", "Biochemistry"], ["genetics", "Genetics and immunology"],
  ["biostatistics", "Biostatistics"],
];

export function StudyMapBrowser({ groups }: { groups: Group[] }) {
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState("all");
  const [availability, setAvailability] = useState("all");
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const visible = groups.filter(g => subject === "all" || g.subject === subject).map(g => ({
    ...g,
    topics: g.topics.filter(t =>
      (availability === "all" || (availability === "available" ? Boolean(t.href) : !t.href)) &&
      terms.every(term => `${g.title} ${g.subject} ${t.title}`.toLowerCase().includes(term))),
  })).filter(g => g.topics.length > 0);
  const count = visible.reduce((sum, g) => sum + g.topics.length, 0);
  return <>
    <section className="study-panel study-map-filters" aria-label="Filter the study map">
      <label htmlFor="map-search">Find a topic<input id="map-search" type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Try myelin, metabolism or meiosis" /></label>
      <label htmlFor="map-subject">Subject<select id="map-subject" value={subject} onChange={e => setSubject(e.target.value)}><option value="all">All subjects</option>{subjects.map(([id, title]) => <option key={id} value={id}>{title}</option>)}</select></label>
      <label htmlFor="map-availability">Availability<select id="map-availability" value={availability} onChange={e => setAvailability(e.target.value)}><option value="all">All topics</option><option value="available">Introduction available</option><option value="planned">Planned adaptation</option></select></label>
      <button type="button" className="button button-secondary" onClick={() => { setQuery(""); setSubject("all"); setAvailability("all"); }}>Clear filters</button>
    </section>
    <p role="status">{count} {count === 1 ? "topic" : "topics"} in {visible.length} {visible.length === 1 ? "section" : "sections"}</p>
    {count === 0 && <p className="study-panel">No topics match these filters. Try a broader term or clear the filters.</p>}
    <div className="study-map-groups">{visible.map(g => <section className="study-panel" key={g.id} aria-labelledby={`${g.id}-heading`}>
      <p className="eyebrow">{subjects.find(([id]) => id === g.subject)?.[1]}</p>
      <h2 id={`${g.id}-heading`}>{g.title}</h2>
      <p className="muted-note">Source structure: {g.sourceLabel}</p>
      <ol className="study-map-topics">{g.topics.map(t => <li key={t.id}>
        <div>{t.href ? <a href={t.href}>{t.title}</a> : <span>{t.title}</span>}</div>
        <small>{t.href ? "Introduction available" : "Planned adaptation"}</small>
      </li>)}</ol>
    </section>)}</div>
  </>;
}
