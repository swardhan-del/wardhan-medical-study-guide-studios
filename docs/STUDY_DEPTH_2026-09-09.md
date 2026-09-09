# Study depth expansion

The existing native collection contained 58 short lessons. This batch adds 12 original guided lessons (70 total) with learning objectives, preparation links, four explanatory steps, a worked example with hidden reasoning, an explained multiple-choice question and an oral model answer. Existing lesson IDs and the eight-lesson renal course are preserved.

The new `/study/map` describes 257 topics across 37 source sections. It is a development map, not 257 finished lessons. Linked nodes explicitly say “Introduction available”; unlinked nodes say “Planned adaptation”. Biostatistics remains a ten-topic original-course proposal. Genetics and immunology have separate groups within the existing collection URL.

## Content added

- Physiology: indicator dilution, ECG timing and vectors, alveolar ventilation calculations.
- Histology: myelin and glial cells, blood–brain versus blood–CSF barriers.
- Molecular cell biology: chromatin access and topology, ER protein quality control.
- Biochemistry: ketone production and use, lipoprotein routes.
- Anatomy: inguinal canal relationships.
- Genetics and immunology: recessive conditional probability, hypersensitivity mechanisms.

Each lesson cites its inspected source edition and section and provides a topic reference in `lesson-references.json`. Biochemistry uses a new source record for the active July 18 edition; older lessons retain their actual prior source record. Neurohistology uses the September 7 Part 13 revision. The new questions are original and do not import the recorded question bank. No manuscript, purchased textbook, source figure or personal metadata is bundled.

## Continue the expansion

Use `study-map.json` to choose a source section, then consult the corresponding private source register and reading copy. The map is editorial: some broad sections overlap, and an available introduction does not satisfy the full mapped topic. Do not inflate counts by duplicating shared mechanisms across disciplines.

For each batch of 8–12 lessons:

1. Identify the exact source edition and relevant passages. Keep original manuscripts unchanged. Compare a changed source with previous adaptations before updating their source labels.
2. Write objectives, prerequisite links, a developed mechanism explanation, a worked application and original questions with explanations. Identify any draft prompts, unsupported statements or ambiguous source content; exclude or resolve them.
3. Review any image separately for identity, labels, provenance and allowed use. An archive image or figure-generation prompt is not an approved public asset. Preserve existing media and source links until equivalent replacements are verified.
4. Add the lesson to the source registry, collection, taxonomy, generated catalog, reference list and explicit release list. Set a map link only after the lesson exists; retain the conservative introduction label until a defined depth review supports a stronger claim.
5. Run content checks, unit tests, lint, type checking, production build and desktop/mobile browser checks. Check the exact new pages, worked answers, saved practice and cross-links.
6. Review the branch diff, preview and deployment commit. Production is a separate release step. A pushed branch or passing local build is not evidence that production changed.

Next priorities: cardiovascular haemodynamics and venous return; retinal and inner-ear recognition; RNA regulation; haem/iron and nucleotide metabolism; regional anatomy oral exercises. Extend the existing renal course rather than adding a competing course. Biostatistics requires fresh authoring with fictional worked datasets; its purchased reference remains private.

## Private companion

A separate owner-only package contains a searchable offline reader of 36 selected source texts, 388,919 extracted words, the topic matrix, source-text hashes and reproduction scripts. These are source reading copies, not 36 validated courses. Drafting material, reference passages and recorded questions may remain in the private text; no scored bank is produced. This package is intentionally outside this repository.

## Verification scope

Content validators enforce reference integrity, question shape, prerequisite targets and worked-example completeness. Map tests reject broken destinations and inconsistent availability labels. Browser tests exercise filtering, each new lesson, answer persistence and desktop/mobile overflow. These checks do not establish independent scientific peer review or full syllabus coverage.
