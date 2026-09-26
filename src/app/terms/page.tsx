import { searchMetadata } from "@/lib/search-metadata";
import Link from "next/link";
export const metadata = searchMetadata("/terms");
export default function TermsPage() {
  return <div className="site-container library-page"><header className="library-heading"><p className="eyebrow">Independent study support</p><h1>Terms and educational disclaimer</h1></header><div className="privacy-copy">
    <h2>Use alongside your course</h2><p>Study Guide Studios is an independent educational project. It is not affiliated with or endorsed by a university or examining body. These resources support study; they do not replace official course material, your syllabus, teaching, supervised practical work or assessment guidance.</p>
    <h2>Not medical advice</h2><p>The lessons and examples are for education, not diagnosis, treatment or individual health decisions. They do not establish a clinician–patient relationship. Seek a qualified health professional for personal medical advice and local emergency services for urgent help.</p>
    <h2>Accuracy and limitations</h2><p>Check the sources and editorial notes for each lesson. Some content is AI-assisted, and independent clinical peer review has not been completed. Errors and gaps may remain; no exam result or complete syllabus coverage is guaranteed. <Link href="/contact">Report a correction or accessibility issue</Link>.</p>
    <h2>Pre-launch waitlist</h2><p>The wider product is pre-launch. Joining the optional waitlist requests launch and free-resource updates, not a purchase, reservation or promise of early access. Features and timing may change. Demo mode does not create a subscription. Free public lessons do not require joining.</p>
    <h2>Respect source credits</h2><p>Source material and credited images remain subject to their respective rights and stated licences. Access to this site does not grant permission to redistribute third-party material. Use the existing print and download options for personal study, following any licence shown with a resource.</p>
    <h2>Your information</h2><p>Do not submit patient information or sensitive personal details. See <Link href="/privacy">Privacy</Link> for browser storage, waitlist data and optional analytics. These terms do not limit rights that applicable law gives you.</p>
  </div></div>;
}
