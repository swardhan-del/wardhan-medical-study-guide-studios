export const renalRevision = "2026-09-06";
export const renalAuthor = "Wardhan Medical Study Guide Studios";
export type RenalLesson = {
  slug: string;
  title: string;
  minutes: number;
  description: string;
  objectives: string[];
  sections: { title: string; text: string }[];
  pathway: { title: string; detail: string }[];
  misconception: string;
  oral: string;
  rubric: string[];
  followUp: string;
  sourceSection: string;
};
export const renalLessons: RenalLesson[] = [
  {
    slug: "kidney-map",
    title: "Follow the blood. Follow the filtrate.",
    minutes: 8,
    description:
      "Build a mental map of the nephron by keeping blood and tubular fluid on separate paths.",
    objectives: [
      "Trace the two capillary beds in series.",
      "Separate filtration, reabsorption, secretion and excretion.",
      "Locate the cortex, medulla and collecting system.",
    ],
    sections: [
      {
        title: "Two paths, one organ",
        text: "Blood enters a glomerulus through an afferent arteriole and leaves through an efferent arteriole. A second capillary bed receives that blood: peritubular capillaries around cortical tubules, or vasa recta associated with juxtamedullary nephrons. Filtrate crosses into Bowman space and takes a different route through the tubules.",
      },
      {
        title: "Four verbs that keep the map straight",
        text: "Filtration moves fluid and small solutes from glomerular blood into Bowman space. Reabsorption returns material from tubular fluid to blood. Secretion moves material from blood into tubular fluid. Excretion is what finally leaves in urine: filtered amount minus reabsorbed amount plus secreted amount.",
      },
      {
        title: "Location explains function",
        text: "Renal corpuscles lie in the cortex. Long loops of juxtamedullary nephrons extend into the medulla and help establish the concentration gradient. Collecting ducts receive fluid from multiple nephrons and use that gradient when their water permeability increases.",
      },
    ],
    pathway: [
      {
        title: "Blood",
        detail: "Afferent → glomerulus → efferent → second capillary bed",
      },
      {
        title: "Filtrate",
        detail: "Bowman space → proximal tubule → loop → distal tubule",
      },
      {
        title: "Final adjustment",
        detail: "Connecting tubule → collecting duct → renal pelvis",
      },
    ],
    misconception:
      "The efferent arteriole does not carry urine. It carries blood away from the glomerulus.",
    oral: "Trace a water molecule from glomerular blood to urine, then describe where it could return to blood.",
    rubric: [
      "Name the filtration step and Bowman space.",
      "Trace proximal tubule, loop, distal tubule and collecting system.",
      "Describe reabsorption into the interstitium and capillaries.",
      "Distinguish urine flow from the efferent blood pathway.",
    ],
    followUp:
      "Why does the kidney need a second capillary bed after the glomerulus?",
    sourceSection: "Chapters 28–29: renal circulation and nephron organization",
  },
  {
    slug: "filtration-and-clearance",
    title: "What does renal clearance actually measure?",
    minutes: 10,
    description:
      "Use units and mass balance to distinguish GFR, plasma flow, filtration fraction and clearance.",
    objectives: [
      "Calculate clearance from urine concentration, flow and plasma concentration.",
      "Explain why inulin, creatinine and PAH give different information.",
      "Calculate filtration fraction without confusing blood and plasma flow.",
    ],
    sections: [
      {
        title: "A virtual volume, not a drained container",
        text: "Clearance is the volume of plasma that would contain the amount of a substance excreted each minute. C = U × V / P. If urine concentration is 100 mg/mL, urine flow is 1 mL/min and plasma concentration is 1 mg/mL, clearance is 100 mL/min. The concentrations must use matching units.",
      },
      {
        title: "Choose the marker by its handling",
        text: "Inulin is freely filtered and neither reabsorbed nor secreted, so its clearance equals GFR under ideal measurement conditions. Creatinine is convenient but is also secreted slightly, so measured creatinine clearance tends to overestimate GFR. At low concentrations, PAH is filtered and strongly secreted; its clearance approximates effective renal plasma flow, because extraction is high but incomplete.",
      },
      {
        title: "Ask what the denominator contains",
        text: "Filtration fraction is GFR divided by renal plasma flow. For GFR 120 mL/min and RPF 600 mL/min, FF is 0.20, or 20%. Blood flow includes cells: RBF = RPF / (1 − hematocrit). Using PAH clearance in place of true RPF gives an estimate based on effective plasma flow.",
      },
    ],
    pathway: [
      { title: "Filtered load", detail: "GFR × plasma concentration" },
      { title: "Excretion rate", detail: "Urine concentration × urine flow" },
      { title: "Clearance", detail: "Excretion rate ÷ plasma concentration" },
    ],
    misconception:
      "A clearance above GFR indicates net secretion of a freely filtered substance. It does not tell you that the urine is dilute.",
    oral: "Compare inulin, creatinine and PAH as markers, and explain the limitation of each.",
    rubric: [
      "Define clearance with units of volume per time.",
      "Connect inulin clearance to GFR.",
      "Mention creatinine secretion.",
      "Distinguish effective PAH plasma flow from true plasma flow.",
    ],
    followUp:
      "What happens to PAH clearance when secretory transport becomes saturated?",
    sourceSection:
      "Chapters 29–30: clearance, filtered load and fractional excretion",
  },
  {
    slug: "afferent-efferent",
    title: "Afferent versus efferent: flow is not filtration.",
    minutes: 10,
    description:
      "Predict how resistance before and after the glomerulus changes flow and filtration pressure.",
    objectives: [
      "Predict the effects of afferent constriction.",
      "Explain moderate versus severe efferent constriction.",
      "Connect myogenic and macula-densa signals to afferent tone.",
    ],
    sections: [
      {
        title: "The inlet resistor",
        text: "Increasing afferent resistance reduces blood entry and lowers glomerular capillary pressure. Renal blood flow and GFR usually fall together. Afferent dilation has the opposite tendency when the other determinants are held constant.",
      },
      {
        title: "The outlet resistor",
        text: "Moderate efferent constriction reduces renal plasma flow but raises upstream glomerular hydrostatic pressure. GFR may rise or be maintained, increasing filtration fraction. With severe constriction, the large fall in plasma flow and the rise in glomerular capillary oncotic pressure can reduce GFR. More constriction does not mean indefinitely more filtration.",
      },
      {
        title: "Autoregulation is a response, not a second circuit",
        text: "Afferent smooth muscle contracts when stretched: the myogenic response buffers changes in perfusion pressure. Increased NaCl delivery to the macula densa promotes tubuloglomerular feedback that increases afferent tone. Low delivery favors renin release and reduced constrictor signaling. These responses modify a connected circulation.",
      },
    ],
    pathway: [
      { title: "Before", detail: "Afferent resistance controls entry" },
      {
        title: "Between",
        detail: "Glomerular pressure helps drive filtration",
      },
      { title: "After", detail: "Efferent resistance controls exit" },
    ],
    misconception:
      "Efferent constriction can lower blood flow while supporting GFR. The two measurements need not move in the same direction.",
    oral: "Explain why moderate efferent constriction can increase filtration fraction while reducing plasma flow.",
    rubric: [
      "Identify resistance after the glomerulus.",
      "Describe the upstream pressure increase.",
      "Describe the reduction in plasma flow.",
      "Explain why severe constriction eventually limits GFR.",
    ],
    followUp:
      "How would increased pressure inside Bowman space change filtration?",
    sourceSection:
      "Chapter 29: arteriolar resistance and autoregulation; corrected severe-efferent comparison",
  },
  {
    slug: "tubular-transport",
    title: "A tour of tubular transport",
    minutes: 9,
    description:
      "Match each nephron segment to its job, from bulk recovery to final adjustment.",
    objectives: [
      "Explain bulk proximal reabsorption.",
      "Locate NKCC2, NCC and ENaC.",
      "Distinguish transport saturation from changes in water handling.",
    ],
    sections: [
      {
        title: "Recover the bulk early",
        text: "The proximal tubule normally reabsorbs roughly two-thirds of filtered sodium and water, most filtered bicarbonate, and nearly all glucose and amino acids at ordinary plasma concentrations. Water follows solute, so this bulk recovery is approximately isosmotic. Basolateral Na⁺/K⁺-ATPase supports many apical transport processes.",
      },
      {
        title: "Dilute, then fine-tune",
        text: "The thick ascending limb reabsorbs Na⁺, K⁺ and Cl⁻ through NKCC2 while remaining poorly permeable to water. The early distal convoluted tubule uses NCC. Later segments use channels including ENaC; principal cells couple sodium recovery to regulated potassium secretion.",
      },
      {
        title: "Transporters have limits",
        text: "Carrier-mediated glucose reabsorption can become saturated, allowing glucose to remain in urine. Glucose clearance rises when excretion begins, but that is a statement about glucose handling. It does not directly specify the urine’s total osmolality, which depends on all urinary solutes and water.",
      },
    ],
    pathway: [
      {
        title: "Proximal",
        detail: "Bulk Na⁺, water, bicarbonate and nutrient recovery",
      },
      {
        title: "Loop + early distal",
        detail: "NKCC2 and NCC recover salt without equivalent water",
      },
      {
        title: "Late distal",
        detail: "ENaC, potassium secretion and hormonal fine-tuning",
      },
    ],
    misconception:
      "Secretion means movement into the tubular lumen. It is not another word for releasing a hormone into blood.",
    oral: "Compare proximal tubule, thick ascending limb and collecting duct using solute transport and water permeability.",
    rubric: [
      "Describe approximately isosmotic proximal recovery.",
      "Name NKCC2 in the thick ascending limb.",
      "Explain why the ascending limb dilutes tubular fluid.",
      "Describe regulated water permeability downstream.",
    ],
    followUp:
      "Why can glucose appear in urine even when filtration is still occurring normally?",
    sourceSection:
      "Chapter 30: proximal and distal tubular handling; transporter map",
  },
  {
    slug: "concentrating-urine",
    title: "How the kidney concentrates urine",
    minutes: 10,
    description:
      "Separate the machinery that builds a gradient from the hormone that lets water use it.",
    objectives: [
      "Distinguish countercurrent multiplication and exchange.",
      "Locate the V2 receptor and AQP2.",
      "Explain why ADH needs an intact medullary gradient.",
    ],
    sections: [
      {
        title: "Build the gradient",
        text: "Countercurrent multiplication in the loops of Henle helps establish the corticomedullary osmotic gradient. The descending thin limb permits substantial water movement; the ascending limb recovers salt while restricting water movement. Urea recycling contributes to inner medullary osmolality.",
      },
      {
        title: "Preserve the gradient",
        text: "Vasa recta exchange limits the removal of medullary solute while supplying tissue. Excessive washout weakens the gradient. Countercurrent exchange preserves a gradient; it is not the same mechanism as multiplication in the loop.",
      },
      {
        title: "Open the water route",
        text: "ADH acts on basolateral V2 receptors of collecting-duct principal cells. Gs, cAMP and PKA signaling increases apical AQP2 insertion. Water then moves down an osmotic gradient. With little ADH, low collecting-duct water permeability permits more dilute urine; with ADH and an intact gradient, more water is recovered.",
      },
    ],
    pathway: [
      {
        title: "Build",
        detail: "Loop transport establishes the medullary gradient",
      },
      {
        title: "Preserve",
        detail: "Vasa recta exchange limits solute washout",
      },
      {
        title: "Use",
        detail: "ADH → basolateral V2 → apical AQP2 → water recovery",
      },
    ],
    misconception:
      "ADH does not pump water into blood. It increases permeability so water can follow an existing osmotic gradient.",
    oral: "Explain why high ADH cannot fully concentrate urine if the medullary gradient has been lost.",
    rubric: [
      "Separate water permeability from osmotic driving force.",
      "Describe loop multiplication.",
      "Describe vasa recta exchange and urea recycling.",
      "Locate V2 basolaterally and AQP2 apically.",
    ],
    followUp: "Why does the thick ascending limb dilute tubular fluid?",
    sourceSection:
      "Chapter 31: countercurrent physiology, urea recycling and ADH/AQP2",
  },
  {
    slug: "volume-and-osmolality",
    title: "Volume and osmolality ask different questions.",
    minutes: 8,
    description:
      "Connect sodium balance, water balance, RAAS and ADH without treating them as interchangeable.",
    objectives: [
      "Distinguish extracellular volume from concentration.",
      "Identify signals for renin release.",
      "Contrast aldosterone and ADH actions.",
    ],
    sections: [
      {
        title: "How much versus how concentrated",
        text: "Extracellular volume is closely linked to total body sodium content. Osmolality describes the number of dissolved particles relative to water. Plasma sodium concentration therefore reflects the relationship between solute and water, rather than directly measuring total sodium stores or circulating volume.",
      },
      {
        title: "Respond to low effective circulation",
        text: "Reduced renal perfusion, low NaCl delivery at the macula densa and renal sympathetic β1 stimulation can promote renin release. Angiotensin II supports vascular tone, sodium recovery, thirst and aldosterone secretion. Effective circulating volume describes how adequately the arterial circulation is filled, not merely the amount of fluid visible in tissues.",
      },
      {
        title: "Choose the hormone by the job",
        text: "Aldosterone increases distal sodium recovery and supports potassium secretion. ADH chiefly regulates collecting-duct water permeability. Increased osmolality stimulates thirst and ADH; a substantial fall in effective circulating volume can also stimulate ADH, even when osmotic signals would otherwise suppress it.",
      },
    ],
    pathway: [
      {
        title: "Volume signal",
        detail: "Low perfusion / low distal NaCl / β1 → renin",
      },
      {
        title: "Salt response",
        detail: "Angiotensin II + aldosterone support Na⁺ retention",
      },
      {
        title: "Water response",
        detail: "Osmolality and circulation influence ADH + thirst",
      },
    ],
    misconception:
      "A normal plasma sodium concentration does not prove normal extracellular volume.",
    oral: "Compare the responses to loss of isotonic fluid and loss of water in excess of solute.",
    rubric: [
      "Separate volume change from osmolality change.",
      "Connect low perfusion to renin release.",
      "Describe the osmotic stimulus for ADH and thirst.",
      "Mention non-osmotic ADH stimulation in substantial volume depletion.",
    ],
    followUp: "Why is aldosterone not interchangeable with ADH?",
    sourceSection:
      "Chapter 32: body-fluid compartments, RAAS, ADH and sodium–water balance",
  },
  {
    slug: "renal-acid-base",
    title: "Reclaim bicarbonate. Excrete acid.",
    minutes: 9,
    description:
      "Distinguish saving filtered bicarbonate from adding new bicarbonate through net acid excretion.",
    objectives: [
      "Explain filtered bicarbonate reclamation.",
      "Connect ammonium and titratable acid excretion to new bicarbonate.",
      "Distinguish alpha and beta intercalated cells.",
    ],
    sections: [
      {
        title: "Reclamation prevents a loss",
        text: "Much filtered bicarbonate is recovered in the proximal tubule. Secreted H⁺ combines with luminal bicarbonate; carbonic anhydrase supports conversion through CO₂ and water. Intracellular reactions permit bicarbonate to return to blood. Recovering filtered bicarbonate prevents its loss, but is not the same as adding new bicarbonate to the body.",
      },
      {
        title: "New bicarbonate needs net acid excretion",
        text: "Acid can leave the body buffered as ammonium or titratable acid, including phosphate-buffered H⁺. Net acid excretion is ammonium excretion plus titratable acid excretion minus urinary bicarbonate loss. Ammoniagenesis is an adaptable component of the renal response to an acid load.",
      },
      {
        title: "A final cellular choice",
        text: "Alpha intercalated cells secrete H⁺ into urine and return bicarbonate to blood. Beta intercalated cells can secrete bicarbonate. These renal adjustments complement lung regulation of CO₂, but full adaptation is slower than the immediate buffering response.",
      },
    ],
    pathway: [
      { title: "Save", detail: "Reclaim filtered HCO₃⁻" },
      {
        title: "Buffer + excrete",
        detail: "Urinary NH₄⁺ and titratable acid carry H⁺ out",
      },
      {
        title: "Net result",
        detail: "New HCO₃⁻ is associated with net acid excretion",
      },
    ],
    misconception:
      "Every secreted H⁺ does not represent net acid excretion: some is used to reclaim filtered bicarbonate.",
    oral: "Explain the difference between bicarbonate reclamation and new bicarbonate generation.",
    rubric: [
      "Describe reclamation of filtered bicarbonate.",
      "Explain why reclamation alone is not a net gain.",
      "Name ammonium and titratable acid.",
      "Subtract urinary bicarbonate loss in net acid excretion.",
    ],
    followUp:
      "Which intercalated cell secretes bicarbonate, and when is that useful?",
    sourceSection:
      "Chapter 33: bicarbonate handling, urinary buffers and net acid excretion",
  },
  {
    slug: "abg-interpretation",
    title: "How to interpret an arterial blood gas",
    minutes: 12,
    description:
      "Read pH, identify the process, then check compensation and the anion gap.",
    objectives: [
      "Distinguish acidemia from an acidosis process.",
      "Identify the primary change in simple examples.",
      "Use expected compensation to recognize a possible additional process.",
    ],
    sections: [
      {
        title: "Start with pH, but do not stop there",
        text: "For these teaching cases, the arterial pH reference interval is 7.35–7.45, PaCO₂ 35–45 mmHg and bicarbonate 22–26 mmol/L. Acidemia and alkalemia describe the measured pH. Acidosis and alkalosis describe processes: mixed processes may coexist even when pH is inside the reference interval.",
      },
      {
        title: "Read the ratio",
        text: "pH = 6.1 + log₁₀[HCO₃⁻ / (0.03 × PaCO₂)]. A primary fall in bicarbonate drives metabolic acidosis; a primary rise in CO₂ drives respiratory acidosis. The opposite changes drive alkalosis. Compensation moves pH toward the baseline; it should not be assumed simply because both measurements are abnormal.",
      },
      {
        title: "Test the explanation",
        text: "For metabolic acidosis, Winter’s formula gives an expected PaCO₂ of 1.5 × HCO₃⁻ + 8, with a ±2 mmHg range. A measured value above the range suggests an additional respiratory acidosis; below suggests an additional respiratory alkalosis. Also calculate Na⁺ − (Cl⁻ + HCO₃⁻); interpret this anion gap against the laboratory range and albumin. Neither a gap nor an ABG alone establishes a cause.",
      },
    ],
    pathway: [
      {
        title: "1 · Direction",
        detail: "pH: acidemia, alkalemia or within range?",
      },
      {
        title: "2 · Process",
        detail: "Which change in HCO₃⁻ or CO₂ explains it?",
      },
      {
        title: "3 · Check",
        detail: "Expected compensation + anion gap + context",
      },
    ],
    misconception:
      "A pH in the reference interval does not rule out a mixed acid–base disorder.",
    oral: "Walk through pH 7.29, PaCO₂ 26 mmHg and bicarbonate 12 mmol/L. Explain what you can and cannot infer.",
    rubric: [
      "Identify acidemia and a metabolic acidosis process.",
      "Calculate expected PaCO₂: 26 ±2 mmHg.",
      "Recognize measured CO₂ within the expected range.",
      "Request electrolytes, albumin and context before explaining a cause.",
    ],
    followUp:
      "If PaCO₂ were 40 mmHg with bicarbonate 12, why would that not be adequate compensation?",
    sourceSection:
      "Chapter 33: acid–base interpretation; compensation cross-check with Merck Manual",
  },
];

