import styles from "./endocrine-development-map.module.css";

const maps: Record<string, { title: string; tracks: { label: string; stages: { label: string; question: string; explanation: string }[] }[] }> = {
  "pituitary-glandular-neural-orientation": {
    title: "Two origins, two routes to hormone release",
    tracks: [
      { label: "Oral ectoderm → glandular tissue", stages: [
        { label: "Rathke’s pouch", question: "Which connection is temporary?", explanation: "The pouch initially connects to the oral epithelium. That connection narrows and normally separates; it does not persist as an adult secretory duct." },
        { label: "Regional growth and differentiation", question: "Is a formed pouch already a mature gland?", explanation: "No. Growth, regional organization, endocrine differentiation and vascular integration are additional processes." },
        { label: "Local endocrine cells + portal regulation", question: "Who makes the anterior-pituitary hormone?", explanation: "Local endocrine cells make their own products. Hypothalamic regulatory signals reach them through the primary plexus, portal vessels and secondary vascular network." },
      ] },
      { label: "Diencephalic neuroectoderm → neural tissue", stages: [
        { label: "Downward neural extension", question: "Is neuroectoderm the same as neural crest?", explanation: "No. This component extends from the developing ventral diencephalon and remains continuous with the brain." },
        { label: "Hypothalamic cell body → axon", question: "Where is the peptide synthesized?", explanation: "Magnocellular neuronal cell bodies in the hypothalamus synthesize the precursors. Neurosecretory material travels along their axons." },
        { label: "Posterior terminals → blood", question: "What do local pituicytes contribute?", explanation: "They provide glial support. The axonal terminals store and release transported material; pituicytes are not the producing hypothalamic neurons." },
      ] },
    ],
  },
  "thyroid-parathyroid-pattern-reasoning": {
    title: "Follow movement before naming the adult position",
    tracks: [
      { label: "Median pharyngeal endoderm → follicular thyroid", stages: [
        { label: "Median thyroid primordium", question: "Where does the route begin?", explanation: "In the floor of the developing pharynx near the future foramen cecum. This is the follicular thyroid route, not the entire C-cell developmental account." },
        { label: "Descent + temporary thyroglossal tract", question: "What can a persistent tract help explain?", explanation: "A remnant or cyst along the developmental path. Position and differentiated hormone-producing capacity are separate properties." },
        { label: "Lobes, isthmus and polarized follicles", question: "Which surface faces the store?", explanation: "The apical surface faces thyroglobulin-rich colloid. The basal side faces basement membrane and the interstitial environment near capillaries." },
      ] },
      { label: "Pharyngeal pouch endoderm → parathyroids", stages: [
        { label: "Third and fourth pouch primordia", question: "Does pouch number directly determine adult height?", explanation: "No. The third-pouch parathyroids descend with the thymic primordia before separation; fourth-pouch parathyroids generally descend less." },
        { label: "Migration and separation", question: "Why can location vary?", explanation: "Differences in migration and separation can leave parathyroid tissue along the route, including near thymic structures." },
        { label: "Chief-cell differentiation and survival", question: "Does an early precursor guarantee a mature gland?", explanation: "No. Initial domain formation, completion of differentiation and survival are different developmental endpoints." },
      ] },
    ],
  },
  "adrenal-layers-signals-reasoning": {
    title: "Assemble one gland from distinct developmental lineages",
    tracks: [
      { label: "Mesodermal field → adrenal cortex", stages: [
        { label: "Cortical primordium", question: "Does this origin describe the whole gland?", explanation: "No. It describes the cortical lineage. Medullary, vascular and supporting populations must be considered separately." },
        { label: "Fetal and definitive compartments", question: "Is the fetal zone adult reticularis?", explanation: "No. Fetal cortical organization has its own steroid functions and undergoes substantial postnatal remodelling." },
        { label: "Later cortical zonation", question: "Why record age and species?", explanation: "Adult human zones develop over time, and common mouse models do not reproduce every human steroidogenic compartment." },
      ] },
      { label: "Neural crest → adrenal medulla", stages: [
        { label: "Neural-crest-derived precursor", question: "Can an intermediate state change the germ-layer origin?", explanation: "An intermediate can refine the route while retaining the same upstream ancestry." },
        { label: "Nerve-associated precursor contribution", question: "What is the evidence scope?", explanation: "Mouse lineage tracing supports a contribution from neural-crest-derived Schwann-cell precursors. This is not direct fate mapping of human embryos." },
        { label: "Chromaffin cells + neural input", question: "How does secretion differ from the cortex?", explanation: "Chromaffin cells store catecholamines in granules and receive preganglionic sympathetic input. Cortical cells use steroidogenic machinery and precursor lipid stores." },
      ] },
    ],
  },
};

export const hasEndocrineDevelopmentMap = (id: string) => Object.hasOwn(maps, id);

export function EndocrineDevelopmentMap({ lessonId }: { lessonId: string }) {
  const map = maps[lessonId];
  if (!map) return null;
  return <section className={`study-panel ${styles.map}`} aria-labelledby="endocrine-development-title">
    <p className="eyebrow">Trace development</p>
    <h2 id="endocrine-development-title">{map.title}</h2>
    <p>Follow each row in order. Predict the answer, then open a stage to compare your reasoning.</p>
    {map.tracks.map((track, i) => <div className={styles.track} key={track.label}>
      <h3>{track.label}</h3>
      <ol className={styles.stages} aria-label={track.label}>
        {track.stages.map((stage, j) => <li key={stage.label}>
          <details>
            <summary><span className={styles.number} aria-hidden="true">{j + 1}</span>{stage.label}</summary>
            <p><strong>{stage.question}</strong></p><p>{stage.explanation}</p>
          </details>
          {j < track.stages.length - 1 && <span className={styles.arrow} aria-hidden="true">→</span>}
        </li>)}
      </ol>
      {i === 0 && <p className={styles.distinction}>Keep the two routes distinct as you connect them to the adult organ.</p>}
    </div>)}
    <p className="muted-note">Original teaching schematic. These are selected relationships, not a scale drawing or a complete developmental timetable. Read the cited developmental sections for the evidence and species limits.</p>
  </section>;
}
