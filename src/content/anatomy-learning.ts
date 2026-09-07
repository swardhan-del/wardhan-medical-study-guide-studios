export type StudySource = { id: string; title: string; coverage: string };
export type StudyLesson = {
  id: string; title: string; explanation: string; points: string[];
  source: string; reference: string;
  question: string; options: string[]; answer: number; feedback: string;
  activity?: "thorax";
  related?: { href: string; label: string };
};
export type AnatomyLearningPage = {
  slug: string; title: string; description: string; introduction: string;
  image?: { src: string; alt: string; caption: string };
  sources: StudySource[]; lessons: StudyLesson[];
};

const volumeI = { id: "volume-i", title: "Volume I — Thorax, Heart, Lungs & Mediastinum", coverage: "Thoracic wall, diaphragm, pleura, lungs and mediastinal relationships. References below use the named sections of the curated manuscript." };
const volumeII = { id: "volume-ii", title: "Volume II — Abdomen, Digestive System & Peritoneum", coverage: "Abdominal topography, peritoneal spaces, digestive organs, vessels and digestive embryology. Topic numbers refer to the manuscript body; its contents list uses an earlier numbering sequence." };
const volumeIII = { id: "volume-iii", title: "Volume III — Pelvis, Perineum & Urogenital Anatomy", coverage: "Pelvic and perineal relationships, urinary and reproductive anatomy, and urogenital development." };
const volumeV = { id: "volume-v", title: "Volume V — Musculoskeletal System, Trunk, Limbs, Head & Neck, and Lymphatic Drainage", coverage: "Regional oral-exam study frameworks, musculoskeletal anatomy and general embryology. The source is the curated 53-page edition." };

