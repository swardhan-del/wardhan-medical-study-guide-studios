"use client";

import { useId, useMemo, useState } from "react";
import type { DirectoryEntry } from "@/lib/subject-directory";

type Choice = { id: string; title: string };
const categories = [
  ["printable", "Printable guide collections"],
  ["topics", "Topic libraries"],
  ["lectures", "Official lectures & course material"],
  ["visuals", "Diagrams & STEM visuals"],
  ["textbooks", "Textbooks & atlases"],
  ["notes", "Study guides & notes"],
  ["exam", "Exam preparation"],
];
function normalize(s: string) {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function DirectoryBrowser({
  entries,
  subjects,
  overview = false,
}: {
  entries: DirectoryEntry[];
  subjects?: Choice[];
  overview?: boolean;
}) {
  const id = useId();
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("");
  const [open, setOpen] = useState<Set<string>>(new Set());
  const [limit, setLimit] = useState(30);
  const tokens = normalize(query).split(" ").filter(Boolean);
  const selected = useMemo(
    () =>
      entries.filter(
        (e) =>
          (!subject || e.subjects.includes(subject)) &&
          (!category || e.category === category),
      ),
    [entries, subject, category],
  );
  const matches = selected.filter((e) =>
    tokens.every((t) =>
      normalize(`${e.title} ${e.trail} ${e.format || ""}`).includes(t),
    ),
  );
  const parents = useMemo(() => {
    const visible = new Set(selected.map((e) => e.id));
    const map = new Map<string | null, DirectoryEntry[]>();
    for (const e of selected) {
      const p = e.parentId && visible.has(e.parentId) ? e.parentId : null;
      map.set(p, [...(map.get(p) || []), e]);
    }
    return map;
  }, [selected]);
  const active = !overview || Boolean(query.trim() || subject || category);
  function reset() {
    setQuery("");
    setSubject("");
    setCategory("");
    setLimit(30);
    setOpen(new Set());
  }
  function toggle(key: string) {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }
  function link(e: DirectoryEntry) {
    return (
      <a
        href={e.url}
        target="_blank"
        rel="noopener noreferrer"
        className="directory-entry-link"
      >
        <span>{e.title}</span>
        <span aria-hidden="true">↗</span>
        <span className="sr-only"> — open in Dropbox (new tab)</span>
      </a>
    );
  }
  function branch(parentId: string | null, depth = 0): React.ReactNode {
    return (
      <ul className={depth ? "directory-children" : "directory-tree"}>
        {(parents.get(parentId) || []).map((e) => {
          const children = parents.get(e.id) || [];
          const expanded = open.has(e.id);
          return (
            <li key={e.id} className="directory-node">
              <div className="directory-node-line">
                {children.length ? (
                  <button
                    type="button"
                    className="directory-toggle"
                    aria-label={`${expanded ? "Collapse" : "Expand"} ${e.title}`}
                    aria-expanded={expanded}
                    aria-controls={`${id}-${e.id}`}
                    onClick={() => toggle(e.id)}
                  >
                    {expanded ? "−" : "+"}
                  </button>
                ) : (
                  <span className="directory-leaf-mark" aria-hidden="true">
                    {e.kind === "file" ? "▤" : "·"}
                  </span>
                )}
                <div>
                  {link(e)}
                  <span className="directory-kind">
                    {e.kind === "file"
                      ? e.format
                      : `${children.length ? children.length + " immediate subfolders / files · " : ""}${e.collection === "curated" ? "Curated folder" : "Dropbox folder"}`}
                  </span>
                </div>
              </div>
              {children.length > 0 && expanded && (
                <div id={`${id}-${e.id}`}>{branch(e.id, depth + 1)}</div>
              )}
            </li>
          );
        })}
      </ul>
    );
  }
  return (
    <div className="directory-browser">
      <div
        className="directory-controls"
        role="search"
        aria-label="Search the Dropbox directory"
      >
        <label htmlFor={`${id}-q`}>
          Find a subtopic or guide
          <input
            id={`${id}-q`}
            type="search"
            value={query}
            placeholder="Try renal, neurodevelopment, complement…"
            onChange={(e) => {
              setQuery(e.target.value);
              setLimit(30);
            }}
          />
        </label>
        {subjects && (
          <label htmlFor={`${id}-subject`}>
            Directory subject
            <select
              id={`${id}-subject`}
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value);
                setLimit(30);
              }}
            >
              <option value="">All subjects</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title}
                </option>
              ))}
            </select>
          </label>
        )}
        <label htmlFor={`${id}-category`}>
          Collection type
          <select
            id={`${id}-category`}
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setLimit(30);
            }}
          >
            <option value="">All collections</option>
            {categories.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>
      {!active ? (
        <p className="directory-search-hint">
          Search across every directory, or choose a subject below to browse its
          folders.
        </p>
      ) : (
        <>
          <div className="directory-toolbar">
            <p role="status">
              {matches.length}{" "}
              {tokens.length ? "matching links" : "directory links"}
            </p>
            <div>
              {!tokens.length && (
                <>
                  <button
                    type="button"
                    className="text-link"
                    onClick={() => setOpen(new Set(selected.map((e) => e.id)))}
                  >
                    Expand all folders
                  </button>
                  <button
                    type="button"
                    className="text-link"
                    onClick={() => setOpen(new Set())}
                  >
                    Collapse all folders
                  </button>
                </>
              )}
              <button type="button" className="text-link" onClick={reset}>
                Reset directory filters
              </button>
            </div>
          </div>
          {!matches.length ? (
            <div className="directory-empty">
              <h3>No matching folders or guides.</h3>
              <p>Try a shorter term or reset the directory filters.</p>
            </div>
          ) : tokens.length ? (
            <>
              <ul className="directory-results">
                {matches.slice(0, limit).map((e) => (
                  <li key={e.id}>
                    {link(e)}
                    <p>
                      {[
                        subjects?.find((s) => s.id === e.subjects[0])?.title,
                        e.trail,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                    <span className="directory-kind">
                      {e.kind === "file" ? e.format : "Folder"} ·{" "}
                      {e.collection === "curated"
                        ? "Curated topic library"
                        : "Original subject collection"}
                    </span>
                  </li>
                ))}
              </ul>
              {matches.length > limit && (
                <button
                  type="button"
                  className="button button-secondary"
                  onClick={() => setLimit((n) => n + 30)}
                >
                  Show more directory results
                </button>
              )}
            </>
          ) : (
            branch(null)
          )}
        </>
      )}
    </div>
  );
}
