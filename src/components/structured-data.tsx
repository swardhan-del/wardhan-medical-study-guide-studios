import type { Graph, Thing } from "schema-dts";
import { serializeStructuredData } from "@/lib/structured-data";

export function StructuredData({ data }: { data: Graph | Exclude<Thing, string> }) {
  const value = "@context" in data ? data : { "@context": "https://schema.org", ...data };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeStructuredData(value) }} />;
}
