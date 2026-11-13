import type { ReactNode } from "react";
import styles from "./anatomy-systems.module.css";

function Arrow({ from, to }: { from: [number, number]; to: [number, number] }) {
  const [x1, y1] = from, [x2, y2] = to;
  const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
  return <g className={styles.arrow}><line x1={x1} y1={y1} x2={x2} y2={y2} /><path d="M-8 -5 L0 0 L-8 5" transform={`translate(${x2} ${y2}) rotate(${angle})`} /></g>;
}

const diagrams: Record<string, ReactNode> = {
  integumentary: <>
    <path className={styles.rose} d="M28 59 Q43 49 58 58 T88 58 T118 58 T148 58 T178 58 T208 58 T238 58 T268 58 T298 58 L310 58 V92 H28Z"/>
    <path className={styles.ochre} d="M28 92 H310 V170 Q284 159 254 170 T198 170 T142 170 T86 170 T28 170Z"/>
    <path className={styles.sand} d="M28 170 Q56 159 86 170 T142 170 T198 170 T254 170 T310 170 V218 H28Z"/>
    <path className={styles.redLine} d="M45 146 C82 142 87 118 119 120 S153 151 184 150 S219 109 250 117 S273 150 295 145"/>
    <path className={styles.inkLine} d="M158 39 C151 66 158 95 167 127 M158 59 C168 73 176 101 173 126 Q166 147 158 126"/>
    {[62, 106, 150, 194, 238, 282].map(x => <ellipse key={x} className={styles.ochre} cx={x} cy="197" rx="15" ry="10"/>)}
  </>,
  skeletal: <>
    <path className={styles.sand} d="M132 21 H202 L200 65 Q200 83 217 96 Q230 116 209 131 Q194 139 174 127 Q157 143 131 133 Q106 126 117 105 Q132 89 133 69Z"/>
    <path className={styles.sand} d="M126 154 Q166 140 210 153 Q216 163 207 178 L197 192 L196 229 H143 L142 194 Q139 180 127 170Z"/>
    <path className={styles.ochre} d="M194 113 Q210 99 229 112 Q240 126 225 145 Q218 155 210 151 Q199 140 194 113Z"/>
    <path className={styles.inkLine} d="M150 41 V76 M184 41 V76 M157 190 V216 M182 190 V216"/>
  </>,
  muscular: <>
    <path className={styles.sand} d="M107 26 Q126 14 143 26 L138 123 Q139 146 148 165 Q147 192 125 199 Q99 198 96 174 Q108 151 107 124Z"/>
    <path className={styles.sand} d="M132 180 Q146 159 169 158 L265 124 Q277 129 277 142 L176 185 Q152 200 132 193Z"/>
    <path className={styles.rose} d="M125 34 Q164 57 160 100 Q152 129 141 141 Q129 129 117 102 Q110 69 125 34Z"/>
    <path className={styles.redLine} d="M141 136 Q161 164 199 160 L218 153"/>
    <path className={styles.inkLine} d="M130 50 Q144 76 139 112 M143 58 Q153 80 148 105"/>
    <path className={styles.inkLine} d="M229 181 Q237 166 233 152 M228 159 L233 152 L240 156"/>
  </>,
  nervous: <>
    <path className={styles.teal} d="M165 30 Q190 22 212 39 V135 Q186 147 163 132Z"/>
    <path className={styles.inkLine} d="M174 68 Q186 63 189 78 Q194 62 204 68 M174 104 Q186 110 189 93 Q193 109 203 104"/>
    <path className={styles.rose} d="M40 181 Q63 151 112 177 Q128 188 112 199 Q66 223 40 193Z"/>
    <path className={styles.redLine} d="M51 189 Q71 177 105 188 M59 196 Q78 190 99 196"/>
    <path className={styles.inkLine} d="M75 177 V90 Q75 86 84 86 H128 M211 111 H264 Q271 111 271 122 V186 H138"/>
    <Arrow from={[125, 86]} to={[163, 86]}/><Arrow from={[271, 132]} to={[271, 181]}/><Arrow from={[156, 186]} to={[126, 186]}/>
  </>,
  endocrine: <>
    {[49, 119, 188].map(y => <rect key={y} className={styles.teal} x="75" y={y - 19} width="79" height="38" rx="12"/>)}
    <Arrow from={[114, 69]} to={[114, 99]}/><Arrow from={[114, 139]} to={[114, 168]}/>
    <path className={styles.feedbackLine} d="M155 188 H252 V49 H160 M252 119 H160 M160 41 V57 M160 111 V127"/>
    <text className={styles.diagramText} x="144" y="88">TRH</text><text className={styles.diagramText} x="144" y="158">TSH</text>
    <text className={styles.diagramText} x="220" y="218" textAnchor="middle">Negative feedback</text>
  </>,
  cardiovascular: <>
    <rect className={styles.teal} x="34" y="53" width="76" height="58" rx="15"/>
    <rect className={styles.sand} x="212" y="53" width="78" height="58" rx="15"/>
    <rect className={styles.rose} x="212" y="143" width="78" height="58" rx="15"/>
    <rect className={styles.sand} x="34" y="143" width="76" height="58" rx="15"/>
    <Arrow from={[119, 82]} to={[202, 82]}/><Arrow from={[251, 115]} to={[251, 137]}/>
    <Arrow from={[202, 172]} to={[119, 172]}/><Arrow from={[72, 137]} to={[72, 116]}/>
  </>,
  lymphatic: <>
    {[43, 77, 111].map((x, i) => <ellipse key={x} className={styles.sand} cx={x} cy={153 + 24 * (i % 2)} rx="11" ry="9"/>)}
    <path className={styles.teal} d="M151 111 Q164 89 182 101 Q204 114 185 138 Q169 152 152 139 Q143 129 151 111Z"/>
    <path className={styles.inkLine} d="M54 120 Q57 102 83 114 L142 120 M189 113 Q221 83 254 77"/>
    <path className={styles.teal} d="M265 38 Q285 53 291 67 L322 67 V84 H288 Q271 84 252 46Z"/>
    <Arrow from={[90, 115]} to={[142, 120]}/><Arrow from={[200, 105]} to={[249, 81]}/>
  </>,
  respiratory: <>
    <path className={styles.rose} d="M134 59 Q98 55 71 92 Q45 129 54 184 Q63 209 104 193 Q133 185 143 157 V95Z M178 59 Q215 55 241 92 Q269 129 260 184 Q251 209 211 193 Q179 185 169 157 V95Z"/>
    <path className={styles.inkLine} d="M148 27 V92 L109 132 L78 148 M148 92 L199 131 L227 151 M109 132 L107 163 M199 131 L207 168 M158 27 V90 M109 132 L88 126 M199 131 L224 119"/>
    <path className={styles.inkLine} d="M227 151 Q246 157 262 169"/>
    <circle className={styles.teal} cx="278" cy="164" r="10"/><circle className={styles.teal} cx="296" cy="176" r="12"/><circle className={styles.teal} cx="274" cy="192" r="12"/>
    <path className={styles.redLine} d="M264 177 Q264 205 291 206 Q316 197 313 170"/>
    <path className={styles.inkLine} d="M144 42 H162 M144 52 H162 M144 62 H162 M144 72 H162"/>
  </>,
  digestive: <>
    <path className={styles.rose} d="M212 33 H223 V58 Q251 42 264 65 Q275 91 241 106 Q211 119 191 107 Q175 98 190 86 Q211 79 212 62Z"/>
    <path className={styles.colonLine} d="M76 192 Q66 189 67 173 L67 107 Q67 84 90 84 H167 M263 110 H277 Q288 110 288 128 V178 Q288 201 257 203 L203 204 L190 224"/>
    <path className={styles.intestineLine} d="M193 102 Q161 105 166 123 Q170 132 206 127 Q232 128 225 146 Q222 155 165 150 Q125 147 128 165 Q132 181 187 175 Q223 170 220 183 Q218 193 167 193 L83 190"/>
    <path className={styles.inkLine} d="M63 108 H74 M63 133 H74 M63 156 H74 M100 79 V90 M126 79 V90 M282 139 H294 M282 162 H294 M250 197 V209"/>
  </>,
  urinary: <>
    <path className={styles.rose} d="M73 40 C47 40 43 76 53 96 Q64 117 87 102 Q106 94 102 77 Q88 78 94 63 Q102 49 73 40Z M260 40 C286 40 290 76 280 96 Q269 117 246 102 Q227 94 231 77 Q245 78 239 63 Q231 49 260 40Z"/>
    <path className={styles.inkLine} d="M91 83 Q117 88 120 121 Q125 155 147 168 M242 83 Q215 88 212 121 Q207 155 185 168"/>
    <path className={styles.teal} d="M134 167 Q132 146 165 145 Q200 145 202 170 Q205 195 177 201 H155 Q132 194 134 167Z"/>
    <path className={styles.inkLine} d="M169 202 V238"/>
  </>,
  reproductive: <>
    <path className={styles.divider} d="M168 27 V218"/>
    <ellipse className={styles.rose} cx="80" cy="65" rx="37" ry="24"/>
    <circle className={styles.sand} cx="67" cy="61" r="6"/><circle className={styles.sand} cx="94" cy="61" r="9"/><circle className={styles.sand} cx="78" cy="77" r="5"/>
    <path className={styles.rose} d="M36 161 Q55 146 85 155 Q119 158 132 173 L121 183 Q96 171 79 171 Q57 165 38 178 L43 169Z"/>
    <ellipse className={styles.teal} cx="245" cy="65" rx="24" ry="30"/>
    <path className={styles.inkLine} d="M256 36 Q282 45 277 66 Q276 82 260 94"/>
    <path className={styles.inkLine} d="M216 182 Q236 146 263 158 Q280 166 279 181"/>
    <Arrow from={[80, 97]} to={[80, 142]}/><Arrow from={[248, 101]} to={[248, 145]}/>
  </>,
};

export function AnatomySystemDiagram({ id }: { id: string }) {
  return <svg aria-hidden="true" focusable="false" viewBox="0 0 336 250" className={styles.diagram}>
    <path className={styles.grid} d="M28 25 V225 M84 25 V225 M140 25 V225 M196 25 V225 M252 25 V225 M308 25 V225 M28 25 H308 M28 75 H308 M28 125 H308 M28 175 H308 M28 225 H308"/>
    {diagrams[id]}
  </svg>;
}
