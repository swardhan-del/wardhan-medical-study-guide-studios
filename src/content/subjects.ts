export type SubjectInterest = {
  id: string;
  number: string;
  title: string;
  description: string;
};

export const subjectInterests: ReadonlyArray<SubjectInterest> = [
  {
    id: "anatomy-structure",
    number: "01",
    title: "Anatomy & structure",
    description: "A place for future resources that make structure easier to return to.",
  },
  {
    id: "physiology-systems",
    number: "02",
    title: "Physiology & systems",
    description: "A future home for resources that connect systems with clear sequence.",
  },
  {
    id: "molecular-foundations",
    number: "03",
    title: "Molecular foundations",
    description: "A future home for independently authored molecular-science learning resources.",
  },
  {
    id: "cellular-organization",
    number: "04",
    title: "Cellular organization",
    description: "A future home for carefully structured ways to revisit cellular ideas.",
  },
  {
    id: "genetics-immunity",
    number: "05",
    title: "Genetics & immunity",
    description: "A future home for resources built around connections worth remembering.",
  },
  {
    id: "clinical-study-skills",
    number: "06",
    title: "Clinical study skills",
    description: "A future home for practical approaches to building a durable study practice.",
  },
];

// Intentionally empty until a separate public release decision is recorded.
export const publicCollections: ReadonlyArray<never> = [];
