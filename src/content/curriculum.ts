export type CourseChapter = {
  id: string;
  title: string;
  lessonIds: readonly string[];
  relatedLessonIds?: readonly string[];
  number?: string;
};

export type CoursePart = {
  id: string;
  title: string;
  guidePartId: string;
  chapters: readonly CourseChapter[];
};

export type Course = {
  id: string;
  subject: string;
  title: string;
  parts: readonly CoursePart[];
};

export const physiologyCoursePath = "/learn/courses/physiology";

const cellularChapters: readonly CourseChapter[] = [
  { id: "body-fluid-compartments", title: "Body fluid compartments and their measurement", lessonIds: ["indicator-dilution"] },
  { id: "membranes-and-transport", title: "Cell membranes and vectorial transport", lessonIds: ["fluid-and-membrane-transport"] },
  { id: "voltage-gated-ion-channels", title: "Ion channels and voltage-gated calcium channels", lessonIds: [] },
  { id: "resting-membrane-potential", title: "Resting membrane potential", lessonIds: ["membrane-potentials"] },
  { id: "action-potential-conduction", title: "Action potentials and their conduction", lessonIds: [], relatedLessonIds: ["membrane-potentials", "biophysics-action-potentials"] },
  { id: "cell-communication", title: "Cell communication and second messengers", lessonIds: [], relatedLessonIds: ["autonomic-signalling"] },
  { id: "striated-muscle", title: "Striated muscle and excitation–contraction coupling", lessonIds: ["muscle-contraction"] },
  { id: "smooth-muscle", title: "Smooth muscle function and contraction", lessonIds: [], relatedLessonIds: ["muscle-contraction"] },
  { id: "synaptic-transmission", title: "Synaptic transmission and neurotransmitters", lessonIds: [], relatedLessonIds: ["synaptic-integration"] },
  { id: "neuromuscular-transmission", title: "Neuromuscular transmission", lessonIds: [] },
  { id: "parasympathetic-efferents", title: "Parasympathetic efferent mechanisms", lessonIds: ["autonomic-signalling"] },
  { id: "sympathetic-efferents", title: "Sympathetic efferent mechanisms", lessonIds: [], relatedLessonIds: ["autonomic-signalling"] },
];

const cardiovascularChapters: readonly CourseChapter[] = [
  { id: "pacemaker-and-conduction", title: "Cardiac pacemaker activity and conduction", lessonIds: [], relatedLessonIds: ["cardiac-conduction-autonomics"] },
  { id: "electrocardiography", title: "Electrocardiography", lessonIds: ["ecg-time-and-vectors"] },
  { id: "cardiac-cycle", title: "The cardiac cycle", lessonIds: ["cardiac-cycle"] },
  { id: "cardiac-output", title: "Cardiac pump function and output", lessonIds: ["cardiac-output"] },
  { id: "haemodynamics", title: "Circulatory organisation and haemodynamics", lessonIds: [], relatedLessonIds: ["biophysics-fluid-flow"] },
  { id: "arterial-pressure", title: "Arterial blood pressure", lessonIds: [], relatedLessonIds: ["biophysics-circulation-ecg"] },
  { id: "microcirculation", title: "Microcirculation and Starling Forces", lessonIds: ["lymph-and-fluid-exchange"] },
  { id: "venous-circulation", title: "Venous circulation", lessonIds: ["venous-muscle-pump-direction"] },
  { id: "local-circulatory-control", title: "Local control of circulation", lessonIds: [] },
  { id: "reflex-circulatory-control", title: "Reflex and neurohormonal control of circulation", lessonIds: ["baroreflex"] },
  { id: "exercise-and-splanchnic-circulation", title: "Skeletal muscle, exercise and splanchnic circulation", lessonIds: ["splanchnic-flow-and-cardiac-output-share"] },
  { id: "coronary-and-cerebral-circulation", title: "Coronary and cerebral circulation, cerebrospinal fluid and the blood–brain barrier", lessonIds: [], relatedLessonIds: ["coronary-circulation", "brain-and-csf-barriers"] },
  { id: "renal-circulation", title: "Renal circulation and autoregulation", lessonIds: [], relatedLessonIds: ["renal-afferent-efferent"] },
  { id: "shock-and-volume-loss", title: "Circulatory shock and compensation for volume loss", lessonIds: [] },
  { id: "fetal-and-neonatal-circulation", title: "Fetal and neonatal circulation", lessonIds: [], relatedLessonIds: ["fetal-circulation-transition"] },
  { id: "thermoregulation", title: "Thermoregulation and cardiovascular integration", lessonIds: [] },
];

