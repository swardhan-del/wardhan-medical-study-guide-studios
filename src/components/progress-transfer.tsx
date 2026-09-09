"use client";
import { useRef, useState } from "react";
import { learningLessonIds, learningQuestionIds, learningDraftIds } from "@/content/practice-registry";
import catalog from "@/content/public-catalog.json";
import { localDate } from "@/lib/learning-core";
import { readTransfer, mergeProgress } from "@/lib/progress-transfer";
import { useLearning, updateLearning } from "./learning-store";
import { useReadingList } from "./reading-list-provider";

export function ProgressTransfer() {
  const { data, ready, persistent } = useLearning();
  const { saved, add, message: storageMessage } = useReadingList();
  const [pending, setPending] = useState<ReturnType<typeof readTransfer> | null>(null);
  const [message, setMessage] = useState("");
  const request = useRef(0);
  function exportFile() { return new File([JSON.stringify({ format: "wardhan-study-export", version: 1, progress: data, saved }, null, 2)], `wardhan-study-${localDate()}.json`, { type: "application/json" }); }
  return <section className="study-panel" id="progress-transfer" aria-labelledby="transfer-title">
    <h2 id="transfer-title">Move your study progress between devices</h2>
    <p>Download a file here, transfer it to your other device, then import it in My Study. It includes answers, written notes, your plan and saved resources. Keep the file somewhere private.</p>
    <button className="button button-secondary" disabled={!ready} onClick={() => {
      const url = URL.createObjectURL(new Blob([JSON.stringify({ format: "wardhan-study-export", version: 1, progress: data, saved }, null, 2)], { type: "application/json" }));
      const a = document.createElement("a"); a.href = url; a.download = `wardhan-study-${localDate()}.json`; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    }}>Export progress and saved resources</button>
    <button className="button button-secondary" disabled={!ready} onClick={async () => {
      const file = exportFile();
      if (!navigator.canShare?.({ files: [file] })) { setMessage("File sharing is unavailable in this browser. Use Export progress and saved resources, then transfer the file to your other device."); return; }
      try { await navigator.share({ files: [file], title: "My study progress" }); setMessage("Transfer file shared. Open My Study on the receiving device and import that file; progress is not automatically synchronised."); } catch (error) { if (!(error instanceof Error && error.name === "AbortError")) setMessage("The file could not be shared. Use Export progress and saved resources instead."); }
    }}>Share a transfer file</button>
    <p className="muted-note">The share sheet lets you choose a destination. This file contains your written notes and answers; share it only with your own device or storage.</p>
    <label className="study-form">Import a progress file<input type="file" accept=".json,application/json" disabled={!ready} onChange={async e => {
      const token = ++request.current;
      const file = e.target.files?.[0]; e.target.value = ""; setPending(null); setMessage("");
      if (!file) return;
      try {
        if (file.size > 1000000) throw new Error("Choose a progress file smaller than 1 MB.");
        const imported = readTransfer(await file.text(), learningLessonIds, learningQuestionIds, learningDraftIds, catalog.records.map(r => r.id));
        if (token === request.current) setPending(imported);
      } catch (error) { if (token === request.current) setMessage(error instanceof Error ? error.message : "Could not read this file."); }
    }} /></label>
    {pending && <div className="study-notice"><h3>Review before importing</h3><p>{Object.keys(pending.progress.answers).length} question histories · {pending.progress.lessons.length} completed lessons · {Object.keys(pending.progress.drafts).length} written notes · {pending.saved.length} saved resources recognised.</p><p>We combine completed items and bookmarks. For each question, the newer history wins; equal dates keep this browser’s history. Existing notes and exam plans stay. Activity totals use the larger count, so importing twice does not double them. Unknown or invalid entries are skipped.</p><div className="action-row"><button className="button button-primary" onClick={() => { updateLearning(current => mergeProgress(current, pending.progress)); add(pending.saved); setPending(null); setMessage("Import applied. Your study progress has been updated."); }}>Merge imported progress</button><button className="button button-secondary" onClick={() => { ++request.current; setPending(null); }}>Cancel import</button></div></div>}
    {message && <p role="status">{message}</p>}
    {(!persistent || storageMessage) && <p role="alert">Browser storage could not save all changes. Export a copy before leaving this page.</p>}
    <p className="muted-note">Older progress-only exports are accepted; they do not include saved resources. This is a manual transfer, not automatic synchronisation.</p>
  </section>;
}
