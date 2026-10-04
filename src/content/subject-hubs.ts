import { curriculumOrders } from './curriculum-order.ts';

const descriptions = {
  "histology": {
    "name": "Histology",
    "covers": "Cells, extracellular matrix, the four basic tissue families, organ microstructure and the interpretation of tissue sections.",
    "why": "Recognising normal microscopic organisation gives you the reference framework for understanding organ function and later pathological change.",
    "firstTitle": "Histology Foundations: The Four Basic Tissues"
  },
  "anatomy": {
    "name": "Anatomy",
    "covers": "Anatomical language, body regions, organ relationships, vessels, nerves and the development of major structures.",
    "why": "A reliable three-dimensional map helps you describe findings precisely and understand how neighbouring structures influence clinical signs.",
    "firstTitle": "Anatomy Foundations: Position, Planes and Organisation"
  },
  "physiology": {
    "name": "Physiology",
    "covers": "Membrane transport, electrical signalling, muscle, organ-system function and the feedback mechanisms that maintain the internal environment.",
    "why": "Mechanistic explanations help you predict a response to a change in conditions rather than memorise isolated normal values.",
    "firstTitle": "Physiology Foundations: Membrane Transport and Resting Potential"
  },
  "biochemistry": {
    "name": "Biochemistry",
    "covers": "Protein structure, enzyme function, metabolic pathways and the regulation of fuel and nitrogen handling.",
    "why": "Understanding molecular mechanisms makes metabolic changes and biochemical measurements easier to interpret in their physiological context.",
    "firstTitle": "Biochemistry Foundations: Enzymes, Kinetics and Regulation"
  },
  "genetics": {
    "name": "Genetics & Immunology",
    "covers": "Genome organisation, inheritance, gene expression, genetic testing and the recognition and effector mechanisms of immune responses.",
    "why": "Separate inherited information from cellular function, then apply that distinction to variation, disease mechanisms and immune-cell behaviour.",
    "firstTitle": "Genetics Foundations: Genome, Inheritance and Gene Expression"
  },
  "biophysics": {
    "name": "Biophysics",
    "covers": "Transport, membrane electricity, mechanics, optics, radiation and the physical principles behind medical measurements.",
    "why": "A physical model lets you make a quantitative prediction, check units and recognise when an assumption limits the conclusion.",
    "firstTitle": "Biophysics Foundations: Diffusion, Osmosis and Membranes"
  },
  "cell-biology": {
    "name": "Molecular & Cell Biology",
    "covers": "DNA maintenance, RNA processing, protein synthesis and targeting, cellular signalling and molecular methods.",
    "why": "Following information and molecules through a cell connects genetic instructions with the structures and mechanisms that perform a function.",
    "firstTitle": "DNA replication"
  }
};

export type SubjectHub = { name: string; covers: string; why: string; firstTitle: string; firstLesson: string; firstReason: string };
export const subjectHubs: Record<string, SubjectHub> = Object.fromEntries(
  Object.entries(descriptions).map(([subject, description]) => [subject, { ...description,
    firstLesson: curriculumOrders[subject].sampleLesson, firstReason: curriculumOrders[subject].reason,
  }]),
);

export const newEntryLessonIds = [
  'physiology-membrane-foundations', 'biochemistry-enzyme-foundations', 'genetics-genome-foundations', 'biophysics-membrane-foundations',
];
