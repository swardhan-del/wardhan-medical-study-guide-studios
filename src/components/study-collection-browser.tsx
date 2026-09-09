"use client";
import { matchesSearchText, suggestQuery } from "@/lib/catalog-filter";
import { useId, useState } from "react";
import Link from "next/link";
import { FigureThumbnail } from "./educational-figure";
import type { PublicFigure } from "@/lib/figures";
type LessonCard = { id: string; title: string; summary: string; tags: string[]; searchText?: string; group: string; groupTitle: string; minutes: number; figure?: PublicFigure; videoId?: string; duration?: string; audio: boolean };
export function StudyCollectionBrowser({ cards, groups }: { cards: LessonCard[]; groups: { id: string; title: string }[] }) {
  const [query, setQuery] = useState(""), [group, setGroup] = useState("all"), [format, setFormat] = useState("all");
  const id = useId();
  const filtered = cards.filter(c => (group === "all" || c.group === group) && (format !== "video" || c.videoId) && (format !== "audio" || c.audio) && (format !== "figures" || c.figure) && matchesSearchText(c.title + " " + c.summary + " " + c.tags.join(" ") + " " + (c.searchText ?? ""), query));
  const suggestion = !filtered.length ? suggestQuery(cards.filter(c => group === "all" || c.group === group).map(c => c.title + " " + c.summary + " " + (c.searchText ?? "")), query) : null;
  return <section aria-label="Browse subject lessons">
    <div className="studio-filters">
      <label htmlFor={id + "-search"}>Search this subject<input id={id + "-search"} type="search" maxLength={200} placeholder="Search topics, lessons, or keywords" value={query} onChange={e => setQuery(e.target.value)} /></label>
      <label htmlFor={id + "-topic"}>Section<select id={id + "-topic"} value={group} onChange={e => { setGroup(e.target.value); setQuery(""); setFormat("all"); }}><option value="all">All sections</option>{groups.map(g => <option key={g.id} value={g.id}>{g.title}</option>)}</select></label>
      <label htmlFor={id + "-format"}>Study format<select id={id + "-format"} value={format} onChange={e => setFormat(e.target.value)}><option value="all">All lessons and recap cards</option>{cards.some(c=>c.videoId) && <option value="video">With narrated video</option>}{cards.some(c=>c.audio) && <option value="audio">With audio recap</option>}{cards.some(c=>c.figure) && <option value="figures">With study figures</option>}</select></label>
      <button className="button button-secondary" onClick={() => { setQuery(""); setGroup("all"); setFormat("all"); }}>Clear filters</button>
    </div>
    <p role="status">{filtered.length} {filtered.length === 1 ? "lesson" : "lessons"} available</p>
    {!filtered.length && <p className="catalog-empty">No resources match these filters. Try a broader search or clear your filters.</p>}
    {suggestion && <p>Did you mean <button className="plain-button" onClick={() => setQuery(suggestion)}>{suggestion}</button>?</p>}
    {groups.filter(g => filtered.some(c => c.group === g.id)).map(g => <section key={g.id} id={g.id} className="studio-group" aria-labelledby={id + g.id}>
      <h2 id={id + g.id}>{g.title}</h2>
      <div className="studio-grid">{filtered.filter(c => c.group === g.id).map(c => <article className="study-panel studio-card" key={c.id}>
        <FigureThumbnail figure={c.figure} /><h3><Link href={"/library/" + c.id}>{c.title}</Link></h3><p>{c.summary}</p>
        <p className="muted-note">{c.minutes} minute introduction · Explained questions · Recap cards</p>
        <div className="action-row"><Link className="button button-primary" href={"/library/" + c.id}>Read lesson</Link><Link href={"/library/" + c.id + "#concept-check-title"}>Start practice</Link></div>
        {(c.videoId || c.audio) && <div className="studio-media-links">{c.videoId && <Link href={"/videos/" + c.videoId}>Watch video · {c.duration} · English captions</Link>}{c.audio && <Link href={"/library/" + c.id + "#audio-recap"}>Listen to audio recap</Link>}</div>}
      </article>)}</div>
    </section>)}
  </section>;
}
