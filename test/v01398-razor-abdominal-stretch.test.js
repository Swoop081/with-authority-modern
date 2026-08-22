import test from "node:test";
import assert from "node:assert/strict";
import { allGameplayCards } from "../js/data/content.js?v=0.14.03";
import { decks } from "../js/data/decks.js?v=0.14.03";
import { superstars } from "../js/data/superstars.js?v=0.14.03";
import { CARD_NUMBER_BY_ID } from "../js/data/card-number-manifest.js?v=0.14.03";
import { createProfile, migrateProfile, PROFILE_VERSION } from "../js/data/profile.js?v=0.14.03";

const byId = Object.fromEntries(allGameplayCards.map(card => [card.id, card]));
const razor = Object.values(superstars).find(star => star.id === "razor-ramon");

test.skip("v0.13.98 historical Abdominal Stretch launch profile (superseded by v0.14.01 Technical requirement)", () => {
  const card = byId["razor-ramon-abdominal-stretch"];
  assert.ok(card);
  assert.equal(byId["razor-ramon-running-powerslam"], undefined);
  assert.equal(card.name, "Razor’s Abdominal Stretch");
  assert.equal(card.rarity, 3);
  assert.equal(card.trademark, true);
  assert.equal(card.cost, 5);
  assert.equal(card.damage, 0);
  assert.equal(card.moveType, "submission");
  assert.equal(card.method, "technical");
  assert.deepEqual(card.requirements, { technical: 2 });
  assert.deepEqual(card.submission, { bodyPart: "chest", pressure: 5 });
  assert.equal(card.standingOnly, true);
  assert.equal(card.counterState, "rear-control");
  assert.equal(card.submissionTarget, "back");
});

test("v0.13.98 preserves NG1-016 and Razor's authored three-copy signature slot", () => {
  assert.equal(CARD_NUMBER_BY_ID["razor-ramon-abdominal-stretch"].cardCode, "NG1-016");
  assert.equal(decks["razor-ramon"].filter(card => card.id === "razor-ramon-abdominal-stretch").length, 3);
  assert.equal(decks["razor-ramon"].some(card => card.id === "razor-ramon-running-powerslam"), false);
  assert.ok(razor.signatures.includes("razor-ramon-abdominal-stretch"));
  assert.equal(razor.signatures.includes("razor-ramon-running-powerslam"), false);
});

test.skip("v0.13.98 keeps Razor's Fallaway Slam combo legal by discounting Chokeslam directly — superseded by v0.14.03 Razor’s Bulldog", () => {
  const fallaway = byId["razor-ramon-fallaway-slam"];
  assert.match(fallaway.rulesText, /next Razor’s Chokeslam costs 1 less/);
  assert.deepEqual(fallaway.effects, [{ type: "discountNextByName", name: "Razor’s Chokeslam", amount: 1 }]);
});

test("v0.13.98 migrates owned Running Powerslam printings and saved deck entries", () => {
  const p = createProfile("cm-punk");
  p.version = 36;
  p.unlockedSuperstars.push("razor-ramon");
  p.ownedCards["razor-ramon-running-powerslam"] = { normal: 2, emerald: 1, sapphire: 1, ruby: 1 };
  p.savedDecks["razor-ramon"] = [
    { id: "razor-ramon-running-powerslam", tier: "normal" },
    { id: "razor-ramon-running-powerslam", tier: "emerald" },
    { id: "razor-ramon-running-powerslam", tier: "sapphire" },
    { id: "razor-ramon-running-powerslam", tier: "ruby" },
  ];
  const migrated = migrateProfile(p);
  assert.equal(migrated.version, PROFILE_VERSION);
  assert.equal(migrated.ownedCards["razor-ramon-running-powerslam"], undefined);
  assert.deepEqual(migrated.ownedCards["razor-ramon-abdominal-stretch"], { normal: 2, emerald: 1, sapphire: 1, ruby: 1 });
  assert.deepEqual(migrated.savedDecks["razor-ramon"].map(entry => entry.id), Array(4).fill("razor-ramon-abdominal-stretch"));
});
