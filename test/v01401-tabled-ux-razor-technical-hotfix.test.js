import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { allGameplayCards } from "../js/data/content.js?v=0.14.04";
import { decks } from "../js/data/decks.js?v=0.14.04";
import { CARD_NUMBER_BY_ID } from "../js/data/card-number-manifest.js?v=0.14.04";

const app = fs.readFileSync(new URL("../js/ui/app.js", import.meta.url), "utf8");
const css = fs.readFileSync(new URL("../css/game.css", import.meta.url), "utf8");
const studio = fs.readFileSync(new URL("../js/tools/card-art-studio-data.js", import.meta.url), "utf8");
const byId = Object.fromEntries(allGameplayCards.map(card => [card.id, card]));

test("v0.14.01 Razor's Abdominal Stretch requires only Technical 1", () => {
  const card = byId["razor-ramon-abdominal-stretch"];
  assert.ok(card);
  assert.equal(card.rarity, 3);
  assert.equal(card.cost, 5);
  assert.equal(card.moveType, "submission");
  assert.equal(card.trademark, true);
  assert.deepEqual(card.requirements, { technical: 1 });
  assert.deepEqual(card.submission, { bodyPart: "chest", pressure: 5 });
  assert.equal(CARD_NUMBER_BY_ID[card.id].cardCode, "NG1-016");
  assert.equal(decks["razor-ramon"].filter(entry => entry.id === card.id).length, 3);
  assert.match(studio, /"id":"razor-ramon-abdominal-stretch"[\s\S]*?"requirements":\{"technical":1\}/);
});

test("v0.14.01 Challenges set progress uses the approved live-set order", () => {
  const start = app.indexOf("const challengeSetOrder = [");
  assert.ok(start >= 0);
  const end = app.indexOf("];", start);
  const block = app.slice(start, end);
  const ids = [
    "summerslam-series-1",
    "evolution-series-1",
    "golden-era-series-1",
    "new-generation-series-1",
    "attitude-era-series-1",
  ];
  let cursor = -1;
  for (const id of ids) {
    const at = block.indexOf(`"${id}"`);
    assert.ok(at > cursor, `${id} should appear after the previous set`);
    cursor = at;
  }
  assert.match(app, /challengeSetOrder\.map\(setId => launchSetCollections\[setId\]\)\.filter\(Boolean\)/);
});

test("v0.14.01 Deck Lab Superstar chooser keeps full physical cards in a horizontal swipe rail", () => {
  assert.match(app, /selectionCarouselMarkup\(unlocked,deckBuilderStarId,'deck-lab-select'\)/);
  assert.match(css, /\.deck-lab-roster-selector \.superstar-select-carousel\{[\s\S]*?overflow-x:auto!important;[\s\S]*?scroll-snap-type:x mandatory!important;/);
  assert.match(css, /\.deck-lab-roster-selector \.select-superstar-card\{[\s\S]*?height:auto!important;[\s\S]*?aspect-ratio:\.68!important;/);
  assert.match(css, /\.deck-lab-roster-selector \.selection-owned-card \.selection-owned-superstar-card,[\s\S]*?width:100%!important;[\s\S]*?height:100%!important;[\s\S]*?object-fit:contain!important;/);
});

test("v0.14.01 Daily Tower victory Return to Tower is a colored primary CTA", () => {
  assert.match(app, /isLiveEvent \? "live-event-result-cta" : ""/);
  assert.match(css, /#results-continue\.live-event-result-cta\{[\s\S]*?background:linear-gradient\(180deg,#21bff0,#117fc3\)!important;[\s\S]*?color:#fff!important;/);
});
