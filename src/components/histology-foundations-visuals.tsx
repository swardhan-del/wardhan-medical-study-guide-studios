import type { ReactNode } from "react";
import references from "@/content/lesson-references.json";
import { EducationalFigure } from "./educational-figure";
import { figuresForResource } from "@/lib/figures";
import styles from "./histology-foundations.module.css";

const ink = "#274943", cell = "#d9eeea", nucleus = "#604879", matrix = "#fbefe3";
const sourceKeys = ["epithelia", "connective-tissue", "muscle-histology", "myelin-and-glial-cells"] as const;
type SourceKey = typeof sourceKeys[number];

function Drawing({ alt, children, height = 180 }: { alt: string; children: ReactNode; height?: number }) {
  return <svg className={styles.drawing} viewBox={`0 0 360 ${height}`} role="img" aria-label={alt} xmlns="http://www.w3.org/2000/svg">
    <title>{alt}</title>{children}
  </svg>;
}

function Diagram({ id, title, caption, observe, sources, children }: {
  id: string; title: string; caption: string; observe: string; sources: readonly SourceKey[]; children: ReactNode;
}) {
  return <figure className={styles.diagram} id={id} data-study-diagram>
    <h3>{title}</h3>
    {children}
    <figcaption>
      <p>{caption}</p>
      <p><strong>Observe and explain:</strong> {observe}</p>
      <p className={styles.credit}>Original teaching schematic · Wardhan Medical Study Guide Studios · AI-assisted SVG, source-checked. Not a micrograph; not to scale.</p>
      <p className={styles.credit}>Scientific references: {sources.map((key, i) => <span key={key}>{i > 0 && "; "}<a href={references[key].url}>{references[key].title}</a></span>)}</p>
    </figcaption>
  </figure>;
}

function EpithelialPattern({ stratified = false }: { stratified?: boolean }) {
  return <Drawing height={220} alt={stratified ? "Several epithelial layers rest above a basal boundary; the most superficial cells are flattened." : "A single layer of tall epithelial cells has an apical surface facing the lumen and a basal surface on the basal lamina; supporting connective tissue lies below."}>
    <text x="20" y="24">Lumen / free surface</text>
    <rect x="20" y="175" width="320" height="35" fill={matrix}/>
    {stratified ? <>
      {[[128,46],[94,34],[65,29]].map(([y,h]) => [0,1,2,3,4,5].map(col => <g key={`${y}-${col}`}>
        <rect x={20+col*53} y={y} width="53" height={h} rx="5" fill={cell} stroke={ink} strokeWidth="2"/>
        <ellipse cx={46+col*53} cy={y+h/2} rx="8" ry="6" fill={nucleus}/>
      </g>))}
      {[0,1,2,3].map(i => <g key={i}><rect x={20+i*80} y="43" width="80" height="21" rx="6" fill={cell} stroke={ink} strokeWidth="2"/><ellipse cx={60+i*80} cy="54" rx="12" ry="4" fill={nucleus}/></g>)}
    </> : [0,1,2,3,4].map(i => <g key={i}>
      <rect x={20+i*64} y="50" width="64" height="124" fill={cell} stroke={ink} strokeWidth="2"/>
      <ellipse cx={52+i*64} cy="138" rx="12" ry="18" fill={nucleus}/>
    </g>)}
    <path d="M20 176 H340" stroke={ink} strokeWidth="5"/>
    <text x="27" y="201">Connective tissue below</text>
  </Drawing>;
}

function MatrixPattern() {
  return <Drawing alt="Wavy thick collagen bundles and thin elastic fibres pass between scattered spindle-shaped fibroblasts within ground substance." height={210}>
    <rect x="8" y="8" width="344" height="190" rx="12" fill={matrix}/>
    {[35,90,145].map(y => <path key={y} d={`M20 ${y} C95 ${y-30},150 ${y+30},220 ${y} S300 ${y-20},340 ${y}`} fill="none" stroke="#a85535" strokeWidth="12"/>)}
    <path d="M15 175 Q70 20 120 105 T220 90 T345 60 M30 80 Q140 170 200 60 T330 150" fill="none" stroke={ink} strokeWidth="3"/>
    {[[85,67],[195,136],[280,170]].map(([x,y]) => <g key={x}><path d={`M${x-32} ${y+12} Q${x} ${y-25} ${x+32} ${y-12} Q${x} ${y+25} ${x-32} ${y+12}`} fill={cell} stroke={ink} strokeWidth="2"/><ellipse cx={x} cy={y} rx="13" ry="5" fill={nucleus} transform={`rotate(-20 ${x} ${y})`}/></g>)}
  </Drawing>;
}

