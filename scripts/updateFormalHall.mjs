#!/usr/bin/env node
/**
 * Fetches formal hall menu PDFs from the Pembroke College website,
 * parses them, and writes src/data/formalHallData.json.
 *
 * Only includes "Formal Hall" events (including Choir Dinner, Rugby Dinner,
 * Pink Charity, etc.) — skips BA's Dinner, NatSci Dinner, Halfway Hall, etc.
 * Allergen info is stripped.
 */

import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { PDFParse } from "pdf-parse";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_PATH = resolve(__dirname, "../src/data/formalHallData.json");

const MENU_PAGE_URL =
  "https://www.pem.cam.ac.uk/college/catering/information-students/formal-hall-menu";

// ---------------------------------------------------------------------------
// 1. Scrape the formal hall page for PDF links
// ---------------------------------------------------------------------------

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (compatible; WhatsForTrough/1.0; +https://github.com)",
};

async function fetchPdfUrls() {
  const res = await fetch(MENU_PAGE_URL, { headers: HEADERS });
  if (!res.ok) throw new Error(`Failed to fetch menu page: ${res.status}`);
  const html = await res.text();

  // Match href values pointing to .pdf files
  const re = /href="([^"]+\.pdf)"/gi;
  const urls = new Set();
  let m;
  while ((m = re.exec(html))) {
    let url = m[1];
    if (!url.startsWith("http")) {
      url = new URL(url, "https://www.pem.cam.ac.uk").href;
    }
    urls.add(url);
  }
  return [...urls];
}

// ---------------------------------------------------------------------------
// 2. Download a PDF and extract per-page text
// ---------------------------------------------------------------------------

async function extractPages(url) {
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) {
    console.warn(`  Skipping ${url}: HTTP ${res.status}`);
    return [];
  }
  const buf = Buffer.from(await res.arrayBuffer());

  const parser = new PDFParse({ data: new Uint8Array(buf) });
  const result = await parser.getText();
  await parser.destroy();

  return result.pages.map((p) => p.text);
}

// ---------------------------------------------------------------------------
// 3. Parse a single page of text into a formal hall entry (or null)
// ---------------------------------------------------------------------------

// Known allergens that appear in parentheses — used to filter them out
const ALLERGEN_RE =
  /^\((?:Allergen free|Fish|Milk|Eggs?|Egg|Gluten|Soya?|Soy|Celery|Sesame|Sulphites|Molluscs|Mustard|Barley|Gluten-Wheat|[A-Z][a-z]+)(?:[,\s]+(?:Allergen free|Fish|Milk|Eggs?|Egg|Gluten|Soya?|Soy|Celery|Sesame|Sulphites|Molluscs|Mustard|Barley|Gluten-Wheat|[A-Z][a-z]+))*\)\s*$/i;

function isAllergenLine(line) {
  return ALLERGEN_RE.test(line.trim());
}

// Date parsing: "Tuesday 20.01.2026" → "2026-01-20"
function parseDate(line) {
  const m = line.match(/(\d{2})\.(\d{2})\.(\d{4})/);
  if (!m) return null;
  return `${m[3]}-${m[2]}-${m[1]}`;
}

// Check if an event name qualifies as a formal hall (not BA's / NatSci / Halfway)
function isFormalHallEvent(eventLines) {
  const joined = eventLines.join(" ").toLowerCase();
  // Must contain "formal hall"
  if (!joined.includes("formal hall")) return false;
  return true;
}

