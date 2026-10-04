import { useId, type ReactNode } from "react";
import { firstPassConcentration, observedConcentration, indicatorModel } from "../lib/original-diagram-models";

// Independently authored SVG primitives and layouts. No imported image, tracing,
// external SVG, source illustration coordinates, OCR or private input is used.
const ink = "#20344b", blue = "#174c7e", green = "#185943", rust = "#833919";
function Label({ x, y, lines, size = 19, anchor = "start" }: { x: number; y: number; lines: string[]; size?: number; anchor?: "start" | "middle" }) {
  return <text x={x} y={y} fontSize={size} textAnchor={anchor} fill={ink}>{lines.map((line, i) => <tspan key={i} x={x} dy={i ? 25 : 0}>{line}</tspan>)}</text>;
}
function Box({ x, y, width, height, lines, fill = "#f0f5fa" }: { x: number; y: number; width: number; height: number; lines: string[]; fill?: string }) {
  return <g><rect x={x} y={y} width={width} height={height} rx={12} fill={fill} stroke={ink} strokeWidth={2} /><Label x={x + 15} y={y + 29} lines={lines} /></g>;
}
function Arrow({ d, marker, signal = false }: { d: string; marker: string; signal?: boolean }) {
  return <path d={d} fill="none" stroke={ink} strokeWidth={2.5} strokeDasharray={signal ? "6 5" : undefined} markerEnd={`url(#${marker})`} />;
}
function Core({ x, y }: { x: number; y: number }) {
  return <g transform={`translate(${x} ${y})`}><ellipse rx={30} ry={22} fill="#e2edf7" stroke={ink} strokeWidth={2} /><path d="M-40 12 C-55 -26 48 -40 43 -4 C38 25 -38 30 -37 1 C-35 -19 43 -21 43 17" stroke={blue} strokeWidth={4} fill="none" /></g>;
}

function Chromatin({ marker }: { marker: string }) {
  return <>
    <rect x={20} y={20} width={720} height={245} rx={14} fill="#f5f8fc" stroke={ink} strokeWidth={2} />
    <Label x={42} y={54} lines={["ONE NUCLEOSOME CORE"]} />
    <ellipse cx={180} cy={151} rx={112} ry={67} fill="#fffefa" stroke={ink} strokeWidth={2} data-part="histone-octamer" />
    {["H2A", "H2B", "H3", "H4", "H2A", "H2B", "H3", "H4"].map((name, i) => <g key={i} data-histone={name}>
      <circle cx={102 + (i % 4) * 52} cy={i < 4 ? 129 : 177} r={23} fill="#dfebf5" stroke={ink} strokeWidth={1.5} />
      <text x={102 + (i % 4) * 52} y={(i < 4 ? 129 : 177) + 6} textAnchor="middle" fill={ink} fontSize={17}>{name}</text>
    </g>)}
    <path d="M40 209 C27 66 333 55 307 163 C300 220 46 239 51 134 C57 59 319 58 325 190 L355 208" fill="none" stroke={blue} strokeWidth={5} />
    <Label x={385} y={108} lines={["Histone octamer:", "two copies each of", "H2A, H2B, H3 and H4"]} />
    <Label x={385} y={209} lines={["DNA wraps around the core"]} />
    <Arrow d="M375 203 L337 194" marker={marker} />
    <Label x={22} y={302} lines={["SIMPLIFIED CHROMATIN · local regions, not a fixed fibre hierarchy"]} />
    <rect x={20} y={324} width={350} height={307} rx={14} fill="#eef6f1" stroke={ink} strokeWidth={2} />
    <rect x={390} y={324} width={350} height={307} rx={14} fill="#f6f0e8" stroke={ink} strokeWidth={2} />
    <Label x={38} y={357} lines={["More accessible chromatin"]} />
    <Label x={409} y={357} lines={["Less accessible chromatin"]} />
    <path d="M40 455 C80 405 130 446 163 483 S253 461 329 451" fill="none" stroke={blue} strokeWidth={4} />
    <Core x={87} y={438} /><Core x={205} y={491} /><Core x={313} y={443} />
    <path d="M435 442 C525 366 628 493 489 503 C432 492 538 415 591 424 C685 440 609 544 540 528" fill="none" stroke={blue} strokeWidth={4} />
    <Core x={510} y={419} /><Core x={549} y={466} /><Core x={595} y={513} />
    <path d="M146 381 L165 400 L146 419 L127 400 Z" fill="#fffefa" stroke={green} strokeWidth={3} />
    <Label x={165} y={398} lines={["TF"]} size={17} /><Arrow d="M147 425 L158 457" marker={marker} />
    <path d="M675 381 L694 400 L675 419 L656 400 Z" fill="#fffefa" stroke={green} strokeWidth={3} />
    <Label x={639} y={375} lines={["TF"]} size={17} /><Arrow d="M660 427 L623 451" marker={marker} signal />
    <Label x={40} y={566} lines={["DNA sites easier to reach", "TF = transcription factor"]} />
    <Label x={409} y={566} lines={["DNA sites harder to reach", "Nucleosomes pack locally"]} />
    <Label x={22} y={674} lines={["Accessibility changes opportunities for binding.", "It does not automatically turn gene expression on or off."]} />
  </>;
}

