import { StudyVisual, VisualViewport } from "./study-visual";

export function SpirometryGraphExercise() {
  return (
    <StudyVisual
      className="study-panel"
      headingLevel={2}
      title="Read a spirometry volume–time graph"
      alt="The horizontal axis is elapsed time in seconds. The vertical axis is cumulative exhaled volume in litres. The trace starts at 0 litres, reaches 2.6 litres at 1 second and levels off at 4.0 litres."
      caption="The trace shows one fictional forced exhalation starting from full inspiration. The vertical axis measures how much air has already been exhaled."
      observe="Follow the dashed guide at one second up to the trace. Compare the volume at that point with the volume where the trace levels off."
      credit="Original graph and practice question by Wardhan Medical Study Guide Studios. Teaching basis: Respiratory Physiology, Revision 63, section 3.1.1."
      sources={[{
        title: "ATS/ERS technical statement on spirometry",
        url: "https://doi.org/10.1164/rccm.201908-1590ST",
      }]}
    >
      <p>What fraction of the total forced exhalation came out in the first second?</p>
      <VisualViewport label="Spirometry volume–time graph" minWidth={460}>
        <svg
          aria-hidden="true"
          focusable="false"
          viewBox="0 0 540 262"
          style={{ display: "block", width: "100%", maxWidth: "40rem", height: "auto" }}
        >
          <g fill="none" stroke="#63787d" strokeDasharray="6 4">
            <path d="M58 52H486 M58 108H165V212" />
          </g>
          <path d="M58 36V212H486" fill="none" stroke="#14252c" strokeWidth="2" />
          <path
            d="M58 212C94 154 130 128 165 108S232 72 272 64S340 52 379 52H486"
            fill="none"
            stroke="#17635e"
            strokeWidth="4"
          />
          <circle cx="165" cy="108" r="5" fill="#14252c" />
          <g fill="#14252c" fontFamily="system-ui, sans-serif" fontSize="17">
            <text x="58" y="25">Exhaled volume (L)</text>
            <g textAnchor="end">
              <text x="49" y="58">4.0</text>
              <text x="49" y="114">2.6</text>
              <text x="49" y="218">0</text>
            </g>
            <g textAnchor="middle">
              <text x="58" y="234">0</text>
              <text x="165" y="234">1</text>
              <text x="272" y="234">2</text>
              <text x="379" y="234">3</text>
              <text x="486" y="234">4</text>
              <text x="272" y="256">Time (s)</text>
            </g>
          </g>
        </svg>
      </VisualViewport>
      <details className="visual-description">
        <summary>Check the FEV₁/FVC calculation</summary>
        <p>
          At 1 second, the volume is 2.6 L. That is the forced expiratory volume
          in one second (FEV₁). The final volume is 4.0 L, the forced vital
          capacity (FVC). Divide 2.6 L by 4.0 L to get 0.65, or 65%.
        </p>
        <p>
          For a real test, interpretation also depends on the quality of the
          maneuver and appropriate reference values.
        </p>
      </details>
    </StudyVisual>
  );
}
