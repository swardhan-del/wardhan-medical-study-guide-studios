# Visual learning standard

Use a visual when it explains a relationship, spatial distinction, sequence, comparison or model more clearly than another paragraph. Do not add decorative illustrations simply to fill a lesson. A learner-produced drawing with answer checkpoints is also a useful activity; it is not a published source image.

## One presentation contract

`src/components/study-visual.tsx` supplies `StudyVisual`, `VisualComparison`, `VisualFlow` and `VisualViewport`. Existing SVG and image components render inside `StudyVisual`; do not create another independent caption layout.

```tsx
<StudyVisual title="A precise teaching title"
  alt="A useful text equivalent describing the relevant relationships."
  caption="What is represented, the orientation or model conditions, and its limits."
  observe="Compare two labelled features and explain their functional consequence."
  credit="Original teaching layout · Wardhan Medical Study Guide Studios; AI-assisted."
  sources={[{ title: "Specific scientific reference", url: "https://…" }]}>
  {/* labelled SVG, VisualComparison, VisualFlow or an approved image */}
</StudyVisual>
```

The title is visible and names the figure. The caption explains the representation, its assumptions and limitations. **Observe and explain** gives a specific student task that the displayed information supports. A keyboard-operated **Read a text description** disclosure provides the text equivalent even when an image is unavailable. Visible credits distinguish the artwork's origin from the reference supporting its science. Use `headingLevel` when embedding in a deeper section.

For static lesson comparisons or flows, add a record to `src/content/lesson-visuals.json` and list the existing lesson IDs and reference IDs. `LessonVisuals` handles public lesson and printable-revision placement. Three-column comparisons use a semantic table with row and column headers on wide screens and equivalent labelled definition lists on narrow screens. A flow is an ordered list with textual steps; arrows and step numbers are supplementary. Specify whether arrows represent sequence, position, connectivity or causation. Do not force branching processes or feedback loops into a misleading linear flow.

## Images, rights and sources

- Reuse a `public-figures.json` record through `EducationalFigure` for approved raster images. Keep its provenance, licence, approval, evidence, dimensions and responsive variants; add `observe`. New image bytes must pass the existing hash-based public-release checks.
- A file being available in Dropbox, a STEM Visualizer folder, a textbook deck or a private guide does **not** establish publication rights. Record the origin, rights holder, licence and public-use permission before importing it. A candidate or private-site approval is insufficient.
- Cite the original image source and licence for third-party artwork. Scientific references support claims; they are not permission to copy textbook figures. Never attribute an original diagram to the textbook cited for its science.
- Label original diagrams as schematic, original and AI-assisted where applicable; include orientation, scale limitations and any omitted structure. Generated or coded diagrams must never be presented as real microscopy.
- Preserve meaningful alt text, an independent caption and observation prompt when images fail. The interactive viewer must offer a text fallback for both the thumbnail and the enlarged image. Printable views retain the text description and caption without requiring the image to load.

## Accessibility and responsiveness

Use words, shapes, line styles and labels as well as colour. Static diagrams need an accessible name and text equivalent; they do not need a redundant keyboard focus stop. Scrollable diagrams do need a focusable, labelled region. Interactive controls require labels, visible focus, keyboard operation and a text result. Respect reduced motion and avoid automatic animation. Preserve modal focus return and Escape support.

At 320 px and the normal mobile viewport, avoid page overflow and clipped labels. Use stacked comparison rows where a table would become cramped. Use `VisualViewport` around detailed diagrams to preserve a legible canvas inside a labelled keyboard-accessible scrolling container. Avoid large new raster downloads; reuse responsive variants and lazy loading. The Phase Five additions require no new image downloads.

## Medical and educational review

Check each claim and arrow against the lesson's source record. Distinguish cells from matrix, tissue families from subtypes, CNS from PNS, compartments from pathways, and model predictions from measurements. Show assumptions for calculations and scope for genetic tests. Do not infer a diagnosis from a schematic or identify tissue from colour alone.

Prefer **Learning Objectives**, **Guided Explanation**, **Visual Study Prompts**, **Knowledge Check**, **Application Questions**, **Oral Examination Prompts**, **Summary Checklist** and **Sources and Further Reading**. Retain stable question IDs and progress keys even when a visible label changes. Use consistent British English in new teaching text.

## Release checklist

1. State the learning purpose and record the per-resource decision in `docs/visual-learning-audit.json`.
2. Verify title, text equivalent, caption, observation prompt, visible credit and specific references.
3. Verify rights separately from scientific accuracy; omit unresolved media.
4. Review desktop, mobile, narrow-screen and print rendering, including colour-independent interpretation.
5. Exercise keyboard controls, modal focus, reduced motion and failed image requests.
6. Run content validation, unit/component tests, typecheck, lint, production build and the complete browser suite. The visual schema is part of both content validation and prebuild.
7. Review the diff for question IDs, original lesson text, source changes and public asset hashes. Document any deliberate exclusions; do not describe an audit as expert medical certification.
