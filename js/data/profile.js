import { decks } from "./decks.js?v=0.11.44";
import { ownershipCapFor } from "./card-limits.js?v=0.11.44";
import { superstars } from "./superstars.js?v=0.11.44";

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
  const entranceId = Object.values(superstars).find(s => s.id === starterId)?.entranceId;
  if (entranceId) owned[entranceId] = { normal: 0, foil: 1 };
  const superstarId = `superstar-${starterId}`;
  owned[superstarId] = { normal: 0, foil: 1 };
  return owned;
}

function starterDeckState(starterId) {
  return (decks[starterId] ?? []).map(card => ({ id: card.id, foil: false }));
}



function allDeckCardsById() {
  const map = new Map();
  for (const deck of Object.values(decks)) for (const card of deck) if (card?.id && !map.has(card.id)) map.set(card.id, card);
  return map;
}

function legalOwnedCardFor(card, superstarId) {
  if (!card || card.kind === "superstar" || card.kind === "entrance" || card.kind === "manager") return false;
  return !card.superstarId || card.superstarId === superstarId;
}

function grantNormalUpTo(profile, cardId, desiredTotal) {
  if (!cardId || desiredTotal <= 0) return;
  profile.ownedCards ??= {};
  profile.ownedCards[cardId] ??= { normal: 0, foil: 0 };
  const counts = profile.ownedCards[cardId];
  const cap = ownershipCapFor(cardId);
  const target = Math.min(cap, desiredTotal);
  const total = (counts.normal || 0) + (counts.foil || 0);
  if (total < target) counts.normal += target - total;
}

function grantFoilUnique(profile, cardId) {
  if (!cardId) return;
  profile.ownedCards ??= {};
  profile.ownedCards[cardId] = { normal: 0, foil: 1 };
}

function unlockEssentialIds(superstarId) {
  const star = Object.values(superstars).find(s => s.id === superstarId);
  const deck = decks[superstarId] ?? [];
  const leadOff = star?.leadOffIds ?? deck.slice(0, 5).map(c => c.id);
  const signatures = [];
  for (const card of deck) {
    if ((card.finisher || card.trademark) && !signatures.includes(card.id)) signatures.push(card.id);
  }
  return { star, leadOff, signatures };
}

export function buildBestOwnedDeck(profile, superstarId) {
  const recommended = decks[superstarId] ?? [];
  const { star, leadOff } = unlockEssentialIds(superstarId);
  if (!star || leadOff.length !== 5) return [];

  const pool = allDeckCardsById();
  const available = new Map();
  for (const [id, counts] of Object.entries(profile?.ownedCards ?? {})) {
    const card = pool.get(id);
    if (!legalOwnedCardFor(card, superstarId)) continue;
    available.set(id, Math.max(0, (counts.normal || 0) + (counts.foil || 0)));
  }

  const out = [];
  const use = id => {
    const left = available.get(id) ?? 0;
    if (left <= 0) return false;
    const counts = profile.ownedCards[id] ?? { normal: 0, foil: 0 };
    const usedFoil = out.filter(e => e.id === id && e.foil).length;
    const foil = usedFoil < (counts.foil || 0);
    out.push({ id, foil });
    available.set(id, left - 1);
    return true;
  };

  // Lead Off is a fixed identity package and is always granted on unlock.
  for (const id of leadOff) if (!use(id)) return [];

  // Prefer the Superstar's tuned recommended list for the remaining 50.
  for (const card of recommended.slice(5)) {
    if (out.length >= 55) break;
    use(card.id);
  }

  // Then use any other genuinely owned legal pages, favoring Moves, Momentum,
  // and lower-cost offense so a newly unlocked Superstar is functional quickly.
  const extras = [...available.entries()]
    .filter(([, count]) => count > 0)
    .map(([id]) => pool.get(id))
    .filter(Boolean)
    .sort((a, b) => {
      const kindRank = c => c.kind === "move" ? 0 : c.kind === "momentum" ? 1 : c.kind === "action" ? 2 : 3;
      const kr = kindRank(a) - kindRank(b);
      if (kr) return kr;
      if (a.kind === "move" && b.kind === "move") {
        if (!!a.finisher !== !!b.finisher) return a.finisher ? -1 : 1;
        if (!!a.trademark !== !!b.trademark) return a.trademark ? -1 : 1;
        return (Number(a.cost) || 0) - (Number(b.cost) || 0);
      }
      return String(a.id).localeCompare(String(b.id));
    });
  for (const card of extras) {
    while (out.length < 55 && (available.get(card.id) ?? 0) > 0) use(card.id);
    if (out.length >= 55) break;
  }
  return out;
}

export function grantSuperstarUnlockPackage(profile, superstarId) {
  const { star, leadOff, signatures } = unlockEssentialIds(superstarId);
  if (!star) throw new Error(`Unknown Superstar: ${superstarId}`);
  profile.ownedCards ??= {};

  // Superstar + linked Entrance are unique collectibles.
  grantFoilUnique(profile, `superstar-${superstarId}`);
  grantFoilUnique(profile, star.entranceId);

  // The fixed five become real collection ownership. Duplicate identities in the
  // package grant the exact number of copies required by Lead Off.
  const leadCounts = new Map();
  for (const id of leadOff) leadCounts.set(id, (leadCounts.get(id) ?? 0) + 1);
  for (const [id, count] of leadCounts) grantNormalUpTo(profile, id, count);

  // Unlocking a wrestler must include their identity: one real owned copy of each
  // Finisher and Trademark. Additional copies still come from boosters/rewards.
  for (const id of signatures) grantNormalUpTo(profile, id, 1);

  const deck = buildBestOwnedDeck(profile, superstarId);
  profile.savedDecks ??= {};
  profile.savedDecks[superstarId] = deck;
  profile.deckNeedsCards ??= {};
  profile.deckNeedsCards[superstarId] = Math.max(0, 55 - deck.length);
  const rewardCards = [`superstar-${superstarId}`, star.entranceId, ...leadOff, ...signatures];
  return { leadOff: [...leadOff], signatures: [...signatures], rewardCards: [...new Set(rewardCards)], deckSize: deck.length, missing: Math.max(0, 55 - deck.length) };
}

