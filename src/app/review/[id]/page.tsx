import { notFound } from "next/navigation";
import { getLocalReview } from "@/lib/local-review";
import { ResourceDetail } from "@/components/resource-detail";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Local resource review",
  robots: { index: false, follow: false },
};
export default async function ReviewDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const records = await getLocalReview();
  const { id } = await params;
  const record = records.find((item) => item.id === id);
  if (!record) notFound();
  return <ResourceDetail record={record} review />;
}
