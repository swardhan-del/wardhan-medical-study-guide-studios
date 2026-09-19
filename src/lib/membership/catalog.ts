// Public, non-teaching metadata only. These IDs are synthetic, not commercial allocations.
export const pilotModules = [
  { id: "synthetic-foundation", title: "Foundation access check", tier: "basic", assetId: "synthetic-foundation-download" },
  { id: "synthetic-deeper", title: "Deeper-module access check", tier: "advanced", assetId: "synthetic-deeper-download" },
] as const;
export type ModuleId = (typeof pilotModules)[number]["id"];
export const findPilotModule = (id: string) => pilotModules.find(module => module.id === id);
