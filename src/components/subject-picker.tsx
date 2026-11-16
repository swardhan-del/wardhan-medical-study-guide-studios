import Link from "next/link";
import { firstSessionFor, firstSessionHref } from "@/content/first-study-sessions";
import { beginnerSequences } from "@/content/study-paths";
import { guideSubjects } from "@/content/subjects";
import styles from "./subject-picker.module.css";

const shortTitles: Record<string, string> = {
  anatomy: "Anatomy",
  histology: "Histology",
  physiology: "Physiology",
};

export function SubjectPicker() {
  return (
    <section className={styles.picker} id="choose-subject" aria-labelledby="choose-subject-title">
      <h2 id="choose-subject-title">Choose your subject</h2>
      <div className={styles.subjects}>
        {guideSubjects.map(subject => {
          const title = shortTitles[subject.id] ?? subject.title;
          const lesson = firstSessionFor(subject.id)?.lesson;
          const start = beginnerSequences[subject.id]?.[0]?.href ??
            (lesson ? "/library/" + lesson : firstSessionHref(subject.id));
          return (
            <details name="subject-picker" key={subject.id}>
              <summary>{title}</summary>
              <div className={styles.actions}>
                <Link href={start} aria-label={"Start " + title + " lesson"}>Start lesson</Link>
                <Link href={"/study/" + subject.id + "/guide"} aria-label={"Open " + title + " course guide"}>Open course guide</Link>
              </div>
            </details>
          );
        })}
      </div>
    </section>
  );
}
