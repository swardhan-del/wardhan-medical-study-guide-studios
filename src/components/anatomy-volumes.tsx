import Image from "next/image";
import Link from "next/link";

const lessonIds = ["thorax-nerve-relations", "abdomen-portal-relations", "pelvis-urinary-route", "head-neck-tongue-map", "limbs-plexus-and-joints"];
const volumes = [
  {
    number: "I", title: "Thorax, Heart, Lungs & Mediastinum",
    description: "Explore the anatomy of the chest, from the heart and lungs to the spaces and structures of the mediastinum. A focused introduction to how the major thoracic structures fit together.",
    companion: "Study a focused web lesson with a labelled figure, explained questions and a narrated recap. The complete source book remains private.",
    topics: ["Thoracic anatomy", "Heart and lungs", "Mediastinum"],
    image: "/images/anatomy/mediastinal-plane.svg", alt: "Sternal angle and T4–T5 disc aligned in one plane separating superior from inferior mediastinum.",
    caption: "Mediastinal dividing plane · Original teaching schematic",
  },
  {
    number: "II", title: "Abdomen, Digestive System & Peritoneum",
    description: "Build a regional understanding of the abdomen, digestive organs and peritoneum. This volume brings the major abdominal structures into one connected anatomical framework.",
    companion: "Study a focused web lesson with a labelled figure, explained questions and a narrated recap. The complete source book remains private.",
    topics: ["Abdominal regions", "Digestive anatomy", "Peritoneum"],
    image: "/images/anatomy/volume-2.png", alt: "Original schematic naming the nine abdominal regions in a three-by-three arrangement.",
    caption: "Abdominal regions · Original volume schematic",
  },
  {
    number: "III", title: "Pelvis, Perineum & Urogenital Anatomy",
    description: "Study the pelvis and perineum alongside the urinary and reproductive systems. The volume focuses on the spatial relationships that make this compact region easier to understand.",
    companion: "Study a focused web lesson with a labelled figure, explained questions and a narrated recap. The complete source book remains private.",
    topics: ["Pelvic anatomy", "Perineum", "Urogenital relationships"],
    image: "/images/anatomy/volume-3.png", alt: "Illustrated overview of the pudendal canal, ischioanal fossa and perineal neurovascular relationships.",
    caption: "Pelvis and perineum: follow the labelled spaces and neurovascular relationships.",
  },
  {
    number: "IV", title: "Head, Neck, Neuroanatomy & Embryology",
    description: "Connect the anatomy of the head and neck with the organisation of the nervous system and embryological development. A regional volume bringing several demanding areas of anatomy together.",
    companion: "Study a focused web lesson with a labelled figure, explained questions and a narrated recap. The complete source book remains private.",
    topics: ["Head and neck", "Neuroanatomy", "Embryology"],
    image: "/images/anatomy/volume-4.jpg", alt: "Exploded-view brain illustration showing major neural structures, coverings and blood vessels.",
    caption: "Brain anatomy: compare the labelled structures and their relationships.",
  },
  {
    number: "V", title: "Musculoskeletal Anatomy, Trunk, Limbs & Lymphatics",
    description: "Explore the structural anatomy of the trunk and limbs, with musculoskeletal, head and neck, and lymphatic coverage. This volume brings regional structures into the wider framework of the body.",
    companion: "Study a focused web lesson with a labelled figure, explained questions and a narrated recap. The complete source book remains private.",
    topics: ["Trunk and limbs", "Musculoskeletal anatomy", "Lymphatics"],
    image: "/images/anatomy/volume-5.png", alt: "Illustrated anterior, lateral and posterior views of hip bones and labelled bony landmarks.",
    caption: "Compare the labelled landmarks across the views of the hip bones.",
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
            <a className="volume-art" href={volume.image} target="_blank" rel="noopener noreferrer" aria-label={`Enlarge Volume ${volume.number} illustration (opens in a new tab)`}>
              <Image src={volume.image} alt={volume.alt} fill sizes="(max-width: 760px) 90vw, 45vw" />
              <span className="image-enlarge">Enlarge illustration ↗</span>
            </a>
            <div className="volume-copy">
              <div className="volume-topline"><span>Volume {volume.number}</span><span className="production-badge">Illustration preview</span></div>
              <h3>{volume.title}</h3>
              <p>{volume.description}</p>
              <ul className="volume-topics" aria-label="Topics covered">{volume.topics.map((topic) => <li key={topic}>{topic}</li>)}</ul>
              <details className="volume-companion">
                <summary>About this preview · Volume {volume.number}</summary>
                <p>{volume.companion}</p>
              </details>
              <p className="volume-caption">{volume.caption}</p><Link className="button button-primary" href={"/library/" + lessonIds[index]}>Study this volume</Link>
              {volume.number === "V" ? <Link className="text-link" href="/subjects/anatomy/musculoskeletal">Explore the musculoskeletal study map & sources →</Link> : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
