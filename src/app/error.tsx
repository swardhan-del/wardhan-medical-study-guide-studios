"use client";
import Link from "next/link";

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
      <p>Try again, or return to the library. Your saved learning progress remains in this browser.</p>
      <button
        className="button button-primary"
        type="button"
        onClick={() => reset()}
      >
        Try again <span aria-hidden="true">↗</span>
      </button>
      <div className="action-row"><Link href="/library">Search the library</Link><Link href="/study">Return to My Study</Link></div>
    </div>
  );
}
