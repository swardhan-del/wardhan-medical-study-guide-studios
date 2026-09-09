import { test, expect } from "@playwright/test";
import videos from "../../src/content/public-videos.json";
import lessons from "../../src/content/library-lessons.json";
test("genetics and immunology browse released resources without private guide links", async ({
  page,
}) => {
  for (const subject of ["genetics", "immunology"]) {
    await page.goto("/subjects/" + subject);
    await expect(page.locator('a[href*="dropbox"]')).toHaveCount(0);
    await expect(page.locator(".resource-card").first()).toBeVisible();
  }
  await page.goto("/videos");
  await expect(
    page.getByRole("heading", { name: "Video library", exact: true }),
  ).toBeVisible();
  expect(videos.records.length).toBeGreaterThan(0);
  await expect(page.getByRole("status")).toHaveText(String(videos.records.length) + " videos");
  await expect(page.getByRole("link", { name: "Watch video", exact: true })).toHaveCount(videos.records.length);
  await expect(page.locator('a[href*="dropbox"]')).toHaveCount(0);
});

test("subject sections recover from conflicting filters and open native lessons", async ({ page }) => {
  await page.goto("/study/physiology");
  const browser = page.getByRole("region", { name: "Browse subject lessons" });
  await expect(browser.getByRole("status")).toHaveText(`${lessons.lessons.filter(l => l.subject === "physiology").length} lessons available`);
  await browser.getByRole("searchbox").fill("zzzzunmatchedterm");
  await browser.getByLabel("Study format").selectOption("figures");
  await expect(browser.getByRole("status")).toHaveText("0 lessons available");
  await browser.getByLabel("Section").selectOption({ label: "Blood and haemostasis" });
  await expect(browser.getByRole("searchbox")).toHaveValue("");
  await expect(browser.getByLabel("Study format")).toHaveValue("all");
  await expect(browser.getByRole("status")).toHaveText("1 lesson available");
  await browser.getByRole("link", { name: "Read lesson", exact: true }).click();
  await expect(page).toHaveURL(/\/library\/blood-and-haemostasis$/);
  await expect(page.getByRole("button", { name: "Previous card" })).toBeDisabled();
  await page.getByRole("button", { name: "Next card" }).click();
  await expect(page.locator(".reel-counter")).toHaveText("Card 2 of 4");
  await expect(page.locator('a[href*="dropbox"]')).toHaveCount(0);
});

test("released video and audio offer captions, transcripts and conservative loading", async ({ page, request }) => {
  const video = videos.records.find(item => item.id === "recap-respiratory-mechanics")!;
  await page.goto("/videos/" + video.id);
  const player = page.locator("video:visible");
  await expect(player).toHaveAttribute("preload", "none");
  await expect(player).not.toHaveAttribute("autoplay");
  await expect(player).toHaveAttribute("controls", "");
  await expect(player.locator("track")).toHaveAttribute("src", video.captions[0].src);
  await page.getByLabel("Playback speed").selectOption("1.5");
  await expect.poll(() => player.evaluate((el: HTMLVideoElement) => el.playbackRate)).toBe(1.5);
  await page.getByText("Read transcript", { exact: true }).filter({ visible: true }).click();
  await expect(page.locator(".video-transcript:visible li")).toHaveCount(video.transcript.length);
  const captions = await request.get(video.captions[0].src);
  expect(captions.status()).toBe(200);
  expect(await captions.text()).toContain("WEBVTT");
  await page.goto("/library/respiratory-mechanics");
  const audio = page.locator("audio:visible");
  await expect(audio).toHaveAttribute("preload", "none");
  await expect(audio).not.toHaveAttribute("autoplay");
  await page.getByLabel("Audio speed").filter({ visible: true }).selectOption("1.25");
  await expect.poll(() => audio.evaluate((el: HTMLAudioElement) => el.playbackRate)).toBe(1.25);
  await page.getByText("Read audio transcript", { exact: true }).filter({ visible: true }).click();
  await expect(page.locator("#audio-recap .video-transcript li").first()).toBeVisible();
  const download = page.getByRole("link", { name: "Download audio recap" });
  await expect(download).toHaveAttribute("download", "");
  const response = await request.get((await download.getAttribute("href"))!);
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("audio/");
});