function MusclePattern({ kind }: { kind: "skeletal" | "cardiac" | "smooth" }) {
  const alt = {
    skeletal: "A long skeletal muscle fibre has cross-striations and several nuclei at its periphery.",
    cardiac: "Branching cardiac muscle cells have striations and central nuclei; a dark stepped intercalated disc crosses the central fibre.",
    smooth: "Spindle-shaped smooth muscle cells each contain a single central nucleus and have no cross-striations.",
  }[kind];
  return <Drawing alt={alt} height={150}>
    {kind === "smooth" ? [40,100].map((y,i) => <g key={y}>
      <path d={`M20 ${y} Q180 ${y-53} 340 ${y} Q180 ${y+53} 20 ${y}`} fill={cell} stroke={ink} strokeWidth="2"/>
      <ellipse cx={180+i*12} cy={y} rx="24" ry="7" fill={nucleus}/>
    </g>) : <>
      <path d={kind === "skeletal" ? "M10 37 H350 V116 H10 Z" : "M10 56 H100 L150 12 L181 42 L145 72 H350 V116 H120 L75 145 L52 119 L86 94 H10 Z"} fill={cell} stroke={ink} strokeWidth="2"/>
      {(kind === "skeletal" ? Array.from({length: 20}, (_, i) => 20 + i * 16) : [20,38,56,74,200,218,236,254,272,290,308,326]).map(x => <path key={x} d={`M${x} ${kind === "skeletal" ? 42 : x < 100 ? 60 : 77} V${kind === "cardiac" && x < 100 ? 90 : 111}`} stroke="#527b73" strokeWidth="2"/>)}
      {kind === "skeletal" ? [[80,46],[185,107],[308,46]].map(([x,y]) => <ellipse key={x} cx={x} cy={y} rx="16" ry="6" fill={nucleus}/>) : <><ellipse cx="107" cy="77" rx="14" ry="9" fill={nucleus}/><ellipse cx="252" cy="93" rx="14" ry="9" fill={nucleus}/><path d="M185 72 V87 H177 V100 H185 V116" fill="none" stroke="#14252c" strokeWidth="5"/></>}
    </>}
  </Drawing>;
}

function NeuronPattern() {
  return <Drawing alt="A neuron has branching dendrites around its cell body, a central nucleus and a single long axon; small surrounding cells represent glia without specifying a subtype." height={190}>
    <path d="M82 65 L44 25 M60 43 L20 50 M71 116 L25 151 M42 133 L15 117 M116 60 L136 20 M115 122 L138 165 M139 92 H320 L345 65 M320 92 L347 115" stroke={ink} strokeWidth="5" fill="none"/>
    <path d="M60 90 Q85 40 119 65 L142 91 L119 122 Q85 145 60 90" fill={cell} stroke={ink} strokeWidth="3"/>
    <circle cx="99" cy="93" r="16" fill={nucleus}/>
    {[[199,43],[260,149],[46,96]].map(([x,y]) => <g key={x}><circle cx={x} cy={y} r="11" fill={matrix} stroke={ink} strokeWidth="2"/><circle cx={x} cy={y} r="4" fill={nucleus}/></g>)}
    <text x="15" y="185">Soma + dendrites</text><text x="252" y="80">Axon</text>
  </Drawing>;
}

export function TissueFamilyOverview() {
  return <section aria-labelledby="core-concepts-title">
    <h2 id="core-concepts-title">Core Concepts</h2>
    <p>Identify the tissue family from its organisation, then refine the classification. An organ usually contains several families.</p>
    <Diagram id="tissue-families" title="Four tissue families, four structural patterns" sources={sourceKeys}
      caption="These simplified patterns compare organisation rather than specimen colour or cell size."
      observe="For each panel, identify the dominant arrangement and relate it to the function stated below.">
      <div className={styles.grid}>
        <div><h4>Epithelial</h4><EpithelialPattern/><p>A closely joined surface or lining supports protection, exchange, absorption or secretion.</p></div>
        <div><h4>Connective</h4><MatrixPattern/><p>Cells and extracellular matrix provide support, binding, transport and repair.</p></div>
        <div><h4>Muscle</h4><MusclePattern kind="skeletal"/><p>Contractile cells produce force. Skeletal muscle is illustrated; cardiac and smooth muscle differ.</p></div>
        <div><h4>Nervous</h4><NeuronPattern/><p>Neurons receive and transmit signals; glia maintain the environment and support axons.</p></div>
      </div>
    </Diagram>
  </section>;
}

