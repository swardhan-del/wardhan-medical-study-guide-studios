export type StudyPath = { start: string; preparation: string; gaps: string[] };

// Editorial study map, not an official syllabus or an exam-readiness score.
export const studyPaths: Record<string, StudyPath> = {
  biophysics: {
    start: "biophysics-membrane-foundations",
    preparation: "Begin with diffusion, osmosis and membranes. Review units and rearranging equations, then follow the theory and practical sequences.",
    gaps: ["Current university syllabus alignment beyond the historical notes", "Supervised instrument handling and interpretation of original experimental images", "Independent specialist review and a larger assessment bank"],
  },
  anatomy: {
    start: "anatomy-foundations",
    preparation: "Begin with anatomical position, directions, planes, body cavities and tissue-to-organ organisation. Then apply this framework to the five regional volumes.",
    gaps: ["University-specific syllabus alignment and supervised dissection", "A comprehensive labelled cadaveric and radiological identification atlas", "Independent specialist review and additional advanced regional detail"],
  },
  histology: {
    start: "histology-foundations-tissues",
    preparation: "Begin with the four basic tissues, then practise reading sections with microscopy, epithelia and connective tissue before moving to organs.",
    gaps: ["Nervous tissue and brainstem practical identification", "Eye and ear histology", "Endocrine organ comparisons", "A comprehensive slide-identification collection"],
  },
  "cell-biology": {
    start: "dna-replication",
    preparation: "Review DNA base pairing and the distinction between a gene, a chromosome and a protein.",
    gaps: ["Chromatin and epigenetic regulation", "Transcriptional control and regulatory RNA", "Protein quality control and ER-associated degradation"],
  },
  biochemistry: {
    start: "biochemistry-enzyme-foundations",
    preparation: "Start with enzymes, kinetics and regulation, then connect protein structure with metabolic pathways.",
    gaps: ["Haem, iron and bilirubin metabolism", "Nucleotide synthesis and degradation", "Integrated tissue metabolism and laboratory assays"],
  },
  physiology: {
    start: "physiology-membrane-foundations",
    preparation: "Start with membrane transport and resting potential before studying organ systems.",
    gaps: ["Systematic ECG interpretation and worked traces", "Blood groups and laboratory interpretation", "Detailed endocrine axes", "Comprehensive sensory and reflex pathways"],
  },
  genetics: {
    start: "genetics-genome-foundations",
    preparation: "For genetics, begin with genome organisation, expression and inheritance, then study meiosis. For immunology, begin with innate and adaptive responses before antigen presentation.",
    gaps: ["Population and quantitative genetics", "Detailed genetic laboratory methods", "Hypersensitivity and immune deficiency", "Transplantation and tumour immunology"],
  },
};

// The same first steps appear on Start Here and each subject learning page.
export const beginnerSequences: Record<string, { title: string; href: string }[]> = {
  anatomy: [{ title: "Anatomy foundations: position, planes and organisation", href: "/library/anatomy-foundations" }, { title: "Identify thoracic cage landmarks", href: "/library/thoracic-cage-landmarks" }, { title: "Choose a volume in the 120-lesson course", href: "/study/anatomy/guide" }],
  histology: [{ title: "Recognise the four basic tissues", href: "/library/histology-foundations-tissues" }, { title: "Read a histology section", href: "/library/microscopy" }, { title: "Classify epithelia", href: "/library/epithelia" }],
  "cell-biology": [{ title: "Follow DNA replication", href: "/library/dna-replication" }, { title: "Process an RNA message", href: "/library/rna-processing" }, { title: "Translate the message", href: "/library/translation" }],
  biochemistry: [{ title: "Enzymes, kinetics and regulation", href: "/library/biochemistry-enzyme-foundations" }, { title: "Explain enzyme kinetics", href: "/library/enzyme-kinetics" }, { title: "Follow glycolysis", href: "/library/glycolysis" }],
  physiology: [{ title: "Membrane transport and resting potential", href: "/library/physiology-membrane-foundations" }, { title: "Explain membrane potentials", href: "/library/membrane-potentials" }, { title: "Connect excitation to muscle contraction", href: "/library/muscle-contraction" }],
  genetics: [{ title: "Genome, inheritance and gene expression", href: "/library/genetics-genome-foundations" }, { title: "Reason through inheritance", href: "/library/inheritance" }, { title: "Compare innate and adaptive responses", href: "/library/innate-adaptive" }],
  biophysics: [{ title: "Diffusion, osmosis and membranes", href: "/library/biophysics-membrane-foundations" }, { title: "Form an image", href: "/library/biophysics-image-formation" }, { title: "Explain wave optics", href: "/library/biophysics-wave-optics" }],
};
