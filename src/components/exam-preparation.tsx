import Link from "next/link";
import { publicCatalog } from "@/lib/catalog";
import { resourceHref } from "@/lib/catalog-types";
import { practiceItems } from "@/content/practice-registry";
import lessons from "@/content/library-lessons.json";
import taxonomy from "@/content/library-taxonomy.json";
import { matchesSearchText } from "@/lib/catalog-filter";
import { conceptLessonIds } from "@/lib/concept-discovery";

export const examTypes = [
  ["knowledge", "Knowledge checks"], ["application", "Mechanism and application questions"],
  ["calculation", "Worked calculations"], ["identification", "Histology and anatomy identification"],
  ["oral", "Structured oral examination prompts"], ["review", "Review incorrect answers"],
] as const;
export function ExamPreparation({ subject, query, type }: { subject: string; query: string; type: string }) {
  const selected = examTypes.some(([id]) => id === type) ? type : "knowledge";
  const released = new Set(publicCatalog.filter(r => r.status === "public").map(r => r.id));
  const publicPaths = new Set(publicCatalog.filter(r => r.status === "public").map(r => resourceHref(r).split(/[?#]/)[0]));
  const available = (id: string, href: string) => released.has(id) || publicPaths.has(href.split(/[?#]/)[0]);
  const belongs = (id: string, area: string) => !subject || (subject === "genetics-all" ? area === "genetics" : taxonomy.nodes.some(node => node.subject === subject && node.resources.includes(id)));
  const ids = conceptLessonIds(query);
  const matches = (id: string, text: string) => !query || ids.includes(id) || matchesSearchText(text, query);
  const rows = selected === "oral" || selected === "calculation"
    ? lessons.lessons.filter(l => released.has(l.id) && belongs(l.id, l.subject) && matches(l.id, `${l.title} ${l.summary}`) && (selected === "oral" || ("workedExample" in l && /\d/.test(JSON.stringify(l.workedExample)) && /(?:calculate|mM|μM|mmol|mV|mol|velocity|rate|time|pressure|concentration|volume|diffusion)/i.test(JSON.stringify(l.workedExample)))))
      .map(l => ({ id: l.id, title: l.title, href: `/library/${l.id}#${selected === "oral" ? "oral-recall-title" : "worked-example-heading"}`, description: selected === "oral" ? l.recall.prompt : "workedExample" in l && l.workedExample ? l.workedExample.prompt : "", label: selected === "oral" ? "Written recall or oral self-assessment · model explanation" : "Guided calculation · show the reasoning" }))
    : practiceItems.filter(q => available(q.topic, q.href) && belongs(q.topic, q.subject) && matches(q.topic, `${q.title} ${q.prompt}`) && (selected === "knowledge" ? q.id.startsWith("concept-") : selected === "identification" ? ["histology", "anatomy"].includes(q.subject) && /identify|landmark|label|specimen|distinguish|recognis|recogniz|which.*(?:structure|tissue|nerve|vessel|bone)/i.test(q.prompt) : !q.id.startsWith("concept-") && (q.checkpoint?.metadata.difficulty === "applied" || Boolean(q.options))))
      .map(q => ({ id: q.id, title: q.title, href: q.href, description: q.prompt, label: q.options || (q.checkpoint && !["self-review", "short"].includes(q.checkpoint.type)) ? "Explained checkpoint · submitted answers use your existing progress" : "Identification or reasoning activity · follow its stated assessment method" }));
  const shown = [...new Map(rows.map(row => [row.href, row])).values()];
  return <section className="study-panel" aria-labelledby="exam-preparation-title">
    <h2 id="exam-preparation-title">Choose how to practise</h2>
    <p>Choose an assessment format, then a topic. Scored checkpoints and written self-assessment are labelled separately. These activities do not establish examination readiness or complete syllabus coverage.</p>
    <form action="/library" method="get" className="catalog-controls">
      <input type="hidden" name="mode" value="exam" />
      <label>Subject<select name="subject" defaultValue={subject}><option value="">All subjects</option>{taxonomy.subjects.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}{subject === "genetics-all" && <option value="genetics-all">Genetics and Immunology</option>}</select></label>
      <label>Assessment format<select name="type" defaultValue={selected}>{examTypes.map(([id, title]) => <option key={id} value={id}>{title}</option>)}</select></label>
      <label>Topic<input name="q" type="search" maxLength={200} defaultValue={query} /></label>
      <button className="button button-primary">Find practice</button>
    </form>
    {selected === "review" ? <><h3>Review your own answers</h3><p>My Study builds a review queue from answers stored in this browser. With no saved attempts, begin a knowledge check first. Written explanations marked for review remain self-assessments.</p><Link className="button button-secondary" href="/study#practice-review">Open my review queue</Link></> : <>
      <p role="status">{shown.length} available practice destinations{query ? ` for “${query}”` : ""}.</p>
      {!shown.length && <p>No matching activity in this format and subject is currently available. Try another format or <Link href={`/library?mode=concept&subject=${encodeURIComponent(subject)}&q=${encodeURIComponent(query)}`}>find a related explanation</Link>. Missing practice is not a completed assessment.</p>}
      <ul className="topic-sequence-steps">{shown.map(row => <li key={row.id} className="study-panel"><h3><Link href={row.href}>{row.title}</Link></h3><p>{row.label}</p><p>{row.description}</p><Link href={row.href}>Open this practice →</Link></li>)}</ul>
    </>}
  </section>;
}
