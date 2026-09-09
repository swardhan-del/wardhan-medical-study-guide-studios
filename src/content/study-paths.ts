export type StudyPath = { start: string; preparation: string; gaps: string[] };

// Editorial study map, not an official syllabus or an exam-readiness score.
export const studyPaths: Record<string, StudyPath> = {
  biophysics: {
    start: "biophysics-radiation-optics",
    preparation: "Review SI units, powers of ten, logarithms and rearranging equations. Follow the theory sequence, then use the practical lessons to apply each model.",
    gaps: ["Current university syllabus alignment beyond the historical notes", "Supervised instrument handling and interpretation of original experimental images", "Independent specialist review and a larger assessment bank"],
  },
  anatomy: {
    start: "thorax-nerve-relations",
    preparation: "Review anatomical position, directional terms and body planes. Use the thorax directory for regional orientation.",
    gaps: ["Systematic regional embryology", "Detailed head and neck pathways", "Complete limb compartment and joint coverage"],
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
