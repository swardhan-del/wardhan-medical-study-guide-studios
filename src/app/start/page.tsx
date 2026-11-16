import Link from "next/link";
import { firstSessionsPath } from "@/content/first-study-sessions";
import { searchMetadata } from "@/lib/search-metadata";
import { SubjectPicker } from "@/components/subject-picker";

export const metadata = searchMetadata("/start");

export default function StartPage() {
  return <div className="site-container study-page">
    <header className="study-hero">
      <h1>Choose a subject. Start with one lesson.</h1>
      <p>Read one explanation, try its questions and save the summary to revisit.</p>
    </header>
    <SubjectPicker />
    <nav className="action-row" aria-label="More ways to start">
      <Link href={firstSessionsPath}>Try a five-minute study session</Link>
      <Link href="/learn/topics/membrane-transport">Try the membrane transport sequence</Link>
      <Link href="/subjects">Browse all subjects</Link>
      <Link href="/study">Open My Study</Link>
      <Link href="/starter-pack">Get the starter pack</Link>
    </nav>
    <span id="first-session" /><span id="subject-paths" />
  </div>;
}
