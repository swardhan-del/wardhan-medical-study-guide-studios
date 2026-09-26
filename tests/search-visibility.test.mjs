import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { searchPages, searchPage, indexablePages, canonicalResourcePath } from '../src/lib/search-pages.ts';
import { searchMetadata } from '../src/lib/search-metadata.ts';
import { getSiteUrl, isIndexable } from '../src/lib/site-url.ts';
import { shouldNoIndex, robotsPolicy } from '../src/lib/search-policy.ts';
import { resourceBreadcrumbs } from '../src/lib/search-breadcrumbs.ts';
import { websiteGraph, lessonSchema, breadcrumbSchema, courseSchema, collectionGraph, serializeStructuredData } from '../src/lib/structured-data.ts';
import { topicGuides } from '../src/content/topic-guides.ts';
import lessons from '../src/content/library-lessons.json' with { type: 'json' };
import catalog from '../src/content/public-catalog.json' with { type: 'json' };
const origin = 'https://example.edu';
const envKeys = ['VERCEL', 'VERCEL_ENV', 'VERCEL_URL', 'VERCEL_PROJECT_PRODUCTION_URL', 'NEXT_PUBLIC_SITE_URL', 'LOCAL_CURATION_REVIEW'];
function withEnv(values, fn) {
  const previous = Object.fromEntries(envKeys.map(key => [key, process.env[key]]));
  try { for (const key of envKeys) { delete process.env[key]; if (values[key] !== undefined) process.env[key] = values[key]; } return fn(); }
  finally { for (const key of envKeys) { if (previous[key] === undefined) delete process.env[key]; else process.env[key] = previous[key]; } }
}

