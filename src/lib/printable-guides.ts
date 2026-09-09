import data from "@/content/printable-guides.json";
export type GuidePart = { id: string; subject: string; number: string; title: string; lessonIds: string[]; basis: string; coverage: string; practiceHref: string | null };
export const guideParts: GuidePart[] = data.parts;
