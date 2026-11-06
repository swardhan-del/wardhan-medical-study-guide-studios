"use client";

import dynamic from "next/dynamic";

export const ReproductiveRouteEntry = dynamic(() =>
  import("./reproductive-route-explorer").then(module => module.ReproductiveRouteExplorer)
);
