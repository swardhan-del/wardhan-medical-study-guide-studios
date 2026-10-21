import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, mkdirSync, mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { hasGitWorktree } from '../scripts/content-quality-git.mjs';
import { createHash } from 'node:crypto';
import { allowsLessonIndexing, validateQuality, explainedQuestions, containsPrivateReference, resolvedLinks, validDate } from '../src/lib/content-quality.ts';
import { qualityLessons, qualityAllowsIndexing, lessonQuality } from '../src/lib/lesson-quality.ts';
import { indexablePages } from '../src/lib/search-pages.ts';
const today = '2026-10-01';
const lesson = structuredClone(qualityLessons.find(l => l.id === 'physiology-membrane-foundations'));
const evidence = ['editorial', 'accessibility', 'readability', 'assessment', 'visual', 'clinical'].map(scope => ({ id: scope, scope, lessonId: lesson.id, reviewedAt: today, reviewer: 'Test reviewer', qualification: 'Test qualification', independent: scope === 'clinical', record: 'docs/reviews/test-only.md', contentSha256: createHash('sha256').update(JSON.stringify(lesson.content)).digest('hex') }));
const record = () => ({ lessonId: lesson.id, title: lesson.title, subject: lesson.subject, slug: lesson.slug, topic: 'Membrane physiology', learnerLevel: 'Early medical sciences', objectives: [...lesson.objectives], sources: [{ title: 'Test citation', publisherOrAuthor: 'Test publisher', citation: 'Test edition and section', accessedAt: today, sourceType: 'textbook' }], contentStatus: 'medical-review-pending', visualStatus: 'not-required', visualRequired: false, visualNotes: 'Test text-only decision', assessmentStatus: 'explanations-complete', accessibilityStatus: 'checked', readabilityStatus: 'checked', indexStatus: 'indexable', lastReviewedAt: today, nextReviewAt: '2027-10-01', limitations: ['Not patient-care guidance.'], reviewEvidenceIds: ['editorial', 'accessibility', 'readability'], links: { prerequisite: [], next: [], related: ['membrane-potentials'], compare: [] } });
const check = (q, l = lesson, e = evidence) => validateQuality(q, l, qualityLessons, e, today);
test('complete indexable record supports explicit pending medical review without claiming clinical review', () => assert.deepEqual(check(record()), []));
test('indexable quality gates reject missing sources, objectives, decisions, evidence and dates', () => {
  for (const mutate of [q=>q.sources=[], q=>q.objectives=[], q=>q.objectives=['Unaligned objective'], q=>q.contentStatus='draft', q=>q.visualStatus='planned', q=>q.visualStatus='rights-review-pending', q=>q.visualRequired=true, q=>q.assessmentStatus='questions-planned', q=>q.accessibilityStatus='pending', q=>q.readabilityStatus='pending', q=>q.reviewEvidenceIds=[], q=>q.lastReviewedAt=null, q=>q.nextReviewAt=null, q=>q.limitations=[]]) {
    const q=record();mutate(q);assert(check(q).length>0, JSON.stringify(q));
  }
});
test('each multiple-choice option and open question needs a real explanation', () => {
  for(const mutate of [l=>l.questions[0].options[0].explanation=' ', l=>l.questions[0].answer=99, l=>l.questions=[], l=>l.prompts[0].explanation='']) {
    const l=structuredClone(lesson);mutate(l);assert.equal(explainedQuestions(l),false);assert(check(record(),l).some(e=>/question/.test(e)));
  }
});
test('draft noindex record can describe pending work honestly', () => {
  const q=record();Object.assign(q,{contentStatus:'draft',indexStatus:'noindex-pending-review',sources:[],objectives:[],visualRequired:true,visualStatus:'planned',assessmentStatus:'questions-planned',accessibilityStatus:'pending',readabilityStatus:'pending',reviewEvidenceIds:[],lastReviewedAt:null,nextReviewAt:null});assert.deepEqual(check(q),[]);
});
test('clinical, assessment and published visual claims require matching scoped evidence', () => {
  for(const [field,value,scope] of [['contentStatus','independently-clinically-reviewed','clinical'],['assessmentStatus','reviewed','assessment'],['visualStatus','approved-and-published','visual']]) {
    const q=record();q[field]=value;assert(check(q).some(e=>e.includes(scope)));q.reviewEvidenceIds.push(scope);assert.deepEqual(check(q),[]);
  }
  const q=record();q.contentStatus='independently-clinically-reviewed';q.reviewEvidenceIds.push('clinical');assert(check(q,lesson,evidence.map(e=>({...e,independent:false}))).some(e=>e.includes('clinical')));
  assert(check(record(),lesson,evidence.map(e=>({...e,lessonId:'someone-else'}))).length>0);
});
test('reject malformed metadata, impossible/future dates, stale review and unsafe source URLs', () => {
  for(const q of [null,[],{...record(),sources:[null]}, {...record(),links:{}}, {...record(),lastReviewedAt:'2026-02-31'}, {...record(),lastReviewedAt:'2030-01-01'}, {...record(),nextReviewAt:today}, {...record(),contentStatus:'peer-reviewed'}, {...record(),sources:[{...record().sources[0],url:'https://example.org/master.docx'}]}, {...record(),sources:[{...record().sources[0],url:'javascript:alert(1)'}]}]) assert(check(q).length>0);
  assert.equal(validDate('2026-02-31'),false);
  assert(check(record(),lesson,evidence.map(e=>({...e,reviewedAt:'2000-01-01'}))).length>0);
});
test('private and encoded raw paths cannot enter public quality records', () => {
  for(const path of ['/.private/source.docx','/%2eprivate%2fsource.pdf','/%252eprivate%252fsource.pdf','https://www.dropbox.com/s/a/file','https://dl.dropboxusercontent.com/a','file:///tmp/master.docx','/Users/name/source.pdf','C:\\Users\\name\\source.docx']) {
    assert(containsPrivateReference(path),path);const q=record();q.limitations=[path];assert(check(q).some(e=>/private/.test(e)));
  }
  assert.equal(containsPrivateReference('https://openstax.org/books/biology-2e'),false);
});
test('relationship resolver only emits valid unique non-self native lesson targets in all four roles', () => {
  const links=Object.fromEntries(['prerequisite','next','related','compare'].map(k=>[k,['membrane-potentials','bogus',lesson.id,'membrane-potentials']]));
  const groups=resolvedLinks(lesson.id,links,qualityLessons);assert.equal(groups.length,4);for(const g of groups) assert.deepEqual(g.lessons.map(l=>l.href),['/library/membrane-potentials']);
  const q=record();q.links=links;assert(check(q).some(e=>e.includes('unknown or self')));
  assert.deepEqual(resolvedLinks(lesson.id,{},qualityLessons),[]);
});
test('legacy coverage is frozen to 249 lessons without manufacturing review evidence or changing indexing', () => {
  const baseline=JSON.parse(readFileSync(new URL('../src/content/lesson-quality-legacy.json',import.meta.url)));
  assert.equal(Object.keys(baseline.lessons).length,249);assert(qualityLessons.length>=249);
  for(const l of qualityLessons.filter(l=>!lessonQuality.some(q=>q.lessonId===l.id))){assert.equal(baseline.lessons[l.id],createHash('sha256').update(JSON.stringify(l.content)).digest('hex'));assert(qualityAllowsIndexing(l.id));assert(indexablePages.some(p=>p.path===l.href));}
});

