"use client";
import Link from "next/link";
import { useState } from "react";
import { subjectInterests } from "@/content/subjects";
import type { CatalogRecord } from "@/lib/catalog-types";
import { formatBytes, formatLabels, resourceHref } from "@/lib/catalog-types";
import { matchesCatalogQuery } from "@/lib/catalog-filter";
import { useReadingList } from "./reading-list-provider";

type Props = {
  records: CatalogRecord[];
  basePath?: string;
  savedOnly?: boolean;
  initialSubject?: string;
  initialQuery?: string;
  showSubjectNavigation?: boolean;
};
export function CatalogBrowser({
  records,
  basePath = "/library",
  savedOnly = false,
  initialSubject = "",
  initialQuery = "",
  showSubjectNavigation = false,
}: Props) {
  const [query, setQuery] = useState(initialQuery);
  const [subject, setSubject] = useState(initialSubject);
  const [format, setFormat] = useState("");
  const [sort, setSort] = useState("title");
  const [visibleCount, setVisibleCount] = useState(18);
  const { saved, ready } = useReadingList();
  const filtered = records
    .filter(
      (record) =>
        (!savedOnly || saved.includes(record.id)) &&
        (!subject || record.subject === subject) &&
        (!format || record.format === format) &&
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
        : a.title.localeCompare(b.title),
    );
  const hasFilters = Boolean(query || subject || format);
  const availableFormats = [
    ...new Set(
      records
        .filter((record) => !subject || record.subject === subject)
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
      {showSubjectNavigation && (
        <nav className="library-subjects" aria-label="Browse library subjects">
          {subjectInterests.map((item) => (
            <Link
              key={item.id}
              href={`/library?subject=${item.id}`}
              aria-current={subject === item.id ? "true" : undefined}
            >
              <span>{item.title}</span>
              <strong>
                {records.filter((record) => record.subject === item.id).length}
              </strong>
            </Link>
          ))}
        </nav>
      )}
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
            onChange={(event) => {
              setQuery(event.target.value);
              setVisibleCount(18);
            }}
            placeholder="Search titles, subjects, or topics"
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
          {shownRecords.map((record) => (
            <article className="resource-card" key={record.id}>
              <div className="resource-topline">
                <span>{formatLabels[record.format]}</span>
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
              <div className="resource-bottom">
                <Link
                  className="card-link"
                  href={resourceHref(record, basePath)}
                >
                  {record.format === "WEB"
                    ? "Open lesson"
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
      aria-label={`${active ? "Remove" : "Save"} ${title}${active ? " from" : " to"} reading list`}
      type="button"
      onClick={() => toggle(id)}
    >
      {active ? "Saved ✓" : "Save +"}
    </button>
  );
}
