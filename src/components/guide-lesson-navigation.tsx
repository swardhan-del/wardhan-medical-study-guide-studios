import Link from "next/link";
import type { orderedLessonNavigation } from "@/lib/ordered-lesson-navigation";

type Navigation = NonNullable<ReturnType<typeof orderedLessonNavigation>>;

export function GuideLessonNavigation({ navigation }: { navigation: Navigation }) {
  const { label, current, previous, next } = navigation;
  return <nav id="continue-learning" aria-label={label} className="concept-end">
    <h3>Continue in order</h3>
    <div className="action-row">
      {next && <Link className="button button-primary" href={next.href}>Next {next.kind}: {next.title}</Link>}
      <Link href={current.href}>{current.title}</Link>
      {previous && <Link href={previous.href}>Previous {previous.kind}: {previous.title}</Link>}
    </div>
    {!next && <p>This is the final lesson in this sequence.</p>}
  </nav>;
}
