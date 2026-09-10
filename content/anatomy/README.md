# Anatomy lesson manuscripts

This folder is the editable five-volume course: **120 written lessons**, including the six existing website lesson IDs. The volumes contain **18 / 22 / 18 / 30 / 32** lessons.

Each numbered JSON file is canonical. Its adjacent Markdown file is a readable manuscript generated from exactly that record. Edit the JSON, then run:

```
npm run content:anatomy
npm run content:check
```

The build checks for stale manuscripts and website data. The compiler updates lesson content, practice, volume order, printable groups and reference records. A new lesson also needs explicit taxonomy and release-allowlist review; the compiler does not grant publication permission to new assets.

Each lesson includes objectives, preparation links, a source-based explanation, an additional mechanism explanation, a worked example, a new drawing/identification task, five explained practice items and an oral recap. The source guide title and specific sections are recorded, with introductory further reading. The further-reading link is context, not a claim that one external page supports every sentence in a regional lesson.

Start with [the coverage register](COVERAGE.md). The website renders the same content at `/study/anatomy` and `/library/<lesson-id>`. Printable collections at `/study/anatomy/revision` have five dividers and selectable volume/answer-key controls.

The raw source manuscripts remain preserved outside this public content folder. This release uses the authored divided-volume source set and records its selected section coverage; it does not claim that filename dates establish the latest version of every manuscript in the archive. No unreviewed private STEM media or third-party atlas plates are copied. New drawing tasks provide identification practice; they are not a replacement for a labelled dissection or imaging atlas.

Editorial checks corrected source extraction artifacts and clarified several anatomical distinctions: spleen origin versus celiac territory, portal versus hepatic veins, arterial versus venous anastomoses, somatic versus autonomic pathways, trochlear crossing before exit, spinal accessory nuclear level, pelvic brim boundaries, variable vertebral counts, urethral-lineage simplifications, and emission versus ejaculatory expulsion. Independent medical peer review has not been completed.
