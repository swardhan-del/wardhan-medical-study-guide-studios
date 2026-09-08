# Connected anatomy topic pages

The September 6, 2026 request extended the existing musculoskeletal link to every
anatomy subject label. Thorax and abdomen now have separate pages. The shared
navigation, route guard and sitemap use the same lightweight topic registry.
The existing musculoskeletal page remains available and uses the shared navigation.

New public pages:

- Regional anatomy: four region overviews, linked to Volumes I, II, III and V.
- Thorax: mediastinum, pleura and lung comparison, from Volume I.
- Abdomen: surface regions, peritoneal relationships and arterial territories,
  from Volume II.
- Embryology: germ layers, limb patterning, gut development and kidney
  development, from Volumes V, II and III.

These pages contain 14 short lessons with source references and multiple-choice
recall. Students can change answers, check explanations and move between topics.
Answers persist while switching topics on the same page; the displayed score
belongs only to that page session and resets on a fresh load.
No account or remote progress storage is introduced.

## Source review

The curated anatomy volume DOCX files were read through their OOXML text.
SHA-256 values matched the curated manifest for all five volumes. Volume IV was
image-based and contained no extractable text, so no lesson facts are attributed
to its unseen body. Regional head-and-neck coverage uses Volume V.

| Volume | Curated DOCX record | Sections used |
| --- | --- | --- |
| I | 2152585f3ce3a77e | Thoracic Wall Core Map; Pleura 24–27; Lungs 36–38; Mediastinum 2–4 |
| II | 73111e40ac53523c | Body topics 1, 8–11, 34, 36, 40; Parts I, II, V, VI |
| III | c5978650589f0674 | Regional coverage in Parts I/V; developmental topics 36–37 |
| V | 02f130f048907d94 | Oral Exam Answer Formula; Parts III–V; developmental topics 42–43 |

Volume II's contents list and body use different topic numbering. Website
references deliberately use the numbered headings in the manuscript body.
Source-reading notes remain in the Dropbox working folder outside the repository.

Illustrations reuse the previously selected public previews: mediastinum,
abdominal regions and hip landmarks. The new pages publish short source-derived
study notes, not complete books or decks. There are no public Dropbox links,
local filesystem paths or private source documents in the deployment.

## Verification

Browser regression coverage includes all five destinations, source-anchor
resolution, incorrect-to-correct answer feedback, retention across topic changes,
desktop/mobile layout and blocked unknown/private routes.
