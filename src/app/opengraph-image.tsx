import { ImageResponse } from "next/og";
import { studio } from "@/content/studio";

export const alt =
  "Wardhan Medical Study Guide Studios — Focused resources for learning medical sciences.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        background: "#14252c",
        color: "#f5efe5",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "space-between",
        padding: "72px 80px",
        width: "100%",
      }}
    >
      <div
        style={{
          color: "#8dc8c1",
          display: "flex",
          fontSize: 24,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
        }}
      >
        Wardhan Medical / Studios
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div
          style={{
            display: "flex",
            fontFamily: "Georgia",
            fontSize: 72,
            lineHeight: 1.04,
            maxWidth: 950,
          }}
        >
          Wardhan Medical Study Guide Studios
        </div>
        <div style={{ color: "#d6e1dc", display: "flex", fontSize: 30 }}>
          Focused resources for learning medical sciences.
        </div>
      </div>
      <div
        style={{
          borderTop: "1px solid #5a7777",
          color: "#b7c8c0",
          display: "flex",
          fontSize: 20,
          paddingTop: 22,
        }}
      >
        Independent medical-science learning · {studio.founderName}
      </div>
    </div>,
    { ...size },
  );
}
