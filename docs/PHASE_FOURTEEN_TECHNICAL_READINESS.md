# Phase 14 technical readiness and evidence reconciliation

Checkpoint: 3 October 2026. Draft [PR #29](https://github.com/swardhan-del/wardhan-medical-study-guide-studios/pull/29), branch `feat/phase-twelve-lesson-preview`. Started from `f9f95e43dec2f23787ec1ccf614da864472440d2`. This is an **AI-assisted technical and editorial triage record**, not a signed clinical review, human accessibility/readability approval, visual-rights grant or release evidence. Do not link this document from `lesson-review-evidence.json`.

## CI and concrete corrections

Both GitHub validation runs for the starting head completed successfully: [PR run 37125616373](https://github.com/swardhan-del/wardhan-medical-study-guide-studios/actions/runs/37125616373) and [push run 37125613189](https://github.com/swardhan-del/wardhan-medical-study-guide-studios/actions/runs/37125613189). Their full browser suites passed. This resolves the previous handoff's pending-CI item; it does not approve the lessons.

The broader technical pass found and corrected:

1. **Enlarged-text reflow:** the nine lesson pages overflowed at 320 CSS px with 200% root text size and increased word/letter/line/paragraph spacing. Long source/prerequisite links, disclosure titles/icons and narrow navigation labels needed wrapping. The shared CSS now permits wrapping and title shrinkage while reserving the disclosure icon's width. It does not hide overflow or reduce the reader's font size.
2. **Duplicate landmark names:** the genetics flagship's enclosing visual section and nested comparisons both announced “Visual study prompts”. The nested section now has a distinct accessible name. The same shared entry-lesson component receives the correction; no section, content or keyboard control is removed.
3. **Figure reference mismatch:** `neuronal-conductance`, reused on membrane-potentials and synaptic-integration, linked to NCBI's *Chemical Synapses*. Its supporting reference now points to [OpenStax A&P 2e §12.4, The Action Potential](https://openstax.org/books/anatomy-and-physiology-2e/pages/12-4-the-action-potential), checked directly on **2026-10-03** for the illustrated sodium/potassium channel and repolarisation sequence. The former NCBI chapter title was verified through indexed NCBI text after a direct browser challenge. This is a scientific-reference correction, not an image-source or licence change. No source artwork was copied; the original-work credit, caption, asset hashes and recorded permission remain intact.

All lesson teaching records, question identities/options/keys, saved-progress registries, quality gates, review evidence and the frozen legacy baseline are unchanged from the starting head. No new route, question, search entry, asset or source import was created.

## Signed clinical review: specific missing evidence

No clinical professor's signed review was located in the available local project files. The search covered tracked documentation and review records; the ignored private intake/conversion/working trees; curation rules, models and approval manifest; and a filename inventory of the surrounding study-guide project. The inventory enumerated 137,826 files after excluding Git, Node dependencies, builds and browser-output trees. Searches looked for signed/signature/professor/clinical-review/peer-review/review-evidence names and review-attribution phrases in available text records. The only non-package review-name candidates were the empty website evidence registry and an unrelated cleanup/version inventory. The existing “review” reports are AI-assisted preparation or source checks and explicitly disclaim independent clinical review.

This is a bounded local search, not proof that a document does not exist elsewhere. It did not inspect unrelated correspondence, infer a signature from a filename, or certify scanned signatures. No signed candidate was available for signature or credential verification. Raw manuscripts and unapproved images were neither changed nor published.

**Coverage that can actually be recorded: no independently reviewed lesson, version or scope established.** Missing for each of the nine lessons: the accountable reviewer's signed record, actual qualification and independence, completion date, exact commit/content version, inspected teaching/question/visual scope, findings and disposition, plus permission for any public attribution. A broad approval of a source guide would not automatically cover these website adaptations. Keep private correspondence/signatures private; only an authorised public-safe, version-bound note may enter the existing evidence model.

## Technical accessibility and readability

The new `tests/e2e/review-readiness.spec.ts` covers all nine routes in desktop and mobile projects. It checks the whole page with Axe (no disabled rules or section-only exclusion), unique main heading, page language, noindex metadata, objectives, keyboard-operated About/text-description disclosures and focus into the source link, radio selection with Space/ArrowDown and answer submission with Enter. It repeats the scan at 320 CSS px, 200% root font size, 1.5 line height, .12em letter spacing, .16em word spacing and 2em paragraph separation; it rejects horizontal page overflow and vertically clipped teaching text/controls. Visual captions, descriptions, credit and reference links must remain present. This stresses text resizing and reflow; it is not a claim of testing actual browser zoom, all assistive technologies or WCAG conformance.

Existing focused checks additionally exercise all nine lessons' explained feedback, restored/edited notes, original answers, completion and schedules after reload. Screenshots and machine-readable visual inventories are retained only in ignored test output. The new tests initially exposed the real failures above; no assertions were weakened to pass.

AI-assisted reading checked the nine teaching sequences and worked examples for scannable mechanism headings, stated model assumptions and explicit limits. Approximate whitespace-word counts below cover teaching-step bodies only; sentence splitting is punctuation-based. These descriptive measures are not a comprehension score or medical approval, and specialist terminology must still be assessed by the intended audience. No arbitrary reading-grade cutoff was used to dilute the mechanisms.

| Lesson | Teaching-body words | Longest approximate sentence (words) | Human readability focus |
| --- | ---: | ---: | --- |
| `fluid-and-membrane-transport` | 504 | 30 | Gradient/pathway and osmolarity/tonicity distinctions. |
| `membrane-potentials` | 589 | 25 | Read voltage signs, units and cable assumptions aloud; explain exponentials. |
| `biophysics-action-potentials` | 504 | 24 | Channel states and cell-model distinctions. |
| `synaptic-integration` | 502 | 28 | Reversal potential, shunting and passive summation language. |
| `muscle-contraction` | 585 | 24 | CaV1.1/RyR1/SERCA terminology and muscle-type transitions. |
| `connective-tissue` | 486 | 24 | Cell–matrix recognition and preparation limits; mixed legacy British/US spelling. |
| `somatosensory-pathways` | 592 | 34 | Long pathway names, crossings, VPL/VPM and fictional-lesion boundary. |
| `genetics-genome-foundations` | 694 | 25 | Model assumptions, VUS uncertainty and test-scope terminology. |
| `blood-and-haemostasis` | 299 | 22 | Pronunciation/meaning of GPIb-IX-V, αIIbβ3 and coagulation complexes. |

Human screen-reader use, cognitive/learner comprehension, editorial judgement, complete focus-order review and assistive-technology/device coverage remain **not completed**. `accessibilityStatus` and `readabilityStatus` remain `pending`; automated success does not populate human evidence fields.

## Visual attribution and rights by scope

The current public-figure registry and [8 September release record](SUBJECT_LEARNING_RELEASE_2026-09-08.md) provide original/author-created attribution and an owner-requested web publication decision for the four responsive `neuronal-conductance` derivatives. All four bytes/hashes match `public-release.json`. That documented historical permission covers those exact unchanged files; it is not an independent scientific review of the current lesson.

The same release record and hash allowlist cover the existing MP3/MP4/VTT/poster sets on transport, synaptic integration, muscle contraction and haemostasis: **16 media files**, unchanged. Together with the four figure derivatives, **20 relevant released file hashes** were verified. Those existing scripts/transcripts are short recaps, not full recordings of the expanded drafts; the haemostasis recap does not teach the newly added intact-endothelium restraint. Final editorial/scientific review must assess their scope and consistency. No media was silently re-recorded or relicensed.

The following original AI-assisted text layouts have visible provenance and scientific citations. **No completed version-bound scientific/rights release note for the current layouts was found.** Attribution and a supporting textbook URL alone do not clear that gate.

| Lesson | Original layout IDs / additional rendered visuals | Recorded existing media permission | Remaining visual decision |
| --- | --- | --- | --- |
| `fluid-and-membrane-transport` | `transport-energy`, `membrane-pathway-decisions` | 4 recap files | Current visual scientific review and original-layout release decision pending. |
| `membrane-potentials` | `passive-charging-values`, `passive-distance-values` | 4 neuronal-conductance derivatives | Current visual scientific review and original-layout release decision pending. |
| `biophysics-action-potentials` | `neuronal-channel-states`, `axon-propagation-patterns` | No third-party raster/media approval inferred | Current visual scientific review and original-layout release decision pending. |
| `synaptic-integration` | `chemical-synapse-sequence`, `synaptic-integration-modes` | 4 neuronal-conductance derivatives; 4 recap files | Current visual scientific review and original-layout release decision pending. |
| `muscle-contraction` | `muscle-calcium`, `skeletal-excitation-calcium`, `sarcomere-sliding` | 4 recap files | Current visual scientific review and original-layout release decision pending. |
| `connective-tissue` | `supporting-tissue-clues`; `connective-matrix` SVG | No third-party raster/media approval inferred | Current visual scientific review and original-layout release decision pending. |
| `somatosensory-pathways` | `somatosensory-crossings`, `right-foot-vibration-route` | No third-party raster/media approval inferred | Current visual scientific review and original-layout release decision pending. |
| `genetics-genome-foundations` | `genomic-evidence-levels`; entry-guide inheritance comparison | No third-party raster/media approval inferred | Current visual scientific review and original-layout release decision pending. |
| `blood-and-haemostasis` | `blood-and-haemostasis-comparison` | 4 recap files | Current visual scientific review and original-layout release decision pending. |

The connective-matrix SVG and genetics entry comparison already identify their origin as website/AI-assisted teaching layouts. Their legacy presence does not create current-version human approval. No micrograph is supplied for connective-tissue identification. The new haemostasis mechanism visual still needs preparation, scientific review and a publication decision. Proposed plotted synaptic traces and quantitative action-potential traces are not supplied or approved by this pass.

The [Phase Five visual audit](PHASE_FIVE_VISUAL_AUDIT.md) documents 120 STEM provenance entries as not cleared by that review. The available curation models/manifest provide private-site selection, not commercial public permission. No newer public-use grant for those candidate assets was found. They remain excluded. `rights-review-pending` stays in place for all nine lessons because partial historical file permission does not complete each lesson's visual decision.

## Versions for the next human review

The teaching/question content below remains identical to `f9f95e43dec2f23787ec1ccf614da864472440d2`. These are current quality-schema SHA-256 fingerprints, provided to identify the review target, **not evidence IDs or acceptance records**. The reviewer must also record the exact final PR commit because these content fingerprints do not cover every renderer, reference or media record. Re-review any subsequent correction.

| Lesson | Content SHA-256 |
| --- | --- |
| `fluid-and-membrane-transport` | `9be48b3e4f5b6dff82d710c9cb96555c262e577a7a0d595c63e6b3f3d18b6165` |
| `membrane-potentials` | `3eeef27d88b34786415c1229fdeafea4b9a23e2519524eaf43be695c62ae292a` |
| `biophysics-action-potentials` | `59096f9f132fe88b37beb7557cee64c1830b3d4c331ca70588ce92d773c42149` |
| `synaptic-integration` | `c22fb3fad35654508d4de8c98ac25eb88b89f93562af71ff6767b21a9ce5af58` |
| `muscle-contraction` | `56cdfc152c8e32ff2cc756547426666c59fb74e7acb7cf2273d020679529747f` |
| `connective-tissue` | `320813643bd8effe3df25c570557d6932365f5745a4970074cddeef61d0b243c` |
| `somatosensory-pathways` | `f593bbf98fe86dde9701f093f82fb7ae5bc5c41348d1c1ac190d5f4271449dbe` |
| `genetics-genome-foundations` | `9111ef3d55db10eb91c79dc8e43ce3ffe1908fcfec72cdc3804e5a14b2eea017` |
| `blood-and-haemostasis` | `b2b1c32a38394e62c2b3f1723e99ebbbb1c2ccb0b7611c491b9d955ef79c4325` |

## Validation checkpoint and disposition

Current validation results are recorded in the handoff and PR against their immutable head; final preview/CI results must not be inferred from the starting commit. Local logs are in ignored `output/review-readiness/`. No private filenames, correspondence, source extracts or access credentials belong in the public content or committed evidence.

The local build initially passed, then a later build stalled with installed Next.js 16.3.4 beside locked SWC 16.3.8. The stalled task-owned build was stopped; `npm ci` restored 16.3.8 for both and a fresh production build passed. No cause for the installed-package drift is established. A premature browser invocation while the build was incomplete correctly failed to start; it is not counted as a passed check. The final browser run uses the completed fresh build. No dependency version, lockfile or test safeguard was changed.

The production dependency audit reports zero vulnerabilities. The existing development-only `braces` stack-exhaustion advisory still affects five lint-toolchain packages; the registry's latest `braces` is 3.0.3, inside the affected range. The audit's forced remediation would change the Next lint toolchain across major versions, so it was not applied. Track [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) as a separate dependency follow-up; this is not a failure of the required production-audit CI gate.

**Ready:** a technically verified draft and scoped human-review package once the listed current-head checks pass; existing attribution/permission for the 20 unchanged media files is reconciled. **Not ready for release:** none of these nine revised lessons has the complete version-bound human clinical, assessment, visual, editorial/readability and accessibility evidence required by this queue. All nine remain `medical-review-pending`, `rights-review-pending`, `explanations-complete`, `noindex-pending-review`, with pending accessibility/readability and empty evidence IDs. No clinical reviewer, qualification, review date, signature or approval was invented. Keep PR #29 draft; no merge or production deployment is authorised.
