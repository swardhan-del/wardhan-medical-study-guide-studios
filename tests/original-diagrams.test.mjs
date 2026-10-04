import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {createRequire, Module} from 'node:module';
import {fileURLToPath} from 'node:url';
import ts from 'typescript';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {originalDiagramIds, firstPassConcentration, observedConcentration, flowFromIndicator} from '../src/lib/original-diagram-models.ts';
import {validateVisualLearning} from '../scripts/visual-learning-schema.mjs';
import {inspectText, makePolicy} from '../scripts/privacy-boundary.mjs';
const read=path=>JSON.parse(readFileSync(path,'utf8'));
const content=name=>read(`src/content/${name}.json`);
const fixture=read('tests/fixtures/phase-sixteen-preservation.json');
const data={visuals:content('lesson-visuals').visuals,lessons:content('library-lessons').lessons,references:content('lesson-references'),figures:content('public-figures').figures,catalog:content('public-catalog').records,audit:read('docs/visual-learning-audit.json').records};
const sha=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
const diagrams=data.visuals.filter(v=>v.kind==='svg');
const placements=['chromatin-access-and-topology','er-protein-quality-control','cell-signaling','cardiac-output'];
const require=createRequire(import.meta.url);
const compile=(relative,resolve)=>{
 const file=fileURLToPath(new URL(relative,import.meta.url)), mod=new Module(file);mod.filename=file;
 mod.require=resolve??createRequire(file);
 mod._compile(ts.transpileModule(readFileSync(file,'utf8'),{compilerOptions:{jsx:ts.JsxEmit.ReactJSX,module:ts.ModuleKind.CommonJS,esModuleInterop:true,target:ts.ScriptTarget.ES2022}}).outputText,file);
 return mod.exports;
};
const drawing=compile('../src/components/original-diagrams.tsx',id=>id==='../lib/original-diagram-models'?require('../src/lib/original-diagram-models.ts'):require(id));
const shared=compile('../src/components/study-visual.tsx');
const {LessonVisuals}=compile('../src/components/lesson-visuals.tsx',id=>id==='./original-diagrams'?drawing:id==='./study-visual'?shared:id==='@/content/lesson-visuals.json'?content('lesson-visuals'):id==='@/content/lesson-references.json'?data.references:require(id));
const render=v=>renderToStaticMarkup(React.createElement(LessonVisuals,{lessonId:v.lessonIds[0]}));

test('exactly four original diagrams fill distinct existing curriculum objectives',()=>{
 assert.deepEqual(diagrams.map(v=>v.id),[...originalDiagramIds]);
 assert.deepEqual(diagrams.map(v=>v.lessonIds),placements.map(id=>[id]));
 assert.equal(new Set(diagrams.map(v=>v.knowledgeCheck.id)).size,4);
 const registry=content('learning-registry');
 for(const v of diagrams)assert(!registry.learningQuestionIds.includes(v.knowledgeCheck.id));
 assert(!diagrams.some(v=>v.lessonIds.includes('indicator-dilution')),'Flow must remain distinct from equilibrium compartment volume');
 assert.doesNotThrow(()=>validateVisualLearning(data));
});

test('existing routes, teaching text, questions, order, progress, sources, visuals and review gates are preserved',()=>{
 assert.equal(fixture.base,'10d3252f2032b09cac87cf85cd6b43cf9bb17871');
 for(const [path,hash] of Object.entries(fixture.fileHashes))assert.equal(createHash('sha256').update(readFileSync(path)).digest('hex'),hash,path);
 assert.equal(sha(data.visuals.filter(v=>v.kind!=='svg')),fixture.visualsSha256);
 const priorReferences=structuredClone(data.references);
 for(const [id,before] of Object.entries(fixture.appendedReferences)){
  const now=priorReferences[id];
  if(before.hasSupportingReferences)now.supportingReferences=now.supportingReferences.slice(0,before.supportingCount);else delete now.supportingReferences;
 }
 assert.equal(sha(priorReferences),fixture.referenceSha256);
});

