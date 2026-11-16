"use client";

import dynamic from "next/dynamic";

// Keep the pilot interaction out of unrelated lessons' startup scripts.
// Server rendering still provides the labelled figure without JavaScript.
export const VolumeOneDiagramEntry = dynamic(() =>
  import("./volume-one-diagram").then(module => module.VolumeOneDiagramActivity),
);
