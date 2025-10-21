#!/usr/bin/env node
import { readFile, writeFile, stat } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const project = dirname(root);
const outDir = process.argv[2] || process.env.OUT_DIR || "dist";

const targets = [
  "data/collected.json",
  "data/ignored.json",
  "data/pre-collected.json"
].map(p => join(project, outDir, p));

async function exists(p) { try { await stat(p); return true; } catch { return false; } }

function extractStrings(input) {
  const arr = Array.isArray(input) ? input : (Array.isArray(input?.items) ? input.items : []);
  const seen = new Set();
  const out = [];
  for (const v of arr) {
    const s = String((typeof v === "string" ? v : v?.model) ?? "").trim();
    if (!s || seen.has(s)) continue;
    seen.add(s);
    out.push(s);
  }
  return out;
}

const kb = n => (n / 1024).toFixed(1) + " kB";

for (const file of targets) {
  if (!(await exists(file))) {
    console.warn(`⚠ ${file} not found; skipping`);
    continue;
  }
  const before = await readFile(file, "utf8");
  let json;
  try { json = JSON.parse(before); }
  catch { console.error(`✖ Cannot parse ${file}`); continue; }

  const strings = extractStrings(json);
  const after = JSON.stringify(strings);
  await writeFile(file, after, "utf8");
  console.log(`✔ shrunk ${file}: ${kb(Buffer.byteLength(before))} → ${kb(Buffer.byteLength(after))} (${strings.length} items)`);
}
