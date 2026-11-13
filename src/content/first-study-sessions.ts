import { anatomySystemsPath } from "./anatomy-systems.ts";

type FirstStudySession = {
  id: string;
  subject: string;
  title: string;
  objective: string;
  model: { title: string; steps: readonly string[] };
  task: string;
  worked: string;
  lesson: string;
  figure?: string;
  extension: { href: string; label: string };
  question: string;
  followUp: string;
  weeklyReview: string;
  weeklyFigure?: string;
};

export const firstSessionsPath = "/learn/first-session";
export const firstSessionHref = (subject: string) => `${firstSessionsPath}/${subject}`;

export const firstStudySessions: readonly FirstStudySession[] = [
  {
    id: "anatomy",
    subject: "Anatomy & Embryology",
    title: "Find your bearings in anatomical sections",
    objective: "Use anatomical position and section planes to describe where a structure lies.",
    model: {
      title: "From body to section",
      steps: ["Start with the person in anatomical position.", "Identify the plane of the cut.", "Check which side and viewing direction the image uses."],
    },
    task: "Imagine a cut through both shoulders that separates the front of the chest from the back. Name the plane and say which relationship gave it away.",
    worked: "This is a frontal (coronal) section. It separates anterior from posterior. A sagittal section separates right from left, and a transverse section separates superior from inferior.",
    lesson: "anatomy-foundations",
    extension: { href: anatomySystemsPath, label: "Explore all 11 anatomy system models" },
    question: "anatomy-foundations-knowledge-3",
    followUp: "anatomy-foundations-application-1",
    weeklyReview: "concept-thoracic-cage-landmarks",
    weeklyFigure: "thoracic-plane",
  },
  {
    id: "histology",
    subject: "Histology",
    title: "Identify an epithelial lining",
    objective: "Use a real micrograph to recognise the free surface and closely packed cells of a lining.",
    model: {
      title: "Follow the tissue boundary",
      steps: ["Locate a lumen or free surface.", "Trace the row of cells touching that surface.", "Find the supporting tissue on the opposite side."],
    },
    task: "In the image, trace the edge of one tubule. Which border faces its open space, and which border faces the surrounding tissue?",
    worked: "The inner border faces the lumen. The opposite border is basal. The ring of cells is a lining, and the round opening is the space it lines. The arrangement carries more information than stain colour alone.",
    lesson: "histology-foundations-tissues",
    figure: "cuboidal-section",
    extension: { href: "/learn/visual-studio", label: "Compare tissues in the visual studio" },
    question: "histology-foundations-tissues-retrieval-2",
    followUp: "histology-foundations-tissues-transfer-1",
    weeklyReview: "epithelia-transfer-2",
    weeklyFigure: "squamous-section",
  },
  {
    id: "cell-biology",
    subject: "Molecular Cell Biology",
    title: "Trace a protein through the cell",
    objective: "Follow a typical secretory protein through the ER, Golgi and transport vesicles.",
    model: {
      title: "A typical secretory route",
      steps: ["The protein enters the endoplasmic reticulum (ER) as it is made.", "It moves through the Golgi, where cargo can be modified and sorted.", "A vesicle delivers it to its destination."],
    },
    task: "A protein enters the ER normally but never reaches the Golgi. Name one downstream step the protein cannot complete along the route shown.",
    worked: "For this route, the protein cannot be sorted at the Golgi into a vesicle destined for secretion. Identify the earliest interrupted step before predicting a downstream consequence.",
    lesson: "protein-trafficking",
    extension: { href: "/study/cell-biology", label: "See the Molecular Cell Biology learning path" },
    question: "concept-protein-trafficking",
    followUp: "concept-lysosomal-m6p-tag-receptor-recycling",
    weeklyReview: "concept-peroxisome-pts1-pex5-cargo",
  },
  {
    id: "biochemistry",
    subject: "Biochemistry",
    title: "Read an enzyme-rate curve",
    objective: "Use half the maximum initial rate to interpret the Michaelis constant in a simple assay.",
    model: {
      title: "Read from rate to substrate concentration",
      steps: ["Find the limiting initial rate, Vmax, which the curve approaches.", "Locate half that rate on the vertical axis.", "Read across to the curve, then down to find Km."],
    },
    task: "A Michaelis–Menten curve has Vmax of 80 µmol/min and reaches 40 µmol/min at 2 mmol/L substrate. Identify Km and its units.",
    worked: "Km is 2 mmol/L. The 40 µmol/min value tells you where to look on the rate axis. Km is the corresponding substrate concentration, so its units are mmol/L.",
    lesson: "biochemistry-enzyme-foundations",
    extension: { href: "/library/enzyme-kinetics", label: "Study the full enzyme kinetics worked lesson" },
    question: "concept-biochemistry-enzyme-foundations",
    followUp: "biochemistry-enzyme-foundations-application-2",
    weeklyReview: "biochemistry-enzyme-foundations-application-1",
  },
  {
    id: "physiology",
    subject: "Medical Physiology",
    title: "Predict how a substance crosses a membrane",
    objective: "Use direction, a membrane protein and the energy source to distinguish transport mechanisms.",
    model: {
      title: "Three checks for a transport mechanism",
      steps: ["Identify the transported substance and its gradient.", "Check whether a membrane protein carries it.", "Look for ATP use or coupling to the movement of another substance."],
    },
    task: "A sodium–glucose carrier moves glucose uphill by allowing sodium to move down its electrochemical gradient. Where does the energy come from?",
    worked: "The carrier uses energy stored in the sodium gradient. The sodium–potassium pump helps maintain that gradient by using ATP. The glucose carrier’s coupling step is secondary active transport.",
    lesson: "physiology-membrane-foundations",
    extension: { href: "/learn/topics/membrane-transport", label: "Follow the guided membrane transport sequence" },
    question: "concept-physiology-membrane-foundations",
    followUp: "physiology-membrane-foundations-application-1",
    weeklyReview: "concept-fluid-and-membrane-transport",
  },
  {
    id: "genetics",
    subject: "Genetics",
    title: "Reason through an inheritance cross",
    objective: "Count possible genotypes and identify the group your probability refers to.",
    model: {
      title: "Count outcomes before and after new information",
      steps: ["Write down the possible alleles from each parent.", "Combine them and count equally likely outcomes.", "If a phenotype is given, restrict the denominator to matching outcomes."],
    },
    task: "For an Aa × Aa cross, write the four outcomes. Assume aa alone produces the recessive trait. How many of the four outcomes are unaffected?",
    worked: "The outcomes are AA, Aa, Aa and aa. Three of the four are unaffected. The two Aa outcomes represent different parental contributions, so count both.",
    lesson: "genetics-genome-foundations",
    extension: { href: "/library/inheritance", label: "Work through the inheritance lesson" },
    question: "genetics-genome-foundations-application-1",
    followUp: "concept-recessive-conditional-probability",
    weeklyReview: "concept-allele-and-genotype-counts",
  },
  {
    id: "biophysics",
    subject: "Biophysics",
    title: "Predict what slows diffusion",
    objective: "Use a steady-transfer model to predict how barrier area and thickness affect total rate.",
    model: {
      title: "Compare two barriers",
      steps: ["Write the model: rate = D × A × Δc / L.", "Name what changes and what stays fixed.", "Compare the new rate with the original rate."],
    },
    task: "Suppose the available area triples and the barrier thickness also triples. The coefficient and concentration difference stay fixed. Predict the new total rate.",
    worked: "The total rate is unchanged because the area and thickness each contribute a factor of three, one in the numerator and one in the denominator. The rate per unit area decreases.",
    lesson: "biophysics-membrane-foundations",
    extension: { href: "/practice/biophysics", label: "Try the interactive biophysics models" },
    question: "biophysics-membrane-foundations-knowledge-1",
    followUp: "studio-diffusion-rate-versus-time",
    weeklyReview: "studio-diffusion-simultaneous-factors",
  },
  {
    id: "biostatistics",
    subject: "Biostatistics",
    title: "Turn a short dataset into a histogram",
    objective: "Sort observations into non-overlapping bins and check that each observation is counted once.",
    model: {
      title: "Build a frequency display",
      steps: ["Read each bin’s included and excluded endpoints.", "Assign every observation to one bin.", "Check the bin counts against the number of observations."],
    },
    task: "Sort 1, 2, 3, 5 and 7 into the bins [0, 3), [3, 6) and [6, 9). Square brackets include the endpoint and round brackets exclude it.",
    worked: "The counts are 2, 2 and 1. The first bin contains 1 and 2. The second contains 3 and 5. The last contains 7. The counts add back to five observations.",
    lesson: "histogram-bin-counts-example",
    extension: { href: "/subjects/biostatistics", label: "Explore the Biostatistics subject directory" },
    question: "concept-histogram-bin-counts-example",
    followUp: "concept-mean-median-extreme-value-comparison",
    weeklyReview: "concept-cohort-case-control-denominators",
  },
  {
    id: "immunology",
    subject: "Immunology",
    title: "Connect antigen recognition to a T-cell response",
    objective: "Follow how dendritic cells present antigen and help activate naive T cells.",
    model: {
      title: "From encounter to recognition",
      steps: ["A dendritic cell encounters material in a tissue.", "The cell displays antigen-derived peptides on MHC molecules.", "A matching naive T cell can be activated when the required signals are present."],
    },
    task: "A dendritic cell displays a peptide to a matching naive T cell. Why is recognition alone insufficient to conclude that the T cell will be activated?",
    worked: "Naive T-cell activation also depends on other signals, including co-stimulation. Seeing a matching peptide–MHC complex answers the recognition question and leaves the activation conditions to check.",
    lesson: "innate-adaptive",
    extension: { href: "/subjects/immunology", label: "Explore the Immunology subject directory" },
    question: "concept-innate-adaptive",
    followUp: "concept-antigen-presentation",
    weeklyReview: "tcell-controlled-input",
  },
  {
    id: "histology-ii",
    subject: "Histology II",
    title: "Recognise myelinated nerve fibres in section",
    objective: "Use the cutting plane to interpret nerve-fibre profiles and connect them with their supporting cells.",
    model: {
      title: "One fibre, two section views",
      steps: ["Imagine a long nerve fibre as a cylinder.", "Cut across its axis to see a round profile.", "Cut along its axis to see an elongated profile."],
    },
    task: "A peripheral nerve section shows many elongated fibre profiles. Predict the likely orientation of the cut and name the cell that forms myelin in a peripheral nerve.",
    worked: "Elongated profiles support a longitudinal or oblique cut. In the peripheral nervous system, Schwann cells form myelin. The profile shape alone describes geometry, so use the surrounding architecture and specimen context to identify a nerve.",
    lesson: "myelin-and-glial-cells",
    figure: "peripheral-nerve-longitudinal",
    extension: { href: "/subjects/histology-ii", label: "Explore the Histology II subject directory" },
    question: "concept-myelin-and-glial-cells",
    followUp: "nerve-practical-01",
    weeklyReview: "nerve-practical-05",
  },
];

export function firstSessionFor(subject: string) {
  const sessionId = subject === "histology-i" ? "histology" : subject;
  return firstStudySessions.find(session => session.id === sessionId);
}
