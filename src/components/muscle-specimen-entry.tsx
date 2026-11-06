"use client";

import dynamic from "next/dynamic";

// Keep this lesson-specific interaction out of unrelated lesson bundles.
// Default server rendering preserves the image and text when JavaScript is disabled.
export const MuscleSpecimenEntry = dynamic(() =>
  import("./muscle-specimen-explorer").then(module => module.MuscleSpecimenExplorer)
);