const respiratoryChapters: readonly CourseChapter[] = [
  { id: "pulmonary-ventilation", number: "3.1", title: "Mechanics and ventilation", lessonIds: ["respiratory-mechanics", "alveolar-ventilation-calculations"], relatedLessonIds: ["biophysics-respiratory-physics"] },
  { id: "pulmonary-gas-exchange", number: "3.2", title: "Gas exchange and pulmonary circulation", lessonIds: [], relatedLessonIds: ["respiratory-histology"] },
  { id: "pulmonary-circulation-and-vq", number: "3.2.3", title: "Pulmonary circulation and ventilation–perfusion matching", lessonIds: ["ventilation-perfusion"] },
  { id: "respiratory-gas-transport", number: "3.3", title: "Gas transport and hypoxia", lessonIds: ["respiratory-oxygen-content-and-delivery"] },
  { id: "respiratory-control", number: "3.4", title: "Neural and chemical control of respiration", lessonIds: ["respiratory-chemoreflex-control"] },
  { id: "cardiopulmonary-adaptation", number: "3.5", title: "Posture and exercise", lessonIds: ["respiratory-exercise-adaptation"] },
  { id: "respiratory-acid-base", number: "3.6", title: "Acid–base homeostasis", lessonIds: [], relatedLessonIds: ["renal-renal-acid-base", "renal-abg-interpretation"] },
];

const renalChapters: readonly CourseChapter[] = [
  { id: "renal-circulation-and-filtration", title: "Renal circulation and glomerular filtration", lessonIds: ["renal-kidney-map", "renal-afferent-efferent", "renal-filtration-and-clearance"] },
  { id: "renal-tubular-function", title: "Tubular transport", lessonIds: ["renal-tubular-transport"] },
  { id: "urine-concentration-and-micturition", title: "Urine concentration, dilution and micturition", lessonIds: ["renal-concentrating-urine"] },
  { id: "volume-and-osmolality", title: "Body-fluid volume and osmolality control", lessonIds: ["renal-volume-and-osmolality", "renal-water-balance"] },
  { id: "acid-base-balance", title: "Acid–base balance and compensation", lessonIds: ["renal-renal-acid-base", "renal-abg-interpretation"] },
];

const bloodChapters: readonly CourseChapter[] = [
  { id: "blood-composition", title: "Haematopoiesis and blood composition", lessonIds: [], relatedLessonIds: ["blood-marrow"] },
  { id: "platelet-function", title: "Platelet adhesion, activation and aggregation", lessonIds: ["blood-and-haemostasis"] },
  { id: "coagulation-and-fibrinolysis", title: "Coagulation, anticoagulant control and fibrinolysis", lessonIds: [], relatedLessonIds: ["blood-and-haemostasis"] },
  { id: "blood-groups", title: "Human blood group systems", lessonIds: [] },
];

const digestiveChapters: readonly CourseChapter[] = [
  { id: "enteric-and-hormonal-control", title: "Enteric and hormonal control of the gastrointestinal tract", lessonIds: ["digestive-control"] },
  { id: "gastrointestinal-motility", title: "Gastrointestinal motility", lessonIds: [], relatedLessonIds: ["digestive-control"] },
  { id: "salivary-secretion", title: "Salivary secretion", lessonIds: [] },
  { id: "pancreatic-secretion-and-bile", title: "Pancreatic secretion, bile and bile pigments", lessonIds: [] },
  { id: "digestion-and-absorption", title: "Digestion and absorption", lessonIds: [], relatedLessonIds: ["digestive-control"] },
  { id: "energy-balance", title: "Energy balance, food intake and body weight", lessonIds: ["energy-balance"] },
];

