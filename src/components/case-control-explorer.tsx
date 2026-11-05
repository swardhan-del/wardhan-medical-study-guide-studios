"use client";

import { useState } from "react";

export function CaseControlExplorer() {
  const [outcomes, setOutcomes] = useState(500);
  const a = (3 * outcomes) / 4;
  const b = (1000 - outcomes) / 4;
  const c = outcomes / 4;
  const d = (3 * (1000 - outcomes)) / 4;
  const exposedRisk = a / (a + b);
  const unexposedRisk = c / (c + d);
  const populations = [
    { name: "Population A — fixed", cells: [75, 225, 25, 675], risks: [0.25, 1 / 28], totalOutcomes: 100 },
    { name: "Population B — adjustable", cells: [a, b, c, d], risks: [exposedRisk, unexposedRisk], totalOutcomes: outcomes },
  ];
  return (
    <section className="study-panel case-control-explorer" aria-labelledby="case-control-explorer-title">
      <p className="eyebrow">Explore an invented population</p>
      <h2 id="case-control-explorer-title">Same odds ratio, different risks</h2>
      <p>These are complete fictional populations, each starting with 1000 outcome-free units, fixed exposure and complete follow-up over one common period. Controls come from end-of-period noncases.</p>
      <p>The separate selected sample stays at 20 cases (15 exposed, 5 unexposed) and 20 noncase controls (5 exposed, 15 unexposed). Its odds ratio is 9 and selected case fraction is 1/2. It is a possible result from either population, not a guaranteed random draw.</p>
      <label htmlFor="case-control-outcomes">Population B: number experiencing the outcome</label>
      <input id="case-control-outcomes" type="range" min="40" max="960" step="4" value={outcomes}
        aria-describedby="case-control-assumptions" aria-valuetext={`${outcomes} outcomes among 1000 units`}
        onChange={event => setOutcomes(Number(event.target.value))} />
      <p id="case-control-assumptions">Changing the outcome count keeps the exposure fractions at 3/4 among outcomes and 1/4 among non-outcomes. All 231 states use integer counts. This illustrates algebraic compatibility, not repeated sampling, clinical risk prediction or causation.</p>
      <p role="status" aria-live="polite" aria-atomic="true">Population B: {outcomes} outcomes among 1000; exposed risk {exposedRisk.toFixed(4)}, unexposed risk {unexposedRisk.toFixed(4)}; risk ratio {(exposedRisk / unexposedRisk).toFixed(4)}; odds ratio 9.</p>
      <div className="case-control-populations">
        {populations.map(population => (
          <section key={population.name} aria-label={population.name}>
            <h3>{population.name}</h3>
            <dl>
              {[
                ["Exposed outcomes", population.cells[0]],
                ["Exposed non-outcomes", population.cells[1]],
                ["Unexposed outcomes", population.cells[2]],
                ["Unexposed non-outcomes", population.cells[3]],
                ["Overall outcome fraction", `${population.totalOutcomes}/1000`],
                ["Exposed risk", `${population.cells[0]}/${population.cells[0] + population.cells[1]} = ${population.risks[0].toFixed(4)}`],
                ["Unexposed risk", `${population.cells[2]}/${population.cells[2] + population.cells[3]} = ${population.risks[1].toFixed(4)}`],
                ["Risk ratio", (population.risks[0] / population.risks[1]).toFixed(4)],
                ["Outcome odds ratio", "9"],
              ].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
            </dl>
          </section>
        ))}
      </div>
      <details><summary>Check the algebra and the limits</summary>
        <p>Let D be Population B outcomes. Its cells are a = 3D/4, b = (1000 − D)/4, c = D/4, d = 3(1000 − D)/4. The cross-product odds ratio ad/(bc) is 9. Exposed risk is 3D/(1000 + 2D); unexposed risk is D/(3000 − 2D). Displayed decimals are rounded.</p>
        <p>There are enough units of every category throughout the slider range for the selected table to be possible. Selection must not force the exposure split. Other control-sampling designs, including risk-set sampling or matching, require their own analysis; this construction supplies no confidence interval or causal estimate.</p>
      </details>
      <p>The slider requires JavaScript. The fixed population A, initial population B and the worked calculation below remain readable without it.</p>
    </section>
  );
}
