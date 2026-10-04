import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { curriculumOrders, beginnerLinks, immunologyPath } from '../src/content/curriculum-order.ts';
const catalog = JSON.parse(readFileSync('src/content/public-catalog.json', 'utf8')).records;
const routes = new Set(catalog.map(record => record.href || `/library/${record.id}`));
for (const subject of Object.keys(curriculumOrders)) {
  routes.add(`/learn/foundations/${subject}`);
  routes.add(`/study/${subject}/guide`);
}
routes.add('/learn/renal');

export function validateCurriculum(orders, availableRoutes = routes) {
  for (const [subject, order] of Object.entries(orders)) {
    assert(order.reason.length > 60, `${subject}: explain the order`);
    assert(order.stages.length >= 4, `${subject}: missing stages`);
    assert(availableRoutes.has(`/library/${order.sampleLesson}`), `${subject}: unavailable sampler`);
    assert.equal(new Set(order.stages.map(stage => stage.id)).size, order.stages.length, `${subject}: duplicate stage`);
    const used = new Set();
    for (const stage of order.stages) {
      assert(stage.title && stage.description && stage.id, `${subject}: incomplete stage`);
      assert(stage.links.length || stage.planned?.length, `${stage.id}: empty stage`);
      for (const gap of stage.planned ?? []) {
        assert.equal(typeof gap, 'string', `${stage.id}: planned work must not invent a route`);
        assert(!/https?:|\/library\/|\.private|dropbox|\.(docx?|pdf|pptx?|png|jpe?g)\b/i.test(gap), `${stage.id}: private or fake planned route`);
      }
      for (const link of stage.links) {
        assert(link.title.length > 3 && availableRoutes.has(link.href), `${stage.id}: invalid target ${link.href}`);
        assert(!used.has(link.href), `${subject}: duplicate target ${link.href}`);
        used.add(link.href);
      }
    }
    for (const link of order.orientation ?? []) assert(availableRoutes.has(link.href), `${subject}: invalid orientation target`);
  }
}
validateCurriculum(curriculumOrders);
for (const link of [...Object.values(beginnerLinks).flat(), ...immunologyPath]) assert(routes.has(link.href), `Invalid preserved path: ${link.href}`);
console.log(`Curriculum validation passed: ${Object.keys(curriculumOrders).length} subjects; unique stages/targets per subject, valid reused routes and explicit planned gaps.`);
