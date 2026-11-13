import test from "node:test";
import assert from "node:assert/strict";
import { physiologyChapterHref, physiologyChapterNavigation, physiologyCourse } from "../src/content/curriculum.ts";
import release from "../src/content/public-release.json" with { type: "json" };
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
  assert.deepEqual(parts.filter(part => part.chapters).map(part => part.id), ["cardiovascular", "respiratory"]);
  assert.deepEqual(respiratoryChapters.map(chapter => chapter.id), [
    "pulmonary-ventilation", "pulmonary-gas-exchange", "pulmonary-circulation-and-vq",
    "respiratory-gas-transport", "respiratory-control", "cardiopulmonary-adaptation",
    "respiratory-acid-base",
  ]);
  const ids = [...parts, ...chapters, ...respiratoryChapters].map(entry => entry.id);
  assert.equal(new Set(ids).size, ids.length);
});

test("the course maps existing public lessons and leaves gaps visible", () => {
  const lessonIds = [...chapters, ...respiratoryChapters].flatMap(chapter => chapter.lessonIds);
  assert.equal(new Set(lessonIds).size, lessonIds.length);
  for (const id of lessonIds) {
    const record = catalog.records.find(record => record.id === id);
    assert(release.resourceIds.includes(id), id);
    assert.equal(record?.status, "public", id);
    assert.equal(record?.format, "WEB", id);
    const progressId = record.href?.startsWith("/learn/renal/") ? id.slice("renal-".length) : id;
    assert(registry.learningLessonIds.includes(progressId), progressId);
  }
  assert.deepEqual(chapters.filter(chapter => !chapter.lessonIds.length).map(chapter => chapter.id), [
    "local-circulatory-control", "exercise-and-splanchnic-circulation",
    "shock-and-volume-loss", "thermoregulation",
  ]);
  assert(respiratoryChapters.every(chapter => chapter.lessonIds.length > 0));
});

test("chapter navigation preserves chronology even when the next chapter has no mapped lesson", () => {
  const microcirculation = physiologyChapterNavigation("lymph-and-fluid-exchange");
  assert.equal(microcirculation.previous.id, "arterial-pressure");
  assert.equal(physiologyChapterHref(microcirculation.chapter), "/learn/courses/physiology#microcirculation");
  assert.equal(microcirculation.next.id, "venous-circulation");
  assert.equal(physiologyChapterNavigation("venous-muscle-pump-direction").next.id, "local-circulatory-control");
  assert.equal(physiologyChapterNavigation("cardiac-conduction-autonomics").previous, undefined);
  assert.equal(physiologyChapterNavigation("fetal-circulation-transition").next.id, "thermoregulation");
  assert.equal(physiologyChapterNavigation("membrane-potentials"), null);
  assert.equal(physiologyChapterNavigation("respiratory-mechanics").previous, undefined);
  assert.equal(physiologyChapterNavigation("ventilation-perfusion").next.id, "respiratory-gas-transport");
  assert.equal(physiologyChapterNavigation("renal-renal-acid-base").chapter.id, "respiratory-acid-base");
});
