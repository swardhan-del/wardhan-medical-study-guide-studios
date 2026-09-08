# Subject learning release — 8 September 2026

This release extends the existing website rather than publishing the source books. It follows the owner's request to integrate material from the final printable physiology guides and original STEM visuals, enrich all five anatomy volumes, apply a consistent learning format across subjects, and deploy the reviewed result to production.

## Published scope

- 19 new original web lessons: 14 physiology lessons across all eight parts of the source guide, and one focused lesson for each of the five anatomy volumes.
- 42 new explained multiple-choice questions: 19 lesson checks and 23 application questions. Existing lessons and questions remain available.
- 58 native lessons organised under six My Study subject pages, with searchable sections, format filters, recap cards, saved practice and printable web revision collections.
- 23 short narrated portrait videos and matching audio recaps: all 19 new lessons plus epithelia, PCR, enzyme kinetics and complement. Each has an exact narration transcript and timed English captions.
- Eight additional original diagrams, with lossless responsive WebP derivatives, captions, image enlargement and download controls.

Renal physiology remains inside **My Study → Physiology**. Its existing eight-lesson course and interactive activities are preserved.

## Publication boundary and review

Private source documents were inspected from local private copies. Their byte sizes and Dropbox content hashes were verified before extraction. Eight physiology parts and all five anatomy volumes informed the adaptation; Volume III was checked against the later revision 89, dated 16 August 2026. Original manuscripts, embedded media and source paths remain private. Only individually selected figures and original website adaptations enter the public release manifest.

The eight selected illustrations have explicit original/author-created provenance in their source captions or on the figure. No third-party textbook figures were copied. The anatomical label review excluded a urinary figure with a misplaced UVJ label; the separate renal-development figure is used with a caption explaining its abbreviated arrows. The thyroid schematic and other figures with unresolved labels or provenance were omitted. A respiratory equation inconsistency and overly rigid reproductive-cycle wording in source material were not carried into the new lessons.

Review here means a source and scientific-consistency check of the selected adaptation. It is **not independent clinical peer review**. Lessons and media retain that limitation and a correction route. Narrated recaps are AI-assisted scripts spoken by installed synthetic voices; no real speaker or endorsement is implied.

## Figure placement inventory

| Original figure | Web lesson placement | Teaching focus |
| --- | --- | --- |
| Lung-root nerves, Volume I | thorax-nerve-relations | Phrenic anterior; vagus posterior |
| Portal triad, Volume II | abdomen-portal-relations | Anterior duct/artery and posterior portal vein |
| Renal origins, Volume III revision 89 | pelvis-urinary-route | Ureteric bud and metanephric mesenchyme |
| Tongue innervation, Volume IV | head-neck-tongue-map | General sensation versus taste; IX exception in caption |
| Brachial plexus, Volume V | limbs-plexus-and-joints | Roots, trunks, divisions, cords and terminal nerves |
| Neuronal conductance, Physiology Part I | membrane-potentials; synaptic-integration | Timing of sodium and potassium conductance |
| Pressure–volume comparison, Physiology Part II | cardiac-cycle; cardiac-output | Isolated changes in preload, afterload and contractility |
| Airway dead space, Physiology Part III | respiratory-mechanics; ventilation-perfusion | Conducting zone, exchange zone and qualitative washout |

Existing histology comparison figures and website schematics remain available. Not every source figure is published. Captions preserve limitations, scientific meaning and the fact that schematic dimensions are not measurements.

## Delivery and privacy

All new media use relative website URLs. Videos are H.264/AAC MP4, 540 × 960, 10 fps for text-based recaps, with fast-start metadata. Audio-only copies are mono MP3. Each video is under 0.6 MB, so this small generated set can be delivered from the existing Vercel project without additional hosting. Larger archival videos remain outside Git and outside this release; they still need individual content review and suitable existing media hosting.

Players use controls, no autoplay and preload=none. Text remains available without playing media. Audio and video speeds are adjustable. Caption and transcript timing comes from the actual generated speech segments. Metadata is removed from publication derivatives. Full-resolution diagram labels are retained; no diagram was generatively edited.

The versioned public release allowlist records the exact file bytes and hashes, video IDs and audio lesson IDs. Private source directories and uncompressed build intermediates are ignored by Git and deployment.

## Extending the structure

1. Add a subject to the existing subject and taxonomy models only when there is approved teaching content. Reuse an existing subject where possible.
2. Add a system/topic node to `library-taxonomy.json` and a group to `study-collections.json`. Every native lesson belongs to exactly one study group.
3. Add an original web lesson to `library-lessons.json`, with three mechanism explanations, an explained multiple-choice check, oral recall, sources and related released resources. Keep full source documents and their paths private.
4. Add public-safe source/edition records to `library-sources.json` and verified further reading to `lesson-references.json`. Add application questions to `study-questions.json`; the practice registry includes them automatically.
5. After content and rights review, add the lesson ID to `public-release.json` and rebuild the catalog with `node scripts/build-library-catalog.mjs`. Do not approve an entire archive tree.
6. Select original or otherwise licensed diagrams individually. Preserve full frames, labels and proportions. Add variants and captions to `public-figures.json` and exact bytes/hashes to the release allowlist. The existing figure components provide responsive sizing, zoom and download.
7. Write reviewed, original dialogue in `study-recaps.json`. Add only approved lesson IDs to the video/audio release lists. Generate speech and compact derivatives with the documented local tools, listen and inspect the result, then add accurate durations, caption tracks and transcripts to `public-videos.json` and `study-audio.json`. An entry without playable approved media must not appear as ready to watch or listen.
8. Run content checks, type checking, lint, unit tests, the build and rendered privacy checks. Verify desktop/mobile journeys, real playback, seeking, captions and downloads before deployment.

Printable revision routes generate website notes from released lesson data and question explanations. They do not serve the complete book or KDP production files.

## Validation

Implementation and production verification results are recorded with the GitHub change. The presence of a preview is not evidence of a production deployment; production must be verified against the merged commit and the stable public address.

### Reproducing the small narrated recaps

On Windows, run `node scripts/prepare-recap-speech.mjs`, then `powershell -NoProfile -File scripts/synthesise-recap-speech.ps1`. Set `FFMPEG` to an existing FFmpeg executable and run `python scripts/render-recap-media.py` with Pillow installed. `RECAP_FONT` and `RECAP_FONT_BOLD` may override the Segoe UI font paths. Both preparation and rendering reject script IDs absent from the explicit media release lists. Speech intermediates stay in the ignored private working directory. Rendering changes public derivatives: inspect and listen again, then update their exact release hashes before building. No source archive import runs during a website build.
