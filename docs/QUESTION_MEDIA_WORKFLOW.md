# Question and answer media workflow

The private planning and rendering commands reuse existing lesson and question records, including renal lessons. They preserve question IDs, options, keys and model responses. They do not add questions to the website, publish videos, confer review approval, or change student progress.

Run with the repository's supported Node version:

```sh
node scripts/question-media-plan.mjs --out .private/question-media/batch-01
```

Optional `--subject` and `--lesson` filters use established IDs. The output contains the lesson plan, objectives, prerequisites, existing assessments and stable links. Every teaching section has seven depth dimensions awaiting an actual concept audit: terminology, distinctions, mechanism, application, calculation or identification, misconceptions and transfer. An empty terminology list is an unresolved audit task. Counts and matching headings are not evidence of mastery or comprehensive syllabus coverage.

To render one private review video, install Pillow in an isolated Python environment and use an installed FFmpeg executable and appropriately licensed font:

```sh
python scripts/render-question-media.py \
  --plan .private/question-media/batch-01/lesson-plan.json \
  --out .private/question-media/exports-01 \
  --lesson dna-replication --format portrait \
  --font /path/to/font.ttf --ffmpeg /path/to/ffmpeg
```

Use `--subject ID` for all lessons in a subject, or explicit `--all` for the entire plan. `--question ID` selects a particular assessment; `--all-questions` explicitly renders every question in the selected lessons. By default, one existing question is rendered per lesson. Do not present this default as an exhaustive question bank. `--format landscape` makes a wider video. Each output is organised by stable lesson and question IDs. Output directories and existing files cannot be overwritten. Plans and media must remain under ignored `.private/` or `output/`, including through symlinks.

Each silent video shows the question, an eight-second pause, the answer, feedback for every option and a return-to-lesson prompt. Long text is paginated; reading time is estimated at 130 words/minute and can be adjusted. The exporter creates PNG frames, an MP4, WebVTT, a text transcript and a manifest with the lesson fingerprint, stable question ID, dimensions, duration and media hash. It decodes the complete export to check for corruption. Captions, reading pace, pagination and pronunciation if narration is later added still need human accessibility/editorial review. These silent exports are not narrated reels.

## Integrate source depth into the existing lesson pipeline

Use the existing conversion brief and quality/review ledgers. Reconcile the controlling source edition first; separate original writing from restricted course slides, textbooks and exam banks. For each actual concept, record the source section, terminology and commonly confused terms, mechanism, assumptions, units, worked example, plausible misconceptions, application and transfer tasks. Mark dimensions not applicable only with a reason. Link each proposed assessment and media storyboard to the concept and objective. Confirm every answer and explain every alternative. Do not invent missing model answers or use an unvalidated imported key.

Keep new source-derived questions and source locators in private review packets until exact-version source/rights, scientific, editorial, accessibility and owner-release decisions are recorded. A source filename containing a licence does not clear embedded third-party assets. Existing public teaching content reused here retains its recorded limitations; exporting it does not create independent review evidence.

The older `render-recap-media.py` remains the separate approved-recap/narration workflow. These commands add assessment planning and silent question/pause/feedback exports without invoking its public-media writes or synthetic-voice jobs. No cloud credentials or paid service are required.

Planner regression tests run with `npm test`. Run the renderer's standard-library checks with `python -m unittest discover -s tests -p '*_test.py'`. A real export also requires Pillow, FFmpeg and the chosen font; unit checks alone do not verify a rendered video.
