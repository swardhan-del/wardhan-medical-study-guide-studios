import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPublicRecord } from "@/lib/catalog";
import { ResourceDetail } from "@/components/resource-detail";
type Props = { params: Promise<{ id: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const record = getPublicRecord(id);
  if (!record) return { title: "Resource not found" };
  return {
    title: record.title,
    description: record.summary,
    alternates: { canonical: `/library/${id}` },
  };
}
export default async function ResourcePage({ params }: Props) {
  const { id } = await params;
  const record = getPublicRecord(id);
  if (!record) notFound();
  return <ResourceDetail record={record} />;
}
