"use client";
import Link from "next/link";
import { useState } from "react";
import { subjectInterests } from "@/content/subjects";
import type { CatalogRecord } from "@/lib/catalog-types";
import { formatBytes, formatLabels, resourceHref } from "@/lib/catalog-types";
import taxonomy from "@/content/library-taxonomy.json";
import { catalogSearchText, suggestQuery, searchRank, matchesCatalogQuery } from "@/lib/catalog-filter";
import { useReadingList } from "./reading-list-provider";

type Props = {
  records: CatalogRecord[];
  basePath?: string;
  savedOnly?: boolean;
  initialSubject?: string;
  initialQuery?: string;
};
export function CatalogBrowser({
  records,
  basePath = "/library",
  savedOnly = false,
  initialSubject = "",
  initialQuery = "",
}: Props) {
  const [query, setQuery] = useState(initialQuery);
  const [subject, setSubject] = useState(initialSubject);
  const [format, setFormat] = useState("");
  const [sort, setSort] = useState("title");
  const [visibleCount, setVisibleCount] = useState(18);
  const { saved, ready } = useReadingList();
  const scoped = records.filter(record => (!savedOnly || saved.includes(record.id)) && (!subject || (record.status === "private-review" ? record.subject === subject : taxonomy.nodes.some(n => n.subject === subject && n.resources.includes(record.id)))) && (!format || record.format === format));
  const filtered = scoped
    .filter(
      (record) =>
        matchesCatalogQuery(
          record,
          query,
          subjectInterests.find((s) => s.id === record.subject)?.title ?? "",
        ),
    )
    .sort((a, b) =>
      sort === "recent"
        ? b.updatedAt.localeCompare(a.updatedAt) ||
          a.title.localeCompare(b.title)
        : searchRank(b, query) - searchRank(a, query) || a.title.localeCompare(b.title),
    );
  const suggestion = query && !filtered.length ? suggestQuery(scoped.map(r => catalogSearchText(r)), query) : null;
  const hasFilters = Boolean(query || subject || format);
  const availableFormats = [
    ...new Set(
      records
        .filter((record) => !subject || (record.status === "private-review" ? record.subject === subject : taxonomy.nodes.some(n => n.subject === subject && n.resources.includes(record.id))))
        .map((record) => record.format),
    ),
  ];
  const shownRecords = filtered.slice(0, visibleCount);
  function reset() {
    setQuery("");
    setSubject("");
    setFormat("");
    setSort("title");
    setVisibleCount(18);
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
            maxLength={200}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setVisibleCount(18);
            }}
            placeholder="Search topics, lessons, or keywords"
          />
        </label>
        <label>
          Subject
          <select
            aria-label="Subject"
            value={subject}
            onChange={(event) => {
              setSubject(event.target.value);
              setFormat("");
              setVisibleCount(18);
            }}
          >
            <option value="">All subjects</option>
            {taxonomy.subjects.map((item) => (
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
            onChange={(event) => {
              setFormat(event.target.value);
              setVisibleCount(18);
            }}
          >
            <option value="">All formats</option>
            {availableFormats.map((item) => (
              <option key={item} value={item}>
                {formatLabels[item]}
              </option>
            ))}
          </select>
        </label>
        <label>
          Sort by
          <select
            aria-label="Sort by"
            value={sort}
            onChange={(event) => {
              setSort(event.target.value);
              setVisibleCount(18);
            }}
          >
            <option value="title">{query ? "Relevance" : "Title A–Z"}</option>
            <option value="recent">Recently updated</option>
          </select>
        </label>
      </div>
      <div className="catalog-summary">
        <p role="status" aria-live="polite">
          {savedOnly && !ready
            ? "Loading study resources…"
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
          {shownRecords.map((record) => (
            <article className="resource-card" key={record.id}>
              <div className="resource-topline">
                <span>{record.kind.includes("Study map") ? "Study outline" : record.kind === "Study lesson" ? "Concept introduction" : record.kind === "Interactive topic lessons" ? "Interactive topic lessons" : formatLabels[record.format]}</span>
                <span>
                  {record.minutes
                    ? `${record.minutes} min`
                    : formatBytes(record.bytes)}
                </span>
              </div>
              <p className="resource-subject">
                {
                  subjectInterests.find((item) => item.id === record.subject)
                    ?.title
                }
              </p>
              <h2>
                <Link href={resourceHref(record, basePath)}>
                  {record.title}
                </Link>
              </h2>
              <p>{record.summary}</p>
              {query && searchRank(record, query) === 1 && <p className="search-match-note">Matches lesson explanation, figure caption or recap</p>}
              <div className="resource-bottom">
                <Link
                  className="card-link"
                  href={resourceHref(record, basePath)}
                >
                  {record.kind.includes("Study map") ? "Open study outline" : record.format === "WEB"
                    ? "Read lesson"
                    : record.format === "ACTIVITY"
                      ? "Start practice"
                      : "View resource"}{" "}
                  <span aria-hidden="true">→</span>
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
                ? "Your saved resources"
                : "Library availability"}
          </p>
          <h2>
            {hasFilters
              ? "No matching resources."
              : savedOnly
                ? "No saved resources yet"
                : "No resources are available here yet"}
          </h2>
          <p>
            {hasFilters
              ? "No resources match these filters. Try a broader search or clear your filters."
              : savedOnly
                ? "Save a lesson or activity from the library to find it here for your next study session."
                : "Browse the subjects to find available lessons and activities."}
          </p>
          {suggestion && <p>Did you mean <button className="plain-button" onClick={() => { setQuery(suggestion); setVisibleCount(18); }}>{suggestion}</button>?</p>}
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
              {savedOnly ? "Explore the library" : "Explore subjects"}
            </Link>
          )}
        </div>
      )}
      {filtered.length > visibleCount && (
        <div className="catalog-more">
          <p>
            Showing {shownRecords.length} of {filtered.length} resources
          </p>
          <button
            className="button button-secondary"
            onClick={() => setVisibleCount((count) => count + 18)}
          >
            Show more resources
          </button>
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
      aria-label={`${active ? "Saved to My Study" : "Save to My Study"}: ${title}${active ? " (remove from saved resources)" : ""}`}
      type="button"
      onClick={() => toggle(id)}
    >
      {active ? "Saved to My Study" : "Save to My Study"}
    </button>
  );
}
