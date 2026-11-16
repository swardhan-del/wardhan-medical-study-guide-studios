"use client";

import { useId, useState } from "react";
import { useLearning } from "./learning-store";
import type { VolumeOneDiagram } from "@/content/anatomy-volume-one-pilot";

function labelLines(label: string) {
  const words = label.split(" ");
  if (label.length <= 21 || words.length < 2) return [label];
  let split = 1;
  while (split < words.length - 1 && words.slice(0, split).join(" ").length < label.length / 2) split++;
  return [words.slice(0, split).join(" "), words.slice(split).join(" ")];
}

function NodeDiagram({ diagram, labels }: { diagram: VolumeOneDiagram; labels: boolean }) {
  const svgId = useId();
  return <svg viewBox="0 0 320 221" width="100%" role="img" aria-labelledby={svgId + "-title"}>
    <title id={svgId + "-title"}>{labels ? diagram.description : "Schematic with numbered markers in place of labels"}</title>
    <defs>
      <marker id={svgId + "-arrow"} markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
        <path d="M0 0L7 3.5L0 7Z" fill="#2b6b73" />
      </marker>
    </defs>
    {diagram.edges.map(([from, to, arrow]) => {
      const [, x1, y1] = diagram.nodes[from];
      const [, x2, y2] = diagram.nodes[to];
      const dx = x2 - x1;
      const dy = y2 - y1;
      const inset = Math.min(dx ? 62 / Math.abs(dx) : Infinity, dy ? 19 / Math.abs(dy) : Infinity, .45);
      return <line key={from + "-" + to} x1={x1 + dx * inset} y1={y1 + dy * inset}
        x2={x2 - dx * inset} y2={y2 - dy * inset} stroke="#2b6b73" strokeWidth="1.8"
        markerEnd={arrow ? `url(#${svgId}-arrow)` : undefined} />;
    })}
    {diagram.nodes.map(([label, x, y], index) => {
      const lines = labels ? labelLines(label) : [String(index + 1)];
      return <g key={label} transform={`translate(${x},${y})`}>
        <rect x="-65" y="-17" width="130" height="34" rx="8" fill="#e9f4f2" stroke="#2b6b73" />
        <text textAnchor="middle" fontSize="11.5" fill="#173b42">
          {lines.map((line, i) => <tspan key={line} x="0" y={lines.length === 1 ? 4 : -2 + i * 13}>{line}</tspan>)}
        </text>
      </g>;
    })}
  </svg>;
}

export function VolumeOneDiagramActivity({ diagram }: { diagram: VolumeOneDiagram }) {
  const formId = useId();
  const { ready } = useLearning();
  const [responses, setResponses] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState(false);
  const options = diagram.nodes.map(([label]) => label).sort();
  const correct = diagram.nodes.filter(([label], index) => responses[index] === label).length;
  return <section className="study-panel volume-one-labelling" aria-label="Volume I diagram and labelling practice">
    <figure className="volume-one-diagram">
      <h2>{diagram.title}</h2>
      <NodeDiagram diagram={diagram} labels />
      <figcaption>
        <p>{diagram.description} This schematic is not to scale.</p>
        <p>Original SVG by Wardhan Medical Study Guide Studios. <a href={diagram.source}>Source for this diagram</a>.</p>
      </figcaption>
    </figure>
    <details>
      <summary>Label the diagram</summary>
      <NodeDiagram diagram={diagram} labels={false} />
      <form onSubmit={event => { event.preventDefault(); setChecked(true); }}>
        <fieldset disabled={!ready}>
          <legend>Choose a label for each marker</legend>
          {diagram.nodes.map(([label], index) => <div key={label} className="study-form">
            <label htmlFor={formId + "-" + index}>Marker {index + 1}</label>
              <select id={formId + "-" + index} required value={responses[index] ?? ""} onChange={event => {
                setChecked(false);
                setResponses({ ...responses, [index]: event.target.value });
              }}>
                <option value="">Choose a label</option>
                {options.map(option => <option key={option} value={option}>{option}</option>)}
              </select>
            {checked && <p>{responses[index] === label ? "Correct" : `Correct label: ${label}`}</p>}
          </div>)}
        </fieldset>
        <button type="submit" className="button button-primary" disabled={!ready}>Check labels</button>
        <p role="status">{checked ? `${correct} of ${diagram.nodes.length} labels correct.` : ""}</p>
      </form>
    </details>
  </section>;
}
