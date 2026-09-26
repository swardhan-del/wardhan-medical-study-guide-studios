import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { validateMeasurement, eventForPath, completedSummary } from '../src/lib/measurement-events.ts';
import { consentChoice, consentLifetime, consentKey, legacyOptOutKey, makeConsent, validPublicConfig } from '../src/lib/measurement-consent.ts';
import { measurementConfig, measurementStatus, collectMeasurement } from '../src/lib/measurement-server.ts';
import registry from '../src/content/measurement-registry.json' with { type: 'json' };

const env = { MEASUREMENT_PROVIDER: 'http', MEASUREMENT_ENDPOINT: 'https://collector.example.invalid/events', MEASUREMENT_TOKEN: 'server-only-fixture-secret', MEASUREMENT_RECIPIENT_NAME: 'Fixture recipient', MEASUREMENT_PRIVACY_URL: 'https://collector.example.invalid/privacy' };
const config = measurementConfig(env).public;
const valid = [
  {version:1,event:'subject_selected',subject_id:'anatomy'},
  {version:1,event:'lesson_opened',lesson_id:'histology-foundations-tissues'},
  {version:1,event:'quiz_completed',quiz_id:'renal-challenge'},
  {version:1,event:'summary_saved',lesson_id:'anatomy-foundations'},
  {version:1,event:'starter_pack_requested',asset_id:'study-guide-starter-pack'},
  {version:1,event:'waitlist_submitted'},
];
const makeRequest = (body=valid[0], headers={}, url='https://study.example/api/measurement') => new Request(url, {method:'POST',headers:{'content-type':'application/json',origin:'https://study.example','x-measurement-consent':config.consentVersion,...headers},body:typeof body==='string'?body:JSON.stringify(body)});

test('only the six exact public event schemas are accepted, with no arbitrary or private fields', () => {
  for (const event of valid) {
    assert.deepEqual(validateMeasurement(event),event);
    for (const key of ['email','answer','score','url','referrer','user_id','session_id','timestamp','text','token','__proto__']) assert.equal(validateMeasurement({...event,[key]:'private-marker@example.com'}),null,key);
  }
  for (const value of [null,[],true,{}, {version:1,event:'page_view'}, {...valid[0],subject_id:'my name'}, {...valid[1],lesson_id:'../../review'}, {...valid[2],quiz_id:'free form answer'}, {...valid[4],asset_id:'https://private.example'}, {...valid[0],version:2}]) assert.equal(validateMeasurement(value),null);
});

test('route measurement ignores private pages, query strings, fragments and unknown identifiers', () => {
  assert.deepEqual(eventForPath('/study/anatomy'),valid[0]);
  assert.deepEqual(eventForPath('/library/histology-foundations-tissues'),valid[1]);
  for (const path of ['/study','/study/planner','/review','/library/private','/library?email=private@example.com','/library/epithelia#private','/library/epithelia?answer=private']) assert.equal(eventForPath(path),null,path);
  const source = JSON.stringify(registry);
  assert(!source.includes('correctAnswer') && !source.includes('prompt') && !source.includes('explanation'));
});

test('summary events require a complete saved checklist and never contain checkbox values or writing', () => {
  const ids = Object.keys(registry.summaryDrafts).filter(id => registry.summaryDrafts[id]==='anatomy-foundations');
  const drafts = Object.fromEntries(ids.map(id=>[id,'yes']));
  assert.equal(completedSummary(ids[0],drafts),'anatomy-foundations');
  assert.equal(completedSummary(ids[0],{...drafts,[ids.at(-1)]:''}),null);
  assert.equal(completedSummary('oral-anatomy-foundations',{'oral-anatomy-foundations':'private essay'}),null);
});

