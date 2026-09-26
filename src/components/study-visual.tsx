import type { ComponentProps, ReactNode } from "react";

export type VisualMetadata = {
  title: string;
  alt: string;
  caption: string;
  observe: string;
  credit: string;
  sources: readonly { title: string; url: string }[];
};

/** One caption, attribution and text-equivalent contract for every teaching visual. */
export function StudyVisual({ title, alt, caption, observe, credit, sources, children, className = "", headingLevel = 3, ...props }: VisualMetadata & Omit<ComponentProps<"figure">, "title"> & { children: ReactNode; headingLevel?: 2 | 3 | 4 }) {
  const Heading = `h${headingLevel}` as "h2" | "h3" | "h4";
  return <figure {...props} className={`study-visual ${className}`} aria-label={title} data-visual-standard>
    <Heading className="study-visual-title">{title}</Heading>
    {children}
    <figcaption>
      <p>{caption}</p>
      <p className="visual-observation"><strong>Observe and explain:</strong> {observe}</p>
      <details className="visual-description"><summary>Read a text description</summary><p>{alt}</p></details>
      <p className="visual-credit">{credit}</p>
      <ul className="visual-sources" aria-label="Visual sources and references">{sources.map(source => <li key={source.url}><a href={source.url}>{source.title}</a></li>)}</ul>
    </figcaption>
  </figure>;
}

/** A semantic table and an equivalent stacked reading order for narrow screens. */
export function VisualComparison({ title, headers, rows }: { title: string; headers: readonly string[]; rows: readonly (readonly string[])[] }) {
  return <>
    <table className="visual-comparison"><caption>{title}</caption><thead><tr>{headers.map(header => <th key={header} scope="col">{header}</th>)}</tr></thead><tbody>{rows.map((row,rowIndex) => <tr key={rowIndex}>{row.map((cell, i) => i === 0 ? <th key={i} scope="row">{cell}</th> : <td key={i}>{cell}</td>)}</tr>)}</tbody></table>
    <div className="visual-comparison-mobile" role="group" aria-label={title}>{rows.map((row,rowIndex) => <section key={rowIndex}><h4>{headers[0]}: {row[0]}</h4><dl>{row.slice(1).map((cell,i) => <div key={headers[i+1]}><dt>{headers[i+1]}</dt><dd>{cell}</dd></div>)}</dl></section>)}</div>
  </>;
}

export function VisualFlow({ steps, label }: { steps: readonly string[]; label: string }) {
  return <ol className="visual-flow" aria-label={label}>{steps.map((step,i) => <li key={step}><span className="visual-step" aria-hidden="true">{i+1}</span><p>{step}</p>{i < steps.length-1 && <span className="visual-flow-arrow" aria-hidden="true">↓</span>}</li>)}</ol>;
}

/** Preserve legible diagram labels; the canvas can scroll without widening the page. */
export function VisualViewport({ label, minWidth = 500, children }: { label: string; minWidth?: number; children: ReactNode }) {
  return <><p className="visual-scroll-hint">On a narrow screen, scroll the diagram sideways. Keyboard: focus the diagram and use the arrow keys.</p><div className="visual-viewport" tabIndex={0} role="region" aria-label={label}><div style={{ minWidth }}>{children}</div></div></>;
}
