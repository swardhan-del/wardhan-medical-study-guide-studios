"use client";

import { useState } from "react";
import Link from "next/link";
import { charging, diffusionDistance, echoDepthCm, relativeFlow, thinLens, transmission } from "@/lib/biophysics-models";

function Control({ id, label, value, min, max, step = 1, unit, change }: { id: string; label: string; value: number; min: number; max: number; step?: number; unit: string; change: (n: number) => void }) {
  return <div className="bp-control"><label htmlFor={id}>{label}: <strong>{value} {unit}</strong></label><input id={id} type="range" min={min} max={max} step={step} value={value} onChange={e => change(Number(e.currentTarget.value))} /><p className="muted-note">{min}–{max} {unit}. Use the arrow keys for small changes.</p></div>;
}
function Curve({ label, xLabel, yLabel, maxX, maxY, selectedX, calculate }: { label: string; xLabel: string; yLabel: string; maxX: number; maxY: number; selectedX: number; calculate: (x: number) => number }) {
  const x = (v: number) => 65 + 390 * v / maxX, y = (v: number) => 190 - 150 * v / maxY;
  const points = Array.from({length: 81}, (_, i) => {const v = maxX * i / 80; return x(v) + "," + y(calculate(v));}).join(" ");
  return <svg className="bp-chart" viewBox="0 0 500 245" role="img" aria-label={label}>
    <title>{label}</title>
    <path d="M65 35V190H465" fill="none" stroke="currentColor" />
    <text x="65" y="23" fontSize="14" fill="currentColor">{yLabel}</text>
    <text x="250" y="234" textAnchor="middle" fontSize="14" fill="currentColor">{xLabel}</text>
    <text x="57" y="195" textAnchor="end" fontSize="13" fill="currentColor">0</text>
    <text x="57" y="44" textAnchor="end" fontSize="13" fill="currentColor">{maxY}</text>
    <text x="65" y="211" textAnchor="middle" fontSize="13" fill="currentColor">0</text>
    <text x="455" y="211" textAnchor="middle" fontSize="13" fill="currentColor">{maxX}</text>
    <polyline points={points} fill="none" stroke="#176d71" strokeWidth="3" />
    <line x1={x(selectedX)} x2={x(selectedX)} y1={190} y2={y(calculate(selectedX))} stroke="#975019" strokeDasharray="5 4" />
    <circle cx={x(selectedX)} cy={y(calculate(selectedX))} r="6" fill="#975019" />
  </svg>;
}
function Explanation({ children }: { children: React.ReactNode }) {
  return <details className="bp-explanation"><summary>Explain the result</summary><p>{children}</p></details>;
}
export function BiophysicsLab() {
  const [distance, setDistance] = useState(30), [layers, setLayers] = useState(2), [time, setTime] = useState(1), [seconds, setSeconds] = useState(1), [radius, setRadius] = useState(1), [echo, setEcho] = useState(100);
  const lens = thinLens(10, distance);
  return <div className="bp-model-grid">
    <section className="study-panel" aria-labelledby="bp-lens-title" id="lenses">
      <p className="eyebrow">01 · Thin lens</p><h2 id="bp-lens-title">Where does the image form?</h2>
      <p>Predict what happens as the object crosses the focus. The converging lens has focal length +10 cm.</p>
      <Control id="bp-distance" label="Object distance" value={distance} min={5} max={40} unit="cm" change={setDistance} />
      <output className="bp-result" aria-live="polite">{lens.kind === "parallel" ? "At the focus: emerging rays are parallel; no finite image distance." : "Image distance " + lens.imageCm!.toFixed(1) + " cm · " + lens.kind + " image · magnification " + lens.magnification!.toFixed(2)}</output>
      <svg className="bp-chart" viewBox="0 0 500 170" role="img" aria-label={"Lens position schematic: object " + distance + " cm left of lens; focal points 10 cm from lens. Image result is stated above."}>
        <title>Lens and object positions, with a fixed spatial scale</title>
        <line x1="25" x2="475" y1="90" y2="90" stroke="currentColor" />
        <path d="M330 30Q345 90 330 150Q315 90 330 30Z" fill="#b9dcd7" stroke="#176d71" />
        <line x1={330-distance*7} x2={330-distance*7} y1="90" y2="45" stroke="#975019" strokeWidth="4" />
        <text x={330-distance*7} y="30" textAnchor="middle" fontSize="14">Object</text>
        <circle cx="260" cy="90" r="4" fill="#176d71" /><circle cx="400" cy="90" r="4" fill="#176d71" />
        <text x="260" y="115" textAnchor="middle" fontSize="14">−10 cm</text><text x="400" y="115" textAnchor="middle" fontSize="14">+10 cm</text>
        <text x="330" y="165" textAnchor="middle" fontSize="14">Lens</text>
      </svg>
      <p className="muted-note">Position schematic; image distance may lie outside the drawing.</p>
      <Explanation>1/f = 1/u + 1/v. Beyond f the image is real and inverted (negative magnification); inside f it is virtual and upright. At u = f the denominator vanishes. This paraxial thin-lens model neglects aberrations.</Explanation>
      <Link href="/library/biophysics-image-formation">Study image formation →</Link>
    </section>
    <section className="study-panel" aria-labelledby="bp-attenuation-title" id="attenuation">
      <p className="eyebrow">02 · Attenuation</p><h2 id="bp-attenuation-title">How much of the beam remains?</h2><p>Predict the remaining fraction after one more half-value layer.</p>
      <Control id="bp-layers" label="Half-value layers" value={layers} min={0} max={6} step={0.5} unit="layers" change={setLayers} />
      <output className="bp-result" aria-live="polite">{(100*transmission(layers)).toFixed(2)}% transmitted</output>
      <Curve label="Exponential attenuation: transmission decreases by half for each half-value layer." xLabel="Half-value layers" yLabel="Transmission (%)" maxX={6} maxY={100} selectedX={layers} calculate={x=>100*transmission(x)} />
      <Explanation>I/I₀ = 2⁻ⁿ. Each layer halves what remains, rather than subtracting a fixed percentage of the starting beam. Assumptions: narrow monoenergetic beam, uniform material and no added scattered signal. This is not a shielding-design calculation.</Explanation>
      <Link href="/library/biophysics-practical-attenuation">Work an attenuation problem →</Link>
    </section>
    <section className="study-panel" aria-labelledby="bp-rc-title" id="membrane">
      <p className="eyebrow">03 · Membrane charging</p><h2 id="bp-rc-title">Does one time constant finish charging?</h2><p>Predict the fraction of the final voltage change reached after one or two time constants.</p>
      <Control id="bp-time" label="Elapsed time" value={time} min={0} max={5} step={0.1} unit="τ" change={setTime} />
      <output className="bp-result" aria-live="polite">{(100*charging(time)).toFixed(1)}% of final change</output>
      <Curve label="RC charging: voltage approaches its final value exponentially." xLabel="Elapsed time / τ" yLabel="Completed change (%)" maxX={5} maxY={100} selectedX={time} calculate={x=>100*charging(x)} />
      <Explanation>Completed fraction = 1 − exp(−t/τ), with τ = RC. After one τ, about 63% is complete and 37% remains. This passive circuit does not include the voltage-dependent channels that regenerate an action potential.</Explanation>
      <Link href="/library/biophysics-resting-potential">Connect the membrane model →</Link>
    </section>
    <section className="study-panel" aria-labelledby="bp-diffusion-title" id="diffusion">
      <p className="eyebrow">04 · Diffusion</p><h2 id="bp-diffusion-title">How far does random motion reach?</h2><p>For one-dimensional free diffusion, use D = 200 μm²/s. Predict the time needed to double the distance scale.</p>
      <Control id="bp-seconds" label="Diffusion time" value={seconds} min={0} max={16} step={0.5} unit="s" change={setSeconds} />
      <output className="bp-result" aria-live="polite">{diffusionDistance(200,seconds).toFixed(1)} μm root-mean-square displacement</output>
      <Curve label="Diffusion distance grows with the square root of time." xLabel="Time (s)" yLabel="RMS displacement (μm)" maxX={16} maxY={80} selectedX={seconds} calculate={x=>diffusionDistance(200,x)} />
      <Explanation>RMS displacement = √(2Dt) in one dimension. Doubling this distance requires four times as long. This is a statistical displacement scale, not the path length or guaranteed location of one molecule. The model excludes bulk drift and confinement.</Explanation>
      <Link href="/library/biophysics-practical-diffusion">Practise diffusion measurement →</Link>
    </section>
    <section className="study-panel" aria-labelledby="bp-flow-title" id="flow">
      <p className="eyebrow">05 · Poiseuille flow</p><h2 id="bp-flow-title">Why does radius matter so much?</h2><p>Keep pressure difference, viscosity and tube length fixed. Predict the flow change before moving the radius.</p>
      <Control id="bp-radius" label="Radius relative to baseline" value={radius} min={0.5} max={2} step={0.1} unit="×" change={setRadius} />
      <output className="bp-result" aria-live="polite">{relativeFlow(radius).toFixed(4)} × baseline flow</output>
      <Curve label="Flow rises with the fourth power of tube radius at fixed driving pressure." xLabel="Radius / baseline radius" yLabel="Flow / baseline flow" maxX={2} maxY={16} selectedX={radius} calculate={x=>x**4} />
      <Explanation>Q/Q₀ = (r/r₀)⁴. At half radius, flow is 1/16; at twice radius, it is 16 times baseline. This assumes steady laminar Newtonian flow in a rigid circular tube. Real pulsatile vessels can depart from this model.</Explanation>
      <Link href="/library/biophysics-fluid-flow">Study the assumptions →</Link>
    </section>
    <section className="study-panel" aria-labelledby="bp-echo-title" id="ultrasound">
      <p className="eyebrow">06 · Ultrasound</p><h2 id="bp-echo-title">Turn an echo time into depth</h2><p>Use an assumed sound speed of 1540 m/s. Predict why the round trip needs a factor of two.</p>
      <Control id="bp-echo" label="Echo return time" value={echo} min={0} max={200} step={10} unit="μs" change={setEcho} />
      <output className="bp-result" aria-live="polite">{echoDepthCm(echo).toFixed(2)} cm reflector depth</output>
      <Curve label="Reflector depth increases linearly with round-trip echo time at fixed sound speed." xLabel="Return time (μs)" yLabel="Depth (cm)" maxX={200} maxY={15.4} selectedX={echo} calculate={x=>echoDepthCm(x)} />
      <Explanation>d = ct/2. The pulse travels to the reflector and back; ct is the whole path. Different sound speeds, angled paths and multiple reflections can make a real echo harder to interpret. This model is an educational timing exercise.</Explanation>
      <Link href="/library/biophysics-ultrasound">Study ultrasound imaging →</Link>
    </section>
  </div>;
}
