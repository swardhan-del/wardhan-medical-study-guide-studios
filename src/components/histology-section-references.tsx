import data from "@/content/histology-depth-references.json";

export function HistologySectionReferences({ lessonId, index }: { lessonId: string; index: number }) {
  const entries = data as Record<string, { title: string; references: { title: string; url: string }[] }[]>;
  const entry = entries[lessonId]?.[index];
  if (!entry) return null;
  return <details><summary>References for {entry.title.toLocaleLowerCase("en")}</summary>
    <ul>{entry.references.map(ref => <li key={ref.url}><a href={ref.url}>{ref.title}</a></li>)}</ul>
  </details>;
}
