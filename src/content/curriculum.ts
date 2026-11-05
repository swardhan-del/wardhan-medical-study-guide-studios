export type CourseChapter = {
  id: string;
  title: string;
  lessonIds: readonly string[];
};

export type CoursePart = {
  id: string;
  title: string;
  chapters?: readonly CourseChapter[];
};

export type Course = {
  id: string;
  subject: string;
  title: string;
  parts: readonly CoursePart[];
};

export const physiologyCoursePath = "/learn/courses/physiology";

const cardiovascularChapters: readonly CourseChapter[] = [
  { id: "pacemaker-and-conduction", title: "Cardiac pacemaker activity and conduction", lessonIds: ["cardiac-conduction-autonomics"] },
  { id: "electrocardiography", title: "Electrocardiography", lessonIds: ["ecg-time-and-vectors"] },
  { id: "cardiac-cycle", title: "The cardiac cycle", lessonIds: ["cardiac-cycle"] },
  { id: "cardiac-output", title: "Cardiac pump function and output", lessonIds: ["cardiac-output"] },
  { id: "haemodynamics", title: "Circulatory organisation and haemodynamics", lessonIds: ["biophysics-fluid-flow"] },
  { id: "arterial-pressure", title: "Arterial blood pressure", lessonIds: ["biophysics-circulation-ecg"] },
  { id: "microcirculation", title: "Microcirculation and Starling Forces", lessonIds: ["lymph-and-fluid-exchange"] },
  { id: "venous-circulation", title: "Venous circulation", lessonIds: ["venous-muscle-pump-direction"] },
  { id: "local-circulatory-control", title: "Local control of circulation", lessonIds: [] },
  { id: "reflex-circulatory-control", title: "Reflex and neurohormonal control of circulation", lessonIds: ["baroreflex"] },
  { id: "exercise-and-splanchnic-circulation", title: "Skeletal muscle, exercise and splanchnic circulation", lessonIds: [] },
  { id: "coronary-and-cerebral-circulation", title: "Coronary and cerebral circulation, cerebrospinal fluid and the blood–brain barrier", lessonIds: ["coronary-circulation", "brain-and-csf-barriers"] },
  { id: "renal-circulation", title: "Renal circulation and autoregulation", lessonIds: ["renal-afferent-efferent"] },
  { id: "shock-and-volume-loss", title: "Circulatory shock and compensation for volume loss", lessonIds: [] },
  { id: "fetal-and-neonatal-circulation", title: "Fetal and neonatal circulation", lessonIds: ["fetal-circulation-transition"] },
  { id: "thermoregulation", title: "Thermoregulation and cardiovascular integration", lessonIds: [] },
];

export const physiologyCourse: Course = {
  id: "medical-physiology",
  subject: "physiology",
  title: "Medical Physiology",
  parts: [
    { id: "cellular-physiology", title: "Cellular physiology, excitable tissues, muscle and autonomic control" },
    { id: "cardiovascular", title: "Cardiovascular Physiology", chapters: cardiovascularChapters },
    { id: "respiratory", title: "Respiratory physiology" },
    { id: "renal", title: "Renal and acid–base physiology" },
    { id: "blood", title: "Blood and haemostasis" },
    { id: "gastrointestinal", title: "Gastrointestinal physiology and energy balance" },
    { id: "endocrine", title: "Endocrine and reproductive physiology" },
    { id: "nervous-system", title: "Nervous system integration and special senses" },
  ],
};

export function physiologyChapterHref(chapter: CourseChapter) {
  return `${physiologyCoursePath}#${chapter.id}`;
}

export function physiologyChapterNavigation(lessonId: string) {
  const index = cardiovascularChapters.findIndex(chapter => chapter.lessonIds.includes(lessonId));
  if (index < 0) return null;

  return {
    chapter: cardiovascularChapters[index],
    previous: cardiovascularChapters[index - 1],
    next: cardiovascularChapters[index + 1],
  };
}
