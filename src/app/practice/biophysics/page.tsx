import Link from "next/link";
import { BiophysicsLab } from "@/components/biophysics-lab";
export const metadata = { title: "Biophysics · Predict and calculate", description: "Six interactive models connecting equations, graphs and medical measurement.", alternates: { canonical: "/practice/biophysics" } };
export default function BiophysicsPracticePage() {
  return <div className="site-container study-page">
    <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/study/biophysics">Biophysics</Link><span aria-hidden="true"> / </span><span aria-current="page">Interactive models</span></nav>
    <header className="study-hero"><p className="eyebrow">Biophysics practical studio</p><h1>Predict. Calculate. Explain.</h1><p className="interior-lede">Make a prediction, move one control and explain the result using the model&apos;s assumptions.</p><p>Each graph has a written result. These classroom models simplify real systems; they do not provide clinical measurements or device settings.</p>
    <nav className="action-row" aria-label="Choose a model">{[["lenses","Lenses"],["attenuation","Attenuation"],["membrane","Membrane"],["diffusion","Diffusion"],["flow","Flow"],["ultrasound","Ultrasound"]].map(([id,label])=><a key={id} href={"#"+id}>{label}</a>)}</nav></header>
    <BiophysicsLab />
    <div className="action-row"><Link className="button button-primary" href="/study/biophysics">Continue the course</Link><Link href="/library/biophysics-practical-lenses">Start the practical lessons →</Link></div>
  </div>;
}
