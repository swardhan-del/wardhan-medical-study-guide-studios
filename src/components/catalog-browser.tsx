"use client";
import { conceptLessonIds, conceptExamples, type ConceptLink } from "@/lib/concept-discovery";
import { useLearning } from "./learning-store";
import Link from "next/link";
import { SaveButton } from "./save-button";
import { useRef, useState } from "react";
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
  conceptMode?: boolean;
  conceptLinks?: ConceptLink[];
};
export function CatalogBrowser({
  records,
  basePath = "/library",
  savedOnly = false,
  initialSubject = "",
  initialQuery = "",
  conceptMode = false,
  conceptLinks = [],
}: Props) {
  const searchInput = useRef<HTMLInputElement>(null);
  const { data, ready: progressReady } = useLearning();
  const [progress, setProgress] = useState("");
  const [query, setQuery] = useState(initialQuery);
  const [subject, setSubject] = useState(initialSubject);
  const [format, setFormat] = useState("");
  const [sort, setSort] = useState("title");
  const [visibleCount, setVisibleCount] = useState(18);
  const { saved, ready } = useReadingList();
  const matchesSubject = (record: CatalogRecord) => !subject || (subject === "genetics-all" ? record.subject === "genetics" : record.status === "private-review" ? record.subject === subject : taxonomy.nodes.some(n => n.subject === subject && n.resources.includes(record.id)));
  const progressState = (id: string) => data.lessons.includes(id) ? "complete" : data.journey[id] || data.resume?.lesson === id || data.answers[`concept-${id}`] ? "started" : "new";
  const scoped = records.filter(record => (!savedOnly || saved.includes(record.id)) && matchesSubject(record) && (!format || record.format === format) && (!progress || (record.kind === "Study lesson" && progressState(record.id) === progress)));
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
  const conceptMatches = conceptMode && query.trim() ? conceptLessonIds(query).flatMap(id => { const record = scoped.find(r => r.id === id && r.status === "public"); const link = conceptLinks.find(l => l.id === id); return record && link ? [{ record, link }] : []; }) : [];
  const hasFilters = Boolean(query || subject || format || progress);
  const availableFormats = [
    ...new Set(
      records
        .filter(matchesSubject)
        .map((record) => record.format),
    ),
  ];
  const shownRecords = filtered.slice(0, visibleCount);
  function reset() {
    setProgress("");
    searchInput.current?.focus();
    setQuery("");
    setSubject("");
    setFormat("");
    setSort("title");
    setVisibleCount(18);
  }
  return (
    <div className="catalog-browser">
      {conceptMode && <section className="study-panel" aria-label="Concept discovery"><p>Describe what is confusing. Related lesson suggestions point to existing explanations; they do not generate an answer or establish that every part of your question is covered.</p><details><summary>Try a study question</summary><ul>{conceptExamples.map(example => <li key={example}><Link href={`/library?mode=concept&q=${encodeURIComponent(example)}`}>{example}</Link></li>)}</ul></details></section>}
      <form action="/library" method="get"
        className="catalog-controls"
        role="search"
        aria-label="Filter study resources"
        onSubmit={event => { event.preventDefault(); setVisibleCount(18); }}
      >
        {conceptMode && <input type="hidden" name="mode" value="concept" />}
        <label className="search-field">
          Search resources
          <input
            ref={searchInput}
            name="q"
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
            name="subject"
            aria-label="Subject"
            value={subject}
            onChange={(event) => {
              setSubject(event.target.value);
              setFormat("");
              setVisibleCount(18);
            }}
          >
            <option value="">All subjects</option>
            <optgroup label="Subjects">{subjectInterests.map(item => <option key={item.id} value={item.id === "genetics" ? "genetics-all" : item.id}>{item.title}</option>)}</optgroup>
            <optgroup label="Additional subjects">{taxonomy.subjects.filter(item => item.learningSubject === null).map(item => <option key={item.id} value={item.id}>{item.title}</option>)}</optgroup>
            <optgroup label="Course subsets">{taxonomy.subjects.filter(item => ["histology-i", "histology-ii", "genetics", "immunology"].includes(item.id)).map(item => <option key={item.id} value={item.id}>{item.title} subset</option>)}</optgroup>
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
        {records.some(record => record.status === "public" && record.kind === "Study lesson") && <label>Lesson progress<select aria-label="Lesson progress" value={progress} disabled={!progressReady} onChange={event => { setProgress(event.target.value); setVisibleCount(18); }}><option value="">All resources</option><option value="new">Lessons not started</option><option value="started">Lessons in progress</option><option value="complete">Lessons marked complete</option></select></label>}
        <button className="button button-secondary" type="submit">Search resources</button>
      </form>
      <noscript><p>Submit the search form to filter the server-rendered results. Interactive checks and saved progress require JavaScript; explanations and model reasoning remain readable.</p></noscript>
      {conceptMode && query && <section className="study-panel" aria-labelledby="concept-matches-title"><h2 id="concept-matches-title">Related explanations to start with</h2>{conceptMatches.length ? <ul>{conceptMatches.map(({ record, link }) => <li key={record.id}><h3><Link href={`/library/${record.id}#concept-map-title`}>{record.title}</Link></h3><p>{record.summary}</p>{link.prerequisites.length > 0 && <p>Prepare with: {link.prerequisites.map(p => <Link key={p.id} href={`/library/${p.id}#lesson-objectives`}>{p.title} · </Link>)}</p>}<div className="action-row">{link.worked && <Link href={`/library/${record.id}#worked-example-heading`}>Try the worked example</Link>}<Link href={`/library/${record.id}#concept-check-title`}>Check the relationship</Link><Link href={`/library/${record.id}#lesson-source`}>Check sources and scope</Link></div></li>)}</ul> : <p>No curated concept match is available for this question in the selected subject. Keyword results below may help, but are not a verified answer. Try the central scientific term or another subject.</p>}</section>}
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
      {!savedOnly && format === "PDF" && <p className="study-notice">The PDF results list downloadable files. <Link href="/library#printable-notes">Printable revision notes for all seven subjects</Link> are also available as web pages you can print or save as PDF.</p>}
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
              {record.kind === "Study lesson" && progressReady && <p className="practice-status">{progressState(record.id) === "complete" ? "Marked complete" : progressState(record.id) === "started" ? "In progress" : "Not started"}</p>}
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
