"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="error-state site-container" role="alert">
      <p className="eyebrow">Something interrupted the page</p>
      <h1>We could not open this view.</h1>
      <p>Please try again. The public library remains read-only.</p>
      <button
        className="button button-primary"
        type="button"
        onClick={() => reset()}
      >
        Try again <span aria-hidden="true">↗</span>
      </button>
    </div>
  );
}
