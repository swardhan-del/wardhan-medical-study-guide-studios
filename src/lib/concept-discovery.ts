import { normalizeSearch } from "./catalog-filter.ts";

// Navigation aliases only. Teaching and answers remain in canonical lesson records.
const routes = [
  { pattern: /\b(action potential|action potentials|neuron fires|neurons fire)\b/, ids: ["membrane-potentials", "biophysics-action-potentials"] },
  { pattern: /\b(cardiac output|stroke volume)\b/, ids: ["cardiac-output"] },
  { pattern: /\b(arteries|artery|veins|vein|blood vessels|vessel histology)\b/, ids: ["vessel-histology"] },
  { pattern: /\b(km|michaelis|reaction velocity|enzyme kinetics)\b/, ids: ["enzyme-kinetics", "biochemistry-enzyme-foundations"] },
  { pattern: /\b(alveolar oxygen|alveolar gas|ventilation perfusion)\b/, ids: ["ventilation-perfusion"] },
];
export const conceptExamples = ["Why does an action potential occur?", "What determines cardiac output?", "How do I distinguish arteries and veins in histology?", "What does Km mean?", "Why does alveolar oxygen change?"];
export function conceptLessonIds(query: string): string[] {
  const normalized = normalizeSearch(query.slice(0, 200));
  // Do not present a broad keyword as an answer to a more specialised question.
  if (/\b(dose|dosing|treatment|treat|diagnose|patient|drug|surgery)\b/.test(normalized)) return [];
  return [...new Set(routes.filter(route => route.pattern.test(normalized)).flatMap(route => route.ids))];
}
export type ConceptLink = { id: string; title: string; prerequisites: { id: string; title: string }[]; worked: boolean };
