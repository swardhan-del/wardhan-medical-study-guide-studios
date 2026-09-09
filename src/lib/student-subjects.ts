import { librarySubjects, subjectRecords } from "./taxonomy";
import { studyPaths } from "@/content/study-paths";
export const studentSubjects = librarySubjects;
export const availableLessons = (id: string) => subjectRecords(id).filter(r => r.kind === "Study lesson" || r.kind === "Renal course lesson");
export function subjectDestination(id: string) {
  if (!availableLessons(id).length) return `/subjects/${id}`;
  return ["histology-i", "histology-ii", "genetics", "immunology"].includes(id) ? `/library?subject=${id}` : `/study/${id}`;
}
export function firstLesson(id: string) {
  const lessons = availableLessons(id);
  const preferred = id === "immunology" ? "innate-adaptive" : id === "histology-ii" ? "neurulation" : studyPaths[id === "histology-i" ? "histology" : id]?.start;
  return lessons.find(r => r.id === preferred) ?? lessons[0];
}
