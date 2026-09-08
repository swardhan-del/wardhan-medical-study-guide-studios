"use client";
/* eslint-disable @next/next/no-img-element -- Approved external media hosts vary; poster dimensions are reserved and loading is lazy. */
import Link from "next/link";
import { useState } from "react";
import type { PublicVideo } from "@/lib/video-types";
import { videoDuration } from "@/lib/video-types";
export function VideoBrowser({
  videos,
  topics,
}: {
  videos: PublicVideo[];
  topics: { id: string; title: string }[];
}) {
  const [query, setQuery] = useState(""),
    [topic, setTopic] = useState("");
  const shown = videos.filter(
    (v) =>
      (!topic || v.topicIds.includes(topic)) &&
      (v.title + " " + v.summary).toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <section aria-label="Video library">
      <div className="catalog-controls">
        <label>
          Search videos
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <label>
          Video topic
          <select value={topic} onChange={(e) => setTopic(e.target.value)}>
            <option value="">All topics</option>
            {topics.map((t) => (
              <option value={t.id} key={t.id}>
                {t.title}
              </option>
            ))}
          </select>
        </label>
      </div>
      <p role="status">{shown.length} videos</p>
      {(query || topic) && (
        <button
          className="plain-button"
          onClick={() => {
            setQuery("");
            setTopic("");
          }}
        >
          Clear filters
        </button>
      )}
      <div className="resource-grid">
        {shown.map((v) => (
          <article className="resource-card" key={v.id}>
            <img
              className="video-poster"
              src={v.posterUrl}
              width={v.width}
              height={v.height}
              alt=""
              loading="lazy"
              decoding="async"
            />
            <p>
              {videoDuration(v.durationSeconds)}
              {v.aiGenerated ? " · AI-generated" : ""}
            </p>
            <h2>
              <Link href={"/videos/" + v.id}>{v.title}</Link>
            </h2>
            <p>{v.summary}</p>
            <p>
              {v.captions.length
                ? "Captions available"
                : v.audioContent === "silent"
                  ? "Silent video"
                  : "Captions unavailable"}
            </p>
            <Link className="text-link" href={"/videos/" + v.id}>
              Watch video
            </Link>
          </article>
        ))}
      </div>
      {!shown.length && (
        <p className="catalog-empty">
          {videos.length
            ? "No videos match these filters. Try a broader search or clear your filters."
            : "Browse the study library for available lessons and practice activities."}
        </p>
      )}
    </section>
  );
}
