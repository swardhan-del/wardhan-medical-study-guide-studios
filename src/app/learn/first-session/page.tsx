import Link from "next/link";
import { SearchBreadcrumbs } from "@/components/search-breadcrumbs";
import { firstSessionHref, firstSessionsPath, firstStudySessions } from "@/content/first-study-sessions";
import { searchMetadata } from "@/lib/search-metadata";

export const metadata = searchMetadata(firstSessionsPath);

export default function FirstSessionsPage() {
  return (
    <div className="site-container study-page">
      <SearchBreadcrumbs items={[{ name: "Start here", href: "/start" }, { name: "First study sessions", href: firstSessionsPath }]} />
      <header className="study-hero">
        <h1>Try a short study session</h1>
        <p className="interior-lede">Choose a subject, work through one example, and check your answer. Come back in 24 hours to try a related question in My Study.</p>
      </header>
      <ul className="studio-grid first-session-list">
        {firstStudySessions.map(session => (
          <li className="study-panel" key={session.id}>
            <p className="eyebrow">{session.subject}</p>
            <h2><Link className="text-link" href={firstSessionHref(session.id)}>{session.title}</Link></h2>
            <p>{session.objective}</p>
          </li>
        ))}
      </ul>
      <p><Link className="text-link" href="/study#subject-review">Find my follow-up questions in My Study</Link></p>
    </div>
  );
}
