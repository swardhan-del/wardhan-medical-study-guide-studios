import Link from "next/link";
import { studio } from "@/content/studio";

export const metadata = {
  title: "About",
  description:
    "An independent, nonprofit medical-science learning project by Siddhartha Harshwardhan, publishing as Independent Observer. Free learning, a growing public library and constructive discussion.",
  alternates: { canonical: "/about" },
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
          A public library for learning medical sciences.
        </h1>
        <p className="interior-lede">
          Wardhan Medical Study Guide Studios is an independent learning
          platform by Independent Observer. It brings together medical-science
          explanations, study guides and visual learning for students, medical
          professionals and anyone who wants to understand the subject more
          deeply.
        </p>
      </section>
      <section
        className="prose-section site-container"
        aria-labelledby="approach-heading"
      >
        <div className="prose-column">
          <p className="eyebrow">The person behind the project</p>
          <h2 id="approach-heading">A student’s perspective, grounded in science.</h2>
          <p>
            I’m {studio.founderName}, publishing as Independent Observer. I have
            a BSc in biology and chemistry and have worked as a pharmaceutical
            sales representative. I’m an international medical student pursuing
            further education in medicine. My studies and work have given me a
            broad perspective across biological, chemical, medical and
            pharmaceutical sciences.
          </p>
          <p>
            I know what it feels like to struggle with difficult material. This
            studio grows out of my own learning: connecting ideas, making their
            structure visible and returning to what I had not yet understood.
          </p>
          <h2>From personal archives to a public library.</h2>
          <p>
            The goal is to build a public learning library from the notes,
            references and study archives I have collected during college and
            higher education in medical and pharmaceutical sciences. Original
            explanations and guides are independently authored under the
            Independent Observer name, with sources identified where used.
          </p>
          <p>
            This new website is growing into a place to explore a concept,
            study a visual explanation, test your understanding and find a
            useful guide. <Link href="/library">Explore the learning library</Link>{" "}
            or <Link href="/subjects">browse the subject directory</Link>.
          </p>
          <h2>Learn together. Question constructively.</h2>
          <p>
            The aim is intellectual engagement with medical sciences. Students,
            medical professionals and other curious learners are welcome to
            bring questions, alternative explanations and thoughtful discussion.
            If something is incorrect or could be clearer, I welcome suggestions
            and corrections. <Link href="/contact">Start a conversation</Link>.
          </p>
        </div>
        <aside className="quote-panel" aria-label="Independence and access">
          <h2>Independent and nonprofit in purpose.</h2>
          <p>
            This is an independent student-led educational project, unaffiliated
            with any university or institution. The website is free to use,
            with no subscriptions at present.
          </p>
          <span className="quote-attribution">
            Built for learning and intellectual exchange
          </span>
        </aside>
      </section>
    </div>
  );
}
