# Student resource access audit — 9 September 2026

All 12 public subject entries checked. Counts describe released resources, not syllabus completion.

| Subject | Lesson records | Other resources | Availability |
|---|---:|---:|---|
| Macroscopic Anatomy & Embryology | 5 | 5 | Available |
| Microscopic Anatomy, Histology & Embryology | 16 | 1 | Available |
| Microscopic Anatomy & Embryology I | 16 | 1 | Shared subset; not additional lessons |
| Microscopic Anatomy & Embryology II | 1 | 0 | Shared subset; not additional lessons |
| Molecular & Cell Biology | 7 | 0 | Available |
| Biochemistry | 6 | 0 | Available |
| Medical Physiology | 26 | 5 | Available |
| Medical Genetics | 3 | 0 | Available |
| Immunology | 3 | 0 | Shared subset; not additional lessons |
| Microbiology & Antimicrobials | 0 | 0 | No public lessons released |
| Biostatistics | 0 | 0 | No public lessons released |
| Biophysics | 50 | 1 | Available |

## Implemented

- Removed 19 intermediate web/activity pages from normal navigation; legacy URLs redirect. PDF readers remain available.
- Search uses published explanation text, captions and recap transcripts. Private source archives and editorial provenance are excluded. Results rank direct title matches first and offer explicit spelling suggestions.
- Homepage search and saved/continue shortcuts; library search before directories on mobile.
- Removed duplicate library subject navigation and duplicate study-section buttons. Source directories are secondary; study outlines are labelled.
- Genetics, immunology and Histology I/II can be filtered separately. Empty microbiology and biostatistics entries remain explicit.
- Expanded explanation steps and added section links; the existing thorax sequence is directly accessible from anatomy.
- Plexus recall map, stronger distractors and two new applied questions. Source checks: NCBI Bookshelf NBK482174 and OpenStax Anatomy and Physiology 2e 13.4, accessed 2026-09-09.
- Native transfer-file sharing where supported, with download/import fallback. Existing progress identifiers and first-attempt histories are preserved.

## Remaining substantive work

- Full syllabus coverage, a larger real-specimen histology collection and independent specialist review remain editorial work. No private textbook or slide archive was published.
- Automatic cross-device synchronisation requires an authenticated account/storage service. Manual transfer is improved, not represented as automatic sync.
- Microbiology and biostatistics have no approved web lessons; availability is now explicit.

## Verification

39 unit tests, lint, production build with public-content/privacy gates. Desktop/mobile regression results and production deployment evidence are reported in the release handoff. Browser coverage includes all subjects and filters, body-text search, typo recovery, direct legacy routes, applied anatomy and progress transfer.
