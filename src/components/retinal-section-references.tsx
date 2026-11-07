import sections from "@/content/retinal-section-references.json";
export function RetinalSectionReferences({ index }: { index: number }) {
  const section = sections[index];
  return section ? <details><summary>References for this explanation</summary><ul>{section.references.map(ref => <li key={ref.url}><a href={ref.url}>{ref.title}</a></li>)}</ul></details> : null;
}
