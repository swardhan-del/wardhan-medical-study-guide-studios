# First-visit improvements

The homepage previously led into renal activities before showing subjects, and My Study mixed subject discovery with saved work. This change puts subject selection after the homepage introduction, adds `/start`, and makes My Study a progress and revision destination. Existing subject-directory and renal URLs remain available.

## Coverage and learning

Each of the six native collections has starting knowledge, a suggested first lesson, a topic map of available introductions, per-lesson practice counts and selected areas needing deeper coverage. The map is an editorial guide, not an official syllabus checklist. Its gaps come from the 9 September source-structure assessment; no private manuscripts or archive paths are included. Resource counts across formats are explicitly distinguished from lesson counts.

All native lesson recap cards now start with a recall prompt and hide their answer. Moving to another card hides its answer again. The final oral prompt reveals its model answer rather than repeating the prompt.

The respiratory-mechanics lesson adds pressure/resistance teaching and three original questions: reading a pressure schematic, quiet expiration and applying the airflow/resistance relationship. Together with its existing two questions, this provides five scored items. The new schematic is original inline SVG, with equivalent pressure values in the question and accessible image text. It also appears when the question is reviewed in My Study.

Scientific basis: the existing respiratory guide adaptation and [OpenStax Anatomy and Physiology 2e, section 22.3](https://openstax.org/books/anatomy-and-physiology-2e/pages/22-3-the-process-of-breathing), checked 9 September 2026. The added relationships are pressure-driven airflow, elastic recoil during quiet expiration and flow = pressure difference / resistance in a simplified model. Independent clinical peer review has not been completed; the lesson retains that disclosure.

## Manual progress transfer

The new versioned export includes learning progress and saved resources. Older progress-only exports remain accepted. Files are read locally and limited to 1 MB; only recognised lesson, question, draft and resource identifiers are retained. Unsupported or unrelated files produce an error before any write. The user previews recognised counts and explicitly merges or cancels.

Merging unions completed items, visits and bookmarks. For duplicate question IDs, the history with the newer last-attempt timestamp wins, with current-browser history winning ties. Histories are not added together. Existing browser notes and plans take precedence; activity counters use the larger value to avoid counting a repeated import twice. This preserves the existing first-attempt result inside the selected history. It does not reconstruct independent activity across devices or provide automatic synchronisation.

Unit coverage includes malformed and oversized inputs, old exports, unknown identifiers, newer-work preservation and repeated imports. Browser coverage exercises all six first-lesson paths, hidden recall answers, diagram practice, saved answers, export to a fresh browser, preview-before-write and malformed imports. The new browser file is explicitly included in both desktop and mobile Playwright projects.
