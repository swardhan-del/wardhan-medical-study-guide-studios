import type { LearningActivity } from "../lib/learning-activity";

const anatomy = { title: "OpenStax: anatomical terminology", url: "https://openstax.org/books/anatomy-and-physiology-2e/pages/1-6-anatomical-terminology" };
const neural = { title: "UNSW: neural system development", url: "https://embryology.med.unsw.edu.au/embryology/index.php/Neural_System_Development" };
const formation = { title: "Neuroscience: gastrulation and neurulation", url: "https://www.ncbi.nlm.nih.gov/books/NBK10993/" };

/** Original prompts; source documents and third-party question banks are not bundled. */
export const learningActivities: LearningActivity[] = [
  {
    id: "orientation-plane-right-left-v1", lessonId: "anatomy-foundations", kind: "name",
    objective: "Identify a plane from the portions it separates.",
    prompt: "A section separates right and left portions but need not pass through the midline. Name the plane family.",
    accepted: ["sagittal", "sagittal plane"],
    contrasts: [{ names: ["median", "midsagittal", "median plane", "midsagittal plane"], explanation: "A median section must pass through the midline. The question asks for the broader plane family." }, { names: ["coronal", "frontal"], explanation: "Coronal sections separate anterior and posterior portions. Reconsider which portions are separated here." }],
    explanation: "Sagittal is the family; median specifies its midline member.", reference: anatomy,
  },
  {
    id: "orientation-plane-front-back-v1", lessonId: "anatomy-foundations", kind: "name",
    objective: "Distinguish coronal from sagittal sections.", prompt: "Name the plane separating anterior and posterior portions.",
    accepted: ["coronal", "coronal plane", "frontal", "frontal plane"],
    contrasts: [{ names: ["sagittal", "sagittal plane"], explanation: "Sagittal separates right and left portions." }, { names: ["transverse", "axial"], explanation: "Transverse separates superior and inferior portions." }],
    explanation: "Coronal and frontal name the same plane family.", reference: anatomy,
  },
  {
    id: "orientation-reference-frame-v1", lessonId: "anatomy-foundations", kind: "explanation",
    objective: "Separate the subject's anatomical directions from the observer's viewpoint.",
    prompt: "Two students face opposite sides of the same anatomical model. One says its right arm has become its left arm. Explain the mistake and how you would orient a newly supplied image.",
    criteria: [
      { id: "subject", label: "Anchor left and right to the subject", explanation: "Moving the observer does not exchange the model's anatomical sides." },
      { id: "labels", label: "Check orientation labels and viewing direction", explanation: "Image position alone is insufficient to establish anatomical side." },
      { id: "uncertainty", label: "State what is unknown if the image is unlabelled", explanation: "Do not supply a confident side from an ambiguous crop." },
    ],
    model: "The observer changed position; the model did not exchange sides. I would establish the subject's orientation and the image's viewing direction before naming relationships. An ambiguous unlabelled crop may not support a side assignment.", reference: anatomy,
  },
  {
    id: "orientation-section-workflow-v1", lessonId: "anatomy-foundations", kind: "sequence",
    objective: "Use an explicit evidence order before identifying a sectional structure.",
    prompt: "Build this teaching workflow for a labelled sectional image. It is a reasoning scaffold, not a mandatory clinical protocol.",
    stages: [
      { id: "frame", label: "Read orientation and section information", explanation: "Establish the reference frame before interpreting relationships." },
      { id: "landmarks", label: "Locate reliable landmarks", explanation: "Use labelled or recognisable reference structures to orient the region." },
      { id: "relations", label: "Describe the target's relationships", explanation: "Relations constrain the identification more than a single colour or outline." },
      { id: "alternative", label: "Check the proposed name against an alternative", explanation: "Look for a feature that distinguishes the competing structures and state remaining uncertainty." },
    ], presentation: ["relations", "alternative", "frame", "landmarks"], reference: anatomy,
  },
  {
    id: "neurulation-primary-sequence-v1", lessonId: "neural-tube-development", kind: "sequence",
    objective: "Reconstruct the geometric transitions of primary neurulation.",
    prompt: "Order the simplified primary-neurulation stages. Different levels progress at different times; these cards do not imply simultaneous closure along the whole embryo.",
    stages: [
      { id: "plate", label: "Neural plate is established", explanation: "Specialised ectoderm forms the starting epithelial sheet." },
      { id: "groove", label: "Neural groove and elevated folds form", explanation: "Bending changes the geometry of the sheet." },
      { id: "fusion", label: "Opposing neural folds meet and fuse", explanation: "Fusion encloses the tube rather than filling its lumen." },
      { id: "separation", label: "Neural tube separates from surface ectoderm", explanation: "The internal tube and the surface epithelium become distinct structures." },
    ], presentation: ["fusion", "plate", "separation", "groove"], reference: neural,
  },
  {
    id: "neurulation-tube-name-v1", lessonId: "neural-tube-development", kind: "name",
    objective: "Distinguish neural tube from neural crest and notochord.",
    prompt: "Which embryonic structure forms the principal primordium of the brain and spinal cord? Give its short name.",
    accepted: ["neural tube"], contrasts: [
      { names: ["neural crest", "neural crest cells"], explanation: "Neural crest cells migrate and form diverse derivatives. They are not another name for the CNS tube." },
      { names: ["notochord"], explanation: "The notochord is axial mesoderm with a signalling role; it does not transform into the neural tube." },
    ], explanation: "The neural tube is the CNS primordium. Its wall and lumen have different developmental outcomes.", reference: formation,
  },
  {
    id: "neurulation-crest-name-v1", lessonId: "neural-tube-development", kind: "name",
    objective: "Identify the migratory population associated with the neural folds.",
    prompt: "Name the cell population associated with the neural-plate border that leaves the dorsal neural region and migrates to multiple destinations.",
    accepted: ["neural crest", "neural crest cells"], contrasts: [{ names: ["neural tube"], explanation: "The tube remains an organised CNS primordium; the question asks for a migratory cell population." }],
    explanation: "Neural crest describes a population with multiple migration routes and derivatives, not a third primary germ layer.", reference: formation,
  },
  {
    id: "neurulation-geometry-explanation-v1", lessonId: "neural-tube-development", kind: "explanation",
    objective: "Explain how folding produces a tube without confusing wall and lumen.",
    prompt: "A learner draws the neural plate folding into a solid rod. Explain what must change in that drawing and why one transverse sketch cannot show all cranial-to-caudal events.",
    criteria: [
      { id: "lumen", label: "Distinguish an epithelial wall from its enclosed lumen", explanation: "The tube has an internal space; the neural tissue is not simply a solid rod." },
      { id: "surface", label: "Separate the tube from surface ectoderm", explanation: "A corrected drawing should show distinct surface and internal epithelial structures." },
      { id: "level", label: "Specify level and stage", explanation: "A single transverse section is a local snapshot, not proof of simultaneous closure along the entire axis." },
    ],
    model: "I would retain a space inside the folded epithelial wall and distinguish the closed tube from the surface ectoderm above it. I would label the section level and developmental stage; events at another axial level may differ.", reference: neural,
  },
  {
    id: "neurulation-induction-lineage-v1", lessonId: "neural-tube-development", kind: "explanation",
    objective: "Distinguish developmental signalling from cellular ancestry.",
    prompt: "A diagram puts the notochord immediately beneath the neural tube. A learner concludes that the notochord becomes the spinal cord. Correct the reasoning without denying the importance of the notochord.",
    criteria: [
      { id: "lineage", label: "Keep axial mesoderm and neural ectoderm distinct", explanation: "Neighbouring tissues need not share a developmental fate." },
      { id: "signal", label: "Explain that one tissue can influence another", explanation: "A signalling relationship is not evidence that the signalling cells become their target tissue." },
      { id: "evidence", label: "State the limitation of position alone", explanation: "Spatial proximity cannot establish cell lineage." },
    ],
    model: "The notochord is axial mesoderm beneath the developing neural tissue. It helps organise developmental signalling, but the neural tube derives from neural ectoderm. Location and influence do not establish conversion of one tissue into the other.", reference: formation,
  },
];

export const activitiesForLesson = (lessonId: string) => learningActivities.filter(activity => activity.lessonId === lessonId);
