import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire, Module } from 'node:module';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { validateVisualLearning } from '../scripts/visual-learning-schema.mjs';
const read = path => JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf8'));
const content = name => read(`../src/content/${name}.json`);
const data = { visuals: content('lesson-visuals').visuals, lessons: content('library-lessons').lessons, references: content('lesson-references'), figures: content('public-figures').figures, catalog: content('public-catalog').records, audit: read('../docs/visual-learning-audit.json').records };
test('every public resource has a visual decision and every new visual has valid placements and references', () => {
  assert.doesNotThrow(()=>validateVisualLearning(data));
  assert.equal(data.audit.length, 261);
  assert.equal(data.lessons.length, 241);
  assert.equal(data.visuals.length, 41);
});
test('visual validation rejects missing descriptions, invalid row shapes, sources, rights and stale audit records', () => {
  for (const mutate of [d=>{d.visuals[0].alt='';},d=>{d.visuals[0].rows[0].pop();},d=>{d.visuals[0].referenceIds=['unknown'];},d=>{d.figures[0].publicApproval='';},d=>{d.audit.pop();},d=>{d.audit[0].figureIds=[];}]) {
    const invalid=structuredClone(data);mutate(invalid);assert.throws(()=>validateVisualLearning(invalid));
  }
});
test('reused images retain real provenance and include observation prompts', () => {
  const release=content('public-release');
  for(const f of data.figures) {
    assert(f.observe.length>40);assert(readFileSync(new URL('../'+f.evidence,import.meta.url)).length);
    for(const variant of f.variants) assert(release.assets.some(a=>'/'+a.path===variant.src));
  }
  assert.equal(data.figures.filter(f=>f.kind==='micrograph').length,2);
});
test('model comparisons retain mathematical and physiological qualifications', () => {
  const v=id=>data.visuals.find(v=>v.id===id);
  const flow=JSON.stringify(v('flow-scaling'));
  assert.match(flow,/16/);assert.match(flow,/laminar/);assert.equal(2**4,16);assert.equal(.5**4,1/16);
  const recessive=JSON.stringify(v('recessive-cross'));
  assert.match(recessive,/2\/3|two.*three/i);assert.match(recessive,/independent/i);
  const inhibition=JSON.stringify(v('enzyme-inhibition-models'));
  assert.match(inhibition,/competitive/i);assert.match(inhibition,/pure/i);
  assert.match(JSON.stringify(v('mhc-pathways')),/cross-presentation/i);
  assert.match(JSON.stringify(v('diffusion-osmosis')),/pressure/i);
});
const filename=fileURLToPath(new URL('../src/components/study-visual.tsx',import.meta.url));
const compiled=ts.transpileModule(readFileSync(filename,'utf8'),{compilerOptions:{jsx:ts.JsxEmit.ReactJSX,module:ts.ModuleKind.CommonJS}}).outputText;
const visualModule=new Module(filename);visualModule.filename=filename;visualModule.require=createRequire(filename);visualModule._compile(compiled,filename);
const {StudyVisual,VisualComparison,VisualFlow}=visualModule.exports;
test('shared component renders an accessible figure with independent description, observation and attribution',()=>{
 const html=renderToStaticMarkup(React.createElement(StudyVisual,{title:'Matrix and cells',alt:'Fibres and ground substance surround dispersed cells.',caption:'A schematic of connective tissue proper.',observe:'Distinguish the cells from extracellular material.',credit:'Original schematic; AI-assisted.',sources:[{title:'Scientific reference',url:'https://example.org/reference'}]},React.createElement('span',null,'Visual content')));
 for(const text of ['<figure','aria-label="Matrix and cells"','<figcaption>','<summary>Read a text description</summary>','Fibres and ground substance','Observe and explain:','Original schematic','href="https://example.org/reference"'])assert(html.includes(text));
});
test('comparison has semantic headers and complete mobile text; flow does not rely on arrows alone',()=>{
 const html=renderToStaticMarkup(React.createElement(VisualComparison,{title:'Compare',headers:['Tissue','Cells','Matrix'],rows:[['A','Few','Abundant'],['B','Many','Little']]}));
 assert.equal((html.match(/scope="col"/g)||[]).length,3);assert.equal((html.match(/scope="row"/g)||[]).length,2);
 for(const cell of ['Few','Abundant','Many','Little'])assert.equal(html.split(cell).length-1,2);
 const flow=renderToStaticMarkup(React.createElement(VisualFlow,{label:'Pathway',steps:['First labelled step','Second labelled step']}));
 assert.match(flow,/<ol[^>]*aria-label="Pathway"/);assert.match(flow,/aria-hidden="true"/);assert(flow.includes('Second labelled step'));
});
