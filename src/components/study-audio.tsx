"use client";
import { useId, useRef, useState } from "react";
import { videoDuration } from "@/lib/video-types";
export type StudyAudioRecord = { lessonId: string; title: string; src: string; durationSeconds: number; transcript: { startSeconds: number; speaker: string; text: string }[] };
export function StudyAudio({ audio }: { audio: StudyAudioRecord }) {
  const player = useRef<HTMLAudioElement>(null);
  const pending = useRef<number | null>(null);
  const [error, setError] = useState(false);
  const id = useId();
  return <section className="study-panel study-audio" id="audio-recap" aria-labelledby={id}>
    <p className="eyebrow">AI-assisted audio recap · synthetic voices</p>
    <h2 id={id}>Listen and explain: {audio.title}</h2>
    <p>{videoDuration(audio.durationSeconds)} · Question-and-answer recap with two synthetic voices. Script checked against the lesson sources; no independent clinical peer review.</p>
    <audio ref={player} controls preload="none" aria-label={audio.title} src={audio.src} onError={() => setError(true)} onLoadedMetadata={() => {
      if (player.current && pending.current !== null) { player.current.currentTime = pending.current; pending.current = null; }
    }} />
    <label>Audio speed <select defaultValue="1" onChange={e => { if (player.current) player.current.playbackRate = Number(e.target.value); }}>
      {[0.75, 1, 1.25, 1.5, 2].map(n => <option value={n} key={n}>{n}×</option>)}
    </select></label>
    {error && <p role="alert">Audio is unavailable. You can still read the full transcript below.</p>}
    <details><summary>Read audio transcript</summary>
      <ol className="video-transcript">{audio.transcript.map((line, i) => <li key={i}>
        <button className="plain-button" aria-label={"Seek audio to " + videoDuration(line.startSeconds)} onClick={() => {
          const p = player.current; if (!p) return;
          if (p.readyState === 0) { pending.current = line.startSeconds; p.load(); } else p.currentTime = line.startSeconds;
        }}>{videoDuration(line.startSeconds)}</button>{" "}<strong>{line.speaker}:</strong> {line.text}
      </li>)}</ol>
    </details>
    <a href={audio.src} download>Download audio recap</a>
  </section>;
}