test('consent is explicit, time-limited, policy-bound and conservative for legacy preferences', () => {
  const now=1700000000000;
  assert.equal(consentChoice(null,config,now,false),'undecided');
  assert.equal(consentChoice('0',config,now,false),'undecided');
  assert.equal(consentChoice('broken',config,now,false),'undecided');
  assert.equal(consentChoice(makeConsent('granted',config.consentVersion,now),config,now,false),'granted');
  assert.equal(consentChoice(makeConsent('granted',config.consentVersion,now),config,now,true),'denied');
  assert.equal(consentChoice(makeConsent('denied',config.consentVersion,now),config,now,false),'denied');
  for (const decidedAt of [now+1,now-consentLifetime]) assert.equal(consentChoice(makeConsent('granted',config.consentVersion,decidedAt),config,now,false),'undecided');
  assert.equal(consentChoice(makeConsent('granted','old-policy',now),config,now,false),'undecided');
  assert.equal(consentChoice(makeConsent('granted',config.consentVersion,now),{enabled:false},now,false),'undecided');
  assert.equal(validPublicConfig({...config,privacyUrl:'javascript:alert(1)'}).enabled,false);
});

test('environment-only configuration is off by default, in previews/private review, and when incomplete', async () => {
  assert.equal(measurementConfig({}).public.enabled,false);
  for (const key of Object.keys(env)) { const incomplete={...env};delete incomplete[key];assert.equal(measurementConfig(incomplete).public.enabled,false,key); }
  for (const extra of [{VERCEL_ENV:'preview'},{VERCEL_ENV:'development'},{LOCAL_CURATION_REVIEW:'1'},{MEASUREMENT_PROVIDER:'unknown'},{MEASUREMENT_ENDPOINT:'http://localhost/collect'},{MEASUREMENT_ENDPOINT:'https://127.0.0.1/collect'},{MEASUREMENT_ENDPOINT:'https://a:b@example.com/collect'},{MEASUREMENT_ENDPOINT:'https://collector.example/collect?token=secret'},{MEASUREMENT_PRIVACY_URL:'https://collector.example/privacy#token'}]) assert.equal(measurementConfig({...env,...extra}).public.enabled,false,JSON.stringify(extra));
  assert.equal(measurementConfig({...env,VERCEL_ENV:'production'}).public.enabled,true);
  const status=measurementStatus(env), payload=await status.json();
  assert.deepEqual(payload,config); assert(!JSON.stringify(payload).includes(env.MEASUREMENT_TOKEN)); assert(!JSON.stringify(payload).includes(env.MEASUREMENT_ENDPOINT));
  assert.equal(status.headers.get('cache-control'),'private, no-store');
  for (const changes of [{MEASUREMENT_POLICY_VERSION:'2'},{MEASUREMENT_RECIPIENT_NAME:'New recipient'},{MEASUREMENT_ENDPOINT:'https://another.example.invalid/events'}]) assert.notEqual(measurementConfig({...env,...changes}).public.consentVersion,config.consentVersion);
});

test('collector rejects absent/stale consent, privacy signals, cross-origin, queries and unsafe bodies without forwarding', async () => {
  let calls=0;const send=async()=>{calls++;return new Response(null,{status:204});};
  for (const headers of [{'x-measurement-consent':''},{'x-measurement-consent':'old'}, {dnt:'1'}, {'sec-gpc':'1'}, {origin:'https://evil.example'}, {'sec-fetch-site':'cross-site'}]) assert.equal((await collectMeasurement(makeRequest(valid[0],headers),env,send)).status,403);
  assert.equal((await collectMeasurement(makeRequest(valid[0],{},'https://study.example/api/measurement?email=private'),env,send)).status,403);
  assert.equal((await collectMeasurement(makeRequest(valid[0],{'content-type':'text/plain'}),env,send)).status,415);
  for (const body of ['{','x'.repeat(513),JSON.stringify({...valid[0],email:'private@example.com'})]) assert.equal((await collectMeasurement(makeRequest(body),env,send)).status,400);
  assert.equal(calls,0);
});

