import type { CheckpointDefinition, CheckpointSource } from "../lib/conceptual-checkpoint.ts";
import type { PracticeItem } from "./practice-registry.ts";

const book = "https://openstax.org/books/anatomy-and-physiology-2e/pages/";
const heart: CheckpointSource = { title: "OpenStax · Heart Anatomy", url: book + "19-1-heart-anatomy", basis: "textbook-based" };
const lungs: CheckpointSource = { title: "OpenStax · The Lungs", url: book + "22-2-the-lungs", basis: "textbook-based" };
const exchange: CheckpointSource = { title: "OpenStax · Gas Exchange", url: book + "22-4-gas-exchange", basis: "textbook-based" };

type SourceLink = { title: string; url: string };
type View = {
  id: "heart-in-thorax" | "heart-chambers" | "lung-lobes" | "alveolar-barrier";
  title: string;
  caption: string;
  observe: string;
  landmarks: { name: string; x: number; y: number; detail: string }[];
  sources: SourceLink[];
};
type Option = { text: string; explanation: string };
type Exercise = {
  id: string;
  title: string;
  prompt: string;
  options: [Option, Option, Option];
  answer: 0 | 1 | 2;
  source: CheckpointSource;
};
export type ThoraxUnit = {
  id: "cardiovascular" | "respiratory";
  title: string;
  objective: string;
  views: [View, View];
  examples: { title: string; explanation: string }[];
  exercises: Exercise[];
  fieldwork: { task: string; compare: string; source: SourceLink };
  next: { label: string; href: string };
  relatedLesson: { label: string; href: string };
};

