import catalog from "../content/public-catalog.json" with { type: "json" };
import taxonomy from "../content/library-taxonomy.json" with { type: "json" };
import videos from "../content/public-videos.json" with { type: "json" };
import { subjectInterests } from "../content/subjects.ts";
import { foundations } from "../content/foundations.ts";
import { renalLessons } from "../content/renal-course.ts";
import { anatomyLearningPages } from "../content/anatomy-learning.ts";
import { topicGuides } from "../content/topic-guides.ts";

export type SearchPage = { path: string; title: string; description: string; index: boolean; canonical?: string; redirect?: string; lastModified?: string; reason?: string };
const pages: SearchPage[] = [];
function add(path: string, title: string, description: string, index = true, reason?: string, extra: Partial<SearchPage> = {}) {
  if (pages.some(page => page.path === path)) throw new Error("Duplicate search route: " + path);
  pages.push({ path, title, description, index, ...(reason ? { reason } : {}), ...extra });
}
add("/", "Free medical-science lessons and study guides", "Study anatomy, histology, physiology, biochemistry, genetics and biophysics with free lessons, labelled visuals and explained practice questions.");
add("/start", "Start learning medical sciences", "Choose a subject, follow its recommended first lessons and check your understanding with free medical-science practice.");
add("/about", "About this independent medical study library", "An independent, student-led library of medical-science explanations and practice, created by Siddhartha Harshwardhan. Read its purpose and editorial limits.");
add("/library", "Medical study library: lessons and practice", "Find free anatomy, histology, cell biology, biochemistry, physiology, genetics and biophysics lessons, with source references and explained questions.");
add("/subjects", "Medical subjects and learning paths", "Choose a medical-science subject, find a starting lesson and see which topics and study resources are available.");
add("/videos", "Medical-science video recaps", "Watch captioned educational recaps, read their transcripts and continue with the related medical-science lessons.", videos.records.length > 0);
add("/privacy", "Privacy in the study library", "Learn how browser-based study progress, saved resources, contact drafts and optional analytics are handled.", false, "Utility notice");
add("/contact", "Questions, feedback and corrections", "Ask a question, suggest a sourced correction or report an accessibility issue in the medical study library.", false, "Contact utility");
add("/study", "My Study: saved lessons and practice", "Return to resources saved in this browser, review previous practice and choose your next study topic.", false, "Personal browser state");
add("/study/planner", "My renal revision planner", "Plan renal revision sessions using the course topics and your locally saved practice. Your plan stays in this browser.", false, "Personal browser state");
add("/study/map", "Medical-science study map and coverage", "Explore the subject sequence and distinguish available introductions from planned teaching topics.", false, "Includes planned and incomplete content");
add("/reading-list", "Saved study resources", "Return to the saved-resource section of My Study.", false, "Redirect", { canonical: "/study", redirect: "/study#saved-learning" });
add("/start/anatomy", "Anatomy: position, directions and planes", "Review anatomical position, directions and body planes before beginning the complete Anatomy Foundations lesson.", false, "Short introduction overlapping the flagship lesson");
add("/learn/renal", "Renal physiology: eight lessons with practice", "Study renal circulation, clearance, tubular transport, urine concentration and acid–base regulation, then apply the concepts in explained questions.");
add("/practice/biophysics", "Biophysics practice: predict and calculate", "Use six interactive models to connect equations, graphs and medical measurement, then explain how changing a variable affects the result.");
add("/practice/histology", "Histology practice: identify renal tubules", "Compare proximal tubule, distal tubule and collecting-duct schematics. Reveal structural clues and connect them to physiology.");
add("/practice/oral", "Renal physiology oral-examination practice", "Practise eight renal physiology explanations using structured self-assessment rubrics and follow-up questions.");
add("/practice/physiology", "Renal haemodynamics and blood-gas practice", "Explore afferent and efferent resistance, change ventilation and work through six blood-gas interpretation exercises.");
add("/practice/renal-challenge", "Five-minute renal physiology challenge", "Answer five free questions on filtration, ADH and acid–base balance, then review the explanation for each answer.");
add("/learn/topics", "Guided medical-science topic sequences", "Connect existing lessons through focused study sequences in tissue identification, membrane transport, and DNA, inheritance and gene expression.");

