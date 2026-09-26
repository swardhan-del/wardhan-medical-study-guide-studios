import Link from "next/link";

export default function NotFound() {
  return (
    <div className="error-state site-container" role="status">
      <p className="eyebrow">404 / Not found</p>
      <h1>That page is not in this edition.</h1>
      <p>Search the library for the topic, or return to your last lesson in My Study.</p>
      <div className="action-row"><Link className="button button-secondary" href="/library">Search the library</Link><Link href="/study">Return to My Study</Link></div>
      <Link className="button button-primary" href="/">
        Back to home <span aria-hidden="true">↗</span>
      </Link>
    </div>
  );
}