test('collector forwards only reconstructed event JSON and server credentials, with bounded failure behaviour', async () => {
  let captured;
  const response=await collectMeasurement(makeRequest(valid[1],{'user-agent':'student-browser',cookie:'student-cookie','x-forwarded-for':'198.51.100.1',referer:'https://study.example/?email=private'}),env,async(url,init)=>{captured={url,init};return new Response(null,{status:204});});
  assert.equal(response.status,204);
  assert.equal(captured.url,env.MEASUREMENT_ENDPOINT);
  assert.deepEqual(JSON.parse(captured.init.body),valid[1]);
  assert.deepEqual(captured.init.headers,{'Content-Type':'application/json',Authorization:`Bearer ${env.MEASUREMENT_TOKEN}`});
  assert.equal(captured.init.redirect,'error'); assert(captured.init.signal instanceof AbortSignal);
  assert.equal((await collectMeasurement(makeRequest(),env,async()=>new Response(null,{status:500}))).status,503);
  assert.equal((await collectMeasurement(makeRequest(),env,async()=>{throw new Error('provider secret error');})).status,503);
  let called=false;
  assert.equal((await collectMeasurement(makeRequest(),{},async()=>{called=true;})).status,204);assert.equal(called,false);
});

let counter=0;
async function browserHarness(fn, options={}) {
  const names=['window','navigator','localStorage','location','fetch'];
  const descriptors=Object.fromEntries(names.map(name=>[name,Object.getOwnPropertyDescriptor(globalThis,name)]));
  const storage=new Map(), requests=[], target=new EventTarget();
  target.setTimeout=setTimeout;
  const navigator={doNotTrack:'0',globalPrivacyControl:false};
  const globals={window:target,navigator,location:{pathname:'/library/anatomy-foundations'},localStorage:{getItem:key=>{if(options.blockStorage) throw new Error('blocked');return storage.get(key)??null;},setItem:(key,value)=>{if(options.blockStorage)throw new Error('blocked');storage.set(key,value);},removeItem:key=>storage.delete(key)},fetch:async(url,init={})=>{requests.push({url,init});if(options.failNetwork)throw new Error('blocked');return init.method==='POST'?new Response(null,{status:204}):Response.json(options.config??config);}};
  try {
    for (const [key,value] of Object.entries(globals))Object.defineProperty(globalThis,key,{value,configurable:true,writable:true});
    const client=await import(`../src/lib/learning-analytics.ts?test=${counter++}`);
    const unsubscribe=client.subscribeMeasurement(()=>{});
    await client.loadMeasurement();
    try {await fn({client,storage,requests,navigator,target,globals});await new Promise(setImmediate);}finally{unsubscribe();}
  } finally {for(const name of names){if(descriptors[name])Object.defineProperty(globalThis,name,descriptors[name]);else delete globalThis[name];}}
}
const posts=requests=>requests.filter(r=>r.init.method==='POST');

test('browser sends nothing before opt-in, never backfills, and stops after withdrawal',()=>browserHarness(async({client,requests})=>{
  client.learningEvent(valid[0]);assert.equal(posts(requests).length,0);
  client.setMeasurementConsent('denied');client.learningEvent(valid[1]);assert.equal(posts(requests).length,0);
  assert(client.setMeasurementConsent('granted'));assert.equal(posts(requests).length,0);
  client.learningEvent(valid[1]);assert.equal(posts(requests).length,1);
  const sent=posts(requests)[0];assert.deepEqual(JSON.parse(sent.init.body),valid[1]);assert.equal(sent.url,'/api/measurement');assert.equal(sent.init.credentials,'omit');assert.equal(sent.init.referrerPolicy,'no-referrer');
  client.setMeasurementConsent('denied');assert(sent.init.signal.aborted);client.learningEvent(valid[2]);assert.equal(posts(requests).length,1);
}));

