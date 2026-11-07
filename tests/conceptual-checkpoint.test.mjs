import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateCheckpoint, reinforcementVariant, nextCheckpointIndex } from '../src/lib/conceptual-checkpoint.ts';
import { parseProgress, emptyProgress } from '../src/lib/learning-core.ts';
import { mergeProgress } from '../src/lib/progress-transfer.ts';
import definitions from '../src/content/typed-checkpoints.json' with {type:'json'};
import { practiceItems } from '../src/content/practice-registry.ts';
import { checkpointFor } from '../src/lib/checkpoint-adapter.ts';
const q = type => definitions.find(q=>q.type===type);
test('complete-set selection rejects subsets, extra choices, duplicates and invalid indices',()=>{
 const item=q('multiple');
 assert.equal(evaluateCheckpoint(item,[1,0]).outcome,'correct');
 for(const response of [[0],[1],[0,1,2]])assert.equal(evaluateCheckpoint(item,response).outcome,'incorrect');
 for(const response of [[],[0,0],[-1],[1.5],3])assert.equal(evaluateCheckpoint(item,response),null);
});
test('numeric answers check units, finite strict input and documented rounding boundaries',()=>{
 const item=q('numeric');
 for(const response of [{value:'100',unit:'mL/min'},{value:'0.1',unit:'L/min'},{value:'1e2',unit:'mL/min'},{value:'100.5',unit:'mL/min'}])assert.equal(evaluateCheckpoint(item,response).outcome,'correct');
 for(const response of [{value:'100.501',unit:'mL/min'},{value:'100',unit:'L/min'}])assert.equal(evaluateCheckpoint(item,response).outcome,'incorrect');
 for(const value of ['NaN','Infinity','1e309','100junk','100 mg','', '1,00'])assert.equal(evaluateCheckpoint(item,{value,unit:'mL/min'}),null);
 assert.equal(evaluateCheckpoint(item,{value:'100',unit:''}),null);
});
test('short response exact equivalents are checked, prose and negation remain unassessed',()=>{
 assert.equal(evaluateCheckpoint(q('short'),'  HEMATOXYLIN ').outcome,'correct');
 assert.equal(evaluateCheckpoint(q('short'),'not hematoxylin').outcome,'unassessed');
 assert.equal(evaluateCheckpoint(q('short'),'nuclear stain').outcome,'unassessed');
 assert.equal(evaluateCheckpoint(q('short'),''),null);
});
test('every existing objective answer and explanation survives its adapter',()=>{
 for(const item of practiceItems.filter(q=>q.options)){
  const adapted=checkpointFor(item);
  for(let i=0;i<item.options.length;i++){
   const result=evaluateCheckpoint(adapted,i);
   assert.equal(result.outcome,i===item.answer?'correct':'incorrect',item.id);
   assert.equal(result.explanation,item.options[i].explanation,item.id);
  }
 }
});
test('self review never claims correctness or stores prose through progress parsing',()=>{
 const item=practiceItems.find(q=>q.checkpoint?.type==='self-review').checkpoint;
 assert.equal(evaluateCheckpoint(item,'My explanation').outcome,'self-review');
 const state={...emptyProgress(),checkpoints:{[item.id]:{outcome:'self-review',response:'private explanation',at:1,submissions:1,misses:0,concept:item.id,selfAssessment:'review'}}};
 const parsed=parseProgress(JSON.stringify(state),[item.metadata.lesson],[item.id]);
 assert.equal(parsed.checkpoints[item.id].response,null);
 assert.deepEqual(parsed.answers,{});
 assert.equal(parsed.checkpoints[item.id].selfAssessment,'review');
});
test('import merge retains latest checkpoint without doubling and rejects unknown or invalid state',()=>{
 const record={outcome:'incorrect',response:[0],at:1,submissions:1,misses:1,concept:'directions'};
 const current={...emptyProgress(),checkpoints:{known:record}};
 const incoming={...emptyProgress(),checkpoints:{known:{...record,at:2,outcome:'correct',response:[0,1],submissions:2}}};
 const merged=mergeProgress(current,incoming);
 assert.equal(merged.checkpoints.known.at,2);
 assert.deepEqual(mergeProgress(merged,incoming),merged);
 assert.deepEqual(parseProgress(JSON.stringify(current),[],[]).checkpoints,{});
 const malformed={...current,checkpoints:{known:{...record,misses:5}}};
 assert.deepEqual(parseProgress(JSON.stringify(malformed),[],['known']).checkpoints,{});
});
test('progression selects next unanswered and reinforcement never repeats identical or completed questions',()=>{
 assert.equal(nextCheckpointIndex(['a','b','c'],['a'],0),1);
 assert.equal(nextCheckpointIndex(['a','b'],['b'],1),0);
 assert.equal(nextCheckpointIndex(['a'],['a'],0),-1);
 const item=q('numeric'), variant=item.variants[0];
 assert.equal(reinforcementVariant(item,[variant],[],[item.id]),variant);
 assert.equal(reinforcementVariant(item,[variant],[variant],[]),undefined);
 assert.equal(reinforcementVariant({...item,variants:[item.id]},[item.id],[],[]),undefined);
});
test('definitions have existing source mappings, unique IDs and no private paths',()=>{
 const ids=practiceItems.map(q=>q.id);assert.equal(new Set(ids).size,ids.length);
 for(const item of practiceItems){const definition=checkpointFor(item);if(!definition)continue;assert.ok(definition.metadata.sources.length,item.id);assert.ok(definition.metadata.concept,item.id);assert.doesNotMatch(JSON.stringify(definition),/\/Users\/|dropbox\.com|rlkey=|sk-[A-Za-z0-9]{20}/);}
});
test('binary statements retain explicit truth values and teach the mechanism',()=>{
 const item=q('boolean');
 assert.equal(evaluateCheckpoint(item,0).outcome,'correct');
 const wrong=evaluateCheckpoint(item,1);assert.equal(wrong.outcome,'incorrect');assert.equal(wrong.answer,'True');assert.match(wrong.explanation,/conservative model/);
 assert.equal(evaluateCheckpoint(item,2),null);
});
test('published reinforcement links target a different verified definition of the same concept',()=>{
 for(const item of definitions)for(const id of item.variants??[]){
  const variant=definitions.find(q=>q.id===id);assert.ok(variant,id);assert.notEqual(variant.id,item.id);assert.notEqual(variant.prompt,item.prompt);assert.equal(variant.metadata.concept,item.metadata.concept);assert.ok(variant.metadata.sources.length);
 }
});

test('numeric response parsing preserves accepted whitespace and rejects malformed objects safely',()=>{
 const item=q('numeric');const response={value:' 100 ',unit:'mL/min'};
 assert.equal(evaluateCheckpoint(item,response).outcome,'correct');
 const raw={...emptyProgress(),checkpoints:{[item.id]:{outcome:'correct',response,at:1,submissions:1,misses:0,concept:item.metadata.concept}}};
 const parsed=parseProgress(JSON.stringify(raw),[item.metadata.lesson],[item.id]);
 assert.equal(evaluateCheckpoint(item,parsed.checkpoints[item.id].response).outcome,'correct');
 for(const invalid of [null,{}, {value:100,unit:'mL/min'},{value:'100'}])assert.equal(evaluateCheckpoint(item,invalid),null);
});
