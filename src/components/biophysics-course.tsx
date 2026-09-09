import Link from "next/link";
import coverage from "@/content/biophysics-coverage.json";
export function BiophysicsCourseIntro() {
  const theory = coverage.lessons.filter(l=>l.track==="theory"), practical = coverage.lessons.filter(l=>l.track==="practical");
  return <section className="study-panel bp-course-intro" aria-labelledby="bp-course-title">
    <p className="eyebrow">Your route through the subject</p><h2 id="bp-course-title">From physical principles to medical measurements</h2>
    <div className="study-grid three"><div><h3>{theory.length} theory lessons</h3><p>Follow the numbered course from optics through imaging to body systems.</p><Link href={"/library/"+theory[0].lessonId}>Start theory →</Link></div><div><h3>{practical.length} practical lessons</h3><p>Work through measurements, calibrations and the assumptions behind the numbers.</p><Link href={"/library/"+practical[0].lessonId}>Start practicals →</Link></div><div><h3>6 interactive models</h3><p>Change a variable, inspect a graph and test whether your prediction holds.</p><Link href="/practice/biophysics">Open the model studio →</Link></div></div>
    <p>100 explained questions accompany these lessons. Save a lesson or answer a question to include it in My Study.</p>
    <details><summary>What this course covers</summary><p>{coverage.scope}</p><p>Overlapping material has been combined. Theory follows the 36-topic sequence of the 2018–2019 notes; practical themes include optical instruments, spectroscopy, detectors, circuits, cell counting, diffusion, audiometry and ECG. X-ray and CT practical concepts are integrated into their theory lessons. Each lesson identifies its source sections.</p><p>There are no narrated recordings in this subject yet. Original experimental figures and instrument practice require further study alongside the native lessons.</p></details>
  </section>;
}
export function BiophysicsLessonSequence({ lessonId }: { lessonId: string }) {
  const index = coverage.lessons.findIndex(l=>l.lessonId===lessonId);
  if(index<0) return null;
  const current=coverage.lessons[index], sequence=coverage.lessons.filter(l=>l.track===current.track), position=sequence.findIndex(l=>l.lessonId===lessonId);
  return <nav className="study-panel bp-sequence" aria-label="Biophysics lesson sequence"><p className="eyebrow">{current.track === "theory" ? "Theory" : "Practical"} lesson {position+1} of {sequence.length}</p>
    <div className="action-row">{position>0&&<Link href={"/library/"+sequence[position-1].lessonId}>← {sequence[position-1].title}</Link>}{position<sequence.length-1&&<Link href={"/library/"+sequence[position+1].lessonId}>{sequence[position+1].title} →</Link>}</div>
    <div className="action-row"><Link href="/study/biophysics">All Biophysics lessons</Link><Link href="/practice/biophysics">Try the interactive models</Link></div>
  </nav>;
}
