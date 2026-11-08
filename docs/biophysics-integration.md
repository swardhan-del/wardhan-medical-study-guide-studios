# Native Biophysics course

The subject is implemented as native lessons at /study/biophysics and interactive models at /practice/biophysics. It is available through the homepage, starting route, subject directory, library search, saved resources and printable revision notes.

## Content scope

- The existing source-topic map contains **50 lessons: 36 theory and 14 practical**. Its historical Medical Biophysics I–II numbering is distinct from the current academic-year crosswalk below.
- `biophysics-membrane-foundations` is a **separate primer**, outside that 50-lesson map. The subject directory therefore contains 51 lessons; the primer does not supply an additional semester topic.
- Counts checked against the current records on 2026-11-08: the 50 mapped lessons contain **110 scored questions** (50 embedded concept checks, 53 application questions in `study-questions.json`, and seven in `transfer-practice.json`). Separately, they contain **50 written-recall prompts and eight additional oral prompts**, assessed against model explanations rather than objective answer keys. These prompts are not included in the scored-question total.
- The primer has four scored questions (one embedded, one study question and two transfer questions), one written-recall prompt and two additional oral prompts. The whole Biophysics subject thus has 114 scored questions, 51 written-recall prompts and ten additional oral prompts. No questions are added by this editorial correction.
- Six original coded models cover thin lenses, half-value layers, RC charging, one-dimensional diffusion, Poiseuille scaling and ultrasound echo timing.
- The structured source-section map is in src/content/biophysics-coverage.json. X-ray and CT practical themes are integrated into their corresponding theory lessons.

The three source PDFs overlap. The integration covers their topic structure; it is not a facsimile of every numbered historical question, figure or answer. Source PDF pages, private storage addresses and original illustrations are not shipped. The website contains newly written explanations and questions. The source notes, including Kai Shiida's 2018–2019 notes, are credited on each lesson. Supplementary references are linked separately.

## Editorial corrections

The adaptations distinguish FRC from ERV, transpulmonary pressure from chest-wall pressure, passive expiration from forced expiration, and regenerative action potentials from passive cable decay. Lens-at-focus and inside-focus cases are separate. X-ray cutoff calculations use consistent voltage, energy and wavelength units. Gray, sievert and becquerel are not treated as interchangeable. Historic dose limits and unverified source answers are not presented as current clinical guidance.

The bounded 2026-11-08 edit changes teaching/recall text only in `biophysics-dosimetry`, `biophysics-practical-absorbance` and `biophysics-circulation-ecg`. It adds the dose-weighting equations and their limits, uses the same fivefold dilution and mmol/L units in the absorbance example and recall task, and supplies the ECG lead values while separating electrical voltage from mechanical work. Existing lesson/question IDs, question options and answer positions, routes, storage keys and progress logic remain unchanged. The integration adds explicit objectives, structured worked examples and current-version review metadata. Independent specialist review remains pending.

### Checked reference corrections

Only the following topic mismatches in `lesson-references.json` are corrected. Public source titles, sections and URLs were checked on 2026-11-08; these bibliographic checks do not establish a new review status or full scientific coverage of a lesson.

