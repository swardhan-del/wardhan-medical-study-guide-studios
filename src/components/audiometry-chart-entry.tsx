"use client";

import dynamic from "next/dynamic";

// Load the audiometry chart only on its lesson, like other specimen explorers.
export const AudiometryChartEntry = dynamic(() =>
  import("./audiometry-chart-explorer").then(module => module.AudiometryChartExplorer),
);