function ErQuality({ marker }: { marker: string }) {
  return <>
    <Label x={22} y={32} lines={["CYTOSOL · protein synthesis"]} />
    <ellipse cx={124} cy={104} rx={37} ry={27} fill="#f5e6da" stroke={ink} strokeWidth={2} />
    <Label x={176} y={106} lines={["Ribosome"]} />
    <path d="M65 80 L178 80 M122 128 L113 145 L130 160 L113 178 L128 195 L117 216" fill="none" stroke={blue} strokeWidth={3} />
    <rect x={20} y={170} width={440} height={360} rx={18} fill="#edf4fa" stroke={ink} strokeWidth={3} />
    <rect x={103} y={153} width={42} height={39} rx={6} fill="#fffefa" stroke={ink} strokeWidth={3} />
    <path d="M123 156 L123 231" stroke={blue} strokeWidth={4} fill="none" />
    <Label x={176} y={164} lines={["Translocon"]} /><Label x={180} y={262} lines={["ROUGH ER · ER LUMEN"]} />
    <Arrow d="M124 231 L124 282" marker={marker} />
    <Box x={62} y={297} width={327} height={69} lines={["Folding with chaperones"]} />
    <Arrow d="M390 327 L545 327" marker={marker} />
    <Label x={473} y={290} lines={["Folded: ER exit"]} size={17} />
    {[0, 1, 2].map(i => <path key={i} d={`M568 ${309 + i * 17} Q624 ${285 + i * 17} 680 ${309 + i * 17}`} fill="none" stroke={green} strokeWidth={5} />)}
    <Label x={585} y={381} lines={["Golgi"]} />
    <Arrow d="M205 368 L205 424" marker={marker} />
    <Label x={232} y={407} lines={["Failure persists"]} size={17} />
    <Box x={62} y={438} width={327} height={64} lines={["Persistent misfolding"]} fill="#f8eee5" />
    <Arrow d="M392 469 L487 469" marker={marker} signal />
    <Box x={496} y={412} width={241} height={123} lines={["UPR signalling", "Reduce incoming load", "Increase folding", "capacity"]} />
    <Label x={490} y={562} lines={["Dashed arrow: stress signal", "Not a protein-disposal route"]} size={17} />
    <Arrow d="M150 504 V544 H470 V606 H132 V615" marker={marker} />
    <Label x={22} y={578} lines={["CYTOSOL · ER-associated degradation (ERAD)"]} />
    <g data-erad-stage="retrotranslocation" data-compartment="cytosol"><Box x={20} y={625} width={224} height={80} lines={["Retrotranslocation", "to cytosol"]} /></g>
    <Arrow d="M247 665 L279 665" marker={marker} />
    <g data-erad-stage="ubiquitin" data-compartment="cytosol"><Box x={289} y={625} width={185} height={80} lines={["Ubiquitin tag"]} fill="#f8eee5" /><Label x={310} y={689} lines={["Ub — substrate"]} size={17} /></g>
    <Arrow d="M478 665 L523 665" marker={marker} />
    <g data-erad-stage="proteasome" data-compartment="cytosol"><Box x={534} y={625} width={205} height={80} lines={["Proteasome", "Degradation"]} /></g>
    <Label x={22} y={746} lines={["Extraction and tagging can be coupled; arrows simplify the sequence.", "Prolonged unresolved stress can contribute to apoptosis.", "UPR does not always cause apoptosis."]} size={18} />
  </>;
}

