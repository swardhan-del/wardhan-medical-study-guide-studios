export function CardiacCycleDiagram() {
  return <figure className="study-panel" aria-labelledby="wiggers-caption">
    <svg viewBox="0 0 490 395" width="100%" role="img" aria-labelledby="wiggers-title wiggers-description">
      <title id="wiggers-title">Left heart events on a shared time axis</title>
      <desc id="wiggers-description">Mitral closure and S1 begin contraction at end-diastolic volume. Aortic opening begins ejection. Aortic closure and S2 begin relaxation at end-systolic volume. Mitral opening begins filling. The P wave precedes atrial contraction, QRS precedes ventricular contraction, and the T wave appears near the end of ejection.</desc>
      <g fill="none" stroke="#a2a2a2">
        <path d="M75 35V171H445M75 198V275H445M75 298V330H445M75 349H445" />
        <path strokeDasharray="4 5" d="M155 35V349M190 35V349M315 35V349M350 35V349" />
      </g>
      <g fill="none" strokeWidth="3">
        <path stroke="#923f2b" d="M75 87C108 92 150 97 190 100C215 76 231 54 255 53C278 53 301 61 315 70L320 75L327 71C368 80 410 85 445 91" />
        <path stroke="#1b5878" d="M75 159C95 159 130 145 155 151C172 140 184 116 190 100C216 67 233 52 254 52C278 52 304 58 315 71C326 103 341 145 350 155C370 160 406 158 445 155" />
        <path stroke="#6b477a" strokeDasharray="5 3" d="M75 155C105 155 120 135 134 146C145 152 156 147 169 149C192 155 211 156 236 155C278 151 315 142 350 155C381 168 415 157 445 155" />
        <path stroke="#1b5878" d="M75 251C103 251 113 212 155 212H190C222 215 268 258 315 258H350C367 235 401 220 445 220" />
        <path stroke="#2e6047" d="M75 320H100Q113 302 128 320H143L149 324L155 299L161 327L167 320H266Q283 297 300 320H445" />
      </g>
      <g fontSize="15" fill="currentColor">
        <text x="6" y="20">Pressure (mmHg)</text>
        <text x="35" y="58">120</text><text x="42" y="102">80</text>
        <text x="400" y="85" fill="#923f2b">Aorta</text><text x="370" y="138" fill="#1b5878">LV</text><text x="393" y="165" fill="#6b477a">LA</text>
        <text x="6" y="192">LV volume (mL)</text>
        <text x="35" y="218">130</text><text x="42" y="262">60</text>
        <text x="15" y="321">ECG</text><text x="108" y="308">P</text><text x="158" y="298">QRS</text><text x="277" y="305">T</text>
        <text x="10" y="354">Sound</text><text x="148" y="372">S1</text><text x="307" y="372">S2</text>
        <text x="180" y="390">Time through one beat →</text>
      </g>
    </svg>
    <figcaption id="wiggers-caption">
      <strong>Wiggers-style diagram of the left heart.</strong> LV = left ventricle. LA = left atrium. From left to right, the vertical lines mark mitral closure, aortic opening, aortic closure and mitral opening. Curves and timing are schematic.
      <p>Original diagram by Wardhan Medical Study Guide Studios. <a href="https://openstax.org/books/anatomy-and-physiology-2e/pages/19-3-cardiac-cycle">OpenStax cardiac cycle reference</a>.</p>
    </figcaption>
  </figure>;
}
