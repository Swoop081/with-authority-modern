import { cards } from "./cards.js?v=0.11.37";
import { hallCards } from "./hall-of-fame-cards.js?v=0.11.37";
import { evolutionCards } from "./evolution-cards.js?v=0.11.37";
import { rockCards } from "./season1-rock-cards.js?v=0.11.37";
import { superstars } from "./superstars.js?v=0.11.37";
import { sets } from "./sets.js?v=0.11.37";
import { decks } from "./decks.js?v=0.11.37";

const rarity = { common: 1, uncommon: 2, rare: 3, veryRare: 4 };
const rarityLabels = { 1: "Common", 2: "Uncommon", 3: "Rare", 4: "Very Rare" };

// Collector numbers are permanent once published/artwork production begins.
// Retired numbers stay as gaps instead of being reused or shifting later cards.
const retiredCollectorNumbersBySet = {
  "hall-of-fame-series-1": new Set([92, 100]),
};

const summerStarOrder = [superstars.codyRhodes, superstars.cmPunk, superstars.romanReigns, superstars.sethRollins, superstars.obaFemi, superstars.brockLesnar, superstars.kevinOwens, superstars.gunther];
const hallStarOrder = [superstars.hulkHogan, superstars.andreTheGiant, superstars.randySavage, superstars.ultimateWarrior, superstars.stoneCold, superstars.undertaker, superstars.mankind, superstars.kane];
const evolutionStarOrder = [superstars.rheaRipley, superstars.livMorgan, superstars.beckyLynch, superstars.bayley, superstars.charlotteFlair, superstars.iyoSky, superstars.paige, superstars.stephanieVaquer];

function flattenCardObject(source) {
  const out = [];
  for (const value of Object.values(source)) {
    if (value?.id) out.push(value);
    else if (value && typeof value === "object") for (const nested of Object.values(value)) if (nested?.id) out.push(nested);
  }
  return out;
}

const summerCards = flattenCardObject(cards);
const hofCards = flattenCardObject(hallCards);
const evolutionSourceCards = flattenCardObject(evolutionCards);
const rockSourceCards = flattenCardObject(rockCards);

const rarityFor = (card) => {
  if (card.finisher) return rarity.veryRare;
  if (card.trademark) return rarity.rare;
  if (card.kind === "entrance" || card.kind === "support" || card.kind === "manager" || card.counterAny) return rarity.rare;
  if (card.superstarId || card.kind === "special" || card.kind === "action") return rarity.uncommon;
  return rarity.common;
};

const superstarEntry = (star) => ({
  id: `superstar-${star.id}`,
  name: star.name,
  kind: "superstar",
  superstarId: star.id,
  subtitle: star.nickname,
  rarity: rarity.veryRare,
  hp: star.hp,
  abilityName: star.ability.name,
  abilityText: star.ability.text,
  setId: star.setId,
  era: star.era ?? null
});

function buildSetCollection(setId, starOrder, sourceCards) {
  // Active booster pools contain only cards used by a current starter in this set,
  // plus linked Entrances and approved Managers. Shared cards first printed in an
  // earlier set are referenced directly by later starter decks and are not reprinted.
  const activeIds = new Set();
  const starIds = new Set(starOrder.map(star => star.id));
  for (const star of starOrder) {
    for (const card of decks[star.id] ?? []) activeIds.add(card.id);
    if (star.entranceId) activeIds.add(star.entranceId);
  }
  for (const card of sourceCards) {
    if (card.kind === "manager" && (card.allowedSuperstarIds ?? []).some(id => starIds.has(id))) activeIds.add(card.id);
  }
  const activeSourceCards = sourceCards.filter(card => activeIds.has(card.id));

  const ordered = [];
  for (const star of starOrder) {
    ordered.push(superstarEntry(star));
    const starCards = activeSourceCards.filter(c => c.superstarId === star.id && !c.preserveSharedCollectorOrder);
    const entranceCards = starCards.filter(c => c.kind === "entrance");
    const otherCards = starCards.filter(c => c.kind !== "entrance");
    for (const card of [...entranceCards, ...otherCards]) ordered.push({ ...card, rarity: rarityFor(card), setId });
  }
  for (const card of activeSourceCards) {
    if (card.superstarId && !card.preserveSharedCollectorOrder) continue;
    if (!ordered.some(x => x.id === card.id)) ordered.push({ ...card, rarity: rarityFor(card), setId });
  }
  const retiredNumbers = retiredCollectorNumbersBySet[setId] ?? new Set();
  let nextNumber = 1;
  return ordered.map((entry) => {
    while (retiredNumbers.has(nextNumber)) nextNumber += 1;
    const cardNumber = nextNumber++;
    return { ...entry, cardNumber, cardCode: `${sets[setId].shortCode}-${String(cardNumber).padStart(3, "0")}` };
  });
}

export const collectionCardsBySet = {
  "summerslam-series-1": buildSetCollection("summerslam-series-1", summerStarOrder, summerCards),
  "hall-of-fame-series-1": buildSetCollection("hall-of-fame-series-1", hallStarOrder, hofCards),
  "evolution-series-1": buildSetCollection("evolution-series-1", evolutionStarOrder, evolutionSourceCards),
  "season-1-final-boss": buildSetCollection("season-1-final-boss", [superstars.theRock], rockSourceCards)
};

export const collectionCards = Object.values(collectionCardsBySet).flat();
export const setCollections = Object.fromEntries(Object.entries(collectionCardsBySet).map(([setId, list]) => [setId, {
  ...sets[setId],
  cardCount: list.length,
  superstarCount: list.filter(c => c.kind === "superstar").length,
  rarityLabels
}]));

// Backwards-compatible alias for SummerSlam code/tests while the UI becomes multi-set aware.
export const setCollection = setCollections["summerslam-series-1"];
export function cardsForSet(setId) { return collectionCardsBySet[setId] ?? []; }
export function setCollectionFor(setId) { return setCollections[setId] ?? null; }