function Receptors({ marker }: { marker: string }) {
  const gpcr = Array.from({ length: 7 }, (_, i) => `${i ? 'L' : 'M'}${99 + i * 25} ${i % 2 ? 250 : 191} L${99 + i * 25} ${i % 2 ? 191 : 250}`).join(' ');
  return <>
    <rect x={20} y={20} width={350} height={671} rx={14} fill="#edf4fa" stroke={ink} strokeWidth={2} />
    <rect x={390} y={20} width={350} height={671} rx={14} fill="#eef6f1" stroke={ink} strokeWidth={2} />
    <Label x={42} y={57} lines={["GPCR"]} size={24} /><Label x={412} y={57} lines={["Receptor tyrosine kinase"]} size={22} />
    <Label x={48} y={104} lines={["Ligand"]} /><Label x={412} y={104} lines={["Ligand"]} />
    <path d="M174 78 L192 96 L174 114 L156 96 Z M566 78 L584 96 L566 114 L548 96 Z" stroke={ink} fill="#f4dfc9" strokeWidth={2} />
    <Arrow d="M174 118 L174 174" marker={marker} /><Arrow d="M566 118 L566 174" marker={marker} />
    <Label x={40} y={145} lines={["Seven-pass", "receptor"]} size={17} />
    <Label x={412} y={150} lines={["Dimerisation or", "rearrangement"]} size={17} />
    {[20, 390].map(x => <g key={x}><rect x={x + 1} y={205} width={348} height={28} fill="#d0dce5" /><path d={`M${x + 1} 205 H${x + 349} M${x + 1} 233 H${x + 349}`} stroke={ink} strokeWidth={2} /></g>)}
    <path d={gpcr} fill="none" stroke={blue} strokeWidth={10} strokeLinejoin="round" data-transmembrane-passes="7" />
    <path d="M527 180 V283 H548 M604 180 V283 H583 M527 180 Q566 148 604 180" fill="none" stroke={green} strokeWidth={8} />
    <Label x={278} y={220} lines={["Membrane"]} size={17} /><Label x={43} y={281} lines={["Cytosol"]} size={17} /><Label x={657} y={271} lines={["Cytosol"]} size={17} />
    <Arrow d="M174 258 L174 305" marker={marker} />
    <g data-part="heterotrimeric-g-protein"><circle cx={147} cy={342} r={31} fill="#fffefa" stroke={ink} strokeWidth={2} /><circle cx={203} cy={342} r={23} fill="#fffefa" stroke={ink} strokeWidth={2} /><circle cx={234} cy={361} r={17} fill="#fffefa" stroke={ink} strokeWidth={2} /><Label x={126} y={350} lines={["Gα"]} /><Label x={193} y={349} lines={["β"]} /><Label x={229} y={368} lines={["γ"]} size={17} /></g>
    <Label x={44} y={402} lines={["Heterotrimeric G protein", "GDP → GTP exchange on Gα"]} size={18} />
    <Arrow d="M184 449 L184 479" marker={marker} />
    <Box x={42} y={490} width={305} height={108} lines={["Gα and/or Gβγ", "regulate an effector", "enzyme or ion channel"]} />
    <Label x={45} y={641} lines={["Not every GPCR uses cAMP"]} size={17} />
    <circle cx={544} cy={291} r={14} fill="#fffefa" stroke={rust} strokeWidth={2} /><circle cx={587} cy={291} r={14} fill="#fffefa" stroke={rust} strokeWidth={2} />
    <Label x={537} y={298} lines={["P"]} size={17} /><Label x={580} y={298} lines={["P"]} size={17} />
    <Box x={412} y={322} width={305} height={76} lines={["Cytosolic tyrosine", "phosphorylation"]} />
    <Arrow d="M564 400 L564 434" marker={marker} />
    <Box x={412} y={444} width={305} height={65} lines={["Docking proteins"]} />
    <Arrow d="M564 511 L564 545" marker={marker} />
    <Box x={412} y={554} width={305} height={61} lines={["Ras → MAP kinase cascade"]} />
    <Label x={414} y={650} lines={["One example, not every RTK output"]} size={17} />
    <Label x={22} y={732} lines={["P = phosphate on a tyrosine; arrows show signalling relationships.", "Ras is a small GTPase, distinct from the heterotrimeric G protein."]} size={18} />
  </>;
}

