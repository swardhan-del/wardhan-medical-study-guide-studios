# Membership experience and proposed module matrix

The actual page copy is implemented in `src/app/membership/page.tsx`; it can be reviewed at `/membership`. Account availability is at `/account`, dashboard structure at `/member`. Membership enrolment is visibly closed.

## Navigation

| Area | Navigation | Current implementation |
| --- | --- | --- |
| Planned public site | Catalogue → Curriculum map → Membership → Account → Contact | Membership and Account added; existing Subjects/Library/Start/My Study links retained for the unchanged public library. Public catalogue/map links still lead to the legacy experience until migration approval. |
| Member area | Dashboard → My modules → Downloads and tools → Account and membership | Implemented with server-rendered status and synthetic module links. All protected links recheck access on the server. |
| Dashboard | Membership status → My modules → Continue learning → Downloads and tools | Implemented; no invented progress or recent-activity data. Account progress persistence is a separate integration. |

Planned locked copy is implemented, including sign-in required, membership ended, inactive account, module not included, and verification unavailable. Locks contain no lesson excerpt. The unavailable state does not encourage a purchase or pretend payment fixes an outage.

## Proposed allocation — owner review required

These are candidate complete modules, not approved sale entitlements, readiness certifications or a claim that every source is commercially cleared. Module boundaries must be checked against the full learning sequence and rights register before launch. Existing lesson IDs remain attached to their original lessons. A new module ID would group ordered lesson IDs; it must not rename them or split an arbitrary percentage of lessons.

| Candidate complete module | Existing subject anchor | Proposed tier | Release condition |
| --- | --- | --- | --- |
| Anatomical orientation and terminology | anatomy | Basic | Whole introductory sequence and its associated practice reviewed |
| Regional anatomy, by complete anatomical region | anatomy | Advanced | One complete region per module; all prerequisite links preserved |
| Microscopy, cells and the four basic tissues | histology / histology-i | Basic | Review complete foundation sequence and images |
| Organ histology and integrated embryology, by organ system | histology-i | Advanced | Complete organ sequences; avoid splitting teaching from recognition practice |
| Neurohistology and neurodevelopment | histology-ii | Advanced | Complete prerequisites, nervous tissue, pathways and development sequence reviewed |
| Cell organisation, transport and the cell cycle | cell-biology | Basic | Full foundation module including introductory media |
| Molecular regulation and cellular signalling | cell-biology | Advanced | Detailed sequence and tools reviewed |
| Biomolecules and enzyme foundations | biochemistry | Basic | Complete prerequisite module reviewed |
| Metabolic pathways and integration | biochemistry | Advanced | Connected pathways kept together in complete modules |
| Homeostasis and cellular physiology | physiology | Basic | Complete foundation sequence reviewed |
| Renal physiology and acid–base integration | physiology; existing renal sequence | Advanced | Retain renal ordering and stable lesson slugs |
| Cardiovascular, respiratory and other organ physiology | physiology | Advanced | Separate complete system modules after review |
| Inheritance and genetic variation | genetics | Basic | Full foundation module and its explanations reviewed |
| Molecular diagnosis and therapeutic genetics | genetics | Advanced | Include all relevant introductory teaching within membership; further clinical/editorial review |
| Immune recognition and response foundations | immunology | Basic | Complete foundation sequence reviewed |
| Integrated immune mechanisms and applications | immunology | Advanced | Complete deeper sequence reviewed |
| Physical principles, units and measurement foundations | biophysics | Basic | Complete module with required calculation practice |
| Optics, radiation and imaging applications, by complete topic | biophysics | Advanced | Preserve the existing 50-lesson course order and prerequisites |
| Microbiology and antimicrobials | microbiology | Unallocated | Source/rights and module-completeness review first; no new teaching publication |
| Biostatistics | biostatistics | Unallocated | Fresh original teaching and rights review; purchased reference stays private |
| Full reviewed library | all reviewed modules | Possible future Complete | Separate product decision; not implemented as an entitlement |

Proposed prerequisites do not themselves grant access. Before selling Advanced, decide whether it includes Basic or whether each offer explicitly includes its required foundation modules. The code requires explicit module grants and does not silently assume cumulative tiers.

## Unresolved owner decisions

1. Exact module boundaries and tier allocations, including prerequisite coverage and whether Advanced includes Basic.
2. Prices, currency, billing intervals, tax treatment, refunds, cancellation timing, trial/grace policy (if any), and handling of disputes. No amounts or terms are implemented.
3. Approved authentication, durable entitlement database, private storage and payment provider/accounts; no new account or paid service has been provisioned.
4. Which reviewed, commercially cleared private modules form the first paid pilot; source and rights records remain authoritative and private.
5. Separate approval for public-content withdrawal/migration and old deployments/assets; separate approval for eventual production release. Repository visibility and history are unchanged.

A future Complete tier and physical products remain outside this change. Medical review, source rights and commercial readiness are not implied by passing software tests.
