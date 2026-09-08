export default function Loading() {
  return (
    <div
      className="loading-state site-container"
      aria-busy="true"
      aria-live="polite"
    >
      <span className="loading-line loading-line-short" />
      <span className="loading-line loading-line-long" />
      <p>Loading study resources…</p>
    </div>
  );
}
