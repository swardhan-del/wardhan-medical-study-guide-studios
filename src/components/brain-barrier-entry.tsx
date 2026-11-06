"use client";
import dynamic from "next/dynamic";
export const BrainBarrierEntry = dynamic(() => import("./brain-barrier-explorer").then(module => module.BrainBarrierExplorer));
