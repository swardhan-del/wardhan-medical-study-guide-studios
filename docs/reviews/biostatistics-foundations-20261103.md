# Statistical foundations: version-specific review

Four original, non-clinical lessons using fictional values. NIST histogram, location, scale and mean confidence-limit pages were read on 3 November 2026. New text explains the definitions rather than reproducing textbook prose or figures. Arithmetic was recomputed separately: bin counts 1/3/2/2; means 4 and 6 with median 3; sample SDs 1 and 5; estimated SEs 2 and 1. Independence and common finite variance are explicit. Confidence-interval, population and bias conclusions are deliberately bounded. No private source paths or original source files are part of this release.

Rights/privacy: original text and invented data only, public references linked. No patient information, identifiable measurements, third-party images or course questions. Four stable candidate IDs are reused; current main contains no statistics lessons.

Readability: each objective is taught in the explanation and worked example; every choice explains its reasoning; units, ordering, interval endpoints and sampling assumptions are explicit. Text-only worked tasks do not require a visual. Eight focused production-build desktop/mobile checks passed: worked-example keyboard disclosure, wrong/correct answer feedback, submitted answer persistence, reading-list save/remove/reload, page-width reflow, zero Axe violations and no page JavaScript errors. Automated checks are not human accessibility certification. Hosted preview and production checks remain separate release gates. No independent statistical, clinical or human accessibility approval is claimed.

Evidence:
- histogram-bin-counts-example-editorial-20261103: b675d949520d5b2644eb9140da39a5f6999b2d372405de020d3bbbab051b8616
- histogram-bin-counts-example-readability-20261103: b675d949520d5b2644eb9140da39a5f6999b2d372405de020d3bbbab051b8616
- mean-median-extreme-value-comparison-editorial-20261103: 4a7761a0e88f0b49039af851ffc34bca9f20d2b2cb6fa0c8401f1a87daa7bc04
- mean-median-extreme-value-comparison-readability-20261103: 4a7761a0e88f0b49039af851ffc34bca9f20d2b2cb6fa0c8401f1a87daa7bc04
- same-center-different-data-spread-editorial-20261103: f5af113ce9a26be4cb7f2005b6f0d9732aba547719e7cf70251b462d77093f9c
- same-center-different-data-spread-readability-20261103: f5af113ce9a26be4cb7f2005b6f0d9732aba547719e7cf70251b462d77093f9c
- standard-deviation-standard-error-editorial-20261103: 956f299c00bb630ab2fc18ebf2decf37db6d99743764c95a4ea26c272d07e386
- standard-deviation-standard-error-readability-20261103: 956f299c00bb630ab2fc18ebf2decf37db6d99743764c95a4ea26c272d07e386

Accessibility evidence (same teaching fingerprints as above):
- histogram-bin-counts-example-accessibility-20261103: b675d949520d5b2644eb9140da39a5f6999b2d372405de020d3bbbab051b8616
- mean-median-extreme-value-comparison-accessibility-20261103: 4a7761a0e88f0b49039af851ffc34bca9f20d2b2cb6fa0c8401f1a87daa7bc04
- same-center-different-data-spread-accessibility-20261103: f5af113ce9a26be4cb7f2005b6f0d9732aba547719e7cf70251b462d77093f9c
- standard-deviation-standard-error-accessibility-20261103: 956f299c00bb630ab2fc18ebf2decf37db6d99743764c95a4ea26c272d07e386

Final local checkpoint: 125 unit tests passed; production build, rendered privacy checks, lint, typecheck and production dependency audit (zero vulnerabilities) passed. The final ten statistics desktop/mobile tests passed after correcting the last onward link; these include directory/filter/full-text search and no links to unavailable statistics study/vocabulary routes. A separate 36-check first-visit/statistics run passed before that final link correction. All 241 prior lesson objects, old questions, legacy baseline and public asset hashes are unchanged. Existing review branches are preserved. React review found no new effects, network requests, dependencies or storage format changes; semantic controls and established identifiers are reused.

## 4 November reflow correction

The initial hosted preview passed its ten normal-text desktop/mobile cases, but a further 320 CSS-pixel / 200% root-text check exposed overflow in disclosure titles, fixed mobile navigation columns, and long question options. Merge was held. Titles and options now shrink and wrap, the navigation adapts its column count to text size, and explanatory text/legends wrap when needed. Content, question identities and answer ordering are unchanged. No overflow-hiding rule was added.

The updated production build and rendered privacy checks, lint and typecheck passed. All 36 focused statistics/first-visit desktop/mobile checks passed, including 320px/200% assertions for each of the four lessons. Current-commit hosted preview and CI remain release gates; the earlier green jobs do not cover this correction.
