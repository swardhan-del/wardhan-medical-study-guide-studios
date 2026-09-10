import Link from "next/link";
import data from "@/content/anatomy-course.json";
import { studyGroups, studyLessons } from "@/lib/study-collections";

export function AnatomyCourseIntro() {
  return <section className="study-panel" aria-labelledby="anatomy-course-heading">
    <p className="eyebrow">Five-volume anatomy course</p>
    <h2 id="anatomy-course-heading">120 lessons, from landmarks to regional reasoning</h2>
    <p>Start with orientation, choose a volume, then follow its numbered lessons. Each lesson includes objectives, preparation, explanations, a worked example, a drawing task and five explained practice items.</p>
    <div className="action-row"><Link className="button button-primary" href="/library/thoracic-cage-landmarks">Begin Volume I</Link><Link href="/start/anatomy">Review directions and planes</Link><Link href="/study/anatomy/guide">Browse all five volumes</Link></div>
    <ol className="anatomy-volume-list">{studyGroups.filter(g => g.subject === "anatomy").map(g => <li key={g.id}><Link href={`/study/anatomy/guide#${g.id}`}>{g.title}</Link> · {g.lessonIds.length} lessons · <Link href={`/library/${g.lessonIds[0]}`}>Start this volume</Link></li>)}</ol>
    <p className="muted-note">A structured adaptation of the authored guides. Use your course syllabus and practical sessions alongside it; lesson completion is not an exam-readiness score.</p>
  </section>;
}

export function AnatomyLessonNavigation({ lessonId }: { lessonId: string }) {
  const record = data.records.find(r => r.lessonId === lessonId);
  if (!record) return null;
  const group = studyGroups.find(g => g.id === `anatomy-volume-${record.volume}`)!;
  const index = group.lessonIds.indexOf(lessonId);
  const previous = index > 0 ? studyLessons.find(l => l.id === group.lessonIds[index - 1]) : undefined;
  return <nav className="study-panel anatomy-lesson-navigation" aria-label="Anatomy volume navigation">
    <p><strong>{group.title}</strong> · Lesson {record.order} of {group.lessonIds.length}</p>
    <div className="action-row">{previous && <Link href={`/library/${previous.id}`}>← {previous.title}</Link>}<Link href={`/study/anatomy/guide#${group.id}`}>Volume contents</Link><Link href={`/study/anatomy/revision#${group.id}`}>Print this volume</Link></div>
    <details><summary>Jump to a lesson in this volume</summary><ol>{group.lessonIds.map(id => <li key={id}>{id === lessonId ? <span aria-current="page">{studyLessons.find(l => l.id === id)!.title}</span> : <Link href={`/library/${id}`}>{studyLessons.find(l => l.id === id)!.title}</Link>}</li>)}</ol></details>
  </nav>;
}

export function AnatomyIdentification({ lessonId }: { lessonId: string }) {
  const record = data.records.find(r => r.lessonId === lessonId);
  if (!record) return null;
  return <section className="study-panel anatomy-identification" aria-labelledby="anatomy-identification-heading">
    <p className="eyebrow">Draw · Label · Explain</p><h2 id="anatomy-identification-heading">Build your own anatomical map</h2>
    <p>{record.identification.prompt}</p><p>Use paper or a drawing app. Mark the viewing direction and label each structure before adding arrows. Then explain what each arrow means.</p>
    <details><summary>Check the key relationships</summary><ul>{record.identification.checkpoints.map((s,i) => <li key={i}>{s}</li>)}</ul></details>
  </section>;
}

export function AnatomyPractice({ lessonId }: { lessonId: string }) {
  const record = data.records.find(r => r.lessonId === lessonId);
  if (!record) return null;
  return <section className="study-panel" aria-labelledby="anatomy-practice-heading">
    <h2 id="anatomy-practice-heading">Four more ways to test your understanding</h2>
    <p>Answer before revealing the explanation. Together with the concept check above, these make five practice items.</p>
    {record.practice.map((q,i) => <div key={q.id} className="anatomy-practice-item"><h3>{i+2}. {q.kind}</h3><p>{q.prompt}</p><details><summary>Reveal explanation for item {i+2}</summary>{q.answer.split("\n\n").map((p,j) => <p key={j}>{p}</p>)}</details></div>)}
  </section>;
}
