import Link from "next/link";
import {
  RenalHemodynamics,
  VentilationPlayground,
  AbgPractice,
} from "@/components/physiology-lab";
import { RenalSources } from "@/components/renal-sources";
export const metadata = {
  title: "Interactive renal hemodynamics and ABG practice",
  description:
    "Explore afferent and efferent resistance, change ventilation and work through six blood-gas interpretation exercises.",
  alternates: { canonical: "/practice/physiology" },
};
export default function PhysiologyPage() {
  return (
    <div className="site-container study-page">
      <header className="study-hero">
        <Link className="text-link" href="/learn/renal">
          ← Renal course
        </Link>
        <p className="eyebrow">Physiology playground</p>
        <h1>
          Predict. Change.
          <br />
          <em>Explain.</em>
        </h1>
        <p className="interior-lede">
          Use simplified models to isolate a mechanism. Then check whether you
          can explain the result.
        </p>
        <nav className="topic-buttons" aria-label="Lab activities">
          <a href="#renal">Renal circuit</a>
          <a href="#ventilation">Ventilation & pH</a>
          <a href="#abg">ABG practice</a>
        </nav>
      </header>
      <div id="renal">
        <RenalHemodynamics />
      </div>
      <div id="ventilation">
        <VentilationPlayground />
      </div>
      <div id="abg">
        <AbgPractice />
      </div>
      <RenalSources />
    </div>
  );
}
