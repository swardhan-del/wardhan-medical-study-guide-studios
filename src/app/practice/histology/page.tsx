import { HistologyDetective } from "@/components/histology-detective";
export const metadata = {
  title: "Histology detective: identify renal tubules",
  description:
    "Compare proximal tubule, distal tubule and collecting-duct schematics. Reveal the structural clues and connect them to physiology.",
  alternates: { canonical: "/practice/histology" },
};
export default function HistologyPage() {
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
      </header>
      <HistologyDetective />
    </div>
  );
}
