import { curriculumOrders, beginnerLinks } from './curriculum-order.ts';
export type StudyPath = { start: string; preparation: string; gaps: string[] };
const additionalGaps: Record<string, string[]> = {
  "biophysics": [
    "Current university syllabus alignment beyond the historical notes",
    "Supervised instrument handling and interpretation of original experimental images",
    "Independent specialist review and a larger assessment bank"
  ],
  "anatomy": [
    "University-specific syllabus alignment and supervised dissection",
    "A comprehensive labelled cadaveric and radiological identification atlas",
    "Independent specialist review and additional advanced regional detail"
  ],
  "histology": [
    "Nervous tissue and brainstem practical identification",
    "Eye and ear histology",
    "Endocrine organ comparisons",
    "A comprehensive slide-identification collection"
  ],
  "cell-biology": [
    "Chromatin and epigenetic regulation",
    "Transcriptional control and regulatory RNA",
    "Protein quality control and ER-associated degradation"
  ],
  "biochemistry": [
    "Haem, iron and bilirubin metabolism",
    "Nucleotide synthesis and degradation",
    "Integrated tissue metabolism and laboratory assays"
  ],
  "physiology": [
    "Systematic ECG interpretation and worked traces",
    "Blood groups and laboratory interpretation",
    "Detailed endocrine axes",
    "Comprehensive sensory and reflex pathways"
  ],
  "genetics": [
    "Population and quantitative genetics",
    "Detailed genetic laboratory methods",
    "Hypersensitivity and immune deficiency",
    "Transplantation and tumour immunology"
  ]
};

// Compatibility projection for the existing sampler and coverage views, not a second curriculum.
export const studyPaths: Record<string, StudyPath> = Object.fromEntries(
  Object.entries(curriculumOrders).map(([subject, order]) => [subject, {
    start: order.sampleLesson, preparation: order.orientationPreparation ?? order.reason,
    gaps: [...new Set([...order.stages.flatMap(stage => stage.planned ?? []), ...additionalGaps[subject]])],
  }]),
);
export const beginnerSequences = beginnerLinks;
