export const studioSources = [
  { title: "Duke University: lymphatic-system practical", url: "https://histology.oit.duke.edu/NormalBody/Lymphatic/Lymphatic.html", scope: "Low-power organ relationships and distinguishing landmarks." },
  { title: "Histology Guide: lymph node", url: "https://histologyguide.org/slideview/MH-076-077-078-lymph-node/10-slide-1.html", scope: "Capsule, sinuses, follicles, paracortex, HEVs and medullary cords; external real-slide practice." },
  { title: "Histology Guide: neonatal and adult thymus", url: "https://histologyguide.org/slideview/MH-079-thymus/10-slide-1.html", scope: "Lobular cortex/medulla, epithelial corpuscles and involution." },
  { title: "Southern Illinois University: tissue preparation", url: "https://histology.siu.edu/intro/tissprep.htm", scope: "Fixation, embedding, sectioning, staining and preparation artifacts." },
];

export const nodeLandmarks = [
  { name: "Capsule and subcapsular sinus", x: 29, y: 16, clue: "Find the boundary and the first lymph-receiving space just beneath it.", detail: "The connective-tissue capsule encloses the node. Immediately below it, the subcapsular sinus receives lymph from afferent lymphatic vessels. The capsule is tissue; the sinus is a passage.", why: "A surface epithelium with a crypt would suggest a different arrangement, such as palatine tonsil." },
  { name: "Cortical follicle", x: 32, y: 34, clue: "Find a rounded lymphoid unit in the outer cortex.", detail: "B-cell-rich follicles occupy the outer cortex. A secondary follicle can have a germinal centre; not every follicle has one. The pale centre in this model represents one secondary follicle.", why: "A follicle alone does not identify a lymph node: follicles also occur in spleen and mucosal lymphoid tissue." },
  { name: "Paracortex", x: 46, y: 50, clue: "Find the cellular region between the follicles and medulla.", detail: "The deeper cortex is a predominantly T-cell region containing high endothelial venules. It is a cellular compartment, not another lymph sinus.", why: "H&E architecture helps locate a region; it cannot determine the identity or activation state of every lymphocyte." },
  { name: "Medullary cords and sinuses", x: 65, y: 60, clue: "Find cellular strands separated by lymph passages toward the hilum.", detail: "Cellular medullary cords are separated by medullary sinuses. The sinuses carry lymph toward the efferent lymphatic at the hilum. Do not interchange a cellular cord with an empty-looking passage.", why: "The schematic enlarges the spaces for clarity. Widths and transit times are not measured values." },
  { name: "High endothelial venule", x: 46, y: 65, clue: "Find the specialised blood vessel in the paracortex.", detail: "Circulating lymphocytes can cross the relatively plump endothelial lining of a postcapillary HEV to enter the node from blood. An HEV is not an afferent lymphatic vessel.", why: "A lymphocyte entering through blood and lymph arriving from tissue have different entry routes." },
] as const;

export const organPatterns = [
  { id: "node", name: "Lymph node", image: "node", pattern: "Peripheral cortex and a deeper medulla", anchor: "Capsule → subcapsular sinus → cortical follicles", contrast: "Medullary cords alternate with lymph sinuses. Follicles do not form a complete organ-specific diagnosis on their own.", question: "Which organ combines a subcapsular sinus with outer cortical follicles?", answer: "The capsule–sinus–cortex relationship supports a lymph node when the wider section agrees." },
  { id: "spleen", name: "Spleen", image: "spleen", pattern: "White-pulp islands within red pulp", anchor: "Arteriole-associated lymphoid tissue", contrast: "The spleen does not have a lymph-node-style cortex and medulla. A central arteriole need not be at the geometric centre of a sectioned nodule.", question: "Which organ has white-pulp islands within red pulp instead of a cortex and medulla?", answer: "Arteriole-associated white pulp within blood-rich red pulp supports spleen. Colour alone is insufficient." },
  { id: "thymus", name: "Thymus", image: "thymus", pattern: "Repeated cortical regions around paler medulla", anchor: "Incomplete septa and medullary Hassall corpuscles", contrast: "Thymic medulla is not a germinal centre. Medullary tissue connects across incompletely separated lobules; involution changes the appearance.", question: "Which organ has incomplete lobules and medullary epithelial Hassall corpuscles?", answer: "The lobular context and concentric epithelial corpuscles support thymus. Fat or a pale patch alone does not." },
] as const;

