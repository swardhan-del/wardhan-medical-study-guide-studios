import { test, expect } from "@playwright/test";

test("biophysics is native, searchable and retains practice across reloads", async ({ page }, info) => {
  const errors: string[] = [];
  page.on("pageerror", e=>errors.push(e.message));
  await page.goto("/study/biophysics");
  await expect(page.getByRole("heading",{name:"Biophysics",exact:true})).toBeVisible();
  await expect(page.getByRole("heading",{name:"36 theory lessons"})).toBeVisible();
  const browser=page.getByRole("region",{name:"Browse subject lessons"});
  await expect(browser.getByRole("status")).toHaveText("50 lessons available");
  await browser.getByLabel("Search this subject").fill("Coulter");
  await expect(browser.getByRole("status")).toHaveText("1 lesson available");
  await browser.getByRole("link",{name:"Read lesson",exact:true}).click();
  await expect(page).toHaveURL(/biophysics-practical-coulter$/);
  await page.getByRole("button",{name:/Save to My Study:/}).click();
  const check=page.locator("#concept-check-title");
  await check.getByRole("radio",{name:"Particle displaced volume",exact:true}).check();
  await check.getByRole("button",{name:"Check answer",exact:true}).click();
  await expect(check.getByRole("status")).toContainText("Correct");
  await page.reload();
  await expect(check.getByRole("radio",{name:"Particle displaced volume",exact:true})).toBeChecked();
  await expect(page.getByRole("navigation",{name:"Biophysics lesson sequence"})).toContainText("Practical lesson 11 of 14");
  expect(await page.locator('a[href*="drive.google.com"]').count()).toBe(0);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  await page.screenshot({path:info.outputPath("biophysics-lesson.png"),fullPage:true});
  expect(errors).toEqual([]);
});

test("all six models respond to keyboard input including the focal singularity", async ({ page }, info) => {
  await page.goto("/practice/biophysics");
  const lens=page.getByRole("region",{name:"Where does the image form?"});
  const distance=lens.getByRole("slider",{name:/Object distance/});
  await distance.focus(); await distance.press("Home");
  await expect(lens.locator("output")).toContainText("virtual image");
  for(let i=0;i<5;i++) await distance.press("ArrowRight");
  await expect(lens.locator("output")).toContainText("no finite image distance");
  await distance.press("End");
  await expect(lens.locator("output")).toContainText("real image");
  // Role locators exclude Next.js's hidden streamed duplicate while a page settles.
  const attenuation=page.getByRole("region",{name:"How much of the beam remains?"});
  await attenuation.getByRole("slider").focus(); await attenuation.getByRole("slider").press("End");
  await expect(attenuation.locator("output")).toContainText("1.56%");
  const membrane=page.getByRole("region",{name:"Does one time constant finish charging?"});
  await expect(membrane.locator("output")).toContainText("63.2%");
  const diffusion=page.getByRole("region",{name:"How far does random motion reach?"});
  await diffusion.getByRole("slider").focus(); await diffusion.getByRole("slider").press("End");
  await expect(diffusion.locator("output")).toContainText("80.0 μm");
  const flow=page.getByRole("region",{name:"Why does radius matter so much?"});
  await flow.getByRole("slider").focus(); await flow.getByRole("slider").press("End");
  await expect(flow.locator("output")).toContainText("16.0000");
  const ultrasound=page.getByRole("region",{name:"Turn an echo time into depth"});
  await ultrasound.getByRole("slider").focus(); await ultrasound.getByRole("slider").press("End");
  await expect(ultrasound.locator("output")).toContainText("15.40 cm");
  await ultrasound.getByText("Explain the result",{exact:true}).click();
  await expect(ultrasound).toContainText("d = ct/2");
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  await page.screenshot({path:info.outputPath("biophysics-models.png"),fullPage:true});
});

test("directory and printable revision include the new subject", async ({page})=>{
  await page.goto("/subjects/biophysics");
  await expect(page.getByRole("heading",{name:"Biophysics",exact:true})).toBeVisible();
  await page.goto("/study/biophysics/revision");
  await expect(page.getByRole("heading",{name:"Biophysics: revision notes",exact:true})).toBeVisible();
  await expect(page.locator(".revision-lesson")).toHaveCount(50);
  await expect(page.getByRole("heading",{name:"Answer key and explanation prompts"})).toBeVisible();
  expect(await page.locator('a[href*="drive.google.com"]').count()).toBe(0);
});
