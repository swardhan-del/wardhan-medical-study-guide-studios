# Native Biophysics course

The subject is implemented as native lessons at /study/biophysics and interactive models at /practice/biophysics. It is available through the homepage, starting route, subject directory, library search, saved resources and printable revision notes.

## Content scope

- 36 theory lessons follow the supplied Medical Biophysics I–II topic sequence.
- 14 practical lessons consolidate the overlapping measurement exercises.
- Each lesson has one concept question, one independent application question, explained alternatives and a written-recall prompt: 100 new questions in total.
- Six original coded models cover thin lenses, half-value layers, RC charging, one-dimensional diffusion, Poiseuille scaling and ultrasound echo timing.
- The structured source-section map is in src/content/biophysics-coverage.json. X-ray and CT practical themes are integrated into their corresponding theory lessons.

The three source PDFs overlap. The integration covers their topic structure; it is not a facsimile of every numbered historical question, figure or answer. Source PDF pages, private storage addresses and original illustrations are not shipped. The website contains newly written explanations and questions. The source notes, including Kai Shiida's 2018–2019 notes, are credited on each lesson. Supplementary references are linked separately.

## Editorial corrections

The adaptations distinguish FRC from ERV, transpulmonary pressure from chest-wall pressure, passive expiration from forced expiration, and regenerative action potentials from passive cable decay. Lens-at-focus and inside-focus cases are separate. X-ray cutoff calculations use consistent voltage, energy and wavelength units. Gray, sievert and becquerel are not treated as interchangeable. Historic dose limits and unverified source answers are not presented as current clinical guidance.

## Integration and verification

Content uses the existing lesson, question, catalog, taxonomy and browser-progress infrastructure. It does not depend on the source folder being reachable at runtime. Biophysics currently has no narrated recordings; unavailable media filters are hidden. Explicit narrated-subject scope preserves the existing media release validation without manufacturing a recording requirement for a text/model course.

Unit tests check physical examples, limiting cases, invalid inputs and course integrity. Desktop/mobile browser tests check search, saved answers after reload, sequential navigation, all six model controls including the focal singularity, revision notes and overflow. Existing public/private release checks continue to validate all public assets and routes.

Independent specialist review, current university syllabus alignment and hands-on instrument/experimental-image work remain separate from this native integration.
