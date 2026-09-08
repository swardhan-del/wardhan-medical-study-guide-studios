"use client";
import { useRef, useState } from "react";
import type { PublicVideo } from "@/lib/video-types";
import { videoDuration } from "@/lib/video-types";
export function VideoPlayer({ video }: { video: PublicVideo }) {
  const player = useRef<HTMLVideoElement>(null);
  const pendingSeek = useRef<number | null>(null);
  const [fullscreenNotice, setFullscreenNotice] = useState("");
  const [error, setError] = useState(false);
  return (
    <section className="native-video" aria-label={video.title}>
      <video
        ref={player}
        controls
        playsInline
        preload="none"
        width={video.width}
        height={video.height}
        style={{ aspectRatio: `${video.width} / ${video.height}` }}
        onLoadedMetadata={() => {
          if (player.current && pendingSeek.current !== null) {
            player.current.currentTime = pendingSeek.current;
            pendingSeek.current = null;
          }
        }}
        poster={video.posterUrl}
        onError={() => setError(true)}
        aria-label={video.title}
        crossOrigin="anonymous"
      >
        <source
          src={video.sourceUrl}
          type={video.mimeType}
          onError={() => setError(true)}
        />
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
          onClick={async () => {
            const p = player.current as
              | (HTMLVideoElement & { webkitEnterFullscreen?: () => void })
              | null;
            setFullscreenNotice("");
            try {
              if (p?.requestFullscreen) await p.requestFullscreen();
              else if (p?.webkitEnterFullscreen) p.webkitEnterFullscreen();
              else
                setFullscreenNotice(
                  "Use the video's native controls to enlarge it on this browser.",
                );
            } catch {
              setFullscreenNotice(
                "Fullscreen is unavailable here. The video can still play in this page.",
              );
            }
          }}
        >
          Fullscreen
        </button>
      </div>
      {fullscreenNotice && <p role="status">{fullscreenNotice}</p>}
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
          AI-assisted educational recap with synthetic voices. The script was checked against the lesson sources; independent clinical peer review has not been completed.
        </p>
      )}
      <details className="study-details">
        <summary>
          {video.audioContent === "silent"
            ? "Visual description"
            : video.transcript.length
              ? "Read transcript"
              : "Transcript unavailable"}
        </summary>
        {video.transcript.length ? (
          <ol className="video-transcript">
            {video.transcript.map((line, i) => (
              <li key={i}>
                <button
                  className="plain-button"
                  aria-label={"Seek to " + videoDuration(line.startSeconds)}
                  onClick={() => {
                    const p = player.current;
                    if (!p) return;
                    if (p.readyState === 0) {
                      pendingSeek.current = line.startSeconds;
                      p.load();
                    } else p.currentTime = line.startSeconds;
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
      {video.audioContent === "silent" ? (
        <p>
          Silent video. The visual description explains the teaching content.
        </p>
      ) : (
        !video.captions.length && (
          <p>Captions are not available for this video.</p>
        )
      )}
    </section>
  );
}
