import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { collectionCards, collectionCardsBySet } from "../js/data/collection.js";
import { finishedFrontKeys } from "../js/data/finished-front-keys.js";

const studioJs = fs.readFileSync(new URL("../js/tools/card-art-studio.js", import.meta.url), "utf8");
const studioHtml = fs.readFileSync(new URL("../tools/card-art-studio.html", import.meta.url), "utf8");
const legacySuperstarHtml = fs.readFileSync(new URL("../tools/superstar-card-studio.html", import.meta.url), "utf8");
const currentVersion = JSON.parse(fs.readFileSync(new URL("../package.json", import.meta.url), "utf8")).version;

function studioEntries() {
  const match = studioJs.match(/const STUDIO_CARDS = (\[.*?\]);\nconst STUDIO_SUPERSTARS =/s);
  assert.ok(match, "STUDIO_CARDS frozen data should be present");
  return JSON.parse(match[1]);
}

function studioSuperstars() {
  const match = studioJs.match(/const STUDIO_SUPERSTARS = (\[.*?\]);\nconst SETS =/s);
  assert.ok(match, "STUDIO_SUPERSTARS frozen data should be present");
  return JSON.parse(match[1]);
}

test("Card Art Studio contains all 387 active Season 1 collectibles", () => {
  const entries = studioEntries();
  assert.equal(entries.length, collectionCards.length);
  assert.equal(entries.length, 387);
  assert.equal(new Set(entries.map(c => c.id)).size, 387);
  const expectedKinds = { superstar:25, entrance:25, move:276, special:27, momentum:4, action:21, support:6, manager:3 };
  const actualKinds = entries.reduce((acc,c) => { acc[c.kind] = (acc[c.kind] || 0) + 1; return acc; }, {});
  assert.deepEqual(actualKinds, expectedKinds);
  for (const id of ["superstar-cody-rhodes","entrance-cody-rhodes","cross-rhodes","punk-best-in-the-world","hof1-manager-bobby-heenan","evo1-rhea-riptide","s1rock-rock-bottom-final-boss"]) {
    assert.ok(entries.some(c => c.id === id), `${id} should be editable`);
  }
});

test("Card Art Studio preserves the four active set pools and collector numbering", () => {
  const entries = studioEntries();
  const counts = Object.fromEntries(Object.entries(collectionCardsBySet).map(([id,list]) => [id,list.length]));
  assert.deepEqual(counts, {
    "summerslam-series-1":152,
    "hall-of-fame-series-1":104,
    "evolution-series-1":110,
    "season-1-final-boss":21,
  });
  for (const card of collectionCards) {
    const entry = entries.find(e => e.id === card.id);
    assert.equal(entry?.cardCode, card.cardCode, `${card.id} collector number should stay fixed`);
  }
});



test("Card Art Studio defaults to All Sets and searches the full active pool", () => {
  assert.match(studioHtml, /<select id="set-select"><option value="all" selected>All Sets<\/option>/);
  assert.match(studioJs, /set==="all"\|\|s\.setId===set/);
  assert.match(studioJs, /if\(set!=="all"&&c\.setId!==set\)return false/);
  assert.match(studioHtml, /Search all active sets at once by default/);
});
test("Card Art Studio exposes one type-filtered workflow for every collectible kind", () => {
  for (const value of ["all","superstar","move","entrance","special","manager","action","support","momentum"]) {
    assert.match(studioHtml, new RegExp(`<option value="${value}">`));
  }
  assert.match(studioHtml, /ONE STUDIO · EVERY ACTIVE CARD FRONT/);
  assert.match(studioHtml, /All 387 active Season 1 collectibles/);
  assert.match(studioJs, /KIND_LABELS/);
  assert.match(studioJs, /refreshCardList/);
});

