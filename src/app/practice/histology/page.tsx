import { SaveButton } from "@/components/catalog-browser";
import { HistologyDetective } from "@/components/histology-detective";
export const metadata = {
  title: "Histology detective: identify renal tubules",
  description:
    "Compare proximal tubule, distal tubule and collecting-duct schematics. Reveal the structural clues and connect them to physiology.",
  alternates: { canonical: "/practice/histology" },
};
export default async function HistologyPage({ searchParams }: { searchParams: Promise<{ case?: string; visual?: string; review?: string }> }) {
  const query = await searchParams;
  const initialCase = Math.max(0, Math.min(2, Math.floor(Number(query.case) || 1) - 1));
  return (
    <div className="site-container study-page">
      <header className="study-hero">
        <p className="eyebrow">Histology detective · schematic edition</p>
        <h1>
          Learn to see
          <br />
          <em>the difference.</em>
        </h1>
        <p className="interior-lede">
          Three renal tubules. Look for the lumen, the apical border and the
          cells. Make a choice, then reveal why it fits.
        </p>
      <SaveButton id="histology-detective" title="Histology detective" />
      </header>
      <section className="study-panel" aria-labelledby="real-slide-practice"><h2 id="real-slide-practice">Practise on real slides</h2><p>After the local cases, compare three more tissue families in the external Histology Guide virtual microscope. Open a collection, choose the named specimen, and write two observations before reading its labels.</p><div className="studio-grid">
        <article><h3>Connective tissue</h3><p>Compare MH 024 mesentery with MH 029a tendon. Describe fibre direction and the space between fibres.</p><a href="https://histologyguide.com/slidebox/03-connective-tissue.html">Open connective-tissue slides (external)</a><details><summary>Compare your reasoning</summary><p>The mesentery shows a looser fibre network; tendon has densely arranged fibres running predominantly together. Section orientation affects the appearance, so identify several fields.</p></details></article>
        <article><h3>Muscle</h3><p>Compare MH 055a skeletal muscle with MH 053 smooth muscle. Look for striations, cell shape and nuclear position. Compare longitudinal and cross sections where available.</p><a href="https://histologyguide.com/slidebox/04-muscle-tissue.html">Open muscle slides (external)</a><details><summary>Compare your reasoning</summary><p>Skeletal muscle has long striated fibres and multiple nuclei, often peripheral. Smooth muscle cells have central nuclei and lack the repeating striations. A cross section alone can hide the long-axis clues.</p></details></article>
        <article><h3>Nervous tissue</h3><p>Choose a peripheral nerve and a spinal cord section. Start at low magnification: compare bundles with the overall grey- and white-matter arrangement, then inspect the cells.</p><a href="https://histologyguide.com/slidebox/06-nervous-tissue.html">Open nervous-tissue slides (external)</a><details><summary>Compare your reasoning</summary><p>Peripheral nerve has fibres grouped into bundles. Spinal cord sections organise grey and white matter at the tissue level. Myelin appearance depends on preparation; a pale space alone does not identify a cell.</p></details></article>
      </div><p className="muted-note">The external provider hosts the specimens and controls its viewer. These exercises expand your practice route; they do not add specimens to the local image bank.</p></section>
      <HistologyDetective initialCase={initialCase} initialVisual={query.visual === "a" ? 2 : query.visual === "b" ? 3 : 0} review={query.review === "1"} />
    </div>
  );
}
