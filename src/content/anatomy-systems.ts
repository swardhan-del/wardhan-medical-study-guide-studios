import type { CheckpointDefinition } from "../lib/conceptual-checkpoint.ts";
import type { PracticeItem } from "./practice-registry.ts";

export const anatomySystemsPath = "/learn/anatomy-systems";

type Landmark = { name: string; x: number; y: number; detail: string };
type Choice = readonly [text: string, explanation: string];
type Question = {
  prompt: string;
  choices: readonly [Choice, Choice, Choice];
  answer: 0 | 1 | 2;
};
type System = {
  id: string;
  name: string;
  title: string;
  objective: string;
  view: string;
  observe: string;
  landmarks: readonly Landmark[];
  questions: readonly [Question, Question];
  recall: { prompt: string; model: string };
  source: { title: string; section: string };
  lesson: { id: string; title: string };
};

export const anatomySystems: readonly System[] = [
  {
    id: "integumentary",
    name: "Integumentary",
    title: "Skin layers and the surface barrier",
    objective: "Distinguish the skin’s outer barrier from the deeper layer that supports it.",
    view: "Schematic cross-section, with the outside of the body at the top. Layer thicknesses are exaggerated.",
    observe: "Start at the exposed surface and move down. Which layer contains the vessel shown?",
    landmarks: [
      { name: "Epidermis", x: 78, y: 73, detail: "The superficial epithelial layer forms the surface barrier. It has no blood vessels." },
      { name: "Dermis", x: 211, y: 130, detail: "This connective-tissue layer supports the epidermis and contains vessels and sensory structures." },
      { name: "Hypodermis", x: 281, y: 194, detail: "Subcutaneous connective tissue deep to the dermis often contains fat. It underlies the skin proper." },
    ],
    questions: [
      { prompt: "Which layer in the diagram is epithelial and avascular?", choices: [["Dermis", "The dermis is connective tissue and contains vessels."], ["Epidermis", "The epidermis is the outer epithelial layer and has no vessels."], ["Hypodermis", "The hypodermis lies below the skin and contains connective tissue." ]], answer: 1 },
      { prompt: "A section shows a small blood vessel immediately below the epidermis. Which labelled layer contains it?", choices: [["Dermis", "The superficial dermis lies directly beneath the epidermis and contains capillaries."], ["Epidermis", "Vessels do not enter the epidermal epithelium."], ["Hypodermis", "The hypodermis lies beneath the dermis, farther from the surface."]], answer: 0 },
    ],
    recall: { prompt: "Explain why the surface barrier can be avascular even though the tissue below it contains vessels.", model: "The epidermis forms the barrier. Living epidermal cells receive nutrients by diffusion from vessels in the underlying dermis." },
    source: { title: "Layers of the Skin", section: "5-1-layers-of-the-skin" },
    lesson: { id: "epithelia", title: "Epithelia and glands" },
  },
  {
    id: "skeletal",
    name: "Skeletal",
    title: "The bones around the knee",
    objective: "Locate the femur, tibia and patella and distinguish their roles at the knee.",
    view: "Simplified anterior view of the knee. The fibula, cartilage and soft tissues are omitted.",
    observe: "Compare the two long bones with the small bone that sits in front of the joint.",
    landmarks: [
      { name: "Femur", x: 137, y: 80, detail: "The thigh bone meets the tibia at its distal end and also articulates with the patella." },
      { name: "Patella", x: 215, y: 123, detail: "This sesamoid bone lies within the quadriceps tendon, in front of the knee joint." },
      { name: "Tibia", x: 140, y: 181, detail: "The tibia receives load from the femur and is the main weight-bearing bone of the leg." },
    ],
    questions: [
      { prompt: "Which pair forms the main weight-bearing articulation of the knee?", choices: [["Femur and patella", "These bones articulate, but this is the patellofemoral part of the knee."], ["Femur and tibia", "The distal femur articulates with the proximal tibia to transmit load."], ["Patella and tibia", "The patellar ligament joins these structures, but they do not form the main weight-bearing articulation."]], answer: 1 },
      { prompt: "On a side view, a small bone lies anterior to the distal femur. Which labelled bone is it?", choices: [["Tibia", "The tibia lies inferior to the femur and is a long bone."], ["Femur", "The femur is the thigh bone itself."], ["Patella", "The patella is positioned anterior to the distal femur."]], answer: 2 },
    ],
    recall: { prompt: "Describe the knee’s main bony articulation and the separate position of the patella.", model: "The distal femur meets the proximal tibia. The patella lies anterior to this joint and articulates with the femur." },
    source: { title: "Anatomy of Selected Synovial Joints", section: "9-6-anatomy-of-selected-synovial-joints" },
    lesson: { id: "knee-joint-mechanics", title: "Knee ligaments, menisci and movement" },
  },
  {
    id: "muscular",
    name: "Muscular",
    title: "How biceps pulls the forearm",
    objective: "Connect muscle shortening, the tendon attachment and elbow flexion.",
    view: "Simplified side view of a flexed elbow. Other muscles and most bony details are omitted.",
    observe: "Follow the pull from the muscle belly to the forearm attachment and compare it with the elbow pivot.",
    landmarks: [
      { name: "Biceps belly", x: 122, y: 75, detail: "The biceps brachii develops tension. When it shortens against a manageable load, it can help flex the elbow." },
      { name: "Elbow joint", x: 116, y: 182, detail: "The elbow is the pivot for flexion in this view. Other elbow flexors also contribute to the movement." },
      { name: "Radial attachment", x: 217, y: 157, detail: "The distal biceps tendon pulls on the radial tuberosity. The attachment is on the forearm side of the elbow." },
    ],
    questions: [
      { prompt: "Which structure carries biceps force to the radius?", choices: [["Distal biceps tendon", "The tendon transmits tension from the muscle to the radial tuberosity."], ["Elbow joint cavity", "The joint permits movement, but the tendon transmits the pull."], ["Radius marrow", "The tendon attaches to the bone surface, not the marrow."]], answer: 0 },
      { prompt: "The forearm moves toward the upper arm as the biceps shortens. Which movement is this?", choices: [["Extension", "Extension increases the angle from the flexed position."], ["Flexion", "Flexion decreases the angle between upper arm and forearm."], ["Pronation", "Pronation rotates the forearm rather than changing the elbow flexion angle."]], answer: 1 },
    ],
    recall: { prompt: "Explain how the same biceps can hold a forearm still or help move it.", model: "Biceps tension is transmitted to the radius by the tendon. It can balance the external load without movement or help shorten the angle at the elbow when the net moment favours flexion." },
    source: { title: "Muscles of the Pectoral Girdle and Upper Limbs", section: "11-5-muscles-of-the-pectoral-girdle-and-upper-limbs" },
    lesson: { id: "arm-elbow", title: "Arm compartments and elbow relationships" },
  },
  {
    id: "nervous",
    name: "Nervous",
    title: "A spinal reflex and its directions",
    objective: "Distinguish sensory input to the spinal cord from motor output to muscle.",
    view: "Circuit diagram for a simplified stretch reflex. Arrows show signal direction, not physical distance.",
    observe: "Trace one arrow into the cord and the other out. Where does the direction change?",
    landmarks: [
      { name: "Sensory fibre", x: 91, y: 86, detail: "Stretch activates a muscle spindle. Its sensory fibre carries the signal towards the spinal cord." },
      { name: "Spinal cord", x: 187, y: 74, detail: "For the basic stretch reflex, the sensory fibre can excite a motor neuron that supplies the same muscle." },
      { name: "Motor fibre", x: 275, y: 163, detail: "The motor neuron carries output away from the cord to the muscle. This output can produce contraction." },
    ],
    questions: [
      { prompt: "Which labelled path carries information from the spindle to the spinal cord?", choices: [["Motor fibre", "The motor fibre carries output away from the cord."], ["Sensory fibre", "The sensory fibre carries the spindle signal toward the spinal cord."], ["Muscle tendon", "A tendon transmits mechanical force. It does not carry this nerve impulse."]], answer: 1 },
      { prompt: "Sensory input reaches the cord, but motor output cannot reach the muscle. What is missing from the reflex?", choices: [["The initial stretch", "The question specifies that the stretch signal reached the cord."], ["The sensory input", "That part of the circuit still functions in this example."], ["The signal that makes the muscle contract", "The reflex requires a motor output from the spinal cord to the muscle."]], answer: 2 },
    ],
    recall: { prompt: "Explain why a stretch reflex can be organised without waiting for a voluntary response.", model: "The spindle afferent enters the spinal cord and can excite the motor neuron supplying the stretched muscle there. A voluntary command from the brain is unnecessary for this basic circuit." },
    source: { title: "Motor Responses", section: "14-3-motor-responses" },
    lesson: { id: "spinal-cord-tracts", title: "Spinal cord tracts" },
  },
  {
    id: "endocrine",
    name: "Endocrine",
    title: "The thyroid axis and feedback",
    objective: "Trace three levels of the thyroid axis and identify the direction of negative feedback.",
    view: "Signal diagram. Solid arrows show stimulation and the dashed return path shows negative feedback.",
    observe: "Trace TRH and TSH down the chain. Then follow the dashed path back from thyroid hormone.",
    landmarks: [
      { name: "Hypothalamus", x: 114, y: 49, detail: "Hypothalamic TRH stimulates TSH release from the anterior pituitary." },
      { name: "Anterior pituitary", x: 114, y: 119, detail: "Pituitary TSH stimulates the thyroid gland to make and release thyroid hormone." },
      { name: "Thyroid gland", x: 114, y: 188, detail: "Thyroid hormones exert negative feedback at the hypothalamus and anterior pituitary." },
    ],
    questions: [
      { prompt: "Which labelled structure releases TSH?", choices: [["Thyroid gland", "The thyroid responds to TSH and releases thyroid hormones."], ["Hypothalamus", "The hypothalamus supplies TRH to regulate TSH release."], ["Anterior pituitary", "Anterior pituitary thyrotrophs release TSH."]], answer: 2 },
      { prompt: "If thyroid hormone rises in the intact simplified axis, what direction does the feedback drive TSH?", choices: [["Down", "More thyroid hormone suppresses pituitary TSH through negative feedback."], ["Up", "That would amplify the initial rise rather than oppose it."], ["It leaves TSH unregulated", "TSH is one of the upstream signals regulated by thyroid-hormone feedback."]], answer: 0 },
    ],
    recall: { prompt: "Explain how the thyroid gland can influence the upstream signal that stimulates it.", model: "Thyroid hormone feeds back on the anterior pituitary and hypothalamus. It reduces upstream drive, including TSH, when thyroid hormone availability rises." },
    source: { title: "The Thyroid Gland", section: "17-4-the-thyroid-gland" },
    lesson: { id: "endocrine-feedback", title: "Endocrine feedback" },
  },
  {
    id: "cardiovascular",
    name: "Cardiovascular",
    title: "Two circuits through one heart",
    objective: "Trace blood through the right heart, lungs, left heart and body.",
    view: "Flow diagram showing circuit order. Box positions do not represent anatomical left and right.",
    observe: "Follow the arrows from the right heart. Find where the route switches from pulmonary to systemic circulation.",
    landmarks: [
      { name: "Right heart", x: 72, y: 82, detail: "The right atrium receives systemic venous blood. The right ventricle sends it towards the lungs." },
      { name: "Lungs", x: 251, y: 82, detail: "Blood reaches the lungs via pulmonary arteries and returns to the left atrium via pulmonary veins." },
      { name: "Left heart", x: 251, y: 172, detail: "The left atrium receives pulmonary venous blood. The left ventricle sends it into the aorta." },
      { name: "Body tissues", x: 72, y: 172, detail: "Systemic circulation delivers blood to tissues and returns it through systemic veins to the right heart." },
    ],
    questions: [
      { prompt: "Which labelled station receives blood directly from the lungs?", choices: [["Right heart", "The right heart receives blood returning from the systemic circuit."], ["Body tissues", "Pulmonary venous blood passes through the left heart before reaching systemic tissues."], ["Left heart", "Pulmonary veins deliver blood to the left atrium."]], answer: 2 },
      { prompt: "A vessel carries blood away from the right ventricle towards the lungs. Why is it an artery?", choices: [["It always carries oxygen-rich blood", "Pulmonary arteries normally carry relatively oxygen-poor blood."], ["It carries blood away from the heart", "Arteries are classified by flow away from the heart, regardless of oxygen content."], ["It carries blood back from the lungs", "That describes the pulmonary veins."]], answer: 1 },
    ],
    recall: { prompt: "Trace one complete circuit starting with the right ventricle. Name the two sites that the heart sends blood to.", model: "The right ventricle sends blood to the lungs. Pulmonary veins return it to the left heart. The left ventricle sends it to systemic tissues, and systemic veins return it to the right heart." },
    source: { title: "Heart Anatomy", section: "19-1-heart-anatomy" },
    lesson: { id: "heart-chambers-surfaces", title: "Heart chambers and surfaces" },
  },
  {
    id: "lymphatic",
    name: "Lymphatic and immune",
    title: "From tissue fluid to venous blood",
    objective: "Trace lymph from a tissue space through a lymph node and back to the veins.",
    view: "Pathway schematic showing one drainage route. Most lymph vessels and ducts are omitted.",
    observe: "Trace the route from a tissue space. Which station samples what has drained from the tissue?",
    landmarks: [
      { name: "Tissue fluid", x: 60, y: 144, detail: "Fluid between cells can enter blind-ended lymphatic capillaries. Once inside, it is called lymph." },
      { name: "Lymph node", x: 171, y: 117, detail: "Collecting vessels bring lymph into a node. Within the node, immune cells can encounter material carried in the lymph." },
      { name: "Venous return", x: 284, y: 75, detail: "Lymph ultimately returns to venous blood through ducts near the junctions of the internal jugular and subclavian veins." },
    ],
    questions: [
      { prompt: "Which labelled structure samples material carried in lymph along this route?", choices: [["Lymph node", "The lymph node provides an organised site for immune surveillance of incoming lymph."], ["Vein", "The vein receives returning fluid downstream."], ["Tissue space", "Fluid in the tissue space has not yet entered the lymphatic pathway."]], answer: 0 },
      { prompt: "What can happen locally if lymph drainage is persistently impaired?", choices: [["Tissue fluid may accumulate", "Lymphatic vessels normally return excess interstitial fluid to the circulation."], ["Fluid must enter tissues more slowly", "Impaired drainage does not itself slow capillary filtration."], ["The node becomes an arterial pump", "A node is a filtering and immune organ, not a pump for arterial blood."]], answer: 0 },
    ],
    recall: { prompt: "Explain how this pathway connects fluid balance with immune surveillance.", model: "Lymphatics collect fluid from tissue spaces and eventually return it to veins. Nodes on the route expose immune cells to material that drained from those tissues." },
    source: { title: "Anatomy of the Lymphatic and Immune Systems", section: "21-1-anatomy-of-the-lymphatic-and-immune-systems" },
    lesson: { id: "lymphoid-organs", title: "Lymph node, spleen and thymus" },
  },
  {
    id: "respiratory",
    name: "Respiratory",
    title: "From conducting airway to exchange surface",
    objective: "Distinguish conducting airways from the alveolar region where gas exchange occurs.",
    view: "Simplified frontal airway tree with an enlarged terminal region. The alveoli are drawn much larger than scale.",
    observe: "Follow the trachea into the branching airways. Find where air finally reaches an exchange surface.",
    landmarks: [
      { name: "Trachea", x: 148, y: 55, detail: "The trachea conducts air towards the two main bronchi. It is not an alveolar exchange surface." },
      { name: "Bronchial branches", x: 109, y: 132, detail: "The branching airways distribute air through the lungs. Gas exchange begins in the respiratory zone farther downstream." },
      { name: "Alveoli", x: 283, y: 178, detail: "Thin alveolar walls lie close to pulmonary capillaries, providing a short diffusion path for gases." },
    ],
    questions: [
      { prompt: "Where does the diagram place the principal gas-exchange surface?", choices: [["Trachea", "The trachea conducts air."], ["Alveoli", "Alveoli place air close to capillary blood across a thin barrier."], ["Main bronchi", "The main bronchi distribute air to the lungs rather than exchanging gas directly."]], answer: 1 },
      { prompt: "A small conducting airway is blocked. What changes first for the alveoli beyond it?", choices: [["They receive less fresh air", "The airway supplies ventilation to structures beyond the obstruction."], ["They lose their capillaries immediately", "An airway blockage does not directly remove pulmonary vessels."], ["They become larger conducting airways", "Their location and exchange function do not change into those of a bronchus."]], answer: 0 },
    ],
    recall: { prompt: "Explain why moving air into a main bronchus alone is insufficient for gas exchange.", model: "The bronchus is a conducting passage. Fresh air must reach the respiratory zone, where alveolar surfaces place it close to pulmonary capillary blood." },
    source: { title: "Organs and Structures of the Respiratory System", section: "22-1-organs-and-structures-of-the-respiratory-system" },
    lesson: { id: "lung-roots-bronchi", title: "Lung roots and bronchi" },
  },
  {
    id: "digestive",
    name: "Digestive",
    title: "The digestive tract from stomach to colon",
    objective: "Follow the route of digestive contents and distinguish the jobs of three regions.",
    view: "Simplified anterior abdominal view. The small intestine is represented by a short loop.",
    observe: "Trace the route from the stomach into the small intestine. Find the frame of colon around it.",
    landmarks: [
      { name: "Stomach", x: 224, y: 70, detail: "The stomach receives food, mixes it with gastric secretions and passes chyme into the duodenum." },
      { name: "Small intestine", x: 177, y: 149, detail: "The duodenum is its first segment. Most digestion and nutrient absorption occur in the small intestine." },
      { name: "Colon", x: 65, y: 167, detail: "The colon receives contents after the ileum and absorbs remaining water and electrolytes." },
    ],
    questions: [
      { prompt: "Which labelled structure receives chyme from the stomach?", choices: [["Colon", "The colon is reached after contents pass through the small intestine."], ["Small intestine", "Chyme enters the duodenum, the first part of the small intestine."], ["Stomach", "The stomach forms and releases chyme into the next region."]], answer: 1 },
      { prompt: "In which labelled region are most nutrients absorbed?", choices: [["Colon", "The colon absorbs remaining water and electrolytes and can absorb some microbial products."], ["Stomach", "The stomach mixes contents and begins some digestion, with limited absorption."], ["Small intestine", "Its large surface area supports most nutrient absorption."]], answer: 2 },
    ],
    recall: { prompt: "Trace food contents through the three labelled regions and give one job for each.", model: "The stomach mixes and releases chyme. The small intestine completes most digestion and absorbs most nutrients. The colon receives what remains and absorbs water and electrolytes." },
    source: { title: "The Small and Large Intestines", section: "23-5-the-small-and-large-intestines" },
    lesson: { id: "small-intestine-mesentery", title: "Small intestine and mesentery" },
  },
  {
    id: "urinary",
    name: "Urinary",
    title: "From kidneys to the outside",
    objective: "Distinguish the organs that form, transport, store and release urine.",
    view: "Simplified anterior view. Kidney and bladder sizes are exaggerated and nearby vessels are omitted.",
    observe: "Follow the paired tubes into the bladder. Compare them with the single outlet below it.",
    landmarks: [
      { name: "Kidneys", x: 80, y: 69, detail: "The kidneys form urine. It collects in the renal pelvis before entering each ureter." },
      { name: "Ureters", x: 121, y: 124, detail: "Each ureter conveys urine from a kidney to the bladder by muscular contractions." },
      { name: "Bladder", x: 176, y: 171, detail: "The bladder stores urine before voiding." },
      { name: "Urethra", x: 175, y: 220, detail: "The urethra is the outlet from the bladder to the outside." },
    ],
    questions: [
      { prompt: "Which labelled tube connects a kidney to the bladder?", choices: [["Urethra", "The urethra leads out of the bladder."], ["Ureter", "A ureter carries urine from its kidney to the bladder."], ["Renal artery", "The renal artery supplies blood to the kidney and does not drain urine."]], answer: 1 },
      { prompt: "A drop of urine has just left the bladder during voiding. Which labelled structure is it in now?", choices: [["Renal pelvis", "The renal pelvis collects urine upstream in the kidney."], ["Ureter", "Ureters carry urine into the bladder."], ["Urethra", "Voiding passes urine from the bladder through the urethra."]], answer: 2 },
    ],
    recall: { prompt: "Give one job for the kidney, ureter, bladder and urethra in order.", model: "The kidney forms urine. The ureter transports it to the bladder, where it is stored. The urethra provides the outlet from the bladder." },
    source: { title: "Gross Anatomy of Urine Transport", section: "25-2-gross-anatomy-of-urine-transport" },
    lesson: { id: "pelvis-urinary-route", title: "Pelvic urinary route" },
  },
  {
    id: "reproductive",
    name: "Reproductive",
    title: "Compare two gamete pathways",
    objective: "Trace the selected ovarian and testicular routes and distinguish sites of production and transport.",
    view: "Two separate pathway schematics. Selected stages are shown, with no shared anatomical scale.",
    observe: "Compare where each route begins and which tube carries the cell onward.",
    landmarks: [
      { name: "Ovary", x: 80, y: 66, detail: "Ovulation releases an oocyte from the ovary. The oocyte can enter the uterine tube via the fimbrial end." },
      { name: "Uterine tube", x: 80, y: 168, detail: "The tube carries the oocyte toward the uterus. Fertilisation most often occurs in its ampulla." },
      { name: "Testis and epididymis", x: 248, y: 66, detail: "Sperm are produced in the testis and mature during passage through the epididymis." },
      { name: "Ductus deferens", x: 248, y: 168, detail: "The ductus deferens carries sperm away from the epididymis towards the ejaculatory duct." },
    ],
    questions: [
      { prompt: "Which labelled structure contains the usual site of fertilisation?", choices: [["Ovary", "The ovary releases the oocyte. Fertilisation usually occurs after it enters the tube."], ["Uterine tube", "The ampulla of the uterine tube is the usual site."], ["Ductus deferens", "The ductus deferens is part of the sperm transport pathway."]], answer: 1 },
      { prompt: "Which labelled passage continues from the epididymis towards the ejaculatory duct?", choices: [["Ductus deferens", "The ductus deferens connects the epididymis to the downstream ejaculatory pathway."], ["Uterine tube", "The uterine tube is part of the ovarian route."], ["Seminiferous tubules", "Sperm are produced there, before passing through the epididymis."]], answer: 0 },
    ],
    recall: { prompt: "Compare the first transport passage shown on each side and the structure it follows.", model: "After ovulation from the ovary, an oocyte can enter the uterine tube. After sperm production in the testis and passage through the epididymis, sperm can enter the ductus deferens." },
    source: { title: "Anatomy and Physiology of the Ovarian Reproductive System", section: "27-2-anatomy-and-physiology-of-the-ovarian-reproductive-system" },
    lesson: { id: "ovary-uterine-tube", title: "Ovary and uterine tube" },
  },
];

