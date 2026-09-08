import data from "@/content/public-figures.json";
export type PublicFigure = (typeof data.figures)[number];
export const publicFigures = data.figures;
export const figuresForTopic = (id: string) =>
  publicFigures.filter((f) => f.topicIds.includes(id));
export const figuresForResource = (id: string) =>
  publicFigures.filter((f) => f.resourceIds.includes(id));
export const figureForSubject = (id: string) =>
  publicFigures.find((f) => f.subjectIds.includes(id));