test('search registry has unique routes, meaningful indexed titles and descriptions', () => {
  assert.equal(new Set(searchPages.map(p => p.path)).size, searchPages.length);
  for (const key of ['title','description']) assert.equal(new Set(indexablePages.map(p => p[key])).size, indexablePages.length, `unique ${key}`);
  for (const p of searchPages) {
    assert.match(p.path, /^\/(?:[a-z0-9/-]*)$/);
    assert(p.title.length > 2 && p.description.length > 30, p.path);
    if (!p.index) assert(p.reason, p.path);
  }
  const files = readdirSync(new URL('../src/app', import.meta.url), { recursive: true }).filter(f => f.endsWith('page.tsx') && !f.startsWith('review') && !f.startsWith('reading-list'));
  for (const file of files) assert.match(readFileSync(new URL(`../src/app/${file}`, import.meta.url), 'utf8'), /searchMetadata\(/, file);
});

test('every approved authored lesson has a self-canonical path and a breadcrumb ending in its own title', () => {
  for (const lesson of lessons.lessons) {
    const path = `/library/${lesson.id}`, page = searchPage(path);
    assert(page?.index, path); assert.equal(page.canonical, path);
    assert.equal(page.title, lesson.title); assert(page.description.endsWith(lesson.summary));
    if (lesson.summary.length < 60) assert(page.description.startsWith(lesson.title));
    assert.equal(page.lastModified, lesson.updatedAt);
    const crumbs = resourceBreadcrumbs(lesson.id);
    assert.deepEqual(crumbs.at(-1), { name: lesson.title, href: path });
    assert(crumbs.length >= 3, path);
    assert(crumbs.every(item => searchPage(item.href)), path);
  }
});

test('sitemap eligibility excludes redirects, personal state, empty and unfinished directories', () => {
  for (const path of ['/study','/study/planner','/study/map','/reading-list','/contact','/review','/subjects/microbiology','/subjects/biostatistics','/subjects/anatomy/thorax','/study/anatomy/guide','/study/anatomy/revision']) assert(!indexablePages.some(p => p.path === path), path);
  for (const record of catalog.records) {
    const path = canonicalResourcePath(record);
    if (path !== `/library/${record.id}`) { assert.equal(searchPage(`/library/${record.id}`).index, false); assert(searchPage(path), path); }
  }
  assert(searchPage('/study/histology').index);
  assert(searchPage('/topics/physiology-renal').index);
  for (const p of indexablePages) assert(!p.canonical || p.canonical === p.path);
});

test('origins remain public on previews and indexing requires production', () => {
  withEnv({}, () => { assert.equal(getSiteUrl(), 'http://localhost:3000'); assert.equal(isIndexable(), false); });
  withEnv({ VERCEL: '1', VERCEL_ENV: 'preview', VERCEL_URL: 'random-preview.vercel.app' }, () => {
    assert.equal(getSiteUrl(), 'https://wardhan-medical-study-guide-studios.vercel.app'); assert.equal(isIndexable(), false);
  });
  withEnv({ VERCEL: '1', VERCEL_ENV: 'production', NEXT_PUBLIC_SITE_URL: origin + '/' }, () => { assert.equal(getSiteUrl(), origin); assert.equal(isIndexable(), true); });
  withEnv({ VERCEL_ENV: 'production', LOCAL_CURATION_REVIEW: '1' }, () => assert.equal(isIndexable(), false));
  withEnv({ VERCEL: '1', VERCEL_PROJECT_PRODUCTION_URL: 'custom.example.edu' }, () => assert.equal(getSiteUrl(), 'https://custom.example.edu'));
  for (const bad of ['https://user:pass@example.edu', 'https://example.edu/path','https://example.edu/?query=1','https://example.edu/#anchor','http://example.edu','javascript:alert(1)']) withEnv({ VERCEL: '1', NEXT_PUBLIC_SITE_URL: bad }, () => assert.throws(getSiteUrl));
});

test('robots lets crawlers see utility noindex while protecting review, preview and duplicate variants', () => {
  const production = robotsPolicy(origin, true), preview = robotsPolicy(origin, false);
  assert.equal(production.sitemap, origin + '/sitemap.xml');
  assert(!production.rules.disallow.includes('/study'));
  assert.equal(preview.rules.disallow, '/'); assert.equal(preview.sitemap, undefined);
  const check = (path, query='', host='example.edu', prod=true) => shouldNoIndex(path, new URLSearchParams(query), host, origin, prod);
  assert.equal(check('/library/epithelia'), false);
  assert.equal(check('/library/epithelia', '_rsc=token'), false);
  for (const path of ['/study','/review','/subjects/microbiology','/does-not-exist','/library/renal-kidney-map']) assert(check(path), path);
  assert(check('/library','q=heart')); assert(check('/library','utm_source=test')); assert(check('/library','','preview.vercel.app')); assert(check('/library','','example.edu',false));
});

test('all registered routes emit complete per-page metadata on production and noindex on preview', () => {
  for (const environment of ['production','preview']) withEnv({ VERCEL: '1', VERCEL_ENV: environment, NEXT_PUBLIC_SITE_URL: origin }, () => {
    for (const page of searchPages) {
      const m = searchMetadata(page.path), url = origin + (page.canonical || page.path);
      assert.equal(m.alternates.canonical, url); assert.equal(m.openGraph.url, url);
      assert.equal(m.openGraph.title, m.title.absolute); assert.equal(m.twitter.title, m.title.absolute);
      assert.equal(m.description, page.description); assert.equal(m.openGraph.description, page.description); assert.equal(m.twitter.description, page.description);
      assert.equal(m.robots.index, environment === 'production' && page.index);
      assert(m.openGraph.images[0].alt && m.twitter.images[0].alt);
    }
    assert.equal(searchMetadata('/unknown').robots.index, false);
  });
});

test('topic sequences contain substantial original guidance and only real published lessons', () => {
  assert.equal(topicGuides.length, 3);
  for (const guide of topicGuides) {
    assert(guide.preparation.length > 100 && guide.method.length > 150 && guide.review.length > 150);
    assert(guide.stages.length >= 4); assert.equal(new Set(guide.stages.map(s => s.id)).size, guide.stages.length);
    for (const stage of guide.stages) { assert(lessons.lessons.some(l => l.id === stage.id)); assert(searchPage(`/library/${stage.id}`).index); assert(stage.purpose.length > 50); }
    assert(searchPage(guide.next.href)?.index);
  }
});

test('schema graph describes the actual publisher, lesson, citations and ordered visible breadcrumbs', () => {
  const graph = websiteGraph(origin);
  assert.equal(graph['@context'], 'https://schema.org'); assert.deepEqual(graph['@graph'].map(n => n['@type']), ['Organization','WebSite']);
  for (const lesson of lessons.lessons) {
    const data = lessonSchema({ path: `/library/${lesson.id}`, title: lesson.title, summary: lesson.summary, citation: 'A visible source record', updatedAt: lesson.updatedAt, minutes: lesson.minutes, objectives: lesson.objectives }, origin);
    assert.equal(data.name, lesson.title); assert.equal(data.description, lesson.summary); assert.equal(data.dateModified, lesson.updatedAt);
    assert.equal(data.timeRequired, `PT${lesson.minutes}M`); assert.equal(data.author['@id'], origin + '/#studio'); assert.equal(data.isAccessibleForFree, true);
    assert(!('aggregateRating' in data) && !('reviewedBy' in data));
    const items = resourceBreadcrumbs(lesson.id), breadcrumb = breadcrumbSchema(items, origin);
    assert.deepEqual(breadcrumb.itemListElement.map(i => i.position), items.map((_, i) => i+1));
    assert.equal(breadcrumb.itemListElement.at(-1).item, data.url);
  }
  const undated = lessonSchema({ path: '/example', title: 'Example', summary: 'Example', citation: 'Source' }, origin);
  assert(!('dateModified' in undated));
  const course = courseSchema({ path: '/course', title: 'Course', summary: 'Summary', lessons: [{ title: 'Lesson', path: '/lesson' }] }, origin);
  assert.equal(course.hasPart[0].url, origin + '/lesson'); assert.equal(course.provider.name, graph['@graph'][0].name);
  const collection = collectionGraph('Sequence','Summary','/sequence',[{name:'Lesson',href:'/lesson'}],origin);
  assert.equal(collection['@graph'][1].numberOfItems, 1); assert.equal(collection['@graph'][1].itemListElement[0].url, origin + '/lesson');
});

test('JSON-LD safely serializes script delimiters and round-trips Unicode', () => {
  const data = { name: '</script><script>alert(1)</script>\u2028\u2029' };
  const output = serializeStructuredData(data);
  assert(!output.includes('<')); assert(!output.includes('\u2028')); assert.deepEqual(JSON.parse(output), data);
});
