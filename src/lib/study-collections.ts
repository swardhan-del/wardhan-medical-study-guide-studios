import lessons from "@/content/library-lessons.json";
import data from "@/content/study-collections.json";
import { subjectInterests } from "@/content/subjects";
export const studySubjects = subjectInterests;
export const studyGroups = data.groups;
export const studyLessons = lessons.lessons;
export function subjectLessons(subject: string) { return studyLessons.filter(l => l.subject === subject); }
