import Link from "next/link";
const diagrams: Record<string, { title: string; description: string; source: string }> = {
  "dna-replication": { title: "Read the two synthesis directions", description: "An unwrapped replication-fork schematic: both new strands extend 5′ to 3′. Leading synthesis proceeds toward the advancing fork; lagging fragments extend away from it. Primers and enzymes are omitted.", source: "https://openstax.org/books/biology-2e/pages/14-3-basics-of-dna-replication" },
  "biophysics-image-formation": { title: "Construct the same image as the equation", description: "For a thin converging lens with focal length 10 cm and an object 30 cm away, the rays meet 15 cm beyond the lens. The real image is inverted and half the object height.", source: "https://openstax.org/books/university-physics-volume-3/pages/2-4-thin-lenses" },
  "myelin-and-glial-cells": { title: "Count cells and internodes separately", description: "One oligodendrocyte can myelinate internodes on several CNS axons. A myelinating Schwann cell forms one internode on one peripheral axon. Nodes separate neighbouring myelin segments. Organisation schematic only.", source: "https://openstax.org/books/anatomy-and-physiology-2e/pages/12-2-nervous-tissue" },
  "brain-and-csf-barriers": { title: "Find the sealing cell layer", description: "The blood–brain barrier's principal seal is between capillary endothelial cells. In the choroid plexus, the principal blood–CSF seal lies between specialised epithelial cells beyond fenestrated capillaries. Supporting cells and transport pathways are omitted.", source: "https://www.ncbi.nlm.nih.gov/books/NBK28180/" },
  "pdh-tca": { title: "Keep the carbon route and carriers separate", description: "This overview separates pyruvate oxidation from the citric-acid cycle. The cycle regenerates oxaloacetate; it also transfers electrons to carriers. Individual enzymes and the origin of each released carbon atom are omitted.", source: "https://openstax.org/books/biology-2e/pages/7-3-oxidation-of-pyruvate-and-the-citric-acid-cycle" },
  "protein-trafficking": { title: "Follow one secretory-protein route", description: "A typical secreted protein enters the rough ER, travels through Golgi compartments, and reaches the cell surface in a transport vesicle. This is one route; targeting signals also direct proteins to other destinations.", source: "https://openstax.org/books/biology-2e/pages/4-4-the-endomembrane-system-and-proteins" },
};
export const hasTeachingDiagram = (id: string) => Boolean(diagrams[id]);
function Flow({ steps }: { steps: string[] }) { return <ol className="teaching-flow">{steps.map((step, i) => <li key={step}><span className="eyebrow">{i + 1}</span><p>{step}</p></li>)}</ol>; }
export function TeachingDiagram({ lessonId }: { lessonId: string }) {
  const d = diagrams[lessonId]; if (!d) return null;
  return <figure className="study-panel teaching-diagram" data-teaching-figure={lessonId}>
    <h2>{d.title}</h2>
    {["dna-replication", "biophysics-image-formation", "myelin-and-glial-cells"].includes(lessonId) && <p className="diagram-scroll-hint">Scroll the diagram sideways to see the full drawing. Keyboard: focus the diagram and use the arrow keys.</p>}
    {lessonId === "dna-replication" && <div className="diagram-scroll" tabIndex={0} aria-label="Synthesis diagram; scroll horizontally on a small screen"><svg viewBox="0 0 900 420" role="img" aria-label={d.description}>
      <text x="30" y="35">Fork movement →</text><line x1="760" y1="60" x2="760" y2="365" strokeDasharray="8 6" /><text x="710" y="400">Fork</text>
      <text x="25" y="105">Template</text><text x="145" y="105">3′</text><text x="770" y="105">5′</text><line x1="175" y1="100" x2="750" y2="100" />
      <path className="diagram-product" d="M200 155 H700 M682 145 L700 155 L682 165" /><text x="180" y="188">5′</text><text x="695" y="188">3′</text><text x="270" y="220">Leading: synthesis toward fork</text>
      <text x="25" y="270">Template</text><text x="145" y="270">5′</text><text x="770" y="270">3′</text><line x1="175" y1="265" x2="750" y2="265" />
      {[240,420,600].map(x => <g key={x}><path className="diagram-product" d={`M${x+110} 320 H${x} m18 -10 l-18 10 18 10`} /><text x={x-8} y="353">3′</text><text x={x+100} y="353">5′</text></g>)}<text x="180" y="400">Lagging: each fragment grows away from fork</text>
    </svg></div>}
    {lessonId === "biophysics-image-formation" && <><div className="diagram-scroll" tabIndex={0} aria-label="Ray diagram; scroll horizontally on a small screen"><svg viewBox="0 0 900 400" role="img" aria-label={d.description}>
      <line x1="55" y1="220" x2="850" y2="220" /><line x1="450" y1="55" x2="450" y2="350" className="diagram-lens" />
      <path d="M150 220 V120 m-10 18 l10 -18 10 18" /><text x="100" y="90">Object</text><text x="410" y="35">Lens</text>
      <path className="diagram-ray" d="M150 120 H450 L600 270 M150 120 L600 270" />
      <path className="diagram-product" d="M600 220 V270 m-10 -18 l10 18 10 -18" /><text x="590" y="310">Image</text>
      <circle cx="350" cy="220" r="5" /><circle cx="550" cy="220" r="5" /><text x="328" y="255">−f</text><text x="545" y="255">+f</text>
      <text x="170" y="365">u = 30 cm</text><text x="505" y="365">v = 15 cm</text>
    </svg></div><p><Link href="/practice/biophysics#lenses">Change the object distance in the model studio</Link></p></>}
    {lessonId === "myelin-and-glial-cells" && <div className="diagram-scroll" tabIndex={0} aria-label="Myelin organisation diagram; scroll horizontally on a small screen"><svg viewBox="0 0 900 430" role="img" aria-label={d.description}>
      <text x="25" y="35">CNS: one oligodendrocyte, several internodes</text>
      <line x1="80" y1="95" x2="820" y2="95" /><line x1="80" y1="190" x2="820" y2="190" />
      <rect x="500" y="78" width="160" height="34" rx="15" className="diagram-myelin" /><rect x="200" y="173" width="160" height="34" rx="15" className="diagram-myelin" />
      <circle cx="410" cy="140" r="23" /><path d="M430 130 L530 103 M391 151 L330 183" />
      <text x="25" y="260">PNS: each Schwann cell forms one internode</text><line x1="80" y1="325" x2="820" y2="325" />
      {[180,410,640].map(x=><g key={x}><rect x={x-65} y="308" width="130" height="34" rx="15" className="diagram-myelin" /><circle cx={x} cy="307" r="8" /></g>)}
      <text x="140" y="385">Cell 1</text><text x="370" y="385">Cell 2</text><text x="600" y="385">Cell 3</text><text x="267" y="298">Node</text>
    </svg></div>}
    {lessonId === "brain-and-csf-barriers" && <><h3>Blood → brain interstitial fluid</h3><Flow steps={["Blood in CNS capillary", "Endothelial cells joined by tight junctions: principal seal", "Brain interstitial fluid"]} /><h3>Blood → ventricular CSF at the choroid plexus</h3><Flow steps={["Blood in fenestrated capillary", "Connective-tissue core", "Choroid-plexus epithelial tight junctions: principal seal", "Ventricular CSF"]} /></>}
    {lessonId === "pdh-tca" && <><Flow steps={["Pyruvate (3 carbons)", "PDH reaction: CO₂ released; NADH formed", "Acetyl-CoA supplies a 2-carbon acetyl group"]} /><Flow steps={["Acetyl group joins oxaloacetate (4 C)", "Citrate (6 C) enters the cycle", "Two CO₂ released per cycle turn; reduced carriers formed", "Oxaloacetate regenerated for another turn"]} /><p>Reduced carriers support electron transport. They are separate from the carbon intermediates shown here.</p></>}
    {lessonId === "protein-trafficking" && <Flow steps={["Translation with entry into rough ER", "Folding and quality control in ER", "Vesicle transport to Golgi", "Modification and sorting through Golgi", "Secretory vesicle fuses with plasma membrane"]} />}
    <figcaption><p>{d.description}</p><details><summary>Diagram source and scope</summary><p>Original website teaching diagram, 9 September 2026. <a href={d.source}>Supporting scientific reference</a>. AI-assisted preparation; independent subject review has not been completed.</p></details></figcaption>
  </figure>;
}
