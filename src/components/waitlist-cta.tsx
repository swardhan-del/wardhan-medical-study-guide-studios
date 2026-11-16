export function WaitlistCta() {
  return <aside className="study-panel waitlist-cta" aria-label="Pre-launch waitlist">
    <h2>Get updates on new study resources</h2>
    <p>The waitlist page shows whether email signup is open. The study library is free to use.</p>
    {/* Full navigation applies the waitlist-only spam widget CSP. */}
    <a className="button button-secondary" href="/waitlist">Explore the waitlist</a>
  </aside>;
}
