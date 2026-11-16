# Study guide pull request checks

- At 375 px, open every internal destination in the site navigation and test retained incoming routes and fragments.
- At 375 px, open 20 seeded sample lessons. Record the seed, URLs and any layout defects.
- Use only the keyboard to navigate, submit answers, open citations and use progress export and import.
- In a fresh browser context, check that each pilot question withholds its feedback until it receives an attempt. Check the count against rendered MCQs.
- Compare lesson and catalog totals with their respective inventories, including anatomy and biostatistics.
- Check each medical change against its quoted source passage in the fact ledger.
- Record the preview URL and commit tested for each pull request.

## Owner TODOs

- Confirm the correction acknowledgement target in business days before publishing a commitment.
- Confirm the Terms effective date if the intended start differs from 16 November 2026.
- Confirm the retention periods configured for live waitlist and contact records before claiming deletion is automated.

## Local browser results

Chromium opened 31 primary navigation, footer, subject and changed feature destinations at a 375 px viewport. All returned a successful response and fit the page width. The old Biostatistics directory resolved to the new hub.

The final navigation and practice test passed on 20 sampled lessons and all 18 Anatomy Volume I lessons. The sample uses seed `20261116` and a Fisher–Yates shuffle of the library lesson list. Each pilot set rendered five questions with no feedback before an attempt. All 90 submissions revealed feedback only for attempted questions. The separate keyboard check completed the skip link, pagination, progress export and import, diagram labelling, and one pilot MCQ.

The library displayed 295 catalog resources in pages of at most 18. Biostatistics displayed seven available lessons and linked seven lesson entries. The Epithelia journey and Knowledge Check each reported 16 questions.

<details>
<summary>20 sampled lesson paths</summary>

- `/library/abdominal-surface-map`
- `/library/adenylate-kinase-charge-conservation`
- `/library/auditory-frequency-level-coding`
- `/library/biophysics-practical-eye`
- `/library/biophysics-practical-impedance`
- `/library/biophysics-sensory-biophysics`
- `/library/biophysics-thermal-radiation`
- `/library/cerebral-blood-supply`
- `/library/digestive-control`
- `/library/dna-replication`
- `/library/gonadal-duct-development`
- `/library/limbs-plexus-and-joints`
- `/library/neck-triangles`
- `/library/orbit-anatomy`
- `/library/pelvic-foramina-nerves`
- `/library/pelvic-vessels-lymph`
- `/library/pentose-phosphate-nadph-ribose`
- `/library/posterior-abdominal-wall`
- `/library/respiratory-mechanics`
- `/library/synonymous-variant-sequence-readout-scope`

</details>
