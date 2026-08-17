import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { createProfile, addOwnedCard } from "../js/data/profile.js?v=0.12.89";
import { decks } from "../js/data/decks.js?v=0.12.89";
import { collectionCards } from "../js/data/collection.js?v=0.12.89";
import { superstars } from "../js/data/superstars.js?v=0.12.89";
import { validateDeckDraft, selectedEntranceId, cardEligibilityForSuperstar } from "../js/data/deck-builder.js?v=0.12.89";
import { findPackUpgrades, applyUpgrade, buildPlayableDeck } from "../js/data/deck-assistant.js?v=0.12.89";

const byId = new Map(collectionCards.map(card => [card.id, card]));

test("v0.12.82 Deck Assistance finds a real Foil replacement in an unlocked saved deck", () => {
  const profile = createProfile("cm-punk");
  const card = decks["cm-punk"].find(c => c.kind === "move" && (c.damage ?? 0) > 0);
  const before = { ...(profile.ownedCards[card.id] ?? {}) };
  const result = addOwnedCard(profile, card.id, { foil: true });
  const pull = { card, foil: true, ownershipBefore: (before.normal ?? 0) + (before.foil ?? 0), replacedNormal: result.replacedNormal > 0, universePointsValue: 0 };
  const upgrades = findPackUpgrades(profile, [pull]);
  const upgrade = upgrades.find(u => u.type === "foil" && u.superstarId === "cm-punk" && u.cardId === card.id);
  assert.ok(upgrade, `expected Foil recommendation for ${card.name}`);
  assert.match(upgrade.reason, /\+1 Damage/);
});

test("v0.12.82 applying a Foil recommendation updates the saved deck and live deck damage", () => {
  const profile = createProfile("cm-punk");
  const card = decks["cm-punk"].find(c => c.kind === "move" && (c.damage ?? 0) > 0);
  const beforeOwned = (profile.ownedCards[card.id]?.normal ?? 0) + (profile.ownedCards[card.id]?.foil ?? 0);
  addOwnedCard(profile, card.id, { foil: true });
  const upgrade = findPackUpgrades(profile, [{ card, foil: true, ownershipBefore: beforeOwned, universePointsValue: 0 }]).find(u => u.type === "foil" && u.superstarId === "cm-punk");
  assert.ok(upgrade);
  assert.equal(applyUpgrade(profile, upgrade), true);
  assert.ok(profile.savedDecks["cm-punk"].some(e => e.id === card.id && e.foil));
  const live = buildPlayableDeck(profile, "cm-punk").find(c => c.id === card.id && c.foil);
  assert.ok(live);
  assert.equal(live.damage, card.damage + 1);
});

test("v0.12.82 ownership-gated recommended-build restoration swaps filler for the newly available authored copy", () => {
  const profile = createProfile("cm-punk");
  const sid = "cm-punk", star = superstars[sid], rec = decks[sid];
  const recCounts = new Map();
  for (const card of rec) recCounts.set(card.id, (recCounts.get(card.id) ?? 0) + 1);
  const target = [...recCounts.entries()].map(([id,count])=>({card:byId.get(id),count})).find(x => x.count >= 2 && x.card?.kind === "move");
  assert.ok(target);
  const draft = profile.savedDecks[sid].map(e => ({...e}));
  const targetIndices = draft.map((e,i)=>e.id===target.card.id?i:-1).filter(i=>i>=5);
  assert.ok(targetIndices.length);
  const replaceIndex = targetIndices.at(-1);
  const filler = [...recCounts.entries()].map(([id,count])=>({card:byId.get(id),count})).find(x => x.card?.id !== target.card.id && x.card?.kind === "move" && x.count < Math.min(5, Number.isFinite(x.card.maxCopies) ? x.card.maxCopies : 5));
  assert.ok(filler);
  addOwnedCard(profile, filler.card.id, { amount: 1 });
  draft[replaceIndex] = { id: filler.card.id, foil: false };
  profile.savedDecks[sid] = draft;
  const desiredCount = target.count;
  profile.ownedCards[target.card.id] = { normal: desiredCount - 1, foil: 0 };
  assert.equal(validateDeckDraft(profile,sid,draft,selectedEntranceId(profile,sid)).healthy, true);
  addOwnedCard(profile, target.card.id, { amount: 1 });
  const pull = { card: target.card, foil: false, ownershipBefore: desiredCount - 1, universePointsValue: 0 };
  const upgrade = findPackUpgrades(profile,[pull]).find(u=>u.type === "blueprint" && u.superstarId===sid && u.cardId===target.card.id);
  assert.ok(upgrade);
  assert.equal(upgrade.removeId, filler.card.id);
  assert.equal(applyUpgrade(profile,upgrade), true);
  assert.equal(profile.savedDecks[sid].filter(e=>e.id===target.card.id).length, desiredCount);
  assert.equal(profile.savedDecks[sid].filter(e=>e.id===filler.card.id).length, filler.count);
});

test("v0.12.82 Manual Deck Assistance preserves suggestions and presents explicit ADD / REMOVE changes", () => {
  const app = fs.readFileSync(new URL("../js/ui/app.js", import.meta.url), "utf8");
  const assistant = fs.readFileSync(new URL("../js/data/deck-assistant.js", import.meta.url), "utf8");
  assert.doesNotMatch(assistant, /findPackUpgrades\(\)\{return \[\]\}/);
  assert.doesNotMatch(assistant, /applyUpgrade\(\)\{return false\}/);
  assert.match(app, /Manual mode will not change the deck/);
  assert.match(app, /ADD \$\{u\.addName\} · REMOVE \$\{u\.removeName\}/);
});
