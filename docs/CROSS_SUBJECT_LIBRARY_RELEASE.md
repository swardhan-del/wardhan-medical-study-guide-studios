# Cross-subject learning library

The public catalog previously contained zero records. Anatomy pages and the renal course existed outside its filters. This release connects those pages and adds 39 original source-based lessons, producing 58 usable resources across all six subjects.

| Subject | Resources | New lessons |
| --- | ---: | ---: |
| Macroscopic anatomy and embryology | 5 | Existing five topic explorers |
| Microscopic anatomy and histology | 17 | 16 |
| Molecular and cell biology | 7 | 7 |
| Biochemistry | 6 | 6 |
| Medical physiology | 17 | 4, alongside the renal course and practice |
| Genetics and immunology | 6 | 6 |

Every new lesson has three explanatory sections, an original three-option question with a rationale for each option, an oral-recall prompt with a model answer, source-section attribution and three related resources. Explanations use native disclosure controls; question feedback permits correction. Questions last for the current page session. The existing reading list saves selected lessons in the browser. Renal course progress remains managed by its existing study dashboard; the new single-question checks do not claim spaced-review or cross-device synchronization.

## Source selection and review

Inputs were read from the controlled September 2 curation manifest and the September 6 cross-subject concept package requested by the user. Source originals were neither changed nor moved. Full texts, presentation images, source paths and raw extraction files stay outside the public repository. This release consists of authored explanatory adaptations, not a bulk publication of the 3,192-resource candidate manifest.

| Source key | Curation ID | Verified SHA-256 |
| --- | --- | --- |
| histology | b88b1cbb1791f4a6 | c0ffba3a4e2a859ca986439c287a87ce83c4ed41928566b20a676355c936cb9e |
| cell-biology | mcb-39-topic | 0385e9c48f53f5b611e2593793459a2ddbd746dc78b6bd5298c083509acdf47a |
| biochemistry | 2c0e663764fc82db | 622cbbcb7c68cb58eed054d1f5325a4f181cd6eb0a9745a41fb602cc99298679 |
| cellular | 16a6380af0047f45 | 9d4fde8679d9a15834a96c4db2683e7a6830cd1d85c26ca7404f72d2da440e91 |
| cardiovascular | 08badddf3e2e0711 | bfd364fbf30ff5a084fee1bb4a6797e6a2271d4d02ce64c7d26de79f466781c7 |
| respiratory | 48e17646d8fad129 | ff832550780466b0f54641f62803f9079d5eff9447fc098fae33ba2225c5b597 |
| genetics | e5114e11e67027dd | b0f58c70a3eca50e24d9663142b727268dd9f9a00858e3b7e6c88da210e160c2 |

The histology extract has 5,425 nonempty paragraph entries including tables; the molecular cell biology guide has 666. The genetics source is a 143-slide teaching deck. Source titles, editions and section names are listed on the public pages. Extraction paragraph counts are not page numbers and are not presented as page citations.

The copy was checked for known source pitfalls. It does not reproduce the histology source's assertion that the placenta blocks alcohol; the page describes a selective, nonabsolute barrier. It omits unsupported fixed alveolar cell percentages, the biochemistry source's implausible daily nitrogen numbers and its outdated six-class enzyme enumeration. It distinguishes mRNA processing from nuclear protein import, and avoids claiming that all mRNA export is Ran dependent. It qualifies competitive inhibition with its kinetic assumptions, separates preload from contractility, and keeps antigen-presenting cells distinct from recognizing T cells. No existing examination question or unresolved figure-dependent item was republished.

External checks included [NCBI extracellular matrix](https://www.ncbi.nlm.nih.gov/books/NBK9874/), [NHGRI PCR](https://www.genome.gov/about-genomics/fact-sheets/Polymerase-Chain-Reaction-Fact-Sheet), [enzyme inhibition models](https://www.ncbi.nlm.nih.gov/sites/books/NBK92001/), [antigen presentation](https://www.ncbi.nlm.nih.gov/books/NBK10766/) and [urea handling](https://www.ncbi.nlm.nih.gov/books/NBK513323/). These supplement the named local teaching sources. Editorial disclosure remains AI-assisted and source-checked; no independent clinical peer review is claimed.

## Catalog and deployment behavior

- `src/content/library-lessons.json` is the authored content. `library-sources.json` provides safe bibliography metadata.
- Run `npm run content:library` after content changes. The generator combines authored lessons with existing anatomy, renal and practice routes. No Dropbox connection or new environment variable is required at runtime.
- `npm run content:check` verifies the generated catalog, answer keys, content completeness, source keys and related links. Production builds fail if the catalog is stale or source files enter the public asset directory.
- Subject and search links can initialize filters through `/library?subject=histology&q=epithelia`. Search matches separate words across titles, summaries and topic tags. Format choices reflect the selected subject. Changing subject clears an incompatible format.
- Every catalog item opens an actual lesson, activity or released PDF. Legacy catalog wrappers for existing routes redirect to their canonical destination. The sitemap lists the new lesson URLs without duplicate wrapper URLs.
- The reading list preserves saved resource IDs; server rendering never receives private local progress data.
- Verify the GitHub preview before production release. Production builds use Production environment settings so indexing, Google verification and analytics remain correctly configured.

## Verification

Run unit tests, lint and a production build before Playwright. Browser checks cover each subject, search/format filters, pagination, no-match reset, topic links, question correction, model-answer disclosure, related navigation and saving across reload. Existing anatomy/renal/private-review tests also remain required. Inspect both narrow and wide screenshots of the catalog and a concept lesson.