test('every original renders named SVG semantics, full text alternatives, observation, feedback and citations',()=>{
 for(const v of diagrams){
  const html=render(v);
  for(const field of ['alt','caption','observe','explanation'])assert(v[field].length>40,`${v.id}: ${field}`);
  assert.match(html,/<svg[^>]*viewBox="0 0 760 \d+"[^>]*role="img"[^>]*aria-labelledby="[^"]+"[^>]*aria-describedby="[^"]+"/);
  assert.match(html,/<title id="[^"]+">/);assert.match(html,/<desc id="[^"]+">/);
  assert.match(html,/<figcaption>/);assert.match(html,/Observe and explain:/);
  assert(html.includes('Original diagram — Wardhan Medical Study Guide Studios.'));
  assert(html.includes('Show the explained answer'));
  assert(html.includes(v.knowledgeCheck.explanation.replaceAll('&','&amp;').replaceAll('>','&gt;').replaceAll('<','&lt;')));
  for(const url of v.sourceUrls)assert(html.includes(`href="${url}"`),`${v.id}: visible scientific source`);
  assert.match(html,/scientific, editorial and human accessibility review.*pending/i);
  assert.doesNotMatch(html,/<(?:image|animate|animateTransform|foreignObject|script)\b|data:image\//i);
 }
});

test('multiple SVG instances keep independent title, description, hatch and arrow IDs',()=>{
 const element=v=>React.createElement(drawing.OriginalDiagram,{key:v.key,...v});
 const v=diagrams[0];
 const html=renderToStaticMarkup(React.createElement(React.Fragment,null,[element({...v,key:'a'}),element({...v,key:'b'})]));
 const ids=[...html.matchAll(/ id="([^"]+)"/g)].map(m=>m[1]);
 assert.equal(new Set(ids).size,ids.length);
 for(const reference of html.matchAll(/url\(#([^\)]+)\)/g))assert(ids.includes(reference[1]));
});

test('scientific structure keeps octamer stoichiometry, cytosolic ERAD and distinct receptor mechanisms',()=>{
 const chromatin=render(diagrams[0]);
 for(const histone of ['H2A','H2B','H3','H4'])assert.equal(chromatin.split(`data-histone="${histone}"`).length-1,2);
 assert.match(chromatin,/does not automatically turn gene expression on or off/);
 assert.match(chromatin,/not a fixed universal 30-nm fibre/);
 const er=render(diagrams[1]);
 for(const stage of ['retrotranslocation','ubiquitin','proteasome'])assert(er.includes(`data-erad-stage="${stage}" data-compartment="cytosol"`));
 assert.match(er,/UPR does not always cause apoptosis/);assert.match(er,/Extraction and tagging can be coupled/);
 const signalling=render(diagrams[2]);
 assert.match(signalling,/data-transmembrane-passes="7"/);assert.match(signalling,/GDP → GTP exchange on Gα/);
 assert.match(signalling,/Gα and\/or Gβγ/);assert.match(signalling,/Dimerisation or/);assert.match(signalling,/rearrangement/);
 assert.match(signalling,/Not every GPCR uses cAMP/);assert.match(signalling,/One example, not every RTK output/);
});

test('first-pass curve conserves indicator amount and separates flow from recirculation',()=>{
 const integrate=fn=>{let total=0;const dt=.0005;for(let t=dt/2;t<5;t+=dt)total+=fn(t)*dt;return total;};
 const a=integrate(t=>firstPassConcentration(t,5)),b=integrate(t=>firstPassConcentration(t,10));
 assert(Math.abs(a-1)<1e-7);assert(Math.abs(b-.5)<1e-7);
 assert.equal(flowFromIndicator(5,1),5);assert.equal(flowFromIndicator(5,.5),10);
 assert.equal(observedConcentration(.3),firstPassConcentration(.3));
 assert(observedConcentration(.8)>firstPassConcentration(.8));
 assert(integrate(observedConcentration)>a*1.4);
 for(const [dose,auc] of [[0,1],[5,0],[NaN,1],[5,-1],[5,Infinity]])assert.throws(()=>flowFromIndicator(dose,auc));
 for(const value of [NaN,Infinity,-1,0])assert.throws(()=>firstPassConcentration(1,value));
 assert.match(render(diagrams[3]),/not stroke volume per beat/);
});

test('missing feedback, unmapped citations or fabricated review approval fails visual validation',()=>{
 for(const mutate of [v=>{v.caption='';},v=>{v.alt='';},v=>{v.observe='';},v=>{v.explanation='';},v=>{v.sourceUrls=['https://example.org/unmapped'];},v=>{v.knowledgeCheck.explanation='';},v=>{v.sourceCheckedAt='invalid';},v=>{v.scientificStatus='approved';},v=>{v.reviewEvidenceIds=['invented'];},v=>{v.authorship='source-image';}]){
  const bad=structuredClone(data);mutate(bad.visuals.find(v=>v.kind==='svg'));assert.throws(()=>validateVisualLearning(bad));
 }
});

test('new SVG source, metadata and server-rendered HTML respect the actual private-intake deny policy',()=>{
 const policy=makePolicy(read('scripts/private-intake-fingerprints.json'));
 for(const path of ['src/components/original-diagrams.tsx','src/lib/original-diagram-models.ts'])assert.deepEqual(inspectText(readFileSync(path,'utf8'),policy,{publicSurface:true}),[],path);
 for(const v of diagrams){assert.deepEqual(inspectText(JSON.stringify(v),policy,{publicSurface:true}),[]);assert.deepEqual(inspectText(render(v),policy,{publicSurface:true}),[]);}
});
