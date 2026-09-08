import { ImageResponse } from "next/og";
import { renalLessons, renalQuestions } from "@/content/renal-course";
export const alt =
  `Renal physiology, step by step: ${renalLessons.length} lessons, ${renalQuestions.length} questions and interactive practice.`;
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
        <span>Renal physiology,</span>
        <span>step by step</span>
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 28,
          borderTop: "2px solid #1f6f70",
          paddingTop: 26,
        }}
      >
        {renalLessons.length} lessons · {renalQuestions.length} questions · Interactive practice
      </div>
    </div>,
    size,
  );
}
