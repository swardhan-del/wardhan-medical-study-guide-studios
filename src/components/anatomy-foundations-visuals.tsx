import type { ReactNode } from "react";
import { StudyVisual } from "./study-visual";
import styles from "./anatomy-foundations.module.css";
const root = "https://openstax.org/books/anatomy-and-physiology-2e/pages/";
const ink = "#14252c", tissue = "#d4ece8", plane = "#80551e";
function Drawing({ alt, height = 300, children }: { alt: string; height?: number; children: ReactNode }) {
  return <svg role="img" aria-label={alt} viewBox={`0 0 320 ${height}`} className={styles.drawing} xmlns="http://www.w3.org/2000/svg">{children}</svg>;
}
function Figure({ id, title, caption, observe, source = "1-6-anatomical-terminology", sourceTitle = "OpenStax 1.6: Anatomical Terminology", children }: { id: string; title: string; caption: string; observe: string; source?: string; sourceTitle?: string; children: ReactNode }) {
  return <StudyVisual className={styles.figure} data-anatomy-diagram={id} title={title} alt={caption} caption={caption} observe={observe}
    credit="Original teaching schematic © Wardhan Medical Study Guide Studios; AI-assisted SVG. Not to scale; not a specimen or diagnostic image. The reference publisher did not create this artwork."
    sources={[{title:sourceTitle,url:root+source}]}>{children}</StudyVisual>;
}
function FrontBody() {
  return <g fill={tissue} stroke={ink} strokeWidth="2.5">
    <circle cx="160" cy="52" r="24"/><path d="M147 76 V87 H125 L96 176 L111 181 L136 119 V177 L129 265 H151 L160 200 L169 265 H191 L184 177 V119 L209 181 L224 176 L195 87 H173 V76"/>
    <ellipse cx="102" cy="191" rx="10" ry="17"/><path d="M94 181 L83 188"/><ellipse cx="218" cy="191" rx="10" ry="17"/><path d="M226 181 L237 188"/>
  </g>;
}
function SideBody() {
  return <g fill={tissue} stroke={ink} strokeWidth="2.5"><path d="M147 30 Q174 20 182 43 L194 53 L181 57 L179 76 L165 80 L169 92 Q192 113 180 150 L181 179 L170 259 L193 267 L146 267 L147 183 Q130 159 138 115 L146 88 L146 76 Q127 57 136 41 Z"/></g>;
}
export function AnatomyVisualStudy() {
  return <section className={styles.visuals} aria-labelledby="visual-study-title">
    <h2 id="visual-study-title">Visual Study Prompts</h2>
    <p>Read the view label first, then explain the relationship before opening the questions. All essential relationships are also described in the text and captions.</p>
    <Figure id="position" title="1. Reference position and the subject’s side"
      caption="The anterior view faces the subject. The subject’s right is therefore on the viewer’s left. The lateral view faces forwards towards the right of this diagram. Hands and body proportions are simplified."
      observe="Locate the subject’s right hand. Explain why a change from standing to lying supine would not reverse the names anterior and posterior.">
      <div className={styles.panels}>
        <div><h4>Anterior view</h4><Drawing alt="Anterior anatomical-position schematic: the subject’s right is on the viewer’s left; palms face forwards and thumbs point laterally."><FrontBody/><path d="M90 100 L115 111 M230 100 L205 111" stroke={ink} strokeWidth="2"/><text x="18" y="97">Right</text><text x="252" y="97">Left</text><text x="62" y="296">Palms face forwards</text></Drawing><p>The thumbs point laterally. A side label refers to the subject, even when you face them.</p></div>
        <div><h4>Lateral view</h4><Drawing alt="Side view of the upright trunk: superior is towards the head, inferior towards the feet, anterior towards the face and posterior towards the back."><SideBody/><text x="115" y="18">Superior</text><text x="122" y="296">Inferior</text><text x="5" y="138">Posterior</text><path d="M97 132 H130" stroke={ink} strokeWidth="2"/><text x="211" y="138">Anterior</text><path d="M184 132 H205" stroke={ink} strokeWidth="2"/></Drawing><p>For the trunk, anterior faces forwards and posterior faces backwards. Depth is a different comparison: skin is superficial to the underlying muscle.</p></div>
      </div>
    </Figure>
    <Figure id="planes" title="2. Three planes, shown edge-on"
      caption="The brown lines show the edge of each imaginary plane where it meets the schematic body. They are not incisions or surface landmarks. The median and transverse planes are shown in an anterior view; the coronal plane is shown in a lateral view."
      observe="For each plane, name the two portions it separates. Explain why moving the median plane sideways creates a parasagittal plane rather than a coronal plane.">
      <div className={styles.panels}>
        <div><h4>Median: anterior view</h4><Drawing alt="A vertical line along the centre of an anterior body view represents the median plane, separating right and left portions."><FrontBody/><path d="M160 15 V282" stroke={plane} strokeWidth="5" strokeDasharray="9 4"/><text x="12" y="230">Right</text><text x="254" y="230">Left</text></Drawing><p><strong>Sagittal:</strong> right and left portions. Only the median plane lies at the midline.</p></div>
        <div><h4>Coronal: lateral view</h4><Drawing alt="A vertical line viewed from the side represents a coronal plane separating anterior and posterior portions of the body."><SideBody/><path d="M160 15 V282" stroke={plane} strokeWidth="5" strokeDasharray="9 4"/><text x="6" y="174">Posterior</text><text x="211" y="174">Anterior</text></Drawing><p><strong>Coronal or frontal:</strong> anterior and posterior portions.</p></div>
        <div><h4>Transverse: anterior view</h4><Drawing alt="A horizontal line across an anterior body view represents a transverse plane separating superior and inferior portions."><FrontBody/><path d="M48 155 H272" stroke={plane} strokeWidth="5" strokeDasharray="9 4"/><text x="12" y="138">Superior</text><text x="12" y="234">Inferior</text></Drawing><p><strong>Transverse:</strong> superior and inferior portions. An oblique plane is angled relative to the principal planes.</p></div>
      </div>
    </Figure>
    <Figure id="cavities" title="3. Map the body compartments"
      caption="These are organisational maps, not outlines of organ positions. The diaphragm separates thoracic and abdominopelvic compartments; the dashed abdominal–pelvic division represents continuity without a separating muscular wall."
      observe="Trace the posterior compartments separately from the anterior ones. Identify which boundary is the diaphragm and explain why the mediastinum is not a pleural cavity.">
      <div className={styles.panels}>
        <div><h4>Posterior (dorsal)</h4><Drawing alt="Posterior compartment map: the cranial cavity containing the brain communicates with the vertebral canal containing the spinal cord." height={250}>
          <rect x="15" y="15" width="290" height="90" rx="10" fill={tissue} stroke={ink} strokeWidth="2"/><text x="91" y="48">Cranial cavity</text><text x="133" y="81">Brain</text><path d="M160 105 V142" stroke={ink} strokeWidth="4"/><rect x="15" y="142" width="290" height="92" rx="10" fill={tissue} stroke={ink} strokeWidth="2"/><text x="79" y="178">Vertebral canal</text><text x="106" y="211">Spinal cord</text>
        </Drawing><p>The connecting line indicates continuity. These compartments also contain coverings and fluid; they are not serous cavities.</p></div>
        <div><h4>Anterior (ventral)</h4><Drawing alt="Anterior compartment map: thorax above the diaphragm, abdomen and pelvis below it. The abdomen and pelvis are continuous, shown by a dashed boundary." height={350}>
          <rect x="15" y="15" width="290" height="132" rx="10" fill={tissue} stroke={ink} strokeWidth="2"/><text x="126" y="46">Thorax</text><text x="35" y="80">Right and left pleural</text><text x="44" y="106">compartments; central</text><text x="95" y="132">mediastinum</text>
          <path d="M15 166 H305" stroke={plane} strokeWidth="5"/><text x="107" y="195">Diaphragm</text>
          <rect x="15" y="211" width="290" height="126" rx="10" fill="#f4e7d3" stroke={ink} strokeWidth="2"/><text x="118" y="246">Abdomen</text><path d="M25 271 H295" stroke={ink} strokeWidth="2" strokeDasharray="7 5"/><text x="135" y="312">Pelvis</text>
        </Drawing><p>The heart and its pericardial sac lie in the mediastinum. Abdominal and pelvic subdivisions together form the abdominopelvic compartment.</p></div>
      </div>
    </Figure>
    <Figure id="serous-space" title="4. A serous space is not an organ lumen" source="22-2-the-lungs" sourceTitle="OpenStax 22.2: The Lungs — pleura"
      caption="This flat conceptual section crosses a small area of the pleural interface. The potential space is exaggerated to make its boundaries visible. It normally contains a thin fluid film; the lung surface lies on the visceral side."
      observe="Trace from chest wall to lung. Where would fluid between pleural layers lie, and why would this differ from material inside an airway?">
      <Drawing alt="Pleural interface in order: chest wall, parietal pleura, pleural cavity, visceral pleura, then lung. The pleural gap is exaggerated and is separate from an airway lumen." height={310}>
        <rect x="10" y="10" width="300" height="55" fill="#f4e7d3"/><text x="106" y="45">Chest wall</text>
        <path d="M10 72 H310" stroke={ink} strokeWidth="5"/><text x="91" y="101">Parietal pleura</text>
        <rect x="10" y="116" width="300" height="55" fill="#e5f1f8" stroke={ink} strokeDasharray="6 4"/><text x="93" y="149">Pleural cavity</text>
        <text x="91" y="198">Visceral pleura</text><path d="M10 214 H310" stroke={ink} strokeWidth="5"/>
        <rect x="10" y="224" width="300" height="70" fill={tissue}/><text x="100" y="263">Lung surface</text>
      </Drawing>
      <p>The two pleural layers are continuous around the lung root, which is outside this small field. The airway lumen is inside the respiratory tract and is not drawn here.</p>
    </Figure>
    <Figure id="organisation" title="5. Several tissues contribute to one organ" source="23-4-the-stomach" sourceTitle="OpenStax 23.4: The Stomach"
      caption="The gastric-wall sketch groups tissue contributions to explain organisation. It omits the detailed mucosal layers, vessels, muscle-layer orientations and serosa; it is not a complete section for tissue identification."
      observe="Explain why an intact lining does not guarantee normal mixing if muscle function changes. Then distinguish a smooth-muscle cell, muscle tissue, the stomach and the digestive system.">
      <Drawing alt="Simplified stomach wall: lumen next to an epithelial lining, supporting connective tissue, muscle bands and a nerve plexus between muscle bands. Multiple tissue families contribute to one organ." height={325}>
        <text x="127" y="24">Lumen</text><path d="M20 45 H300" stroke={ink} strokeWidth="2"/>
        {Array.from({length:14},(_,i)=><rect key={i} x={20+i*20} y="47" width="20" height="30" fill={tissue} stroke={ink} strokeWidth="1.5"/>)}
        <text x="75" y="104">Epithelial lining</text>
        <rect x="20" y="117" width="280" height="49" fill="#f4e7d3" stroke={ink} strokeWidth="2"/><text x="71" y="149">Connective support</text>
        <rect x="20" y="181" width="280" height="30" fill="#e6dcef" stroke={ink} strokeWidth="2"/>
        <path d="M30 229 H290 M95 229 L78 219 M201 229 L220 239" stroke={ink} strokeWidth="3"/><circle cx="146" cy="229" r="6" fill={ink}/>
        <rect x="20" y="246" width="280" height="30" fill="#e6dcef" stroke={ink} strokeWidth="2"/><text x="27" y="309">Muscle with nervous tissue</text>
      </Drawing>
      <ul className={styles.legend}><li><strong>Epithelium:</strong> lining, barrier and glandular functions.</li><li><strong>Connective tissue:</strong> structural support and a route for vessels and nerves.</li><li><strong>Smooth muscle:</strong> force for mixing and propulsion.</li><li><strong>Nervous tissue:</strong> coordination; the branching line symbolises a nerve plexus between muscle layers.</li></ul>
      <p>A cell belongs to a tissue; several tissues form an organ; organs work together in a system. <a href={root + "1-2-structural-organization-of-the-human-body"}>Scientific reference for levels of organisation</a>.</p>
    </Figure>
  </section>;
}
