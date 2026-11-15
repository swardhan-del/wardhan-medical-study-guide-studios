import test from "node:test";
import assert from "node:assert/strict";
import { physiologyChapterHref, physiologyChapterNavigation, physiologyCourse } from "../src/content/curriculum.ts";
import release from "../src/content/public-release.json" with { type: "json" };
import print from "../src/content/printable-guides.json" with { type: "json" };
import catalog from "../src/content/public-catalog.json" with { type: "json" };
import registry from "../src/content/learning-registry.json" with { type: "json" };

const { parts } = physiologyCourse;
const chapters = parts[1].chapters;
const respiratoryChapters = parts[2].chapters;

test("divided physiology parts and cardiovascular chapters retain their verified order", () => {
  assert.deepEqual(parts.map(part => part.id), [
    "cellular-physiology", "cardiovascular", "respiratory", "renal", "blood",
    "gastrointestinal", "endocrine", "nervous-system",
  ]);
  assert.deepEqual(chapters.map(chapter => chapter.id), [
    "pacemaker-and-conduction", "electrocardiography", "cardiac-cycle",
    "cardiac-output", "haemodynamics", "arterial-pressure", "microcirculation",
    "venous-circulation", "local-circulatory-control", "reflex-circulatory-control",
    "exercise-and-splanchnic-circulation", "coronary-and-cerebral-circulation",
    "renal-circulation", "shock-and-volume-loss", "fetal-and-neonatal-circulation",
    "thermoregulation",
  ]);
  assert.deepEqual(parts.map(part => part.chapters.length), [12, 16, 7, 5, 4, 6, 10, 12]);
  assert.deepEqual(respiratoryChapters.map(chapter => chapter.id), [
    "pulmonary-ventilation", "pulmonary-gas-exchange", "pulmonary-circulation-and-vq",
    "respiratory-gas-transport", "respiratory-control", "cardiopulmonary-adaptation",
    "respiratory-acid-base",
  ]);
  assert.deepEqual(respiratoryChapters.map(chapter => chapter.number), ["3.1", "3.2", "3.2.3", "3.3", "3.4", "3.5", "3.6"]);
  const ids = [...parts, ...parts.flatMap(part => part.chapters)].map(entry => entry.id);
  assert.equal(new Set(ids).size, ids.length);
});

test("the course maps existing public lessons and leaves gaps visible", () => {
  const chapters = parts.flatMap(part => part.chapters);
  const lessonIds = chapters.flatMap(chapter => chapter.lessonIds);
  const relatedIds = chapters.flatMap(chapter => chapter.relatedLessonIds ?? []);
  assert.equal(new Set(lessonIds).size, lessonIds.length);
  for (const id of new Set([...lessonIds, ...relatedIds])) {
    const record = catalog.records.find(record => record.id === id);
    assert(release.resourceIds.includes(id), id);
    assert.equal(record?.status, "public", id);
    assert.equal(record?.format, "WEB", id);
    const progressId = record.href?.startsWith("/learn/renal/") ? id.slice("renal-".length) : id;
    assert(registry.learningLessonIds.includes(progressId), progressId);
  }
  for (const part of parts) {
    assert(part.chapters.some(chapter => chapter.lessonIds.length > 0), part.id);
    const printablePart = print.parts.find(item => item.id === part.guidePartId);
    assert.deepEqual(part.chapters.flatMap(chapter => chapter.lessonIds).filter(id => !catalog.records.find(record => record.id === id).href?.startsWith("/learn/renal/")), printablePart.lessonIds);
  }
  assert.equal(chapters.find(chapter => chapter.id === "thermoregulation").lessonIds.length, 0);
  assert.deepEqual(chapters.find(chapter => chapter.id === "pulmonary-gas-exchange").relatedLessonIds, ["respiratory-histology"]);
});

test("chapter navigation preserves chronology even when the next chapter has no mapped lesson", () => {
  const microcirculation = physiologyChapterNavigation("lymph-and-fluid-exchange");
  assert.equal(microcirculation.previous.id, "arterial-pressure");
  assert.equal(physiologyChapterHref(microcirculation.chapter), "/learn/courses/physiology#microcirculation");
  assert.equal(microcirculation.next.id, "venous-circulation");
  assert.equal(physiologyChapterNavigation("venous-muscle-pump-direction").next.id, "local-circulatory-control");
  assert.equal(physiologyChapterNavigation("indicator-dilution").previous, undefined);
  assert.equal(physiologyChapterNavigation("cardiac-conduction-autonomics"), null);
  assert.equal(physiologyChapterNavigation("membrane-potentials").next.id, "action-potential-conduction");
  assert.equal(physiologyChapterNavigation("respiratory-mechanics").previous, undefined);
  assert.equal(physiologyChapterNavigation("ventilation-perfusion").next.id, "respiratory-gas-transport");
  assert.equal(physiologyChapterNavigation("respiratory-mechanics").nextLessonId, "alveolar-ventilation-calculations");
  assert.equal(physiologyChapterNavigation("renal-renal-acid-base").chapter.id, "acid-base-balance");
  assert.equal(physiologyChapterNavigation("renal-abg-interpretation").partIndex, 3);
});
