import entries from "@/content/audiometry-section-references.json";

export function AudiometrySectionReferences({ index }: { index: number }) {
  const entry = entries[index];
  if (!entry) return null;
  return <details><summary>References for {entry.title.toLocaleLowerCase("en")}</summary>
    <ul>{entry.references.map(ref => <li key={ref.url}><a href={ref.url}>{ref.title}</a></li>)}</ul>
  </details>;
}
