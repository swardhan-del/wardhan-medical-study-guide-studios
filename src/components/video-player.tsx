"use client";
import { useRef, useState } from "react";
import type { PublicVideo } from "@/lib/video-types";
import { videoDuration } from "@/lib/video-types";
export function VideoPlayer({ video }: { video: PublicVideo }) {
  const player = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState(false);
  return (
    <section className="native-video" aria-label={video.title}>
      <video
        ref={player}
        controls
        playsInline
        preload="none"
        poster={video.posterUrl}
        onError={() => setError(true)}
        aria-label={video.title}
        crossOrigin="anonymous"
      >
        <source src={video.sourceUrl} type={video.mimeType} />
        {video.captions.map((c, i) => (
          <track
            key={c.language}
            kind="captions"
            src={c.src}
            srcLang={c.language}
            label={c.label}
            default={i === 0}
          />
        ))}
        Your browser cannot play this video.
      </video>
      <div className="action-row">
        <label>
          Playback speed
          <select
            defaultValue="1"
            onChange={(e) => {
              if (player.current)
                player.current.playbackRate = Number(e.target.value);
            }}
          >
            {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
              <option key={rate} value={rate}>
                {rate}×
              </option>
            ))}
          </select>
        </label>
        <button
          className="button button-secondary"
          onClick={() => {
            const p = player.current;
            if (p?.requestFullscreen)
              p.requestFullscreen().catch(() => setError(true));
          }}
        >
          Fullscreen
        </button>
      </div>
      {error && (
        <p role="alert">
          Playback is unavailable. Try opening the video directly or read the
          transcript below.
        </p>
      )}
      <a href={video.sourceUrl} target="_blank" rel="noopener noreferrer">
        Open video in a new tab
      </a>
      {video.aiGenerated && (
        <p className="muted-note">
          AI-generated educational material. The release review does not replace
          clinical guidance.
        </p>
      )}
      <details className="study-details">
        <summary>Transcript</summary>
        {video.transcript.length ? (
          <ol className="video-transcript">
            {video.transcript.map((line, i) => (
              <li key={i}>
                <button
                  className="plain-button"
                  aria-label={"Seek to " + videoDuration(line.startSeconds)}
                  onClick={() => {
                    if (player.current)
                      player.current.currentTime = line.startSeconds;
                  }}
                >
                  {videoDuration(line.startSeconds)}
                </button>{" "}
                <span>{line.text}</span>
              </li>
            ))}
          </ol>
        ) : (
          <p>A transcript is not available for this video.</p>
        )}
      </details>
      {!video.captions.length && (
        <p>Captions are not available for this video.</p>
      )}
    </section>
  );
}
