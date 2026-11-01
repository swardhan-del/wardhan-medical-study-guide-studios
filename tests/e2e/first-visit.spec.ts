import { showAllPractice } from "./helpers/practice-view";
import { test, expect } from "@playwright/test";
import library from "../../src/content/library-lessons.json";
import { questions } from "../../src/content/study-questions.json";
import { renalLessons } from "../../src/content/renal-course";

test("physiology entry points explain the same core and renal lesson counts", async ({ page }) => {
  const core = library.lessons.filter(lesson => lesson.subject === "physiology").length;
  const total = core + renalLessons.length;
  const detail = `${core} core introductions and ${renalLessons.length} renal course lessons`;
  await page.goto("/");
  const home = page.locator("article#physiology");
  await expect(home).toContainText(`${total} available lessons`);
  await expect(home).toContainText(detail);
  await page.goto("/start");
  const start = page.getByRole("article").filter({ has: page.getByRole("heading", { name: "Medical Physiology", exact: true }) });
  await expect(start).toContainText(`${total} available lessons: ${detail}`);
  await page.goto("/study/physiology#coverage");
  const coverage = page.locator("#coverage:visible");
  await expect(coverage).toContainText(`${total} available lessons: ${detail}`);
  await expect(coverage.getByRole("link", { name: `${renalLessons.length}-lesson renal course`, exact: false })).toHaveAttribute("href", "/learn/renal");
  await expect(coverage).toContainText("these are not additional syllabus areas");
});

