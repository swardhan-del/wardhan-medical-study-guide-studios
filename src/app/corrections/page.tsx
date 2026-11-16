import Link from "next/link";
import { searchMetadata } from "@/lib/search-metadata";
export const metadata = searchMetadata("/corrections");

const corrections = [
  ["pelvic-vessels-lymph", "Pelvic vessels and lymphatic drainage", "Clarified the internal iliac territories and distinguished bladder drainage from further spread to presacral nodes."],
  ["hand-intrinsics", "Intrinsic hand muscles and functional nerve tests", "Moved adductor pollicis into the adductor compartment and explained the Froment and OK signs."],
  ["brainstem-localization", "Brainstem landmarks and crossed findings", "Added the CN VI exit, a map of nuclei by level, and a comparison of medial and lateral medullary syndromes."],
];

export default function CorrectionsPage() {
  return <div className="site-container library-page">
    <header className="library-heading"><h1>Public corrections log</h1></header>
    <div className="privacy-copy">
      <p>Report a possible error with the lesson link, the passage in question, and a public source if you have one. <Link href="/contact">Report a correction</Link>.</p>
      <h2><time dateTime="2026-11-16">16 November 2026</time></h2>
      <ul>{corrections.map(([id, title, description]) => <li key={id}><Link href={`/library/${id}`}>{title}</Link>. {description}</li>)}</ul>
    </div>
  </div>;
}
