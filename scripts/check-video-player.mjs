import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import assert from "node:assert/strict";
const require = createRequire(import.meta.url);
const { build } = require(
  resolve(".private/verification-tools/node_modules/esbuild"),
);
const { chromium } = require("@playwright/test");
mkdirSync(".private/player-check", { recursive: true });
const bundled = await build({
  stdin: {
    contents:
      "import React from 'react'; import { createRoot } from 'react-dom/client'; import { VideoPlayer } from './src/components/video-player'; window.mountPlayer = video => createRoot(document.getElementById('player')).render(<VideoPlayer video={video}/>);",
    resolveDir: process.cwd(),
    loader: "tsx",
  },
  bundle: true,
  write: false,
  jsx: "automatic",
  format: "iife",
});
const browser = await chromium.launch();
const results = [];
try {
  for (const width of [1440, 390]) {
    for (const silent of [false, true]) {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      let videoRequests = 0;
      await page.route("http://127.0.0.1:3199/**", (route) =>
        route.fulfill({
          contentType: route.request().url().endsWith(".svg")
            ? "image/svg+xml"
            : "text/html",
          body: route.request().url().endsWith(".svg")
            ? '<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180"><rect width="320" height="180" fill="#14252c"/></svg>'
            : '<html lang="en"><title>Player fixture</title><body>Fixture</body></html>',
        }),
      );
      await page.goto("http://127.0.0.1:3199/");
      const bytes = await page.evaluate(async (silent) => {
        const canvas = document.createElement("canvas");
        canvas.width = silent ? 180 : 320;
        canvas.height = silent ? 320 : 180;
        const ctx = canvas.getContext("2d");
        const stream = canvas.captureStream(10);
        const recorder = new MediaRecorder(stream, {
          mimeType: "video/webm;codecs=vp8",
        });
        const chunks = [];
        recorder.ondataavailable = (e) => chunks.push(e.data);
        const done = new Promise((resolve) => (recorder.onstop = resolve));
        recorder.start();
        for (let i = 0; i < 30; i++) {
          ctx.fillStyle = i % 2 ? "#274d57" : "#d4c7ab";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = "white";
          ctx.font = "20px sans-serif";
          ctx.fillText("Synthetic player test", 30, 90);
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
        recorder.stop();
        await done;
        stream.getTracks().forEach((t) => t.stop());
        return Array.from(
          new Uint8Array(
            await new Blob(chunks, { type: "video/webm" }).arrayBuffer(),
          ),
        );
      }, silent);
      writeFileSync(".private/player-check/raw.webm", Buffer.from(bytes));
      execFileSync(
        process.env.FFMPEG_PATH || "ffmpeg",
        [
          "-y",
          "-i",
          ".private/player-check/raw.webm",
          "-c",
          "copy",
          ".private/player-check/seekable.webm",
        ],
        { stdio: "pipe" },
      );
      const seekable = readFileSync(".private/player-check/seekable.webm");
      await page.route("**/media/player-test.webm", (route) =>
        (() => {
          videoRequests++;
          const range = route.request().headers().range;
          const match = range && /bytes=(\d+)-(\d*)/.exec(range);
          const start = match ? Number(match[1]) : 0;
          const end =
            match && match[2]
              ? Math.min(Number(match[2]), seekable.length - 1)
              : seekable.length - 1;
          return route.fulfill({
            status: match ? 206 : 200,
            contentType: "video/webm",
            headers: {
              "Accept-Ranges": "bytes",
              ...(match
                ? {
                    "Content-Range":
                      "bytes " + start + "-" + end + "/" + seekable.length,
                  }
                : {}),
            },
            body: seekable.subarray(start, end + 1),
          });
        })(),
      );
      await page.route("**/media/player-test.vtt", (route) =>
        route.fulfill({
          contentType: "text/vtt",
          body: "WEBVTT\n\n00:00.000 --> 00:01.000\nSynthetic caption one.\n\n00:01.000 --> 00:03.500\nSynthetic caption two.\n",
        }),
      );
      await page.setContent(
        '<html lang="en"><head><title>Player verification</title><style>body{margin:16px;font-family:Arial}video{width:100%;max-height:450px}button,select{padding:10px}li{margin:15px 0}</style></head><body><main><h1>Player verification</h1><div id="player"></div></main></body></html>',
      );
      await page.addScriptTag({ content: bundled.outputFiles[0].text });
      await page.evaluate(
        (silent) =>
          window.mountPlayer({
            id: "synthetic",
            title: "Synthetic player test",
            summary: "Control verification only",
            subject: "physiology",
            topicIds: ["physiology-renal"],
            lessonIds: ["renal-kidney-map"],
            durationSeconds: 3.5,
            width: silent ? 180 : 320,
            height: silent ? 320 : 180,
            audioContent: silent ? "silent" : "speech",
            status: "public",
            publicApproval: "Synthetic fixture only",
            medicalReview: "reviewed",
            aiGenerated: false,
            sourceUrl: "/media/player-test.webm",
            posterUrl: "/images/anatomy/mediastinal-plane.svg",
            mimeType: "video/webm",
            captions: silent
              ? []
              : [
                  {
                    src: "/media/player-test.vtt",
                    language: "en",
                    label: "English",
                  },
                ],
            transcript: [
              { startSeconds: 0, text: "Synthetic caption one." },
              { startSeconds: 1, text: "Synthetic caption two." },
            ],
          }),
        silent,
      );
      await page.locator("video").waitFor();
      await page.addStyleTag({
        content: readFileSync("src/app/globals.css", "utf8"),
      });
      assert.equal(
        videoRequests,
        0,
        "Video bytes must not load before interaction",
      );
      const descriptionLabel = silent ? "Visual description" : "Read transcript";
      await page.getByText(descriptionLabel, { exact: true }).click();
      await page
        .getByRole("button", { name: "Seek to 0:01", exact: true })
        .click();
      await page.waitForFunction(
        () => Math.abs(document.querySelector("video").currentTime - 1) < 0.2,
      );
      assert.equal(await page.locator("video").evaluate((v) => v.paused), true);
      await page.getByText(descriptionLabel, { exact: true }).click();
      assert.equal(await page.locator("video").getAttribute("preload"), "none");
      assert.equal(
        await page.locator("video").evaluate((v) => v.autoplay),
        false,
      );
      assert.equal(await page.locator("video").evaluate((v) => v.paused), true);
      await page.locator("video").evaluate((v) => v.play());
      await page.waitForFunction(
        () => document.querySelector("video").currentTime > 0.25,
      );
      // MediaRecorder WebM obtains its duration after the first complete playback.
      await page.waitForFunction(() => document.querySelector("video").ended);
      await page.locator("video").evaluate((v) => v.pause());
      await page.getByLabel("Playback speed").selectOption("1.5");
      assert.equal(
        await page.locator("video").evaluate((v) => v.playbackRate),
        1.5,
      );
      await page.getByText(descriptionLabel, { exact: true }).click();
      await page
        .getByRole("button", { name: "Seek to 0:01", exact: true })
        .click();
      console.log(
        "Seek state",
        await page.locator("video").evaluate((v) => ({
          time: v.currentTime,
          duration: v.duration,
          paused: v.paused,
          ended: v.ended,
          seekable: Array.from({ length: v.seekable.length }, (_, i) => [
            v.seekable.start(i),
            v.seekable.end(i),
          ]),
        })),
      );
      await page.waitForFunction(
        () => Math.abs(document.querySelector("video").currentTime - 1) < 0.2,
      );
      if (!silent) {
        await page.waitForFunction(
          () =>
            document.querySelector("video").textTracks[0]?.cues?.length === 2,
        );
        assert.equal(
          await page.locator("video").evaluate((v) => v.textTracks[0].mode),
          "showing",
        );
      } else {
        assert.equal(
          await page.locator("video").evaluate((v) => v.textTracks.length),
          0,
        );
        assert.equal(
          await page
            .getByText(
              "Silent video. The visual description explains the teaching content.",
            )
            .count(),
          1,
        );
      }
      await page
        .getByRole("button", { name: "Fullscreen", exact: true })
        .click();
      await page.waitForFunction(() => document.fullscreenElement !== null);
      await page.evaluate(() => document.exitFullscreen());
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        true,
      );
      await page.addScriptTag({
        path: resolve(
          ".private/verification-tools/node_modules/axe-core/axe.min.js",
        ),
      });
      const accessibility = await page.evaluate(async () =>
        (
          await window.axe.run(document, {
            runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa"] },
          })
        ).violations.map((v) => ({ id: v.id, impact: v.impact })),
      );
      assert.deepEqual(accessibility, [], "Video player accessibility");
      await page.screenshot({
        path:
          ".private/player-check/player-" +
          width +
          (silent ? "-silent" : "-speech") +
          ".png",
      });
      results.push({
        width,
        audioContent: silent ? "silent" : "speech",
        noMediaRequestBeforeInteraction: true,
        seekBeforePlayback: true,
        playback: true,
        seeking: true,
        speed: true,
        captions: silent ? "not applicable (silent clip)" : true,
        transcript: silent ? "visual description" : true,
        fullscreen: true,
        noAutoplay: true,
        preload: "none",
      });
      await page.close();
    }
  }
} finally {
  await browser.close();
}
writeFileSync(
  ".private/player-check/results.json",
  JSON.stringify(results, null, 2),
);
console.log(JSON.stringify(results));