export function createProfile(starterId) {
  if (!STARTER_CHOICES.includes(starterId)) throw new Error("Starter must be CM Punk or Roman Reigns");
  return {
    version: 11,
    starterId,
    unlockedSuperstars: [starterId],
    favouriteSuperstars: [],
    ownedCards: starterOwnership(starterId),
    savedDecks: { [starterId]: starterDeckState(starterId) },
    deckAssistance: "ask",
    boosterCredits: 3,
    boosterCreditsBySet: { "summerslam-series-1": 3, "hall-of-fame-series-1": 0, "evolution-series-1": 0 },
    packsOpened: 0,
    packsOpenedBySet: { "summerslam-series-1": 0, "hall-of-fame-series-1": 0, "evolution-series-1": 0 },
    packsSinceSuperstarUnlock: 0,
    packsSinceSuperstarUnlockBySet: { "summerslam-series-1": 0, "hall-of-fame-series-1": 0, "evolution-series-1": 0 },
    ladder: { activeRun: null, clears: 0, bestRung: 0, completionPackCredits: 0, firstClearSuperstarPending: false },
    championshipRoad: { activeRun: null, clears: 0, bestStage: 0, championshipPackCredits: 0, completedBy: [] },
    challenges: {},
    seasons: { 'season-1': { xp: 0, claimedTiers: [], freePackLastClaimAt: null, freePacksClaimed: 0, matchXpEarned: 0, challengeXpEarned: 0 } },
    setProgress: { 'summerslam-series-1': { lifecycle: 'featured', claimedCollection: [], claimedFoil: [] }, 'hall-of-fame-series-1': { lifecycle: 'featured', claimedCollection: [], claimedFoil: [] }, 'evolution-series-1': { lifecycle: 'featured', claimedCollection: [], claimedFoil: [] } },
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
    const unlockPackage = grantSuperstarUnlockPackage(profile, superstarId);
    profile.pendingUnlockCelebrations ??= [];
    profile.pendingUnlockCelebrations.push({ superstarId, cardIds: unlockPackage.rewardCards, createdAt: new Date().toISOString() });
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
  profile.favouriteSuperstars ??= [];
  profile.favouriteSuperstars = profile.favouriteSuperstars.filter(id => profile.unlockedSuperstars?.includes(id));
  profile.deckAssistance ??= "ask";
  profile.boosterCredits ??= 0;
  profile.boosterCreditsBySet ??= { "summerslam-series-1": profile.boosterCredits ?? 0, "hall-of-fame-series-1": 0 };
  profile.boosterCreditsBySet["summerslam-series-1"] ??= profile.boosterCredits ?? 0;
  profile.boosterCreditsBySet["hall-of-fame-series-1"] ??= 0;
  profile.boosterCreditsBySet["evolution-series-1"] ??= 0;
  profile.boosterCredits = profile.boosterCreditsBySet["summerslam-series-1"];
  profile.packsOpened ??= 0;
  profile.packsOpenedBySet ??= { "summerslam-series-1": profile.packsOpened ?? 0, "hall-of-fame-series-1": 0, "evolution-series-1": 0 };
  profile.packsOpenedBySet["evolution-series-1"] ??= 0;
  profile.packsSinceSuperstarUnlock ??= 0;
  profile.packsSinceSuperstarUnlockBySet ??= { "summerslam-series-1": profile.packsSinceSuperstarUnlock ?? 0, "hall-of-fame-series-1": 0, "evolution-series-1": 0 };
  profile.packsSinceSuperstarUnlockBySet["evolution-series-1"] ??= 0;
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
  profile.seasons ??= {};
  profile.seasons['season-1'] ??= { xp: 0, claimedTiers: [], freePackLastClaimAt: null, freePacksClaimed: 0, matchXpEarned: 0, challengeXpEarned: 0 };
  profile.setProgress ??= {};
  profile.setProgress['summerslam-series-1'] ??= { lifecycle: 'featured', claimedCollection: [], claimedFoil: [] };
  profile.setProgress['hall-of-fame-series-1'] ??= { lifecycle: 'featured', claimedCollection: [], claimedFoil: [] };
  profile.setProgress['evolution-series-1'] ??= { lifecycle: 'featured', claimedCollection: [], claimedFoil: [] };

  // v6 ownership invariant: most cards cap at five; Superstar and Entrance cards are unique one-copy collectibles.
  for (const [cardId, counts] of Object.entries(profile.ownedCards)) {
    const cap = ownershipCapFor(cardId);
    counts.foil = Math.max(0, Math.min(cap, Number(counts.foil) || 0));
    counts.normal = Math.max(0, Math.min(cap - counts.foil, Number(counts.normal) || 0));
    if ((cardId.startsWith("superstar-") || cardId.startsWith("entrance-")) && counts.normal + counts.foil > 0) { counts.normal = 0; counts.foil = 1; }
  }
  profile.version = 11;
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