| Lesson | Previous mismatch | Checked replacement and scope |
| --- | --- | --- |
| `biophysics-gases-statistics` | First-law chapter introduction in place of gas models and speed statistics | OpenStax, *University Physics Volume 2*, [§2.1, Molecular Model of an Ideal Gas](https://openstax.org/books/university-physics-volume-2/pages/2-1-molecular-model-of-an-ideal-gas) and [§2.4, Distribution of Molecular Speeds](https://openstax.org/books/university-physics-volume-2/pages/2-4-distribution-of-molecular-speeds). |
| `biophysics-dosimetry` | Nuclear-physics introduction did not substantiate the protection-quantity definitions | [ICRP Publication 147 (2021)](https://www.icrp.org/publication.asp?id=ICRP+Publication+147), Executive Summary (a)–(c): dose definitions, radiation/tissue weighting and reference-person limits. The publisher's full-text page timed out on an earlier check; the ICRP page provides the checked summary and bibliographic record. |
| `biophysics-biomechanics` | Fluid-mechanics introduction in place of solid stress/strain | OpenStax, *University Physics Volume 1*, [§12.3, Stress, Strain, and Elastic Modulus](https://openstax.org/books/university-physics-volume-1/pages/12-3-stress-strain-and-elastic-modulus). |
| `biophysics-molecular-motors` | Fluid-mechanics introduction in place of ATP-driven muscle contraction | OpenStax, *Biology 2e*, [§38.4, Muscle Contraction and Locomotion](https://openstax.org/books/biology-2e/pages/38-4-muscle-contraction-and-locomotion). |
| `biophysics-practical-absorbance` | Thin-lens optics in place of absorbance/concentration | [IUPAC Gold Book, Beer–Lambert law (B00626)](https://goldbook.iupac.org/terms/view/B00626), *Compendium of Chemical Terminology*, 5th ed., online version 5.0.0 (2025). The definition, units and version were checked in the publisher's indexed entry; direct retrieval returned HTTP 403. The numerical calibration is an original illustrative example, not an experimental dataset. |

The existing ECG reference, OpenStax *Anatomy and Physiology 2e*, §19.2, is relevant and is preserved. The mechanical distinction and calculation were checked against Richard E. Klabunde's [Stroke Work and Cardiac Work](https://cvphysiology.com/cardiac-function/cf019) and [Ventricular Pressure-Volume Relationship](https://cvphysiology.com/cardiac-function/cf024). The lead relationship was checked against the original educational paper [A simple device to illustrate the Einthoven triangle (2012)](https://journals.physiology.org/doi/full/10.1152/advan.00029.2012).

**Review needed:** the replacement references are scoped supports, not complete lesson bibliographies. Dedicated checked sources are still needed for viscoelastic models and tissue-specific Laplace limits in `biophysics-biomechanics`, kinesin/dynein processivity and force–velocity behaviour in `biophysics-molecular-motors`, and degeneracy/Arrhenius/microstate arguments in `biophysics-gases-statistics`. Direct automated retrieval of the IUPAC entry returned HTTP 403; its indexed publisher definition was checked and that access limitation is recorded in the review note. No unchecked citations have been supplied for these gaps.

## Biophysics I: 2026–27 topic crosswalk

Source: the public Semmelweis Department of Biophysics and Radiation Biology [Medical biophysics 1. 2026–2027 schedule](https://biofiz.semmelweis.hu/index.php?a=tantargy&id=608&mid=2&p=oktatas), checked 2026-11-08. The topic summaries below are editorial paraphrases. Dates after the check date are scheduled sessions, not evidence of delivered teaching. Moodle and recordings were not accessed.

This is a documentation crosswalk to existing lesson IDs, not a change to course order, lesson metadata, routes or completion requirements. It shows topic overlap; it does not certify full lecture depth or practical competence. Repeated IDs span more than one scheduled topic and do not represent duplicate lessons.

| Session / date (2026) | Scheduled theme, summarised | Existing lesson IDs |
| --- | --- | --- |
| 1 / 09-09 | Radiation measures and medical uses | `biophysics-radiation-optics` |
| 2 / 09-16 | Ray paths, lenses, optical instruments and the eye | `biophysics-radiation-optics`, `biophysics-image-formation`, `biophysics-sensory-biophysics` |
| 3 / 09-23 | Wave behaviour, resolution, polarisation and colour | `biophysics-wave-optics`, `biophysics-sensory-biophysics` |
| 4 / 09-30 | Evidence for light's dual behaviour | `biophysics-light-duality` |
| 5 / 10-07 | Matter waves, atoms, molecular forces and AFM | `biophysics-light-duality`, `biophysics-atomic-models`, `biophysics-molecular-interactions` |
| 6 / 10-14 | Thermal populations and fluid states | `biophysics-gases-statistics`, `biophysics-condensed-matter` |
| 7 / 10-21 | Crystal bands and material properties | `biophysics-condensed-matter` |
| 8 / 10-28 | Scattering, absorption and optical measurement | `biophysics-absorption-scattering` |
| 9 / 11-04 | Heat-driven and excited-state light emission | `biophysics-thermal-radiation`, `biophysics-luminescence` |
| 10 / 11-11 | Laser generation and medical applications | `biophysics-lasers` |
| 11 / 11-18 | Nuclei, decay, interactions and tracers | `biophysics-nuclear-structure`, `biophysics-decay-interactions`, `biophysics-isotope-diagnostics` |
| 12 / 11-25 | Dose assessment, protection and detection | `biophysics-dosimetry`, `biophysics-radiation-detection` |
| 13 / 12-02 | Radionuclide imaging and treatment principles | `biophysics-nuclear-imaging` |
| 14 / 12-09 | Medical signal handling | `biophysics-signals` |

`biophysics-sensory-biophysics` has a historical Biophysics II source label but includes relevant eye/vision teaching; its cross-reference does not reclassify the whole lesson into semester I. Existing practical lessons support several themes, but the lecture schedule does not establish a 2026–27 practical timetable.

**Biophysics II academic-year alignment remains pending** until its 2026–27 sequence is available and checked. Historical source numbering and this semester-I crosswalk must not be used to claim that alignment.

## Integration and verification

Content uses the existing lesson, question, catalog, taxonomy and browser-progress infrastructure. It does not depend on the source folder being reachable at runtime. Biophysics currently has no narrated recordings; unavailable media filters are hidden. Explicit narrated-subject scope preserves the existing media release validation without manufacturing a recording requirement for a text/model course.

Unit tests check physical examples, limiting cases, invalid inputs and course integrity. Desktop/mobile browser tests check search, saved answers after reload, sequential navigation, all six model controls including the focal singularity, revision notes and overflow. Existing public/private release checks continue to validate all public assets and routes.

Independent specialist review, full objective/depth alignment and hands-on instrument/experimental-image work remain separate from this native integration. The semester-I schedule crosswalk above is narrower than those checks.

### Reviewed integration — 2026-11-08

The three changed lessons have explicit objectives, structured worked examples, current update dates, public-safe quality records and exact-content editorial, readability and accessibility evidence in `docs/reviews/biophysics-editorial-20261108.md`. Independent specialist and clinical review remain outstanding. The existing index eligibility is supported by these editorial checks; no clinical-review status is claimed.

The frozen legacy fingerprint baseline is unchanged. Catalog/search records and the latest printable-collection revision date are regenerated through the existing generators. All 268 lesson IDs remain in order; 265 lesson records, all existing scored-question records and the progress implementation are unchanged. No source document or new source image is included.

The completed local content validation, 166 unit tests, lint, TypeScript, production build and dependency audit pass. Browser checks cover the existing Biophysics course and models, review transparency, shared checkpoints and all three affected lesson routes, including keyboard operation, retained feedback, JavaScript-disabled teaching, 320px reflow and enlarged text. Exact pull-request CI and hosted-preview results are recorded separately when available. Production requires the corresponding release decision.
