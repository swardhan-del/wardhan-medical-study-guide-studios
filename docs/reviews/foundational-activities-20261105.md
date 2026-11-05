# Anatomy orientation and neurulation activities

This additive change supplies nine objective-linked tasks on two existing lesson routes. Four short-name tasks distinguish recognised synonyms, explicit contrasts and unassessed wording; two sequence tasks reject incomplete or invalid stage sets; three explanation tasks expose a self-review rubric without assigning an automated score. Four original schematic views distinguish a neural sheet, groove, locally fused tube, and separation from surface ectoderm.

## Source and review boundaries

- OpenStax Anatomy and Physiology 2e, section 1.6, supports the plane terminology and reference-frame exercises: https://openstax.org/books/anatomy-and-physiology-2e/pages/1-6-anatomical-terminology
- UNSW Neural System Development supports the primary-neurulation sequence: https://embryology.med.unsw.edu.au/embryology/index.php/Neural_System_Development
- Neuroscience, The Initial Formation of the Nervous System, supports the induction-versus-lineage distinction: https://www.ncbi.nlm.nih.gov/books/NBK10993/

Sources checked November 5, 2026. Prompts and SVG geometry are original; no third-party question bank, specimen photograph, textbook page or Dropbox original is included. The anatomical image workflow is explicitly a teaching scaffold, not a mandatory clinical protocol. The neurulation diagram is labelled as simplified, local, transverse, not to scale and not a specimen; it does not represent secondary neurulation or exact crest-migration timing.

Review is an AI-assisted editorial and technical check, not independent clinical review. The component additions do not upgrade the underlying lessons' medical-review status. The all-subject depth overhaul remains incomplete.

## Compatibility and privacy

Legacy PracticeItem definitions, answer indices, saved progress keys and question IDs are unchanged. New activity IDs are stable and versioned. New drafts and checks use page state only, with that limitation visible to learners. The server supplies only the current lesson's activity records. Private curation remains excluded from deployment.

## Validation

- 132 unit tests passed, including malformed sequences, duplicate IDs, accepted synonyms, explicit contrasts and negated/unknown answers.
- Content checks, lint, typecheck and production build/privacy checks passed.
- Five focused production-build browser tests cover wrong/right/incomplete answers, keyboard activation, self-review, slide switching, accessible names and 320px/200%-text reflow.
- Desktop and enlarged-text mobile screenshots were inspected. Heading sizing and selected-stage styling were refined after inspection; the final production-build reflow run passed for both lesson routes.

The initial development-server interaction run could not hydrate its controls; the production-build run was used for behavioural validation. One test then exposed a changing locator list after rubric buttons changed names; it was corrected to select the next collapsed rubric. No product behaviour was hidden by that test change.

Hosted preview, full CI and production deployment are separate release gates. This record alone is not publication evidence.
