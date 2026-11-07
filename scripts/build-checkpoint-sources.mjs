import { readFileSync, writeFileSync } from 'node:fs';
import { renalLessons } from '../src/content/renal-course.ts';
import { anatomyLearningPages } from '../src/content/anatomy-learning.ts';
const read = name => JSON.parse(readFileSync(new URL('../src/content/'+name, import.meta.url), 'utf8'));
const library=read('library-lessons.json'), sources=read('library-sources.json');
const result={};
for(const l of library.lessons){
 const source=sources[l.source];
 const basis=/study.guide|manuscript|teaching deck/i.test(JSON.stringify(source))?'study-guide-based':'supplemental-reference-based';
 result[l.id]={subject:l.subject,lesson:l.id,topic:l.title,subtopic:l.section,concept:'',difficulty:'introductory',prerequisites:l.prerequisites??[],sources:[{title:source.title,locator:l.section,basis}]};
}
for(const l of renalLessons) result[l.slug]={subject:'physiology',lesson:l.slug,topic:l.title,subtopic:l.sourceSection,concept:'',difficulty:'applied',prerequisites:[],sources:[{title:'Medical Physiology: Renal Physiology, Revision 15',locator:l.sourceSection,basis:'study-guide-based'}]};
for(const p of anatomyLearningPages) for(const l of p.lessons) result['anatomy-'+l.id]={subject:'anatomy',lesson:'anatomy-'+p.slug,topic:p.title,subtopic:l.title,concept:'',difficulty:'introductory',prerequisites:[],sources:[{title:l.reference,locator:l.title,basis:'study-guide-based'}]};
const thorax=read('thorax-practice.json');
result['anatomy-thorax']={subject:'anatomy',lesson:'anatomy-thorax',topic:'Thorax relationships',subtopic:'Thoracic compartments and structure-function relationships',concept:'',difficulty:'applied',prerequisites:[],sources:[{title:'Volume I — Thorax, Heart, Lungs & Mediastinum',basis:'study-guide-based'},...thorax.sources.map(s=>({title:s.title,url:s.url,locator:s.sections,basis:'supplemental-reference-based'}))]};
result['renal-experiments']={...result['afferent-efferent'],subtopic:'Afferent and efferent resistance in the simplified renal circuit'};
const path=new URL('../src/content/checkpoint-sources.json',import.meta.url), value=JSON.stringify(result,null,2)+'\n';
if(process.argv.includes('--check')) {if(readFileSync(path,'utf8')!==value)throw Error('Checkpoint sources are stale');} else writeFileSync(path,value);
console.log(Object.keys(result).length+' source mappings preserved; no new primary-lecture verification claimed.');
