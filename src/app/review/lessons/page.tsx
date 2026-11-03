import { readFile } from "node:fs/promises";
import { join } from "node:path";
import Link from "next/link";
import { requireLocalReview } from "@/lib/local-review";

export const dynamic = "force-dynamic";
export const metadata = { title: "Local lesson review", robots: { index: false, follow: false } };
type Candidate = { id: string; title: string; subject: string; objectives: string[]; sections: { heading: string; body: string }[]; question: { prompt: string; options: { text: string; explanation: string }[]; answer: number }; references: { title: string; url: string }[] };
export default async function CandidateReviewPage() {
  requireLocalReview();
  let candidates: Candidate[] = [];
  try {
    const data = JSON.parse(await readFile(join(process.cwd(), ".private/candidate-lessons.json"), "utf8"));
    if (data.version !== 1 || !Array.isArray(data.candidates)) throw new Error("invalid");
    candidates = data.candidates;
  } catch {
    return <div className="site-container"><h1>Local lesson review</h1><p>No validated candidate file is available. Run the local import first.</p><Link href="/review">Back to local review</Link></div>;
  }
  return <div id="top" className="site-container"><h1>Local lesson review</h1><p className="study-notice">Private local review only. All candidates need scientific, rights, privacy, editorial and accessibility review before release.</p>
    <nav aria-label="Candidate lessons"><h2>Choose a candidate</h2><ul>{candidates.map(c => <li key={c.id}><a href={`#candidate-${c.id}`}>{c.title}</a> — {c.subject}</li>)}</ul></nav>
    {candidates.map(c => <article key={c.id} id={`candidate-${c.id}`}><h2>{c.title}</h2><p>{c.subject}</p><h3>Learning objectives</h3><ul>{c.objectives.map(o => <li key={o}>{o}</li>)}</ul>
      {c.sections.map((s, i) => <section key={i}><h3>{s.heading}</h3><p>{s.body}</p></section>)}
      <h3>Practice</h3><p>{c.question.prompt}</p><ol>{c.question.options.map((o, i) => <li key={i}>{o.text}<details><summary>Explanation</summary><p>{i === c.question.answer ? "Correct. " : "Not the best answer. "}{o.explanation}</p></details></li>)}</ol>
      <h3>References for review</h3><ul>{c.references.map(r => <li key={r.url}>{r.title} <span style={{ overflowWrap: "anywhere" }}>({r.url})</span></li>)}</ul><a href="#top">Back to top</a></article>)}
    <p><Link href="/review">Back to local review</Link></p></div>;
}