test("Start Here reaches the existing guided sequence, its quiz and onward learning", async ({ page }) => {
  await page.goto("/start");
  await page.getByRole("link", { name: "Try the membrane transport sequence", exact: true }).click();
  await expect(page).toHaveURL(/\/learn\/topics\/membrane-transport$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Membrane transport");
  await expect(page.getByRole("link", { name: "Try the Knowledge Check", exact: true })).toHaveCount(4);
  await expect(page.getByRole("link", { name: "Continue into renal tubular transport", exact: true })).toHaveAttribute("href", "/learn/renal/tubular-transport");
  await page.getByRole("link", { name: "Try the Knowledge Check", exact: true }).first().click();
  await expect(page).toHaveURL(/\/library\/fluid-and-membrane-transport#concept-check-title$/);
  await expect(page.locator("#concept-check-title").getByRole("button", { name: "Check answer", exact: true })).toBeVisible();
});

test("first visit reaches each subject coverage map and a real starting lesson", async ({ page }, info) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/");
  const subjects = page.locator("section[aria-labelledby=subject-heading]:visible");
  expect(await subjects.evaluate(el => !!(el.compareDocumentPosition(document.querySelector("section[aria-labelledby=learning-heading]")!) & Node.DOCUMENT_POSITION_FOLLOWING))).toBe(true);
  await page.locator(".hero-copy").getByRole("link", {name:"Start here", exact:true}).click();
  await expect(page).toHaveURL(/\/start$/);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  await page.screenshot({path:info.outputPath("start.png"),fullPage:true});
  for (const subject of ["anatomy","histology","cell-biology","biochemistry","physiology","genetics"]) {
    await page.goto(`/study/${subject}#coverage`);
    // Next.js can retain the previous route in a hidden tree.
    const map = page.locator("#coverage:visible");
    await expect(map).toContainText(subject === "anatomy" ? "What to study alongside this course" : "Still needs fuller lessons");
    await map.getByRole("link",{name:/^Start with/}).click();
    await expect(page).toHaveURL(subject === "anatomy" ? /\/library\/anatomy-foundations$/ : /\/library\//);
    await expect(page.locator("h1:visible")).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  }
  expect(errors).toEqual([]);
});

test("recall hides the answer on every card and respiratory practice covers different mechanisms", async ({ page }, info) => {
  await page.goto("/library/respiratory-mechanics");
  const recap=page.locator("#recap");
  await expect(recap.locator("p[hidden]")).toHaveCount(1);
  await recap.getByRole("button",{name:"Reveal answer",exact:true}).click();
  await expect(recap).toContainText("During quiet inspiration");
  await recap.getByRole("button",{name:"Next card"}).click();
  await expect(recap.locator("p[hidden]")).toHaveCount(1);
  await expect(recap.getByRole("button",{name:"Reveal answer",exact:true})).toBeVisible();
  await showAllPractice(page);
  const diagram = page.getByRole("img",{name:/Pressure model:/});
  await expect(diagram).toBeVisible();
  await diagram.screenshot({path:info.outputPath("pressure-diagram.png")});
  const question=page.locator(".practice-question").filter({hasText:"What normally drives quiet expiration?"});
  await question.getByRole("radio",{name:"Elastic recoil of the lungs",exact:true}).check();
  await question.getByRole("button",{name:"Check answer",exact:true}).click();
  await expect(question.getByRole("status")).toContainText("Correct.");
  await page.reload();
  await showAllPractice(page);
  await expect(question.getByRole("radio",{name:"Elastic recoil of the lungs",exact:true})).toBeChecked();
});

test("export imports into another browser with preview, preserves local work and rejects bad files", async ({ page, browser }, info) => {
  await page.goto("/library/respiratory-mechanics");
  await page.getByRole("button",{name:/Save to My Study:/}).click();
  const question=page.locator("#concept-check-title");
  await question.getByRole("radio",{name:"4.2 L/min",exact:true}).check();
  await question.getByRole("button",{name:"Check answer",exact:true}).click();
  await page.goto("/study");
  const downloading=page.waitForEvent("download");
  await page.getByRole("button",{name:"Export progress and saved resources"}).click();
  const download=await downloading;
  const file=info.outputPath("progress.json"); await download.saveAs(file);
  const other=await browser.newContext({viewport:page.viewportSize()!});
  try {
    const target=await other.newPage(); await target.goto("http://127.0.0.1:3101/study");
    await target.getByLabel("Import a progress file").setInputFiles(file);
    await expect(target.locator("#progress-transfer")).toContainText("1 question histories");
    expect(await target.evaluate(() => JSON.parse(localStorage.getItem("wardhan-learning:v1")!).answers)).toEqual({});
    await target.getByRole("button",{name:"Merge imported progress"}).click();
    await expect(target.locator("#saved-learning")).toContainText("Ventilation: make each breath count");
    await target.reload();
    expect(await target.evaluate(() => Object.keys(JSON.parse(localStorage.getItem("wardhan-learning:v1")!).answers))).toEqual(["concept-respiratory-mechanics"]);
    await target.getByLabel("Import a progress file").setInputFiles({name:"bad.json",mimeType:"application/json",buffer:Buffer.from('{"hello":true}')});
    await expect(target.locator("#progress-transfer [role=status]")).toContainText("not a recognised");
    expect(await target.evaluate(() => Object.keys(JSON.parse(localStorage.getItem("wardhan-learning:v1")!).answers))).toHaveLength(1);
  } finally { await other.close(); }
});


test("first-visitor navigation exposes consistent subjects, printable notes and available map lessons", async ({ page }) => {
  await page.goto("/subjects");
  await expect(page.locator(".directory-subject-card")).toHaveCount(7);
  await expect(page.locator(".directory-subject-card").getByRole("heading", { name: "Genetics & Immunology", exact: true })).toBeVisible();
  await page.getByRole("searchbox", { name: "Search topics", exact: true }).fill("Regional anatomy");
  await expect(page.getByRole("link", { name: "Regional anatomy", exact: true })).toBeVisible();
  await page.getByRole("searchbox", { name: "Search topics", exact: true }).fill("Body regions");
  await expect(page.getByRole("link", { name: "Body regions and orientation", exact: true })).toBeVisible();
  await page.goto("/study/map");
  await page.getByRole("combobox", { name: "Subject", exact: true }).selectOption("biophysics");
  await expect(page.getByRole("status")).toContainText("51 topics");
  await expect(page.locator(".study-map-topics a")).toHaveCount(51);
  await page.getByRole("link", { name: "Choose an available lesson", exact: true }).click();
  await expect(page).toHaveURL(/\/library$/);
  await page.getByRole("combobox", { name: "Subject", exact: true }).selectOption("genetics-all");
  await expect(page.getByRole("status")).toContainText("10 resources");
  await page.getByRole("combobox", { name: "Subject", exact: true }).selectOption("immunology");
  await expect(page.getByRole("status")).toContainText("4 resources");
  await page.getByRole("button", { name: "Clear filters", exact: true }).click();
  await page.getByRole("combobox", { name: "Format", exact: true }).selectOption("PDF");
  await expect(page.getByText("The PDF results list downloadable files.", { exact: false })).toBeVisible();
  await page.locator("#printable-notes summary").click();
  await expect(page.getByRole("navigation", { name: "Printable revision subjects" }).getByRole("link")).toHaveCount(7);
  await page.getByRole("navigation", { name: "Printable revision subjects" }).getByRole("link", { name: "Biochemistry", exact: true }).click();
  await expect(page).toHaveURL(/\/study\/biochemistry\/revision$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("revision notes");
});

test("anatomy starts with foundations and empty subjects offer a usable next step", async ({ page }) => {
  await page.goto("/start");
  await page.getByRole("link", { name: "Start Macroscopic Anatomy & Embryology", exact: true }).click();
  await expect(page).toHaveURL(/\/library\/anatomy-foundations$/);
  await expect(page.getByRole("heading", { name: "Knowledge Check", exact: true })).toBeVisible();
  // The existing short orientation route and onward link remain available.
  await page.goto("/start/anatomy");
  await page.locator("summary").click();
  await expect(page.getByText("The coronal plane.", { exact: false })).toBeVisible();
  await page.getByRole("link", { name: /Next: identify thoracic cage/ }).click();
  await expect(page).toHaveURL(/\/library\/thoracic-cage-landmarks$/);
  await page.goto("/subjects/biostatistics");
  await expect(page.getByRole("heading", { name: "No public lessons yet" })).toBeVisible();
  await page.getByRole("link", { name: "Choose a subject with lessons", exact: true }).click();
  await expect(page).toHaveURL(/\/subjects$/);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
});

test("Molecular Cell Biology is distinct from histology and replaces the mistaken subject entry", async ({ page, request }) => {
  for (const route of ["/subjects", "/start"]) {
    await page.goto(route);
    await expect(page.locator("main")).toContainText("Molecular Cell Biology");
    await expect(page.locator("main")).not.toContainText(/microbiology/i);
  }
  await page.goto("/library");
  const select = page.getByRole("combobox", { name: "Subject", exact: true });
  await expect(select.locator('option[value="cell-biology"]')).toHaveText("Molecular Cell Biology");
  await expect(select.locator('option[value="microbiology"]')).toHaveCount(0);
  await select.selectOption("cell-biology");
  await expect(page.locator(".resource-card:visible")).toHaveCount(9);
  await page.goto("/subjects/histology");
  await expect(page.locator("h1:visible")).toContainText("Microscopic Anatomy");
  await page.goto("/subjects/cell-biology");
  await expect(page.locator("h1:visible")).toHaveText("Molecular Cell Biology");
  const old = await request.get("/subjects/microbiology", { maxRedirects: 0 });
  expect(old.status()).toBe(308);
  expect(old.headers().location).toBe("/subjects/cell-biology");
  const filter = await request.get("/library?subject=microbiology&q=RNA", { maxRedirects: 0 });
  expect(filter.status()).toBe(308);
  const destination = new URL(filter.headers().location, "http://127.0.0.1");
  expect(destination.searchParams.get("subject")).toBe("cell-biology");
  expect(destination.searchParams.get("q")).toBe("RNA");
});

test("Molecular Cell Biology starts a released sequence and gives explained question feedback", async ({ page }) => {
  await page.goto("/study/cell-biology");
  await expect(page.locator("h1:visible")).toHaveText("Molecular Cell Biology");
  const sequences = page.getByRole("region", { name: "Guided topic sequences" });
  expect(await sequences.evaluate(el => !!(el.compareDocumentPosition(document.querySelector("#subject-lessons")!) & Node.DOCUMENT_POSITION_FOLLOWING))).toBe(true);
  await sequences.getByRole("link", { name: "From RNA processing to protein delivery and quality control", exact: true }).click();
  await page.getByRole("link", { name: "Try the Knowledge Check", exact: true }).first().click();
  await expect(page).toHaveURL(/\/library\/rna-processing#concept-check-title$/);
  const q = library.lessons.find(l => l.id === "rna-processing")!.question;
  const panel = page.locator("#concept-check-title:visible");
  const wrong = q.options[(q.answer + 1) % q.options.length];
  await panel.getByRole("radio", { name: wrong.text, exact: true }).check();
  await panel.getByRole("button", { name: "Check answer", exact: true }).click();
  await expect(panel.getByRole("status")).toContainText("Review the distinction.");
  await expect(panel.getByRole("status")).toContainText(wrong.reason);
  await panel.getByRole("button", { name: "Try without feedback", exact: true }).click();
  await panel.getByRole("radio", { name: q.options[q.answer].text, exact: true }).check();
  await panel.getByRole("button", { name: "Check answer", exact: true }).click();
  await expect(panel.getByRole("status")).toContainText("Correct.");
  await page.reload();
  await expect(panel.getByRole("radio", { name: q.options[q.answer].text, exact: true })).toBeChecked();
});

// Presentation-only practice changes must preserve the published keys and history.
test("sequential practice gives positive and negative feedback before advancing and reports an honest result", async ({ page }) => {
  const id = "fluid-and-membrane-transport";
  const first = library.lessons.find(lesson => lesson.id === id)!.question;
  await page.goto(`/library/${id}#concept-check-title`);
  const sequence = page.getByRole("region", { name: "Knowledge Check sequence", exact: true });
  await expect(sequence.locator(".practice-question:visible")).toHaveCount(1);
  await expect(sequence).toContainText("Question 1 of 2");
  await expect(sequence.getByRole("button", { name: "Next question", exact: true })).toBeDisabled();
  const wrong = first.options[(first.answer + 1) % first.options.length];
  await sequence.getByRole("radio", { name: wrong.text, exact: true }).check();
  await sequence.getByRole("button", { name: "Check answer", exact: true }).click();
  const feedback = sequence.locator('[data-feedback="incorrect"]:visible');
  await expect(feedback).toContainText("Not quite.");
  await expect(feedback).toContainText(wrong.reason);
  await expect(feedback).toContainText(first.options[first.answer].text);
  await expect(sequence).toContainText("Question 1 of 2");
  await sequence.getByRole("button", { name: "Next question", exact: true }).click();
  await expect(sequence).toContainText("Question 2 of 2");
  await expect(sequence.locator(":scope > h3")).toBeFocused();
  const second = questions.find(question => question.id === "studio-apply-fluid-and-membrane-transport")!;
  await sequence.getByRole("radio", { name: second.options[second.answer].text, exact: true }).check();
  await sequence.getByRole("button", { name: "Check answer", exact: true }).click();
  await expect(sequence.locator('[data-feedback="correct"]:visible')).toContainText("Correct.");
  await sequence.getByRole("button", { name: "See my results", exact: true }).click();
  await expect(sequence.getByRole("status")).toContainText("1 correct");
  await expect(sequence.getByRole("status")).toContainText("1 incorrect");
  await expect(sequence.getByRole("status")).toContainText("0 not checked");
  await sequence.getByRole("button", { name: "Try this set again", exact: true }).click();
  await expect(sequence.locator(".concept-feedback:visible")).toHaveCount(0);
  await expect(sequence.getByRole("button", { name: "Next question", exact: true })).toBeDisabled();
  await sequence.getByRole("radio", { name: first.options[first.answer].text, exact: true }).check();
  await sequence.getByRole("button", { name: "Check answer", exact: true }).click();
  const history = await page.evaluate(() => JSON.parse(localStorage.getItem("wardhan-learning:v1")!).answers["concept-fluid-and-membrane-transport"]);
  expect(history.firstCorrect).toBe(false);
  expect(history.lastCorrect).toBe(true);
  expect(history.assisted).toBe(true);
});

test("sequential practice supports all-question revision, restored answers and direct question links", async ({ page }) => {
  const question = questions.find(item => item.id === "physiology-membrane-foundations-knowledge-1")!;
  await page.goto(`/library/physiology-membrane-foundations#question-${question.id}`);
  const sequence = page.getByRole("region", { name: "Knowledge Check sequence", exact: true });
  await expect(sequence).toContainText("Question 2 of 2");
  await expect(sequence.locator(".practice-question:visible")).toHaveCount(1);
  await sequence.getByRole("radio", { name: question.options[question.answer].text, exact: true }).check();
  await sequence.getByRole("button", { name: "Check answer", exact: true }).click();
  await page.reload();
  await expect(sequence.getByRole("radio", { name: question.options[question.answer].text, exact: true })).toBeChecked();
  await sequence.getByRole("button", { name: "Show all questions", exact: true }).click();
  await expect(sequence.locator(".practice-question:visible")).toHaveCount(2);
  await expect(sequence.getByRole("progressbar")).toHaveAttribute("value", "1");
  await sequence.getByRole("button", { name: "Show one question at a time", exact: true }).click();
  await expect(sequence.locator(".practice-question:visible")).toHaveCount(1);
  await expect(sequence.getByRole("radio", { name: question.options[question.answer].text, exact: true })).toBeChecked();
  await page.goto("/library/physiology-membrane-foundations#studio-practice");
  await expect(sequence.locator(":scope > h3")).toBeFocused();
  await expect(sequence).toContainText("Question 2 of 2");
});

test("sequential review waits for feedback, works without storage and remains keyboard accessible", async ({ page }, info) => {
  await page.addInitScript(() => {
    Object.defineProperty(Storage.prototype, "getItem", { value: () => { throw new Error("Storage blocked"); } });
    Object.defineProperty(Storage.prototype, "setItem", { value: () => { throw new Error("Storage blocked"); } });
  });
  if (info.project.name === "mobile") await page.setViewportSize({ width: 320, height: 844 });
  await page.goto("/library/fluid-and-membrane-transport#concept-check-title");
  const sequence = page.getByRole("region", { name: "Knowledge Check sequence", exact: true });
  await expect(sequence).toContainText("Storage is unavailable");
  await sequence.getByRole("radio").first().focus();
  await page.keyboard.press("Space");
  await sequence.getByRole("button", { name: "Check answer", exact: true }).focus();
  await page.keyboard.press("Enter");
  await expect(sequence.locator(".concept-feedback:visible")).toHaveCount(1);
  await sequence.getByRole("button", { name: "Next question", exact: true }).focus();
  await page.keyboard.press("Enter");
  await expect(sequence).toContainText("Question 2 of 2");
  await expect(sequence.locator(":scope > h3")).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  const { default: AxeBuilder } = await import("@axe-core/playwright");
  const scan = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(scan.violations).toEqual([]);
  await sequence.screenshot({ path: info.outputPath("sequential-practice.png") });
});

test("sequential My Study review checks a fresh answer before allowing the next question", async ({ page }) => {
  const lesson = library.lessons.find(item => item.id === "fluid-and-membrane-transport")!;
  await page.addInitScript(({ answer, other }) => {
    const attempt = { attempts: 1, correct: 0, lastCorrect: false, firstCorrect: false, lastAt: 1, dueAt: 1, lastChoice: 0, streak: 0, assisted: false };
    localStorage.setItem("wardhan-learning:v1", JSON.stringify({ version: 2, answers: {
      [answer]: attempt, [other]: attempt,
    } }));
  }, { answer: "concept-fluid-and-membrane-transport", other: "studio-apply-fluid-and-membrane-transport" });
  await page.goto("/study");
  await page.getByRole("button", { name: "Review my mistakes (2)", exact: true }).click();
  const sequence = page.getByRole("region", { name: "Your review session sequence", exact: true });
  await expect(sequence.locator(".practice-question:visible")).toHaveCount(1);
  await expect(sequence.locator(".concept-feedback:visible")).toHaveCount(0);
  await expect(sequence.getByRole("button", { name: "Next question", exact: true })).toBeDisabled();
  const first = questions.find(item => item.id === "studio-apply-fluid-and-membrane-transport")!;
  await sequence.getByRole("radio", { name: first.options[first.answer].text, exact: true }).check();
  await sequence.getByRole("button", { name: "Check answer", exact: true }).click();
  await sequence.getByRole("button", { name: "Next question", exact: true }).click();
  await expect(sequence).toContainText("Question 2 of 2");
  await expect(sequence.getByRole("radio", { name: lesson.question.options[lesson.question.answer].text, exact: true })).toBeVisible();
});
