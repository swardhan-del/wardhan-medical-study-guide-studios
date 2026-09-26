import { searchMetadata } from "@/lib/search-metadata";
import { WaitlistCta } from "@/components/waitlist-cta";
import Link from "next/link";
import { PrintStudy } from "@/components/print-study";
import { starterPackBody, starterPackCss } from "@/lib/starter-pack";
import { getSiteUrl } from "@/lib/site-url";
export const metadata = searchMetadata("/starter-pack");
export default function StarterPackPage() {
  return <article className="site-container revision-page starter-pack">
    <style>{starterPackCss}</style>
    <nav aria-label="Starter pack actions" className="action-row print-control"><Link href="/start">Choose a subject</Link><a className="button button-secondary" href="/starter-pack/download" download="wardhan-study-guide-starter-pack.html">Download starter pack (HTML)</a><PrintStudy label="Print / Save starter pack as PDF" /><Link href="/library">Return to library</Link></nav>
    <div dangerouslySetInnerHTML={{ __html: starterPackBody(getSiteUrl()) }} />
    <aside className="print-control"><p>Independent educational support, not medical advice or a substitute for official course material. <Link href="/terms">Read the educational disclaimer</Link>.</p><WaitlistCta /></aside>
  </article>;
}
