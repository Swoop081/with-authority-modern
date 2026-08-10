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
