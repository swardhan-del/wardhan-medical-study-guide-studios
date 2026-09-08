import Link from "next/link";

export default function NotFound() {
  return (
    <div className="error-state site-container" role="status">
      <p className="eyebrow">404 / Not found</p>
      <h1>That page is not in this edition.</h1>
      <p>Return to the studio home or browse the subject map.</p>
      <Link className="button button-primary" href="/">
        Back to home <span aria-hidden="true">↗</span>
      </Link>
    </div>
  );
}
