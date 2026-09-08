"use client";
import { saveDraft, useLearning } from "./learning-store";
export function SavedRecall({ id, label = "My explanation", placeholder = "Write your reasoning before revealing the answer." }: { id: string; label?: string; placeholder?: string }) {
  const { ready, data, persistent } = useLearning();
  return <div className="saved-recall"><label htmlFor={id}>{label}</label><textarea id={id} rows={4} maxLength={5000} value={data.drafts[id] ?? ""} placeholder={placeholder} disabled={!ready} onChange={(e) => saveDraft(id, e.target.value)} /><p className="muted-note">{persistent ? "Saved in this browser only; your writing is not sent to the studio." : "Browser storage is unavailable. Copy your writing before leaving."}</p></div>;
}
export function SavedSelfCheck({ id, label }: { id: string; label: string }) {
  const { ready, data } = useLearning();
  return <label><input type="checkbox" disabled={!ready} checked={data.drafts[id] === "yes"} onChange={(e) => saveDraft(id, e.target.checked ? "yes" : "")} /> {label}</label>;
}
