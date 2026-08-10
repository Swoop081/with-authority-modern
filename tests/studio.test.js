import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { superstars } from "../js/data/superstars.js";

const studioJs = fs.readFileSync(new URL("../js/tools/superstar-card-studio.js", import.meta.url), "utf8");
const studioHtml = fs.readFileSync(new URL("../tools/superstar-card-studio.html", import.meta.url), "utf8");

test("Superstar Art Studio contains the complete canonical 25-Superstar roster", () => {
  const roster = Object.values(superstars);
  assert.equal(roster.length, 25);
  for (const star of roster) {
    assert.match(studioJs, new RegExp(`id: \"${star.id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\"`));
  }
});

test("Superstar Art Studio set mapping remains 8 SummerSlam / 8 Hall of Fame / 8 Evolution / 1 reward", () => {
  const counts = Object.values(superstars).reduce((acc, star) => {
    acc[star.setId] = (acc[star.setId] || 0) + 1;
    return acc;
  }, {});
  assert.deepEqual(counts, {
    "summerslam-series-1": 8,
    "hall-of-fame-series-1": 8,
    "evolution-series-1": 8,
    "season-1-final-boss": 1,
  });
});

test("Superstar Art Studio is direct-file compatible and has a non-empty initial dropdown fallback", () => {
  assert.doesNotMatch(studioJs, /^import\s/m);
  assert.match(studioHtml, /<script src="\.\.\/js\/tools\/superstar-card-studio\.js"><\/script>/);
  assert.doesNotMatch(studioHtml, /superstar-card-studio\.js"[^>]*type="module"/);
  assert.match(studioHtml, /<option value="cody-rhodes">Cody Rhodes<\/option>/);
  assert.match(studioJs, /WWE_LEGACY_SUPERSTAR_STUDIO_READY = true/);
});


test("Superstar card set backgrounds remain full-bleed through the bottom edge", () => {
  assert.doesNotMatch(studioJs, /fillRect\(0,h\*\.7[89],w,h\*\.2[12]\)/);
  for (const filename of [
    "summerslam-series-1.svg",
    "hall-of-fame-series-1.svg",
    "evolution-series-1.svg",
    "rewards.svg",
  ]) {
    const svg = fs.readFileSync(new URL(`../assets/templates/superstar/${filename}`, import.meta.url), "utf8");
    assert.doesNotMatch(svg, /<rect y="(?:780|790)" width="680" height="(?:220|210)"/);
    assert.match(svg, /(?:<rect width="680" height="1000"|<rect width="680" height="1000" rx="28")/);
  }
});


test("Superstar Art Studio WebP export is visible, guarded and direct-file safe", () => {
  assert.match(studioHtml, /id="export-webp"[^>]*>Export Superstar WebP<\/button>/);
  assert.match(studioJs, /function canvasToWebp\(quality\)/);
  assert.match(studioJs, /EMBEDDED_SET_LOGOS/);
  assert.match(studioJs, /document\.location\.protocol==="file:" && state\.wrestlerIsProjectAsset/);
  assert.match(studioJs, /Downloaded \${id}\.webp/);
  assert.match(studioJs, /Export failed:/);
});

test("Superstar Art Studio local file uploads stay origin-clean for WebP export", () => {
  assert.match(studioJs, /function readFileAsDataUrl\(file\)/);
  assert.match(studioJs, /reader\.readAsDataURL\(file\)/);
  assert.match(studioJs, /function resetCanvasSurface\(\)/);
  assert.match(studioJs, /canvas\.cloneNode\(false\)/);
  assert.match(studioJs, /function canvasIsOriginClean\(\)/);
  assert.match(studioJs, /ctx\.getImageData\(0,0,1,1\)/);
  assert.match(studioJs, /if\(document\.location\.protocol==="file:"\)[\s\S]*?state\.wrestler=null;[\s\S]*?resetCanvasSurface\(\)/);
  const fileUploader = studioJs.match(/async function fileToImage\(file\)\{[\s\S]*?\n\}/)?.[0] || "";
  assert.match(fileUploader, /readFileAsDataUrl\(file\)/);
  assert.doesNotMatch(fileUploader, /URL\.createObjectURL/);
});
