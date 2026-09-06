"use client";
import Link from "next/link";
import { useState } from "react";
import { subjectInterests } from "@/content/subjects";
import type { CatalogRecord } from "@/lib/catalog-types";
import { formatBytes } from "@/lib/catalog-types";
import { useReadingList } from "./reading-list-provider";

type Props = {
  records: CatalogRecord[];
  basePath?: string;
  savedOnly?: boolean;
  initialSubject?: string;
};
export function CatalogBrowser({
  records,
  basePath = "/library",
  savedOnly = false,
  initialSubject = "",
}: Props) {
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState(initialSubject);
  const [format, setFormat] = useState("");
  const [sort, setSort] = useState("title");
  const { saved, ready } = useReadingList();
  const filtered = records
    .filter(
      (record) =>
        (!savedOnly || saved.includes(record.id)) &&
        (!subject || record.subject === subject) &&
        (!format || record.format === format) &&
        `${record.title} ${record.summary} ${record.kind} ${subjectInterests.find((s) => s.id === record.subject)?.title ?? ""}`
          .toLocaleLowerCase()
          .includes(query.trim().toLocaleLowerCase()),
    )
    .sort((a, b) =>
      sort === "recent"
        ? b.updatedAt.localeCompare(a.updatedAt) ||
          a.title.localeCompare(b.title)
        : a.title.localeCompare(b.title),
    );
  const hasFilters = Boolean(query || subject || format);
  function reset() {
    setQuery("");
    setSubject("");
    setFormat("");
    setSort("title");
  }
  return (
    <div className="catalog-browser">
      <div
        className="catalog-controls"
        role="search"
        aria-label="Filter study resources"
      >
        <label className="search-field">
          Search resources
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search titles, subjects, or topics"
          />
        </label>
        <label>
          Subject
          <select
            aria-label="Subject"
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
          >
            <option value="">All subjects</option>
            {subjectInterests.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </select>
        </label>
        <label>
          Format
          <select
            aria-label="Format"
            value={format}
            onChange={(event) => setFormat(event.target.value)}
          >
            <option value="">All formats</option>
            {["PDF", "DOCX", "PPTX"].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label>
          Sort by
          <select
            aria-label="Sort by"
            value={sort}
            onChange={(event) => setSort(event.target.value)}
          >
            <option value="title">Title A–Z</option>
            <option value="recent">Recently updated</option>
          </select>
        </label>
      </div>
      <div className="catalog-summary">
        <p role="status" aria-live="polite">
          {savedOnly && !ready
            ? "Loading reading list…"
            : `${filtered.length} resource${filtered.length === 1 ? "" : "s"}`}
        </p>
        {hasFilters ? (
          <button type="button" className="plain-button" onClick={reset}>
            Clear filters
          </button>
        ) : null}
      </div>
      {filtered.length ? (
        <div className="resource-grid">
          {filtered.map((record) => (
            <article className="resource-card" key={record.id}>
              <div className="resource-topline">
                <span>
                  {record.format} · {record.kind}
                </span>
                <span>{formatBytes(record.bytes)}</span>
              </div>
              <p className="resource-subject">
                {
                  subjectInterests.find((item) => item.id === record.subject)
                    ?.title
                }
              </p>
              <h2>
                <Link href={`${basePath}/${record.id}`}>{record.title}</Link>
              </h2>
              <p>{record.summary}</p>
              <div className="resource-bottom">
                <Link className="card-link" href={`${basePath}/${record.id}`}>
                  View resource <span aria-hidden="true">→</span>
                </Link>
                {record.status === "public" ? (
                  <SaveButton id={record.id} title={record.title} />
                ) : (
                  <span className="review-tag">Private review</span>
                )}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="catalog-empty">
          <p className="eyebrow">
            {hasFilters
              ? "Try another search"
              : savedOnly
                ? "Your reading list"
                : "Library availability"}
          </p>
          <h2>
            {hasFilters
              ? "No matching resources."
              : savedOnly
                ? "A place for your next session."
                : "The first public resources are being prepared."}
          </h2>
          <p>
            {hasFilters
              ? "Try a shorter search or clear the filters to see all available resources."
              : savedOnly
                ? "Save resources from the library and return to them here. Your list stays in this browser."
                : "Browse the subjects to explore the library’s structure. Released guides will appear here when available."}
          </p>
          {hasFilters ? (
            <button
              className="button button-secondary"
              type="button"
              onClick={reset}
            >
              Clear filters
            </button>
          ) : (
            <Link
              className="button button-secondary"
              href={savedOnly ? "/library" : "/subjects"}
            >
              {savedOnly ? "Browse the library" : "Explore subjects"}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
export function SaveButton({ id, title }: { id: string; title: string }) {
  const { saved, toggle, ready } = useReadingList();
  const active = saved.includes(id);
  return (
    <button
      className="save-button"
      disabled={!ready}
      aria-pressed={active}
      aria-label={`${active ? "Remove" : "Save"} ${title}${active ? " from" : " to"} reading list`}
      type="button"
      onClick={() => toggle(id)}
    >
      {active ? "Saved ✓" : "Save +"}
    </button>
  );
}
