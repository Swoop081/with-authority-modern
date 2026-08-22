import test from "node:test";
import assert from "node:assert/strict";
import { allGameplayCards } from "../js/data/content.js?v=0.14.04";
import { deckIds } from "../js/data/decks.js?v=0.14.04";
import { superstars } from "../js/data/superstars.js?v=0.14.04";
import { CARD_NUMBER_BY_ID } from "../js/data/card-number-manifest.js?v=0.14.04";
import { createProfile, migrateProfile, PROFILE_VERSION } from "../js/data/profile.js?v=0.14.04";

const byId = Object.fromEntries(allGameplayCards.map(card => [card.id, card]));
const razor = Object.values(superstars).find(star => star.id === "razor-ramon");
const ids = deckIds["razor-ramon"];

test("v0.14.03 replaces Razor’s Chokeslam with Rare Trademark Razor’s Bulldog", () => {
  assert.equal(byId["razor-ramon-chokeslam"], undefined);
  const bulldog = byId["razor-ramon-bulldog"];
  assert.ok(bulldog);
  assert.equal(bulldog.name, "Razor’s Bulldog");
  assert.equal(bulldog.rarity, 3);
  assert.equal(bulldog.trademark, true);
  assert.equal(bulldog.cost, 5);
  assert.equal(bulldog.damage, 8);
  assert.equal(bulldog.method, "technical");
  assert.deepEqual(bulldog.requirements, { technical: 1 });
  assert.equal(bulldog.groundOpponent, true);
  assert.deepEqual(bulldog.effects, [{ type: "search", name: "The Razor’s Edge", discount: 1 }]);
});

test("v0.14.03 preserves NG1-017 and Razor’s three-copy signature slot", () => {
  assert.equal(CARD_NUMBER_BY_ID["razor-ramon-bulldog"].cardCode, "NG1-017");
  assert.equal(CARD_NUMBER_BY_ID["razor-ramon-chokeslam"], undefined);
  assert.equal(ids.filter(id => id === "razor-ramon-bulldog").length, 3);
  assert.equal(ids.includes("razor-ramon-chokeslam"), false);
  assert.ok(razor.signatures.includes("razor-ramon-bulldog"));
  assert.equal(razor.signatures.includes("razor-ramon-chokeslam"), false);
});

test("v0.14.03 redirects Razor’s Fallaway Slam into Razor’s Bulldog", () => {
  const fallaway = byId["razor-ramon-fallaway-slam"];
  assert.match(fallaway.rulesText, /next Razor’s Bulldog costs 1 less/);
  assert.deepEqual(fallaway.effects, [{ type: "discountNextByName", name: "Razor’s Bulldog", amount: 1 }]);
});

test("v0.14.03 migrates Chokeslam ownership and saved deck entries to Razor’s Bulldog", () => {
  const p = createProfile("cm-punk");
  p.version = 37;
  p.unlockedSuperstars.push("razor-ramon");
  p.ownedCards["razor-ramon-chokeslam"] = { normal: 2, emerald: 1, sapphire: 1, ruby: 1 };
  p.savedDecks["razor-ramon"] = [
    { id: "razor-ramon-chokeslam", tier: "normal" },
    { id: "razor-ramon-chokeslam", tier: "emerald" },
    { id: "razor-ramon-chokeslam", tier: "sapphire" },
    { id: "razor-ramon-chokeslam", tier: "ruby" },
  ];
  const migrated = migrateProfile(p);
  assert.equal(migrated.version, PROFILE_VERSION);
  assert.ok(PROFILE_VERSION >= 38);
  assert.equal(migrated.ownedCards["razor-ramon-chokeslam"], undefined);
  assert.deepEqual(migrated.ownedCards["razor-ramon-bulldog"], { normal: 2, emerald: 1, sapphire: 1, ruby: 1 });
  assert.deepEqual(migrated.savedDecks["razor-ramon"].map(entry => entry.id), Array(4).fill("razor-ramon-bulldog"));
});
