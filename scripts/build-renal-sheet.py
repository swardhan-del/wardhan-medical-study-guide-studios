"""Rebuild the two-page public revision sheet from original web-summary copy."""
from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT
ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'public/downloads/renal-revision-sheet.pdf'
W, H = 595.28, 841.89
ink, teal, cream = map(HexColor, ['#14252c','#1f6f70','#f4efe6'])
c=canvas.Canvas(str(OUT),pagesize=(W,H),pageCompression=1)
c.setTitle('Renal physiology - two-page revision sheet')
c.setAuthor('Wardhan Medical Study Guide Studios')
style=ParagraphStyle('body',fontName='Helvetica',fontSize=10.2,leading=15,textColor=ink)
small=ParagraphStyle('small',parent=style,fontSize=8.3,leading=11.5)
def paragraph(text,x,y,width,st=style):
 p=Paragraph(text,st); _,height=p.wrap(width,H);p.drawOn(c,x,y-height);return y-height

def header(number,title,subtitle):
 c.setFillColor(cream);c.rect(0,0,W,H,fill=1,stroke=0)
 c.setFillColor(teal);c.setFont('Helvetica-Bold',10);c.drawString(40,H-40,'WARDHAN MEDICAL  /  RENAL PHYSIOLOGY')
 c.setFillColor(ink);c.setFont('Times-Roman',28);c.drawString(40,H-80,title)
 paragraph(subtitle,40,H-98,W-80)
 c.setStrokeColor(teal);c.line(40,53,W-40,53)
 c.setFont('Helvetica',8);c.drawString(40,37,'Free learning companion | Revised 6 September 2026 | Educational use')
 c.drawRightString(W-40,37,f'{number} / 2')

def block(title,text,y):
 c.setFillColor(teal);c.setFont('Helvetica-Bold',11.5);c.drawString(40,y,title)
 return paragraph(text,40,y-13,W-80)-21
header(1,'Follow the mechanism.','Use this sheet after a lesson, then cover the answers and explain each connection aloud.')
y=H-152
y=block('01  KEEP BLOOD AND TUBULAR FLUID SEPARATE','<b>Blood:</b> afferent arteriole → glomerulus → efferent arteriole → peritubular capillaries / vasa recta.<br/><b>Filtrate:</b> Bowman space → proximal tubule → loop → distal tubule → connecting tubule → collecting system.<br/><b>Excretion = filtration - reabsorption + secretion.</b>',y)
y=block('02  CLEARANCE: ALWAYS CHECK THE UNITS','<b>C = U × V / P</b> (mL/min). Match urine and plasma concentration units.<br/><b>Filtered load = GFR × P.</b> Excretion rate = U × V.<br/><b>FF = GFR / RPF.</b> Example: 120 / 600 = 0.20 = 20%.<br/><b>RBF = RPF / (1 - hematocrit).</b> Hematocrit is a fraction, not a percentage.<br/>Inulin clearance = GFR under ideal conditions. Creatinine secretion makes measured creatinine clearance slightly overestimate GFR. Low-concentration PAH clearance approximates <b>effective</b> RPF; extraction is incomplete.',y)
y=block('03  FLOW IS NOT THE SAME AS FILTRATION','<b>Afferent constriction:</b> renal blood flow falls; glomerular pressure and GFR tend to fall.<br/><b>Moderate efferent constriction:</b> plasma flow falls; upstream pressure can support or raise GFR.<br/><b>Severe efferent constriction:</b> very low plasma flow and increasing capillary oncotic pressure can lower GFR.<br/>Myogenic stretch and high macula-densa NaCl delivery increase afferent tone.',y)
y=block('04  KNOW THE TRANSPORT LOCATION','<b>Proximal tubule:</b> bulk, approximately isosmotic sodium and water recovery; most bicarbonate and normally almost all glucose and amino acids.<br/><b>Thick ascending limb:</b> NKCC2, salt recovery with low water permeability.<br/><b>Early distal tubule:</b> NCC.<br/><b>Late distal / collecting system:</b> ENaC, regulated potassium secretion and water handling. Basolateral Na+/K+-ATPase supports transport.',y)
y=paragraph('<b>Recall:</b> Why can PAH clearance exceed inulin clearance? Why does a clearance above GFR not prove dilute urine?',40,y,W-80)
assert y>66,y
c.showPage()
header(2,'Balance water. Interpret acid-base.','Separate the driving force from the response. A number is useful only when you can explain it.')
y=H-152
y=block('05  BUILD, PRESERVE, USE THE GRADIENT','<b>Build:</b> loop countercurrent multiplication; urea contributes to the inner medulla.<br/><b>Preserve:</b> vasa recta countercurrent exchange limits solute washout.<br/><b>Use:</b> ADH → basolateral V2 receptor → cAMP / PKA → apical AQP2 insertion.<br/>Water follows the osmotic gradient. ADH raises permeability; it does not pump water.',y)
y=block('06  VOLUME AND CONCENTRATION ARE DIFFERENT','Extracellular volume relates to total sodium content; osmolality describes solute relative to water. Plasma sodium concentration does not directly measure sodium stores.<br/><b>Renin:</b> low perfusion, low distal NaCl delivery and sympathetic beta-1 stimulation.<br/><b>Aldosterone:</b> distal sodium recovery and potassium secretion.<br/><b>ADH:</b> regulated water permeability; responds to osmolality and substantial low-volume signals.',y)
y=block('07  RECLAMATION VERSUS NEW BICARBONATE','Reclaiming filtered bicarbonate prevents its loss. New bicarbonate is associated with net acid excretion.<br/><b>Net acid excretion = NH4+ + titratable acid - urinary bicarbonate.</b><br/>Alpha intercalated cells secrete H+; beta intercalated cells can secrete bicarbonate.',y)
y=block('08  ABG: DIRECTION → PROCESS → CHECK','<b>1. pH:</b> below 7.35 = acidemia; above 7.45 = alkalemia. A pH within range does not exclude mixed processes.<br/><b>2. Process:</b> low bicarbonate supports metabolic acidosis; high CO2 supports respiratory acidosis. Opposite changes support alkalosis.<br/><b>3. Compensation:</b> in metabolic acidosis, expected PaCO2 = 1.5 × HCO3- + 8 ±2 mmHg. Above the range suggests added respiratory acidosis; below suggests added respiratory alkalosis.<br/><b>4. Anion gap:</b> Na+ - (Cl- + HCO3-). Interpret with the local laboratory range, albumin and context.<br/>Example: HCO3- 12 predicts PaCO2 24-28 mmHg. A measured 40 is not adequate respiratory compensation.',y)
y=paragraph('<b>Sources and scope.</b> Adapted from the studio\'s Renal Physiology guide, Revision 15 (2 September 2026), chapters 28-33. Compensation cross-checked against Merck Manual, Acid-Base Disorders. AI-assisted educational adaptation; no independent clinical peer review is claimed. This sheet is not patient-care guidance.',40,y,W-80,small)-13
y=paragraph('<b>Continue:</b> wardhan-medical-study-guide-studios.vercel.app/learn/renal<br/>Source links, 30 explained questions and interactive practice are available in the course.',40,y,W-80,small)
assert y>63,y
c.linkURL('https://wardhan-medical-study-guide-studios.vercel.app/learn/renal',(40,y,W-40,y+26),relative=0)
c.save()
(ROOT/'output/pdf').mkdir(parents=True,exist_ok=True)
(ROOT/'output/pdf/renal-revision-sheet.pdf').write_bytes(OUT.read_bytes())
print(OUT)
