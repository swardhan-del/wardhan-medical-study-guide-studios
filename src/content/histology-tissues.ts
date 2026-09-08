export const histologyTissues = [
  {
    name: "Proximal convoluted tubule",
    clue: "A dense apical brush border makes the lumen look fuzzy; cells are relatively tall and strongly stained.",
    rationale:
      "Long apical microvilli provide surface area for bulk reabsorption. Indistinct cell boundaries and a fuzzy lumen support PCT recognition in a real section.",
    features: [
      "Fuzzy apical border",
      "Tall cuboidal cells",
      "Relatively narrow lumen",
    ],
  },
  {
    name: "Distal convoluted tubule",
    clue: "A cleaner lumen, lower cells and more nuclear profiles around the lumen distinguish this view.",
    rationale:
      "DCT cells have sparse short microvilli rather than the prominent PCT brush border. The relatively open lumen is a useful clue, but should be combined with location and surrounding structures.",
    features: [
      "No prominent brush border",
      "Lower cuboidal cells",
      "Open lumen",
    ],
  },
  {
    name: "Collecting duct",
    clue: "The lumen is broad, the nuclei are central, and cell boundaries are conspicuous.",
    rationale:
      "Distinct borders and a larger lumen support collecting-duct recognition. Cells become more columnar toward the papilla. Identification in a real section requires more than one clue.",
    features: ["Distinct cell boundaries", "Central nuclei", "Broad lumen"],
  },
];
