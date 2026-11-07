import model from "@/content/pdh-mechanism-model.json";

export function PdhSectionReferences({ index }: { index: number }) {
  const entry = model.sectionReferences[index - 3];
  if (!entry) return null;
  return <details><summary>References for {entry.title.toLocaleLowerCase("en")}</summary>
    <ul>{entry.references.map(ref => <li key={ref.url}><a href={ref.url}>{ref.title}</a></li>)}</ul>
  </details>;
}
