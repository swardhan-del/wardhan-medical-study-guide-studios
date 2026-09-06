import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
const root = '.next/server';
for (const path of readdirSync(root, { recursive: true })) {
  if (String(path).endsWith('.nft.json')) {
    const trace = JSON.parse(readFileSync(join(root, String(path)), 'utf8'));
    if (trace.files.some(file => /(^|\/)\.private\//.test(file))) throw new Error('Private curation data entered a deployment trace.');
  }
}
console.log('Deployment trace checks passed: private curation data is excluded.');
