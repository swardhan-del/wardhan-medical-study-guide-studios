"use client";
import { useState } from "react";
import Link from "next/link";
const tissues = [
  {
    name: "Proximal convoluted tubule",
    clue: "A dense apical brush border makes the lumen look fuzzy; cells are relatively tall and strongly stained.",
    rationale:
      "Long apical microvilli provide surface area for bulk reabsorption. Indistinct cell boundaries and a fuzzy lumen support PCT recognition in a real section.",
    features: [
      "Fuzzy apical border",
      "Tall cuboidal cells",
      "Relatively narrow lumen",
    ],
  },
  {
    name: "Distal convoluted tubule",
    clue: "A cleaner lumen, lower cells and more nuclear profiles around the lumen distinguish this view.",
    rationale:
      "DCT cells have sparse short microvilli rather than the prominent PCT brush border. The relatively open lumen is a useful clue, but should be combined with location and surrounding structures.",
    features: [
      "No prominent brush border",
      "Lower cuboidal cells",
      "Open lumen",
    ],
  },
  {
    name: "Collecting duct",
    clue: "The lumen is broad, the nuclei are central, and cell boundaries are conspicuous.",
    rationale:
      "Distinct borders and a larger lumen support collecting-duct recognition. Cells become more columnar toward the papilla. Identification in a real section requires more than one clue.",
    features: ["Distinct cell boundaries", "Central nuclei", "Broad lumen"],
  },
];
function DetectiveCase({ index }: { index: number }) {
  const [selected, setSelected] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [feature, setFeature] = useState<number | null>(null);
  const item = tissues[index];
  const count = index === 1 ? 14 : 10;
  const inner = index === 0 ? 54 : index === 1 ? 76 : 85;
  return (
    <div className="study-panel">
      <div className="study-grid two">
        <div>
          <svg
            className="histology-diagram"
            viewBox="0 0 360 330"
            role="img"
            aria-label={`Unlabeled tubule schematic ${index + 1}. ${item.clue}`}
          >
            <rect width="360" height="330" fill="#f9f1e6" />
            <circle
              cx="180"
              cy="160"
              r="126"
              fill={index === 0 ? "#d9868d" : "#e8b8bc"}
              stroke="#643d62"
              strokeWidth="3"
            />
            <circle
              cx="180"
              cy="160"
              r={inner}
              fill="#fffaf0"
              stroke="#855477"
              strokeWidth={index === 0 ? 8 : 2}
              strokeDasharray={index === 0 ? "2 3" : undefined}
            />
            {Array.from({ length: count }, (_, i) => {
              const angle = (i * 2 * Math.PI) / count;
              const x = 180 + 103 * Math.cos(angle);
              const y = 160 + 103 * Math.sin(angle);
              return (
                <g key={i}>
                  <ellipse
                    cx={x}
                    cy={y}
                    rx="8"
                    ry="12"
                    fill="#624569"
                    transform={`rotate(${(i * 360) / count + 90} ${x} ${y})`}
                  />
                  {index === 2 && (
                    <line
                      x1={180 + inner * Math.cos(angle + 0.25)}
                      y1={160 + inner * Math.sin(angle + 0.25)}
                      x2={180 + 125 * Math.cos(angle + 0.25)}
                      y2={160 + 125 * Math.sin(angle + 0.25)}
                      stroke="#9e6176"
                      strokeWidth="2"
                    />
                  )}
                </g>
              );
            })}
            {feature !== null && (
              <>
                <circle
                  cx="180"
                  cy={feature === 0 ? 160 - inner : feature === 1 ? 58 : 160}
                  r={feature === 2 ? 27 : 18}
                  fill="none"
                  stroke="#0b595b"
                  strokeWidth="4"
                />
                <text
                  x="180"
                  y="312"
                  textAnchor="middle"
                  fontSize="14"
                  fill="#14252c"
                >
                  {item.features[feature]}
                </text>
              </>
            )}
          </svg>
          <p className="source-note">
            Original teaching schematic · exaggerated features · no stain or
            scale is simulated. This is not a microscope slide.
          </p>
        </div>
        <div>
          <p className="eyebrow">Detective case {index + 1}</p>
          <h2>Which tubule fits these clues?</h2>
          <p>{item.clue}</p>
          <label className="study-form">
            My identification
            <select
              value={selected}
              onChange={(e) => {
                setSelected(e.target.value);
                setRevealed(false);
              }}
            >
              <option value="">Choose a structure</option>
              {tissues.map((t) => (
                <option key={t.name}>{t.name}</option>
              ))}
            </select>
          </label>
          <button
            className="button button-primary"
            disabled={!selected}
            onClick={() => setRevealed(true)}
          >
            Reveal the reasoning
          </button>
        </div>
      </div>
      {revealed && (
        <div className="answer-explanation" role="status">
          <h3>
            {selected === item.name ? "Correct" : "Look again"}: {item.name}
          </h3>
          <p>{item.rationale}</p>
          <p>Select a feature to highlight its location:</p>
          <div className="topic-buttons">
            {item.features.map((name, i) => (
              <button
                key={name}
                aria-pressed={feature === i}
                onClick={() => setFeature(i)}
              >
                {name}
              </button>
            ))}
          </div>
          <Link className="text-link" href="/learn/renal/tubular-transport">
            Connect structure to transport →
          </Link>
        </div>
      )}
    </div>
  );
}
export function HistologyDetective() {
  const [index, setIndex] = useState(0);
  return (
    <div className="study-stack">
      <div className="topic-buttons" aria-label="Choose a histology case">
        {tissues.map((_, i) => (
          <button
            key={i}
            aria-pressed={i === index}
            onClick={() => setIndex(i)}
          >
            Specimen {i + 1}
          </button>
        ))}
      </div>
      <DetectiveCase key={index} index={index} />
      <section className="study-panel">
        <h2>From schematic to slide</h2>
        <p>
          Use these simplified drawings to learn the distinguishing features,
          then practice on course-approved microscopy. Real sections vary with
          plane, preparation and staining. Combine several clues and orient
          yourself in cortex or medulla.
        </p>
        <p className="source-note">
          Source: Microscopic Anatomy and Embryology I–II, Professional
          Integrated Edition, Revision 4, August 2, 2026; “Kidney and Nephron
          Histology,” tubular segments and practical identification. Full source
          documents and third-party slide photographs remain in the private
          library.
        </p>
      </section>
    </div>
  );
}
