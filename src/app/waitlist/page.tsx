import { searchMetadata } from "@/lib/search-metadata";
import Link from "next/link";
import { WaitlistForm } from "@/components/waitlist-form";
export const metadata = searchMetadata("/waitlist");
export default function WaitlistPage() {
  return <div className="site-container study-page waitlist-page">
    <header className="study-hero"><p className="eyebrow">Pre-launch · Independent educational support</p><h1>Stay informed as Study Guide Studios develops</h1><p className="interior-lede">The free library is available now. The wider Study Guide Studios product is still being developed.</p></header>
    <section className="study-panel"><h2>What the waitlist is for</h2><ul><li>Email news when the product is ready to launch.</li><li>Updates when new free lessons or study resources are released.</li></ul><p>No fixed email schedule, launch date, place in a queue, qualification or early-access invitation is promised. Joining is free and creates no purchase commitment. You can unsubscribe at any time.</p><p><Link href="/library">Use the free library now</Link> or <Link href="/starter-pack">explore the free starter resources</Link>.</p></section>
    <WaitlistForm />
  </div>;
}
