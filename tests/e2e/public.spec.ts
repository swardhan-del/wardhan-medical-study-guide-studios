import { test, expect } from "@playwright/test";
test("public routes render and fit the viewport without runtime errors", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const route of [
    "/",
    "/library",
    "/subjects",
    "/subjects/anatomy",
    "/subjects/anatomy/musculoskeletal",
    "/subjects/anatomy/regional-anatomy",
    "/subjects/anatomy/thorax",
    "/subjects/anatomy/abdomen",
    "/subjects/anatomy/embryology",
    "/subjects/physiology",
    "/reading-list",
    "/contact",
    "/privacy",
    "/about",
  ]) {
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
  }
  expect(errors).toEqual([]);
});
test("every anatomy topic opens its own page with working source references", async ({
  page,
}, testInfo) => {
  for (const [label, slug] of [
    ["Regional anatomy", "regional-anatomy"],
    ["Thorax", "thorax"],
    ["Abdomen", "abdomen"],
    ["Musculoskeletal system", "musculoskeletal"],
    ["Embryology", "embryology"],
  ]) {
    await page.goto("/subjects/anatomy");
    await page
      .getByRole("navigation", { name: "Anatomy subject areas" })
      .getByRole("link", { name: label, exact: true })
      .click();
    await expect(page).toHaveURL(new RegExp(`/subjects/anatomy/${slug}$`), { timeout: 15000 });
    await expect(
      page.getByRole("heading", { level: 1, name: label, exact: true }),
    ).toBeVisible();
    await expect(page).toHaveURL(new RegExp(`/subjects/anatomy/${slug}$`));
    const content = page.locator(
      slug === "musculoskeletal"
        ? ".msk-page:visible"
        : ".anatomy-learning-page:visible",
    );
    const broken = await content
      .locator('a[href^="#source-"]')
      .evaluateAll((links) =>
        links
          .map((link) => link.getAttribute("href")!)
          .filter((href) => !document.getElementById(href.slice(1))),
      );
    expect(broken).toEqual([]);
    if (slug !== "musculoskeletal") {
      await content.locator(".learning-explorer").scrollIntoViewIfNeeded();
      await page.screenshot({ path: testInfo.outputPath(`${slug}.png`) });
    }
  }
});
test("anatomy recall supports correction and keeps answers when changing topics", async ({
  page,
}) => {
  await page.goto("/subjects/anatomy/thorax?topic=mediastinum");
  const panel = page.locator(".lesson-panel:visible");
  await expect(
    panel.getByRole("button", { name: "Check answer" }),
  ).toBeDisabled();
  await panel.getByRole("radio", { name: "Jugular notch", exact: true }).check();
  await panel.getByRole("button", { name: "Check answer" }).click();
  await expect(panel.getByRole("status")).toContainText("Try again.");
  await panel
    .getByRole("radio", { name: "Sternal angle", exact: true })
    .check();
  await panel.getByRole("button", { name: "Check answer" }).click();
  await expect(panel.getByRole("status")).toContainText("Correct.");
  await expect(page.locator(".learning-progress")).toContainText("1 of 15");
  await page.getByRole("button", { name: "Next topic" }).click();
  await expect(
    panel.getByRole("heading", { name: "Pleura & pleural cavity" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Previous topic" }).click();
  await expect(
    panel.getByRole("radio", { name: "Sternal angle", exact: true }),
  ).toBeChecked();
  await expect(panel.getByRole("status")).toContainText("Correct.");
  await panel.getByRole("link", { name: /^Source:/ }).click();
  await expect(page).toHaveURL(/#source-volume-i$/);
});
test("subject cards lead to subject pages and reading list survives invalid browser data", async ({
  page,
}) => {
  await page.goto("/subjects");
  await page
    .getByRole("link", { name: "Explore subject for Medical Physiology" })
    .click();
  await expect(page).toHaveURL(/\/subjects\/physiology$/);
  await page.evaluate(() =>
    localStorage.setItem("wardhan-reading-list:v1", "{invalid"),
  );
  await page.goto("/reading-list");
  await expect(page).toHaveURL(/\/study#saved-learning$/);
  await expect(page.getByText("A place for your next session.")).toBeVisible();
});
test("private review and unknown guide IDs cannot be accessed in a public build", async ({
  request,
}) => {
  for (const route of [
    "/review",
    "/review/test-anatomy",
    "/library/does-not-exist",
    "/subjects/does-not-exist",
    "/subjects/anatomy/does-not-exist",
    "/subjects/anatomy/musculoskeletal/does-not-exist",
  ])
    expect((await request.get(route)).status()).toBe(404);
  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).not.toContain("/review");
  expect(sitemap).not.toContain("/Users/");
  const response = await request.get("/");
  expect(response.headers()["x-content-type-options"]).toBe("nosniff");
  expect(response.headers()["x-robots-tag"]).toBe("noindex, nofollow");
});
test("keyboard users can skip navigation", async ({ page }) => {
  await page.goto("/library");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#main-content$/);
});
test("reading list clearing is deliberate and persists after reload", async ({
  page,
}) => {
  await page.goto("/reading-list");
  await expect(page).toHaveURL(/\/study#saved-learning$/);
  await page.evaluate(() =>
    localStorage.setItem(
      "wardhan-reading-list:v1",
      JSON.stringify(["a-saved-resource"]),
    ),
  );
  await page.reload();
  await page
    .getByRole("button", { name: "Clear reading list", exact: true })
    .click();
  await page.getByRole("button", { name: "Keep list" }).click();
  expect(
    await page.evaluate(() =>
      JSON.parse(localStorage.getItem("wardhan-reading-list:v1") ?? "[]"),
    ),
  ).toEqual(["a-saved-resource"]);
  await page
    .getByRole("button", { name: "Clear reading list", exact: true })
    .click();
  await page.getByRole("button", { name: "Yes, clear list" }).click();
  await page.reload();
  expect(
    await page.evaluate(() =>
      JSON.parse(localStorage.getItem("wardhan-reading-list:v1") ?? "[]"),
    ),
  ).toEqual([]);
});

test("renal course, lab and study pages fit both viewports", async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  for (const route of [
    "/learn/renal",
    "/learn/renal/kidney-map",
    "/learn/renal/filtration-and-clearance",
    "/learn/renal/afferent-efferent",
    "/learn/renal/tubular-transport",
    "/learn/renal/concentrating-urine",
    "/learn/renal/volume-and-osmolality",
    "/learn/renal/renal-acid-base",
    "/learn/renal/abg-interpretation",
    "/practice/renal-challenge",
    "/practice/physiology",
    "/practice/histology",
    "/practice/oral",
    "/study",
    "/study/planner",
  ]) {
    expect((await page.goto(route))?.status()).toBe(200);
    await expect(page.locator("h1")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
  await page.goto("/learn/renal");
  await page.screenshot({
    path: testInfo.outputPath("renal-course.png"),
    fullPage: true,
  });
  expect(errors).toEqual([]);
});
test("challenge saves mistakes, produces a next step and supports review after reload", async ({
  page,
}, testInfo) => {
  await page.goto("/");
  await page
    .getByRole("link", { name: /Try a five-minute renal challenge/ })
    .click();
  const quiz = page.getByRole("region", {
    name: "Your five-minute renal challenge",
  });
  await expect(
    quiz.getByRole("button", { name: "Check answer" }),
  ).toBeDisabled();
  for (let i = 0; i < 5; i++) {
    await quiz
      .getByRole("radio")
      .nth(i === 2 ? 1 : 0)
      .check();
    await quiz.getByRole("button", { name: "Check answer" }).click();
    await expect(quiz.getByRole("status")).toContainText("Correct answer:");
    await expect(quiz.getByRole("status")).toContainText("Why not");
    await quiz
      .getByRole("button", {
        name: i === 4 ? "See my results" : "Next question",
      })
      .click();
  }
  await expect(
    quiz.getByRole("heading", { name: "Here is your next step." }),
  ).toBeVisible();
  await quiz.getByRole("link", { name: "My study dashboard" }).click();
  await expect(
    page.getByRole("button", { name: "Review my mistakes (5)" }),
  ).toBeEnabled();
  await page.reload();
  await page.getByRole("button", { name: "Review my mistakes (5)" }).click();
  const review = page.getByRole("region", { name: "Your review session" });
  await review.getByRole("radio", { name: "50 mg/min", exact: true }).check();
  await review.getByRole("button", { name: "Check answer" }).click();
  await expect(review.getByRole("status")).toContainText("Correct.");
  await expect(
    page.getByRole("button", { name: "Review my mistakes (4)" }),
  ).toBeEnabled();
  await page.screenshot({
    path: testInfo.outputPath("renal-review.png"),
    fullPage: true,
  });
});
test("lesson completion persists and invalid or unavailable storage does not break quizzes", async ({
  page,
}) => {
  await page.goto("/learn/renal/kidney-map");
  await page
    .getByRole("button", { name: "Mark lesson complete", exact: true })
    .click();
  await page.reload();
  await expect(
    page.getByRole("button", { name: "✓ Lesson marked complete" }),
  ).toBeDisabled();
  await page.evaluate(() =>
    localStorage.setItem("wardhan-learning:v1", "{broken"),
  );
  await page.goto("/study");
  await expect(page.getByText("0/8", { exact: true })).toBeVisible();
  await page.addInitScript(() => {
    Object.defineProperty(Storage.prototype, "setItem", {
      value: () => {
        throw new Error("storage disabled");
      },
    });
  });
  await page.goto("/practice/renal-challenge");
  await page.getByRole("radio").first().check();
  await page.getByRole("button", { name: "Check answer" }).click();
  await expect(page.getByText(/Browser storage is unavailable/)).toBeVisible();
  await expect(page.locator(".answer-explanation")).toBeVisible();
});
test("models respond, ABG reasoning corrects mistakes and reset restores baseline", async ({
  page,
}, testInfo) => {
  await page.goto("/practice/physiology");
  const slider = page.getByRole("slider", {
    name: "Efferent resistance",
    exact: true,
  });
  await slider.focus();
  await slider.press("End");
  await expect(page.getByTestId("renal-flow")).toHaveText("67%");
  await expect(page.getByTestId("renal-pressure")).toHaveText("67");
  await page.getByRole("button", { name: "Reset resistance" }).click();
  await expect(page.getByTestId("renal-flow")).toHaveText("100%");
  const abg = page.getByRole("region", { name: "ABG interpretation exercise" });
  await abg.getByLabel("1. Describe the pH").selectOption("Acidemia");
  await abg
    .getByLabel("2. Explain the pattern")
    .selectOption("Metabolic acidosis with expected respiratory compensation");
  await abg.getByRole("button", { name: "Check interpretation" }).click();
  await expect(abg.getByRole("status")).toContainText("Both steps correct.");
  await abg.getByRole("button", { name: "Case 2", exact: true }).click();
  await abg.getByLabel("1. Describe the pH").selectOption("Acidemia");
  await abg
    .getByLabel("2. Explain the pattern")
    .selectOption("Metabolic acidosis plus respiratory acidosis");
  await abg.getByRole("button", { name: "Check interpretation" }).click();
  await expect(abg.getByRole("status")).toContainText("Both steps correct.");
  await abg.scrollIntoViewIfNeeded();
  await page.screenshot({ path: testInfo.outputPath("abg-practice.png") });
});
test("oral rubrics, histology clues and exam planning are usable", async ({
  page,
}) => {
  await page.goto("/practice/oral");
  await page
    .getByRole("textbox", { name: "My answer" })
    .fill("Blood enters the afferent arteriole; filtrate enters Bowman space.");
  await page.getByRole("button", { name: "Compare with the rubric" }).click();
  await page.getByRole("checkbox").first().check();
  await expect(
    page.getByText("1 of 4 points self-assessed.", { exact: false }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Save that I practiced this topic" })
    .click();
  await page.reload();
  await expect(page.getByRole("textbox", { name: "My answer" })).toHaveValue(/Blood enters the afferent/);
  await page.goto("/practice/histology");
  await page
    .getByLabel("My identification")
    .selectOption("Proximal convoluted tubule");
  await page.getByRole("button", { name: "Reveal the reasoning" }).click();
  await page.getByRole("button", { name: "Fuzzy apical border" }).click();
  await expect(page.locator(".histology-diagram text")).toHaveText("Fuzzy apical border");
  await page.goto("/study/planner");
  const exam = new Date();
  exam.setDate(exam.getDate() + 7);
  const day = `${exam.getFullYear()}-${String(exam.getMonth() + 1).padStart(2, "0")}-${String(exam.getDate()).padStart(2, "0")}`;
  await page.getByLabel("Exam date").fill(day);
  await page.getByRole("button", { name: "Build my plan" }).click();
  await expect(
    page.getByRole("heading", { name: "7 days until your exam" }),
  ).toBeVisible();
  await expect(page.locator(".planner-list > li")).toHaveCount(7);
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "7 days until your exam" }),
  ).toBeVisible();
});
test("public learning assets and metadata resolve without exposing source archives", async ({
  request,
}) => {
  const pdf = await request.get("/downloads/renal-revision-sheet.pdf");
  expect(pdf.status()).toBe(200);
  expect(pdf.headers()["content-type"]).toContain("application/pdf");
  expect((await pdf.body()).subarray(0, 4).toString()).toBe("%PDF");
  expect((await request.get("/learn/renal/does-not-exist")).status()).toBe(404);
  expect((await request.get("/learn/renal/opengraph-image")).status()).toBe(
    200,
  );
  const xml = await (await request.get("/sitemap.xml")).text();
  expect(xml).toContain("/learn/renal/abg-interpretation");
  expect(xml).toContain("/practice/renal-challenge");
  expect(xml).not.toContain("/study/planner");
});

test("library filters expose useful resources in every subject and retain direct topic links", async ({
  page,
}) => {
  await page.goto("/library");
  // Streaming can briefly retain a hidden copy; assert the accessible result.
  const summary = page.getByRole("status");
  await expect(summary).toHaveText("58 resources");
  for (const [subject, count] of [
    ["anatomy", 5],
    ["histology", 17],
    ["cell-biology", 7],
    ["biochemistry", 6],
    ["physiology", 17],
    ["genetics", 6],
  ] as const) {
    await page
      .getByRole("combobox", { name: "Subject", exact: true })
      .selectOption(subject);
    await expect(summary).toHaveText(`${count} resources`);
    await expect(page.locator(".resource-card")).toHaveCount(count);
  }
  await page
    .getByRole("combobox", { name: "Subject", exact: true })
    .selectOption("cell-biology");
  await page.getByRole("searchbox").fill("PCR DNA");
  await expect(summary).toHaveText("1 resource");
  await page
    .getByRole("link", {
      name: "PCR, qPCR and reverse transcription",
      exact: true,
    })
    .click();
  await expect(page.locator("h1")).toHaveText(
    "PCR, qPCR and reverse transcription",
  );
  await page.goto("/subjects/histology");
  await page
    .getByRole("heading", { name: "Reproductive histology and embryology", exact: true }).getByRole("link")
    .click();
  await expect(page).toHaveURL(/topics\/histology-development$/);
  await expect(page.locator(".catalog-browser .resource-card")).toHaveCount(3);
});

test("catalog format, empty search and pagination remain usable", async ({
  page,
}) => {
  await page.goto("/library");
  await expect(page.locator(".resource-card")).toHaveCount(18);
  await page.getByRole("button", { name: "Show more resources" }).click();
  await expect(page.locator(".resource-card")).toHaveCount(36);
  await page
    .getByRole("combobox", { name: "Format", exact: true })
    .selectOption("PDF");
  await expect(page.locator(".resource-card")).toHaveCount(1);
  await expect(
    page.getByRole("link", {
      name: "Renal physiology revision sheet",
      exact: true,
    }),
  ).toHaveAttribute("href", "/library/renal-revision-sheet");
  await page.getByRole("searchbox").fill("nonsense-unmatched");
  await expect(
    page.getByRole("heading", { name: "No matching resources." }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Clear filters", exact: true })
    .first()
    .click();
  await expect(page.getByRole("status")).toHaveText(
    "58 resources",
  );
});

test("new lesson supports explained correction, oral recall, related pages and saved reading", async ({
  page,
}, testInfo) => {
  await page.goto("/library/epithelia");
  const check = page.locator("#concept-check-title");
  await page.locator(".concept-sequence summary").nth(1).click();
  await expect(
    page.getByText(/Pseudostratified epithelium appears multilayered/),
  ).toBeVisible();
  await expect(
    check.getByRole("button", { name: "Check answer", exact: true }),
  ).toBeDisabled();
  await check.getByRole("radio").first().check();
  await check.getByRole("button", { name: "Check answer", exact: true }).click();
  await expect(check.locator(".concept-feedback")).toContainText(
    "Review the distinction.",
  );
  await expect(check.locator(".concept-feedback")).toContainText("Why not");
  await check.getByRole("button", { name: "Try without feedback" }).click();
  await check
    .getByRole("radio", {
      name: "Every cell contacts the basement membrane",
      exact: true,
    })
    .check();
  await check.getByRole("button", { name: "Check answer", exact: true }).click();
  await expect(check.locator(".concept-feedback > p").first()).toHaveText("Correct.");
  await page.getByText("Reveal a model answer", { exact: true }).click();
  await expect(
    page.getByText(/Alveoli need a short diffusion distance/),
  ).toBeVisible();
  await page.getByRole("button", { name: /Save Epithelia:/ }).click();
  await page.goto("/reading-list");
  await expect(page).toHaveURL(/\/study#saved-learning$/);
  await expect(
    page.locator("#saved-learning").getByRole("link", {
      name: "Epithelia: layers, shape and function",
      exact: true,
    }),
  ).toBeVisible();
  await page.reload();
  await page.locator("#saved-learning")
    .getByRole("link", {
      name: "Epithelia: layers, shape and function",
      exact: true,
    })
    .click();
  await page.locator(".concept-related").first().click();
  await expect(page).toHaveURL(/\/library\/cell-junctions$/);
  await page.screenshot({
    path: testInfo.outputPath("concept-lesson.png"),
    fullPage: true,
  });
});

test("cross-subject lessons render sources and fit the viewport", async ({
  page,
  request,
}, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  for (const id of [
    "placenta",
    "dna-replication",
    "enzyme-kinetics",
    "antigen-presentation",
    "cardiac-output",
  ]) {
    expect((await page.goto(`/library/${id}`))?.status()).toBe(200);
    await expect(page.locator("#lesson-source")).toContainText(
      "Source section:",
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).toContain("/library/placenta");
  expect(sitemap).toContain("/library/pcr");
  expect(sitemap).toContain("/library/renal-kidney-map");
  await page.goto("/library?subject=histology");
  await page.screenshot({
    path: testInfo.outputPath("histology-library.png"),
    fullPage: true,
  });
  expect(errors).toEqual([]);
});
