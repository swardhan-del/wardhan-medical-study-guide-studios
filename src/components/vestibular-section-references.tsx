import sections from "@/content/vestibular-section-references.json";

export function VestibularSectionReferences({ index }: { index: number }) {
  const section = sections[index];
  if (!section) return null;
  return <details><summary>References for this explanation</summary><ul>
    {section.references.map(ref => <li key={ref.url}><a href={ref.url}>{ref.title}</a></li>)}
  </ul></details>;
}
