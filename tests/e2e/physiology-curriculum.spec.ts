import { test, expect } from "@playwright/test";
import { showAllPractice } from "./helpers/practice-view";
import AxeBuilder from "@axe-core/playwright";
import library from "../../src/content/library-lessons.json";

const lesson = library.lessons.find(item => item.id === "lymph-and-fluid-exchange")!;
const coursePath = "/learn/courses/physiology";

test("physiology Full Course reuses the released lesson, feedback and local resume", async ({ page }) => {
  await page.goto("/subjects/physiology");
  await page.getByRole("link", { name: "Full Course", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Full Course");
  await expect(page.getByRole("navigation", { name: "Course parts" }).getByRole("listitem")).toHaveCount(8);
  await page.getByRole("link", { name: "Cardiovascular Physiology", exact: true }).click();
  const cardiovascular = page.locator("#cardiovascular");
  await expect(cardiovascular.locator("details")).toHaveCount(16);
  const chapter = cardiovascular.locator("#microcirculation");
  await expect(chapter.locator("summary")).toContainText("2.7 Microcirculation and Starling Forces");
  await expect(cardiovascular.locator("#local-circulatory-control")).toContainText("No mapped lesson");
  await chapter.getByRole("link", { name: lesson.title, exact: true }).click();
  await expect(page).toHaveURL(/\/library\/lymph-and-fluid-exchange$/);
  const figure = page.locator('[data-teaching-figure="lymph-and-fluid-exchange"]:visible');
  await figure.getByText("Read a text description", { exact: true }).click();
  await expect(figure.locator("details")).toHaveAttribute("open", "");
  const check = page.locator("#concept-check-title:visible");
  await check.getByRole("radio", { name: lesson.question.options[lesson.question.answer].text, exact: true }).check();
  await check.getByRole("button", { name: /^Check (?:answer|Answer and Continue →)$/ }).click();
  await expect(check.getByRole("status")).toContainText("Correct");

  const chapterNav = page.getByRole("navigation", { name: "Full Course chapter navigation" });
  await expect(chapterNav.getByRole("link", { name: "Previous chapter: Arterial blood pressure" })).toHaveAttribute("href", coursePath + "#arterial-pressure");
  await expect(chapterNav.getByRole("link", { name: "Back to this chapter in Full Course" })).toHaveAttribute("href", coursePath + "#microcirculation");
  await page.goto(coursePath);
  await expect(page.getByRole("link", { name: "Resume: " + lesson.title })).toHaveAttribute("href", "/library/lymph-and-fluid-exchange#concept-check-title");
  await expect(chapter).toContainText("In progress");
  await page.getByRole("link", { name: "Resume: " + lesson.title }).click();
  // Resume retains the submitted explanation while the sequence continues.
  await expect(check.locator('[data-feedback="correct"]')).toContainText(lesson.question.options[lesson.question.answer].text);
  await showAllPractice(page);
  await expect(check.getByRole("radio", { name: lesson.question.options[lesson.question.answer].text, exact: true })).toBeChecked();
  await chapterNav.getByRole("link", { name: "Next chapter: Venous circulation" }).click();
  await expect(page).toHaveURL(/\/learn\/courses\/physiology#venous-circulation$/);
  await expect(page.locator("#venous-circulation").getByRole("link", { name: /^Venous return: trace a muscle pump/ })).toBeVisible();
});

test("chapter disclosures work at 320 pixels with 200% text", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 850 });
  await page.goto(coursePath);
  await page.addStyleTag({ content: "html { font-size: 200% !important; }" });
  const chapter = page.locator("#microcirculation");
  const summary = chapter.locator("summary");
  await summary.focus();
  await page.keyboard.press("Enter");
  await expect(chapter).not.toHaveAttribute("open", "");
  await page.keyboard.press("Enter");
  await expect(chapter).toHaveAttribute("open", "");
  await expect(chapter.getByRole("link", { name: lesson.title, exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
  expect((await new AxeBuilder({ page }).include("main").analyze()).violations).toEqual([]);
});


test("respiratory chapters reuse existing practice, course navigation and saved progress", async ({ page }) => {
  await page.goto(coursePath);
  await page.getByRole("navigation", { name: "Course parts" }).getByRole("link", { name: "Respiratory physiology", exact: true }).click();
  const respiratory = page.locator("#respiratory");
  await expect(respiratory.locator("details")).toHaveCount(7);
  await expect(respiratory.locator("#respiratory-gas-transport")).toContainText("No mapped lesson");
  await expect(respiratory.locator("#respiratory-acid-base").getByRole("link", { name: /^Practice:/ })).toHaveAttribute("href", "/learn/renal/renal-acid-base#lesson-quiz");

  const ventilation = respiratory.locator("#pulmonary-ventilation");
  const existingLesson = library.lessons.find(item => item.id === "respiratory-mechanics")!;
  await ventilation.getByRole("link", { name: "Practice: " + existingLesson.title, exact: true }).click();
  await expect(page).toHaveURL(/\/library\/respiratory-mechanics#concept-check-title$/);
  const check = page.locator("#concept-check-title:visible");
  await check.getByRole("radio", { name: existingLesson.question.options[existingLesson.question.answer].text, exact: true }).check();
  await check.getByRole("button", { name: /^Check (?:answer|Answer and Continue →)$/ }).click();
  await expect(check.getByRole("status")).toContainText("Correct");
  const nav = page.getByRole("navigation", { name: "Full Course chapter navigation" });
  await expect(nav.getByRole("link", { name: "Next chapter: Gas exchange" })).toHaveAttribute("href", coursePath + "#pulmonary-gas-exchange");
  await nav.getByRole("link", { name: "Back to this chapter in Full Course" }).click();
  await expect(page.getByRole("link", { name: "Resume: " + existingLesson.title })).toHaveAttribute("href", "/library/respiratory-mechanics#concept-check-title");
});