function Indicator({ marker, hatch }: { marker: string; hatch: string }) {
  const x = (t: number) => 85 + t / 1.2 * 635, y = (c: number) => 594 - c * 90;
  const curve = (from: number, to: number, fn: (t: number) => number) => Array.from({ length: 121 }, (_, i) => {
    const t = from + (to - from) * i / 120;
    return `${i ? 'L' : 'M'}${x(t).toFixed(2)} ${y(fn(t)).toFixed(2)}`;
  }).join(' ');
  const first = curve(0, 1.2, firstPassConcentration);
  return <>
    <Label x={22} y={35} lines={["KNOWN INDICATOR BOLUS → DOWNSTREAM SAMPLING"]} />
    <rect x={42} y={117} width={678} height={53} rx={16} fill="#edf4fa" stroke={ink} strokeWidth={2} />
    <Label x={68} y={83} lines={["Injection: 5 mg"]} /><Arrow d="M133 91 L133 136" marker={marker} />
    <Label x={274} y={151} lines={["Blood flow"]} /><Arrow d="M394 143 L458 143" marker={marker} />
    <path d="M586 120 V96 H665" stroke={ink} strokeWidth={2} fill="none" />
    <Label x={477} y={69} lines={["Downstream sample"]} />
    <Arrow d="M585 174 L585 210" marker={marker} />
    <Label x={42} y={244} lines={["Baseline-corrected concentration (mg/L)"]} size={18} />
    <Label x={42} y={274} lines={["Illustrative curves · same dose; constant flow during each pass"]} size={17} />
    <path d={`${first} L${x(1.2)} 594 L85 594 Z`} fill={`url(#${hatch})`} data-area="first-pass-auc" />
    <path d="M85 306 V594 H731" fill="none" stroke={ink} strokeWidth={2} markerEnd={`url(#${marker})`} />
    {[0, 1, 2, 3].map(c => <g key={c}><path d={`M79 ${y(c)} H85`} stroke={ink} /><Label x={57} y={y(c) + 6} lines={[String(c)]} size={17} /></g>)}
    {[0, 0.4, 0.8, 1.2].map(t => <g key={t}><path d={`M${x(t)} 594 V601`} stroke={ink} /><Label x={x(t) - 12} y={623} lines={[String(t)]} size={17} /></g>)}
    <Label x={530} y={656} lines={["Time (min)"]} size={18} />
    <path d={curve(0, .5, firstPassConcentration)} stroke={blue} strokeWidth={4} fill="none" data-curve="first-pass" />
    <path d={curve(.5, 1.2, firstPassConcentration)} stroke={blue} strokeWidth={3} strokeDasharray="5 4" fill="none" data-curve="estimated-tail" />
    <path d={curve(.5, 1.2, observedConcentration)} stroke={rust} strokeWidth={4} fill="none" data-curve="recirculation" />
    <path d={curve(0, 1.2, t => firstPassConcentration(t, indicatorModel.higherFlowLMin))} stroke={green} strokeWidth={3} strokeDasharray="12 7" fill="none" data-curve="higher-flow" />
    <Label x={107} y={330} lines={["First pass"]} size={18} />
    <Label x={427} y={330} lines={["Later recirculation", "Exclude or correct"]} size={18} /><Arrow d="M544 365 L519 462" marker={marker} />
    <Label x={22} y={683} lines={["Hatching: first-pass AUC", "Short dashes: estimated tail"]} size={17} />
    <Label x={390} y={683} lines={["Long dashes: greater flow", "→ smaller first-pass AUC"]} size={17} />
    <Label x={22} y={756} lines={["Flow = injected indicator amount ÷ first-pass concentration-time AUC", "Dose in mg ÷ AUC in mg·min/L = flow in L/min", "This estimates flow, not stroke volume per beat."]} size={18} />
  </>;
}

export function OriginalDiagram({ id, title, alt }: { id: string; title: string; alt: string }) {
  const uid = useId().replaceAll(":", "");
  const marker = `diagram-arrow-${uid}`, hatch = `diagram-hatch-${uid}`;
  let content: ReactNode, height = 780;
  switch (id) {
    case "chromatin-local-access": content = <Chromatin marker={marker} />; height = 730; break;
    case "er-folding-decisions": content = <ErQuality marker={marker} />; height = 820; break;
    case "gpcr-versus-rtk": content = <Receptors marker={marker} />; break;
    case "first-pass-indicator-flow": content = <Indicator marker={marker} hatch={hatch} />; height = 850; break;
    default: return null;
  }
  return <svg className="original-teaching-svg" viewBox={`0 0 760 ${height}`} role="img" aria-labelledby={`${uid}-title`} aria-describedby={`${uid}-description`} xmlns="http://www.w3.org/2000/svg" data-original-diagram={id}>
    <title id={`${uid}-title`}>{title}</title><desc id={`${uid}-description`}>{alt}</desc>
    <defs><marker id={marker} markerWidth={8} markerHeight={8} refX={7} refY={3} orient="auto" markerUnits="strokeWidth"><path d="M0 0 L7 3 L0 6 Z" fill={ink} /></marker>
      <pattern id={hatch} width={10} height={10} patternUnits="userSpaceOnUse"><rect width={10} height={10} fill="#e1edf8" /><path d="M0 10 L10 0" stroke="#9cb4ca" strokeWidth={1.5} /></pattern>
    </defs>
    <g aria-hidden="true" fontFamily="system-ui, sans-serif">{content}</g>
  </svg>;
}
