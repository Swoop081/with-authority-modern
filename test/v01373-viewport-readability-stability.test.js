import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { allGameplayCards } from "../js/data/content.js?v=0.13.92";
const css=fs.readFileSync(new URL("../css/game.css",import.meta.url),"utf8");
const app=fs.readFileSync(new URL("../js/ui/app.js",import.meta.url),"utf8");
await import("../js/data/superstar-nameplates.js?v=0.13.92");
const profiles=globalThis.WWE_LEGACY_SUPERSTAR_NAMEPLATES;

test("v0.13.75 tier-up numerals scale by digit count without clipping",()=>{
  assert.match(app,/tier-digits-\$\{String\(event\.tier\)\.length\}/);
  assert.match(css,/tier-up-number\.tier-digits-2 b/);
  assert.match(css,/tier-up-number\.tier-digits-3 b/);
});

test("v0.13.75 live-event detail spends available viewport on complete larger cards",()=>{
  assert.match(css,/live-tower-detail-body[\s\S]*grid-template-rows:minmax\(0,1\.05fr\) minmax\(0,\.95fr\)/);
  assert.match(css,/live-tower-selector-panel \.select-superstar-card[\s\S]*aspect-ratio:\.68/);
  assert.match(css,/live-tower-route-strip[\s\S]*grid-auto-columns:min\(43vw,178px\)/);
  assert.match(css,/live-tower-route-superstar \.ccg-card[\s\S]*124px/);
});

test("v0.13.75 booster vault centers pack art, quantity badge and empty state",()=>{
  assert.match(css,/vault-pack-quantity[\s\S]*top:10px[\s\S]*right:10px/);
  assert.match(css,/booster-empty-stage[\s\S]*place-items:center/);
  assert.match(css,/vault-product-pack[\s\S]*justify-self:center/);
});

test("What Do You Want to Talk About creates an explicit top-four player choice",()=>{
  const card=allGameplayCards.find(c=>c.id==="cody-rhodes-what-do-you-want-to-talk-about");
  assert.equal(card.effect.choose,true);
  assert.match(app,/renderTopDeckTutorChoice/);
  assert.match(app,/data-tutor-choice/);
});

test("v0.13.75 nameplates retain unique identities with readability-first condensed stacks",()=>{
  assert.equal(Object.keys(profiles).length,76);
  const fps=new Set(Object.values(profiles).map(p=>[p.fontFamily,p.weight,p.italic,p.tracking,p.skew,p.scaleX,p.fontScale].join("|")));
  assert.equal(fps.size,76);
  for(const p of Object.values(profiles)){ assert.match(p.fontFamily,/Bahnschrift|Avenir Next Condensed/); assert.ok(p.strokeWidth<=2); assert.ok(Math.abs(p.skew)<=1); }
});

test("v0.13.75 matchup uses full phone viewport and distributes the five major bands",()=>{
  assert.match(css,/body\[data-screen="matchup"\] \.matchup-splash[\s\S]*grid-template-rows:auto auto minmax\(0,1fr\) auto auto/);
  assert.match(css,/min-height:100svh/);
});