export const anatomyLearningPages: AnatomyLearningPage[] = [
  {
    slug: "regional-anatomy", title: "Regional anatomy",
    description: "Connect the body’s regions through landmarks, boundaries and the structures that travel between them.",
    introduction: "Choose a region to see how its anatomy fits together. Each study note points to the relevant volume, and the related pages let you continue into more detail.",
    image: { src: "/images/anatomy/volume-5.png", alt: "Hip bones and landmarks shown from several anatomical views.", caption: "Hip bones and landmarks · STEM Visualizer collection" },
    sources: [volumeI, volumeII, volumeIII, volumeV],
    lessons: [
      { id: "chest", title: "Thorax", activity: "thorax", explanation: "Build a three-dimensional understanding of the chest: its protective wall, two pleural sacs, central mediastinum and muscular diaphragm. Explore their locations, connect structure with breathing, then test what you understand through image identification, twelve explained questions and four short-answer challenges.",
        points: ["Locate the sternum, ribs and thoracic vertebral column.", "Distinguish the pleural cavities from the central mediastinum.", "Use the diaphragm to connect thoracic and abdominal anatomy."],
        source: "volume-i", reference: "Thoracic Wall section, “Core Map”; Mediastinum section, “Definition of Mediastinum.”",
        question: "Which region lies between the right and left pleural cavities?", options: ["Mediastinum", "Peritoneal cavity", "Ischioanal fossa"], answer: 0,
        feedback: "The mediastinum is the central thoracic compartment between the pleural cavities.",
        related: { href: "/subjects/anatomy/thorax", label: "Continue to thorax anatomy" } },
      { id: "abdominal-region", title: "Abdomen", explanation: "Start with the surface map, then move inward through the abdominal wall and peritoneal relationships to the organs. Naming a region gives a structure a location; naming its relationships gives that location meaning.",
        points: ["Use either the four-quadrant or nine-region scheme consistently.", "Distinguish the abdominal wall from the peritoneal lining.", "Relate organs to their blood supply and neighboring structures."],
        source: "volume-ii", reference: "Part I, topic 1, “Abdominal Regions and Surface Planes”; Part II, topics 8–9.",
        question: "Which region is in the center of the nine-region abdominal map?", options: ["Epigastric", "Umbilical", "Left inguinal"], answer: 1,
        feedback: "The umbilical region occupies the center; the epigastric region is above it and the hypogastric region below.",
        related: { href: "/subjects/anatomy/abdomen", label: "Continue to abdominal anatomy" } },
      { id: "pelvic-region", title: "Pelvis & perineum", explanation: "Study the pelvis as a framework of bones, walls, floor and organ relationships. The perineal region adds spaces and neurovascular pathways that connect the pelvic outlet with the external anatomy.",
        points: ["Orient the pelvic brim, outlet and bony landmarks.", "Study the pelvic floor alongside the perineal spaces.", "Trace the pudendal pathway using its regional landmarks."],
        source: "volume-iii", reference: "Parts I and V — Pelvic framework; Perineum, Rectum and Anal Canal.",
        question: "Which volume focuses on pelvis, perineum and urogenital anatomy?", options: ["Volume I", "Volume II", "Volume III"], answer: 2,
        feedback: "Volume III is the dedicated pelvic and urogenital guide; Volume V adds pelvic-girdle and lower-limb anatomy.",
        related: { href: "/subjects/anatomy#volume-iii", label: "Explore the Volume III preview" } },
      { id: "limb-regions", title: "Limbs, head & neck", explanation: "Apply the same regional method to the limbs and the head and neck: identify boundaries and landmarks, then connect joints, muscles, nerves and vessels. For a canal or fossa, begin with its boundaries and contents.",
        points: ["Trace the upper limb from the shoulder girdle to the hand.", "Trace the lower limb from the pelvic girdle to the foot.", "Use Volume V’s skull, jaw and neck sections to extend the map."],
        source: "volume-v", reference: "“The Oral Exam Answer Formula”; Parts III–V, PDF pages 17–40.",
        question: "What is a useful starting point when describing a canal or fossa?", options: ["Boundaries and contents", "Only the longest muscle", "Only the skin surface"], answer: 0,
        feedback: "The source guide begins a canal or fossa answer with boundaries, contents and relationships.",
        related: { href: "/subjects/anatomy/musculoskeletal", label: "Continue to the musculoskeletal study map" } },
    ],
  },
  {
    slug: "thorax", title: "Thorax",
    description: "Explore the mediastinum, pleura and lungs through the Volume I study guide.",
    introduction: "Use the central compartments as your starting point, then compare the pleural layers and the right and left lungs. Select a topic and test the relationship you have just studied.",
    image: { src: "/images/anatomy/volume-1.png", alt: "Sagittal illustration of the mediastinum and surrounding thoracic structures.", caption: "Mediastinal compartments · STEM Visualizer collection" },
    sources: [volumeI],
    lessons: [
      { id: "mediastinum", title: "Mediastinal compartments", explanation: "The mediastinum lies between the pleural cavities. A transverse plane through the sternal angle and the T4–T5 intervertebral disc divides it into superior and inferior regions. The inferior mediastinum is subdivided into anterior, middle and posterior parts.",
        points: ["The sternum is anterior and the thoracic vertebral column posterior.", "The diaphragm forms the inferior boundary.", "Use the sternal angle as a surface landmark for the dividing plane."],
        source: "volume-i", reference: "Mediastinum section, topics 2–4: definition, divisions and sternal-angle plane.",
        question: "Which landmark helps separate the superior and inferior mediastinum?", options: ["Umbilicus", "Sternal angle", "Iliac crest"], answer: 1,
        feedback: "The sternal angle, at the approximate T4–T5 disc plane, marks this division." },
      { id: "pleura", title: "Pleura & pleural cavity", explanation: "Visceral pleura covers the lung surface and enters its fissures. Parietal pleura lines the surrounding thoracic boundaries. Between them is the pleural cavity, a potential space with a thin layer of serous fluid.",
        points: ["Visceral describes the layer directly covering the lung.", "Parietal describes the layer lining the wall and adjacent boundaries.", "Serous fluid reduces friction as the lung moves."],
        source: "volume-i", reference: "Pleura section, topics 24–27: overview, cavity, visceral and parietal pleura.",
        question: "Which pleural layer directly covers the lung surface?", options: ["Parietal pleura", "Peritoneum", "Visceral pleura"], answer: 2,
        feedback: "Visceral pleura covers the lung and extends into its fissures. Parietal pleura lines the surrounding boundaries." },
      { id: "lung-comparison", title: "Right versus left lung", explanation: "The right lung has superior, middle and inferior lobes separated by horizontal and oblique fissures. The left lung has superior and inferior lobes separated by an oblique fissure. Its lingula belongs to the superior lobe.",
        points: ["Right lung: three lobes and two fissures.", "Left lung: two lobes and one fissure.", "The lingula is part of a lobe, rather than a separate third lobe."],
        source: "volume-i", reference: "Lungs section, topics 36–38: right lung, left lung and comparison table.",
        question: "Where does the lingula belong?", options: ["Left superior lobe", "Right middle lobe", "Left inferior lobe"], answer: 0,
        feedback: "The lingula is a projection of the left superior lobe." },
    ],
  },
  {
    slug: "abdomen", title: "Abdomen",
    description: "Build an abdominal map from surface regions to peritoneal relationships and digestive arterial territories.",
    introduction: "The Volume II guide connects topography with organ relationships. Begin with the surface map, then use the peritoneum and major arterial territories to organize the deeper anatomy.",
    image: { src: "/images/anatomy/volume-2.png", alt: "Nine abdominal regions arranged in three rows.", caption: "Abdominal regions · Original Volume II schematic" },
    sources: [volumeII],
    lessons: [
      { id: "regions", title: "Nine abdominal regions", explanation: "The nine-region scheme uses two vertical midclavicular lines and two horizontal planes. Read the regions in three rows: hypochondriac–epigastric–hypochondriac, lumbar–umbilical–lumbar, and inguinal–hypogastric–inguinal.",
        points: ["Right and left refer to the person being described.", "The umbilical region is central.", "Keep the nine-region scheme distinct from the four-quadrant scheme."],
        source: "volume-ii", reference: "Part I, topic 1, “Abdominal Regions and Surface Planes.”",
        question: "Which region lies immediately below the umbilical region?", options: ["Epigastric", "Right lumbar", "Hypogastric"], answer: 2,
        feedback: "The hypogastric region is in the middle of the lowest row." },
      { id: "peritoneum", title: "Peritoneal relationships", explanation: "Parietal peritoneum lines the abdominal wall, while visceral peritoneum covers organs. The peritoneal cavity is the potential space between these layers. Retroperitoneal structures lie behind the peritoneum.",
        points: ["An intraperitoneal organ is covered by visceral peritoneum; it does not float inside the potential space.", "The kidneys are primarily retroperitoneal.", "The lesser sac lies behind the stomach and lesser omentum."],
        source: "volume-ii", reference: "Part II, topics 8–11: peritoneal cavity, organ relationships, omenta and lesser sac.",
        question: "How are the kidneys classified by peritoneal relationship?", options: ["Primarily retroperitoneal", "Inside the lesser sac", "Intraperitoneal"], answer: 0,
        feedback: "The kidneys lie behind the peritoneum and are primarily retroperitoneal." },
      { id: "arterial-territories", title: "Foregut, midgut & hindgut", explanation: "The digestive tract’s embryological territories help organize its adult blood supply. The celiac trunk is the main foregut arterial marker, the superior mesenteric artery the midgut marker, and the inferior mesenteric artery the hindgut marker.",
        points: ["Foregut → celiac trunk.", "Midgut → superior mesenteric artery.", "Hindgut → inferior mesenteric artery."],
        source: "volume-ii", reference: "Part V, topic 34, “GI Neurovascular and Autonomic Innervation Addendum”; Part VI, topic 36.",
        question: "Which artery is the main arterial marker of the midgut?", options: ["Inferior mesenteric artery", "Superior mesenteric artery", "Celiac trunk"], answer: 1,
        feedback: "The superior mesenteric artery supplies the midgut territory and is also the axis used to describe midgut rotation.",
        related: { href: "/subjects/anatomy/embryology", label: "Connect this with embryology" } },
    ],
  },
  {
    slug: "embryology", title: "Embryology",
    description: "Connect developmental origins with adult anatomy using the general, digestive and urogenital chapters.",
    introduction: "Select a developmental theme and follow the connection from embryonic tissue or movement to an adult structure. These short lessons draw from Volumes II, III and V.",
    sources: [volumeII, volumeIII, volumeV],
    lessons: [
      { id: "germ-layers", title: "Germ layers & neurulation", explanation: "Gastrulation establishes ectoderm, mesoderm and endoderm. The neural tube gives rise to the central nervous system, while neural crest contributes to much of the peripheral nervous system and several other tissues.",
        points: ["Ectoderm contributes to epidermis and the nervous system.", "Mesoderm contributes to muscle, bone, connective tissue and vessels.", "Endoderm contributes to much of the epithelial lining of the gut and respiratory tract."],
        source: "volume-v", reference: "Part VI, topic 42, “Gastrulation, Notochord, and Neurulation.”",
        question: "Which structure gives rise to the central nervous system?", options: ["Ureteric bud", "Neural tube", "Dorsal mesentery"], answer: 1,
        feedback: "The neural tube forms the central nervous system. Neural crest contributes to much of the peripheral nervous system." },
      { id: "limb-development", title: "Limb patterning", explanation: "Limb development coordinates outgrowth with the identities of the limb’s different axes. The source guide links the apical ectodermal ridge and FGF signaling with proximodistal outgrowth, and the zone of polarizing activity and SHH with anteroposterior patterning.",
        points: ["AER/FGF: growth along the proximal-to-distal axis.", "ZPA/SHH: anteroposterior patterning.", "The upper and lower limbs rotate in different directions during development."],
        source: "volume-v", reference: "Part VI, topic 43, “Limb Development.”",
        question: "Which pairing supports proximodistal limb outgrowth?", options: ["AER and FGF", "ZPA and the celiac trunk", "Ureteric bud and SHH"], answer: 0,
        feedback: "The apical ectodermal ridge, through FGF signaling, supports proximodistal outgrowth.",
        related: { href: "/subjects/anatomy/musculoskeletal#development", label: "Continue to musculoskeletal development" } },
      { id: "gut-development", title: "Gut tube & rotation", explanation: "Embryonic folding helps form the primitive gut tube. As the midgut grows, it temporarily herniates into the umbilical cord, rotates around the superior mesenteric artery, and returns to the abdomen.",
        points: ["Distinguish foregut, midgut and hindgut territories.", "Use the superior mesenteric artery as the rotation axis.", "Connect the developmental map with the arterial territories of the adult abdomen."],
        source: "volume-ii", reference: "Part VI, topics 36 and 40: “Gut Tube Overview” and “Midgut Herniation and Rotation.”",
        question: "Around which artery is midgut rotation described?", options: ["Renal artery", "Inferior mesenteric artery", "Superior mesenteric artery"], answer: 2,
        feedback: "The midgut rotates around the superior mesenteric artery.",
        related: { href: "/subjects/anatomy/abdomen", label: "Return to abdominal relationships" } },
      { id: "kidney-development", title: "Kidney development", explanation: "The permanent kidney develops through interaction between the ureteric bud and metanephric mesenchyme. The bud forms the collecting system; the mesenchyme forms the nephron components.",
        points: ["Ureteric bud: ureter, renal pelvis, calyces and collecting ducts.", "Metanephric mesenchyme: nephron components, including the renal corpuscle and tubules.", "Keep the collecting duct distinct from the nephron’s developmental origin."],
        source: "volume-iii", reference: "Part VI, topics 36–37: intermediate mesoderm, urogenital ridge and kidney development.",
        question: "Which structure gives rise to the collecting ducts?", options: ["Neural crest", "Ureteric bud", "Metanephric mesenchyme"], answer: 1,
        feedback: "Collecting ducts arise from the ureteric bud; nephron components arise from metanephric mesenchyme." },
    ],
  },
];
