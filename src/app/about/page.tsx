export const metadata = {
  title: "About",
  description: "About Wardhan Medical Study Guide Studios and its public-release approach.",
};

export default function AboutPage() {
  return (
    <div className="page-stack page-interior">
      <section className="interior-hero site-container" aria-labelledby="about-heading">
        <p className="eyebrow">About the studio</p>
        <h1 id="about-heading">A small studio for careful medical-science learning.</h1>
        <p className="interior-lede">Wardhan Medical Study Guide Studios develops independently authored medical-science learning resources for students. The public library will grow slowly, with clarity about what is available and what is still in preparation.</p>
      </section>
      <section className="prose-section site-container" aria-labelledby="approach-heading">
        <div className="prose-column">
          <p className="eyebrow">The approach</p>
          <h2 id="approach-heading">Make the structure visible.</h2>
          <p>The studio’s work starts with a simple question: what would make a difficult idea easier to return to? The answer may become a future resource, but it does not become public by default.</p>
          <p>That is why this site separates subject interests from released collections. A subject can be named while its public materials remain in preparation.</p>
        </div>
        <aside className="quote-panel" aria-label="Studio note">
          <span className="quote-mark" aria-hidden="true">“</span>
          <p>Good learning resources earn their way into the library.</p>
          <span className="quote-attribution">Studio note</span>
        </aside>
      </section>
    </div>
  );
}
