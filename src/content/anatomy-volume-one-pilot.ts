import type { PracticeItem } from "./practice-registry.ts";

type DiagramNode = [label: string, x: number, y: number];
type Question = [prompt: string, correct: string, explanation: string, wrongA: string, reasonA: string, wrongB: string, reasonB: string];
type Edge = [from: number, to: number, arrow?: boolean];
type Diagram = {
  title: string;
  description: string;
  source: string;
  nodes: DiagramNode[];
  edges: Edge[];
};

const books = (id: string) => `https://www.ncbi.nlm.nih.gov/books/${id}/`;
const openstax = (chapter: string) => `https://openstax.org/books/anatomy-and-physiology-2e/pages/${chapter}`;

function pilot(id: string, diagram: Diagram, questions: Question[]) {
  const items: PracticeItem[] = questions.map(([prompt, correct, explanation, wrongA, reasonA, wrongB, reasonB], index) => {
    const options = [{ text: wrongA, explanation: reasonA }, { text: wrongB, explanation: reasonB }];
    const answer = (index + id.length) % 3;
    options.splice(answer, 0, { text: correct, explanation });
    return {
      id: `volume-one-${id}-${index + 1}`,
      topic: id,
      title: diagram.title,
      subject: "anatomy",
      href: `/library/${id}#question-volume-one-${id}-${index + 1}`,
      prompt,
      options,
      answer,
    };
  });
  return { id, diagram, items };
}

