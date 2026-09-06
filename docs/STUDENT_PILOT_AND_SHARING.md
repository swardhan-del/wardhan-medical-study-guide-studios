# Launch the free renal course with students

## A 15-minute pilot

Ask five to eight volunteer students to use the public challenge, without coaching them through the interface. Then ask one tutor to assess explanations and answer rubrics. Do not collect patient details or require sensitive personal data.

1. Start at the homepage. Ask the student to choose a useful first action.
2. Complete the five-question renal challenge. Observe where they hesitate and whether feedback explains the misconception.
3. Follow a missed-answer link into a lesson. Ask them to explain the mechanism in their own words.
4. Open My study, review a mistake and create an exam plan.
5. Ask: “What clicked?”, “What is still confusing?”, and “Would you return tomorrow? Why?”

Record task completion, confusing wording, device/browser and the lesson involved. Separate content errors from interface friction. Do not interpret a five-question score as a validated measure of competence. Nothing in this folder sends invitations or publishes posts automatically.

## First four weeks

| Week | Publish/share | What to inspect |
| --- | --- | --- |
| 1 | Five-minute challenge and free revision sheet | Starts, completions and the first five observed student sessions |
| 2 | Afferent/efferent explanation with circuit demonstration | Lesson-to-quiz use and misconceptions reported by students |
| 3 | ADH/AQP2 location diagram and oral prompt | Return learning days and repeated difficult topics |
| 4 | ABG case showing “normal CO2” with low bicarbonate | Completion, explanation clarity and voluntary sharing |

Use Vercel Analytics to compare lesson_started with lesson_completed, and quiz_started with quiz_completed for the same set. Treat these as event ratios, not unique-student completion rates. challenge_shared measures copies, not received messages or downstream conversions. learning_day with returning=true is a browser-based return signal and cannot reconstruct a cross-device retention cohort. Search Console supplies queries, impressions and search clicks after Google begins collecting data.

## Ready-to-adapt social captions

**Challenge:** Can you explain why filtration and blood flow can move in different directions? Try five renal physiology questions, get an explanation for every option, and find your next lesson. Free, no sign-in: https://wardhan-medical-study-guide-studios.vercel.app/practice/renal-challenge

**ADH:** The location is the mechanism: ADH binds basolateral V2 receptors, while AQP2 is inserted at the apical membrane. Water follows the medullary gradient. Explore the full explanation: https://wardhan-medical-study-guide-studios.vercel.app/learn/renal/concentrating-urine

**ABG:** A PaCO2 of 40 mmHg is not always reassuring. With bicarbonate 12 mmol/L in metabolic acidosis, expected respiratory compensation is 24–28 mmHg. Work through the fictional teaching cases: https://wardhan-medical-study-guide-studios.vercel.app/practice/physiology#abg

## Three short video scripts

**1. Afferent versus efferent, 35 seconds.** Show the circuit at baseline. Ask: “What if we narrow the inlet?” Increase afferent resistance: both flow and intermediate pressure fall. Reset; increase efferent resistance: flow falls but pressure rises. Close: “Filtration also depends on opposing forces. Severe efferent constriction can lower GFR. Try the model and read the explanation.”

**2. ADH, 30 seconds.** Draw basolateral V2 on a principal cell and apical AQP2 facing the lumen. Trace ADH → cAMP/PKA → channel insertion → water movement. Close: “Permeability opens the route. The osmotic gradient supplies the driving force.” Link to the concentrating-urine lesson.

**3. The deceptively normal number, 40 seconds.** Reveal bicarbonate 12, then PaCO2 40. Calculate Winter's expected 26 ±2. Explain that 40 is higher than expected here and suggests an additional respiratory acidosis. Close with the fictional-case link, without diagnosis or treatment claims.

## Remaining owner choices

- Choose the public contact email. Set `NEXT_PUBLIC_CONTACT_EMAIL` in Vercel Production and redeploy.
- Choose a custom domain if desired; the course works on its current hostname.
- Invite the pilot volunteers and select a qualified content reviewer.
- Approve and post the captions/videos on the channels you use. No outreach has been sent.
