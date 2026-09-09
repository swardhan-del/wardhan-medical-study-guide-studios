"use client";
import {
  createContext,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
const storageKey = "wardhan-reading-list:v1";
const changedEvent = "wardhan-reading-list-changed";
let memory = "[]";
let memoryOnly = false;
function parseList(raw: string): string[] {
  try {
    const value: unknown = JSON.parse(raw);
    return Array.isArray(value)
      ? [
          ...new Set(
            value.filter(
              (id): id is string =>
                typeof id === "string" && /^[a-z0-9-]{1,80}$/.test(id),
            ),
          ),
        ].slice(0, 500)
      : [];
  } catch {
    return [];
  }
}
function getSnapshot() {
  if (memoryOnly) return memory;
  try {
    return localStorage.getItem(storageKey) ?? "[]";
  } catch {
    return memory;
  }
}
const getServerSnapshot = () => "[]";
function subscribe(listener: () => void) {
  function sync(event: StorageEvent) {
    if (event.key === storageKey || event.key === null) listener();
  }
  window.addEventListener("storage", sync);
  window.addEventListener(changedEvent, listener);
  return () => {
    window.removeEventListener("storage", sync);
    window.removeEventListener(changedEvent, listener);
  };
}
const subscribeReady = () => () => {};
const getReady = () => true;
const getServerReady = () => false;
const Context = createContext<{
  saved: string[];
  ready: boolean;
  message: string;
  toggle: (id: string) => void;
  clear: () => void;
  add: (ids: string[]) => void;
}>({ saved: [], ready: false, message: "", toggle: () => {}, clear: () => {}, add: () => {} });
export function ReadingListProvider({ children }: { children: ReactNode }) {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const saved = useMemo(() => parseList(raw), [raw]);
  const ready = useSyncExternalStore(subscribeReady, getReady, getServerReady);
  const [message, setMessage] = useState("");
  function persist(next: string[]) {
    memory = JSON.stringify(next);
    try {
      localStorage.setItem(storageKey, memory);
    } catch {
      memoryOnly = true;
      setMessage(
        "Your changes could not be stored. They will last for this visit only.",
      );
    }
    window.dispatchEvent(new Event(changedEvent));
  }
  function toggle(id: string) {
    const current = parseList(getSnapshot());
    persist(
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id].slice(-500),
    );
  }
  return (
    <Context.Provider
      value={{ saved, ready, message, toggle, clear: () => persist([]), add: ids => persist([...new Set([...parseList(getSnapshot()), ...ids])].slice(0, 500)) }}
    >
      {children}
    </Context.Provider>
  );
}
export function useReadingList() {
  return useContext(Context);
}
export function ReadingListNotice() {
  const { message, saved, clear } = useReadingList();
  const [confirm, setConfirm] = useState(false);
  return (
    <div className="reading-notice">
      <p>
        Your saved resources and progress are stored in this browser. Use the progress transfer above to move them between devices; automatic sync is not available.
      </p>
      {message ? <p role="status">{message}</p> : null}
      {saved.length ? (
        confirm ? (
          <div className="action-row">
            <span>Remove all saved resources?</span>
            <button
              className="plain-button"
              onClick={() => {
                clear();
                setConfirm(false);
              }}
            >
              Yes, clear list
            </button>
            <button className="plain-button" onClick={() => setConfirm(false)}>
              Keep list
            </button>
          </div>
        ) : (
          <button className="plain-button" onClick={() => setConfirm(true)}>
            Clear saved resources
          </button>
        )
      ) : null}
    </div>
  );
}
