import { decks } from "./decks.js";
import { ownershipCapFor } from "./card-limits.js";

export const PROFILE_KEY = "wa-modern-profile-v2";
export const STARTER_CHOICES = ["cm-punk", "roman-reigns"];
export const DECK_ASSISTANCE_MODES = ["ask", "auto", "manual"];

const cardKey = (id) => String(id);

function starterOwnership(starterId) {
  const owned = {};
  for (const card of decks[starterId] ?? []) {
    const key = cardKey(card.id);
    owned[key] ??= { normal: 0, foil: 0 };
    owned[key].normal += 1;
  }
  const superstarId = `superstar-${starterId}`;
  owned[superstarId] = { normal: 1, foil: 0 };
  return owned;
}

function starterDeckState(starterId) {
  return (decks[starterId] ?? []).map(card => ({ id: card.id, foil: false }));
}

export function createProfile(starterId) {
  if (!STARTER_CHOICES.includes(starterId)) throw new Error("Starter must be CM Punk or Roman Reigns");
  return {
    version: 7,
    starterId,
    unlockedSuperstars: [starterId],
    ownedCards: starterOwnership(starterId),
    savedDecks: { [starterId]: starterDeckState(starterId) },
    deckAssistance: "ask",
    boosterCredits: 3,
    boosterCreditsBySet: { "summerslam-series-1": 3, "hall-of-fame-series-1": 0 },
    packsOpened: 0,
    packsOpenedBySet: { "summerslam-series-1": 0, "hall-of-fame-series-1": 0 },
    packsSinceSuperstarUnlock: 0,
    packsSinceSuperstarUnlockBySet: { "summerslam-series-1": 0, "hall-of-fame-series-1": 0 },
    ladder: { activeRun: null, clears: 0, bestRung: 0, completionPackCredits: 0, firstClearSuperstarPending: false },
    championshipRoad: { activeRun: null, clears: 0, bestStage: 0, championshipPackCredits: 0, completedBy: [] },
    challenges: {},
    setProgress: { 'summerslam-series-1': { lifecycle: 'featured', claimedCollection: [], claimedFoil: [] }, 'hall-of-fame-series-1': { lifecycle: 'featured', claimedCollection: [], claimedFoil: [] } },
    createdAt: new Date().toISOString()
  };
}

export function hasSuperstar(profile, superstarId) {
  return !!profile?.unlockedSuperstars?.includes(superstarId);
}

export function unlockSuperstar(profile, superstarId) {
  if (!profile) throw new Error("Profile required");
  if (!profile.unlockedSuperstars.includes(superstarId)) {
    profile.unlockedSuperstars.push(superstarId);
    profile.savedDecks ??= {};
    profile.savedDecks[superstarId] ??= starterDeckState(superstarId);
    // Unlocking a Superstar includes a functional normal starter deck. Existing collected copies are preserved.
    const needed = starterOwnership(superstarId);
    profile.ownedCards ??= {};
    for (const [cardId, counts] of Object.entries(needed)) {
      profile.ownedCards[cardId] ??= { normal: 0, foil: 0 };
      const existing = profile.ownedCards[cardId];
      const cap = ownershipCapFor(cardId);
      const desiredTotal = Math.min(cap, Math.max(existing.normal + existing.foil, counts.normal));
      existing.normal = Math.max(0, desiredTotal - existing.foil);
    }
  }
  return profile;
}

export function ownedCount(profile, cardId, finish = "normal") {
  return profile?.ownedCards?.[cardKey(cardId)]?.[finish] ?? 0;
}

export function addOwnedCard(profile, cardId, { foil = false, amount = 1 } = {}) {
  const key = cardKey(cardId);
  profile.ownedCards ??= {};
  profile.ownedCards[key] ??= { normal: 0, foil: 0 };
  const counts = profile.ownedCards[key];
  const cap = ownershipCapFor(cardId);
  let added = 0;
  let replacedNormal = 0;

  for (let i = 0; i < amount; i += 1) {
    const total = counts.normal + counts.foil;
    if (foil) {
      if (counts.foil >= cap) break;
      if (total < cap) { counts.foil += 1; added += 1; continue; }
      if (counts.normal > 0) { counts.normal -= 1; counts.foil += 1; added += 1; replacedNormal += 1; continue; }
      break;
    }
    if (total >= cap) break;
    counts.normal += 1;
    added += 1;
  }
  return { ...counts, added, replacedNormal };
}

