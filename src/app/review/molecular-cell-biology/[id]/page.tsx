import Link from "next/link";
import { notFound } from "next/navigation";
import data from "@/content/mcb-review-visuals.json";
import lessons from "@/content/library-lessons.json";
import { requireLocalReview } from "@/lib/local-review";
import { LibraryLesson } from "@/components/library-lesson";
import { LocalMcbReview } from "@/components/local-mcb-review";
import type { LibraryLesson as Lesson } from "@/lib/library-types";
export const dynamic = "force-dynamic";
export const metadata = { title: "Lesson diagram review", robots: { index: false, follow: false } };
export default async function McbLessonReview({ params }: { params: Promise<{ id: string }> }) {
  requireLocalReview();
  const { id } = await params;
  if (!data.visuals.some(visual => visual.lessonIds.includes(id))) notFound();
  const lesson = (lessons.lessons as Lesson[]).find(item => item.id === id);
  if (!lesson) notFound();
  return <><div className="site-container"><p className="study-notice">Local draft review · <Link href="/review/molecular-cell-biology">All three diagrams</Link> · <Link href={`/library/${id}`}>Published lesson</Link>. Existing questions and saved progress are preserved. Diagram prompts do not store a new assessment result.</p></div>
    <LibraryLesson lesson={lesson} reviewVisuals={<LocalMcbReview lessonId={id} />} />
  </>;
}
