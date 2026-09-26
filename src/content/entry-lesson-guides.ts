type EntryGuide = {
  introduction: string;
  terms: [string, string][];
  comparison: { title: string; headers: string[]; rows: string[][]; caption: string; observe: string; sourceIndex: number };
};

export const entryLessonGuides: Record<string, EntryGuide> = {
  "physiology-membrane-foundations": {
    introduction: "Start with the route across the membrane, identify the energy source, then connect ion movement to voltage.",
    terms: [
      ["Permeability", "How readily a substance crosses a specified membrane under the stated conditions."],
      ["Electrochemical gradient", "The combined concentration and electrical driving forces acting on an ion."],
      ["Steady state", "A stable overall condition maintained despite continuing molecular movements and energy use."],
    ],
    comparison: {
      title: "Compare the transport pathways",
      headers: ["Pathway", "Example", "Energy relationship"],
      rows: [
        ["Simple diffusion", "Oxygen through the lipid bilayer", "Down its concentration gradient"],
        ["Facilitated diffusion", "Glucose through a GLUT carrier", "Down its concentration gradient"],
        ["Primary active transport", "Na⁺/K⁺ ATPase", "Directly coupled to ATP hydrolysis"],
        ["Secondary active transport", "Na⁺–glucose cotransport", "Coupled to the Na⁺ electrochemical gradient"],
      ],
      caption: "Classify a mechanism by both its pathway and energy coupling. Protein-mediated transport can be passive or active.",
      observe: "Compare the two glucose pathways. Explain why a carrier protein alone cannot tell you whether glucose is moving uphill.",
      sourceIndex: 0,
    },
  },
  "biochemistry-enzyme-foundations": {
    introduction: "Connect the meaning of catalysis to a simple initial-rate experiment, then distinguish kinetic measurements from cellular regulation.",
    terms: [
      ["Activation barrier", "The energetic barrier along a reaction pathway; an enzyme provides a route with a lower barrier."],
      ["Initial velocity", "The early reaction rate, measured before substantial substrate depletion or product accumulation."],
      ["Feedback inhibition", "A downstream product reduces activity at an earlier step in its own pathway."],
    ],
    comparison: {
      title: "Read an illustrative saturation series",
      headers: ["Substrate (mmol/L)", "Initial rate (µmol/min)", "Interpretation"],
      rows: [
        ["0", "0", "No substrate for the reaction"],
        ["2", "40", "At Km: half Vmax"],
        ["6", "60", "At 3 × Km: three quarters of Vmax"],
      ],
      caption: "Calculated teaching values for v = 80[S]/(2 + [S]), with Vmax = 80 µmol/min and Km = 2 mmol/L. Enzyme amount and assay conditions are fixed; these are not experimental measurements.",
      observe: "Substrate rises threefold from 2 to 6 mmol/L. Explain why the rate rises only from 40 to 60 µmol/min, then identify which quantity has concentration units.",
      sourceIndex: 1,
    },
  },
  "genetics-genome-foundations": {
    introduction: "Establish the hierarchy of DNA organisation, follow expression, then calculate inheritance using an explicitly defined model.",
    terms: [
      ["Genotype", "The alleles at a specified locus, or more broadly an individual’s genetic constitution."],
      ["Phenotype", "An observable characteristic arising from genotype, environment and their interaction."],
      ["Expression", "Production of a functional gene product through RNA synthesis and, for protein-coding genes, translation."],
    ],
    comparison: {
      title: "An autosomal recessive cross: Aa × Aa",
      headers: ["Parent 1 allele", "Parent 2: A (½)", "Parent 2: a (½)"],
      rows: [["A (½)", "AA · ¼", "Aa · ¼"], ["a (½)", "aA · ¼", "aa · ¼"]],
      caption: "Each offspring genotype shown has probability one quarter under independent Mendelian segregation. Aa and aA are the same heterozygous genotype. In this teaching model, aa is affected; AA and Aa are unaffected.",
      observe: "Count both carrier outcomes to obtain ½. Then explain why the affected probability remains ¼ after a previous affected pregnancy.",
      sourceIndex: 4,
    },
  },
  "biophysics-membrane-foundations": {
    introduction: "Specify the moving substance and the membrane first. Use a physical model only after making its assumptions explicit.",
    terms: [
      ["Net flux", "The difference between opposing transfers per unit area per unit time."],
      ["Selective permeability", "Different substances cross a membrane at different rates or may be effectively excluded."],
      ["Tonicity", "The effect of a solution on cell volume, determined by effective osmotic gradients and permeability."],
    ],
    comparison: {
      title: "Predict relative diffusion rates",
      headers: ["Area relative to A", "Thickness relative to A", "Rate relative to A"],
      rows: [["1", "1", "1 (reference A)"], ["2", "1", "2"], ["1", "2", "½"], ["2", "3", "⅔ (barrier B)"]],
      caption: "Calculated ratios for steady neutral-solute diffusion through a uniform planar layer. The diffusion coefficient and maintained concentration difference are identical in every row. All values are dimensionless ratios, not measured patient data.",
      observe: "Compare the last case with the reference. Explain why increasing area does not fully compensate for the larger increase in thickness.",
      sourceIndex: 1,
    },
  },
};
