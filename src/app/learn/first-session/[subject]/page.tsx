import Link from "next/link";
import { notFound } from "next/navigation";
import { AnatomicalPlanes } from "@/components/anatomy-foundations-visuals";
import { EducationalFigure } from "@/components/educational-figure";
import { SearchBreadcrumbs } from "@/components/search-breadcrumbs";
import { PracticeQuestion } from "@/components/practice-question";
import { VisualFlow } from "@/components/study-visual";
import { firstSessionFor, firstSessionHref, firstSessionsPath, firstStudySessions } from "@/content/first-study-sessions";
import { practiceItems } from "@/content/practice-registry";
import { figuresForResource } from "@/lib/figures";
import { searchMetadata } from "@/lib/search-metadata";

export const dynamicParams = false;

type Props = { params: Promise<{ subject: string }> };

export function generateStaticParams() {
  return firstStudySessions.map(({ id }) => ({ subject: id }));
}

export async function generateMetadata({ params }: Props) {
  return searchMetadata(firstSessionHref((await params).subject));
}

export default async function FirstSessionPage({ params }: Props) {
  const session = firstSessionFor((await params).subject);
  if (!session) notFound();

  const question = practiceItems.find(item => item.id === session.question);
  if (!question) throw new Error(`Missing first-session question: ${session.question}`);
  const lesson = `/library/${session.lesson}`;
  const figure = figuresForResource(session.lesson).find(item => item.id === session.figure);
  if (session.figure && !figure) throw new Error(`Missing first-session figure: ${session.figure}`);

  return (
    <div className="site-container study-page first-session-page">
      <SearchBreadcrumbs items={[
        { name: "Start here", href: "/start" },
        { name: "First study sessions", href: firstSessionsPath },
        { name: session.title, href: firstSessionHref(session.id) },
      ]} />
      <header className="study-hero">
        <p className="eyebrow">{session.subject} · About 5 minutes</p>
        <h1>{session.title}</h1>
        <p className="interior-lede">{session.objective}</p>
      </header>
      <section className="study-panel" aria-labelledby="example-heading">
        <h2 id="example-heading">{session.model.title}</h2>
        <VisualFlow steps={session.model.steps} label={session.model.title} />
        {session.id === "anatomy" && <AnatomicalPlanes />}
        {figure && <EducationalFigure figure={figure} />}
        <p><strong>Try it.</strong> {session.task}</p>
        <details className="study-details">
          <summary>Show the worked explanation</summary>
          <p>{session.worked}</p>
        </details>
      </section>
      <section aria-labelledby="first-check-heading">
        <h2 id="first-check-heading">Check your understanding</h2>
        <PracticeQuestion item={question} title="First-session checkpoint" />
      </section>
      <section className="study-panel" aria-labelledby="continue-heading">
        <h2 id="continue-heading">Come back to practise</h2>
        <p>Check an answer above. My Study gives you one related question after 24 hours and a different question a week after this session. Open My Study again in this browser to see what’s due.</p>
        <div className="action-row">
          <Link className="button button-primary" href="/study#subject-review">Open my follow-up questions</Link>
          <Link href={lesson}>Read the full lesson</Link>
          <Link href={session.extension.href}>{session.extension.label}</Link>
        </div>
        <p><Link className="text-link" href={`${lesson}#lesson-source`}>Sources for this example and the full lesson</Link></p>
      </section>
    </div>
  );
}