for (const subject of subjectInterests) {
  add(`/study/${subject.id}`, `${subject.title}: lessons and learning path`, `Start ${subject.title.toLowerCase()} with a guided lesson, then find practice, revision notes and the published topic sequence.`);
  add(`/study/${subject.id}/guide`, `${subject.title}: guide parts and visuals`, `Browse the available ${subject.title.toLowerCase()} lesson groups, released figures and links to printable revision notes.`, false, "Secondary guide outline with coverage gaps");
  add(`/study/${subject.id}/revision`, `${subject.title}: printable revision notes`, `Print the published ${subject.title.toLowerCase()} lesson summaries and questions, with an optional answer key.`, false, "Print duplicate of published lessons");
}
for (const subject of taxonomy.subjects) {
  const ids = new Set(taxonomy.nodes.filter(node => node.subject === subject.id).flatMap(node => node.resources));
  const available = catalog.records.some(record => ids.has(record.id));
  add(`/subjects/${subject.id}`, `${subject.title}: topic and source directory`, subject.description, available, available ? undefined : "No published resources");
}
for (const [id, foundation] of Object.entries(foundations)) {
  const subject = subjectInterests.find(subject => subject.id === id)!;
  add(`/learn/foundations/${id}`, `${subject.title} foundations: key vocabulary`, foundation.introduction);
}
for (const lesson of renalLessons) add(`/learn/renal/${lesson.slug}`, lesson.title, lesson.description);
for (const page of anatomyLearningPages) add(`/subjects/anatomy/${page.slug}`, `${page.title}: interactive study preview`, page.description, false, "Legacy preview outline; full lessons are indexed separately");
add("/subjects/anatomy/musculoskeletal", "Musculoskeletal anatomy: study outline and sources", "Browse the musculoskeletal study outline, source notes and links to the complete published regional anatomy lessons.", false, "Legacy source outline");

export function canonicalResourcePath(record: (typeof catalog.records)[number]) {
  return "href" in record && record.href && ["WEB", "ACTIVITY"].includes(record.format) ? record.href : `/library/${record.id}`;
}
for (const record of catalog.records) {
  const path = `/library/${record.id}`, canonical = canonicalResourcePath(record);
  add(path, record.title, record.summary.length < 60 ? `${record.title}. ${record.summary}` : record.summary, canonical === path, canonical === path ? undefined : "Redirect to canonical learning route", { canonical, lastModified: record.updatedAt });
}
for (const video of videos.records) add(`/videos/${video.id}`, `${video.title}: video recap`, `Watch the captioned recap: ${video.summary}`);
const seenDirectories = new Set<string>();
for (const node of taxonomy.nodes) {
  const ids = new Set(node.resources);
  function collect(parent: string) {
    for (const child of taxonomy.nodes.filter(child => child.parentId === parent)) { child.resources.forEach(id => ids.add(id)); collect(child.id); }
  }
  collect(node.id);
  const destinations = [...new Set(catalog.records.filter(record => ids.has(record.id)).map(canonicalResourcePath))]
    .filter(path => pages.some(page => page.path === path && page.index)).sort();
  const fingerprint = destinations.join(",");
  const eligible = destinations.length >= 2 && !seenDirectories.has(fingerprint);
  if (eligible) seenDirectories.add(fingerprint);
  const subject = taxonomy.subjects.find(subject => subject.id === node.subject)!;
  add(`/topics/${node.id}`, `${node.title} · ${subject.title} resources`, `Explore ${node.title.toLowerCase()} in ${subject.title.toLowerCase()}. ${node.description}`, eligible, eligible ? undefined : "Empty, single-resource or repeated directory");
}
for (const guide of topicGuides) add(`/learn/topics/${guide.slug}`, guide.title, guide.summary);

export const searchPages: readonly SearchPage[] = pages;
export const searchPage = (path: string) => searchPages.find(page => page.path === path);
export const indexablePages = searchPages.filter(page => page.index && (!page.canonical || page.canonical === page.path));