export const volumeOnePilot = [
  pilot("thoracic-cage-landmarks", {
    title: "Anterior landmarks of the sternum",
    description: "The manubrium meets the body at the sternal angle. The second costal cartilage attaches at this level. The xiphoid process is below the body.",
    source: openstax("7-4-the-thoracic-cage"),
    nodes: [["Manubrium",160,27],["Sternal angle",160,86],["Second costal cartilage",67,132],["Body of sternum",248,132],["Xiphoid process",248,188]],
    edges: [[0,1],[1,2],[1,3],[3,4]],
  }, [
    ["Which junction produces the sternal angle?", "Manubrium and sternal body", "The angle marks their junction.", "Body and xiphoid process", "This junction is inferior to the sternal angle.", "Rib and its costal cartilage", "This junction lies along a rib rather than in the sternum."],
    ["Which sternal part lies immediately above the angle?", "Manubrium", "The manubrium forms the superior part of the junction.", "Sternal body", "The body extends below the angle.", "Xiphoid process", "The xiphoid is at the inferior end of the sternum."],
    ["What structure marks the lower end of the sternum?", "Xiphoid process", "It extends inferiorly from the body.", "Manubrium", "The manubrium is the superior part.", "Second costal cartilage", "This cartilage approaches the sternum at the angle, higher up."],
    ["How does rib 12 differ from rib 2 at the anterior chest wall?", "Rib 12 has no anterior attachment", "Rib 12 is a floating rib.", "Rib 12 attaches at the sternal angle", "That landmark is associated with the second costal cartilage.", "Rib 12 attaches directly to the sternal body", "A floating rib has a free anterior end."],
    ["What connects a true rib to the sternum?", "Its own costal cartilage", "True ribs attach to the sternum by their own costal cartilages.", "The cartilage of the rib above", "An indirect attachment is characteristic of ribs 8–10.", "The xiphoid process alone", "The xiphoid is one part of the sternum, not a common attachment for true ribs."],
  ]),
  pilot("intercostal-neurovascular-plane", {
    title: "Main bundle in the intercostal space",
    description: "The bundle is between the internal and innermost layers. In the costal groove, its order from top to bottom is vein, artery, nerve.",
    source: books("NBK538238"),
    nodes: [["Internal intercostal",82,38],["Innermost intercostal",240,38],["Vein",160,88],["Artery",160,137],["Nerve",160,186]],
    edges: [[0,2],[1,2],[2,3],[3,4]],
  }, [
    ["Which pair of muscle layers encloses the main neurovascular plane?", "Internal and innermost", "The main bundle lies deep to the internal layer and superficial to the innermost layer.", "External and internal", "That interval lies superficial to the main bundle.", "External and innermost only", "The internal layer is a separate boundary of the plane."],
    ["What is the order from superior to inferior in the main bundle?", "Vein, artery, nerve", "VAN is the order in the costal groove.", "Nerve, artery, vein", "This reverses the top and bottom structures.", "Artery, vein, nerve", "The vein, rather than the artery, is superior."],
    ["Which component is usually lowest in the costal groove?", "Intercostal nerve", "The nerve lies inferior to the vessels in the main bundle.", "Intercostal vein", "The vein lies highest in the main bundle.", "Intercostal artery", "The artery lies between the vein and the nerve."],
    ["Where would you place the main bundle relative to the rib above?", "Along the groove near its inferior border", "The main bundle follows the costal groove.", "Along the superior border of that same rib", "This places it above the rib instead of in its inferior groove.", "In the medullary cavity of the rib", "The bundle follows an external groove."],
    ["Which structure lies immediately superior to the nerve in the main bundle?", "Intercostal artery", "The artery is the middle part of the vein–artery–nerve sequence.", "Intercostal vein", "The artery separates the vein from the nerve.", "Innermost intercostal muscle", "The muscle bounds the plane in depth, rather than forming the next element above the nerve."],
  ]),
  pilot("diaphragm-openings", {
    title: "Diaphragmatic openings by vertebral level",
    description: "From superior to inferior the diagram shows the caval opening at T8, the oesophageal hiatus at T10 and the aortic hiatus at T12.",
    source: books("NBK519558"),
    nodes: [["T8 · caval opening",160,32],["T10 · oesophageal hiatus",160,107],["T12 · aortic hiatus",160,182]],
    edges: [[0,1],[1,2]],
  }, [
    ["Which opening is associated with T8?", "Caval opening", "The caval opening is the highest of the three major openings.", "Oesophageal hiatus", "The oesophageal hiatus is conventionally at T10.", "Aortic hiatus", "The aortic hiatus is conventionally at T12."],
    ["Which opening is conventionally at T10?", "Oesophageal hiatus", "The oesophagus crosses through the hiatus at this level.", "Caval opening", "The caval opening is two vertebral levels higher.", "Aortic hiatus", "The aortic hiatus is two vertebral levels lower."],
    ["Which named opening is lowest on the level map?", "Aortic hiatus", "The aortic hiatus is at T12.", "Caval opening", "The caval opening is at T8.", "Oesophageal hiatus", "The oesophageal hiatus lies between the other two."],
    ["Which large vein traverses the caval opening?", "Inferior vena cava", "The caval opening transmits the inferior vena cava.", "Superior vena cava", "This vein reaches the heart from above the diaphragm.", "Portal vein", "Portal blood enters the liver rather than crossing through the caval opening."],
    ["Which part do the diaphragm's muscular fibres converge on?", "Central tendon", "It is the aponeurotic centre where the muscular fibres meet.", "Aortic hiatus", "This is a passage in the posterior diaphragmatic region.", "Oesophageal lumen", "The oesophagus passes through the diaphragm and does not receive its muscular insertions."],
  ]),
  pilot("pleura-and-recesses", {
    title: "The costodiaphragmatic recess",
    description: "Costal pleura lines the chest wall. Diaphragmatic pleura covers the upper diaphragm. Their reflection forms a recess extending below the resting lung margin.",
    source: books("NBK541079"),
    nodes: [["Costal pleura",70,41],["Lung margin",237,76],["Costodiaphragmatic recess",158,132],["Diaphragmatic pleura",151,193]],
    edges: [[0,2],[1,2],[2,3]],
  }, [
    ["Where does the costodiaphragmatic recess form?", "At the costal–diaphragmatic pleural reflection", "The two regions of parietal pleura meet here.", "Between the two lungs", "The mediastinum separates the lung regions.", "At the opening of the main bronchus", "The bronchus passes through the hilum, above the inferior recess."],
    ["Which pleural layer directly covers the lung?", "Visceral pleura", "Visceral pleura follows the lung surface.", "Costal pleura", "Costal pleura lines the chest wall.", "Diaphragmatic pleura", "Diaphragmatic pleura follows the upper surface of the diaphragm."],
    ["What normally occupies less of the inferior recess during quiet breathing than during deep inspiration?", "The lung", "The lung expands into the recess during deep inspiration.", "The bronchus at the root", "The recess is at the pleural reflection, away from the main bronchus.", "The sternum", "The sternum is a chest-wall landmark and does not fill the pleural recess."],
    ["Where may pleural fluid collect dependently in an upright person?", "Costodiaphragmatic recess", "It is the deep inferior recess along the diaphragm.", "Within the bronchial lumen", "The bronchial lumen is an airway separate from the pleural cavity.", "Inside the pericardial cavity", "The pericardial cavity is a separate serosal space."],
    ["Which pair of names describes regions of parietal pleura?", "Costal and diaphragmatic", "Both regions line structures bounding the pleural space.", "Visceral and costal", "Visceral pleura covers the lung.", "Parietal and visceral", "These are the two layers, rather than two regions of the parietal layer."],
  ]),
  pilot("lung-lobes-surface", {
    title: "Lobes of the right and left lungs",
    description: "The right lung has upper, middle and lower lobes. The left lung has upper and lower lobes. The lingula is part of the left upper lobe.",
    source: books("NBK470197"),
    nodes: [["Right upper lobe",80,28],["Right middle lobe",80,88],["Right lower lobe",80,171],["Left upper lobe",241,28],["Lingula",241,88],["Left lower lobe",241,171]],
    edges: [[0,1],[1,2],[3,4],[3,5]],
  }, [
    ["Which side has a middle lobe in the usual pattern?", "Right", "The right lung has three lobes, including a middle lobe.", "Left", "The lingula is part of the left upper lobe.", "Both", "The usual left lung has two lobes."],
    ["Which fissure separates the right upper and middle lobes?", "Horizontal fissure", "It separates the two lobes named in the question.", "Oblique fissure", "On the right it separates the lower lobe from the upper and middle lobes.", "Cardiac notch", "This indentation is a left lung landmark rather than a fissure."],
    ["What separates the two lobes on the left?", "Oblique fissure", "The typical left lung has an oblique fissure.", "Horizontal fissure", "The horizontal fissure is characteristic of the right lung.", "Lingula", "The lingula is part of the left upper lobe."],
    ["What is the relationship of the lingula to the left lung?", "It is a projection of the upper lobe", "It belongs to the upper lobe rather than forming its own lobe.", "It is part of the lower lobe", "Its bronchial and lobar assignment is upper lobe.", "It is a separate middle lobe", "A middle lobe is part of the usual right-sided pattern."],
    ["What lies at the base of each lung?", "Diaphragm", "The concave base rests on it.", "Neck root", "The lung apex points toward the root of the neck.", "Tracheal carina", "The carina marks a proximal airway bifurcation."],
  ]),
  pilot("lung-roots-bronchi", {
    title: "The lung root from front to back",
    description: "The phrenic nerve passes in front of the root. The vagus passes behind it. The main bronchus at the root divides into lobar branches.",
    source: books("NBK519048"),
    nodes: [["Phrenic nerve · front",160,27],["Lung root",160,87],["Vagus nerve · back",160,151],["Lobar bronchi",246,189]],
    edges: [[0,1],[1,2],[1,3,true]],
  }, [
    ["Which nerve runs anterior to the lung root?", "Phrenic nerve", "Anterior to the root is the phrenic route toward the diaphragm.", "Vagus nerve", "The vagus runs posterior to the root.", "Intercostal nerve", "Intercostal nerves travel in the chest wall."],
    ["In which direction from the root should you look for the vagus?", "Posterior", "The vagus passes behind the lung root.", "Anterior", "That is the relation of the phrenic nerve.", "Within the bronchial lumen", "The vagus is a nerve outside the airway."],
    ["Which airway divides at the carina?", "Trachea", "The carina is the ridge at the tracheal bifurcation.", "Lobar bronchus", "A lobar bronchus branches farther downstream.", "Terminal bronchiole", "A terminal bronchiole lies much farther along the airway tree."],
    ["After a main bronchus, which level comes next on the airway tree?", "Lobar bronchus", "Main bronchi give rise to branches serving individual lobes.", "Segmental bronchus", "The segmental bronchus is downstream of the lobar bronchus.", "Trachea", "The trachea is proximal to the main bronchi."],
    ["Which airway is the direct parent of a segmental bronchus?", "Lobar bronchus", "Tertiary bronchi arise from lobar bronchi.", "Terminal bronchiole", "The bronchiole lies distal to bronchial divisions.", "Trachea", "The trachea branches into the two main bronchi first."],
  ]),
  pilot("bronchopulmonary-segments", {
    title: "Bronchovascular supply of one segment",
    description: "A segmental bronchus and segmental pulmonary artery supply the same bronchopulmonary segment. Its parent lobe contains more than one segment.",
    source: books("NBK537353"),
    nodes: [["Lobe",161,27],["Segmental bronchus",75,90],["Pulmonary arterial branch",242,90],["One segment",161,170]],
    edges: [[0,3],[1,3,true],[2,3,true]],
  }, [
    ["Which airway supplies one bronchopulmonary segment?", "Segmental bronchus", "The tertiary bronchus identifies that anatomical unit.", "Main bronchus", "One main bronchus serves the ipsilateral lung.", "Lobar bronchus", "A lobar bronchus supplies a lobe containing multiple segments."],
    ["Which artery accompanies a segmental bronchus in the supply diagram?", "Pulmonary arterial branch", "A pulmonary arterial branch supplies blood for gas exchange in that segment.", "Coronary artery", "Coronary arteries supply the heart.", "Pulmonary vein", "A pulmonary vein is a drainage vessel, rather than a supplying artery."],
    ["Which is the larger division?", "Lobe", "A lobe contains bronchopulmonary segments.", "Segment", "A segment is a subdivision of a lobe.", "Segmental bronchus", "This is the airway serving a segment rather than a division larger than a lobe."],
    ["Which pairing identifies the supply of a single segment on a teaching map?", "Tertiary bronchus and segmental pulmonary artery", "Both branches serve the same segment.", "Main bronchus and pulmonary trunk", "These are proximal vessels and airways before segmental branching.", "Lobar bronchus and pulmonary trunk", "Neither specifies the arterial and airway branches for one segment."],
    ["What does a student identify by following a bronchus to its tertiary division?", "A segmental airway", "Tertiary and segmental name the same branching level.", "A lobar airway", "Lobar bronchi are second-order branches.", "A main airway", "The main bronchus is proximal to both lobar and segmental levels."],
  ]),
  pilot("mediastinum-great-vessels", {
    title: "Mediastinal compartments and their landmarks",
    description: "The superior compartment lies above the inferior mediastinum. The latter has anterior, middle and posterior divisions. Heart and pericardium identify the middle division.",
    source: books("NBK539819"),
    nodes: [["Superior mediastinum",161,27],["Anterior division",70,92],["Middle division",251,92],["Posterior division",70,174],["Heart and pericardium",251,174]],
    edges: [[2,4]],
  }, [
    ["Which structure helps identify the middle mediastinum?", "Pericardium", "The middle compartment contains the pericardium and enclosed heart.", "Descending thoracic aorta", "The descending thoracic aorta lies in the posterior mediastinum.", "Aortic arch", "The arch is superior to the middle compartment."],
    ["Which major arterial structure belongs in the superior mediastinal map?", "Aortic arch", "The arch curves through the superior compartment.", "Abdominal aorta", "That part of the aorta starts below the diaphragm.", "Pulmonary valve", "The valve is part of the heart within the middle compartment."],
    ["Which inferior division is behind the pericardium?", "Posterior mediastinum", "It lies behind the middle division.", "Anterior mediastinum", "It lies in front of the pericardium.", "Superior mediastinum", "It is above the inferior mediastinum and is not one of its divisions."],
    ["Which structure lies immediately anterior to the posterior division in this compartment map?", "Pericardium", "The posterior division lies behind the pericardium.", "Sternum", "The anterior and middle divisions intervene between sternum and posterior division.", "Pleural cavity", "Pleural cavities flank the mediastinum."],
    ["How many divisions make up the inferior mediastinum in the classical anatomy scheme?", "Three", "They are anterior, middle and posterior.", "Two", "Including the middle compartment makes three.", "Four", "Counting the superior mediastinum adds a compartment outside the inferior group."],
  ]),
  pilot("thorax-nerve-relations", {
    title: "Two thoracic nerve routes",
    description: "The phrenic nerve runs toward the diaphragm. A branch of the left vagus, the left recurrent laryngeal nerve, loops beneath the aortic arch and ascends.",
    source: books("NBK537171"),
    nodes: [["Phrenic nerve",78,37],["Diaphragm",78,178],["Left vagus",242,37],["Aortic arch",242,99],["Left recurrent nerve",242,178]],
    edges: [[0,1,true],[2,4,true],[3,4]],
  }, [
    ["Which branch loops beneath the aortic arch?", "Left recurrent laryngeal nerve", "It leaves the left vagus and turns beneath the arch.", "Right recurrent laryngeal nerve", "The usual right loop is around the right subclavian artery.", "Left phrenic nerve", "The phrenic passes toward the diaphragm instead of recurring to the larynx."],
    ["Which parent nerve gives rise to a recurrent laryngeal nerve?", "Vagus", "The recurrent laryngeal nerve is a branch of CN X.", "Phrenic", "The phrenic is associated with diaphragmatic innervation.", "Intercostal", "Intercostal nerves serve the thoracic wall."],
    ["Which nerve supplies motor fibres to the diaphragm?", "Phrenic nerve", "The phrenic nerve provides diaphragmatic motor supply.", "Recurrent laryngeal nerve", "This branch returns to the larynx.", "Vagus nerve", "The vagus is not the diaphragm's motor nerve."],
    ["Which course distinguishes the left recurrent nerve from its parent vagus?", "It turns upward toward the larynx", "Its recurrent course brings it back into the neck.", "It descends to terminate in the diaphragm", "That direction and destination describe the phrenic nerve.", "It enters an intercostal groove", "That is a route of the intercostal bundle."],
    ["Which side of the recurrent laryngeal route is directly related to the aortic arch?", "Left", "The left recurrent nerve loops below the arch.", "Right", "The right loop relates to the right subclavian artery.", "Both equally", "The two sides have different looping landmarks."],
  ]),
  pilot("posterior-mediastinum-lymph", {
    title: "Thoracic duct to the left venous angle",
    description: "The thoracic duct ascends from the abdomen through the aortic hiatus. Its usual termination is near the left internal jugular and subclavian venous junction.",
    source: books("NBK513227"),
    nodes: [["Left venous angle",160,28],["Thoracic duct",160,105],["Aortic hiatus",160,184]],
    edges: [[2,1,true],[1,0,true]],
  }, [
    ["Where does the thoracic duct usually enter the venous system?", "Left venous angle", "Its typical termination is near the left jugular–subclavian junction.", "Right venous angle", "This is the usual region of entry for the right lymphatic duct.", "Coronary sinus", "The coronary sinus returns blood from the myocardium."],
    ["What flows in the thoracic duct before it empties into a vein?", "Lymph", "The thoracic duct is a major lymphatic channel.", "Arterial blood", "Arterial blood stays in the arterial system, including the aorta.", "Air", "Air travels inside the respiratory tract."],
    ["Which veins make up the left venous angle?", "Left internal jugular and left subclavian", "The angle is at their confluence.", "Azygos and superior vena cava", "This junction is central and on the right.", "Left and right brachiocephalic", "These converge to form the superior vena cava farther medially."],
    ["Which diaphragmatic passage does the thoracic duct usually traverse?", "Aortic hiatus", "It passes into the chest through this posterior opening.", "Caval opening", "This opening is associated with the inferior vena cava.", "Oesophageal hiatus", "This opening transmits the oesophagus."],
    ["Which region is primarily served by the right lymphatic duct rather than the thoracic duct?", "Right upper limb", "The right upper quadrant is the usual exception to thoracic duct drainage.", "Left upper limb", "The left upper limb drains toward the left venous angle.", "Left lower limb", "Lymph from the lower limbs returns via the thoracic duct."],
  ]),
  pilot("pericardium-sinuses", {
    title: "Two spaces formed by pericardial reflections",
    description: "The transverse sinus passes behind the aorta and pulmonary trunk. The oblique sinus is a blind recess behind the left atrium.",
    source: books("NBK482256"),
    nodes: [["Aorta and pulmonary trunk",160,25],["Transverse sinus",160,72],["Left atrium",160,122],["Oblique sinus",160,176]],
    edges: [[0,1],[2,3]],
  }, [
    ["Which sinus lies behind the ascending aorta and pulmonary trunk?", "Transverse sinus", "It forms a passage posterior to those arterial structures.", "Oblique sinus", "It is a blind recess behind the left atrium.", "Coronary sinus", "It is a vein rather than a pericardial recess."],
    ["Which term describes the shape of the oblique sinus?", "Blind recess", "Pericardial reflections around venous structures form a cul-de-sac.", "Passage open at both ends", "That describes the transverse sinus.", "Channel through ventricular muscle", "Pericardial sinuses are outside the myocardium."],
    ["Which chamber forms the front wall of the oblique recess?", "Left atrium", "The recess is posterior to the left atrium.", "Right ventricle", "The recess is not on the anterior ventricular surface.", "Left ventricle", "The atrium, rather than the ventricle, defines the anterior boundary."],
    ["A structure lies immediately in front of the transverse sinus. Which is consistent with this location?", "Pulmonary trunk", "The pulmonary trunk is one of the arterial structures in front of the passage.", "Oblique sinus", "The oblique sinus is described separately, behind the left atrium.", "Posterior left atrial wall", "This boundary defines the oblique sinus rather than the arterial side of the transverse sinus."],
    ["What gives rise to the two pericardial sinuses?", "Serous pericardial reflections", "The serous covering turns around different groups of great vessels.", "Divisions of the ventricular septum", "The septum lies between the ventricular cavities.", "Branching of the coronary sinus", "That venous structure does not create the serous recesses."],
  ]),
  pilot("heart-chambers-surfaces", {
    title: "Two pumps connected in series",
    description: "Right atrium to right ventricle to lungs. Pulmonary veins return to the left atrium, then blood reaches the left ventricle and is pumped out to the body.",
    source: openstax("19-1-heart-anatomy"),
    nodes: [["Right atrium",79,31],["Right ventricle",79,83],["Lungs",79,143],["Left atrium",244,62],["Left ventricle",244,124],["Systemic circulation",244,184]],
    edges: [[0,1,true],[1,2,true],[2,3,true],[3,4,true],[4,5,true]],
  }, [
    ["Which chamber sends blood toward the lungs?", "Right ventricle", "It ejects into the pulmonary trunk.", "Right atrium", "It feeds the right ventricle through the tricuspid valve.", "Left ventricle", "The left ventricle ejects into the aorta."],
    ["Which chamber receives pulmonary veins?", "Left atrium", "Pulmonary venous blood returns to the left atrium before filling the left ventricle.", "Right atrium", "It receives systemic venous return.", "Left ventricle", "It receives blood from the left atrium through the mitral valve."],
    ["Which valve separates the right atrium from the right ventricle?", "Tricuspid valve", "It is the right atrioventricular valve.", "Pulmonary valve", "It is at the outlet of the right ventricle.", "Mitral valve", "It is the left atrioventricular valve."],
    ["Which chamber pumps into the aorta?", "Left ventricle", "The aortic valve guards its outflow.", "Right ventricle", "Its outlet leads to the pulmonary trunk.", "Left atrium", "The atrium feeds the left ventricle."],
    ["Which route orders blood flow from the lungs to the aorta?", "Left atrium → left ventricle → aorta", "This is the sequence from the pulmonary veins through the left heart.", "Left ventricle → left atrium → aorta", "The normal path crosses the mitral valve in the opposite direction.", "Right atrium → right ventricle → aorta", "The right ventricle empties into the pulmonary trunk."],
  ]),
  pilot("heart-valves-skeleton", {
    title: "Atrioventricular valve support",
    description: "Atrioventricular valve cusps attach by chordae tendineae to papillary muscles. This reduces the risk of leaflet prolapse during ventricular contraction.",
    source: books("NBK545143"),
    nodes: [["AV valve cusp",160,28],["Chordae tendineae",160,102],["Papillary muscle",160,176]],
    edges: [[0,1],[1,2]],
  }, [
    ["What links papillary muscles to AV valve cusps?", "Chordae tendineae", "Tension is transmitted through these fibrous cords.", "Bundle branches", "Bundle branches carry excitation in the ventricles.", "Aortic cusps", "Aortic cusps are parts of a semilunar valve."],
    ["Which group is supported by chordae?", "Atrioventricular valves", "The mitral and tricuspid valves have chordal attachments.", "Semilunar valves", "Aortic and pulmonary cusps lack papillary attachments.", "Only the aortic valve", "It is a semilunar valve and has no chordae."],
    ["What do papillary muscles and chordae restrain during ventricular contraction?", "Prolapse of AV cusps toward the atria", "Tension prevents the cusps from turning back into the atrial side.", "Opening of the aortic valve", "The aortic valve responds to the ventricular–aortic pressure difference.", "Depolarisation of the atrium", "The chordal apparatus is mechanical."],
    ["Which two valves are semilunar?", "Aortic and pulmonary", "Both are at ventricular outflow openings.", "Mitral and tricuspid", "Both are atrioventricular valves.", "Mitral and aortic", "Only the aortic valve in this pair is semilunar."],
    ["What attaches at the ventricular end of a chorda?", "Papillary muscle", "The muscle is the ventricular anchor for the cord.", "Aortic wall", "The outflow valve uses a different support arrangement.", "Atrial myocardium", "The supporting muscles lie in the ventricles."],
  ]),
  pilot("coronary-circulation", {
    title: "Two possible origins of the posterior descending artery",
    description: "The posterior descending artery can arise from the right coronary artery or the left circumflex artery. Its origin defines usual right or left coronary dominance.",
    source: books("NBK537207"),
    nodes: [["Right coronary",76,32],["Left circumflex",244,32],["Posterior descending",160,111],["Posterior IV groove",160,186]],
    edges: [[0,2,true],[1,2,true],[2,3]],
  }, [
    ["Which arterial origin is used to classify right versus left coronary dominance?", "Origin of the posterior descending artery", "The PDA source determines the usual dominant side.", "Origin of the pulmonary trunk", "It is not part of coronary arterial branching.", "Origin of the coronary sinus", "The coronary sinus is venous."],
    ["The posterior descending artery arises from the right coronary artery. What is the usual classification?", "Right dominant", "The source of the posterior descending branch is right-sided.", "Left dominant", "Left dominance usually means the branch arises from the circumflex.", "Cannot classify because the LAD is unknown", "The LAD is not the defining branch."],
    ["Which artery usually supplies the posterior descending branch in a left-dominant pattern?", "Left circumflex artery", "A branch of the left coronary system reaches the posterior interventricular groove.", "Right marginal artery", "It is part of the right coronary system.", "Pulmonary artery", "It carries blood to the lungs."],
    ["In which groove does the posterior descending branch run?", "Posterior interventricular groove", "It follows the posterior boundary between the ventricles.", "Anterior interventricular groove", "That is the usual course of the anterior interventricular artery.", "Right atrioventricular groove", "This is an atrium–ventricle boundary rather than the PDA course."],
    ["Does dominance describe the amount of blood each ventricle pumps?", "It describes coronary arterial branching", "The classification identifies a branch origin.", "It identifies the ventricle with the higher output", "Ventricular output is distinct from coronary branch anatomy.", "It identifies which atrium receives coronary venous blood", "Where blood returns does not determine the arterial dominance pattern."],
  ]),
  pilot("cardiac-conduction-autonomics", {
    title: "Ventricular conduction after the AV node",
    description: "Normal rhythm begins at the SA node. Activation reaches the AV node, continues through the AV bundle, then follows the bundle branches and Purkinje fibres.",
    source: openstax("19-2-cardiac-muscle-and-electrical-activity"),
    nodes: [["SA node",160,25],["AV node",160,67],["AV bundle",160,109],["Bundle branches",160,151],["Purkinje fibres",160,193]],
    edges: [[0,1,true],[1,2,true],[2,3,true],[3,4,true]],
  }, [
    ["Where does normal sinus rhythm begin?", "SA node", "This is the normal pacemaker.", "AV bundle", "It conducts the signal downstream of the AV node.", "Purkinje fibres", "They distribute excitation in the ventricles."],
    ["Which named structure receives excitation after the AV node?", "AV bundle", "The bundle of His continues the path across the fibrous skeleton.", "SA node", "The SA node initiated the signal earlier.", "Papillary muscle", "It is a contractile structure rather than the next specialized conducting link."],
    ["Into what does the AV bundle divide?", "Right and left bundle branches", "The two branches conduct excitation toward the two ventricles.", "Two sinoatrial nodes", "The SA node is upstream of the AV junction.", "Coronary arteries", "These vessels carry blood rather than conducting excitation."],
    ["Which fibres distribute excitation to ventricular myocardium at the end of the sequence?", "Purkinje fibres", "They branch from the bundle-branch system.", "Chordae tendineae", "These support the atrioventricular valve cusps.", "Aortic arch fibres", "The arch is an artery outside this conduction pathway."],
    ["Which order follows the normal activation pathway?", "AV node → AV bundle → bundle branches", "This is the proximal-to-distal sequence below the atria.", "Bundle branches → AV node → AV bundle", "This places the ventricular branches before their upstream structures.", "AV bundle → AV node → SA node", "This reverses the direction of the usual atrial-to-ventricular signal."],
  ]),
  pilot("thoracic-development", {
    title: "Tissue origins in the developing airway",
    description: "Endoderm gives rise to the respiratory epithelium. Mesoderm around the airway contributes cartilage, smooth muscle and connective tissue.",
    source: books("NBK448070"),
    nodes: [["Foregut endoderm",79,34],["Mesoderm",247,34],["Airway epithelium",79,109],["Airway cartilage",247,107],["Smooth muscle",247,181]],
    edges: [[0,2,true],[1,3,true],[1,4,true]],
  }, [
    ["Which early tube gives rise to the respiratory diverticulum?", "Primitive foregut", "The airway begins as an outgrowth of the foregut.", "Neural tube", "The neural tube forms the central nervous system.", "Hindgut", "The respiratory primordium arises cranial to the hindgut."],
    ["Which tissue forms tracheal cartilage?", "Mesoderm around the developing airway", "Surrounding mesoderm contributes airway support structures.", "Endoderm lining the foregut", "The endoderm forms the airway lining.", "Mature airway epithelium", "The epithelial lining is a separate component."],
    ["Which early boundary separates the developing trachea and oesophagus?", "Tracheoesophageal septum", "The septum partitions the developing airway from the dorsal foregut tube.", "Interventricular septum", "This is a wall within the heart.", "Pericardium", "This surrounds the heart rather than partitioning the foregut."],
    ["Which tissue and derivative pair is correct?", "Endoderm → airway epithelium", "The airway lining develops from foregut endoderm.", "Endoderm → airway cartilage", "Cartilage comes from surrounding mesoderm.", "Airway cartilage → endoderm", "This reverses developmental order and misidentifies the tissue origin."],
    ["Which of these has the same broad tissue origin as the airway cartilage?", "Airway smooth muscle", "Both are mesodermal supporting components.", "Airway epithelial lining", "The lining is endodermal.", "Foregut endoderm", "This names the epithelial source, not the surrounding mesoderm."],
  ]),
  pilot("heart-looping-septation", {
    title: "From a primitive tube to separate outflows",
    description: "The early heart forms a tube and loops. The truncus arteriosus later divides into the ascending aorta and pulmonary trunk.",
    source: openstax("19-5-development-of-the-heart"),
    nodes: [["Primitive heart tube",160,25],["Looped heart tube",160,68],["Truncus arteriosus",160,114],["Ascending aorta",76,182],["Pulmonary trunk",244,182]],
    edges: [[0,1,true],[1,2],[2,3,true],[2,4,true]],
  }, [
    ["Which structure exists before cardiac looping?", "Primitive heart tube", "The heart tube elongates and changes shape during looping.", "Two mature arterial outlets", "The outflow divides later in development.", "Fully separated ventricles", "Septation remains to occur after the early tube forms."],
    ["Which early outflow region contributes to the ascending aorta and pulmonary trunk?", "Truncus arteriosus", "The common outflow divides into those two vessels.", "Primitive atrium", "This contributes to the atria.", "Sinus venosus", "This is associated with the venous inflow end of the tube."],
    ["What is the pulmonary trunk's partner vessel after outflow division?", "Ascending aorta", "Both arise from the common embryonic outflow.", "Superior vena cava", "It returns systemic venous blood and is not one of the arterial outlets.", "Coronary sinus", "It is part of cardiac venous drainage."],
    ["What is a useful distinction between looping and outflow septation?", "Looping changes tube geometry; outflow septation separates arterial exits.", "The developing heart changes shape before its common outflow divides.", "Looping already divides the outflow completely.", "Distinct arterial exits require the later separation of the common outflow.", "Both terms describe venous valves opening.", "These are developmental events, not steps of the heartbeat."],
    ["Which pair belongs at the separated arterial end of the developmental diagram?", "Pulmonary trunk and ascending aorta", "These are the two great arteries from division of the truncus.", "Left and right atria", "These are chambers rather than the separated arterial vessels.", "Vena cava and coronary sinus", "Both are part of venous return."],
  ]),
  pilot("fetal-circulation-transition", {
    title: "Two routes past the fetal lungs",
    description: "The foramen ovale links right and left atria. The ductus arteriosus carries blood from the pulmonary arterial route toward the aorta.",
    source: books("NBK539710"),
    nodes: [["Right atrium",77,30],["Left atrium",247,30],["Foramen ovale",160,79],["Pulmonary artery",77,133],["Aorta",247,133],["Ductus arteriosus",160,184]],
    edges: [[0,2,true],[2,1,true],[3,5,true],[5,4,true]],
  }, [
    ["Which opening permits movement between the fetal atria?", "Foramen ovale", "It provides a route from right atrium to left atrium.", "Ductus arteriosus", "It is a connection between arteries beyond the ventricles.", "Ductus venosus", "It diverts umbilical venous blood toward the inferior vena cava."],
    ["A stream reaches the left atrium directly from the right atrium. Which route did it take?", "Foramen ovale", "That opening passes through the region of the atrial septum.", "Pulmonary valve", "That valve is at the right ventricular outlet.", "Ductus arteriosus", "It connects the pulmonary arterial route to the aorta."],
    ["Which vessel brings relatively oxygenated blood from the placenta?", "Umbilical vein", "Blood returning from the placenta flows in this vein.", "Umbilical arteries", "These take blood from the fetus to the placenta.", "Pulmonary trunk", "It receives right ventricular output."],
    ["Which shunt lets some umbilical venous blood bypass the hepatic circulation?", "Ductus venosus", "It provides a route toward the inferior vena cava.", "Foramen ovale", "This is a communication between atria.", "Ductus arteriosus", "This connects the pulmonary arterial route and the aorta."],
    ["Which pressure change favours functional closure of the foramen ovale after birth?", "Left atrial pressure exceeds right atrial pressure", "This pressure difference presses the flap against the atrial septum.", "Right atrial pressure exceeds left atrial pressure", "That gradient has the opposite effect on the flap.", "Aortic pressure equals pulmonary artery pressure", "The foramen responds to the pressure difference across the atrial septum."],
  ]),
];

export const volumeOnePilotItems = volumeOnePilot.flatMap(record => record.items);
export function volumeOnePilotFor(id: string) {
  return volumeOnePilot.find(record => record.id === id);
}
export type VolumeOneDiagram = Diagram;
