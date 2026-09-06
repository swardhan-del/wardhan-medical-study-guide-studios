import Link from "next/link";
import { studio } from "@/content/studio";

export const metadata = {
  title: "About",
  description:
    "Why Siddhartha Harshwardhan is independently building medical study resources from his experience as a student.",
};

export default function AboutPage() {
  return (
    <div className="page-stack page-interior">
      <section
        className="interior-hero site-container"
        aria-labelledby="about-heading"
      >
        <p className="eyebrow">About the studio</p>
        <h1 id="about-heading">
          Built from the experience of learning medicine.
        </h1>
        <p className="interior-lede">
          I’m {studio.founderName}, the independent creator of Wardhan Medical
          Study Guide Studios. I’m developing this website from my own study
          notes, knowledge base and experience of struggling with medical
          sciences as a medical student.
        </p>
      </section>
      <section
        className="prose-section site-container"
        aria-labelledby="approach-heading"
      >
        <div className="prose-column">
          <p className="eyebrow">The approach</p>
          <h2 id="approach-heading">Help another student find a way through.</h2>
          <p>
            My aim is to share the approaches that helped me understand
            difficult material: breaking an idea into parts, connecting those
            parts with diagrams, testing my understanding and returning to what
            I had not yet grasped.
          </p>
          <p>
            Here you can explore explanations and visual activities, practise
            with questions, and find study guides through the subject directory.
            I’m building and improving this collection independently, one
            explanation at a time.
          </p>
          <p>
            Your questions and corrections can help make it clearer.{" "}
            <Link href="/contact">Get in touch</Link>.
          </p>
        </div>
        <aside className="quote-panel" aria-label="Studio note">
          <span className="quote-mark" aria-hidden="true">
            “
          </span>
          <p>
            A place to understand something difficult, test yourself and come
            back tomorrow.
          </p>
          <span className="quote-attribution">The purpose of this project</span>
        </aside>
      </section>
    </div>
  );
}
