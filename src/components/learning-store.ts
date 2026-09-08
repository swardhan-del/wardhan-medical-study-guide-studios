"use client";
import { learningEvent } from "@/lib/learning-analytics";
import { useSyncExternalStore } from "react";
import { learningLessonIds, learningQuestionIds, learningDraftIds } from "@/content/practice-registry";
import {
  emptyProgress,
  gradeAttempt,
  localDate,
  parseProgress,
  type LearningProgress,
} from "@/lib/learning-core";
export const learningKey = "wardhan-learning:v1";
const lessonIds = learningLessonIds;
const questionIds = learningQuestionIds;
type Snapshot = { ready: boolean; persistent: boolean; data: LearningProgress };
const server: Snapshot = {
  ready: false,
  persistent: true,
  data: emptyProgress(),
};
let snapshot = server;
let rawCache: string | null | undefined;
const listeners = new Set<() => void>();
function getSnapshot(): Snapshot {
  try {
    const raw = window.localStorage.getItem(learningKey);
    if (!snapshot.ready || rawCache !== raw) {
      rawCache = raw;
      snapshot = {
        ready: true,
        persistent: true,
        data: parseProgress(raw, lessonIds, questionIds, learningDraftIds),
      };
    }
  } catch {
    if (!snapshot.ready || snapshot.persistent)
      snapshot = { ...snapshot, ready: true, persistent: false };
  }
  return snapshot;
}
function notify() {
  for (const listener of listeners) listener();
}
function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === learningKey || event.key === null) notify();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}
export function useLearning() {
  return useSyncExternalStore(subscribe, getSnapshot, () => server);
}
export function updateLearning(
  change: (state: LearningProgress) => LearningProgress,
) {
  const data = change(getSnapshot().data);
  const serialized = JSON.stringify(data);
  let persistent = true;
  try {
    window.localStorage.setItem(learningKey, serialized);
    rawCache = serialized;
  } catch {
    persistent = false;
  }
  snapshot = { ready: true, persistent, data };
  notify();
}
export function recordAnswer(id: string, correct: boolean, choice: number | null = null, usedHint = false) {
  if (!questionIds.includes(id)) return;
  updateLearning((state) => ({
    ...state,
    answers: {
      ...state.answers,
      [id]: gradeAttempt(state.answers[id], correct, Date.now(), choice, usedHint),
    },
  }));
}
export function recordVisit() {
  const today = localDate();
  if (getSnapshot().data.visits.includes(today)) return;
  learningEvent("learning_day", {
    returning: getSnapshot().data.visits.length > 0,
  });
  updateLearning((s) => ({ ...s, visits: [...s.visits, today].slice(-366) }));
}

export function saveDraft(id: string, value: string) {
  if (!learningDraftIds.includes(id)) return;
  updateLearning((s) => ({ ...s, drafts: { ...s.drafts, [id]: value.slice(0, 5000) } }));
}
