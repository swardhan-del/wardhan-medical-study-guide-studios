import Image from "next/image";

const volumes = [
  {
    number: "I", title: "Thorax, Heart, Lungs & Mediastinum",
    description: "Explore the anatomy of the chest, from the heart and lungs to the spaces and structures of the mediastinum. A focused introduction to how the major thoracic structures fit together.",
    companion: "A companion study guide is being prepared for revision of thoracic landmarks and anatomical relationships.",
    topics: ["Thoracic anatomy", "Heart and lungs", "Mediastinum"],
    image: "/images/anatomy/volume-1.png", alt: "Sagittal illustration showing the compartments of the mediastinum and surrounding thoracic structures.",
    caption: "Mediastinal compartments · STEM Visualizer collection",
  },
  {
    number: "II", title: "Abdomen, Digestive System & Peritoneum",
    description: "Build a regional understanding of the abdomen, digestive organs and peritoneum. This volume brings the major abdominal structures into one connected anatomical framework.",
    companion: "A companion study guide is being prepared for revision of abdominal regions, organ relationships and peritoneal organization.",
    topics: ["Abdominal regions", "Digestive anatomy", "Peritoneum"],
    image: "/images/anatomy/volume-2.png", alt: "Original schematic naming the nine abdominal regions in a three-by-three arrangement.",
    caption: "Abdominal regions · Original volume schematic",
  },
  {
    number: "III", title: "Pelvis, Perineum & Urogenital Anatomy",
    description: "Study the pelvis and perineum alongside the urinary and reproductive systems. The volume focuses on the spatial relationships that make this compact region easier to understand.",
    companion: "A companion study guide is being prepared for revision of pelvic landmarks, perineal spaces and urogenital relationships.",
    topics: ["Pelvic anatomy", "Perineum", "Urogenital relationships"],
    image: "/images/anatomy/volume-3.png", alt: "Illustrated overview of the pudendal canal, ischioanal fossa and perineal neurovascular relationships.",
    caption: "Pelvis and perineum · STEM Visualizer collection",
  },
  {
    number: "IV", title: "Head, Neck, Neuroanatomy & Embryology",
    description: "Connect the anatomy of the head and neck with the organization of the nervous system and embryological development. A regional volume bringing several demanding areas of anatomy together.",
    companion: "A companion study guide is being prepared for revision across head and neck anatomy, neural structures and embryology.",
    topics: ["Head and neck", "Neuroanatomy", "Embryology"],
    image: "/images/anatomy/volume-4.jpg", alt: "Exploded-view brain illustration showing major neural structures, coverings and blood vessels.",
    caption: "Brain anatomy overview · STEM Visualizer collection",
  },
  {
    number: "V", title: "Musculoskeletal Anatomy, Trunk, Limbs & Lymphatics",
    description: "Explore the structural anatomy of the trunk and limbs, with musculoskeletal, head and neck, and lymphatic coverage. This volume brings regional structures into the wider framework of the body.",
    companion: "A companion study guide is being prepared for revision of bones, regional landmarks and musculoskeletal relationships.",
    topics: ["Trunk and limbs", "Musculoskeletal anatomy", "Lymphatics"],
    image: "/images/anatomy/volume-5.png", alt: "Illustrated anterior, lateral and posterior views of hip bones and labeled bony landmarks.",
    caption: "Hip bones and landmarks · STEM Visualizer collection",
  },
];

export function AnatomyVolumes() {
  return (
    <section className="anatomy-series" aria-labelledby="anatomy-series-title">
      <header className="series-heading">
        <p className="eyebrow">The anatomy collection · In production</p>
        <h2 id="anatomy-series-title">Five volumes. One connected study journey.</h2>
        <p>Explore five forthcoming books and their companion study guides.
          Kindle editions are planned for publication through Amazon KDP.
          Publication dates and purchase links will be added when available.</p>
      </header>
      <nav className="volume-jump-links" aria-label="Jump to an anatomy volume">
        {volumes.map((volume) => <a key={volume.number} href={`#volume-${volume.number.toLowerCase()}`}>Volume {volume.number}</a>)}
      </nav>
      <div className="volume-grid">
        {volumes.map((volume) => (
          <article className="volume-preview" id={`volume-${volume.number.toLowerCase()}`} key={volume.number}>
            <a className="volume-art" href={volume.image} target="_blank" rel="noopener noreferrer" aria-label={`Enlarge Volume ${volume.number} illustration (opens in a new tab)`}>
              <Image src={volume.image} alt={volume.alt} fill sizes="(max-width: 760px) 90vw, 45vw" />
              <span className="image-enlarge">Enlarge illustration ↗</span>
            </a>
            <div className="volume-copy">
              <div className="volume-topline"><span>Volume {volume.number}</span><span className="production-badge">In production</span></div>
              <h3>{volume.title}</h3>
              <p>{volume.description}</p>
              <ul className="volume-topics" aria-label="Topics covered">{volume.topics.map((topic) => <li key={topic}>{topic}</li>)}</ul>
              <details className="volume-companion">
                <summary>Companion study guide · Volume {volume.number}</summary>
                <p>{volume.companion}</p>
                <p>Book and study guide are in production. Preview illustrations may change before publication.</p>
              </details>
              <p className="volume-caption">{volume.caption}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
