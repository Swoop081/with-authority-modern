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


test("Rewards Superstar template carries its own reusable top-right set logo", () => {
  assert.match(studioJs, /"season-1-final-boss": \{[\s\S]*?logo: "assets\/art\/season-1-final-boss\/rewards-logo\.png"/);
  assert.match(studioJs, /"season-1-final-boss": "data:image\/png;base64,/);
  const rewardsSvg = fs.readFileSync(new URL("../assets/templates/superstar/rewards.svg", import.meta.url), "utf8");
  assert.match(rewardsSvg, /id="SET_LOGO"/);
  assert.match(rewardsSvg, />REWARDS<\/text>/);
  assert.ok(fs.existsSync(new URL("../assets/art/season-1-final-boss/rewards-logo.png", import.meta.url)));
});


test("Move Card Studio contains all 261 active Move cards across the four Season 1 pools", () => {
  const js = fs.readFileSync(new URL("../js/tools/card-art-studio.js", import.meta.url), "utf8");
  const ids = [...js.matchAll(/\{\"id\":\"([^\"]+)\",\"name\":/g)].map(match => match[1]);
  assert.equal(ids.length, 261);
  assert.equal(new Set(ids).size, 261);
  for (const id of ["cross-rhodes", "hof1-austin-stunner-reviewed", "evo1-rhea-riptide", "s1rock-rock-bottom-final-boss"]) {
    assert.ok(ids.includes(id), `${id} should be editable in Move Card Studio`);
  }
});

test("Move Card Studio front is restricted to set logo, Move name, Cost and Damage", () => {
  const html = fs.readFileSync(new URL("../tools/card-art-studio.html", import.meta.url), "utf8");
  const js = fs.readFileSync(new URL("../js/tools/card-art-studio.js", import.meta.url), "utf8");
  assert.match(html, /SET LOGO[\s\S]*TOP RIGHT · AUTOMATIC/);
  assert.match(html, /MOVE NAME[\s\S]*BOTTOM · AUTOMATIC/);
  assert.match(html, /COST \/ DAM[\s\S]*SMALL · BOTTOM · AUTOMATIC/);
  assert.match(html, /OTHER RULES[\s\S]*BACK ONLY/);
  assert.match(js, /drawSetLogo/);
  assert.match(js, /drawBottomIdentity/);
  assert.doesNotMatch(js, /FINISHER.*strokeText|TRADEMARK.*strokeText|SIGNATURE.*strokeText/);
});

test("Move Card Studio has four matching editable full-bleed SVG templates", () => {
  for (const filename of ["summerslam-series-1.svg","hall-of-fame-series-1.svg","evolution-series-1.svg","rewards.svg"]) {
    const svg = fs.readFileSync(new URL(`../assets/templates/move/${filename}`, import.meta.url), "utf8");
    assert.match(svg, /width="680" height="1000"/);
    assert.match(svg, /id="MOVE_ART"/);
    assert.match(svg, /id="SET_LOGO"/);
    assert.match(svg, /id="MOVE_NAME"/);
    assert.match(svg, /id="COST_DAMAGE"/);
  }
});

test("finished Move WebPs become the canonical front with automatic legacy fallback", () => {
  const artwork = fs.readFileSync(new URL("../js/data/artwork.js", import.meta.url), "utf8");
  const app = fs.readFileSync(new URL("../js/ui/app.js", import.meta.url), "utf8");
  const css = fs.readFileSync(new URL("../css/game.css", import.meta.url), "utf8");
  assert.match(artwork, /export function moveCardArtFor/);
  assert.match(artwork, /assets\/cards\/art\/custom\/moves\/\$\{cardId\}\.webp/);
  assert.match(app, /data-move-card-art/);
  assert.match(app, /classList\.remove\('is-full-art-move'\)/);
  assert.match(css, /\.ccg-card\.is-full-art-move \.ccg-card-title/);
  assert.match(css, /\.ccg-card\.is-full-art-move \.ccg-card-stats/);
}
);
