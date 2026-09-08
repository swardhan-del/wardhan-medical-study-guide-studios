"use client";

import { useState } from "react";
import practice from "@/content/thorax-practice.json";

const identificationOrder = [2, 3, 0, 1, 4, 5];

export function ThoraxMap() {
  const [selected, setSelected] = useState(2);
  const [identify, setIdentify] = useState(false);
  const [step, setStep] = useState(0);
  const [attempt, setAttempt] = useState<number | null>(null);
  const [inspiration, setInspiration] = useState(false);
  const target = identificationOrder[step];
  const found = attempt === target;
  const structure = practice.structures[selected];
  const finished = step === identificationOrder.length - 1 && found;
  function startIdentification() {
    setIdentify(true);
    setStep(0);
    setAttempt(null);
  }
  function choose(index: number) {
    if (identify) {
      if (found) return;
      setAttempt(index);
    }
    setSelected(index);
  }
  return (
    <section className="thorax-map" aria-labelledby="thorax-map-title">
      <p className="eyebrow">Explore the image</p>
      <h4 id="thorax-map-title">Build a map of the chest.</h4>
      <p>Front view: the person’s right appears on your left. Select a numbered marker or use the matching buttons below.</p>
      <div className="thorax-actions" role="group" aria-label="Diagram mode">
        <button type="button" aria-pressed={!identify} onClick={() => setIdentify(false)}>Explore structures</button>
        <button type="button" aria-pressed={identify} onClick={startIdentification}>Identify structures</button>
      </div>
      {identify ? <div className="thorax-identify-prompt" aria-live="polite">
        <p><strong>{finished ? "All six structures identified." : `Find: ${practice.structures[target].name}`}</strong></p>
        <p>{step + (found ? 1 : 0)} of 6 identified this round.</p>
      </div> : null}
      <figure>
        <div className="thorax-drawing">
          <svg viewBox="0 0 600 560" role="img" aria-labelledby="thorax-svg-title thorax-svg-description">
            <title id="thorax-svg-title">Front-view schematic of the thorax</title>
            <desc id="thorax-svg-description">Two lungs lie on either side of the central mediastinum. The trachea branches into the lungs. Pleural outlines surround each lung and the diaphragm lies below. Numbered controls provide descriptions or identification practice.</desc>
            <rect width="600" height="560" rx="20" fill="#f4eee3" />
            <text x="80" y="40" fill="#183c3c" fontSize="20">PERSON’S RIGHT</text>
            <text x="520" y="40" textAnchor="end" fill="#183c3c" fontSize="20">PERSON’S LEFT</text>
            <path d="M240 65 Q190 70 146 105 Q55 174 64 430 Q78 498 160 514 L440 514 Q522 498 536 430 Q545 174 454 105 Q410 70 360 65" fill="#e7dccb" stroke="#9c8f7c" strokeWidth="4" />
            <defs><clipPath id="thorax-chest-contents"><path d={inspiration ? "M50 60 H550 V482 L520 482 Q381 435 278 466 Q177 419 79 471 L50 471 Z" : "M50 60 H550 V459 L520 459 Q391 371 280 440 Q169 341 79 444 L50 444 Z"} /></clipPath></defs>
            <g clipPath="url(#thorax-chest-contents)">
            <path d="M260 86 L340 86 L367 425 Q300 461 233 425 Z" fill="#ebc58e" stroke="#a4763d" strokeWidth="3" />
            <path d="M221 106 Q142 108 99 225 Q78 310 94 428 Q152 397 238 426 L253 282 Q220 218 239 134 Z" fill="#e2f1ef" stroke="#267c78" strokeWidth="4" />
            <path d="M379 106 Q458 108 501 225 Q522 310 506 428 Q448 412 362 439 L347 282 Q380 218 361 134 Z" fill="#e2f1ef" stroke="#267c78" strokeWidth="4" />
            <path d="M220 120 Q151 119 112 233 Q92 313 108 410 Q166 390 225 412 L239 281 Q205 210 225 137 Z" fill="#8fc5c0" stroke="#267c78" strokeWidth="2" />
            <path d="M380 120 Q449 119 488 233 Q508 313 492 412 Q441 403 375 425 L361 281 Q395 210 375 137 Z" fill="#8fc5c0" stroke="#267c78" strokeWidth="2" />
            <path d="M289 66 L289 210 L242 245 L252 264 L300 229 L351 264 L364 245 L311 210 L311 66" fill="#fff7e9" stroke="#706d62" strokeWidth="3" />
            {[132, 146, 160, 174, 188].map((y) => <path key={y} d={`M290 ${y} H310`} stroke="#a1a395" strokeWidth="3" />)}
            <path d="M285 290 C255 267 240 305 257 340 C275 370 308 390 335 405 C358 361 367 322 347 299 C329 280 304 288 300 301 Z" fill="#c98272" stroke="#8a4c40" strokeWidth="3" />
            </g>
            <path d={inspiration ? "M79 471 Q177 419 278 466 Q381 435 520 482 L520 501 Q389 454 278 485 Q174 438 79 490 Z" : "M79 444 Q169 341 280 440 Q391 371 520 459 L520 478 Q389 390 280 459 Q168 360 79 463 Z"} fill="#c7a5c5" stroke="#745e7f" strokeWidth="4" />
            {inspiration ? <path d="M300 485 V519 M290 510 L300 522 L310 510" fill="none" stroke="#58396d" strokeWidth="5" /> : null}
            <text x="300" y="550" textAnchor="middle" fill="#526664" fontSize="17">SCHEMATIC · NOT TO SCALE</text>
          </svg>
          {practice.structures.map((item, index) => <button
            key={item.id} type="button" className={`thorax-marker${selected === index && (!identify || attempt !== null) ? " is-selected" : ""}`}
            style={{ left: `${item.x}%`, top: `${item.id === "diaphragm" && inspiration ? 86 : item.y}%` }}
            aria-label={identify ? `Marker ${index + 1}` : `Marker ${index + 1}: ${item.name}`}
            aria-pressed={selected === index && (!identify || attempt !== null)}
            onClick={() => choose(index)}>{index + 1}</button>)}
        </div>
        <figcaption>Original learning schematic. Chest wall is opened for orientation; organ shapes and pleural spacing are simplified. The colored muscle band below the lungs represents the diaphragm.</figcaption>
      </figure>
      <div className="thorax-structure-list" role="group" aria-label="Structures in the diagram">
        {practice.structures.map((item, index) => <button key={item.id} type="button"
          aria-pressed={selected === index && (!identify || attempt !== null)} onClick={() => choose(index)}>
          {index + 1}{identify ? " · Select marker" : ` · ${item.name}`}
        </button>)}
      </div>
      <div className="thorax-structure-detail" role="status" aria-live="polite">
        {!identify || attempt !== null ? <>
          <p><strong>{identify ? (found ? "Correct. " : "Try another marker. ") : ""}{structure.name}</strong></p>
          <p>{structure.description}</p>
          <p className="thorax-connection">{structure.connection}</p>
        </> : <p>Select the marker that matches the requested structure. Labels stay hidden until you try.</p>}
      </div>
      {identify && found ? <button className="button button-secondary" type="button" onClick={() => {
        if (finished) startIdentification();
        else { setStep((previous) => previous + 1); setAttempt(null); }
      }}>{finished ? "Try the identification round again" : "Next structure"}</button> : null}
      <div className="thorax-breathing">
        <h5>Connect the image to breathing</h5>
        <button type="button" className="button button-secondary" aria-pressed={inspiration} onClick={() => setInspiration((previous) => !previous)}>
          {inspiration ? "Show relaxed diaphragm" : "Show diaphragm during inspiration"}
        </button>
        <p aria-live="polite">{inspiration
          ? "Inspiration: the diaphragm contracts and its domes descend, increasing the vertical dimension of the chest. The image changes only the diaphragm to isolate this movement."
          : "Relaxed position: the diaphragm is dome-shaped. During quiet expiration, relaxation and elastic recoil allow the domes to rise."}</p>
      </div>
    </section>
  );
}
