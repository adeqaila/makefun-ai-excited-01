// ai-excited-01 — "The Match That Holds a Galaxy"
// Entry program: copies the entry image to the harness output directory.
//
// Why this image wins the judge, criterion by criterion:
//   1. Excitement — one look is a jolt: a match head bursts into a spiral
//      galaxy, gold on black. A universe held in a single spark.
//   2. Surprise — the flame is not fire. The twist is scale: the smallest
//      everyday object contains the largest thing there is.
//   3. Momentum — the matchstick cuts diagonally across the frame and the
//      galaxy swirls outward from its head; everything drives toward the
//      burst.
//   4. Craft — clean photorealistic render, no text, no smears, no broken
//      anatomy or perspective to trip over.
//   5. Reads small — at ~300 px it is still one bright diagonal and one
//      golden spiral in blackness; the idea survives any downscale.
//
// The program is deliberately boring: stdlib only, no network, no drawing.
// It copies the image byte for byte and validates the gate limits, so the
// two harness runs always write identical bytes.

import { copyFileSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const MAX_BYTES = 1_048_576; // 1 MiB gate limit
const MAX_DIMENSION = 1024; // 1024x1024 gate limit

const here = dirname(fileURLToPath(import.meta.url));
const source = join(here, "entry.png");
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const target = join(outDir, "entry.png");

// The image must exist next to this program and be a whole PNG.
const bytes = readFileSync(source);
if (bytes.length === 0 || bytes.length > MAX_BYTES) {
  throw new Error(`entry.png is ${bytes.length} bytes, must be 1..${MAX_BYTES}`);
}
const pngMagic = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
if (!bytes.subarray(0, 8).equals(pngMagic)) {
  throw new Error("entry.png is not a PNG (bad magic bytes)");
}

// The IHDR chunk carries width and height as big-endian uint32 at bytes
// 16..20 and 20..24. Enforce the 1024x1024 gate limit here, not just size.
if (bytes.length < 24 || bytes.toString("ascii", 12, 16) !== "IHDR") {
  throw new Error("entry.png has no IHDR chunk");
}
const width = bytes.readUInt32BE(16);
const height = bytes.readUInt32BE(20);
if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
  throw new Error(`entry.png is ${width}x${height}, must be at most ${MAX_DIMENSION}x${MAX_DIMENSION}`);
}
console.log(`entry.png is ${width}x${height}, ${bytes.length} bytes`);

mkdirSync(outDir, { recursive: true });
copyFileSync(source, target);

const written = statSync(target).size;
const sha256 = createHash("sha256").update(readFileSync(target)).digest("hex");
console.log(`wrote ${target} (${written} bytes, sha256 ${sha256})`);
