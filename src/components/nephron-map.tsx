"use client";
import { useState } from "react";

export function NephronMap() {
  const [labels, setLabels] = useState(true);
  return (
    <section className="nephron-panel" aria-labelledby="nephron-title">
      <p className="eyebrow">See the location. Follow the route.</p>
      <h2 id="nephron-title">Blood and filtrate take different paths</h2>
      <p>
        A simplified long-loop nephron. Red arrows follow blood; blue arrows
        follow tubular fluid. Dotted arrows show exchange between the two
        routes.
      </p>
      <button
        className="button button-secondary"
        aria-pressed={!labels}
        onClick={() => setLabels(!labels)}
      >
        {labels ? "Hide labels for recall" : "Show labels"}
      </button>
      <p className="nephron-mobile-hint">
        On a small screen, swipe across the diagram to read the full-size
        labels. Keyboard users can focus the diagram and use arrow keys.
      </p>
      <figure
        className="nephron-figure"
        tabIndex={0}
        role="group"
        aria-label="Scrollable nephron diagram"
      >
        <svg
          viewBox="0 0 600 750"
          role="img"
          aria-labelledby="nephron-svg-title nephron-svg-desc"
        >
          <title id="nephron-svg-title">
            Nephron: blood and tubular-fluid pathways
          </title>
          <desc id="nephron-svg-desc">
            {labels
              ? "In the cortex, afferent blood enters the glomerulus and leaves through the efferent arteriole to a second capillary bed. Filtrate enters Bowman space, proximal tubule, descending and ascending limbs in the medulla, distal tubule in the cortex, then the collecting system. Reabsorption returns material to blood; secretion transfers material into the tubule."
              : "Recall view: name the red blood vessels and blue tubular segments using their positions in the cortex and medulla. Show labels to reveal the answer."}
          </desc>
          <defs>
            <marker
              id="blood-arrow"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto"
            >
              <path d="M0 0 L10 5 L0 10Z" fill="#9c3536" />
            </marker>
            <marker
              id="fluid-arrow"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto"
            >
              <path d="M0 0 L10 5 L0 10Z" fill="#096a91" />
            </marker>
          </defs>
          <rect width="600" height="340" rx="12" fill="#faf1df" />
          <rect y="340" width="600" height="410" rx="12" fill="#e6eff0" />
          <path d="M0 340 H600" stroke="#687778" strokeDasharray="7 5" />
          <g fontSize="20" fontWeight="700" fill="#233a40">
            <text x="18" y="32">
              CORTEX
            </text>
            <text x="18" y="375">
              MEDULLA
            </text>
          </g>
          <g fill="none" strokeWidth="7" strokeLinecap="round">
            <path
              d="M30 115 H116"
              stroke="#9c3536"
              markerEnd="url(#blood-arrow)"
            />
            <circle cx="153" cy="126" r="49" stroke="#096a91" strokeWidth="4" />
            <path
              d="M125 117 C135 88 178 94 177 124 C166 150 127 143 135 114 C152 95 178 115 157 140"
              stroke="#9c3536"
            />
            <path
              d="M181 116 H305"
              stroke="#9c3536"
              markerEnd="url(#blood-arrow)"
            />
            <path
              d="M318 120 C357 163 278 176 318 206 C357 239 278 252 318 280"
              stroke="#9c3536"
            />
            <path
              d="M318 286 V316 H370 V199"
              stroke="#9c3536"
              strokeWidth="4"
              markerEnd="url(#blood-arrow)"
            />
            <path
              d="M150 176 V210 C85 206 83 264 148 266 C207 270 202 216 243 250 V505 C243 588 375 588 375 505 V269 C388 233 425 240 434 278 H510 V660"
              stroke="#096a91"
            />
            <path
              d="M150 177 V207"
              stroke="#096a91"
              markerEnd="url(#fluid-arrow)"
            />
            <path
              d="M243 364 V437"
              stroke="#096a91"
              markerEnd="url(#fluid-arrow)"
            />
            <path
              d="M375 438 V365"
              stroke="#096a91"
              markerEnd="url(#fluid-arrow)"
            />
            <path
              d="M510 470 V545"
              stroke="#096a91"
              markerEnd="url(#fluid-arrow)"
            />
            <path
              d="M265 242 L296 213"
              stroke="#9c3536"
              strokeWidth="3"
              strokeDasharray="5 5"
              markerEnd="url(#blood-arrow)"
            />
            <path
              d="M299 273 L266 294"
              stroke="#096a91"
              strokeWidth="3"
              strokeDasharray="5 5"
              markerEnd="url(#fluid-arrow)"
            />
            <path
              d="M510 674 V711"
              stroke="#096a91"
              markerEnd="url(#fluid-arrow)"
            />
          </g>
          {labels && (
            <g className="nephron-labels" fontSize="18" fill="#152e37">
              <text x="22" y="85">
                Afferent
              </text>
              <text x="108" y="61">
                Glomerulus
              </text>
              <text x="218" y="88">
                Efferent
              </text>
              <text x="17" y="185">
                Bowman space
              </text>
              <text x="16" y="300">
                Proximal tubule
              </text>
              <text x="380" y="210">
                Distal tubule
              </text>
              <text x="395" y="105">
                Second
              </text>
              <text x="395" y="129">
                capillary bed
              </text>
              <path d="M390 132 L337 162" stroke="#677" />
              <text x="105" y="426">
                Descending
              </text>
              <text x="171" y="450">
                limb
              </text>
              <text x="383" y="425">
                Ascending
              </text>
              <text x="383" y="449">
                limb
              </text>
              <text x="413" y="601">
                Collecting
              </text>
              <text x="447" y="625">
                duct
              </text>
              <text x="243" y="602">
                Loop of Henle
              </text>
              <text x="293" y="735">
                To calyces → renal pelvis
              </text>
            </g>
          )}
        </svg>
        <figcaption>
          Positions are simplified, not to scale. Distal fluid passes through a
          connecting tubule before the collecting duct. The second capillary bed
          is peritubular capillaries and, for long-loop nephrons, vasa recta;
          its full medullary course is omitted here.
        </figcaption>
      </figure>
      <div className="study-grid two">
        <p>
          <strong>Reabsorption:</strong> tubular fluid → blood.
        </p>
        <p>
          <strong>Secretion:</strong> blood → tubular fluid.
        </p>
      </div>
      <p>
        Check your map: trace both routes aloud, then explain where filtration
        separates them.{" "}
        <a
          className="text-link"
          href="https://www.niddk.nih.gov/health-information/kidney-disease/kidneys-how-they-work"
        >
          Reference: NIDDK, Your Kidneys & How They Work ↗
        </a>
      </p>
    </section>
  );
}