test('explicit noindex overrides legacy eligibility, while new lessons fail closed without a complete record', () => {
  const allow=(q,legacy=false)=>allowsLessonIndexing(lesson,q,qualityLessons,evidence,legacy,today);
  assert.equal(allow(undefined),false);assert.equal(allow(undefined,true),true);
  assert.equal(allow(record()),true);
  for(const indexStatus of ['noindex','noindex-pending-review']) assert.equal(allow({...record(),indexStatus},true),false);
  assert.equal(allow({...record(),sources:[]},true),false);
});

test('Git detection distinguishes a checkout from exported and incomplete deployment snapshots', () => {
  mkdirSync('output/phase-eleven', {recursive:true});
  const root=mkdtempSync('output/phase-eleven/git-probe-');
  try {
    assert.equal(hasGitWorktree(root),false); // Do not mistake the parent repository for this snapshot.
    mkdirSync(`${root}/.git`);writeFileSync(`${root}/.git/HEAD`,'incomplete deployment metadata');
    assert.equal(hasGitWorktree(root),false);
    rmSync(`${root}/.git`,{recursive:true});
    execFileSync('git',['init',root],{stdio:'pipe'});
    assert.equal(hasGitWorktree(root),true);
  } finally { rmSync(root,{recursive:true,force:true}); }
});

test('public bibliography home paths remain valid while local home roots and private references stay blocked', () => {
  const url='https://histology.leeds.ac.uk/home/bone/bone/';
  assert.equal(containsPrivateReference(url),false);
  const q=record();q.sources[0].url=url;assert.deepEqual(check(q),[]);
  for(const path of ['/home/author/master.pdf','/home/author/my guide.pdf','C:\\home\\author\\source.docx','Read /home/author/master.pdf','Read\n/home/author/master.pdf','`/home/author/master.pdf`','https://example.org/view?path=%252Fhome%252Fauthor%252Fmaster.pdf',`${url} and /home/author/master.pdf`]){
    assert(containsPrivateReference(path),path);
    assert(containsPrivateReference({citation:path}),path);
  }
  for(const path of [`${url}.private/master.pdf`,'https://example.org/.private/source.pdf','https://example.org/Users/name/source.pdf'])assert(containsPrivateReference(path),path);
});
