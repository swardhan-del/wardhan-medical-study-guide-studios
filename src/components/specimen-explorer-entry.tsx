"use client";

import dynamic from "next/dynamic";

// Load specimen controls only for lessons that render them. Server rendering
// retains the approved image and text alternatives without JavaScript.
export const SpecimenExplorerEntry = dynamic(() =>
  import("./lymphoid-specimen-explorer").then(module => module.LymphoidSpecimenExplorer)
);

// The epithelial sequence reads its two existing questions from the practice
// bank. Load that sequence where it is used, not on every library lesson.
export const HistologyVisualEntry = dynamic(() =>
  import("./histology-visual-lesson").then(module => module.HistologyVisualLesson)
);
