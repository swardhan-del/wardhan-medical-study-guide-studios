import { notFound } from "next/navigation";
import { getMemberLesson } from "@/server/member-content";
import { LockedContent } from "@/components/membership/locked-content";
export const dynamic = "force-dynamic";
export const metadata = { title: "Member module", robots: { index: false, follow: false } };
export default async function MemberModule({ params }: { params: Promise<{ moduleId: string }> }) {
  const lesson = await getMemberLesson((await params).moduleId);
  if (!lesson.access.allowed) {
    if (lesson.access.reason === "not-found") notFound();
    return <><h1>Member module</h1><LockedContent access={lesson.access} /></>;
  }
  return <article className="membership-panel"><p className="eyebrow">Synthetic access check</p>
    <h1>{lesson.module!.title}</h1><p>{lesson.body}</p>
    <a href={`/api/member/assets/${lesson.module!.assetId}`}>Download synthetic check file</a>
  </article>;
}