test("Card Art Studio is self-contained and direct-file compatible", () => {
  assert.doesNotMatch(studioJs, /^import\s/m);
  assert.equal(studioHtml.includes(`<script src="../js/tools/card-art-studio.js?v=${currentVersion}"></script>`), true);
  assert.doesNotMatch(studioHtml, /card-art-studio\.js"[^>]*type="module"/);
  assert.match(studioHtml, /<option value="superstar-cody-rhodes">SS1-001 · Cody Rhodes · SUPERSTAR<\/option>/);
  assert.match(studioJs, /WWE_LEGACY_CARD_ART_STUDIO_READY=true/);
  assert.match(studioJs, /reader\.readAsDataURL\(file\)/);
  assert.match(studioJs, /function resetCanvasSurface\(\)/);
  assert.match(studioJs, /canvas\.cloneNode\(false\)/);
  assert.match(studioJs, /function canvasIsOriginClean\(\)/);
});


test("Card Art Studio can import artwork from a URL without requiring a local save", () => {
  assert.match(studioHtml, /id="art-url" type="url"/);
  assert.match(studioHtml, /id="load-art-url"[^>]*>Load URL Artwork<\/button>/);
  assert.match(studioHtml, /id="url-status"/);
  assert.match(studioJs, /async function urlToImage\(rawUrl\)/);
  assert.match(studioJs, /async function fetchImageBlob\(url,viaProxy=false\)/);
  assert.match(studioJs, /readFileAsDataUrl\(blob\)/);
  assert.match(studioJs, /URL artwork loaded directly/);
  assert.match(studioJs, /image proxy/);
});



test("URL artwork loader retries CORS-blocked hosts through an image proxy and reports progress beside the button", () => {
  assert.match(studioJs, /https:\/\/wsrv\.nl\/\?url=\$\{encodeURIComponent\(url\.href\)\}/);
  assert.match(studioJs, /Retrying automatically through the image proxy/);
  assert.match(studioJs, /button\.textContent="Loading…"/);
  assert.match(studioJs, /function urlStatus\(text,ok=null\)/);
  assert.match(studioHtml, /automatically retries through the wsrv\.nl image proxy/);
});

test("front identity is minimal by type and every set gets its top-right logo", () => {
  assert.match(studioHtml, /SET LOGO[\s\S]*TOP RIGHT · AUTOMATIC/);
  assert.match(studioHtml, /SUPERSTAR[\s\S]*NAME ONLY/);
  assert.match(studioHtml, /MOVE[\s\S]*NAME \+ COST \/ DAM \+ METHOD REQUIREMENTS/);
  assert.match(studioHtml, /OTHER TYPES[\s\S]*NAME \+ SMALL TYPE LABEL/);
  assert.match(studioHtml, /RULES \/ EFFECTS[\s\S]*BACK ONLY/);
  assert.match(studioJs, /drawSetLogo/);
  assert.match(studioJs, /sub=`COST  \${card\.cost\?\?0}/);
  assert.match(studioJs, /function moveRequirementText\(card\)/);
  assert.match(studioJs, /h\*\.875/);
  assert.match(studioJs, /h\*\.925/);
  assert.match(studioJs, /h\*\.965/);
  assert.match(studioJs, /if\(card\.kind!=="superstar"\)/);
  assert.doesNotMatch(studioJs, /FINISHER.*strokeText|TRADEMARK.*strokeText|SIGNATURE.*strokeText/);
});

test("Move Studio data carries the live method requirements and reserves the third footer row", () => {
  const entries = studioEntries();
  const studioMoves = entries.filter(c => c.kind === "move");
  const liveMoves = collectionCards.filter(c => c.kind === "move");
  assert.equal(studioMoves.length, 276);
  for (const live of liveMoves) {
    const entry = studioMoves.find(c => c.id === live.id);
    assert.deepEqual(entry?.requirements ?? {}, live.requirements ?? {}, `${live.cardCode} ${live.name} requirements should match live data`);
  }
  assert.deepEqual(studioMoves.find(c => c.id === "gts")?.requirements, { technical: 2 });
  assert.deepEqual(studioMoves.find(c => c.id === "punk-step-up-high-knee")?.requirements, { strike: 2, technical: 1 });
  assert.match(studioJs, /moveRequirementText\(card\)/);
  assert.match(studioJs, /ctx\.fillText\(requirement,w\*\.5,h\*\.965\)/);
  assert.match(studioJs, /ctx\.fillStyle=requirement\?set\.nameTop:"rgba\(255,255,255,0\)"/);
});

test("Card Art Studio Superstar filter uses current ownership and deck usage, not legacy ID text", () => {
  const entries = studioEntries();
  const stars = studioSuperstars();
  assert.equal(stars.length, 25);
  assert.match(studioHtml, /id="superstar-select"/);
  assert.match(studioHtml, /Superstar-specific \/ linked cards only/);
  assert.match(studioHtml, /Everything in current recommended deck/);
  assert.match(studioJs, /focus==="deck"\?c\.deckSuperstarIds:c\.specificSuperstarIds/);
  assert.match(studioJs, /`\${c\.name} \${c\.cardCode} \${KIND_LABELS\[c\.kind\]\|\|c\.kind}`/);
  assert.doesNotMatch(studioJs, /`\${c\.id} \${c\.name}/);

  const running = entries.find(c => c.id === "roman-clothesline");
  assert.equal(running?.name, "Running Clothesline");
  assert.deepEqual(running?.specificSuperstarIds, []);
  assert.ok(running?.deckSuperstarIds.includes("roman-reigns"));

  const spear = entries.find(c => c.id === "spear");
  assert.equal(spear?.name, "Roman's Spear");
  assert.deepEqual(spear?.specificSuperstarIds, ["roman-reigns"]);
});

test("Card Art Studio includes the SummerSlam fundamentals pass without renumbering existing cards", () => {
  const entries = studioEntries();
  const expected = [
    ["punch","SS1-136"],["front-kick","SS1-137"],["basic-stomp","SS1-138"],["hip-toss","SS1-139"],
    ["elbow-drop","SS1-140"],["knee-drop","SS1-141"],["leg-drop","SS1-142"],["vertical-suplex","SS1-143"],
    ["russian-leg-sweep","SS1-144"],["bulldog","SS1-145"],["sleeper-common","SS1-146"],["irish-whip","SS1-147"],
    ["knife-edge-chop-common","SS1-148"],["drop-toe-hold","SS1-149"],["firemans-carry","SS1-150"],
    ["schoolboy","SS1-151"],["small-package","SS1-152"]
  ];
  assert.equal(entries.find(c => c.id === "front-dropkick")?.cardCode, "SS1-135");
  for (const [id,code] of expected) assert.equal(entries.find(c => c.id === id)?.cardCode, code, `${id} should be appended after the locked pool`);
});

test("Double Sledge is retired from the Studio without shifting later Hall of Fame collector codes", () => {
  const entries = studioEntries();
  assert.equal(entries.some(c => c.id === "hof1-double-sledge-reviewed"), false);
  assert.equal(entries.some(c => c.cardCode === "HOF1-100"), false);
  assert.equal(entries.find(c => c.id === "hof1-flying-shoulder-reviewed")?.cardCode, "HOF1-101");
  assert.equal(entries.find(c => c.id === "hof1-tilt-whirl-reviewed")?.cardCode, "HOF1-106");
  assert.ok(entries.find(c => c.id === "hof1-axe-handle")?.deckSuperstarIds.includes("ultimate-warrior"));
});

test("shared Spinebuster is consolidated to the SummerSlam printing in the Studio", () => {
  const entries = studioEntries();
  const spine = entries.find(c => c.id === "spinebuster");
  assert.equal(spine?.cardCode, "SS1-091");
  assert.ok(spine?.deckSuperstarIds.includes("stone-cold-steve-austin"));
  assert.equal(entries.some(c => c.id === "hof1-spinebuster"), false);
  assert.equal(entries.some(c => c.cardCode === "HOF1-092"), false);
  assert.equal(finishedFrontKeys["hof1-spinebuster"], undefined);
});

test("unified export gives every card kind a predictable automatic game path", () => {
  for (const pair of [
    ['superstar','superstars'],['move','moves'],['entrance','entrances'],['special','specials'],
    ['manager','managers'],['action','actions'],['support','supports'],['momentum','momentum']
  ]) {
    assert.match(studioJs, new RegExp(`${pair[0]}:"${pair[1]}"`));
  }
  assert.match(studioJs, /assets\/cards\/art\/custom\/\$\{KIND_FOLDERS\[card\.kind\]/);
  assert.match(studioHtml, /id="export-webp"[^>]*>Export \/ Save Card<\/button>/);
  assert.match(studioHtml, /id="share-card"/);
  assert.match(studioJs, /function canvasToBlob\(type,quality\)/);
  assert.match(studioJs, /PNG fallback saved/);
  assert.match(studioJs, /Export failed:/);
});

test("Rewards identity remains embedded and direct-file safe in the unified studio", () => {
  assert.match(studioJs, /"season-1-final-boss":\{"label":"Rewards \/ Season 1 Final Boss"/);
  assert.match(studioJs, /"season-1-final-boss":"data:image\/png;base64,/);
  assert.ok(fs.existsSync(new URL("../assets/art/season-1-final-boss/rewards-logo.png", import.meta.url)));
});

test("finished WebPs are canonical fronts for all supported card types with legacy fallback", () => {
  const artwork = fs.readFileSync(new URL("../js/data/artwork.js", import.meta.url), "utf8");
  const app = fs.readFileSync(new URL("../js/ui/app.js", import.meta.url), "utf8");
  const css = fs.readFileSync(new URL("../css/game.css", import.meta.url), "utf8");
  assert.match(artwork, /export function finishedCardArtFor/);
  assert.match(artwork, /finishedFrontKeys\[card\.id\] \?\? card\.id/);
  assert.equal(finishedFrontKeys["punch"], "ss1-136-punch");
  assert.equal(finishedFrontKeys["front-dropkick"], "ss1-135-front-dropkick");
  for (const folder of ["moves","entrances","specials","managers","actions","supports","momentum"]) assert.match(artwork, new RegExp(`"${folder}"`));
  assert.match(app, /data-finished-card-art/);
  assert.match(app, /classList\.remove\('is-full-art-finished'/);
  assert.match(css, /\.ccg-card\.is-full-art-finished \.ccg-card-title/);
  assert.match(css, /\.ccg-card\.is-full-art-finished \.ccg-card-stats/);
});

test("Profile exposes one Card Art Studio and the old Superstar editor URL redirects into it", () => {
  const app = fs.readFileSync(new URL("../js/ui/app.js", import.meta.url), "utf8");
  assert.match(app, /href="\.\/tools\/card-art-studio\.html">Card Art Studio<\/a>/);
  assert.doesNotMatch(app, />Move Card Studio<\/a>|>Superstar Art Studio<\/a>/);
  assert.match(legacySuperstarHtml, /http-equiv="refresh" content="0;url=card-art-studio\.html"/);
});

test("Momentum cards have built-in method-specific mockups in game and Studio", () => {
  const app = fs.readFileSync(new URL("../js/ui/app.js", import.meta.url), "utf8");
  const css = fs.readFileSync(new URL("../css/game.css", import.meta.url), "utf8");
  const entries = studioEntries();
  const expected = [
    ["momentum-agility","SS1-064","agility"],
    ["momentum-strength","SS1-065","strength"],
    ["momentum-strike","SS1-066","strike"],
    ["momentum-technical","SS1-067","technical"]
  ];
  for (const [id,code,method] of expected) {
    const card = entries.find(c => c.id === id);
    assert.equal(card?.cardCode, code);
    assert.equal(card?.method, method);
  }
  assert.match(app, /function momentumMockupMarkup\(card\)/);
  assert.match(app, /momentum-\$\{method\}/);
  for (const cls of ["momentum-strength","momentum-strike","momentum-technical","momentum-agility"]) assert.match(css, new RegExp(`\\.${cls}`));
  assert.match(css, /v0\.11\.43 — built-in premium Momentum mockups/);
  assert.match(studioJs, /function drawMomentumMockup\(\)/);
  assert.match(studioJs, /Built-in Momentum mockup ready/);
  assert.match(studioJs, /card\.kind!=="momentum"/);
});
