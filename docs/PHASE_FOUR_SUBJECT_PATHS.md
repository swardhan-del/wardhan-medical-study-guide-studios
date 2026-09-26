# Phase Four: subject learning paths

## Scope and preservation

Built from main `e86352ac8a5c90869abe5b474c1e550f779bd843`, after the Histology and Anatomy releases. The canonical hubs are `/study/histology`, `/study/anatomy`, `/study/physiology`, `/study/biochemistry`, `/study/genetics` and `/study/biophysics`. The existing Molecular & Cell Biology path remains available at `/study/cell-biology` with the same introductory DNA replication lesson.

Each hub provides scope, relevance, a recommended first lesson, a quiz link and a sequenced topic map. Anatomy retains its established six-stage map. Reference directories and all existing lessons remain accessible. Homepage subject cards and the library provide direct entry points. These maps describe available learning routes, not complete coverage of a university syllabus.

All 237 pre-existing lesson records, 87 study questions and 16 application questions are preserved. Existing taxonomy nodes, collection groups, study-map groups, printable parts and public assets are retained. The new Biophysics foundation sits before the established 36 theory and 14 practical topics; it does not renumber or replace that course.

## New lessons and scientific review

| Lesson | Main concepts and source sections | Distinctions checked |
| --- | --- | --- |
| `physiology-membrane-foundations` | OpenStax Anatomy and Physiology 2e §§3.1, 12.4; NCBI Bookshelf, *Physiology, Resting Potential* | Passive versus active transport; energy coupling; pump stoichiometry; inside-minus-outside voltage; resting steady state versus ion equilibrium; K⁺ gradients and conductance |
| `biochemistry-enzyme-foundations` | OpenStax Biology 2e §6.5; NCBI Assay Guidance Manual, *Basics of Enzymatic Assays for HTS* and *Mechanism of Action Assays for Enzymes*; Cooper, *The Cell*, *The Central Role of Enzymes as Biological Catalysts* | Catalysis versus equilibrium; initial-rate assumptions; Km concentration versus Vmax rate; apparent Km in ideal reversible competitive inhibition; allostery versus a specific kinetic inhibition category |
| `genetics-genome-foundations` | NHGRI Talking Glossary: Genome, Gene; MedlinePlus Genetics: protein production, inheritance patterns, inheritance probabilities and gene regulation | Nuclear and mitochondrial genomes; gene versus allele; RNA products; replication/transcription/translation; independent pregnancies; unconditional versus conditional carrier probabilities; DNA presence versus expression |
| `biophysics-membrane-foundations` | OpenStax College Physics 2e §12.7; NCBI Bookshelf, *Structure and Function of Exchange Microvessels*; OpenStax Anatomy and Physiology 2e §3.1; American Physiological Society, *Measuring osmosis and hemolysis of red blood cells* | Net versus molecular movement; neutral-solute planar diffusion assumptions and units; area versus thickness; water versus solute permeability; hydrostatic pressure; osmolarity versus tonicity |

Exact public URLs and review date (23 September 2026) are stored in `src/content/lesson-references.json` and shown on each lesson. The NCBI and APS sites can present automated-access challenges; indexed publisher excerpts were used where direct retrieval was challenged. No source passages, figures or patient data are reproduced. Source checking is not independent clinical peer review, which remains outstanding and is disclosed in the lesson footer.

Each lesson contains four guided explanations, a worked example, four single-best-answer questions with distinct explanations for every option, two oral prompts, browser-saved notes and checklist, and a visible short recap. The numeric and genetic cases are original hypothetical examples, not patient observations. The answer key is locked to independently reviewed answer text in `tests/subject-learning-paths.test.mjs`; arithmetic and Mendelian combinations are also recalculated independently.

## Visual and accessibility decisions

Four original HTML comparisons teach transport mechanisms, enzyme saturation, a Mendelian cross and relative diffusion rates. Each has a table caption, column and row headers, an explanatory caption, an observation task, creator credit and a scientific source link. On narrow screens, the same rows appear as stacked definition lists so labels remain readable without horizontal scrolling. CSS exposes only the active representation to assistive technology. All labels and values are selectable text. No raster images, external visual downloads or additional public assets are required.

The shared Histology/Anatomy foundation components supply native disclosures, labelled radio groups, status feedback, saved oral notes and summary checkboxes. The new content uses professional section names without changing existing question IDs or storage keys. The comparisons do not depend on colour, motion or image loading.

## Maintenance and validation

- Hub metadata: `src/content/subject-hubs.ts`; introductory comparison data: `src/content/entry-lesson-guides.ts`.
- Lesson, source, question, release, taxonomy, collection, printable and study-map records use the existing JSON registration surfaces.
- Run `npm run content:anatomy` after inserting lessons to retain the generated canonical Anatomy ordering, then `npm run content:check`.
- Run `npm test`, `npm run typecheck`, `npm run lint`, `npm run build` and `npm run test:e2e`.
- Browser tests cover every hub and new lesson, new topic routes, library search, quiz feedback and persistence, keyboard disclosures, reduced motion, text comparisons, source links, mobile overflow and printable registration. The existing complete-route test also checks every catalog and taxonomy URL.
- Before publication, review the preview tied to the committed SHA. Phase Four is submitted for review and must not be merged or deployed to production without owner approval.

Local validation on 23 September 2026: content checks, 62 unit tests, typecheck, lint, the 617-page production build and all 464 browser tests passed. Automated WCAG 2 A/AA and 2.1 AA scans covered the homepage, library, seven hubs and four new lessons at 1440, 390 and 320 CSS pixels (39 checks): zero violations and no page overflow. The library's existing decorative link arrows require manual contrast review because the scanner treats them as non-text characters; new teaching comparisons had no unresolved checks. Keyboard disclosures, answer feedback, saved notes, checklists and reduced-motion operation are covered in the browser suite.
