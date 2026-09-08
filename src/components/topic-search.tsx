"use client";
import { useState } from "react";
import Link from "next/link";
type Item = {
  id: string;
  title: string;
  subject: string;
  subjectTitle: string;
  kind: string;
  count: number;
};
export function TopicSearch({ items }: { items: Item[] }) {
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState("");
  const [limit, setLimit] = useState(18);
  const filtered = items.filter(
    (n) =>
      (!subject || n.subject === subject) &&
      query
        .trim()
        .toLowerCase()
        .split(/\s+/)
        .every((word) =>
          (n.title + " " + n.subjectTitle).toLowerCase().includes(word),
        ),
  );
  return (
    <section aria-label="Find a topic">
      <div className="catalog-controls">
        <label>
          Search topics
          <input
            type="search"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setLimit(18); }}
            placeholder="Try renal, tissues or metabolism"
          />
        </label>
        <label>
          Topic subject
          <select value={subject} onChange={(e) => { setSubject(e.target.value); setLimit(18); }}>
            <option value="">All subjects</option>
            {Array.from(
              new Map(items.map((n) => [n.subject, n.subjectTitle])),
            ).map(([id, title]) => (
              <option key={id} value={id}>
                {title}
              </option>
            ))}
          </select>
        </label>
      </div>
      <p role="status">{filtered.length} topics</p>
      {query || subject ? (
        <button
          className="plain-button"
          onClick={() => {
            setQuery("");
            setSubject("");
            setLimit(18);
          }}
        >
          Clear topic filters
        </button>
      ) : null}
      <ul className="native-topic-results">
        {filtered.slice(0, limit).map((n) => (
          <li key={n.id}>
            <Link href={"/topics/" + n.id}>{n.title}</Link>
            <span>
              {n.subjectTitle} · {n.count} {n.count === 1 ? "resource" : "resources"}
            </span>
          </li>
        ))}
      </ul>
      {filtered.length > limit && <button className="button button-secondary" onClick={() => setLimit(value => value + 18)}>Show more topics</button>}
      {!filtered.length && (
        <p>No matching topics. Try another term or clear the filters.</p>
      )}
    </section>
  );
}