test('browser honours cross-tab revocation, DNT/GPC and storage clearing',()=>browserHarness(async({client,requests,storage,target,navigator})=>{
  client.setMeasurementConsent('granted');
  navigator.doNotTrack='1';client.learningEvent(valid[0]);assert.equal(posts(requests).length,0);
  navigator.doNotTrack='0';navigator.globalPrivacyControl=true;assert.equal(client.setMeasurementConsent('granted'),false);client.learningEvent(valid[0]);assert.equal(posts(requests).length,0);
  navigator.globalPrivacyControl=false;client.learningEvent(valid[0]);const sent=posts(requests)[0];
  storage.set(consentKey,makeConsent('denied',config.consentVersion,Date.now()));const event=new Event('storage');Object.defineProperty(event,'key',{value:consentKey});target.dispatchEvent(event);
  assert(sent.init.signal.aborted);client.learningEvent(valid[0]);assert.equal(posts(requests).length,1);
  storage.clear();client.learningEvent(valid[0]);assert.equal(posts(requests).length,1);
}));

test('legacy allow does not imply consent; legacy refusal stays refused',()=>browserHarness(async({client,storage,requests})=>{
  storage.set(legacyOptOutKey,'0');client.learningEvent(valid[0]);assert.equal(posts(requests).length,0);
  storage.set(legacyOptOutKey,'1');assert.equal(client.measurementSnapshot().choice,'denied');
  assert(client.setMeasurementConsent('granted'));assert.equal(storage.has(legacyOptOutKey),false);
}));

test('remaining subscribers still receive preference changes after another subscriber unmounts',()=>browserHarness(async({client})=>{
  const removeFirst=client.subscribeMeasurement(()=>{});
  let lastChoice;
  const removeSecond=client.subscribeMeasurement(()=>{lastChoice=client.measurementSnapshot().choice;});
  removeFirst();
  assert(client.setMeasurementConsent('granted'));
  assert.equal(lastChoice,'granted');
  assert(client.setMeasurementConsent('denied'));
  assert.equal(lastChoice,'denied');
  removeSecond();
}));

test('a later explicit grant in another tab replaces a persisted refusal without backfilling',()=>browserHarness(async({client,storage,requests,target})=>{
  client.setMeasurementConsent('denied');
  client.learningEvent(valid[0]);
  storage.set(consentKey,makeConsent('granted',config.consentVersion,Date.now()));
  const event=new Event('storage');Object.defineProperty(event,'key',{value:consentKey});target.dispatchEvent(event);
  assert.equal(client.measurementSnapshot().choice,'granted');
  assert.equal(posts(requests).length,0);
  client.learningEvent(valid[1]);
  assert.equal(posts(requests).length,1);
}));

test('blocked storage, missing configuration and failed network do not throw or queue events',async()=>{
  for (const options of [{blockStorage:true},{config:{enabled:false}},{failNetwork:true}]) await browserHarness(async({client,requests})=>{
    client.setMeasurementConsent('granted');assert.doesNotThrow(()=>client.learningEvent(valid[0]));assert.equal(posts(requests).length,0);
  },options);
  await browserHarness(async({client,requests})=>{client.setMeasurementConsent('granted');globalThis.fetch=()=>Promise.reject(new Error('blocked'));client.learningEvent(valid[0]);await new Promise(setImmediate);assert.equal(posts(requests).length,0);});
});

test('future conversion hooks require confirmed success and carry no email or resource URL',()=>browserHarness(async({client,requests})=>{
  client.setMeasurementConsent('granted');
  client.recordStarterPackRequested(false);client.recordWaitlistSubmitted(false);assert.equal(posts(requests).length,0);
  client.recordStarterPackRequested(true);client.recordWaitlistSubmitted(true);
  assert.deepEqual(posts(requests).map(r=>JSON.parse(r.init.body)),[valid[4],valid[5]]);
}));

test('no vendor SDK or automatic production activation remains',()=>{
  const pkg=JSON.parse(readFileSync(new URL('../package.json',import.meta.url),'utf8'));
  assert(!pkg.dependencies['@vercel/analytics']);
  assert(!readFileSync(new URL('../next.config.ts',import.meta.url),'utf8').includes('NEXT_PUBLIC_LEARNING_ANALYTICS'));
});