function parsePage(rawText) {
  // Split into non-empty lines
  const lines = rawText
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length < 4) return null;

  // First few lines are header: week number, event type, date
  // Find the date line (contains DD.MM.YYYY)
  let dateLineIdx = -1;
  for (let i = 0; i < Math.min(lines.length, 8); i++) {
    if (/\d{2}\.\d{2}\.\d{4}/.test(lines[i])) {
      dateLineIdx = i;
      break;
    }
  }
  if (dateLineIdx === -1) return null;

  const date = parseDate(lines[dateLineIdx]);
  if (!date) return null;

  // Event type is lines between "Week N" and the date line
  // Skip the first line if it's "Week N"
  const startIdx = /^week\s+\d+$/i.test(lines[0]) ? 1 : 0;
  const eventLines = lines.slice(startIdx, dateLineIdx);

  if (!isFormalHallEvent(eventLines)) return null;

  // Clean up event name
  let event = eventLines.join(" ");
  // Normalize variations
  event = event
    .replace(/Formal Hall and Choir(?:\s+Dinner)?/i, "Formal Hall & Choir")
    .replace(/Pink Charity Formal Hall/i, "Formal Hall")
    .replace(/Formal Hall and Rugby Dinner/i, "Formal Hall")
    .replace(/Formal Hall and Engineering Dinner/i, "Formal Hall")
    .replace(/Formal Hall and BA's Dinner/i, "Formal Hall")
    .replace(/Chinese New Year\s*/i, "")
    .trim();
  if (!event) event = "Formal Hall";

  // Rest of lines are the menu content
  const menuLines = lines.slice(dateLineIdx + 1);

  // Split by -0- into courses
  const courseTexts = [];
  let current = [];
  for (const line of menuLines) {
    if (line === "-0-" || line === "-o-") {
      if (current.length) courseTexts.push(current);
      current = [];
    } else {
      current.push(line);
    }
  }
  if (current.length) courseTexts.push(current);

  // Parse each course
  const courses = courseTexts.map(parseCourse);

  return { date, event, courses };
}

function parseCourse(lines) {
  // Filter out allergen lines
  const clean = lines.filter((l) => !isAllergenLine(l));

  const course = {};

  // Find the vegetarian dish — marked with (V), (v), (V/VG), (v/vg)
  let vegStartIdx = -1;
  for (let i = 0; i < clean.length; i++) {
    if (/^\(v(?:\/vg)?\)\s/i.test(clean[i])) {
      vegStartIdx = i;
      break;
    }
  }

  if (vegStartIdx === -1) {
    // No veg option — entire block is one dish (could be dessert or a veg-only starter)
    if (clean.length >= 1) {
      course.dish = clean[0];
      if (clean.length >= 2) course.description = clean.slice(1).join(", ");
    }
  } else if (vegStartIdx === 0) {
    // Starts with veg — no main dish (veg-only starter)
    const vegName = clean[0].replace(/^\(v(?:\/vg)?\)\s*/i, "");
    course.vegDish = vegName;
    // Check if there are more lines before next dish or end
    // Find if there's a non-veg dish after
    let nextDishIdx = -1;
    for (let i = 1; i < clean.length; i++) {
      // A line that doesn't start with lowercase and isn't a description
      // Heuristic: if there's another dish, it won't be indented/lowercase continuation
      if (
        clean[i].length > 0 &&
        !clean[i].startsWith("(") &&
        clean[i][0] === clean[i][0].toUpperCase() &&
        i > 1
      ) {
        // Could be a separate main dish after the veg starter
        // But this is ambiguous. For veg-only starters, treat rest as description
        break;
      }
    }
    if (clean.length >= 2) {
      // Lines after the veg dish name before any main dish
      const descLines = clean.slice(1);
      if (descLines.length) course.vegDescription = descLines.join(", ");
    }
  } else {
    // Main dish is before vegStartIdx, veg dish starts at vegStartIdx
    course.dish = clean[0];
    if (vegStartIdx > 1) {
      course.description = clean.slice(1, vegStartIdx).join(", ");
    }

    const vegName = clean[vegStartIdx].replace(/^\(v(?:\/vg)?\)\s*/i, "");
    course.vegDish = vegName;
    if (vegStartIdx + 1 < clean.length) {
      course.vegDescription = clean.slice(vegStartIdx + 1).join(", ");
    }
  }

  return course;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log("Fetching formal hall menu page...");
  const pdfUrls = await fetchPdfUrls();
  console.log(`Found ${pdfUrls.length} PDF(s).`);

  const allEntries = {};

  for (const url of pdfUrls) {
    const filename = url.split("/").pop();
    console.log(`Processing ${filename}...`);

    try {
      const pages = await extractPages(url);
      for (const pageText of pages) {
        const entry = parsePage(pageText);
        if (entry) {
          const { date, ...rest } = entry;
          allEntries[date] = rest;
        }
      }
    } catch (err) {
      console.warn(`  Error processing ${filename}: ${err.message}`);
    }
  }

  // Sort by date
  const sorted = Object.keys(allEntries)
    .sort()
    .reduce((acc, key) => {
      acc[key] = allEntries[key];
      return acc;
    }, {});

  const json = JSON.stringify(sorted, null, 2) + "\n";

  writeFileSync(OUT_PATH, json);
  console.log(
    `Wrote ${Object.keys(sorted).length} formal hall entries to ${OUT_PATH}`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
