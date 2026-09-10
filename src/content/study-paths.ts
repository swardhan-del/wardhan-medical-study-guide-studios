export type StudyPath = { start: string; preparation: string; gaps: string[] };

// Editorial study map, not an official syllabus or an exam-readiness score.
export const studyPaths: Record<string, StudyPath> = {
  biophysics: {
    start: "biophysics-radiation-optics",
    preparation: "Review SI units, powers of ten, logarithms and rearranging equations. Follow the theory sequence, then use the practical lessons to apply each model.",
    gaps: ["Current university syllabus alignment beyond the historical notes", "Supervised instrument handling and interpretation of original experimental images", "Independent specialist review and a larger assessment bank"],
  },
  anatomy: {
    start: "thoracic-cage-landmarks",
    preparation: "Review anatomical position, directional terms and body planes. Follow the five-volume course from landmarks to regional relationships and development.",
    gaps: ["University-specific syllabus alignment and supervised dissection", "A comprehensive labelled cadaveric and radiological identification atlas", "Independent specialist review and additional advanced regional detail"],
  },
  histology: {
    start: "microscopy",
    preparation: "Begin with microscopy, then epithelia and connective tissue before moving to organ sections.",
    gaps: ["Nervous tissue and brainstem practical identification", "Eye and ear histology", "Endocrine organ comparisons", "A comprehensive slide-identification collection"],
  },
  "cell-biology": {
    start: "dna-replication",
    preparation: "Review DNA base pairing and the distinction between a gene, a chromosome and a protein.",
    gaps: ["Chromatin and epigenetic regulation", "Transcriptional control and regulatory RNA", "Protein quality control and ER-associated degradation"],
  },
  biochemistry: {
    start: "protein-structure",
    preparation: "Start with protein structure and enzyme kinetics before following metabolic pathways.",
    gaps: ["Haem, iron and bilirubin metabolism", "Nucleotide synthesis and degradation", "Integrated tissue metabolism and laboratory assays"],
  },
  physiology: {
    start: "fluid-and-membrane-transport",
    preparation: "Start with fluid compartments and membrane transport, then membrane potentials before studying organ systems.",
    gaps: ["Systematic ECG interpretation and worked traces", "Blood groups and laboratory interpretation", "Detailed endocrine axes", "Comprehensive sensory and reflex pathways"],
  },
  genetics: {
    start: "meiosis",
    preparation: "For genetics, begin with meiosis and inheritance. For immunology, begin with innate and adaptive responses before antigen presentation.",
    gaps: ["Population and quantitative genetics", "Detailed genetic laboratory methods", "Hypersensitivity and immune deficiency", "Transplantation and tumour immunology"],
  },
};

// The same first steps appear on Start Here and each subject learning page.
export const beginnerSequences: Record<string, { title: string; href: string }[]> = {
  anatomy: [{ title: "Anatomical position, directions and planes", href: "/start/anatomy" }, { title: "Identify thoracic cage landmarks", href: "/library/thoracic-cage-landmarks" }, { title: "Choose a volume in the 120-lesson course", href: "/study/anatomy/guide" }],
  histology: [{ title: "Read a histology section", href: "/library/microscopy" }, { title: "Classify epithelia", href: "/library/epithelia" }, { title: "Connect cells to their matrix", href: "/library/connective-tissue" }],
  "cell-biology": [{ title: "Follow DNA replication", href: "/library/dna-replication" }, { title: "Process an RNA message", href: "/library/rna-processing" }, { title: "Translate the message", href: "/library/translation" }],
  biochemistry: [{ title: "Connect protein structure to function", href: "/library/protein-structure" }, { title: "Explain enzyme kinetics", href: "/library/enzyme-kinetics" }, { title: "Follow glycolysis", href: "/library/glycolysis" }],
  physiology: [{ title: "Fluid compartments and membrane transport", href: "/library/fluid-and-membrane-transport" }, { title: "Explain membrane potentials", href: "/library/membrane-potentials" }, { title: "Connect excitation to muscle contraction", href: "/library/muscle-contraction" }],
  genetics: [{ title: "Follow chromosomes through meiosis", href: "/library/meiosis" }, { title: "Reason through inheritance", href: "/library/inheritance" }, { title: "Compare innate and adaptive responses", href: "/library/innate-adaptive" }],
  biophysics: [{ title: "Begin with light and units", href: "/library/biophysics-radiation-optics" }, { title: "Form an image", href: "/library/biophysics-image-formation" }, { title: "Explain wave optics", href: "/library/biophysics-wave-optics" }],
};
