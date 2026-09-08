# Educational figure placement inventory

This release extends native library navigation using four existing, individually released educational visuals. Originals in the archive and all nine baseline public assets retain their original bytes. New files under public/images/figures are separate web derivatives. No generative editing was used.

| Figure | Subject / topic | Placement | Evidence |
| --- | --- | --- | --- |
| Transverse thoracic plane | Anatomy / regional anatomy / thorax | Subject and topic thumbnails; thorax resource and study-page gallery | Existing original teaching schematic; baseline public release; anatomical landmarks checked against the source and [reference](https://www.ncbi.nlm.nih.gov/books/NBK459336/) |
| Nine abdominal regions | Anatomy / regional anatomy / abdomen | Topic thumbnail; regional gallery; abdomen resource and study-page figure | Original volume schematic previously released in ANATOMY_PREVIEWS.md; region names checked against the source and [OpenStax](https://openstax.org/books/anatomy-and-physiology-2e/pages/1-6-anatomical-terminology) |
| Simple cuboidal section | Histology / basic tissues / microscopy / renal histology | Subject/topic thumbnails; microscopy first passage; renal tubular-clues passage; epithelial comparison gallery | Existing Berkshire Community College image, CC0; source description and 200x magnification rechecked |
| Stratified squamous section | Histology / basic tissues / epithelia | Topic gallery and paired comparison after the epithelial visual exercise | Existing Berkshire Community College image, CC0; source description and 100x magnification rechecked |

The two micrograph source records remain in src/content/visual-sources.json; they are third-party CC0 material, not represented as the user's work. Public figure records contain alt text, captions, rights, evidence, mappings and responsive sizes. Private provenance and unresolved candidate paths remain in .private/figure-source-review.json, excluded from Git and deployment.

## Preparation and extension

Select a specific approved source in figure-selections.json after inspecting its complete image and rights/privacy/medical-review evidence. Source inclusion in a private manifest or a folder named Approved Illustrations is insufficient when its own release gates remain open. This release does not promote any new raw archive candidate.

Run node scripts/prepare-public-figures.mjs explicitly to create proportional derivatives. This command accepts only source bytes already pinned in public-release.json; it is not run automatically at build time. For a newly authorized source, first record its exact release approval and source hash. Keep private originals outside the public delivery tree. The script makes WebP at 320, 640, 1280 and source width where possible, without upscaling; diagrams use lossless encoding and micrographs use quality 92. Metadata is stripped. If using an isolated local Sharp installation, set FIGURE_TOOLS_ROOT to its directory; ordinary installed Next.js dependencies supply Sharp on the build host.

Reinspect full-size and mobile derivatives before committing. Run node scripts/check-figures.mjs and the normal content/build/browser checks. public-release.json pins every derivative by byte count and SHA-256. Mapping topicIds, subjectIds and resourceIds extends existing cards and galleries. Passage placement is explicit in LibraryLesson so a figure appears beside the explanation it supports.

The viewer offers native modal focus containment, Escape/close, focus return, 150/200/300-percent zoom, keyboard/swipe scrolling, a full-size link and download. Full-resolution image data is mounted only when the viewer opens. Inline images have intrinsic dimensions, responsive srcsets, full-frame sizing, lazy loading and async decoding. Comparison views explicitly distinguish different source magnifications.

## Review dependencies

The controlled inventory retains 248 existing source-review flags. The Volume V provenance register identifies eight programmatic original schematics, but its handoff packet leaves medical/teaching and rights/provenance gates open. These and uncertain third-party captures remain unpublished by this change. Selected existing pelvic/brain/hip previews were inspected but are not expanded into new teaching placements pending detailed label review. No claim of a complete archive-wide medical or copyright audit is made.