export function getSavedDeck(profile, superstarId) {
  return profile?.savedDecks?.[superstarId] ?? null;
}

export function ensureSavedDeck(profile, superstarId) {
  profile.savedDecks ??= {};
  profile.savedDecks[superstarId] ??= starterDeckState(superstarId);
  return profile.savedDecks[superstarId];
}

export function setDeckAssistance(profile, mode) {
  if (!DECK_ASSISTANCE_MODES.includes(mode)) throw new Error("Invalid deck assistance mode");
  profile.deckAssistance = mode;
  return profile;
}

export function migrateProfile(profile) {
  if (!profile) return null;
  profile.ownedCards ??= Object.keys(profile.ownedCards ?? {}).length ? profile.ownedCards : starterOwnership(profile.starterId);
  profile.savedDecks ??= { [profile.starterId]: starterDeckState(profile.starterId) };
  profile.deckAssistance ??= "ask";
  profile.boosterCredits ??= 0;
  profile.boosterCreditsBySet ??= { "summerslam-series-1": profile.boosterCredits ?? 0, "hall-of-fame-series-1": 0 };
  profile.boosterCreditsBySet["summerslam-series-1"] ??= profile.boosterCredits ?? 0;
  profile.boosterCreditsBySet["hall-of-fame-series-1"] ??= 0;
  profile.boosterCredits = profile.boosterCreditsBySet["summerslam-series-1"];
  profile.packsOpened ??= 0;
  profile.packsOpenedBySet ??= { "summerslam-series-1": profile.packsOpened ?? 0, "hall-of-fame-series-1": 0 };
  profile.packsSinceSuperstarUnlock ??= 0;
  profile.packsSinceSuperstarUnlockBySet ??= { "summerslam-series-1": profile.packsSinceSuperstarUnlock ?? 0, "hall-of-fame-series-1": 0 };
  profile.ladder ??= { activeRun: null, clears: 0, bestRung: 0, completionPackCredits: 0, firstClearSuperstarPending: false };
  profile.ladder.clears ??= 0;
  profile.ladder.bestRung ??= 0;
  profile.ladder.completionPackCredits ??= 0;
  profile.ladder.firstClearSuperstarPending ??= false;
  profile.championshipRoad ??= { activeRun: null, clears: 0, bestStage: 0, championshipPackCredits: 0, completedBy: [] };
  profile.championshipRoad.clears ??= 0;
  profile.championshipRoad.bestStage ??= 0;
  profile.championshipRoad.championshipPackCredits ??= 0;
  profile.championshipRoad.completedBy ??= [];
  profile.challenges ??= {};
  profile.setProgress ??= {};
  profile.setProgress['summerslam-series-1'] ??= { lifecycle: 'featured', claimedCollection: [], claimedFoil: [] };
  profile.setProgress['hall-of-fame-series-1'] ??= { lifecycle: 'featured', claimedCollection: [], claimedFoil: [] };

  // v6 ownership invariant: most cards cap at five; Superstar and Entrance cards are unique one-copy collectibles.
  for (const [cardId, counts] of Object.entries(profile.ownedCards)) {
    const cap = ownershipCapFor(cardId);
    counts.foil = Math.max(0, Math.min(cap, Number(counts.foil) || 0));
    counts.normal = Math.max(0, Math.min(cap - counts.foil, Number(counts.normal) || 0));
  }
  profile.version = 7;
  return profile;
}

export function loadProfile(storage = globalThis.localStorage) {
  if (!storage) return null;
  try {
    const raw = storage.getItem(PROFILE_KEY) ?? storage.getItem("wa-modern-profile-v1");
    if (!raw) return null;
    const parsed = migrateProfile(JSON.parse(raw));
    if (!STARTER_CHOICES.includes(parsed.starterId) || !Array.isArray(parsed.unlockedSuperstars)) return null;
    return parsed;
  } catch { return null; }
}

export function saveProfile(profile, storage = globalThis.localStorage) {
  if (!storage) return profile;
  storage.setItem(PROFILE_KEY, JSON.stringify(profile));
  storage.removeItem("wa-modern-profile-v1");
  return profile;
}

export function resetProfile(storage = globalThis.localStorage) {
  storage?.removeItem(PROFILE_KEY);
  storage?.removeItem("wa-modern-profile-v1");
}
