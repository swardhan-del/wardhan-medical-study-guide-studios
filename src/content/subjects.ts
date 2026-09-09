export type SubjectInterest = {
  id: string;
  number: string;
  title: string;
  description: string;
  topics: readonly string[];
};
export const subjectInterests: ReadonlyArray<SubjectInterest> = [
  {
    id: "anatomy",
    number: "01",
    title: "Macroscopic Anatomy & Embryology",
    description:
      "Study the organisation of the human body and connect anatomical relationships with development.",
    topics: [
      "Regional anatomy",
      "Thorax",
      "Abdomen",
      "Musculoskeletal system",
      "Embryology",
    ],
  },
  {
    id: "histology",
    number: "02",
    title: "Microscopic Anatomy, Histology & Embryology",
    description:
      "Recognise cells, tissues, and organs, and connect microscopic structure with function and development.",
    topics: [
      "Cells and tissues",
      "Organ histology",
      "Microscopic structure",
      "Integrated embryology",
    ],
  },
  {
    id: "cell-biology",
    number: "03",
    title: "Molecular & Cell Biology",
    description:
      "Explore how cells organise, communicate, divide, and maintain their genetic information.",
    topics: ["Cell organization", "Molecular mechanisms", "Cell signaling"],
  },
  {
    id: "biochemistry",
    number: "04",
    title: "Biochemistry",
    description:
      "Connect molecular structure, enzyme activity, and metabolic pathways to the workings of the body.",
    topics: ["Biomolecules", "Metabolic pathways", "Molecular foundations"],
  },
  {
    id: "physiology",
    number: "05",
    title: "Medical Physiology",
    description:
      "Understand how body systems function, interact, and maintain a stable internal environment.",
    topics: [
      "Cellular physiology",
      "Cardiovascular physiology",
      "Respiratory physiology",
      "Renal and acid–base physiology",
    ],
  },
  {
    id: "genetics",
    number: "06",
    title: "Genetics & Immunology",
    description:
      "Study inheritance, genetic variation, and immune responses through connected explanations and practice.",
    topics: ["Genetics", "Inheritance and variation", "Immunology"],
  },
  {
    id: "biophysics",
    number: "07",
    title: "Biophysics",
    description: "Connect physics with medicine through optics, radiation, imaging, transport, membranes and worked practical measurements.",
    topics: ["Physical principles", "Practical calculations", "Biophysics"],
  },
];
