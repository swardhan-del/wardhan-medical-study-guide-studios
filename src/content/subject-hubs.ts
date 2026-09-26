export type SubjectHub = {
  name: string;
  covers: string;
  why: string;
  firstLesson: string;
  firstTitle: string;
  firstReason: string;
  topics: { title: string; lesson: string; description: string }[];
};

export const subjectHubs: Record<string, SubjectHub> = {
  histology: {
    name: "Histology",
    covers: "Cells, extracellular matrix, the four basic tissue families, organ microstructure and the interpretation of tissue sections.",
    why: "Recognising normal microscopic organisation gives you the reference framework for understanding organ function and later pathological change.",
    firstLesson: "histology-foundations-tissues",
    firstTitle: "Histology Foundations: The Four Basic Tissues",
    firstReason: "Learn a systematic identification method before applying it to individual organs and microscope sections.",
    topics: [
      { title: "Tissue families", lesson: "histology-foundations-tissues", description: "Compare epithelial, connective, muscle and nervous tissue using independent structural clues." },
      { title: "Reading sections", lesson: "microscopy", description: "Establish preparation, scale and orientation before interpreting a profile." },
      { title: "Linings and support", lesson: "epithelia", description: "Connect epithelial layers and cell shape with connective-tissue support." },
      { title: "Muscle and nervous tissue", lesson: "muscle-histology", description: "Distinguish contractile tissues, then study neurons, glia and myelin." },
      { title: "Organ identification", lesson: "renal-histology", description: "Use tissue architecture to reason from a section to an organ and its function." },
    ],
  },
  anatomy: {
    name: "Anatomy",
    covers: "Anatomical language, body regions, organ relationships, vessels, nerves and the development of major structures.",
    why: "A reliable three-dimensional map helps you describe findings precisely and understand how neighbouring structures influence clinical signs.",
    firstLesson: "anatomy-foundations",
    firstTitle: "Anatomy Foundations: Position, Planes and Organisation",
    firstReason: "Establish position, directions, planes and compartments before starting the regional course below.",
    topics: [], // The established six-stage AnatomyLearningPath supplies the regional map.
  },
  physiology: {
    name: "Physiology",
    covers: "Membrane transport, electrical signalling, muscle, organ-system function and the feedback mechanisms that maintain the internal environment.",
    why: "Mechanistic explanations help you predict a response to a change in conditions rather than memorise isolated normal values.",
    firstLesson: "physiology-membrane-foundations",
    firstTitle: "Physiology Foundations: Membrane Transport and Resting Potential",
    firstReason: "Connect permeability, energy and voltage before studying excitable cells and whole organs.",
    topics: [
      { title: "Transport and resting voltage", lesson: "physiology-membrane-foundations", description: "Classify transport mechanisms and explain a maintained resting state." },
      { title: "Excitation and contraction", lesson: "muscle-contraction", description: "Connect electrical signals, calcium and force in different muscle types." },
      { title: "Circulation", lesson: "cardiac-output", description: "Relate cardiac output, vascular resistance and regulation of flow." },
      { title: "Respiration and fluid balance", lesson: "ventilation-perfusion", description: "Begin with gas exchange, then follow renal handling of water and solutes." },
      { title: "Integrated control", lesson: "endocrine-feedback", description: "Trace feedback through a hormonal axis and distinguish cause from compensation." },
    ],
  },
  biochemistry: {
    name: "Biochemistry",
    covers: "Protein structure, enzyme function, metabolic pathways and the regulation of fuel and nitrogen handling.",
    why: "Understanding molecular mechanisms makes metabolic changes and biochemical measurements easier to interpret in their physiological context.",
    firstLesson: "biochemistry-enzyme-foundations",
    firstTitle: "Biochemistry Foundations: Enzymes, Kinetics and Regulation",
    firstReason: "Learn how to interpret rate, saturation and regulation before following individual metabolic pathways.",
    topics: [
      { title: "Enzymes and regulation", lesson: "biochemistry-enzyme-foundations", description: "Separate catalysis from equilibrium and use a simple kinetic model." },
      { title: "Protein structure", lesson: "protein-structure", description: "Connect folding and molecular interactions with protein function." },
      { title: "Carbohydrate metabolism", lesson: "glycolysis", description: "Follow carbon, energy transfer and regulated steps from glucose onwards." },
      { title: "Lipid metabolism", lesson: "lipid-metabolism", description: "Distinguish synthesis, oxidation and transport of lipid fuels." },
      { title: "Nitrogen and integration", lesson: "nitrogen-metabolism", description: "Connect amino-group transfer, urea production and nitrogen excretion." },
    ],
  },
  genetics: {
    name: "Genetics & Immunology",
    covers: "Genome organisation, inheritance, gene expression, genetic testing and the recognition and effector mechanisms of immune responses.",
    why: "Separate inherited information from cellular function, then apply that distinction to variation, disease mechanisms and immune-cell behaviour.",
    firstLesson: "genetics-genome-foundations",
    firstTitle: "Genetics Foundations: Genome, Inheritance and Gene Expression",
    firstReason: "Build a precise vocabulary for DNA, alleles and expression before studying inheritance patterns and immune mechanisms.",
    topics: [
      { title: "Genome and expression", lesson: "genetics-genome-foundations", description: "Distinguish the DNA sequence, its inheritance and its expressed products." },
      { title: "Meiosis and inheritance", lesson: "meiosis", description: "Follow segregation before calculating inheritance probabilities." },
      { title: "Genetic interpretation", lesson: "genetic-testing", description: "Connect a testing method with the biological question it can answer." },
      { title: "Innate and adaptive immunity", lesson: "innate-adaptive", description: "Begin the immunology strand with recognition, activation and memory." },
      { title: "Antigens and effectors", lesson: "antigen-presentation", description: "Connect antigen presentation with T cells, then study complement and hypersensitivity." },
    ],
  },
  biophysics: {
    name: "Biophysics",
    covers: "Transport, membrane electricity, mechanics, optics, radiation and the physical principles behind medical measurements.",
    why: "A physical model lets you make a quantitative prediction, check units and recognise when an assumption limits the conclusion.",
    firstLesson: "biophysics-membrane-foundations",
    firstTitle: "Biophysics Foundations: Diffusion, Osmosis and Membranes",
    firstReason: "Start with gradients, geometry and permeability, then progress to the existing theory and practical course.",
    topics: [
      { title: "Diffusion and membranes", lesson: "biophysics-membrane-foundations", description: "State the moving substance, permeability and boundary conditions before calculating." },
      { title: "Light and image formation", lesson: "biophysics-radiation-optics", description: "Establish units and optical principles before using lenses and instruments." },
      { title: "Flow and electrical signals", lesson: "biophysics-fluid-flow", description: "Use pressure, resistance and membrane models to explain transport and signalling." },
      { title: "Medical imaging", lesson: "biophysics-ct-imaging", description: "Connect physical interactions and measured signals with an image." },
      { title: "Practical measurement", lesson: "biophysics-practical-diffusion", description: "Test a transport prediction and distinguish the model from the measured quantity." },
    ],
  },
  "cell-biology": {
    name: "Molecular & Cell Biology",
    covers: "DNA maintenance, RNA processing, protein synthesis and targeting, cellular signalling and molecular methods.",
    why: "Following information and molecules through a cell connects genetic instructions with the structures and mechanisms that perform a function.",
    firstLesson: "dna-replication",
    firstTitle: "DNA replication",
    firstReason: "Start with template direction and DNA synthesis before tracing RNA and protein production.",
    topics: [
      { title: "Copy and repair DNA", lesson: "dna-replication", description: "Follow complementary synthesis and the mechanisms that preserve DNA information." },
      { title: "Process RNA", lesson: "rna-processing", description: "Distinguish a primary transcript from a mature message." },
      { title: "Make and deliver proteins", lesson: "translation", description: "Connect decoding with targeting, trafficking and quality control." },
      { title: "Signals and methods", lesson: "cell-signaling", description: "Follow a signal to a response, then connect molecular questions with experimental methods." },
    ],
  },
};

export const newEntryLessonIds = [
  "physiology-membrane-foundations",
  "biochemistry-enzyme-foundations",
  "genetics-genome-foundations",
  "biophysics-membrane-foundations",
];
