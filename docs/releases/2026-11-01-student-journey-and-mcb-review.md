# Student journey and lesson inventory — 1 November 2026

Audited against main `4ae389056352e64ccdc27a4eba0ffc2a976b3066` and its production alias. This is an AI-assisted walkthrough and structural inventory, not student research, qualified medical review, syllabus approval or evidence of learning outcomes. No analytics, indexing, willingness to pay or student endorsement is inferred.

## Student experience and depth

The free lesson → explained practice → summary → next-step flow works. The current quiz gives specific positive/negative feedback and explains each answer option. No account is required; practice, notes and progress are stored in the browser. A beginner has clear starting links and connected topic sequences. A returning student can save resources and resume. These are useful foundations.

The subject pages present several layers of overview, topic map, formats, lesson cards, coverage and waitlist material. Complete lesson lists were below the card grid; long Anatomy pages make rapid orientation difficult. This change moves the existing lists above the cards, uses numbered native lists, and adds a direct Lesson order shortcut. It reuses the current collection order and existing routes. Beginner steps and focused topic sequences remain separate; this is not a new prerequisite curriculum. No question, answer, saved-progress identity or medical teaching JSON is changed.

There are **249 distinct lessons**: 241 native library lessons plus eight renal course lessons. Anatomy has 121, Histology 19, Molecular Cell Biology nine, Biochemistry nine, Physiology 30 (22 core + eight renal), Genetics six, Immunology four, and Biophysics 51. Histology I (17) and II (three) are overlapping views, not 20 additional lessons. Biostatistics is reference-only with zero released lessons. There is no current Microbiology subject.

The collection is sufficient for an introductory study/revision session, not a verified complete medical curriculum or examination resource. Seven of nine Molecular Cell Biology lessons and most small-subject introductions are labelled five minutes. As a limited content-depth signal, the median core explanation/summary text is approximately 145 words for Molecular Cell Biology and 142 for Histology; this excludes diagrams, questions, special components, references, oral tasks and other supplementary material. Counts and estimated minutes are author metadata, not measured student time. Anatomy and Biophysics have broader supplied-topic coverage but still need specialist and practical validation.

## Subject priorities

| Subject | Existing coverage | Most useful content improvement after exact-source/review clearance |
| --- | --- | --- |
| Anatomy | Foundation + five regional volumes, 121 lessons | Labelled regional identification and sectional/radiological comparisons, laterality checks and richer worked spatial reasoning; reuse the existing held diagram/clip packet. |
| Histology | 19 introductions; Histology I/II overlap at neurulation | More individually cleared real microscope sections, magnification/stain/context and unknown-slide comparison; nervous tissue, special senses and endocrine gaps remain. Schematics are not substitutes for slide identification. |
| Molecular Cell Biology | Nine introductions; DNA/RNA/protein topic sequences and existing coded teaching diagrams | Complete the existing three-diagram review, then deepen prerequisites, chromatin/transcription regulation, ER quality control and mechanism-specific questions. The beginner route currently starts with replication, while chromatin appears late in the full collection order; the held PR #30 curriculum work must be reconciled rather than recreated. |
| Biochemistry | Nine introductions | Develop haem/iron/bilirubin, nucleotides and integrated tissue metabolism from approved editions; expand units, energetic accounting and explained practice. |
| Physiology | 22 core + eight renal | Preserve the stronger renal sequence; develop reviewed ECG/trace interpretation, endocrine axes, sensory/reflex coverage and explicit quantitative assumptions. |
| Genetics | Six introductions | Develop probability/pedigree reasoning, population genetics and laboratory-method interpretation with explained distractors. |
| Immunology | Four introductions | Develop cellular sequence/causal maps and reviewed coverage of immune deficiency, transplant and tumour mechanisms. |
| Biophysics | Foundation + 36 theory + 14 practical lessons | Validate worked calculations, dimensions and uncertainty; connect practical protocols to interpretation and supervised-use limits. |
| Biostatistics | Reference collection only | Confirm controlling sources, ownership and review capacity before planning a first lesson; do not present a reference collection as a course. |

