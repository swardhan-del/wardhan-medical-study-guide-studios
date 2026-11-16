type GuideVisual =
  | { kind: "figure"; id: string }
  | { kind: "spinal-section" }
  | { kind: "model"; label: string; steps: readonly string[]; ordered?: false };

export type GuideVisualPractice = {
  title: string;
  visual: GuideVisual;
  question: string;
  explanation: string;
  href: string;
  action: string;
};

export const guideVisualPractice: Record<string, GuideVisualPractice> = {
  anatomy: {
    title: "Orient yourself in the thorax",
    visual: { kind: "figure", id: "thoracic-plane" },
    question: "A point lies behind the sternum and below the transverse thoracic plane. Which division can you identify from these clues? What landmark would you need to place it in a smaller compartment?",
    explanation: "Below the plane puts the point in the inferior mediastinum, assuming it is within the mediastinum. To distinguish its anterior, middle and posterior compartments, check where the point lies relative to the pericardium.",
    href: "/library/thoracic-cage-landmarks",
    action: "Study the thoracic landmarks and questions",
  },
  histology: {
    title: "Find a clue in a spinal cord section",
    visual: { kind: "spinal-section" },
    question: "You receive a second section that is stained differently. Which clues would you check before naming the dorsal and ventral horns?",
    explanation: "Begin with the landmarks and the shape of the grey matter. In this section the deep anterior median fissure marks the ventral side, next to the broader horns. Staining can alter how light or dark those regions look.",
    href: "/practice/spinal-cord",
    action: "Try the spinal cord practical",
  },
  "cell-biology": {
    title: "Track a lysosomal sorting receptor",
    visual: { kind: "model", label: "From the Golgi to the endosome and back", steps: ["Tagged enzyme binds its receptor in the Golgi", "Enzyme separates from the receptor in the endosome", "Receptor returns to the Golgi"] },
    question: "In a cell, tagged enzymes still separate from their receptors in the endosome, but the receptors fail to return to the Golgi. Predict what happens to the next rounds of delivery.",
    explanation: "Cargo already carried to the endosome can still be released. As receptors accumulate away from the Golgi, fewer are available there to sort the next enzymes. The cargo tag and the return of the receptor solve different steps.",
    href: "/library/lysosomal-m6p-tag-receptor-recycling",
    action: "Follow the full sorting pathway and questions",
  },
  biochemistry: {
    title: "Follow carbon through pyruvate oxidation",
    visual: { kind: "model", label: "Carbon count for one pyruvate", steps: ["Pyruvate: 3 carbons", "Pyruvate dehydrogenase releases CO₂: 1 carbon", "Acetyl-CoA enters the cycle: 2 carbons"] },
    question: "Three pyruvates pass through pyruvate dehydrogenase. How many carbons are released as CO₂ in that step, and how many enter the cycle in acetyl groups?",
    explanation: "Each pyruvate contributes one carbon to CO₂ and two to an acetyl group. For three pyruvates, that is three carbons as CO₂ and six entering the cycle. This count stops at cycle entry.",
    href: "/library/pdh-tca#pdh-mechanism-title",
    action: "Explore the mechanism and test a carbon count",
  },
  physiology: {
    title: "Read pressure and volume in a heartbeat",
    visual: { kind: "figure", id: "ventricular-pressure-volume" },
    question: "The loop has two nearly vertical segments. Why is there little change in volume in both, even though pressure rises in one and falls in the other?",
    explanation: "Both valves are closed on each vertical segment, so volume stays nearly constant. The ventricle builds pressure before ejection and loses pressure after ejection as it relaxes. The direction of the pressure change distinguishes those phases.",
    href: "/library/cardiac-cycle",
    action: "Explore the cardiac cycle and questions",
  },
  genetics: {
    title: "Distinguish genetic drift from selection",
    visual: { kind: "model", label: "Four draws with replacement from either of two pools", ordered: false, steps: ["Pool 1: 3 A and 2 a copies", "Pool 2: 1 A and 4 a copies", "Same observed sample: A, A, A, A"] },
    question: "In which pool is the sample of four A copies more surprising under random sampling? Can the sample alone establish an advantage for A?",
    explanation: "The chance is (3/5)⁴, about 13%, in pool 1 and (1/5)⁴, about 0.16%, in pool 2. The same sample can carry different weight depending on the starting pool. Evidence for a biological advantage also needs a comparison that can distinguish selection from other explanations.",
    href: "/library/genetic-drift-sampling-model",
    action: "Compare two sampling models and answer questions",
  },
  immunology: {
    title: "Separate recognition from activation",
    visual: { kind: "model", label: "Two inputs to a naive T cell", ordered: false, steps: ["A receptor recognises peptide–MHC", "Co-stimulatory signals also reach the cell", "Measure an activation response"] },
    question: "Two groups of cells recognise the same peptide–MHC. Blocking co-stimulation in one group reduces activation. Which step does this comparison help distinguish?",
    explanation: "The comparison supports a role for co-stimulation in activation while peptide–MHC recognition is held fixed. Lower activation alone cannot establish that antigen recognition failed.",
    href: "/library/antigen-presentation",
    action: "Compare recognition and activation with questions",
  },
  biophysics: {
    title: "Predict how far diffusion reaches",
    visual: { kind: "model", label: "Compare a one-dimensional diffusion model at two times", steps: ["Start: diffusion coefficient D fixed", "At time t: typical distance √(2Dt)", "At time 4t: compare with your first result"] },
    question: "In one dimension, the time for free diffusion increases from t to 4t. By what factor does the root mean square displacement change? Does that tell you the direction an individual particle moves?",
    explanation: "The displacement scale doubles because the square root of four is two. It measures spread. Individual particles can move in either direction, and the mean signed displacement is zero in this symmetric model.",
    href: "/practice/biophysics#diffusion",
    action: "Change the diffusion time and test a prediction",
  },
  biostatistics: {
    title: "Find the denominator in a study",
    visual: { kind: "model", label: "Previous exposure in two selected groups", ordered: false, steps: ["200 cases: 120 previously exposed, 80 unexposed", "200 controls: 60 previously exposed, 140 unexposed", "Compare exposure odds in the two groups"] },
    question: "Calculate the exposure odds ratio. Can 200 cases out of these 400 selected participants tell you the population risk?",
    explanation: "Divide 120/80 by 60/140 to get 3.5. The case and control totals are set by recruitment in this example. To estimate absolute risk, you need the relevant population denominators.",
    href: "/library/cohort-case-control-denominators#case-control-explorer-title",
    action: "Change the example and practise with new data",
  },
};
