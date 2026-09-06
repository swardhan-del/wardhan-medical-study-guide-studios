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
      "Explore the organization of the body, from regional anatomy to development.",
    topics: [
      "Regional anatomy",
      "Thorax and abdomen",
      "Musculoskeletal system",
      "Embryology",
    ],
  },
  {
    id: "histology",
    number: "02",
    title: "Microscopic Anatomy & Histology",
    description: "Connect cells and tissues with the structures they form.",
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
    description: "Follow the molecular processes that shape cellular life.",
    topics: ["Cell organization", "Molecular mechanisms", "Cell signaling"],
  },
  {
    id: "biochemistry",
    number: "04",
    title: "Biochemistry",
    description:
      "Organize the molecules, pathways, and reactions that underpin medical science.",
    topics: ["Biomolecules", "Metabolic pathways", "Molecular foundations"],
  },
  {
    id: "physiology",
    number: "05",
    title: "Medical Physiology",
    description:
      "Build connections between cellular mechanisms and the function of whole systems.",
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
      "Revisit inheritance, variation, and the organization of immune responses.",
    topics: ["Genetics", "Inheritance and variation", "Immunology"],
  },
];