const endocrineChapters: readonly CourseChapter[] = [
  { id: "hypothalamus-pituitary-and-growth", title: "Hypothalamic–pituitary system and growth hormone", lessonIds: ["endocrine-feedback"] },
  { id: "adrenal-cortex", title: "Adrenal cortex", lessonIds: [], relatedLessonIds: ["adrenal-layers-signals-reasoning"] },
  { id: "thyroid-hormones", title: "Thyroid hormones", lessonIds: [], relatedLessonIds: ["endocrine-feedback"] },
  { id: "insulin-and-diabetes", title: "Insulin and diabetes mellitus", lessonIds: [] },
  { id: "glucagon-and-counterregulation", title: "Glucagon, counterregulation, fasting and exercise", lessonIds: [] },
  { id: "calcium-metabolism", title: "Calcium metabolism, bone and growth", lessonIds: [] },
  { id: "sexual-development-and-male-reproduction", title: "Sexual development and male reproduction", lessonIds: [] },
  { id: "female-reproductive-endocrinology", title: "Female reproductive endocrinology", lessonIds: ["reproductive-cycles"] },
  { id: "pregnancy-and-lactation", title: "Pregnancy, parturition and lactation", lessonIds: [], relatedLessonIds: ["reproductive-cycles"] },
  { id: "adrenal-medulla", title: "Adrenal medulla and stress adaptation", lessonIds: [] },
];

const nervousSystemChapters: readonly CourseChapter[] = [
  { id: "neurons-and-glia", title: "Neurons and glia", lessonIds: ["synaptic-integration"], relatedLessonIds: ["myelin-and-glial-cells"] },
  { id: "somatovisceral-sensation", title: "Somatovisceral sensation and touch", lessonIds: [] },
  { id: "pain", title: "Pain", lessonIds: [] },
  { id: "vision", title: "Vision", lessonIds: ["special-senses"], relatedLessonIds: ["retinal-on-off-bipolar-response"] },
  { id: "hearing", title: "Hearing", lessonIds: ["cochlear-fluid-voltage-reference", "auditory-frequency-level-coding"] },
  { id: "equilibrium-taste-smell", title: "Equilibrium, taste and smell", lessonIds: [], relatedLessonIds: ["vestibular-sensors-rotation-translation"] },
  { id: "spinal-motor-functions", title: "Spinal motor functions and reflexes", lessonIds: [] },
  { id: "supraspinal-motor-control", title: "Supraspinal motor control and posture", lessonIds: [] },
  { id: "cerebellum-and-basal-ganglia", title: "Cerebellum and basal ganglia", lessonIds: [] },
  { id: "skin-circulation-and-temperature", title: "Thermoregulation and skin circulation", lessonIds: [] },
  { id: "eeg-sleep-and-learning", title: "EEG, sleep, learning and memory", lessonIds: [] },
  { id: "autonomic-and-behavioural-integration", title: "Autonomic and behavioural integration", lessonIds: [] },
];

export const physiologyCourse: Course = {
  id: "medical-physiology",
  subject: "physiology",
  title: "Medical Physiology",
  parts: [
    { id: "cellular-physiology", guidePartId: "physiology-cellular", title: "Cellular physiology, excitable tissues, muscle and autonomic control", chapters: cellularChapters },
    { id: "cardiovascular", guidePartId: "physiology-cardiovascular", title: "Cardiovascular Physiology", chapters: cardiovascularChapters },
    { id: "respiratory", guidePartId: "physiology-respiratory", title: "Respiratory physiology", chapters: respiratoryChapters },
    { id: "renal", guidePartId: "physiology-renal", title: "Renal and acid–base physiology", chapters: renalChapters },
    { id: "blood", guidePartId: "physiology-blood", title: "Blood and haemostasis", chapters: bloodChapters },
    { id: "gastrointestinal", guidePartId: "physiology-digestive", title: "Gastrointestinal physiology and energy balance", chapters: digestiveChapters },
    { id: "endocrine", guidePartId: "physiology-endocrine", title: "Endocrine and reproductive physiology", chapters: endocrineChapters },
    { id: "nervous-system", guidePartId: "physiology-nervous", title: "Nervous-system integration and special senses", chapters: nervousSystemChapters },
  ],
};

export function physiologyChapterHref(chapter: CourseChapter) {
  return `${physiologyCoursePath}#${chapter.id}`;
}

export function physiologyChapterNavigation(lessonId: string) {
  for (const [partIndex, part] of physiologyCourse.parts.entries()) {
    const chapterIndex = part.chapters.findIndex(chapter => chapter.lessonIds.includes(lessonId));
    if (chapterIndex < 0) continue;

    const chapter = part.chapters[chapterIndex];
    const lessonIndex = chapter.lessonIds.indexOf(lessonId);
    return {
      partIndex, chapter,
      previous: part.chapters[chapterIndex - 1],
      next: part.chapters[chapterIndex + 1],
      previousLessonId: chapter.lessonIds[lessonIndex - 1],
      nextLessonId: chapter.lessonIds[lessonIndex + 1],
    };
  }
  return null;
}
