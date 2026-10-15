#!/usr/bin/env node
/**
 * Builds the favicon / app icons from the client's logo (public/logo.png).
 *
 * The full wordmark is unreadable at 16–32px, so the icon uses only the "VIA"
 * letters, cut 1:1 from the logo's pixels (never redrawn or recoloured),
 * centred on the brand paper colour so it reads in light AND dark browser tabs.
 * Letters are only ever scaled DOWN (never beyond the logo's own resolution).
 *
 * Outputs (Next.js file conventions, picked up automatically):
 *   src/app/favicon.ico     16, 32, 48 px (PNG-in-ICO)
 *   src/app/icon.png        64 px
 *   src/app/apple-icon.png  180 px
 * Usage: node scripts/icons.mjs
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const APP = path.join(ROOT, "src", "app");
const PAPER = { r: 0xf5, g: 0xf3, b: 0xee, alpha: 1 };

/** Bounding box of the first ink run ("VIA"): stops at the first wide transparent gap. */
async function monogramBox(buf) {
  const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const ink = (x, y) => data[(y * width + x) * channels + 3] > 16;
  const colHasInk = (x) => {
    for (let y = 0; y < height; y++) if (ink(x, y)) return true;
    return false;
  };
  const left = [...Array(width).keys()].find(colHasInk);
  // gap between letters of "VIA" is small; the gap before "Value Insurance" is wide
  const maxGap = Math.round(height * 0.18);
  let right = left;
  let gap = 0;
  for (let x = left; x < width; x++) {
    if (colHasInk(x)) {
      right = x;
      gap = 0;
    } else if (++gap > maxGap) break;
  }
  let top = height;
  let bottom = 0;
  for (let y = 0; y < height; y++)
    for (let x = left; x <= right; x++)
      if (ink(x, y)) {
        top = Math.min(top, y);
        bottom = Math.max(bottom, y);
      }
  return { left, top, width: right - left + 1, height: bottom - top + 1 };
}

/** Monogram centred on a paper square; letters fill `fill` of the side, never upscaled. */
async function square(mono, size, fill, radius) {
  const meta = await sharp(mono).metadata();
  const scale = Math.min(1, (size * fill) / Math.max(meta.width, meta.height));
  const w = Math.max(1, Math.round(meta.width * scale));
  const h = Math.max(1, Math.round(meta.height * scale));
  const letters = await sharp(mono).resize(w, h, { kernel: "lanczos3" }).png().toBuffer();
  const mask = Buffer.from(`<svg width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${radius}" ry="${radius}"/></svg>`);
  return sharp({ create: { width: size, height: size, channels: 4, background: PAPER } })
    .composite([
      { input: letters, left: Math.round((size - w) / 2), top: Math.round((size - h) / 2) },
      { input: mask, blend: "dest-in" },
    ])
    .png()
    .toBuffer();
}

/** Minimal ICO writer: PNG-compressed entries (supported by all modern browsers). */
function ico(pngs) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(pngs.length, 4);
  const dir = Buffer.alloc(16 * pngs.length);
  let offset = 6 + dir.length;
  pngs.forEach(({ size, buf }, i) => {
    const o = i * 16;
    dir.writeUInt8(size >= 256 ? 0 : size, o);
    dir.writeUInt8(size >= 256 ? 0 : size, o + 1);
    dir.writeUInt8(0, o + 2);
    dir.writeUInt8(0, o + 3);
    dir.writeUInt16LE(1, o + 4);
    dir.writeUInt16LE(32, o + 6);
    dir.writeUInt32LE(buf.length, o + 8);
    dir.writeUInt32LE(offset, o + 12);
    offset += buf.length;
  });
  return Buffer.concat([header, dir, ...pngs.map((p) => p.buf)]);
}

async function main() {
  const logo = await readFile(path.join(ROOT, "public", "logo.png"));
  const box = await monogramBox(logo);
  const mono = await sharp(logo).extract(box).png().toBuffer();
  console.log(`"VIA" monogram: ${box.width}x${box.height} at (${box.left},${box.top}) in logo.png`);

  const sizes = [16, 32, 48];
  const entries = [];
  // small sizes: letters fill more of the square so they stay legible
  for (const s of sizes) entries.push({ size: s, buf: await square(mono, s, 0.86, Math.round(s * 0.18)) });
  await writeFile(path.join(APP, "favicon.ico"), ico(entries));
  await writeFile(path.join(APP, "icon.png"), await square(mono, 64, 0.8, 12));
  // iOS adds its own rounded mask, so the apple icon is a full square
  await writeFile(path.join(APP, "apple-icon.png"), await square(mono, 180, 0.62, 0));
  console.log("Wrote src/app/favicon.ico (16/32/48), icon.png (64), apple-icon.png (180)");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