export const thoraxUnits: readonly ThoraxUnit[] = [
  {
    id: "cardiovascular",
    title: "Place the heart, then trace the valves",
    objective: "Locate the heart between the lungs and predict which valve blood crosses next.",
    views: [
      {
        id: "heart-in-thorax",
        title: "Where the heart sits",
        caption: "Simplified anterior view. The patient’s right is on the viewer’s left. Ribs and sternum are omitted so the organs can be seen.",
        observe: "Find the gap between the lungs, then locate the apex on the patient’s left.",
        landmarks: [
          { name: "Right lung", x: 82, y: 104, detail: "The patient’s right lung appears on the left of this anterior view. Lung tissue lies to either side of the mediastinum." },
          { name: "Heart in the mediastinum", x: 166, y: 126, detail: "The heart sits between the lungs in the mediastinum, posterior to the sternum. The mediastinum also contains structures omitted here." },
          { name: "Left lung", x: 257, y: 100, detail: "The anterior border of the left lung has a cardiac notch that accommodates the heart." },
          { name: "Apex", x: 215, y: 191, detail: "The apex is the pointed inferior end of the heart, formed mainly by the left ventricle. It points towards the patient’s left." },
        ],
        sources: [{ title: heart.title, url: book + "19-1-heart-anatomy" }, { title: lungs.title, url: book + "22-2-the-lungs" }],
      },
      {
        id: "heart-chambers",
        title: "Four chambers and their outlets",
        caption: "Opened schematic viewed from the front. Chambers, valves and vessels are drawn to show connections. The drawing combines structures from different depths.",
        observe: "Trace each column from its atrium to its ventricle and then out through the corresponding outflow valve.",
        landmarks: [
          { name: "Right atrium", x: 98, y: 75, detail: "Blood returning from the body enters the right atrium. The tricuspid valve leads into the right ventricle." },
          { name: "Right ventricle", x: 104, y: 167, detail: "Blood leaves the right ventricle through the pulmonary valve, then enters the pulmonary trunk on its way to the lungs." },
          { name: "Left atrium", x: 236, y: 75, detail: "Pulmonary veins bring blood back from the lungs to the left atrium. The mitral valve leads into the left ventricle." },
          { name: "Left ventricle", x: 232, y: 167, detail: "Blood leaves the left ventricle through the aortic valve and enters the aorta for delivery to the body." },
        ],
        sources: [{ title: heart.title, url: book + "19-1-heart-anatomy" }],
      },
    ],
    examples: [
      { title: "Returning from a lung", explanation: "Start in a pulmonary vein. Blood enters the left atrium, crosses the mitral valve into the left ventricle, then crosses the aortic valve into the aorta." },
      { title: "Leaving for a lung", explanation: "Start in the right ventricle. Blood crosses the pulmonary valve into the pulmonary trunk. The trunk divides into right and left pulmonary arteries." },
    ],
    exercises: [
      {
        id: "apex-anterior-view",
        title: "Transfer the view",
        prompt: "On an unmirrored anterior diagram, the apex points to the viewer’s right. Which side of the patient is that?",
        options: [
          { text: "The patient’s right", explanation: "In an anterior view the patient faces you, so your right is their left." },
          { text: "The patient’s left", explanation: "An anterior view faces the patient. The apex points towards the patient’s left, on the viewer’s right." },
          { text: "Neither side because it lies in the middle", explanation: "The heart is in the mediastinum, but its apex points towards the patient’s left." },
        ],
        answer: 1, source: heart,
      },
      {
        id: "venous-return-valve",
        title: "Trace a route",
        prompt: "A drop of blood enters the right atrium from the inferior vena cava. Which valve does it cross before reaching a ventricle?",
        options: [
          { text: "Tricuspid valve", explanation: "The tricuspid valve sits between the right atrium and right ventricle." },
          { text: "Pulmonary valve", explanation: "The pulmonary valve is crossed later, when blood leaves the right ventricle." },
          { text: "Mitral valve", explanation: "The mitral valve connects the left atrium to the left ventricle." },
        ],
        answer: 0, source: heart,
      },
      {
        id: "backward-flow",
        title: "Apply the valve relationship",
        prompt: "In a simplified model, the aortic valve fails to seal as the ventricle relaxes. Where can blood move backwards?",
        options: [
          { text: "From the left atrium into the lungs", explanation: "The aortic valve does not sit at the pulmonary veins." },
          { text: "From the aorta into the right ventricle", explanation: "The aorta connects to the left ventricle." },
          { text: "From the aorta into the left ventricle", explanation: "The aortic valve separates the aorta from the left ventricle. If it fails to seal, the pressure difference can drive reverse flow into that ventricle." },
        ],
        answer: 2, source: heart,
      },
    ],
    fieldwork: {
      task: "Open the Heart lab. Find the apex and base on a specimen first, then locate an atrium and a ventricle before reading the labels.",
      compare: "Use the apex and the great vessels as separate orientation clues. A view can change when the specimen is turned, while the chamber connections stay the same.",
      source: { title: "University of Michigan BlueLink · Heart lab", url: "https://sites.google.com/a/umich.edu/bluelink/curricula/m1-foundational-anatomy/sequence-2-cardiology/heart/lablink" },
    },
    next: { label: "Follow blood into the lungs", href: "/learn/anatomy-systems/respiratory#thorax-study" },
    relatedLesson: { label: "Study the heart valves in more depth", href: "/library/heart-valves-skeleton" },
  },
  {
    id: "respiratory",
    title: "Compare lung lobes and zoom in to gas exchange",
    objective: "Orient both lungs, then distinguish the air path, blood path and direction of gas diffusion.",
    views: [
      {
        id: "lung-lobes",
        title: "Compare the right and left lung",
        caption: "Simplified anterior view. The patient’s right is on the viewer’s left. Dashed lines mark where the oblique fissures continue beyond the front surface.",
        observe: "Count lobes on each side and find which lung has a horizontal fissure.",
        landmarks: [
          { name: "Right lung lobes", x: 88, y: 114, detail: "The right lung has superior, middle and inferior lobes. The horizontal fissure separates the superior and middle lobes." },
          { name: "Left lung lobes", x: 247, y: 131, detail: "The left lung has superior and inferior lobes, separated by an oblique fissure." },
          { name: "Cardiac notch", x: 204, y: 101, detail: "The notch is an indentation in the anterior border of the left lung that makes room for the heart." },
        ],
        sources: [{ title: lungs.title, url: book + "22-2-the-lungs" }],
      },
      {
        id: "alveolar-barrier",
        title: "Where air and blood come close",
        caption: "Enlarged alveolus beside a capillary. The solid and dashed arrows show opposite gas diffusion. The sizes and distances are schematic.",
        observe: "Follow oxygen across the thin boundary into the capillary. Trace carbon dioxide in the opposite direction.",
        landmarks: [
          { name: "Alveolar air", x: 159, y: 72, detail: "Ventilation delivers fresh air to the alveolus. Oxygen diffuses from alveolar air into incoming capillary blood when its partial pressure is higher in the alveolus." },
          { name: "Exchange barrier", x: 235, y: 135, detail: "The thin alveolar epithelium and capillary endothelium contribute to the short diffusion path. Air and blood remain in separate spaces." },
          { name: "Capillary blood", x: 153, y: 207, detail: "Perfusion brings blood through the capillary. Carbon dioxide diffuses from incoming blood into alveolar air when its partial pressure is higher in blood." },
        ],
        sources: [{ title: exchange.title, url: book + "22-4-gas-exchange" }],
      },
    ],
    examples: [
      { title: "Follow air", explanation: "The conducting airways move air towards the respiratory zone. Oxygen crosses the alveolar barrier by diffusion. The airway itself does not carry blood." },
      { title: "Follow blood", explanation: "The right ventricle supplies the pulmonary arteries. Blood passes through capillaries next to alveoli and returns via pulmonary veins to the left atrium." },
    ],
    exercises: [
      {
        id: "horizontal-fissure",
        title: "Identify an unlabelled lung",
        prompt: "An unlabelled lung has a horizontal fissure and a middle lobe. Which lung is it?",
        options: [
          { text: "Left lung", explanation: "The usual left lung has two lobes and one oblique fissure." },
          { text: "Either lung", explanation: "The middle lobe and horizontal fissure are characteristic of the usual right lung." },
          { text: "Right lung", explanation: "The horizontal fissure separates the superior and middle lobes of the right lung." },
        ],
        answer: 2, source: lungs,
      },
      {
        id: "perfusion-versus-ventilation",
        title: "Predict which path changes",
        prompt: "Air still reaches an alveolus, but blood flow to its capillary stops. Which process has been directly lost?",
        options: [
          { text: "Local perfusion", explanation: "Perfusion is blood flow through the capillaries. Air can still reach the alveolus in this example." },
          { text: "Local ventilation", explanation: "Ventilation is the movement of air. The question states that air still reaches this alveolus." },
          { text: "Both processes by definition", explanation: "Ventilation and perfusion describe different paths. Stopping one does not make the other stop by definition." },
        ],
        answer: 0, source: exchange,
      },
      {
        id: "diffusion-distance",
        title: "Apply the barrier model",
        prompt: "Two models have the same surface area and oxygen partial-pressure difference. One has a thicker exchange barrier. In which model is oxygen transfer slower?",
        options: [
          { text: "The thinner barrier", explanation: "A shorter diffusion distance favours faster transfer when the other conditions are held fixed." },
          { text: "The thicker barrier", explanation: "A longer diffusion path reduces the transfer rate if the gradient, area and other properties are held fixed." },
          { text: "The rate must be identical", explanation: "Equal area and gradient do not make the rates equal. The diffusion distance also matters." },
        ],
        answer: 1, source: exchange,
      },
    ],
    fieldwork: {
      task: "Open the MH 138 lung section. At low magnification find the small air spaces and thin partitions. Compare a group of alveoli with a bronchiole profile.",
      compare: "Look for several small spaces sharing thin septa. A bronchiole has a more continuous wall around a single lumen. In a section, a vessel in a septum may be easier to locate when it contains red blood cells.",
      source: { title: "Histology Guide · MH 138 lung section", url: "https://www.histologyguide.org/slideview/MH-138-lung/17-slide-1.html?page=2&x=35347&y=15107&z=100" },
    },
    next: { label: "Return to the heart and valves", href: "/learn/anatomy-systems/cardiovascular#thorax-study" },
    relatedLesson: { label: "Study respiratory histology in more depth", href: "/library/respiratory-histology" },
  },
];

export function thoraxPractice(unit: ThoraxUnit): PracticeItem[] {
  return unit.exercises.map(exercise => {
    const topic = "anatomy-system-" + unit.id;
    const id = topic + "-" + exercise.id;
    const checkpoint: CheckpointDefinition = {
      id, type: "single", prompt: exercise.prompt, options: exercise.options, answer: exercise.answer,
      mechanism: exercise.options[exercise.answer].explanation,
      metadata: {
        subject: "anatomy", lesson: topic, topic: unit.title, subtopic: exercise.title,
        concept: id, difficulty: "applied", prerequisites: [],
        sources: [exercise.source],
      },
    };
    return {
      id, topic, title: unit.id === "cardiovascular" ? "Two circuits through one heart" : "From conducting airway to exchange surface",
      subject: "anatomy", href: "/learn/anatomy-systems/" + unit.id + "#question-" + id,
      prompt: exercise.prompt, checkpoint,
    };
  });
}
