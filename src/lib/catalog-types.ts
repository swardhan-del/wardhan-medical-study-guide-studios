export type CatalogRecord = {
  id: string;
  title: string;
  subject: string;
  kind: string;
  format: "PDF" | "DOCX" | "PPTX" | "WEB" | "ACTIVITY";
  summary: string;
  updatedAt: string;
  bytes: number;
  status: "public" | "private-review";
  downloadUrl?: string;
  href?: string;
  tags?: string[];
  minutes?: number;
};
export const formatLabels: Record<CatalogRecord["format"], string> = {
  WEB: "Web lesson",
  ACTIVITY: "Interactive practice",
  PDF: "PDF",
  DOCX: "DOCX",
  PPTX: "PPTX",
};
export function resourceHref(record: CatalogRecord, basePath = "/library") {
  return `${basePath}/${record.id}`;
}
export function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
