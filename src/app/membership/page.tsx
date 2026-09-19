import Link from "next/link";
export const metadata = {
  title: "Membership", description: "Complete medical learning modules through membership. Explore the planned Basic and Advanced memberships and what subscribers will receive.",
  alternates: { canonical: "/membership" },
};
export default function MembershipPage() {
  return <div className="site-container page-interior membership-stack">
    <header><p className="eyebrow">Membership · coming soon</p><h1>A complete learning sequence, one membership</h1>
      <p className="interior-lede">Build your understanding through connected medical learning modules, with lessons, practice and study resources organised in the order you need them.</p>
      <p>Membership enrolment is not open yet. Prices and the final module list will be published before you can subscribe.</p></header>
    <section><h2>Choose the depth that fits your studies</h2><div className="membership-grid">
      <article className="membership-panel"><h3>Basic</h3><p>Complete foundation modules, including the introductory teaching within those modules. Follow the full learning sequence without buying lessons separately.</p><p>Price and included modules: to be confirmed.</p></article>
      <article className="membership-panel"><h3>Advanced</h3><p>Complete deeper modules and additional learning tools for more detailed study and application.</p><p>Price, included modules and whether Basic modules are also included: to be confirmed.</p></article>
      <article className="membership-panel"><h3>Complete · future possibility</h3><p>A possible future membership for the full reviewed library. Availability, coverage and price are not yet decided.</p></article>
    </div></section>
    <section className="membership-panel"><h2>What membership is being built to include</h2>
      <ul><li>Full lessons and introductory teaching within your included modules.</li><li>Questions, answer explanations and revision resources alongside the relevant lessons.</li><li>Module downloads, videos and protected media as they are reviewed and released.</li><li>Interactive learning tools where included in your membership.</li></ul>
      <p>Membership is the product. There are no individual lesson, video or question purchases.</p></section>
    <section className="membership-panel"><h2>Explore before joining</h2>
      <p>The planned public experience includes the subject catalogue, curriculum map, concise subject overviews, membership benefits and pricing explanation. Teaching content, including introductory material, belongs inside membership.</p>
      <p>The existing library remains available during preparation. Its move to the membership model requires a separate release.</p>
      <p><Link href="/subjects">Explore the subject catalogue</Link> · <Link href="/study/map">View the curriculum map</Link></p></section>
    <section className="membership-panel"><h2>Before enrolment opens</h2><p>We will publish the price, billing interval, tax treatment, cancellation and refund terms, and exact included modules. No payment is being taken here.</p>
      <p><Link href="/account" prefetch={false}>Account availability</Link> · <Link href="/contact">Contact us</Link></p></section>
  </div>;
}
