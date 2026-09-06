import data from "@/content/subject-directory.json";

export type DirectoryEntry = {
  id: string;
  title: string;
  subjects: string[];
  baseSubject: string;
  category: string;
  collection: string;
  kind: string;
  url: string;
  trail: string;
  parentId: string | null;
  format?: string;
  updatedAt?: string | null;
};
export const directorySubjects = data.subjects;
export const directoryEntries: DirectoryEntry[] = data.entries;
export const directoryUpdatedAt = data.updatedAt;
export function entriesForSubject(id: string) {
  return directoryEntries.filter((e) =>
    id === "histology"
      ? e.baseSubject === "histology"
      : e.subjects.includes(id),
  );
}
export const directoryCategories = [
  ["printable", "Printable guide collections"],
  ["topics", "Topic libraries"],
  ["lectures", "Official lectures & course material"],
  ["visuals", "Diagrams & STEM visuals"],
  ["textbooks", "Textbooks & atlases"],
  ["notes", "Study guides & notes"],
  ["exam", "Exam preparation"],
] as const;
