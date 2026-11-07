import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { validateFigureMetadata } from "../scripts/figure-metadata-policy.mjs";
const require=createRequire(import.meta.url);
const sharp=require("sharp");

test("ovarian display metadata rejects added or altered fields", async () => {
  const metadata=await sharp("public/images/figures/ovary-cumulus-complex.jpg").metadata();
  assert.deepEqual(validateFigureMetadata("ovary-cumulus-complex",metadata),{width:1280,height:854});
  const changed=Buffer.from(metadata.exif); changed[changed.length-1]^=1;
  assert.throws(()=>validateFigureMetadata("ovary-cumulus-complex",{...metadata,exif:changed}));
  for(const field of ["iptc","xmp","icc"]) assert.throws(()=>validateFigureMetadata("ovary-cumulus-complex",{...metadata,[field]:Buffer.from("unreviewed")}));
  assert.throws(()=>validateFigureMetadata("ovary-cumulus-complex",{...metadata,orientation:6}));
  assert.throws(()=>validateFigureMetadata("another-image",metadata));
});

test("tubal source metadata permits only reviewed public fields and rejects changed bytes", async () => {
  const metadata=await sharp("public/images/figures/tubal-folded-wall.jpg").metadata();
  assert.deepEqual(validateFigureMetadata("tubal-folded-wall",metadata),{width:1527,height:1378});
  for (const field of ["exif","iptc"]) {
    const changed=Buffer.from(metadata[field]); changed[changed.length-1]^=1;
    assert.throws(()=>validateFigureMetadata("tubal-folded-wall",{...metadata,[field]:changed}));
    assert.throws(()=>validateFigureMetadata("tubal-folded-wall",{...metadata,[field]:Buffer.concat([metadata[field],Buffer.from("location")])}));
  }
  for (const field of ["xmp","icc"]) assert.throws(()=>validateFigureMetadata("tubal-folded-wall",{...metadata,[field]:Buffer.from("unreviewed")}));
  assert.throws(()=>validateFigureMetadata("tubal-folded-wall",{...metadata,orientation:6}));
  assert.throws(()=>validateFigureMetadata("another-image",metadata));
});

test("reviewed cardiac metadata preserves display while rejecting extra private fields", async () => {
  const metadata=await sharp("public/images/figures/cardiac-muscle-mallory.jpg").metadata();
  assert.deepEqual(validateFigureMetadata("cardiac-muscle-mallory",metadata),{width:3024,height:4032});
  assert.throws(()=>validateFigureMetadata("cardiac-muscle-mallory",{...metadata,exif:Buffer.concat([metadata.exif,Buffer.from("extra field")])}));
  assert.throws(()=>validateFigureMetadata("cardiac-muscle-mallory",{...metadata,xmp:Buffer.from("location")}));
  assert.throws(()=>validateFigureMetadata("cardiac-muscle-mallory",{...metadata,icc:Buffer.alloc(548)}));
  assert.throws(()=>validateFigureMetadata("another-image",metadata));
});

test("placental metadata permits only the exact reviewed orientation tag", async () => {
  const metadata=await sharp("public/images/figures/chorionic-villus-term.jpg").metadata();
  assert.deepEqual(validateFigureMetadata("placenta-term-villus",metadata),{width:4469,height:2498});
  for(const field of ["xmp","iptc","icc"]) assert.throws(()=>validateFigureMetadata("placenta-term-villus",{...metadata,[field]:Buffer.from("unreviewed")}));
  assert.throws(()=>validateFigureMetadata("placenta-term-villus",{...metadata,exif:Buffer.concat([metadata.exif,Buffer.from("extra")])}));
  assert.throws(()=>validateFigureMetadata("placenta-term-villus",{...metadata,orientation:6}));
  assert.throws(()=>validateFigureMetadata("another-image",metadata));
});
