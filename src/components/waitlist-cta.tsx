export function WaitlistCta() {
  return <aside className="study-panel waitlist-cta" aria-label="Pre-launch waitlist">
    <p className="eyebrow">Study Guide Studios · Pre-launch</p>
    <h2>Follow the next stage of the study library</h2>
    <p>The full product is still in development. The planned waitlist offers launch news and updates when new free study resources are released. There is no confirmed launch date or guaranteed early access.</p>
    <p>Keep using the free lessons without joining. The waitlist page shows whether signup is open or in demo mode.</p>
    {/* Full navigation applies the waitlist-only spam widget CSP. */}
    <a className="button button-secondary" href="/waitlist">Explore the waitlist</a>
  </aside>;
}
