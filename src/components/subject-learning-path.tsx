import Link from "next/link";
import { BeginnerSequence } from "./beginner-sequence";
import { SubjectTopicMap } from "./subject-hub";
import { curriculumOrders, immunologyPath } from "@/content/curriculum-order";

export function SubjectLearningPath({ subject }: { subject: string }) {
  const order = curriculumOrders[subject];
  if (order) return order.orientation ? <BeginnerSequence subject={subject} /> : <SubjectTopicMap subject={subject} />;
  if (subject !== "immunology") return null;
  return <section className="study-panel subject-learning-path" aria-labelledby="subject-path-title">
    <p className="eyebrow">Suggested learning sequence</p><h2 id="subject-path-title">Start with these topics</h2>
    <p>Follow the suggested sequence or choose the topic you need to review.</p>
    <ol className="study-grid three">{immunologyPath.map(step => <li key={step.href}><h3><Link className="text-link" href={step.href}>{step.title} →</Link></h3><p>{step.description}</p></li>)}</ol>
    <Link className="text-link" href="/study">Open My Study →</Link>
  </section>;
}
