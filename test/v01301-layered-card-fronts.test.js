import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const fronts = fs.readFileSync(new URL("../js/data/card-fronts.js", import.meta.url), "utf8");
const artwork = fs.readFileSync(new URL("../js/data/artwork.js", import.meta.url), "utf8");
const app = fs.readFileSync(new URL("../js/ui/app.js", import.meta.url), "utf8");
const studio = fs.readFileSync(new URL("../js/tools/card-art-studio.js", import.meta.url), "utf8");
const studioHtml = fs.readFileSync(new URL("../tools/card-art-studio.html", import.meta.url), "utf8");

// Migration safety is the primary invariant: nothing existing becomes layered
// merely because the infrastructure exists.
test("v0.13.1 existing finished fronts remain flat unless explicitly registered", () => {
  assert.match(fronts, /LAYERED_FRONT_IDS = new Set\(\[\s*\/\/ Example/s);
  assert.match(fronts, /LAYERED_FRONT_IDS\.has\(card\.id\)/);
  assert.match(artwork, /if \(!card \|\| card\.kind === "momentum" \|\| !usesLayeredFront\(card\)\) return null/);
  assert.match(app, /const layeredFront = Boolean\(layeredCardArtFor\(card\)\)/);
  assert.match(app, /layeredFront\s*\? `<span class="ccg-card-art/);
});

test("v0.13.1 Card Art Studio previews full cards but layered exports save clean plates", () => {
  assert.match(studioHtml, /Layered v1 · Recommended/);
  assert.match(studioHtml, /Final Card · Live data visible/);
  assert.match(studioHtml, /Art Plate · Saved image only/);
  assert.match(studioHtml, /Existing finished fronts stay flat/);
  assert.match(studio, /state\.renderPlateOnly/);
  assert.match(studio, /if\(state\.renderPlateOnly\)\{ctx\.restore\(\);return;\}/);
  assert.match(studio, /if\(!state\.renderPlateOnly\)drawRarityStars\(\)/);
  assert.match(studio, /state\.exportingPlate=isLayeredFormat\(\)/);
  assert.match(studio, /assets\/cards\/art\/layered/);
});

test("v0.13.1 live layered overlay is driven from canonical card data", () => {
  assert.match(app, /\$\{card\.cost \?\? 0\}/);
  assert.match(app, /\$\{card\.damage \?\? 0\}/);
  assert.match(app, /layeredFrontRequirementText\(card\)/);
  assert.match(app, /rarityStars\(card\.rarity \?\? 1\)/);
  assert.match(app, /\$\{card\.name\}/);
});
