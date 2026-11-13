import type { ReactNode } from "react";
import styles from "./anatomy-systems.module.css";

const leftLung = "M209 44 C240 36 274 63 285 103 C296 134 295 176 280 188 C261 200 223 195 200 179 C187 167 195 144 211 130 C221 120 208 110 199 108 C186 97 187 62 209 44Z";
const rightLung = "M126 43 C95 37 60 63 49 103 C38 134 41 174 55 188 C76 199 117 194 139 178 C151 165 151 137 143 121 C135 105 147 94 146 77 C145 60 137 48 126 43Z";

const pictures: Record<string, ReactNode> = {
  "heart-in-thorax": <>
    <path className={styles.rose} d={rightLung}/><path className={styles.rose} d={leftLung}/>
    <path className={styles.inkLine} d="M164 30 V68 L142 84 M168 30 V67 L194 85"/>
    <path className={styles.sand} d="M140 95 C153 84 171 91 183 105 C191 96 204 96 215 106 C235 124 229 164 215 194 C192 183 148 161 133 134 C123 118 127 104 140 95Z"/>
    <path className={styles.inkLine} d="M168 102 V84 Q166 73 178 73 Q196 73 197 92"/>
    <path className={styles.inkLine} d="M40 196 Q94 202 136 186 M236 190 Q264 201 294 196"/>
    <text className={styles.diagramText} x="29" y="29">Patient’s right</text>
    <text className={styles.diagramText} x="307" y="29" textAnchor="end">Patient’s left</text>
  </>,
  "heart-chambers": <>
    <path className={styles.teal} d="M53 56 Q99 43 143 56 V95 Q98 111 53 94Z M59 144 Q102 126 147 142 V186 Q112 211 65 189Z"/>
    <path className={styles.rose} d="M191 57 Q235 42 280 57 V94 Q236 110 191 95Z M188 142 Q233 127 280 142 V188 Q235 213 187 189Z"/>
    <path className={styles.inkLine} d="M98 101 V130 M92 123 L98 130 L104 123 M236 101 V130 M230 123 L236 130 L242 123 M104 202 V226 M98 219 L104 226 L110 219 M232 202 V226 M226 219 L232 226 L238 219"/>
    <text className={styles.diagramText} x="113" y="119">Tricuspid</text>
    <text className={styles.diagramText} x="250" y="119">Mitral</text>
    <text className={styles.diagramText} x="104" y="242" textAnchor="middle">Pulmonary valve</text>
    <text className={styles.diagramText} x="232" y="242" textAnchor="middle">Aortic valve</text>
    <text className={styles.diagramText} x="98" y="30" textAnchor="middle">From the body</text>
    <text className={styles.diagramText} x="236" y="30" textAnchor="middle">From the lungs</text>
  </>,
  "lung-lobes": <>
    <path className={styles.rose} d={rightLung}/><path className={styles.rose} d={leftLung}/>
    <path className={styles.inkLine} d="M164 30 V68 L142 84 M168 30 V67 L194 85 M49 104 Q91 106 138 113 M60 153 Q104 157 138 113 M193 149 Q233 158 281 123"/>
    <path className={styles.divider} d="M60 153 L47 140 M138 113 L146 101 M279 123 L288 110"/>
    <text className={styles.diagramText} x="33" y="27">Patient’s right</text>
    <text className={styles.diagramText} x="303" y="27" textAnchor="end">Patient’s left</text>
  </>,
  "alveolar-barrier": <>
    <path className={styles.teal} d="M76 109 C48 97 46 65 74 57 C83 35 111 32 126 44 H211 C226 32 254 35 265 57 C290 66 286 97 260 109 Q168 123 76 109Z"/>
    <path className={styles.rose} d="M55 180 Q168 162 281 180 L281 221 Q168 235 55 221Z"/>
    <path className={styles.inkLine} d="M76 133 Q168 146 260 133 M76 146 Q168 160 260 146"/>
    <path className={styles.inkLine} d="M116 89 V185 M110 177 L116 185 L122 177"/>
    <path className={styles.feedbackLine} d="M207 185 V89 M201 97 L207 89 L213 97"/>
    <text className={styles.diagramText} x="97" y="159" textAnchor="end">O₂</text>
    <text className={styles.diagramText} x="214" y="116">CO₂</text>
    <text className={styles.diagramText} x="168" y="24" textAnchor="middle">Air space</text>
    <text className={styles.diagramText} x="168" y="245" textAnchor="middle">Blood space</text>
  </>,
};

export function ThoraxModelDiagram({ view }: { view: string }) {
  return <svg aria-hidden="true" focusable="false" viewBox="0 0 336 250" className={styles.diagram}>{pictures[view]}</svg>;
}
