import { readFileSync } from 'node:fs';
import { validateVisualLearning } from './visual-learning-schema.mjs';
const read = path => JSON.parse(readFileSync(path, 'utf8'));
const content = name => read(`src/content/${name}.json`);
const data = { visuals: content('lesson-visuals').visuals, lessons: content('library-lessons').lessons, references: content('lesson-references'), figures: content('public-figures').figures, catalog: content('public-catalog').records, audit: read('docs/visual-learning-audit.json').records };
validateVisualLearning(data);
console.log(`Visual standard passed: ${data.visuals.length} original visuals; ${data.figures.length} approved figures; ${data.audit.length} audited public resources.`);
