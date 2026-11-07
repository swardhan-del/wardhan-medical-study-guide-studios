import assert from "node:assert/strict";
import { createHash } from "node:crypto";

// One reviewed photograph needs orientation and a colour profile to preserve its display.
// Exact bytes allow neither arbitrary EXIF fields nor an arbitrary ICC attachment.
const orientationOnly = Buffer.from("45786966000049492a0008000000010012010300010000000600000000000000", "hex");
const reviewedProfile = "e468e89239fc0493d5e8fb9b014e91b210c6caa73c81edf04c3d21a734f377cc";
export function validateFigureMetadata(id, metadata) {
  if (["lymphoid-spleen-detail", "lymphoid-thymus-detail"].includes(id)) {
    // Exact public creator, public archive URL and YCbCrPositioning only.
    // Full JPEG hashes remain independently pinned in the public release manifest.
    assert(!metadata.xmp && !metadata.iptc && !metadata.icc, "Unexpected lymphoid image metadata");
    assert(metadata.exif?.equals(Buffer.from("4578696600004d4d002a000000080003010e00020000001e00000032013b00020000000f00000050021300030000000100010000000000007777772e6d616e7469732e637a2f6d696b726f666f746f677261666965004a6f7365662052656973636869670000", "hex")), "Unreviewed lymphoid EXIF");
    assert.equal(metadata.orientation, undefined);
    return { width: metadata.width, height: metadata.height };
  }

  if (id === "ovary-cumulus-complex") {
    // Blank ImageDescription and YCbCrPositioning only; exact reviewed display variant.
    assert(!metadata.iptc && !metadata.xmp && !metadata.icc, "Unexpected ovarian metadata");
    assert(metadata.exif?.equals(Buffer.from("4578696600004d4d002a000000080002010e00020000000b0000002602130003000000010001000000000000202020202020202020200000", "hex")), "Unreviewed ovarian EXIF");
    assert.equal(metadata.orientation, undefined);
    return { width: metadata.width, height: metadata.height };
  }
  if (id === "tubal-folded-wall") {
    // Public source metadata reviewed in female-practical-depth-20261106.md.
    // Retain exact original bytes; any added or changed field fails this gate.
    assert(!metadata.xmp && !metadata.icc, "Unexpected tubal XMP or colour profile");
    assert.equal(metadata.exif?.length, 9500);
    assert.equal(createHash("sha256").update(metadata.exif).digest("hex"), "b22d57f3128a456c48b8c6145eb4081c99277ca344b95e84c94b258176632894", "Unreviewed tubal EXIF");
    assert.equal(metadata.iptc?.length, 26);
    assert.equal(createHash("sha256").update(metadata.iptc).digest("hex"), "d86d8d83df3d83b02194522536aa722473512f619edfc2efada89bf7dad719e0", "Unreviewed tubal IPTC container");
    assert.equal(metadata.orientation, 1);
    return { width: metadata.width, height: metadata.height };
  }
  assert(!metadata.xmp && !metadata.iptc, "Unexpected XMP or IPTC metadata");
  if (id === "placenta-term-villus") {
    // Exactly one normal-orientation tag: preserve source bytes without allowing other EXIF.
    assert(metadata.exif?.equals(Buffer.from("4578696600004d4d002a00000008000101120003000000010001000000000000", "hex")), "Placenta EXIF must contain only reviewed orientation");
    assert.equal(metadata.orientation, 1);
    assert(!metadata.icc, "Unexpected placental colour profile");
    return { width: metadata.width, height: metadata.height };
  }
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
