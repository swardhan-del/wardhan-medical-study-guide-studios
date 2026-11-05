export type ShortAnswerRule = { expected: string; accepted: readonly string[]; alternatives: readonly string[]; explanation: string };

export function checkHistologyName(input: string, rule: ShortAnswerRule) {
  const value = input.normalize("NFKC").toLocaleLowerCase("en").trim().replace(/[.!?]+$/g, "").replace(/[-–—]/g, " ").replace(/\s+/g, " ");
  if (!value) return { state: "empty", message: "Type one short name before checking." } as const;
  if (rule.accepted.includes(value)) return { state: "matched", message: `Name matched: ${rule.expected}. ${rule.explanation}` } as const;
  if (rule.alternatives.includes(value)) return { state: "contrast", message: `That names a different structure or origin. Compare with ${rule.expected}. ${rule.explanation}` } as const;
  return { state: "unassessed", message: `This wording was not assessed. Compare your meaning with ${rule.expected}. ${rule.explanation} A longer, qualified or negated sentence is not marked correct by this checker.` } as const;
}

export const histologyNames = [
  { id: "hev-name", prompt: "Name the specialised blood vessel through which circulating lymphocytes enter a lymph node.", expected: "high endothelial venule", accepted: ["hev", "hevs", "high endothelial venule", "high endothelial venules"], alternatives: ["afferent lymphatic", "afferent lymphatics", "efferent lymphatic", "subcapsular sinus"], explanation: "HEVs are postcapillary blood vessels; afferent lymphatics bring lymph into the sinus system." },
  { id: "hev-place", prompt: "Name the main lymph-node region containing HEVs in this lesson.", expected: "paracortex", accepted: ["paracortex", "paracortical region", "paracortical zone", "deep cortex"], alternatives: ["medulla", "subcapsular sinus", "germinal centre", "germinal center"], explanation: "The paracortex is a tissue region. The HEV is a vessel within it; the two names do not denote the same entity." },
  { id: "thymus-pouch", prompt: "Which pharyngeal pouch supplies the human thymic epithelial primordium? Type the pouch name.", expected: "third pharyngeal pouch", accepted: ["third pharyngeal pouch", "3rd pharyngeal pouch", "third pouch", "3rd pouch", "third", "3"], alternatives: ["fourth", "4", "fourth pouch", "fourth pharyngeal pouch", "second", "second pouch"], explanation: "This describes the epithelial primordium. It does not assign the same lineage to incoming haematopoietic cells." },
] satisfies readonly (ShortAnswerRule & { id: string; prompt: string })[];
