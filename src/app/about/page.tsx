import Link from "next/link";
import { studio } from "@/content/studio";
export const metadata = {
  title: "About",
  description:
    "An independent, student-led library of medical-science explanations, visual learning resources and practice activities, created by Siddhartha Harshwardhan.",
  alternates: { canonical: "/about" },
};
export default function AboutPage() {
  return (
    <div className="page-stack page-interior">
      <section
        className="interior-hero site-container"
        aria-labelledby="about-heading"
      >
        <p className="eyebrow">About the library</p>
        <h1 id="about-heading">
          An independent study library for medical sciences
        </h1>
        <p className="interior-lede">
          Wardhan Medical Study Guide Studios brings together explanations,
          visual learning resources, and practice activities to support the
          study of medical sciences.
        </p>
      </section>
      <section
        className="prose-section site-container"
        aria-labelledby="approach-heading"
      >
        <div className="prose-column">
          <h2 id="approach-heading">Created by {studio.founderName}</h2>
          <p>
            I’m a medical student with a background in biology and chemistry.
            This project grew from my own study notes and the need to connect
            complex ideas more clearly. My aim is to create resources that help
            students understand a mechanism, explain it in their own words, and
            return to it with greater confidence.
          </p>
          <p>
            I publish original explanations and guides as Independent Observer.
            Source references and editorial notes identify the material used to
            develop the lessons.
          </p>
          <h2>Learn the concept. Connect it. Explain it.</h2>
          <p>
            Lessons connect related ideas, use visuals where they clarify the
            subject, and invite you to check your understanding through
            questions and explanation.
          </p>
          <p>
            Labelled diagrams and visual explanations help you follow structures
            and relationships. Read each resource’s captions and source notes
            alongside the teaching material.
          </p>
          <h2>An independent educational project</h2>
          <p>
            This is an independent, student-led educational project. It is not
            affiliated with a university or institution.
          </p>
          <p>
            The website is currently free to use, with no subscription or
            sign-in required. Saved resources and study progress stay in your
            browser.
          </p>
          <h2>Help improve the library</h2>
          <p>
            I welcome questions, corrections and suggestions for clearer
            explanations. <Link href="/contact">Share your feedback</Link>, or{" "}
            <Link href="/library">explore the study library</Link>.
          </p>
        </div>
        <aside className="quote-panel" aria-label="Learning approach">
          <p>
            Study a topic, check your understanding, and return to the concepts
            you want to strengthen.
          </p>
          <span className="quote-attribution">
            The library’s teaching approach
          </span>
        </aside>
      </section>
    </div>
  );
}
