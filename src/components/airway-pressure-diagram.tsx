export function AirwayPressureDiagram() {
  return <figure className="study-panel">
    <svg viewBox="0 0 600 200" role="img" aria-label="Pressure model: atmosphere at zero centimetres of water, an open airway, and an alveolus at minus one centimetre of water. Predict airflow direction." style={{ width: "100%", height: "auto" }}>
      <rect x="20" y="40" width="170" height="115" rx="12" fill="#edf4f7" stroke="#36576a" strokeWidth="2" />
      <path d="M190 75H405 M190 125H405" fill="none" stroke="#36576a" strokeWidth="3" />
      <ellipse cx="485" cy="100" rx="90" ry="65" fill="#edf4f7" stroke="#36576a" strokeWidth="2" />
      <g fill="#163549" fontFamily="system-ui, sans-serif" fontSize="18" textAnchor="middle">
        <text x="105" y="85">Atmosphere</text><text x="105" y="118">0 cm H₂O</text>
        <text x="297" y="60">Open airway</text><text x="297" y="110">Flow direction?</text>
        <text x="485" y="85">Alveolus</text><text x="485" y="118">−1 cm H₂O</text>
      </g>
    </svg>
    <figcaption>Original teaching schematic. Pressures are relative to atmosphere; this is an idealised instant during breathing.</figcaption>
  </figure>;
}
