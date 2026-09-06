export const musculoskeletalSources = [
  {
    id: "volume-v",
    title: "Volume V — Musculoskeletal System, Trunk, Limbs, Head & Neck, and Lymphatic Drainage",
    format: "Study guide · 53 pages",
    edition: "Curated June 2026 edition",
    description: "An oral-exam study manuscript arranged into eight parts, with 47 numbered topics and 81 recall questions. It combines short oral answers, classification tables, regional relationships and a compressed answer key.",
    coverage: "Foundations; trunk; upper limb; lower limb; head and neck; development; lymphatics; recall.",
    locator: "Parts I–VIII, PDF pages 6–53. Page references use the PDF page order.",
  },
  {
    id: "joints-deck",
    title: "MSK — Joints, Axes & Radiology",
    format: "Teaching deck · 16 slides",
    edition: "Curated September 2, 2026 collection",
    description: "Connects joint classification with axes of movement, stabilization and anatomical orientation of images. Shoulder, hip, knee and ankle examples lead into a rapid-recall sequence.",
    coverage: "Joint connections, synovial anatomy, movement language, stabilizers and image orientation.",
    locator: "Classification and movements: slides 3–6. Joint and image examples: slides 7–13. Recall: slides 14–16.",
  },
  {
    id: "upper-limb-deck",
    title: "MSK — Upper Limb Anatomy & Neurovascular Relationships",
    format: "Teaching deck · 17 slides",
    edition: "Curated September 2, 2026 collection",
    description: "Follows the upper limb from the shoulder girdle to the hand, connecting regional anatomy with compartments, the brachial plexus, vessels and lymphatic drainage.",
    coverage: "Shoulder complex, axilla, scapular spaces, brachial plexus, elbow, wrist, hand and carpal tunnel.",
    locator: "Shoulder and axilla: slides 3–7. Plexus through hand: slides 8–13. Vessels, lymph and rehearsal: slides 14–17.",
  },
  {
    id: "lower-limb-deck",
    title: "MSK — Lower Limb Anatomy & Neurovascular Relationships",
    format: "Teaching deck · 17 slides",
    edition: "Curated September 2, 2026 collection",
    description: "Organizes lower-limb study around load transfer, hip and knee mechanics, compartments and the routes of nerves and vessels. It finishes with lymphatic pathways, image orientation and oral rehearsal.",
    coverage: "Pelvic girdle, hip, gluteal region, thigh, knee, leg, ankle and distal pathways.",
    locator: "Pelvic girdle and hip: slides 2–4. Regional and neurovascular study: slides 5–14. Lymph, images and rehearsal: slides 15–17.",
  },
] as const;

export const musculoskeletalTopics = [
  { id: "foundations", title: "Bones, joints & movement", description: "Start with the vocabulary: bone types, connections between bones, synovial joints and muscle organization. Practice explaining a joint through its type, movement and stabilizers.", reference: "Volume V, Part I · PDF pp. 6–8; Joints deck, slides 3–6.", sources: ["volume-v", "joints-deck"] },
  { id: "trunk", title: "Vertebral column & trunk", description: "Work through vertebral landmarks, the thoracic cage, diaphragm and abdominal wall. Organize the regions by boundaries, contents and relationships before rehearsing the hernia topics.", reference: "Volume V, Part II · PDF pp. 9–16.", sources: ["volume-v"] },
  { id: "upper-limb", title: "Upper limb", description: "Follow the shoulder girdle through the arm and forearm to the hand. Connect spaces and compartments with their nerves and vessels, then revisit the brachial plexus and carpal tunnel.", reference: "Volume V, Part III · PDF pp. 17–26; Upper Limb deck, slides 2–17.", sources: ["volume-v", "upper-limb-deck"] },
  { id: "lower-limb", title: "Pelvis & lower limb", description: "Begin with the hip-bone landmarks, then progress through hip stability, the gluteal region, thigh, knee, leg and foot. Trace the neurovascular routes as you move from region to region.", reference: "Volume V, Part IV · PDF pp. 26–37; Lower Limb deck, slides 2–17.", sources: ["volume-v", "lower-limb-deck"] },
  { id: "head-neck", title: "Plexuses, skull & neck", description: "Bring the cervical, lumbar and sacral plexuses into the regional map. Review skull divisions, the temporomandibular joint, muscles of mastication and the neck muscle groups.", reference: "Volume V, Part V · PDF pp. 37–40.", sources: ["volume-v"] },
  { id: "development", title: "Musculoskeletal development", description: "Link early embryology with limb, vertebral and skull development. Use the development topics to connect adult structures with their origins.", reference: "Volume V, Part VI · PDF pp. 40–43.", sources: ["volume-v"] },
  { id: "lymphatics", title: "Lymphatic drainage", description: "Organize drainage by territory and node group. Compare upper-limb, lower-limb, thoracic-wall and head-and-neck routes, then use the guide’s correction section to revisit common mix-ups.", reference: "Volume V, Part VII · PDF pp. 43–47; Upper and Lower Limb decks, slide 15.", sources: ["volume-v", "upper-limb-deck", "lower-limb-deck"] },
  { id: "recall", title: "Oral-exam rehearsal", description: "Choose a topic, explain it aloud without looking, and check the answer framework. Use the guide’s 81 prompts and the decks’ closing drills to identify what needs another pass.", reference: "Volume V, Part VIII · PDF pp. 48–53; Joints deck, slide 15; limb decks, slide 17.", sources: ["volume-v", "joints-deck", "upper-limb-deck", "lower-limb-deck"] },
] as const;

export const musculoskeletalRecall = [
  { question: "Which three bones form each hip bone?", answer: "The ilium, ischium and pubis meet at the acetabulum.", source: "lower-limb-deck", reference: "Lower Limb deck, slide 2; Volume V, topic 26." },
  { question: "What belongs inside the carpal tunnel?", answer: "The median nerve and nine flexor tendons: four flexor digitorum superficialis, four flexor digitorum profundus and one flexor pollicis longus. The ulnar nerve and artery pass through Guyon’s canal; flexor carpi radialis has a separate tunnel, and palmaris longus lies superficial to the flexor retinaculum.", source: "upper-limb-deck", reference: "Upper Limb deck, slide 12; Volume V, topic 23." },
  { question: "How do flexion and extension relate to planes and axes?", answer: "Flexion and extension occur in the sagittal plane around a transverse axis. Say the movement, plane and axis together when describing a joint.", source: "joints-deck", reference: "Joints, Axes & Radiology deck, slide 6." },
] as const;
