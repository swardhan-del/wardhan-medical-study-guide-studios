import Link from "next/link";
import { beginnerSequences, studyPaths } from "@/content/study-paths";
export function BeginnerSequence({ subject }: { subject: string }) {
  return <section className="study-panel" aria-label="Suggested first lessons"><h2>Your first three steps</h2><p>{studyPaths[subject].preparation}</p><ol className="start-sequence">{beginnerSequences[subject].map(step => <li key={step.href}><Link href={step.href}>{step.title}</Link></li>)}</ol><p>Choose one step per session. Use its recall prompts before moving on.</p></section>;
}
