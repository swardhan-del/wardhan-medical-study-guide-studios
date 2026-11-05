import Link from "next/link";
import { physiologyChapterHref, physiologyChapterNavigation } from "@/content/curriculum";

export function PhysiologyCourseNavigation({ lessonId }: { lessonId: string }) {
  const navigation = physiologyChapterNavigation(lessonId);
  if (!navigation) return null;

  const { chapter, previous, next } = navigation;
  return <nav className="action-row concept-end" aria-label="Full Course chapter navigation">
    {previous && <Link href={physiologyChapterHref(previous)}>Previous chapter: {previous.title}</Link>}
    <Link href={physiologyChapterHref(chapter)}>Back to this chapter in Full Course</Link>
    {next && <Link href={physiologyChapterHref(next)}>Next chapter: {next.title}</Link>}
  </nav>;
}
