import ovarianPracticalSpecimens from "@/content/ovarian-practical-specimens.json";
import femalePracticalSpecimens from "@/content/female-practical-specimens.json";
import mammarySpecimens from "@/content/mammary-specimens.json";
import reproductiveSpecimen from "@/content/reproductive-specimen.json";
import { ReproductiveRouteEntry } from "./reproductive-route-entry";
import brainCsfSpecimen from "@/content/brain-csf-specimen.json";
import neurulationSpecimen from "@/content/neurulation-specimen.json";
import placentaSpecimen from "@/content/placenta-specimen.json";
import lymphoidSpecimen from "@/content/lymphoid-specimen.json";
import { PlacentaCirculation } from "./placenta-circulation";
import { EndocrineDevelopmentMap, hasEndocrineDevelopmentMap } from "./endocrine-development-map";
import { MuscleSpecimenEntry } from "./muscle-specimen-entry";
import { BloodSpecimenExplorer } from "./blood-specimen-explorer";
import { SpecimenExplorerEntry, HistologyVisualEntry } from "./specimen-explorer-entry";
import { CollagenRouteExplorer, BonePreparationExplorer } from "./connective-bone-explorers";
import { PhysiologyCourseNavigation } from "./physiology-course-navigation";
import { GlandStructureExplorer, BarrierReadoutExplorer, JunctionMapExplorer } from "./epithelial-explorers";
import { GIProfileExplorer } from "./gi-profile-explorer";
import { SystemRelationships } from "./system-relationships";
import { HistologySectionReferences } from "./histology-section-references";
import { LearningActivities } from "./learning-activities";
import { NeurulationSlides } from "./neurulation-slides";
import { activitiesForLesson } from "@/content/learning-activities";
import { VisualStudioInvitation } from "./visual-studio-invitation";
import { LymphoidPractical, PreparationSequence, HistologyDemonstrations } from "./histology-practical";
import { CaseControlExplorer } from "./case-control-explorer";
import { qualityForLesson, hasRecordedReview } from "@/lib/lesson-quality";
import { AboutLesson } from "./about-lesson";
import { TopicGuideLinks } from "@/components/topic-guide-links";
import { StructuredData } from "./structured-data";
import { lessonSchema } from "@/lib/structured-data";
import { LessonJourney, LessonReview } from "./lesson-journey";
import { journeyLessons } from "@/lib/lesson-journeys";
import { HistologyTopicVisual, hasHistologyTopicVisual } from "./histology-foundations-visuals";
import { LessonVisuals, visualsForLesson } from "./lesson-visuals";
import { SubjectEntryContent } from "./subject-entry-content";
import { newEntryLessonIds } from "@/content/subject-hubs";
import { AnatomyFoundationsContent } from "./anatomy-foundations-content";
import { HistologyFoundationsContent } from "./histology-foundations-content";
import { AnatomyLessonNavigation, AnatomyIdentification, AnatomyPractice } from "./anatomy-course";
import { PlexusRecall } from "./plexus-recall";
import { TeachingDiagram, hasTeachingDiagram } from "./teaching-diagram";
import { foundations } from "@/content/foundations";
import { EducationalFigure, FigureGallery } from "./educational-figure";
import { figuresForResource } from "@/lib/figures";
import { videosForLesson } from "@/lib/videos";
import { LessonVideos } from "./lesson-videos";
import { ResourceBreadcrumbs } from "./taxonomy-navigation";
import references from "@/content/lesson-references.json";
import studio from "@/content/study-questions.json";
import audioData from "@/content/study-audio.json";
import { StudyAudio, type StudyAudioRecord } from "./study-audio";
import { StudyReel } from "./study-reel";
import transfer from "@/content/transfer-practice.json";
import { SavedRecall, SavedSelfCheck } from "./saved-recall";
import { CorrectionLink } from "./correction-link";
import Link from "next/link";
import { BiophysicsLessonSequence } from "./biophysics-course";
import { subjectInterests } from "@/content/subjects";
import { librarySubjects } from "@/lib/taxonomy";
import sourceData from "@/content/library-sources.json";
import { publicCatalog } from "@/lib/catalog";
import { resourceHref } from "@/lib/catalog-types";
import type {
  LibraryLesson as Lesson,
  LibrarySource,
} from "@/lib/library-types";
import { getSiteUrl } from "@/lib/site-url";
import { SaveButton } from "./save-button";
import { ConceptCheck } from "./concept-check";
import type { ReactNode } from "react";

