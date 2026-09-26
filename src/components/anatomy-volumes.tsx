import { EducationalFigure } from "./educational-figure";
import { publicFigures } from "@/lib/figures";
const previewFigures = ["thoracic-plane", "abdominal-regions", "renal-development", "tongue-innervation", "brachial-plexus-map"];
import Link from "next/link";

const lessonIds = ["thorax-nerve-relations", "abdomen-portal-relations", "pelvis-urinary-route", "head-neck-tongue-map", "limbs-plexus-and-joints"];
const volumes = [
  {
    number: "I", title: "Thorax, Heart, Lungs & Mediastinum",
    description: "Explore the anatomy of the chest, from the heart and lungs to the spaces and structures of the mediastinum. A focused introduction to how the major thoracic structures fit together.",
    companion: "Study a focused web lesson with a labelled figure, explained questions and a narrated recap. The complete source book remains private.",
    topics: ["Thoracic anatomy", "Heart and lungs", "Mediastinum"],
  },
  {
    number: "II", title: "Abdomen, Digestive System & Peritoneum",
    description: "Build a regional understanding of the abdomen, digestive organs and peritoneum. This volume brings the major abdominal structures into one connected anatomical framework.",
    companion: "Study a focused web lesson with a labelled figure, explained questions and a narrated recap. The complete source book remains private.",
    topics: ["Abdominal regions", "Digestive anatomy", "Peritoneum"],
  },
  {
    number: "III", title: "Pelvis, Perineum & Urogenital Anatomy",
    description: "Study the pelvis and perineum alongside the urinary and reproductive systems. The volume focuses on the spatial relationships that make this compact region easier to understand.",
    companion: "Study a focused web lesson with a labelled figure, explained questions and a narrated recap. The complete source book remains private.",
    topics: ["Pelvic anatomy", "Perineum", "Urogenital relationships"],
  },
  {
    number: "IV", title: "Head, Neck, Neuroanatomy & Embryology",
    description: "Connect the anatomy of the head and neck with the organisation of the nervous system and embryological development. A regional volume bringing several demanding areas of anatomy together.",
    companion: "Study a focused web lesson with a labelled figure, explained questions and a narrated recap. The complete source book remains private.",
    topics: ["Head and neck", "Neuroanatomy", "Embryology"],
  },
  {
    number: "V", title: "Musculoskeletal Anatomy, Trunk, Limbs & Lymphatics",
    description: "Explore the structural anatomy of the trunk and limbs, with musculoskeletal, head and neck, and lymphatic coverage. This volume brings regional structures into the wider framework of the body.",
    companion: "Study a focused web lesson with a labelled figure, explained questions and a narrated recap. The complete source book remains private.",
    topics: ["Trunk and limbs", "Musculoskeletal anatomy", "Lymphatics"],
  },
];

export function AnatomyVolumes() {
  return (
    <section className="anatomy-series" aria-labelledby="anatomy-series-title">
      <header className="series-heading">
        <p className="eyebrow">Anatomy illustrations</p>
        <h2 id="anatomy-series-title">Review regional anatomy through illustrations</h2>
        <p>Use these illustrations to review regional anatomy and compare labelled structures. Each volume now has a focused web lesson, questions, a figure and a narrated recap.</p>
      </header>
      <nav className="volume-jump-links" aria-label="Jump to an anatomy volume">
        {volumes.map((volume) => <a key={volume.number} href={`#volume-${volume.number.toLowerCase()}`}>Volume {volume.number}</a>)}
      </nav>
      <div className="volume-grid">
        {volumes.map((volume, index) => (
          <article className="volume-preview" id={`volume-${volume.number.toLowerCase()}`} key={volume.number}>
            <EducationalFigure figure={publicFigures.find(f => f.id === previewFigures[index])!} />
            <div className="volume-copy">
              <div className="volume-topline"><span>Volume {volume.number}</span><span className="production-badge">Illustration preview</span></div>
              <h3>{volume.title}</h3>
              <p>{volume.description}</p>
              <ul className="volume-topics" aria-label="Topics covered">{volume.topics.map((topic) => <li key={topic}>{topic}</li>)}</ul>
              <details className="volume-companion">
                <summary>About this preview · Volume {volume.number}</summary>
                <p>{volume.companion}</p>
              </details>
              <Link className="button button-primary" href={"/library/" + lessonIds[index]}>Study this volume</Link>
              {volume.number === "V" ? <Link className="text-link" href="/subjects/anatomy/musculoskeletal">Explore the musculoskeletal study map & sources →</Link> : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
