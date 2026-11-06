import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { resolve, join } from "node:path";
import { spawnSync } from "node:child_process";

test("build audit rejects stale HTML referencing missing JavaScript or CSS", () => {
  const privateRoot = resolve(".private");
  mkdirSync(privateRoot, { recursive: true });
  const fixture = mkdtempSync(join(privateRoot, "build-assets-test-"));
  const script = resolve("scripts/check-build.mjs");
  const run = () => spawnSync(process.execPath, [script], {
    cwd: fixture, encoding: "utf8", env: { ...process.env, STUDY_BUILD_DIR: "generated" },
  });
  try {
    mkdirSync(join(fixture, "generated/server/app"), { recursive: true });
    mkdirSync(join(fixture, "generated/static/chunks"), { recursive: true });
    writeFileSync(join(fixture, "generated/server/app/index.html"),
      '<html><head><script src="/_next/static/chunks/lesson.js?v=1"></script><link rel="stylesheet" href="/_next/static/chunks/lesson.css"></head></html>');
    let result = run();
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /missing build asset: static\/chunks\/lesson\.js/);
    writeFileSync(join(fixture, "generated/static/chunks/lesson.js"), "/* lesson client */");
    result = run();
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /missing build asset: static\/chunks\/lesson\.css/);
    writeFileSync(join(fixture, "generated/static/chunks/lesson.css"), "body { color: black; }");
    result = run();
    assert.equal(result.status, 0, result.stderr);
  } finally { rmSync(fixture, { recursive: true, force: true }); }
});
