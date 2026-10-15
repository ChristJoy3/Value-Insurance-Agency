#!/usr/bin/env node
/**
 * One-off content migration scraper for the legacy site
 * (https://www.businessinsurancewashingtondc.com).
 *
 * Fetches every known legacy page, caches the raw HTML in scripts/.cache/,
 * and writes scripts/scraped.json containing, per page:
 *   - HTTP status, <title>, meta description, h1
 *   - the main body content as ordered text blocks (heading / paragraph / list item)
 *   - every <img> and CSS background image referenced anywhere on the page
 * Glossary letters are parsed into { term, definition } pairs.
 *
 * The JSON is raw material: src/data/content.ts is curated from it by hand.
 * Usage: node scripts/scrape.mjs
 */
import { mkdir, writeFile, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as cheerio from "cheerio";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const CACHE = path.join(ROOT, ".cache");
const BASE = "https://www.businessinsurancewashingtondc.com";
// The server UA-sniffs and serves a different mobile template to unknown agents, so use a desktop UA.
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Safari/537.36";

const PAGES = [
  "/", "/about/", "/contact/", "/partners/", "/refer/", "/newsletter/", "/privacy/",
  "/content/artres.aspx",
  "/business/default.aspx", "/workers_compensation/default.aspx",
  "/general_liability/default.aspx", "/automobile/default.aspx", "/umbrella/default.aspx",
  "/content/meetings.aspx", "/health/", "/e_and_o/employmentpractices.aspx",
  "/e_and_o/professionalliability.aspx", "/e_and_o/directorsandofficers.aspx",
  "/e_and_o/default.aspx", "/business/propertyandbuilding.aspx",
  "/business/contractorsinsurance.aspx", "/business/buildersrisk.aspx",
  "/business/taxicabslimousines.aspx", "/business/garagekeepersliability.aspx",
  // Extra URLs found in sitemap.xml — scraped so we know where they should redirect.
  "/automobile/auto_quote_form.aspx", "/category.aspx?id=AUTO", "/category.aspx?id=COMMERCIAL",
  "/category.aspx?id=EANDO", "/category.aspx?id=UMBR", "/category.aspx?id=WORKCOMP",
];
const LETTERS = "abcdefghijklmnopqrstuvwxyz".split("");

const clean = (s) =>
  s.replace(/ /g, " ").replace(/[ \t\r\n]+/g, " ").trim();

/** Fetch with a disk cache so re-runs don't hammer the client's server. */
async function fetchPage(p) {
  const file = path.join(CACHE, p.replace(/[^a-z0-9]+/gi, "_") + ".html");
  if (existsSync(file)) {
    const cached = JSON.parse(await readFile(file, "utf8"));
    return cached;
  }
  let status = 0, html = "";
  try {
    const res = await fetch(BASE + p, { headers: { "User-Agent": UA }, redirect: "follow" });
    status = res.status;
    html = await res.text();
  } catch (e) {
    status = -1;
    html = String(e);
  }
  const out = { status, html };
  await writeFile(file, JSON.stringify(out));
  return out;
}

/** Turn the main content cell into ordered text blocks. <br><br> splits paragraphs. */
function toBlocks($, $root) {
  const blocks = [];
  let buf = "";
  const flush = (type = "p") => {
    const t = clean(buf);
    if (t) blocks.push({ type, text: t });
    buf = "";
  };
  const walk = (node) => {
    for (const el of node.childNodes ?? []) {
      if (el.type === "text") { buf += el.data; continue; }
      if (el.type !== "tag") continue;
      const tag = el.name.toLowerCase();
      if (["script", "style", "noscript", "map", "input", "select", "button", "iframe"].includes(tag)) continue;
      if (/^h[1-6]$/.test(tag)) { flush(); buf = $(el).text(); flush(tag); continue; }
      if (tag === "li") { flush(); buf = $(el).text(); flush("li"); continue; }
      if (tag === "br") {
        // two consecutive <br>s (ignoring whitespace) => paragraph break; single => line break
        let next = el.next;
        while (next && next.type === "text" && !next.data.trim()) next = next.next;
        if (next && next.type === "tag" && next.name === "br") flush(); else buf += "\n";
        continue;
      }
      const isBlock = ["p", "div", "table", "tr", "td", "ul", "ol", "blockquote", "section", "dl", "dt", "dd"].includes(tag);
      if (isBlock) flush();
      if (tag === "strong" || tag === "b") {
        // bold run on its own line is treated as a sub-heading
        const t = clean($(el).text());
        const prev = clean(buf);
        let next = el.next;
        while (next && next.type === "text" && !next.data.trim()) next = next.next;
        if (t && !prev && (!next || (next.type === "tag" && next.name === "br"))) {
          blocks.push({ type: "strong", text: t });
          continue;
        }
      }
      walk(el);
      if (isBlock) flush();
    }
  };
  walk($root.get(0));
  flush();
  // merge single-<br> line breaks inside a paragraph into spaces
  return blocks.map((b) => ({ ...b, text: b.text.replace(/\s*\n\s*/g, " ").trim() })).filter((b) => b.text);
}

function images($, html) {
  const set = new Set();
  $("img").each((_, el) => {
    const src = $(el).attr("src");
    if (src) set.add(JSON.stringify({ src, alt: $(el).attr("alt") ?? "", kind: "img" }));
  });
  for (const m of html.matchAll(/url\(\s*['"]?([^'")]+\.(?:png|jpe?g|gif|svg|webp))['"]?\s*\)/gi)) {
    set.add(JSON.stringify({ src: m[1], alt: "", kind: "css-bg" }));
  }
  return [...set].map((s) => JSON.parse(s));
}

function parsePage(p, { status, html }) {
  const $ = cheerio.load(html);
  const main = $("#ctl00_tdBodyCenter");
  const base = {
    path: p,
    status,
    title: clean($("title").text()),
    description: $('meta[name="description"]').attr("content") ?? "",
    h1: clean($("h1").first().text()),
    images: images($, html),
  };
  if (status !== 200 || !main.length) return { ...base, blocks: [] };
  return { ...base, blocks: toBlocks($, main) };
}

function parseGlossary(letter, { status, html }) {
  const $ = cheerio.load(html);
  const span = $("#cph_main_Wuc_glossary1_lbl_glossary");
  const entries = [];
  if (span.length) {
    // Split on <b> term markers; everything until the next <b> is the definition.
    const raw = span.html() ?? "";
    const parts = raw.split(/<b>/i).slice(1);
    for (const part of parts) {
      const [termHtml, ...rest] = part.split(/<\/b>/i);
      const term = clean(cheerio.load(termHtml).text());
      const defHtml = rest.join("</b>");
      // Preserve numbered/line structure: <br><br> => paragraph, <br> => newline
      const def = cheerio
        .load(defHtml.replace(/<br\s*\/?>\s*<br\s*\/?>/gi, "\n\n").replace(/<br\s*\/?>/gi, "\n"))
        .text()
        .replace(/ /g, " ")
        .replace(/[ \t]+/g, " ")
        .replace(/ *\n */g, "\n")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
      if (term) entries.push({ term, definition: def });
    }
  }
  const notice = clean($("div.plainText").filter((_, el) => $(el).text().includes("NOTICE")).first().text());
  return { letter, status, entries, notice };
}

async function main() {
  await mkdir(CACHE, { recursive: true });
  const pages = [];
  for (const p of PAGES) {
    const res = await fetchPage(p);
    const parsed = parsePage(p, res);
    pages.push(parsed);
    console.log(`${String(res.status).padEnd(4)} ${p.padEnd(42)} blocks=${parsed.blocks.length} imgs=${parsed.images.length}`);
  }
  const glossary = [];
  for (const l of LETTERS) {
    const res = await fetchPage(`/glossary/${l}/`);
    const g = parseGlossary(l, res);
    glossary.push(g);
    console.log(`${String(res.status).padEnd(4)} /glossary/${l}/ terms=${g.entries.length}`);
  }
  await writeFile(path.join(ROOT, "scraped.json"), JSON.stringify({ scrapedAt: new Date().toISOString(), pages, glossary }, null, 2));
  const failed = pages.filter((p) => p.status !== 200).map((p) => `${p.status} ${p.path}`);
  console.log(`\nPages: ${pages.length} (${failed.length} failed)  Glossary terms: ${glossary.reduce((n, g) => n + g.entries.length, 0)}`);
  if (failed.length) console.log("Failed:\n  " + failed.join("\n  "));
}

main();
