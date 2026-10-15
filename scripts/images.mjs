#!/usr/bin/env node
/**
 * Downloads the client's own image assets from the legacy site, builds the
 * logo, and generates responsive WebP/AVIF variants.
 *
 * Logo rule: the legacy logo files have "Call 202-999-2131" baked in next to
 * the wordmark. With the client's approval we CROP to the wordmark only:
 * the pixels are extracted 1:1. No recolor, no resample, no effects.
 * Only preheadernew.png has a transparent background (VIA_DC.png and
 * VIA_DC_SM.png sit on an opaque grey box), so it is the sole crop source.
 *
 * Responsive variants never upscale beyond the original width.
 * Usage: node scripts/images.mjs
 */
import { mkdir, writeFile, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PUB = path.join(ROOT, "public");
const BASE = "https://www.businessinsurancewashingtondc.com/img/~www.businessinsurancewashingtondc.com/";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Safari/537.36";

/** Assets worth keeping. Skipped on purpose: social icons, search sprites, SSL badge, flat footer fill, 25px icon. */
const ASSETS = [
  { file: "VIA_DC.png", dir: "brand", note: "Logo + baked-in phone (inner-page header)" },
  { file: "VIA_DC_SM.png", dir: "brand", note: "Logo + baked-in phone (old mobile site)" },
  { file: "preheadernew.png", dir: "brand", note: "Homepage header: logo + phone + 'Click Here for a Quote'" },
  { file: "pagebackimage.jpg", dir: "brand", note: "CSS page background: generic stock skyline (not DC) — archived, not used" },
  { file: "postheader.png", dir: "coverage", note: "Homepage coverage strip: 4 glyph icons + text baked in — archived, not used" },
];

/** Responsive widths to try; anything >= the original width is dropped (no upscaling). */
const WIDTHS = [480, 960, 1600];

async function download(file) {
  const res = await fetch(BASE + file, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`${res.status} ${file}`);
  return Buffer.from(await res.arrayBuffer());
}

/**
 * Find the wordmark's bounding box: scan alpha columns left→right, take the
 * first ink run, then extend across gaps narrower than `maxGap` px (the gaps
 * between letters and between "VIA" and the name). A gap wider than that is
 * the space before "Call …", where the crop stops.
 */
async function wordmarkBox(buf, maxGap) {
  const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const colInk = new Array(width).fill(false);
  const rowInk = new Array(height).fill(false);
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++) {
      const a = data[(y * width + x) * channels + 3];
      if (a > 16) { colInk[x] = true; }
    }
  const left = colInk.indexOf(true);
  let right = left, gap = 0;
  for (let x = left; x < width; x++) {
    if (colInk[x]) { right = x; gap = 0; } else if (++gap > maxGap) break;
  }
  for (let y = 0; y < height; y++)
    for (let x = left; x <= right; x++)
      if (data[(y * width + x) * channels + 3] > 16) { rowInk[y] = true; break; }
  const top = rowInk.indexOf(true);
  const bottom = rowInk.lastIndexOf(true);
  return { left, top, width: right - left + 1, height: bottom - top + 1 };
}

async function variants(buf, outDir, base, origWidth) {
  const made = [];
  for (const w of WIDTHS.filter((w) => w < origWidth).concat(origWidth)) {
    const img = sharp(buf).resize({ width: w, withoutEnlargement: true });
    await img.clone().webp({ quality: 86 }).toFile(path.join(outDir, `${base}-${w}.webp`));
    await img.clone().avif({ quality: 60 }).toFile(path.join(outDir, `${base}-${w}.avif`));
    made.push(w);
  }
  return made;
}

async function main() {
  const report = [];
  const sources = {};
  for (const a of ASSETS) {
    const dir = path.join(PUB, "images", a.dir);
    await mkdir(dir, { recursive: true });
    const dest = path.join(dir, a.file);
    const buf = existsSync(dest) ? await readFile(dest) : await download(a.file);
    await writeFile(dest, buf);
    const meta = await sharp(buf).metadata();
    sources[a.file] = buf;
    const base = a.file.replace(/\.\w+$/, "");
    const widths = await variants(buf, dir, base, meta.width);
    report.push({ path: `images/${a.dir}/${a.file}`, size: `${meta.width}x${meta.height}`, variants: widths.join("/"), note: a.note });
  }

  // ---- Logo: exact 1:1 pixel crop of the wordmark from the transparent header image ----
  const userLogo = path.join(PUB, "logo.png");
  const src = sources["preheadernew.png"];
  const meta = await sharp(src).metadata();
  // allowed intra-wordmark gap scales with image height (letter/word spacing)
  const box = await wordmarkBox(src, Math.round(meta.height * 0.4));
  const logoBuf = await sharp(src).extract(box).png().toBuffer();
  await writeFile(path.join(PUB, "images", "brand", "logo-wordmark.png"), logoBuf);
  if (!existsSync(userLogo)) await writeFile(userLogo, logoBuf); // a client-supplied logo.png always wins
  await sharp(logoBuf).webp({ lossless: true }).toFile(path.join(PUB, "images", "brand", "logo-wordmark.webp"));
  console.log(`Logo: wordmark ${box.width}x${box.height} cropped at (${box.left},${box.top}) from preheadernew.png → public/logo.png`);
  console.log("\nAssets:");
  console.table(report);
}

main().catch((e) => { console.error(e); process.exit(1); });
