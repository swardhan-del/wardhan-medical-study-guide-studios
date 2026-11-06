import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { validateFigureMetadata } from "../scripts/figure-metadata-policy.mjs";
const require=createRequire(import.meta.url);
const sharp=require("sharp");

test("reviewed cardiac metadata preserves display while rejecting extra private fields", async () => {
  const metadata=await sharp("public/images/figures/cardiac-muscle-mallory.jpg").metadata();
  assert.deepEqual(validateFigureMetadata("cardiac-muscle-mallory",metadata),{width:3024,height:4032});
  assert.throws(()=>validateFigureMetadata("cardiac-muscle-mallory",{...metadata,exif:Buffer.concat([metadata.exif,Buffer.from("extra field")])}));
  assert.throws(()=>validateFigureMetadata("cardiac-muscle-mallory",{...metadata,xmp:Buffer.from("location")}));
  assert.throws(()=>validateFigureMetadata("cardiac-muscle-mallory",{...metadata,icc:Buffer.alloc(548)}));
  assert.throws(()=>validateFigureMetadata("another-image",metadata));
});