const testicularReproductiveSource = {
  title: "Anatomy and Physiology of the Testicular Reproductive System",
  url: "https://openstax.org/books/anatomy-and-physiology-2e/pages/27-1-anatomy-and-physiology-of-the-testicular-reproductive-system",
};

export function anatomySystemSources(system: System) {
  const source = {
    title: "OpenStax · " + system.source.title,
    url: "https://openstax.org/books/anatomy-and-physiology-2e/pages/" + system.source.section,
    basis: "textbook-based" as const,
  };
  return system.id === "reproductive" ? [source, { ...testicularReproductiveSource, title: "OpenStax · " + testicularReproductiveSource.title, basis: "textbook-based" as const }] : [source];
}

export function anatomySystemHref(id: string) {
  return anatomySystemsPath + "/" + id;
}

function anatomySystemCheckpoints(system: System): CheckpointDefinition[] {
  const lesson = "anatomy-system-" + system.id;
  const metadata = {
    subject: "anatomy", lesson, topic: system.name + " system", subtopic: system.title,
    concept: lesson, sources: anatomySystemSources(system), prerequisites: [],
  };
  return [
    ...system.questions.map((question, index): CheckpointDefinition => ({
      id: lesson + "-" + (index + 1), type: "single",
      prompt: question.prompt, answer: question.answer,
      options: question.choices.map(([text, explanation]) => ({ text, explanation })),
      mechanism: question.choices[question.answer][1],
      metadata: { ...metadata, difficulty: index === 0 ? "introductory" : "applied" },
    })),
    {
      id: lesson + "-recall", type: "self-review",
      ...system.recall, mechanism: system.recall.model,
      metadata: { ...metadata, difficulty: "applied" },
    },
  ];
}

export function anatomySystemPractice(system: System): PracticeItem[] {
  return anatomySystemCheckpoints(system).map(checkpoint => ({
    id: checkpoint.id,
    topic: checkpoint.metadata.lesson,
    title: system.title,
    subject: "anatomy",
    href: anatomySystemHref(system.id) + "#question-" + checkpoint.id,
    prompt: checkpoint.prompt,
    checkpoint,
  }));
}
