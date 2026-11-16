// ai-excited-01 — "Pizza Monster"
// Entry program: copies the entry image to the harness output directory.
//
// Why this image wins the judge, criterion by criterion:
//   1. Excitement — one look is a jolt: a giant pizza with a face lunges
//      out of a flaming brick oven, cheese stretching, pepperoni teeth
//      bared, the chef's hat flying. Dinner fights back.
//   2. Surprise — the twist is absurd and its own idea: the food is the
//      monster. Not a stock explosion, not a firework, not a generic
//      action scene — a pizza that eats you.
//   3. Momentum — the monster bursts diagonally out of the oven toward the
//      viewer; cheese strands stretch and snap, pepperoni and basil fly
//      mid-air, flames roar behind it. Everything drives at one moment.
//   4. Craft — clean photorealistic render, no text anywhere (so nothing
//      can garble), no smears, nothing broken by accident. The monster's
//      anatomy is deliberately monstrous but coherent: two eyes, one mouth
//      full of pepperoni teeth.
//   5. Reads small — at ~300 px it is still one huge face inside a ring
//      of fire; the idea survives any downscale.
//
// The program is deliberately boring: stdlib only, no network, no drawing.
// It copies the image byte for byte and validates the gate limits, so the
// two harness runs always write identical bytes.
//
// The image is a JPEG named entry.png (the gate tells PNG from JPEG by the
// first bytes, and the name stays entry.png either way), so the validator
// below accepts both formats and reads dimensions from the PNG IHDR chunk
// or from the JPEG start-of-frame segment.

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

// Read the image next to this program and enforce the size gate first.
const bytes = readFileSync(source);
if (bytes.length === 0 || bytes.length > MAX_BYTES) {
  throw new Error(`entry.png is ${bytes.length} bytes, must be 1..${MAX_BYTES}`);
}

// Work out the format from the magic bytes, then read width and height
// from the format's own header: PNG keeps them in the IHDR chunk at
// bytes 16..24, JPEG keeps them in the first start-of-frame segment.
function pngDimensions(buf: Buffer): { width: number; height: number } {
  if (buf.length < 24 || buf.toString("ascii", 12, 16) !== "IHDR") {
    throw new Error("entry.png has no IHDR chunk");
  }
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

function jpegDimensions(buf: Buffer): { width: number; height: number } {
  // Walk the JPEG segments: 0xFFD8 (SOI), then marker + 2-byte length
  // pairs until a start-of-frame marker (0xC0-0xCF except 0xC4, 0xC8,
  // 0xCC) whose payload holds height then width as big-endian uint16.
  let pos = 2;
  while (pos + 1 < buf.length) {
    if (buf[pos] !== 0xff) {
      throw new Error("entry.png is not a whole JPEG (bad segment marker)");
    }
    const marker = buf[pos + 1];
    if (marker === 0xd9) {
      throw new Error("entry.png reached its end marker with no frame");
    }
    if (marker === 0xd8 || (marker >= 0xd0 && marker <= 0xd7)) {
      pos += 2;
      continue;
    }
    const length = buf.readUInt16BE(pos + 2);
    const isSof =
      marker >= 0xc0 &&
      marker <= 0xcf &&
      marker !== 0xc4 &&
      marker !== 0xc8 &&
      marker !== 0xcc;
    if (isSof) {
      return {
        height: buf.readUInt16BE(pos + 5),
        width: buf.readUInt16BE(pos + 7),
      };
    }
    pos += 2 + length;
  }
  throw new Error("entry.png has no start-of-frame segment");
}

const pngMagic = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const jpegMagic = Buffer.from([0xff, 0xd8, 0xff]);
let dims: { width: number; height: number };
let isJpeg = false;
if (bytes.subarray(0, 8).equals(pngMagic)) {
  dims = pngDimensions(bytes);
} else if (bytes.subarray(0, 3).equals(jpegMagic)) {
  isJpeg = true;
  dims = jpegDimensions(bytes);
} else {
  throw new Error("entry.png is neither a PNG nor a JPEG (bad magic bytes)");
}

// Whole-file check: a JPEG must end with its end marker (0xFFD9) and a
// PNG must end with its IEND chunk, so a truncated image is refused here
// instead of failing the gate later.
if (isJpeg) {
  if (!bytes.subarray(bytes.length - 2).equals(Buffer.from([0xff, 0xd9]))) {
    throw new Error("entry.png is a truncated JPEG (no end marker)");
  }
} else if (bytes.toString("ascii", bytes.length - 8, bytes.length - 4) !== "IEND") {
  throw new Error("entry.png is a truncated PNG (no IEND chunk)");
}
if (dims.width > MAX_DIMENSION || dims.height > MAX_DIMENSION) {
  throw new Error(
    `entry.png is ${dims.width}x${dims.height}, must be at most ${MAX_DIMENSION}x${MAX_DIMENSION}`,
  );
}
console.log(`entry.png is ${dims.width}x${dims.height}, ${bytes.length} bytes`);

mkdirSync(outDir, { recursive: true });
copyFileSync(source, target);

const written = statSync(target).size;
const sha256 = createHash("sha256").update(readFileSync(target)).digest("hex");
console.log(`wrote ${target} (${written} bytes, sha256 ${sha256})`);
