import Link from "next/link";
import { WaitlistCta } from "@/components/waitlist-cta";
import { studySubjects } from "@/lib/study-collections";
import { beginnerSequences } from "@/content/study-paths";
export const metadata = { title: "Free Study Guide starter pack", description: "Start with existing free lessons and printable subject revision notes. No signup required.", alternates: { canonical: "/starter-pack" } };
export default function StarterPackPage() {
  return <div className="site-container study-page"><header className="study-hero"><p className="eyebrow">Free starter resources · No signup required</p><h1>Your Study Guide starter pack</h1><p className="interior-lede">Choose a first lesson and open the existing printable revision notes for your subject. These resources are available now; the wider product is pre-launch.</p></header>
    <section className="study-panel"><h2>Begin a short study session</h2><ol><li>Read one lesson and explain the main idea in your own words.</li><li>Answer its Knowledge Check before opening the explanation.</li><li>Use the recap to decide what to review next.</li></ol><p>Open a subject’s revision notes to print them or save them as a PDF using your browser’s print dialog. Source references remain with the original lessons and notes.</p></section>
    <section className="study-panel" aria-labelledby="starter-resources"><h2 id="starter-resources">Choose your starting point</h2><ul className="starter-resource-list">{studySubjects.map(subject => <li key={subject.id}><h3>{subject.title}</h3><p><Link href={beginnerSequences[subject.id][0].href}>{beginnerSequences[subject.id][0].title}</Link></p><Link href={`/study/${subject.id}/revision`}>Printable {subject.title} revision notes</Link></li>)}</ul></section>
    <p>Independent educational support, not medical advice or a substitute for official course material. <Link href="/terms">Read the educational disclaimer</Link>.</p>
    <WaitlistCta /><p><Link href="/library">Return to the library →</Link></p>
  </div>;
}
