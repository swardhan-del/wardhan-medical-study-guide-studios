export type LibraryLesson = {
  id: string;
  subject: string;
  title: string;
  summary: string;
  tags: string[];
  source: string;
  section: string;
  steps: { title: string; body: string }[];
  question: {
    prompt: string;
    options: { text: string; reason: string }[];
    answer: number;
  };
  recall: { prompt: string; answer: string };
  related: string[];
  updatedAt: string;
  minutes: number;
  objectives?: string[];
  prerequisites?: string[];
  workedExample?: { title: string; prompt: string; solution: string[] };
};
export type LibrarySource = {
  title: string;
  edition: string;
  recordId: string;
  context: string;
  reference?: { title: string; url: string };
};