Across subjects, priorities are qualified review and depth in used pathways, then consented student usability evidence. More files or images alone do not demonstrate a better learning outcome. Do not expand the held membership drafts. Search Console, indexing, traffic and repeat use remain unverified rather than zero.

## Molecular Cell Biology implementation disposition

The existing original SVG layouts and three metadata records are selectively reused from draft PR #30 exact head `9bf0175ae1659595381d7ab592a3f5c21407d435`; no diagrams are redrawn and the draft stack remains unchanged. The prepared label clarification is now applied in actual local-review TSX: “GDP leaves; GTP binds Gα”. Other visual explanations/checks remain version-bound to the original draft.

The local routes `/review/molecular-cell-biology` and `/review/molecular-cell-biology/[id]` show the three diagrams beside existing lessons. The existing local-review guard rejects Vercel unconditionally and requires the explicit loopback review flag. Public lessons do not receive the optional review content. Review prompts create no saved assessment IDs. No archive file, image, slide, OCR, private path, curation ZIP or private source-link record is imported into runtime code or Git.

Scientific, editorial, human accessibility and applicable public-use reviews remain pending. The [source check](../reviews/2026-11-01-mcb-source-check.md) and [unchanged PR #30](https://github.com/swardhan-del/wardhan-medical-study-guide-studios/pull/30) explain the limits. Technical checks cannot approve the diagrams. This engineering integration does not publish the held medical assets.

## Current complete lesson order

The lists below come from the existing committed collection groups. They are navigation order, not publication chronology or an approved full university syllabus. Beginner steps may deliberately skip to a different next lesson. Titles are unchanged; numbering here identifies position, not a new stable content ID.

### Macroscopic Anatomy & Embryology

**Foundations · Orientation and organisation**

1. [Anatomy Foundations: Position, Planes and Organisation](/library/anatomy-foundations)

**Volume I · Thorax**

2. [Thoracic cage and landmarks](/library/thoracic-cage-landmarks)
3. [Intercostal muscles and supply](/library/intercostal-neurovascular-plane)
4. [Diaphragm structure and sensation](/library/diaphragm-openings)
5. [Pleural layers and recesses](/library/pleura-and-recesses)
6. [Lung surfaces and lobes](/library/lung-lobes-surface)
7. [Airway and root relationships](/library/lung-roots-bronchi)
8. [Segments, blood and lymph](/library/bronchopulmonary-segments)
9. [Mediastinal compartments and vessels](/library/mediastinum-great-vessels)
10. [Phrenic, vagal and recurrent pathways](/library/thorax-nerve-relations)
11. [Posterior mediastinal routes](/library/posterior-mediastinum-lymph)
12. [Pericardial layers and reflections](/library/pericardium-sinuses)
13. [Chambers and internal landmarks](/library/heart-chambers-surfaces)
14. [Valves and fibrous support](/library/heart-valves-skeleton)
15. [Coronary arteries and venous return](/library/coronary-circulation)
16. [Conduction and autonomic modulation](/library/cardiac-conduction-autonomics)
17. [Respiratory and diaphragmatic development](/library/thoracic-development)
18. [Heart tube and partitioning](/library/heart-looping-septation)
19. [Fetal shunts and adult remnants](/library/fetal-circulation-transition)

**Volume II · Abdomen**

20. [Abdominal regions and sectional orientation](/library/abdominal-surface-map)
21. [Abdominal wall layers and rectus sheath](/library/abdominal-wall-layers)
22. [Posterior abdominal wall and lumbar relations](/library/posterior-abdominal-wall)
23. [Inguinal canal and hernia relationships](/library/inguinal-canal-relations)
24. [Peritoneum and organ position](/library/peritoneal-organization)
25. [Omenta, lesser sac and epiploic foramen](/library/omenta-and-lesser-sac)
26. [Peritoneal recesses and fluid routes](/library/peritoneal-fluid-routes)
27. [Stomach position, relations and neurovascular supply](/library/stomach-relations)
28. [Duodenum and retroperitoneal relationships](/library/duodenum-relations)
29. [Liver surfaces, porta hepatis and functional divisions](/library/liver-segments-and-porta)
30. [Gallbladder and extrahepatic biliary pathways](/library/biliary-pathways)
31. [Pancreas and its duct relationships](/library/pancreas-relations)
32. [Spleen, hilum and splenic ligaments](/library/spleen-relations)
33. [Jejunum, ileum and the mesenteric root](/library/small-intestine-mesentery)
34. [Cecum, appendix and colon](/library/cecum-appendix-colon)
35. [Rectum and the anal transition](/library/rectum-anal-transition)
36. [Celiac, superior mesenteric and inferior mesenteric territories](/library/abdominal-arterial-territories)
37. [Portal venous routes and systemic connections](/library/abdomen-portal-relations)
38. [Abdominal lymphatics and autonomic pathways](/library/abdominal-lymph-autonomics)
39. [Foregut rotation and organ development](/library/foregut-development)
40. [Midgut herniation, rotation and fixation](/library/midgut-rotation)
41. [Reconstruct an upper abdominal section](/library/abdominal-regional-reasoning)

**Volume III · Pelvis and urogenital anatomy**

42. [Pelvic inlet, outlet and walls](/library/pelvic-boundaries)
43. [Pelvic diaphragm and visceral support](/library/pelvic-floor-support)
44. [Sciatic foramina and pelvic nerve routes](/library/pelvic-foramina-nerves)
45. [Pelvic vessels and lymphatic drainage](/library/pelvic-vessels-lymph)
46. [Kidney coverings, hilum and collecting system](/library/kidney-organization)
47. [Ureters and the route into the bladder](/library/pelvis-urinary-route)
48. [Bladder, trigone and urethral differences](/library/bladder-urethrae)
49. [Testis, scrotum and spermatic cord](/library/testis-spermatic-cord)
50. [Sperm pathway, seminal vesicles and prostate](/library/male-reproductive-ducts)
51. [Erectile tissues and external genital anatomy](/library/erectile-anatomy)
52. [Ovary and uterine tube relationships](/library/ovary-uterine-tube)
53. [Uterus, supports and uterine vessel relations](/library/uterus-support-vessels)
54. [Vagina and its pelvic relations](/library/vagina-pelvic-relations)
55. [Perineal triangles, pouches and perineal body](/library/perineal-spaces)
56. [Ischioanal fossa, pudendal canal and anal region](/library/ischioanal-pudendal)
57. [Development of kidneys, bladder and urethra](/library/urinary-development)
58. [Gonadal differentiation and genital ducts](/library/gonadal-duct-development)
59. [External genital development and gonadal descent](/library/gonadal-descent)

**Volume IV · Head, neck and neuroanatomy**

60. [Neck triangles and surface orientation](/library/neck-triangles)
61. [Cervical fascia, carotid sheath and sympathetic trunk](/library/cervical-fascia-sympathetic)
62. [Head and neck arteries, veins and lymphatics](/library/head-neck-vessels-lymph)
63. [Oral cavity, palate and teeth](/library/oral-cavity-palate-teeth)
64. [Tongue structure, function and nerve map](/library/head-neck-tongue-map)
65. [Salivary glands and their nerve routes](/library/salivary-glands)
66. [Mastication, TMJ and deep facial spaces](/library/tmj-deep-fossae)
67. [Nasal cavity and paranasal drainage](/library/nose-sinuses)
68. [Pharynx, tonsils and swallowing](/library/pharynx-swallowing)
69. [Laryngeal skeleton, muscles and innervation](/library/larynx-voice-airway)
70. [Skull foramina, scalp and facial layers](/library/skull-scalp-face)
71. [Orbit, eyeball and visual pathway](/library/orbit-anatomy)
72. [External, middle and inner ear](/library/ear-anatomy)
73. [Cranial nerve nuclei and functional columns](/library/cranial-nerve-organization)
74. [Ocular motor nerves and lesion localization](/library/ocular-motor-nerves)
75. [Trigeminal divisions and sensory territories](/library/trigeminal-pathways)
76. [Facial nerve course and branch functions](/library/facial-nerve-course)
77. [Glossopharyngeal, vagus, accessory and hypoglossal nerves](/library/lower-cranial-nerves)
78. [Cranial parasympathetic ganglia](/library/cranial-parasympathetics)
79. [Meninges, dural folds and intracranial spaces](/library/meninges-dural-folds)
80. [Dural venous sinuses and cavernous sinus relations](/library/venous-sinuses)
81. [Cerebral arteries, territories and collateral routes](/library/cerebral-blood-supply)
82. [Ventricles, CSF flow and internal landmarks](/library/ventricles-csf)
83. [Basal ganglia, internal capsule and diencephalon](/library/basal-ganglia-diencephalon)
84. [Brainstem landmarks and crossed findings](/library/brainstem-localization)
85. [Cerebellum, peduncles and fourth ventricle](/library/cerebellum-connections)
86. [Spinal cord, meninges and long pathways](/library/spinal-cord-tracts)
87. [Pharyngeal arches, pouches and arch arteries](/library/pharyngeal-arch-development)
88. [Development of face, palate and special senses](/library/face-palate-sense-development)
89. [Brain vesicles, neural tube and spinal development](/library/neural-tube-development)

**Volume V · Musculoskeletal anatomy**

90. [Bone structure and connections between bones](/library/bones-and-connections)
91. [Synovial joint design and movement](/library/synovial-joint-design)
92. [Muscle architecture, actions and innervation](/library/muscle-actions)
93. [Vertebral column and regional vertebrae](/library/vertebral-regions)
94. [Atlas, axis and craniovertebral movement](/library/craniovertebral-joints)
95. [Intervertebral discs and spinal ligaments](/library/spinal-discs-ligaments)
96. [Back muscle layers and segmental innervation](/library/back-muscle-layers)
97. [Clavicle, scapula and shoulder girdle joints](/library/shoulder-girdle-joints)
98. [Glenohumeral joint and rotator cuff](/library/rotator-cuff-shoulder)
99. [Axilla, axillary artery and scapular spaces](/library/axilla-scapular-spaces)
100. [Brachial plexus from roots to terminal nerves](/library/limbs-plexus-and-joints)
101. [Arm compartments and elbow relationships](/library/arm-elbow)
102. [Cubital fossa and forearm compartments](/library/cubital-forearm)
103. [Wrist, carpal tunnel and anatomical snuffbox](/library/wrist-carpal-tunnel)
104. [Intrinsic hand muscles and functional nerve tests](/library/hand-intrinsics)
105. [Upper limb vessels and lymphatic routes](/library/upper-limb-vessels)
106. [Pelvic girdle and hip bone landmarks](/library/pelvic-girdle-landmarks)
107. [Hip joint stability and femoral head supply](/library/hip-joint-stability)
108. [Gluteal region and the piriformis landmark](/library/gluteal-region)
109. [Thigh compartments and muscle actions](/library/thigh-compartments)
110. [Femoral triangle, sheath and adductor canal](/library/femoral-triangle-canal)
111. [Knee ligaments, menisci and movement](/library/knee-joint-mechanics)
112. [Popliteal fossa and neurovascular depth](/library/popliteal-fossa)
113. [Leg compartments and ankle actions](/library/leg-compartments)
114. [Ankle, tarsal tunnel and foot arches](/library/ankle-foot-arches)
115. [Plantar muscles and nerve territories](/library/plantar-foot)
116. [Lower limb arteries, veins and lymphatics](/library/lower-limb-vessels)
117. [Lumbar and sacral plexuses across the limb](/library/lumbar-sacral-plexuses)
118. [Neck muscles and hyoid relationships](/library/neck-musculoskeletal)
119. [Regional lymph drainage and crossing territories](/library/regional-lymphatics)
120. [Early patterning and limb development](/library/limb-development)
121. [Vertebral and skull development](/library/axial-skeleton-development)

### Microscopic Anatomy, Histology & Embryology

**Tissues, organs and development**

1. [Histology Foundations: The Four Basic Tissues](/library/histology-foundations-tissues)
2. [Reading a histology section](/library/microscopy)
3. [Epithelia: layers, shape and function](/library/epithelia)
4. [Cell junctions and surface specializations](/library/cell-junctions)
5. [Connective tissue and extracellular matrix](/library/connective-tissue)
6. [Cartilage, bone and remodeling](/library/cartilage-bone)
7. [Blood cells and bone marrow](/library/blood-marrow)
8. [Skeletal, cardiac and smooth muscle](/library/muscle-histology)
9. [Arteries, veins and capillaries](/library/vessel-histology)
10. [Lymph node, spleen and thymus](/library/lymphoid-organs)
11. [From conducting airways to alveoli](/library/respiratory-histology)
12. [Recognizing the gastrointestinal wall](/library/gi-histology)
13. [Liver and pancreas: routes and secretions](/library/liver-pancreas)
14. [Kidney cortex, medulla and tubules](/library/renal-histology)
15. [Reproductive histology and cyclic change](/library/reproductive-histology)
16. [Placental villi and maternal–fetal exchange](/library/placenta)
17. [Neural tube formation and early organization](/library/neurulation)
18. [Myelin and glia: identify the cell before the function](/library/myelin-and-glial-cells)
19. [Locate the blood–brain and blood–CSF barriers](/library/brain-and-csf-barriers)

### Molecular Cell Biology

**Molecular and cellular mechanisms**

1. [DNA replication and strand direction](/library/dna-replication)
2. [DNA lesions, mutations and repair](/library/dna-repair)
3. [From pre-mRNA to mature messenger RNA](/library/rna-processing)
4. [Translation: charging, decoding and elongation](/library/translation)
5. [Protein targeting and the secretory pathway](/library/protein-trafficking)
6. [PCR, qPCR and reverse transcription](/library/pcr)
7. [Cell signaling through G proteins](/library/cell-signaling)
8. [Chromatin: separate access, packaging and topology](/library/chromatin-access-and-topology)
9. [ER quality control: folding, glycan checks and ERAD](/library/er-protein-quality-control)

### Biochemistry

**Foundations · Enzymes and regulation**

1. [Biochemistry Foundations: Enzymes, Kinetics and Regulation](/library/biochemistry-enzyme-foundations)

**Molecules and metabolism**

2. [Protein structure and collagen](/library/protein-structure)
3. [Enzyme catalysis and inhibition](/library/enzyme-kinetics)
4. [Glycolysis and lactate recycling](/library/glycolysis)
5. [Pyruvate dehydrogenase and the TCA cycle](/library/pdh-tca)
6. [Fatty-acid synthesis and fuel storage](/library/lipid-metabolism)
7. [Amino-acid nitrogen and urea](/library/nitrogen-metabolism)
8. [Ketone bodies: connect liver production with tissue use](/library/ketone-production-and-use)
9. [Lipoproteins: follow the cargo and the particle](/library/lipoprotein-routes)

### Medical Physiology

**Foundations · Membrane transport and voltage**

1. [Physiology Foundations: Membrane Transport and Resting Potential](/library/physiology-membrane-foundations)

**Cellular physiology and muscle**

2. [Cell transport: follow the energy](/library/fluid-and-membrane-transport)
3. [Three muscle types, three calcium stories](/library/muscle-contraction)
4. [Autonomic signals: receptor before response](/library/autonomic-signalling)
5. [Resting potential and the action potential](/library/membrane-potentials)
6. [Measure body-fluid compartments by indicator dilution](/library/indicator-dilution)

**Cardiovascular physiology**

7. [The cardiac cycle: pressure opens the valves](/library/cardiac-cycle)
8. [Microcirculation: return the filtered fluid](/library/lymph-and-fluid-exchange)
9. [Stroke volume, cardiac output and pump regulation](/library/cardiac-output)
10. [The arterial baroreceptor reflex](/library/baroreflex)
11. [ECG: connect time, conduction and lead direction](/library/ecg-time-and-vectors)

**Respiratory physiology**

12. [Ventilation: make each breath count](/library/respiratory-mechanics)
13. [Ventilation, perfusion and gas exchange](/library/ventilation-perfusion)
14. [Alveolar ventilation: why breathing pattern matters](/library/alveolar-ventilation-calculations)

**Renal and acid–base physiology**

15. [Water balance: distinguish ADH from aldosterone](/library/renal-water-balance)

**Blood and haemostasis**

16. [Haemostasis: build and stabilise the plug](/library/blood-and-haemostasis)

**Gastrointestinal physiology and energy balance**

17. [Digestion: coordinate movement and secretion](/library/digestive-control)
18. [Energy balance: connect intake, storage and use](/library/energy-balance)

**Endocrine and reproductive physiology**

19. [Endocrine axes: read the feedback loop](/library/endocrine-feedback)
20. [Reproductive physiology: connect the two cycles](/library/reproductive-cycles)

**Nervous system and special senses**

21. [Neural integration: from release to a response](/library/synaptic-integration)
22. [Special senses: convert a stimulus into a signal](/library/special-senses)

**Separate renal course**

1. Follow the blood. Follow the filtrate.
2. What does renal clearance actually measure?
3. Afferent versus efferent: flow is not filtration.
4. A tour of tubular transport
5. How the kidney concentrates urine
6. Volume and osmolality ask different questions.
7. Reclaim bicarbonate. Excrete acid.
8. How to interpret an arterial blood gas

### Genetics & Immunology

**Foundations · Genome and inheritance**

1. [Genetics Foundations: Genome, Inheritance and Gene Expression](/library/genetics-genome-foundations)

**Medical genetics**

2. [Meiosis, nondisjunction and mosaicism](/library/meiosis)
3. [Inheritance patterns, penetrance and expressivity](/library/inheritance)
4. [Choosing and interpreting a genetic test](/library/genetic-testing)
5. [Gene therapy: target, delivery and evidence](/library/genetic-therapy-delivery)
6. [Recessive inheritance: update probability after new information](/library/recessive-conditional-probability)

**Immunology**

7. [Innate and adaptive immunity](/library/innate-adaptive)
8. [MHC I, MHC II and T-cell recognition](/library/antigen-presentation)
9. [Complement pathways and their shared effectors](/library/complement)
10. [Hypersensitivity: classify the mechanism of tissue injury](/library/hypersensitivity-mechanisms)

### Biophysics

**Foundations · Diffusion and membranes**

1. [Biophysics Foundations: Diffusion, Osmosis and Membranes](/library/biophysics-membrane-foundations)

**Optics and light**

2. [Radiation, units and geometric optics](/library/biophysics-radiation-optics)
3. [Lenses, magnification and the microscope](/library/biophysics-image-formation)
4. [Interference, diffraction and optical resolution](/library/biophysics-wave-optics)
5. [Photons, matter waves and electron microscopy](/library/biophysics-light-duality)
6. [Atomic models, energy levels and uncertainty](/library/biophysics-atomic-models)
7. [Bonds, interaction energies and scanning probes](/library/biophysics-molecular-interactions)

**Matter and optical methods**

8. [Gas laws, Boltzmann statistics and thermal energy](/library/biophysics-gases-statistics)
9. [Solids, liquids, liquid crystals and energy bands](/library/biophysics-condensed-matter)
10. [Absorption, scattering and optical spectroscopy](/library/biophysics-absorption-scattering)
11. [Blackbody radiation and thermal imaging](/library/biophysics-thermal-radiation)
12. [Fluorescence, phosphorescence and molecular probes](/library/biophysics-luminescence)
13. [Stimulated emission and medical laser principles](/library/biophysics-lasers)

**Nuclear physics and imaging**

14. [Nuclei, isotopes and radioactive transformations](/library/biophysics-nuclear-structure)
15. [Decay law and radiation interactions with matter](/library/biophysics-decay-interactions)
16. [Detectors, count statistics and pulse spectra](/library/biophysics-radiation-detection)
17. [Absorbed dose, biological weighting and protection](/library/biophysics-dosimetry)
18. [Tracers, biological clearance and effective half-life](/library/biophysics-isotope-diagnostics)
19. [Gamma cameras, SPECT, PET and radiotherapy geometry](/library/biophysics-nuclear-imaging)

**Signals and X-ray imaging**

20. [Biological signals, filtering and digitisation](/library/biophysics-signals)
21. [X-ray tubes, spectra and beam quality](/library/biophysics-xray-production)
22. [Projection radiography, CT reconstruction and windowing](/library/biophysics-ct-imaging)

**Flow, diffusion and thermodynamics**

23. [Continuity, viscosity and resistance to flow](/library/biophysics-fluid-flow)
24. [Diffusion, osmosis and heat transport](/library/biophysics-diffusion-osmosis)
25. [Thermodynamic systems and the first law](/library/biophysics-energy-first-law)
26. [Entropy, free energy and equilibrium](/library/biophysics-entropy-potentials)

**Membranes and ultrasound**

27. [Membrane potentials, permeability and the RC model](/library/biophysics-resting-potential)
28. [Action potentials and impulse propagation](/library/biophysics-action-potentials)
29. [Ultrasound echoes, Doppler shifts and energy deposition](/library/biophysics-ultrasound)

**Biomolecules and body systems**

30. [Water, protein folding and polymer elasticity](/library/biophysics-water-biopolymers)
31. [Vision, hearing and sensory coding](/library/biophysics-sensory-biophysics)
32. [Stress, strain and viscoelastic tissues](/library/biophysics-biomechanics)
33. [Muscle mechanics and molecular motors](/library/biophysics-molecular-motors)
34. [X-ray diffraction and mass spectrometry](/library/biophysics-structural-methods)
35. [Spin, NMR, ESR and MRI contrast](/library/biophysics-magnetic-resonance)
36. [Circulation, cardiac work and the ECG](/library/biophysics-circulation-ecg)
37. [Breathing mechanics, gas exchange and physical examination](/library/biophysics-respiratory-physics)

**Measurement practicals**

38. [Practical: lens power and microscope calibration](/library/biophysics-practical-lenses)
39. [Practical: refractive index and concentration](/library/biophysics-practical-refractometry)
40. [Practical: blanks, dilution and absorbance](/library/biophysics-practical-absorbance)
41. [Practical: optical rotation and chirality](/library/biophysics-practical-polarimetry)
42. [Practical: eye optics and visual acuity](/library/biophysics-practical-eye)
43. [Practical: scintillation spectra and background](/library/biophysics-practical-spectra)
44. [Practical: half-value layers and shielding curves](/library/biophysics-practical-attenuation)
45. [Practical: oscillations, damping and resonance](/library/biophysics-practical-oscillations)
46. [Practical: resistance, capacitance and biological impedance](/library/biophysics-practical-impedance)
47. [Practical: gain, decibels and bandwidth](/library/biophysics-practical-amplifiers)
48. [Practical: electrical cell counting](/library/biophysics-practical-coulter)
49. [Practical: diffusion slopes and uncertainty](/library/biophysics-practical-diffusion)
50. [Practical: sound levels and audiograms](/library/biophysics-practical-audiometry)
51. [Practical: ECG calibration and pulse timing](/library/biophysics-practical-biosignals)

Histology I contains the first 17 Histology lessons above. Histology II contains neurulation, myelin/glia and brain/CSF barriers; neurulation is shared. Biostatistics has no released lesson sequence.
