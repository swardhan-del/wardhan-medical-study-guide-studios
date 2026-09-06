import { ImageResponse } from "next/og";
export const alt =
  "Make the kidney make sense. Free renal physiology: 8 lessons, 30 questions, interactive practice.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        background: "#f4efe6",
        color: "#14252c",
        width: "100%",
        height: "100%",
        padding: "64px 76px",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 24,
          letterSpacing: 3,
          color: "#1f6f70",
        }}
      >
        WARDHAN MEDICAL · FREE RENAL COURSE
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          fontSize: 85,
          fontFamily: "serif",
          lineHeight: 1.05,
        }}
      >
        <span>Make the kidney</span>
        <span>make sense.</span>
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 28,
          borderTop: "2px solid #1f6f70",
          paddingTop: 26,
        }}
      >
        8 lessons · 30 questions · Interactive practice
      </div>
    </div>,
    size,
  );
}