export function LibraryLesson({ lesson, reviewVisuals }: { lesson: Lesson; reviewVisuals?: ReactNode }) {
  const editorialRecorded = !qualityForLesson(lesson.id) || hasRecordedReview(lesson.id, "editorial");
  const clinicallyReviewed = qualityForLesson(lesson.id)?.contentStatus === "independently-clinically-reviewed";
  const journey = journeyLessons.find(item => item.id === lesson.id)!;
  const anatomyFoundations = lesson.id === "anatomy-foundations";
  const originalReferenceTeaching = ["ovarian-histology-and-development", "female-tract-histology-and-development", "mammary-histology-and-development", "reproductive-histology", "neurulation", "placenta", "muscle-histology", "vessel-histology", "blood-marrow", "connective-tissue", "cartilage-bone", "epithelia", "cell-junctions", "liver-pancreas", "gi-histology", "renal-histology", "respiratory-histology", "microscopy", "lymphoid-organs", "allele-and-genotype-counts", "venous-muscle-pump-direction", "retinal-on-off-bipolar-response", "fatty-acid-oxidation-compartment-route", "genetic-drift-sampling-model", "rna-processing", "antigen-presentation", "thyroid-parathyroid-pattern-reasoning", "adrenal-layers-signals-reasoning", "pituitary-glandular-neural-orientation"].includes(lesson.id);
  const subjectEntry = newEntryLessonIds.includes(lesson.id);
  const flagship = anatomyFoundations || subjectEntry || lesson.id === "histology-foundations-tissues";
  const reviewedSupplementalPractice = ["ovarian-histology-and-development", "female-tract-histology-and-development", "mammary-histology-and-development", "reproductive-histology", "neurulation", "placenta", "muscle-histology", "vessel-histology", "blood-marrow", "connective-tissue", "cartilage-bone", "epithelia", "cell-junctions", "liver-pancreas", "gi-histology", "renal-histology", "respiratory-histology", "microscopy", "lymphoid-organs", "peroxisome-pts1-pex5-cargo", "lysosomal-m6p-tag-receptor-recycling", "synonymous-variant-sequence-readout-scope", "antibody-mutation-class-switch", "ocular-motor-nerves", "biophysics-fluid-flow", "myelin-and-glial-cells", "serine-one-carbon-donor-carrier-cofactor", "thoracic-development", "ventilation-perfusion", "pentose-phosphate-nadph-ribose", "cohort-case-control-denominators", "allele-and-genotype-counts", "venous-muscle-pump-direction", "retinal-on-off-bipolar-response", "fatty-acid-oxidation-compartment-route", "genetic-drift-sampling-model", "rna-processing", "antigen-presentation", "thyroid-parathyroid-pattern-reasoning", "adrenal-layers-signals-reasoning", "pituitary-glandular-neural-orientation"].includes(lesson.id);
  const figures = figuresForResource(lesson.id);
  const hasFigures = hasHistologyTopicVisual(lesson.id) || figures.length > 0 || hasTeachingDiagram(lesson.id) || visualsForLesson(lesson.id).length > 0;
  const figureTarget = ["ovarian-histology-and-development", "female-tract-histology-and-development", "mammary-histology-and-development", "reproductive-histology", "brain-and-csf-barriers", "neurulation", "placenta", "microscopy", "renal-histology"].includes(lesson.id) && figures.length ? `#figure-${figures[0].id}` : "#lesson-figures";
  const foundation = foundations[lesson.subject];
  const subject = subjectInterests.find((s) => s.id === lesson.subject) ?? librarySubjects.find((s) => s.id === lesson.subject)!;
  const source = (sourceData as Record<string, LibrarySource>)[lesson.source];
  const topicReferences = references as Record<
    string,
    { title: string; url: string; checkedAt: string; supportingIds?: string[]; supportingReferences?: { title: string; url: string }[] }
  >;
  const reference = topicReferences[lesson.id];
  const retrievalQuestions = studio.questions.filter(q => q.topic === lesson.id && "heading" in q);
  const applicationQuestions = [...transfer.questions, ...studio.questions]
    .filter(q => q.topic === lesson.id && !("heading" in q));
  const related = lesson.related
    .map((id) => publicCatalog.find((r) => r.id === id))
    .filter((r) => r !== undefined);
  const schema = lessonSchema({
    path: `/library/${lesson.id}`, title: lesson.title, summary: lesson.summary,
    updatedAt: lesson.updatedAt, minutes: lesson.minutes, objectives: lesson.objectives,
    citation: [`${source.title}. ${source.edition}. ${lesson.section}.`, ...(reference ? [reference.url, ...(reference.supportingReferences ?? []).map(r => r.url)] : [])],
  }, getSiteUrl());
  return (
    <article className="site-container concept-page">
      <StructuredData data={schema} />
      <ResourceBreadcrumbs id={lesson.id} />
      <header className="concept-heading">
        <p className="eyebrow">
          {subject.title} · {lesson.minutes} minute {lesson.workedExample ? "guided lesson" : "concept introduction"}
        </p>
        <h1>{lesson.title}</h1>
        <p className="interior-lede">{lesson.summary}</p>
        <p className="muted-note">
          Read the explanation, check your understanding and revisit the recap. Further reading and editorial notes are included below.
        </p>
        <div className="action-row">
          <a className="button button-primary" href="#concept-check-title">
            {flagship ? "Begin the Knowledge Check ↓" : "Begin the Knowledge Check ↓"}
          </a>
          <SaveButton id={lesson.id} title={lesson.title} />
          {videosForLesson(lesson.id).length > 0 && <a className="text-link" href="#lesson-videos">Watch video</a>}
          {(audioData.records as StudyAudioRecord[]).some(a => a.lessonId === lesson.id) && <a className="text-link" href="#audio-recap">Listen to audio recap</a>}
          <a href="#lesson-source" className="text-link">
            {flagship ? "Sources and Further Reading" : "Guide and sources"}
          </a>
        </div>
      </header>
      {["microscopy", "lymphoid-organs", "histology-foundations-tissues"].includes(lesson.id) && <VisualStudioInvitation compact />}
      <AboutLesson lessonId={lesson.id} />
      <LessonJourney lesson={journey} />
      {lesson.id === "thorax-nerve-relations" && <p className="study-notice">New to anatomy? <Link href="/start/anatomy">Review position, directions and body planes first</Link>.</p>}
      {lesson.subject === "biophysics" && <BiophysicsLessonSequence lessonId={lesson.id} />}
      {flagship ? <nav className="lesson-jumps" aria-label="Lesson sections">
        <a href="#lesson-objectives">Learning Objectives</a><a href="#core-concepts-title">Core Concepts</a>
        <a href="#concept-map-title">Guided Explanation</a><a href="#visual-study-title">Visual Study Prompts</a>
        <a href="#worked-example-heading">Worked Example</a><a href="#knowledge-check-heading">Knowledge Check</a>
        <a href="#application-heading">Clinical and Applied Questions</a><a href="#oral-recall-title">Oral Examination Prompts</a>
        <a href="#recap">Recall practice</a><a href="#summary-checklist-title">Summary Checklist</a><a href="#lesson-source">Sources</a>
      </nav> : <nav className="lesson-jumps" aria-label="Lesson sections"><a href="#concept-map-title">Explanation</a>{hasEndocrineDevelopmentMap(lesson.id) && <a href="#endocrine-development-title">Development map</a>}{lesson.id === "muscle-histology" && <a href="#muscle-specimen-title">Compare specimens</a>}{lesson.id === "blood-marrow" && <a href="#blood-specimen-title">Choose a preparation</a>}{lesson.id === "lymphoid-organs" && <a href="#lymphoid-specimen-title">Read the specimen</a>}{lesson.id === "ovarian-histology-and-development" && <><a href="#ovary-small-follicle-specimen-title">Read a small follicle</a><a href="#ovary-cumulus-complex-specimen-title">Trace the cumulus</a><a href="#ovary-corpus-albicans-specimen-title">Compare a fibrous remnant</a></>}{lesson.id === "female-tract-histology-and-development" && <><a href="#female-proliferative-specimen-title">Compare endometrial fields</a><a href="#female-tubal-wall-specimen-title">Read tubal architecture</a><a href="#female-tubal-epithelium-specimen-title">Read the epithelial border</a></>}{lesson.id === "mammary-histology-and-development" && <><a href="#mammary-lobule-specimen-title">Read lobular architecture</a><a href="#mammary-acinus-specimen-title">Read an acinar profile</a></>}{lesson.id === "reproductive-histology" && <><a href="#reproductive-specimen-title">Read the specimen</a><a href="#reproductive-route-title">Explore transport and development</a></>}{lesson.id === "brain-and-csf-barriers" && <><a href="#brain-csf-specimen-title">Read the specimen</a><a href="#brain-barrier-explorer">Explore barrier routes</a></>}{lesson.id === "neurulation" && <><a href="#neurulation-specimen-title">Read the specimen</a><a href="#neurulation-folding">Explore folding</a><a href="#lesson-videos">Research movies</a></>}{lesson.id === "placenta" && <><a href="#placenta-specimen-title">Read the specimen</a><a href="#placenta-circulation-title">Trace two circuits</a></>}{lesson.id === "connective-tissue" && <a href="#collagen-route-title">Collagen pathway</a>}{lesson.id === "cartilage-bone" && <a href="#bone-preparation-title">Preparation explorer</a>}{lesson.id === "epithelia" && <a href="#gland-explorer-title">Gland comparison</a>}{lesson.id === "cell-junctions" && <><a href="#junction-map-title">Junction map</a><a href="#barrier-explorer-title">Barrier exercise</a></>}{lesson.id === "gi-histology" && <a href="#gi-profile-explorer-title">Compare villus and crypt</a>}{(lesson.id === "liver-pancreas" || lesson.id === "renal-histology" || lesson.id === "respiratory-histology") && <a href="#system-relationships-title">Trace a route</a>}{lesson.id === "cohort-case-control-denominators" && <a href="#case-control-explorer-title">Population explorer</a>}{hasFigures && <a href={figureTarget}>Figures</a>}<a href="#concept-check-title">Questions</a><a href="#recap">Recall practice</a><a href="#oral-recall-title">Oral Examination Prompts</a>{reviewedSupplementalPractice && <a href="#summary-checklist-title">Summary Checklist</a>}<a href="#lesson-source">Sources</a></nav>}
      <AnatomyLessonNavigation lessonId={lesson.id} />
      <TopicGuideLinks lessonId={lesson.id} />
      <div className="concept-layout">
        <div>
          {flagship ? (subjectEntry ? <SubjectEntryContent lesson={lesson}/> : anatomyFoundations ? <AnatomyFoundationsContent lesson={lesson}/> : <HistologyFoundationsContent lesson={lesson}/>) : <>
          <section className="study-panel lesson-preparation" aria-labelledby="lesson-objectives">
            <h2 id="lesson-objectives">What you will be able to explain</h2>
            <ul>{(lesson.objectives ?? [lesson.summary]).map(objective => <li key={objective}>{objective}</li>)}</ul>
            {foundation && <p><Link href={`/learn/foundations/${lesson.subject}`}>New to this subject? Learn the starting vocabulary</Link></p>}
            {foundation && <details><summary>Subject vocabulary reminder</summary><dl className="foundation-terms">{foundation.terms.map(([term, definition]) => <div key={term}><dt>{term}</dt><dd>{definition}</dd></div>)}</dl><a href={foundation.source}>Vocabulary reference</a></details>}
            {lesson.prerequisites && <><h3>Useful preparation</h3>{lesson.subject === "anatomy" && <p>Know anatomical position, planes and directional terms, and distinguish an artery, vein, nerve and duct. The previous lesson is a useful sequence step; use the volume contents if you already know it.</p>}<ul>{lesson.prerequisites.map(id => {
              const resource = publicCatalog.find(r => r.id === id);
              return resource ? <li key={id}><Link href={resourceHref(resource)}>{resource.title}</Link></li> : null;
            })}</ul></>}
          </section>
          {lesson.id === "gi-histology" && <GIProfileExplorer />}
          <section
            className="concept-explanations"
            aria-labelledby="concept-map-title"
          >
            <p className="eyebrow">{lesson.steps.length} ideas to connect</p>
            <h2 id="concept-map-title">Build the explanation</h2>
            <p>Read the connected steps, then explain them without looking.</p>
            <div className="concept-sequence">
              {lesson.steps.map((step, index) => (
                <details key={step.title} open>
                  <summary>
                    <span className="concept-number" aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="concept-step-title">{step.title}</span>
                    <span className="concept-expand" aria-hidden="true">
                      +
                    </span>
                  </summary>
                  {step.body.split("\n\n").map((paragraph, i) => <p key={i}>{paragraph.startsWith("Try it:") ? <><strong>Try it:</strong>{paragraph.slice(7)}</> : paragraph}</p>)}
                  {step.practice && <div className="lesson-reasoning"><p><strong>Apply this distinction:</strong> {step.practice.prompt}</p><details><summary>Check the reasoning</summary><p>{step.practice.feedback}</p></details></div>}
                  <HistologySectionReferences lessonId={lesson.id} index={index} />
                  {((lesson.id === "microscopy" && index === 0) ||
                    (lesson.id === "renal-histology" && index === 3)) &&
                    figuresForResource(lesson.id).map((f) => (
                      <EducationalFigure key={f.id} figure={f} />
                    ))}
                </details>
              ))}
            </div>
          </section>
          {lesson.id === "neurulation" && <><SpecimenExplorerEntry figure={figures.find(figure => figure.id === "chick-neural-tube-labels")!} data={neurulationSpecimen} scope="neurulation" introduction="Orient the lumen, then compare the labelled wall regions. The numbered markers are study regions, not cell boundaries. Hide them to practise without hints; no channel is artificially isolated." /><section id="neurulation-folding" aria-label="Primary folding activity"><NeurulationSlides /></section></>}
          {lesson.id === "brain-and-csf-barriers" && <SpecimenExplorerEntry figure={figures.find(figure => figure.id === "human-choroid-plexus-labelled")!} data={brainCsfSpecimen} scope="brain-csf" licenseLabel="CC0 1.0 terms" introduction="Follow the epithelial covering around a vascular stromal core. Choose a study region, describe what is visible, then compare the interpretation. Hiding numbered markers leaves the original photograph’s text and arrows visible; this is guided interpretation, not a blind identification test." />}
          {lesson.id === "reproductive-histology" && <><ReproductiveRouteEntry /><SpecimenExplorerEntry figure={figures.find(figure => figure.id === "human-epididymis-he")!} data={reproductiveSpecimen} scope="reproductive" licenseLabel="CC BY-SA 3.0 terms" introduction="Follow the tall lining around a ductal lumen, then compare the separate small vessel and surrounding tissue. Select a numbered study region and describe what you can see before interpreting it. Region markers can be hidden; they are not cell boundaries." /></>}
          {lesson.id === "placenta" && <><PlacentaCirculation /><SpecimenExplorerEntry figure={figures.find(figure => figure.id === "placenta-term-villus")!} data={placentaSpecimen} scope="placenta" licenseLabel="CC0 1.0 terms" introduction="Find the outer trophoblast boundary, then distinguish blood inside and outside the villus. Choose a numbered region to compare observation and interpretation. Markers identify broad study regions; hide them for retrieval practice." /></>}
          {lesson.id === "mammary-histology-and-development" && <>
            <SpecimenExplorerEntry figure={figures.find(figure => figure.id === "human-mammary-tdlu-segmentation")!} data={mammarySpecimens[1]} scope="mammary-lobule" licenseLabel="CC BY 4.0 terms" introduction="Begin with the uncoloured H&E panels on the left. Compare grouped epithelial profiles with broader stroma, then inspect the computer segmentation on the right. The two panel pairs have separate scale bars; this is research biopsy material, not a lactation time series." />
            <SpecimenExplorerEntry figure={figures.find(figure => figure.id === "human-mammary-acinus-he")!} data={mammarySpecimens[0]} scope="mammary-acinus" licenseLabel="CC0 1.0 terms" introduction="This separate high-power specimen shows an acinar lumen, lining and surrounding tissue. It is not a zoom into the preceding image. Choose a numbered region, describe its arrangement, then compare the interpretation." />
          </>}
          {lesson.id === "female-tract-histology-and-development" && <>
            <SpecimenExplorerEntry figure={figures.find(figure => figure.id === "endometrium-proliferative-he")!} data={femalePracticalSpecimens[0]} scope="female-proliferative" imageLoading="lazy" licenseLabel="CC BY-SA 3.0 terms" introduction="Orient to the mucosal surface and gland profiles. Compare epithelial arrangement with the tissue between glands; the erythrocytes do not establish a bleeding cause or exact cycle day." />
            <SpecimenExplorerEntry figure={figures.find(figure => figure.id === "endometrium-secretory-he")!} data={femalePracticalSpecimens[1]} scope="female-secretory" imageLoading="lazy" licenseLabel="CC BY-SA 3.0 terms" introduction="This is a separate source-labelled secretory specimen, not a later photograph of the first sample. Compare gland borders and pale luminal material; the routine image is not a PAS/diastase assay." />
            <SpecimenExplorerEntry figure={figures.find(figure => figure.id === "tubal-folded-wall")!} data={femalePracticalSpecimens[2]} scope="female-tubal-wall" imageLoading="lazy" licenseLabel="CC BY 2.0 terms" introduction="Begin at the folded mucosa and move outward to the wall. The source does not report a stain or exact tubal segment, so identify visible relationships before assigning a region." />
            <SpecimenExplorerEntry figure={figures.find(figure => figure.id === "tubal-ciliated-border")!} data={femalePracticalSpecimens[3]} scope="female-tubal-epithelium" imageLoading="lazy" licenseLabel="CC0 1.0 terms" introduction="This separate high-power image shows the luminal border and supporting tissue. It is not a zoom into the previous wall image, and a fixed photograph cannot demonstrate ciliary motion." />
          </>}
          {lesson.id === "ovarian-histology-and-development" && <>
            <SpecimenExplorerEntry figure={figures.find(figure => figure.id === "ovary-small-follicle")!} data={ovarianPracticalSpecimens[0]} scope="ovary-small-follicle" imageLoading="lazy" licenseLabel="Public domain terms" introduction="Stain, fixation, embedding and section thickness not reported. No calibrated scale supplied; use for relationships, not morphometry. Read the visible relationships before naming an exact stage. These separate source fields are not a time series." />
            <SpecimenExplorerEntry figure={figures.find(figure => figure.id === "ovary-cumulus-complex")!} data={ovarianPracticalSpecimens[1]} scope="ovary-cumulus-complex" imageLoading="lazy" licenseLabel="CC BY 2.0 terms" introduction="Stain, fixation, embedding and section thickness not reported. No calibrated scale supplied; use for relationships, not morphometry. Read the visible relationships before naming an exact stage. These separate source fields are not a time series." />
            <SpecimenExplorerEntry figure={figures.find(figure => figure.id === "ovary-corpus-albicans")!} data={ovarianPracticalSpecimens[2]} scope="ovary-corpus-albicans" imageLoading="lazy" licenseLabel="Public domain terms" introduction="Stain, fixation, embedding and section thickness not reported. No calibrated scale supplied; use for relationships, not morphometry. Read the visible relationships before naming an exact stage. These separate source fields are not a time series." />
          </>}
          {hasEndocrineDevelopmentMap(lesson.id) && <EndocrineDevelopmentMap lessonId={lesson.id} />}
          {(lesson.id === "liver-pancreas" || lesson.id === "renal-histology" || lesson.id === "respiratory-histology") && <SystemRelationships lessonId={lesson.id} />}
          {lesson.id === "muscle-histology" && <MuscleSpecimenEntry figures={figures} />}
          {lesson.id === "blood-marrow" && <BloodSpecimenExplorer />}
          {lesson.id === "connective-tissue" && <CollagenRouteExplorer />}
          {lesson.id === "cartilage-bone" && <BonePreparationExplorer />}
          {lesson.id === "epithelia" && <GlandStructureExplorer />}
          {lesson.id === "cell-junctions" && <><JunctionMapExplorer /><BarrierReadoutExplorer /></>}
          {lesson.id === "cohort-case-control-denominators" && <CaseControlExplorer />}
          {lesson.id === "microscopy" && <><PreparationSequence/><HistologyDemonstrations/></>}
          {lesson.id === "lymphoid-organs" && <><SpecimenExplorerEntry data={lymphoidSpecimen} figure={figures.find(figure => figure.id === "normal-lymph-node-architecture")!}/><LymphoidPractical/></>}
          {lesson.workedExample && <section className="study-panel" aria-labelledby="worked-example-heading">
            <p className="eyebrow">Work it through</p>
            <h2 id="worked-example-heading">{lesson.workedExample.title}</h2>
            <p>{lesson.workedExample.prompt}</p>
            <details><summary>Show the reasoning</summary><ol>{lesson.workedExample.solution.map(step => <li key={step}>{step}</li>)}</ol></details>
          </section>}
          <AnatomyIdentification lessonId={lesson.id} />
          {hasFigures && <span id="lesson-figures" />}
          <TeachingDiagram lessonId={lesson.id} />
          <LessonVisuals lessonId={lesson.id} />
          {reviewVisuals}
          <HistologyTopicVisual lessonId={lesson.id} />
          {lesson.id === "epithelia" && (
            <>
              <HistologyVisualEntry />
              <FigureGallery
                figures={figuresForResource(lesson.id)}
                title="Compare epithelial architecture"
                comparison
              />
            </>
          )}
          {lesson.id === "nitrogen-metabolism" && (
            <section className="study-panel">
              <p className="eyebrow">Worked mechanism</p>
              <h2>Follow the nitrogen without losing the carbon</h2>
              <p>
                Take alanine as an example. Alanine aminotransferase transfers
                its amino group to α-ketoglutarate, producing glutamate and
                pyruvate. This transfers nitrogen; it does not yet excrete it.
                Pyruvate retains the carbon skeleton and can enter other
                metabolic pathways.
              </p>
              <ol>
                <li>
                  Collect nitrogen: transamination places many amino groups on
                  glutamate.
                </li>
                <li>
                  Handle nitrogen: glutamate can supply ammonium, while
                  aspartate supplies the other nitrogen incorporated into urea.
                </li>
                <li>
                  Package for disposal: the hepatic urea cycle converts these
                  nitrogen inputs into urea.
                </li>
                <li>
                  Eliminate: urea travels in blood to the kidneys for urinary
                  excretion. Renal ammonium excretion is a separate, important
                  route linked to acid–base balance.
                </li>
              </ol>
              <p>
                <strong>Check the distinction:</strong> transferring an amino
                group, making urea and excreting nitrogen are different steps.
                Do not use these verbs interchangeably.
              </p>
            </section>
          )}
          {!["ovarian-histology-and-development", "female-tract-histology-and-development", "mammary-histology-and-development", "reproductive-histology", "brain-and-csf-barriers", "neurulation", "placenta", "epithelia", "microscopy", "renal-histology", "muscle-histology"].includes(lesson.id) && <FigureGallery figures={figuresForResource(lesson.id).filter(figure => figure.id !== "normal-lymph-node-architecture")} title="Connect the figure with the explanation" />}
          {lesson.id === "limbs-plexus-and-joints" && <PlexusRecall />}
          <ConceptCheck
            key={`concept-${lesson.id}`}
            lesson={{ id: lesson.id, question: lesson.question }}
            additional={[...retrievalQuestions, ...applicationQuestions].map((q, index) => ({ item: q, title: `${"heading" in q && typeof q.heading === "string" ? q.heading : "title" in q && typeof q.title === "string" ? q.title : "Apply the concept in a different setting"} — practice ${index + 1}` }))}
          />
          <AnatomyPractice lessonId={lesson.id} />
          <span id="studio-practice" /><span id="apply-the-concept" />
          <section
            className="concept-recall study-panel"
            aria-labelledby="oral-recall-title"
          >
            <p className="eyebrow">Explain from memory</p>
            <h2 id="oral-recall-title">Oral Examination Prompts</h2>
            <p className="concept-prompt">{lesson.recall.prompt}</p>
            <SavedRecall id={`oral-${lesson.id}`} />
            <details>
              <summary>Reveal a model answer</summary>
              <p>{lesson.recall.answer}</p>
            </details>
            <p className="muted-note">
              Try explaining the mechanism aloud before revealing the answer.
            </p>
            {reviewedSupplementalPractice && lesson.oralExamination?.map((question, index) => <div key={question.prompt}>
              <h3>Prompt {index + 1}</h3>
              <p>{question.prompt}</p>
              <details><summary>Model response {index + 1}</summary><p>{question.answer}</p></details>
            </div>)}
          </section>
          {reviewedSupplementalPractice && lesson.summaryChecklist && <section className="study-panel" aria-labelledby="summary-checklist-title">
            <h2 id="summary-checklist-title">Summary Checklist</h2>
            <p>Mark a point when you can explain it without notes. Your selections are saved in this browser when storage is available.</p>
            <ul>{lesson.summaryChecklist.map((label, index) => <li key={label}><SavedSelfCheck id={`${lesson.id}-summary-${index + 1}`} label={label}/></li>)}</ul>
          </section>}
          </>}
          {lesson.id === "neural-tube-development" && <NeurulationSlides />}
          <LearningActivities activities={activitiesForLesson(lesson.id)} />
          <StudyReel key={`reel-${lesson.id}`} title="Revisit the key ideas" slides={[...lesson.steps, { title: "Explain it without looking", prompt: lesson.recall.prompt, body: lesson.recall.answer }]} />
          <LessonReview lesson={journey} />
        </div>
        <aside className="concept-sidebar">
          <p className="eyebrow">Connect the subjects</p>
          <h2>Study this next</h2>
          {related.map((r) => (
            <Link className="concept-related" key={r.id} href={resourceHref(r)}>
              <span>
                {(subjectInterests.find((s) => s.id === r.subject) ?? librarySubjects.find((s) => s.id === r.subject))?.title}
              </span>
              <strong>{r.title} →</strong>
            </Link>
          ))}
          <div className="concept-study-note">
            <h3>Make this a return visit</h3>
            <p>
              Save this lesson, then revisit its question without opening the
              explanation first.
            </p>
            <Link href="/study#saved-learning" className="text-link">
              My Study →
            </Link>
          </div>
        </aside>
      </div>
      <section className="library-source-note" id="lesson-source">
        <p className="eyebrow">Source and editorial record</p>
        {flagship ? <><h2>Sources and Further Reading</h2><h3>{source.title}</h3></> : <h2>{source.title}</h2>}
        <p>{source.edition}</p>
        <p>
          <strong>Source section:</strong> {lesson.section}
        </p>
        <p>{source.context}</p>
        <h3>Further reading for this topic</h3>
        {reference && (
          <p>
            <a href={reference.url} target="_blank" rel="noreferrer">
              {reference.title}
              <span className="visually-hidden"> (opens in a new tab)</span> ↗
            </a>
          </p>
        )}
        {reference.supportingReferences && <ul>{reference.supportingReferences.map(ref => <li key={ref.url}><a href={ref.url}>{ref.title}</a></li>)}</ul>}
        {reference.supportingIds && <ul>{reference.supportingIds.map(id => (
          <li key={id}><a href={topicReferences[id].url} target="_blank" rel="noreferrer">{topicReferences[id].title}<span className="visually-hidden"> (opens in a new tab)</span> ↗</a></li>
        ))}</ul>}
        <p className="muted-note">
          {anatomyFoundations || subjectEntry || originalReferenceTeaching ? `Scientific references checked ${reference.checkedAt}. The named public sections support the concepts and original teaching examples on this page.` : <>Further-reading link checked {reference.checkedAt}. The source guide above identifies the authored material; this public reference supports further study of this topic.</>}
        </p>
        <p>
          Web lesson by Wardhan Medical Study Guide Studios. Updated{" "}
          <time dateTime={lesson.updatedAt}>{lesson.updatedAt}</time>.
          {editorialRecorded ? "AI-assisted, source-checked educational adaptation; " : "AI-assisted educational adaptation; source and editorial review are pending. "}{clinicallyReviewed ? "independent clinical review is recorded in About this lesson." : "independent clinical peer review has not been completed."}
        </p>
        <p className="muted-note">
          {anatomyFoundations || subjectEntry || originalReferenceTeaching ? `The scientific references are publicly accessible. This lesson publishes newly written explanations, ${subjectEntry || originalReferenceTeaching ? "text comparisons" : "diagrams"} and self-assessment questions.` : <>The full source edition remains in the controlled library. This page publishes an original teaching adaptation and original {flagship ? "self-assessment" : "recall"} questions.</>}
        </p>
        <CorrectionLink />
      </section>
      <PhysiologyCourseNavigation lessonId={lesson.id} />
      <nav className="action-row concept-end" aria-label="Continue studying">
        <Link
          className="button button-primary"
          href={subjectInterests.some(s => s.id === subject.id) ? `/study/${subject.id}` : `/subjects/${subject.id}`}
        >
          {subject.title} {subjectInterests.some(s => s.id === subject.id) ? "learning path" : "lessons"} →
        </Link>
        <Link className="text-link" href="/library">
          Search the library
        </Link>
      </nav>
      <LessonVideos lessonId={lesson.id} />
      {(audioData.records as StudyAudioRecord[]).filter(a => a.lessonId === lesson.id).map(a => <StudyAudio key={a.lessonId} audio={a} />)}
    </article>
  );
}
