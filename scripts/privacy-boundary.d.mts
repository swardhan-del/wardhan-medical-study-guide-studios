type Policy = { files: Set<string>; names: Set<string>; approved: Map<string, string> };
export function makePolicy(manifest: unknown, assets?: { path: string; sha256: string }[]): Policy;
export function inspectText(input: string, policy: Policy, options?: { publicSurface?: boolean; digestManifest?: boolean }): string[];
