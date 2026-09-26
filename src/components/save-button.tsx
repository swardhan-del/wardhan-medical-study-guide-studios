"use client";
import { useReadingList } from "./reading-list-provider";
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
