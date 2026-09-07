"use client";

import { useState } from "react";
import Link from "next/link";
import geneticsData from "@/content/authored-guides.json";

type GuideCollection = {
  verifiedAt: string;
  courses?: { id: string; title: string }[];
  records: {
    id: string; title: string; edition: string; purpose: string; summary: string;
    topics: string[]; note: string; courses?: string[]; lessons: string[];
    files: { label: string; format: string; filename: string; url: string }[];
  }[];
};

const lessonNames: Record<string, string> = {
  inheritance: "Inheritance and pedigrees",
  meiosis: "Meiosis and mosaicism",
  "genetic-testing": "Choosing a genetic test",
  "innate-adaptive": "Innate and adaptive immunity",
  "antigen-presentation": "MHC and T-cell recognition",
  complement: "Complement pathways",
  microscopy: "Reading a histology section",
  epithelia: "Epithelial layers, shape and function",
  "cell-junctions": "Cell junctions and surfaces",
  "connective-tissue": "Connective tissue and matrix",
  "cartilage-bone": "Cartilage, bone and remodeling",
  "muscle-histology": "Comparing muscle tissues",
  "renal-histology": "Kidney cortex, medulla and tubules",
  "reproductive-histology": "Reproductive histology",
  placenta: "Placental villi and exchange",
  "liver-pancreas": "Liver and pancreas",
  neurulation: "Neural tube formation",
  "lymphoid-organs": "Lymph node, spleen and thymus",
  "respiratory-histology": "Airways and alveoli",
};

export function AuthoredGuides({
  collection = geneticsData,
  initialCourse = "",
  title = "Study guides you can open and use.",
  introduction = "Start with the integrated text, explore the illustrated addendum, then test yourself. These selected genetics and immunology study copies connect the original archive to the lessons on this website.",
  searchHint = "Try inheritance, complement or serology",
  accessNote = "",
}: {
  collection?: GuideCollection;
  initialCourse?: string;
  title?: string;
  introduction?: string;
  searchHint?: string;
  accessNote?: string;
}) {
  const [query, setQuery] = useState("");
  const [purpose, setPurpose] = useState("");
  const [course, setCourse] = useState(initialCourse);
  const needle = query.trim().toLocaleLowerCase();
  const guides = collection.records.filter((guide) =>
    (!course || guide.courses?.includes(course)) &&
    (!purpose || guide.purpose === purpose) &&
    [guide.title, guide.summary, ...guide.topics].join(" ").toLocaleLowerCase().includes(needle),
  );

  return (
    <section id="authored-guides" className="authored-guides" aria-labelledby="authored-guides-heading">
      <p className="eyebrow">From Siddhartha’s study desk</p>
      <h2 id="authored-guides-heading">{title}</h2>
      <p className="authored-intro">{introduction}</p>
      <p className="directory-access">
        Files open in Dropbox in a new tab and require an account with access to
        the study guide archive. The related web lessons are free to read here. {accessNote}
      </p>
      <div className="authored-controls" role="search" aria-label="Find an authored study guide">
        <label htmlFor="authored-query">Search these guides
          <input id="authored-query" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={searchHint} />
        </label>
        {collection.courses && (
          <label htmlFor="authored-course">Course
            <select id="authored-course" value={course} onChange={(event) => setCourse(event.target.value)}>
              <option value="">Both courses</option>
              {collection.courses.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
            </select>
          </label>
        )}
        <label htmlFor="authored-purpose">Study activity
          <select id="authored-purpose" value={purpose} onChange={(event) => setPurpose(event.target.value)}>
            <option value="">All study activities</option>
            <option value="read">Read and understand</option>
            <option value="practice">Practice and review</option>
          </select>
        </label>
      </div>
      <p className="authored-count" role="status">{guides.length} {guides.length === 1 ? "study collection" : "study collections"}</p>
      <div className="authored-grid">
        {guides.map((guide, index) => (
          <article className="authored-card" key={guide.id} aria-labelledby={`guide-${guide.id}`}>
            <div className="authored-card-top">
              <span className="authored-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <span className="eyebrow">{guide.purpose === "read" ? "Read and understand" : "Practice and review"}</span>
            </div>
            <p className="authored-edition">{guide.edition}</p>
            <h3 id={`guide-${guide.id}`}>{guide.title}</h3>
            <p>{guide.summary}</p>
            <details className="authored-topics">
              <summary>Explore topics in this guide</summary>
              <ul>{guide.topics.map((topic) => <li key={topic}>{topic}</li>)}</ul>
            </details>
            <div className="authored-files">
              {guide.files.map((file) => (
                <a className="button button-primary" key={file.url} href={file.url} target="_blank" rel="noopener noreferrer">
                  {file.label} <span className="authored-format">{file.format} ↗</span>
                  <span className="sr-only"> in Dropbox (new tab)</span>
                </a>
              ))}
            </div>
            <p className="authored-note">{guide.note}</p>
            <nav className="authored-lessons" aria-label={`Web lessons for ${guide.title}`}>
              <strong>Study a related concept here</strong>
              <ul>{guide.lessons.map((lesson) => <li key={lesson}><Link href={`/library/${lesson}`}>{lessonNames[lesson]} →</Link></li>)}</ul>
            </nav>
          </article>
        ))}
      </div>
      {guides.length === 0 && (
        <div className="directory-empty">
          <h3>No study guides match these filters.</h3>
          <p>Try a shorter topic search or reset the filters.</p>
          <button className="button button-secondary" onClick={() => { setQuery(""); setPurpose(""); setCourse(""); }}>Show all study guides</button>
        </div>
      )}
      <p className="directory-footnote">File locations and contents checked on {collection.verifiedAt}. Edition dates follow the source documents. These are independent study materials; they do not replace clinical guidance.</p>
    </section>
  );
}
