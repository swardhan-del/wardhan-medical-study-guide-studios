import { notFound, permanentRedirect } from "next/navigation";
import type { Metadata } from "next";
import { getPublicRecord } from "@/lib/catalog";
import { ResourceDetail } from "@/components/resource-detail";
import { publicCatalog } from "@/lib/catalog";
import lessonData from "@/content/library-lessons.json";
import type { LibraryLesson as Lesson } from "@/lib/library-types";
import { LibraryLesson } from "@/components/library-lesson";
export function generateStaticParams() {
  return publicCatalog.map((r) => ({ id: r.id }));
}
type Props = { params: Promise<{ id: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const record = getPublicRecord(id);
  if (!record) return { title: "Resource not found" };
  return {
    title: record.title,
    description: record.summary,
    alternates: { canonical: record.href ?? `/library/${id}` },
  };
}
export default async function ResourcePage({ params }: Props) {
  const { id } = await params;
  const record = getPublicRecord(id);
  if (!record) notFound();
  if (record.href) permanentRedirect(record.href);
  const lesson = (lessonData.lessons as Lesson[]).find((l) => l.id === id);
  if (lesson) return <LibraryLesson lesson={lesson} />;
  return <ResourceDetail record={record} />;
}
