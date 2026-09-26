import { searchMetadata } from "@/lib/search-metadata";
import { notFound, redirect } from "next/navigation";
import { getPublicRecord, publicCatalog } from "@/lib/catalog";
import { ResourceDetail } from "@/components/resource-detail";
import lessonData from "@/content/library-lessons.json";
import type { LibraryLesson as Lesson } from "@/lib/library-types";
import { LibraryLesson } from "@/components/library-lesson";
export function generateStaticParams() {
  return publicCatalog.map((r) => ({ id: r.id }));
}
type Props = { params: Promise<{ id: string }> };
export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  return searchMetadata(`/library/${id}`);
}
export default async function ResourcePage({ params }: Props) {
  const { id } = await params;
  const r = getPublicRecord(id);
  if (!r) notFound();
  if (r.href && ["WEB", "ACTIVITY"].includes(r.format)) redirect(r.href);
  const lesson = (lessonData.lessons as Lesson[]).find((l) => l.id === id);
  return lesson ? (
    <LibraryLesson lesson={lesson} />
  ) : (
    <ResourceDetail record={r} />
  );
}
