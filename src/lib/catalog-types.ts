export type CatalogRecord = {
  id: string;
  title: string;
  subject: string;
  kind: string;
  format: "PDF" | "DOCX" | "PPTX";
  summary: string;
  updatedAt: string;
  bytes: number;
  status: "public" | "private-review";
  downloadUrl?: string;
};
export function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