export const slideStages = [
  { title: "Fix and preserve", short: "Preserve", body: "Stabilise the specimen before further processing. Fixation preserves useful structure while changing living tissue; shrinkage and other artifacts remain possible.", prompt: "Does fixation preserve an unchanged living specimen?", answer: "No. It stabilises tissue while altering its chemistry and potentially its dimensions." },
  { title: "Process and embed", short: "Support", body: "In a routine paraffin workflow, processing removes water and permits infiltration with a supporting medium. Embedding supports the specimen for cutting; orientation determines which relationships the section can show.", prompt: "Why support the specimen before cutting?", answer: "Soft tissue needs mechanical support to produce a useful thin section." },
  { title: "Section and mount", short: "Slice", body: "A thin cut samples a three-dimensional object in one plane. Transfer the section to glass. One round or oval profile does not reveal the full course of a tube.", prompt: "Can one oval profile prove the shape of an entire organ?", answer: "No. Section plane and sampling must be considered alongside adjacent structures." },
  { title: "Remove wax and rehydrate", short: "Prepare", body: "Before a conventional aqueous H&E workflow, remove the paraffin from the section and return it to an appropriate hydrated state. This is a conceptual sequence, not a reagent or timing protocol.", prompt: "Is a paraffin-covered section ready for a conventional aqueous stain?", answer: "No. Wax removal and appropriate rehydration precede that staining workflow." },
  { title: "Stain for contrast", short: "Contrast", body: "Hematoxylin-associated nuclear contrast and eosin-associated pink components help reveal architecture. Appearance depends on preparation; pink is not a unique identifier for muscle or collagen.", prompt: "Does a pink region uniquely identify one tissue?", answer: "No. Combine location, cell arrangement, boundaries and other structural clues." },
  { title: "Finish and examine", short: "Examine", body: "Complete the method-appropriate finishing and coverslipping steps, then begin with low-power architecture. Other workflows, including frozen sections, differ from this routine paraffin sequence.", prompt: "Must every histology method follow this exact paraffin sequence?", answer: "No. This model describes a routine paraffin preparation; other methods differ." },
] as const;

export const visualReels = [
  { id: "node-routes", title: "Two ways into a lymph node", seconds: 32, description: "Follow lymph through sinuses, then compare blood-to-tissue entry through an HEV.", lesson: "lymphoid-organs", transcript: [
    { start: 0, text: "Start with the capsule and the subcapsular sinus beneath it." },
    { start: 6, text: "Lymph from tissue enters afferent lymphatics and the sinus system." },
    { start: 12, text: "It passes toward medullary sinuses and leaves via an efferent lymphatic at the hilum." },
    { start: 18, text: "Pause and predict: is the high endothelial venule a lymphatic vessel?" },
    { start: 23, text: "No. An HEV is a blood vessel. Circulating lymphocytes can cross it into the paracortex." },
    { start: 28, text: "Keep lymph flow and lymphocyte entry from blood as separate routes." },
  ] },
  { id: "organ-patterns", title: "Three organs, three architectural clues", seconds: 30, description: "Compare lymph node, spleen and thymus using relationships rather than colour.", lesson: "lymphoid-organs", transcript: [
    { start: 0, text: "Lymph node: capsule, subcapsular sinus, cortical follicles and a deeper medulla." },
    { start: 7, text: "Spleen: arteriole-associated white-pulp islands within red pulp, not cortex and medulla." },
    { start: 14, text: "Thymus: incomplete lobules with cortical regions, connected medulla and Hassall corpuscles." },
    { start: 21, text: "Pause and predict: does a germinal centre alone identify a lymph node?" },
    { start: 26, text: "No. Combine at least two landmarks and consider which parts the section omits." },
  ] },
  { id: "slide-journey", title: "From specimen to interpretable slide", seconds: 36, description: "See the purpose of six stages in a routine paraffin preparation.", lesson: "microscopy", transcript: slideStages.map((s, i) => ({ start: i * 6, text: `${i + 1}. ${s.title}. ${s.body}` })) },
] as const;
