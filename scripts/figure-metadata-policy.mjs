import assert from "node:assert/strict";
import { createHash } from "node:crypto";

// One reviewed photograph needs orientation and a colour profile to preserve its display.
// Exact bytes allow neither arbitrary EXIF fields nor an arbitrary ICC attachment.
const orientationOnly = Buffer.from("45786966000049492a0008000000010012010300010000000600000000000000", "hex");
const reviewedProfile = "e468e89239fc0493d5e8fb9b014e91b210c6caa73c81edf04c3d21a734f377cc";
export function validateFigureMetadata(id, metadata) {
  assert(!metadata.xmp && !metadata.iptc, "Unexpected XMP or IPTC metadata");
  if (id === "cardiac-muscle-mallory") {
    assert(metadata.exif?.equals(orientationOnly), "Cardiac EXIF must contain only reviewed orientation");
    assert.equal(metadata.orientation, 6);
    assert.equal(metadata.icc?.length, 548);
    assert.equal(createHash("sha256").update(metadata.icc).digest("hex"), reviewedProfile, "Unreviewed colour profile");
    return { width: metadata.height, height: metadata.width };
  }
  assert(!metadata.exif && !metadata.icc, "Unexpected embedded metadata");
  return { width: metadata.width, height: metadata.height };
}