export function HistologyVisualStudy() {
  return <section aria-labelledby="visual-study-title" id="lesson-figures">
    <h2 id="visual-study-title">Visual Study Prompts</h2>
    <p>Describe what you see before reading the caption. Separate observed structures from features inferred from a schematic.</p>
    <Diagram id="epithelial-polarity" title="1. Epithelial polarity and layers" sources={["epithelia"]}
      caption="The apical surface faces the lumen; the basal surface attaches to the basal lamina, shown as a thick line for clarity. The full basement membrane is not resolved here. Purple ovals represent nuclei."
      observe="Compare a single columnar layer with stratified squamous epithelium. Name the latter from its surface cells, and explain why counting nuclear rows alone can be misleading.">
      <div className={styles.grid}><div><h4>Simple columnar</h4><EpithelialPattern/></div><div><h4>Stratified squamous</h4><EpithelialPattern stratified/></div></div>
      <p>Basal lamina thickness is exaggerated. Pseudostratified epithelium is not drawn: all its cells contact the basement membrane, but only some reach the surface.</p>
    </Diagram>
    <div className={styles.micrographs}>
      <h3>Compare real epithelial sections</h3>
      <p>Trace the luminal boundary in the kidney image, then locate the superficial squamous cells in the multilayered image. Compare architecture, not displayed cell size: the source magnifications are 200× and 100×.</p>
      {figuresForResource("histology-foundations-tissues").map(figure => <EducationalFigure key={figure.id} figure={figure}/>)}
      <p><strong>If the images are unavailable:</strong> the kidney section illustrates one cuboidal layer around tubular lumina; the stratified section illustrates several layers with flattened superficial cells. The schematics above preserve the comparison.</p>
    </div>
    <Diagram id="connective-matrix" title="2. Connective-tissue extracellular matrix" sources={["connective-tissue"]}
      caption="Thick brown bands represent collagen; thin branching lines represent elastic fibres. Spindle-shaped cells contain purple nuclei, while the pale background represents hydrated ground substance. This is a schematic of connective tissue proper, not all connective-tissue subtypes."
      observe="Distinguish the fibroblasts from the material between them. Predict how aligning the collagen in parallel would change the principal direction of tensile strength.">
      <MatrixPattern/>
      <p>Matrix includes fibres and ground substance. Ground substance is not empty space; its appearance in routine sections depends on preparation and staining.</p>
    </Diagram>
    <Diagram id="muscle-comparison" title="3. Skeletal, cardiac and smooth muscle" sources={["muscle-histology"]}
      caption="Longitudinal schematics emphasise the combination of cell shape, nuclear pattern and striations. Purple shapes represent nuclei; narrow cross-lines represent striations. The thick stepped line in the cardiac panel represents an intercalated disc."
      observe="Use at least two features to distinguish each type. Explain why an inconspicuous disc or absent striations in one field cannot, by itself, establish smooth muscle.">
      <div className={styles.grid}>
        <div><h4>Skeletal</h4><MusclePattern kind="skeletal"/><p>Long, usually unbranched fibres; multiple peripheral nuclei; cross-striations.</p></div>
        <div><h4>Cardiac</h4><MusclePattern kind="cardiac"/><p>Branching cells; usually one central nucleus, sometimes two; striations and intercalated discs.</p></div>
        <div><h4>Smooth</h4><MusclePattern kind="smooth"/><p>Spindle-shaped cells; one central nucleus; no sarcomeric cross-striations.</p></div>
      </div>
    </Diagram>
    <Diagram id="neurons-and-myelin" title="4. Neurons, glia and the source of myelin" sources={["myelin-and-glial-cells"]}
      caption="The neuron panel separates the soma, dendrites and axon. The myelin panels show different relationships between a glial cell and axonal segments. Glia are cells; myelin is a specialised glial membrane sheath."
      observe="Trace one glial cell to the internode or internodes it supplies. Explain why myelin loss and loss of an entire neuron are different events.">
      <div className={styles.grid}>
        <div><h4>Neuron and supporting glia</h4><NeuronPattern/><p>Small surrounding cells indicate glia conceptually; the drawing does not assign their subtype from size alone.</p></div>
        <div><h4>CNS: oligodendrocyte</h4>
          <Drawing alt="One oligodendrocyte cell body sends processes to myelin internodes on two different CNS axons." height={190}>
            <path d="M15 42 H345 M15 152 H345" stroke={ink} strokeWidth="4"/>
            <rect x="45" y="28" width="98" height="28" rx="12" fill={cell} stroke={ink} strokeWidth="3"/><path d="M45 42 H143" stroke={ink} strokeWidth="3"/>
            <rect x="218" y="138" width="98" height="28" rx="12" fill={cell} stroke={ink} strokeWidth="3"/><path d="M218 152 H316" stroke={ink} strokeWidth="3"/>
            <path d="M172 92 L94 56 M191 112 L265 138" stroke={ink} strokeWidth="3"/>
            <circle cx="182" cy="102" r="22" fill={matrix} stroke={ink} strokeWidth="2"/><circle cx="182" cy="102" r="8" fill={nucleus}/>
          </Drawing><p>One oligodendrocyte can supply internodes on several axons. Only two are illustrated.</p>
        </div>
        <div><h4>PNS: myelinating Schwann cell</h4>
          <Drawing alt="A single myelinating Schwann cell surrounds one internode of one PNS axon; its nucleus lies outside the myelin sheath." height={190}>
            <rect x="78" y="53" width="204" height="71" rx="24" fill={matrix} stroke={ink} strokeWidth="2"/>
            <rect x="90" y="80" width="180" height="35" rx="14" fill={cell} stroke={ink} strokeWidth="3"/>
            <path d="M20 97 H340" stroke={ink} strokeWidth="4"/>
            <ellipse cx="183" cy="65" rx="18" ry="7" fill={nucleus}/>
            <path d="M90 139 V149 H270 V139" fill="none" stroke={ink} strokeWidth="2"/><text x="108" y="178">One internode</text>
          </Drawing><p>One myelinating Schwann cell supplies one internode of one axon. Successive internodes require successive cells.</p>
        </div>
      </div>
      <p>These relationships require more than routine H&E to demonstrate reliably. Not every axon is myelinated, and not every glial cell forms myelin.</p>
    </Diagram>
    <Diagram id="section-orientation" title="5. Section orientation and identification" sources={["muscle-histology", "connective-tissue"]}
      caption="Longitudinal and transverse schematics show the same tissue type: skeletal muscle. Cutting across a fibre changes which features can be seen; it does not change the tissue family."
      observe="Find the long fibre and peripheral nuclei in longitudinal view. In transverse view, use the fibre profiles and peripheral nuclei; cross-striations cannot be assessed in the same way.">
      <div className={styles.grid}><div><h4>Longitudinal section</h4><MusclePattern kind="skeletal"/></div><div><h4>Transverse section</h4>
        <Drawing alt="Transverse skeletal muscle shows polygonal fibre profiles with some peripheral nuclei; not every profile intersects a nucleus." height={175}>
          {[[59,52],[160,51],[262,52],[110,119],[212,119]].map(([x,y],i) => <g key={x}><path d={`M${x-44} ${y-30} L${x+24} ${y-32} L${x+44} ${y+5} L${x+15} ${y+32} L${x-44} ${y+22} Z`} fill={cell} stroke={ink} strokeWidth="2"/>{i%2===0 && <ellipse cx={x-35} cy={y} rx="5" ry="12" fill={nucleus}/>}</g>)}
        </Drawing></div></div>
      <ol className={styles.clueSequence}><li><strong>Observe:</strong> boundary, cells and matrix.</li><li><strong>Compare:</strong> two positive clues and a plausible alternative.</li><li><strong>Conclude:</strong> tissue family, supported subtype and remaining uncertainty.</li></ol>
    </Diagram>
  </section>;
}
