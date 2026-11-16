import { foundations } from "./foundations";
import anatomy from "./anatomy-course.json";

type Vocabulary = { terms: [string, string][]; source?: string };
const volumeVocabulary: Record<number, Vocabulary> = {
  1: { terms: foundations.anatomy.terms.slice(5) },
  2: {
    terms: [
      ["Parietal peritoneum", "The layer lining the abdominal wall."],
      ["Visceral peritoneum", "The layer covering abdominal organs."],
    ],
    source: "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-1-overview-of-the-digestive-system",
  },
  3: {
    terms: [
      ["Perineum", "The region below the pelvic diaphragm."],
      ["Perineal membrane", "A fascial sheet that forms the lower boundary of the deep perineal space."],
    ],
    source: "https://www.ncbi.nlm.nih.gov/books/NBK538272/",
  },
  4: {
    terms: [
      ["Brainstem", "The midbrain, pons and medulla oblongata."],
      ["Nucleus", "A collection of nerve cell bodies within the central nervous system."],
    ],
    source: "https://www.ncbi.nlm.nih.gov/books/NBK544297/",
  },
  5: {
    terms: [
      ["Joint cavity", "The space filled with synovial fluid inside a synovial joint."],
      ["Articular cartilage", "The layer of cartilage covering the articulating surfaces of the bones."],
    ],
    source: "https://openstax.org/books/anatomy-and-physiology-2e/pages/9-4-synovial-joints",
  },
};

export function anatomyVocabulary(lessonId: string): Vocabulary {
  const volume = anatomy.records.find(record => record.lessonId === lessonId)?.volume;
  return volume === undefined ? { terms: foundations.anatomy.terms.slice(0, 5) } : volumeVocabulary[volume];
}