export type RenalQuestion = {
  id: string;
  lesson: string;
  prompt: string;
  options: { text: string; explanation: string }[];
  answer: number;
};
function q(
  id: string,
  lesson: string,
  prompt: string,
  answer: number,
  options: [string, string][],
): RenalQuestion {
  return {
    id,
    lesson,
    prompt,
    answer,
    options: options.map(([text, explanation]) => ({ text, explanation })),
  };
}
export const renalQuestions: RenalQuestion[] = [
  q(
    "r01",
    "kidney-map",
    "Which vessel carries blood away from a glomerulus?",
    1,
    [
      [
        "Afferent arteriole",
        "The afferent arteriole carries blood into the glomerulus.",
      ],
      [
        "Efferent arteriole",
        "The efferent arteriole carries blood toward the second capillary bed.",
      ],
      [
        "Collecting duct",
        "The collecting duct carries tubular fluid, not glomerular blood.",
      ],
    ],
  ),
  q(
    "r02",
    "kidney-map",
    "A solute moves from tubular fluid back into blood. What is this?",
    0,
    [
      [
        "Reabsorption",
        "Reabsorption returns filtered material to the circulation.",
      ],
      [
        "Secretion",
        "Secretion moves material in the opposite direction: blood to tubular lumen.",
      ],
      [
        "Filtration",
        "Filtration specifically moves material across the glomerular barrier into Bowman space.",
      ],
    ],
  ),
  q(
    "r03",
    "kidney-map",
    "A solute is filtered at 100 mg/min, reabsorbed at 60 mg/min and secreted at 10 mg/min. What is excreted?",
    2,
    [
      [
        "30 mg/min",
        "This subtracts secretion, but secretion adds material to urine.",
      ],
      [
        "170 mg/min",
        "Reabsorption removes material from the tubular fluid; it must be subtracted.",
      ],
      ["50 mg/min", "Excretion = 100 − 60 + 10 = 50 mg/min."],
    ],
  ),
  q(
    "r04",
    "filtration-and-clearance",
    "U = 100 mg/mL, V = 1 mL/min and P = 1 mg/mL. What is clearance?",
    1,
    [
      [
        "100 mg/min",
        "That is the excretion rate U × V, before division by plasma concentration.",
      ],
      [
        "100 mL/min",
        "C = U × V / P = 100 mL/min. Clearance has volume/time units.",
      ],
      ["1 mL/min", "That is urine flow. Clearance is a different volume rate."],
    ],
  ),
  q(
    "r05",
    "filtration-and-clearance",
    "Why does inulin clearance equal GFR under ideal conditions?",
    0,
    [
      [
        "It is freely filtered without tubular reabsorption or secretion",
        "The excreted inulin amount equals its filtered amount.",
      ],
      [
        "It is completely secreted",
        "Secretion adds to excretion and would increase clearance above GFR.",
      ],
      [
        "It is completely reabsorbed",
        "Complete reabsorption would leave no urinary inulin and its clearance would be zero.",
      ],
    ],
  ),
  q(
    "r06",
    "filtration-and-clearance",
    "GFR is 120 mL/min and RPF is 600 mL/min. What is the filtration fraction?",
    2,
    [
      ["5%", "Use GFR divided by RPF; 120/600 is 0.20."],
      ["50%", "Half the plasma flow would be 300 mL/min, not 120."],
      ["20%", "FF = 120/600 = 0.20, or 20%."],
    ],
  ),
  q(
    "r07",
    "filtration-and-clearance",
    "At low PAH concentrations, PAH clearance most closely estimates what?",
    1,
    [
      [
        "Glomerular filtration rate",
        "PAH is also secreted, so its clearance exceeds GFR.",
      ],
      [
        "Effective renal plasma flow",
        "High but incomplete extraction makes this an effective plasma-flow estimate.",
      ],
      [
        "Exact total renal blood flow",
        "It is a plasma estimate. Blood flow also requires hematocrit, and PAH extraction is incomplete.",
      ],
    ],
  ),
  q(
    "r08",
    "afferent-efferent",
    "With other determinants fixed, afferent constriction usually does what?",
    0,
    [
      [
        "Lowers renal blood flow and GFR",
        "Inlet resistance lowers flow and glomerular hydrostatic pressure.",
      ],
      [
        "Raises both renal blood flow and GFR",
        "That is the usual tendency with afferent dilation, not constriction.",
      ],
      [
        "Lowers flow but always raises GFR",
        "This confuses afferent constriction with moderate efferent constriction.",
      ],
    ],
  ),
  q(
    "r09",
    "afferent-efferent",
    "Why can moderate efferent constriction support GFR despite lower plasma flow?",
    2,
    [
      [
        "It makes the filtration barrier freely permeable to cells",
        "The effect is hemodynamic; blood cells are not normally freely filtered.",
      ],
      [
        "It lowers pressure inside the glomerulus",
        "Efferent constriction tends to raise upstream glomerular hydrostatic pressure.",
      ],
      [
        "It raises upstream glomerular hydrostatic pressure",
        "This supports filtration even as resistance reduces plasma flow.",
      ],
    ],
  ),
  q(
    "r10",
    "afferent-efferent",
    "Why can severe efferent constriction reduce GFR?",
    1,
    [
      [
        "The collecting duct stops receiving ADH",
        "ADH regulation is not the mechanism explaining this vascular effect.",
      ],
      [
        "Very low plasma flow and rising capillary oncotic pressure limit filtration",
        "The pressure benefit is overtaken by flow limitation and forces opposing filtration.",
      ],
      [
        "Filtration fraction can increase without any limit",
        "A fraction cannot exceed all incoming plasma, and filtration is physiologically constrained.",
      ],
    ],
  ),
  q(
    "r11",
    "afferent-efferent",
    "Increased NaCl delivery to the macula densa normally promotes which feedback response?",
    0,
    [
      [
        "Increased afferent tone",
        "Tubuloglomerular feedback tends to reduce filtration through afferent constrictor signaling.",
      ],
      [
        "Unconditional renin release",
        "Low NaCl delivery is a stimulus favoring renin release.",
      ],
      [
        "Direct urinary secretion of red blood cells",
        "Macula-densa feedback regulates vascular tone and renin, not red-cell secretion.",
      ],
    ],
  ),
  q(
    "r12",
    "tubular-transport",
    "Where does most bulk, approximately isosmotic sodium and water recovery occur?",
    2,
    [
      [
        "Thick ascending limb",
        "This segment reabsorbs salt with little water and dilutes tubular fluid.",
      ],
      [
        "Collecting duct",
        "The collecting duct fine-tunes the remaining fluid; it is not the main bulk recovery site.",
      ],
      [
        "Proximal tubule",
        "The proximal tubule recovers roughly two-thirds of filtered sodium and water.",
      ],
    ],
  ),
  q(
    "r13",
    "tubular-transport",
    "Which transporter is characteristic of the thick ascending limb?",
    1,
    [
      ["NCC", "NCC is characteristic of the early distal convoluted tubule."],
      [
        "NKCC2",
        "NKCC2 reabsorbs sodium, potassium and chloride in the thick ascending limb.",
      ],
      [
        "AQP2",
        "AQP2 is the ADH-regulated apical water channel in collecting-duct principal cells.",
      ],
    ],
  ),
  q(
    "r14",
    "tubular-transport",
    "Why can glucose appear in urine when its filtered load becomes large?",
    0,
    [
      [
        "Reabsorptive transport can saturate",
        "A filtered load above available transport capacity leaves glucose in tubular fluid.",
      ],
      [
        "Glucose becomes a blood cell",
        "Glucose remains a small solute; transport capacity explains the change.",
      ],
      [
        "The proximal tubule normally secretes all filtered glucose",
        "The normal proximal response is reabsorption, not complete secretion.",
      ],
    ],
  ),
  q(
    "r15",
    "tubular-transport",
    "A freely filtered solute has clearance above GFR. What does that indicate?",
    2,
    [
      [
        "Its urine must be dilute",
        "Urine concentration depends on all solutes and water, not this clearance alone.",
      ],
      ["Net reabsorption", "Net reabsorption reduces clearance below GFR."],
      ["Net secretion", "More is excreted than filtration alone supplies."],
    ],
  ),
  q(
    "r16",
    "concentrating-urine",
    "Which mechanism establishes the corticomedullary gradient?",
    1,
    [
      [
        "Countercurrent exchange alone in the vasa recta",
        "Exchange helps preserve the gradient; it does not replace loop multiplication.",
      ],
      [
        "Countercurrent multiplication in loops of Henle",
        "Loop transport builds the gradient, with urea contributing in the inner medulla.",
      ],
      [
        "AQP2 actively pumping water",
        "AQP2 is a channel and does not actively pump water.",
      ],
    ],
  ),
  q(
    "r17",
    "concentrating-urine",
    "Where does ADH act to increase apical AQP2 insertion?",
    0,
    [
      [
        "Basolateral V2 receptors on principal cells",
        "V2 → Gs → cAMP → PKA signaling promotes apical AQP2 insertion.",
      ],
      [
        "Apical V2 receptors on red blood cells",
        "The relevant receptor is basolateral on collecting-duct principal cells.",
      ],
      [
        "NCC in the early distal tubule",
        "NCC transports sodium and chloride; it is not the V2 receptor.",
      ],
    ],
  ),
  q(
    "r18",
    "concentrating-urine",
    "What can limit urine concentration despite high ADH?",
    2,
    [
      [
        "An intact, strong medullary gradient",
        "An intact gradient supports water recovery when ADH raises permeability.",
      ],
      [
        "Increased apical AQP2 availability alone",
        "More AQP2 increases permeability rather than supplying the missing driving force.",
      ],
      [
        "Loss of the medullary osmotic gradient",
        "Permeability alone cannot replace the osmotic force needed for water recovery.",
      ],
    ],
  ),
  q(
    "r19",
    "concentrating-urine",
    "Why does fluid become more dilute in the thick ascending limb?",
    1,
    [
      [
        "Water leaves faster than salt",
        "Preferential water loss would concentrate the remaining fluid.",
      ],
      [
        "Salt is recovered while water permeability is low",
        "Removing solute without equivalent water lowers tubular-fluid concentration.",
      ],
      [
        "Protein is deliberately secreted into urine",
        "Protein secretion is not the normal concentrating/diluting mechanism.",
      ],
    ],
  ),
  q(
    "r20",
    "volume-and-osmolality",
    "What does plasma sodium concentration primarily describe in this framework?",
    0,
    [
      [
        "The relationship of solute to water",
        "Concentration must be interpreted separately from total sodium content and volume.",
      ],
      [
        "Exact total-body sodium stores",
        "The same concentration can occur with different total sodium and water amounts.",
      ],
      [
        "A direct measurement of circulating blood volume",
        "Concentration is not a volume measurement.",
      ],
    ],
  ),
  q(
    "r21",
    "volume-and-osmolality",
    "Which combination favors renin release?",
    2,
    [
      [
        "High perfusion and high macula-densa NaCl",
        "These do not represent the usual low-perfusion stimulus for renin.",
      ],
      [
        "High osmolality with no other change, acting directly through AQP2",
        "AQP2 is a water channel; this confuses ADH signaling with renin regulation.",
      ],
      [
        "Low renal perfusion, low distal NaCl and sympathetic β1 stimulation",
        "These are the three classic signals supporting juxtaglomerular renin release.",
      ],
    ],
  ),
  q(
    "r22",
    "volume-and-osmolality",
    "Which pairing best distinguishes aldosterone and ADH?",
    1,
    [
      [
        "Aldosterone: AQP2 only; ADH: ENaC only",
        "The main actions are reversed in this answer.",
      ],
      [
        "Aldosterone: distal sodium recovery; ADH: regulated water permeability",
        "The hormones interact in volume regulation but have distinct principal actions.",
      ],
      [
        "Both are identical measurements of sodium concentration",
        "They are hormones with different receptors and actions, not measurements.",
      ],
    ],
  ),
  q(
    "r23",
    "renal-acid-base",
    "Does recovering filtered bicarbonate necessarily add new bicarbonate to the body?",
    0,
    [
      [
        "No; it prevents loss of existing bicarbonate",
        "Reclamation returns filtered bicarbonate. Net new bicarbonate is linked to net acid excretion.",
      ],
      [
        "Yes; every secreted H⁺ adds new bicarbonate",
        "H⁺ used to reclaim filtered bicarbonate does not represent net acid removal.",
      ],
      [
        "No; bicarbonate cannot return to blood",
        "Bicarbonate recovery into blood is a major renal function.",
      ],
    ],
  ),
  q(
    "r24",
    "renal-acid-base",
    "Which expression describes net acid excretion?",
    2,
    [
      [
        "NH₄⁺ − titratable acid + urinary HCO₃⁻",
        "Titratable acid adds to acid excretion; bicarbonate loss subtracts from it.",
      ],
      [
        "Urine volume alone",
        "Volume does not specify the amount or form of acid excreted.",
      ],
      [
        "NH₄⁺ + titratable acid − urinary HCO₃⁻",
        "Buffered acid leaving in urine adds to NAE; bicarbonate loss reduces it.",
      ],
    ],
  ),
  q(
    "r25",
    "renal-acid-base",
    "What is a key action of an alpha intercalated cell?",
    1,
    [
      [
        "Secrete bicarbonate as its defining role",
        "Bicarbonate secretion is associated with beta intercalated cells.",
      ],
      [
        "Secrete H⁺ into urine and return bicarbonate to blood",
        "Alpha intercalated cells support acid excretion.",
      ],
      [
        "Filter blood cells through the glomerulus",
        "Intercalated cells are tubular cells, not the glomerular filtration barrier.",
      ],
    ],
  ),
  q(
    "r26",
    "abg-interpretation",
    "Which statement about an arterial pH of 7.40 is correct?",
    0,
    [
      [
        "It is within range, but mixed processes can still be present",
        "Opposing acid–base processes may leave pH near the reference range.",
      ],
      [
        "It excludes every acid–base disorder",
        "pH alone does not exclude an abnormal mixture of processes.",
      ],
      [
        "It proves the kidneys are normal",
        "One pH measurement cannot establish renal function.",
      ],
    ],
  ),
  q(
    "r27",
    "abg-interpretation",
    "In metabolic acidosis with bicarbonate 12 mmol/L, what PaCO₂ range does Winter’s formula predict?",
    2,
    [
      [
        "38–42 mmHg",
        "That is near a typical baseline PaCO₂, but compensation should lower it here.",
      ],
      ["10–14 mmHg", "Winter’s formula is 1.5 × bicarbonate + 8, then ±2."],
      ["24–28 mmHg", "1.5 × 12 + 8 = 26; the expected range is 24–28 mmHg."],
    ],
  ),
  q(
    "r28",
    "abg-interpretation",
    "Bicarbonate is 12 mmol/L in metabolic acidosis, but PaCO₂ is 40 mmHg. What is suggested?",
    1,
    [
      [
        "Expected respiratory compensation",
        "Expected PaCO₂ is 24–28 mmHg, substantially below 40.",
      ],
      [
        "An additional respiratory acidosis process",
        "CO₂ is higher than expected for this degree of metabolic acidosis.",
      ],
      [
        "An additional respiratory alkalosis process",
        "That would be suggested by CO₂ below, not above, the expected range.",
      ],
    ],
  ),
  q(
    "r29",
    "abg-interpretation",
    "Na⁺ is 140, Cl⁻ 104 and HCO₃⁻ 12 mmol/L. What is the anion gap without potassium?",
    0,
    [
      [
        "24 mmol/L",
        "140 − (104 + 12) = 24. Interpret with the laboratory range and albumin.",
      ],
      [
        "48 mmol/L",
        "Subtract the sum of chloride and bicarbonate from sodium.",
      ],
      ["128 mmol/L", "This subtracts bicarbonate but omits chloride."],
    ],
  ),
  q(
    "r30",
    "abg-interpretation",
    "With constant CO₂ production, increasing alveolar ventilation tends to do what?",
    2,
    [
      [
        "Raise PaCO₂",
        "More effective ventilation removes more CO₂, lowering PaCO₂.",
      ],
      [
        "Leave PaCO₂ unchanged in every case",
        "The relationship depends on effective alveolar ventilation relative to CO₂ production.",
      ],
      [
        "Lower PaCO₂",
        "At steady CO₂ production, PaCO₂ is inversely related to alveolar ventilation.",
      ],
    ],
  ),
];
export const renalChallengeIds = ["r03", "r09", "r17", "r24", "r27"];
export const renalLessonHref = (slug: string) => `/learn/renal/${slug}`;
