import { test, expect } from "@playwright/test";

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
    const map = page.locator("#coverage");
    await expect(map).toContainText("Still needs fuller lessons");
    await map.getByRole("link",{name:/^Start with/}).click();
    await expect(page).toHaveURL(/\/library\//);
    await expect(page.locator("h1")).toBeVisible();
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
  const diagram = page.getByRole("img",{name:/Pressure model:/});
  await expect(diagram).toBeVisible();
  await diagram.screenshot({path:info.outputPath("pressure-diagram.png")});
  const question=page.locator(".practice-question").filter({hasText:"What normally drives quiet expiration?"});
  await question.getByRole("radio",{name:"Elastic recoil of the lungs",exact:true}).check();
  await question.getByRole("button",{name:"Check answer",exact:true}).click();
  await expect(question.getByRole("status")).toContainText("Correct.");
  await page.reload();
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
