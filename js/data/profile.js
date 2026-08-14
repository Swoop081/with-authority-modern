import { decks } from "./decks.js?v=0.12.08";
import { collectionCards } from "./collection.js?v=0.12.08";
import { superstars } from "./superstars.js?v=0.12.08";

export const PROFILE_KEY = "wa-modern-profile-v2";
export const STARTER_CHOICES = ["cm-punk", "roman-reigns"];
export const DECK_ASSISTANCE_MODES = ["ask", "auto", "manual"];
export const PROFILE_VERSION = 20;

const blankSetCounters = () => ({
  "summerslam-series-1": 0,
  "hall-of-fame-series-1": 0,
  "evolution-series-1": 0,
  "season-1-final-boss": 0,
  "raw-series-1": 0,
  "worlds-collide-series-1": 0,
  "money-in-the-bank-series-1": 0,
  "smackdown-series-1": 0
});
const defaultSetProgress = () => ({
  "summerslam-series-1": { lifecycle: "featured", claimedCollection: [], claimedFoil: [] },
  "hall-of-fame-series-1": { lifecycle: "featured", claimedCollection: [], claimedFoil: [] },
  "evolution-series-1": { lifecycle: "featured", claimedCollection: [], claimedFoil: [] },
  "raw-series-1": { lifecycle: "future", claimedCollection: [], claimedFoil: [] },
  "worlds-collide-series-1": { lifecycle: "future", claimedCollection: [], claimedFoil: [] },
  "money-in-the-bank-series-1": { lifecycle: "future", claimedCollection: [], claimedFoil: [] },
  "smackdown-series-1": { lifecycle: "future", claimedCollection: [], claimedFoil: [] }
});
const defaultSeasonState = () => ({ xp: 0, claimedTiers: [], freePackLastClaimAt: null, freePacksClaimed: 0, matchXpEarned: 0, challengeXpEarned: 0 });
const cardById = new Map(collectionCards.map(c => [c.id, c]));
const starById = new Map(Object.values(superstars).map(s => [s.id, s]));

export const cardOwnershipCap = card => card?.kind === "momentum" ? 12 : (["superstar", "entrance", "manager"].includes(card?.kind) ? 1 : 5);
export function totalOwnedCopies(profile, id) {
  const o = profile?.ownedCards?.[id] ?? {};
  return (o.normal ?? 0) + (o.foil ?? 0);
}

export function addOwnedCard(profile, id, { foil = false, amount = 1 } = {}) {
  profile.ownedCards ??= {};
  profile.ownedCards[id] ??= { normal: 0, foil: 0 };
  const card = cardById.get(id), o = profile.ownedCards[id], cap = cardOwnershipCap(card);
  let added = 0, replacedNormal = 0, overflowed = 0;
  for (let i = 0; i < amount; i += 1) {
    const total = (o.normal ?? 0) + (o.foil ?? 0);
    if (foil) {
      if ((o.foil ?? 0) >= cap) { overflowed += 1; continue; }
      if (total >= cap) {
        if ((o.normal ?? 0) <= 0) { overflowed += 1; continue; }
        o.normal -= 1;
        replacedNormal += 1;
      }
      o.foil = (o.foil ?? 0) + 1;
      added += 1;
    } else {
      if (total >= cap) { overflowed += 1; continue; }
      o.normal = (o.normal ?? 0) + 1;
      added += 1;
    }
  }
  return { ...o, added, replacedNormal, overflowed, cap };
}

export function addUniversePoints(profile, amount) {
  const add = Math.max(0, Math.floor(Number(amount) || 0));
  profile.universePoints = Math.max(0, Math.floor(Number(profile.universePoints) || 0)) + add;
  return profile.universePoints;
}
export function spendUniversePoints(profile, amount) {
  const cost = Math.max(0, Math.floor(Number(amount) || 0));
  const balance = Math.max(0, Math.floor(Number(profile.universePoints) || 0));
  if (balance < cost) throw new Error(`You need ${cost} Universe Points.`);
  profile.universePoints = balance - cost;
  return profile.universePoints;
}

function ensureSavedRecommendedDeck(profile, sid) {
  const d = decks[sid] ?? [];
  if (d.length !== 55) return false;
  profile.savedDecks ??= {};
  profile.savedDecks[sid] = d.map(c => ({ id: c.id, foil: false }));
  return true;
}

export function grantSuperstarUnlockPackage(profile, sid) {
  const star = starById.get(sid), d = decks[sid] ?? [];
  if (!star || d.length !== 55) return { leadOff: [], signatures: [], rewardCards: [], deckSize: d.length, missing: 55 - d.length };
  profile.unlockedSuperstars ??= [];
  if (!profile.unlockedSuperstars.includes(sid)) profile.unlockedSuperstars.push(sid);
  ensureSavedRecommendedDeck(profile, sid);
  for (const c of d) addOwnedCard(profile, c.id, { amount: 1 });
  addOwnedCard(profile, `superstar-${sid}`, { foil: true });
  if (star.entranceId) addOwnedCard(profile, star.entranceId, { foil: true });
  profile.selectedEntrances ??= {};
  profile.selectedEntrances[sid] ??= star.entranceId;
  profile.deckNeedsCards ??= {};
  profile.deckNeedsCards[sid] = 0;
  return { leadOff: star.leadOffIds ?? d.slice(0, 5).map(c => c.id), signatures: star.signatures ?? [], rewardCards: [`superstar-${sid}`, star.entranceId].filter(Boolean), deckSize: d.length, missing: 0 };
}

// Store Superstar unlocks deliberately do not grant all 55 owned copies. They
// provide the identity + Entrance + Lead Off 5, while a complete recommended
// deck remains available for immediate play and boosters continue building the
// owned collection around it.
export function grantStoreSuperstarUnlockPackage(profile, sid) {
  const star = starById.get(sid), d = decks[sid] ?? [];
  if (!star || d.length !== 55) throw new Error("That Superstar deck is not available.");
  profile.unlockedSuperstars ??= [];
  if (profile.unlockedSuperstars.includes(sid)) return { alreadyOwned: true, superstarId: sid };
  profile.unlockedSuperstars.push(sid);
  // A Superstar unlock grants identity + linked Entrance only. The recommended
  // deck is a blueprint and is assembled later from cards actually owned.
  addOwnedCard(profile, `superstar-${sid}`, { foil: true });
  if (star.entranceId) addOwnedCard(profile, star.entranceId, { foil: true });
  profile.selectedEntrances ??= {};
  profile.selectedEntrances[sid] ??= star.entranceId;
  profile.savedDecks ??= {};
  delete profile.savedDecks[sid];
  profile.deckNeedsCards ??= {};
  profile.deckNeedsCards[sid] = 55;
  return { alreadyOwned: false, superstarId: sid, entranceId: star.entranceId, deckSize: d.length, missing: 55 };
}

export function createProfile(starterId) {
  if (!STARTER_CHOICES.includes(starterId) || !decks[starterId]) throw new Error("Starter must be CM Punk or Roman Reigns");
  const p = {
    version: PROFILE_VERSION,
    starterId,
    universePoints: 0,
    unlockedSuperstars: [],
    favouriteSuperstars: [],
    ownedCards: {},
    savedDecks: {},
    selectedEntrances: {},
    deckNeedsCards: {},
    deckAssistance: "ask",
    boosterCredits: 0,
    boosterCreditsBySet: blankSetCounters(),
    packsOpened: 0,
    packsOpenedBySet: blankSetCounters(),
    packsSinceSuperstarUnlock: 0,
    packsSinceSuperstarUnlockBySet: blankSetCounters(),
    ladder: { activeRun: null, clears: 0, bestRung: 0, completionPackCredits: 0, completionPackCreditsBySet: blankSetCounters(), firstClearSuperstarPending: false },
    championshipRoad: { activeRun: null, clears: 0, bestStage: 0, championshipPackCredits: 0, championshipPackCreditsBySet: blankSetCounters(), completedBy: [] },
    challenges: {},
    seasons: { "season-1": defaultSeasonState() },
    setProgress: defaultSetProgress(),
    storePurchases: [],
    pendingUnlockCelebrations: [],
    onboarding: { complete: false, step: 0 },
    createdAt: new Date().toISOString()
  };
  grantSuperstarUnlockPackage(p, starterId);
  // Internal Season 1 development build: future RAW content is unlocked for testing/artwork.
  grantSuperstarUnlockPackage(p, "logan-paul");
  grantSuperstarUnlockPackage(p, "sol-ruca");
  grantSuperstarUnlockPackage(p, "chad-gable");
  grantSuperstarUnlockPackage(p, "raquel-rodriguez");
  grantSuperstarUnlockPackage(p, "rey-mysterio");
  grantSuperstarUnlockPackage(p, "dominik-mysterio");
  grantSuperstarUnlockPackage(p, "penta");
  grantSuperstarUnlockPackage(p, "el-grande-americano");
  grantSuperstarUnlockPackage(p, "jey-uso");
  grantSuperstarUnlockPackage(p, "la-knight");
  grantSuperstarUnlockPackage(p, "alexa-bliss");
  grantSuperstarUnlockPackage(p, "finn-balor");
  grantSuperstarUnlockPackage(p, "danhausen");
  grantSuperstarUnlockPackage(p, "tiffany-stratton");
  grantSuperstarUnlockPackage(p, "chelsea-green");
  return p;
}

export function hasSuperstar(p, id) { return !!p?.unlockedSuperstars?.includes(id); }
export function unlockSuperstar(p, id) { grantSuperstarUnlockPackage(p, id); return p; }
export function ownedCount(p, id, finish = "normal") { return p?.ownedCards?.[id]?.[finish] ?? 0; }
export function getSavedDeck(p, id) { return p?.savedDecks?.[id] ?? []; }
export function ensureSavedDeck(p, id) { p.savedDecks ??= {}; return p.savedDecks[id] ??= []; }
export function setDeckAssistance(p, m) { if (DECK_ASSISTANCE_MODES.includes(m)) p.deckAssistance = m; return p; }

export function migrateProfile(old) {
  if (!old?.starterId || !STARTER_CHOICES.includes(old.starterId) || !decks[old.starterId]) return null;
  const p = JSON.parse(JSON.stringify(old));
  p.version = PROFILE_VERSION;
  p.universePoints = Math.max(0, Math.floor(Number(p.universePoints) || 0));
  p.unlockedSuperstars = [...new Set((p.unlockedSuperstars ?? [p.starterId]).filter(id => decks[id] && starById.has(id)))];
  if (!p.unlockedSuperstars.includes(p.starterId)) p.unlockedSuperstars.unshift(p.starterId);
  p.favouriteSuperstars = (p.favouriteSuperstars ?? []).filter(id => p.unlockedSuperstars.includes(id));
  p.ownedCards ??= {};
  p.savedDecks ??= {};
  p.selectedEntrances ??= {};
  p.deckNeedsCards ??= {};
  p.deckAssistance = DECK_ASSISTANCE_MODES.includes(p.deckAssistance) ? p.deckAssistance : "ask";
  p.boosterCredits = Math.max(0, Number(p.boosterCredits) || 0);
  p.boosterCreditsBySet = { ...blankSetCounters(), ...(p.boosterCreditsBySet ?? {}) };
  p.packsOpened = Math.max(0, Number(p.packsOpened) || 0);
  p.packsOpenedBySet = { ...blankSetCounters(), ...(p.packsOpenedBySet ?? {}) };
  p.packsSinceSuperstarUnlock = Math.max(0, Number(p.packsSinceSuperstarUnlock) || 0);
  p.packsSinceSuperstarUnlockBySet = { ...blankSetCounters(), ...(p.packsSinceSuperstarUnlockBySet ?? {}) };
  p.ladder = { activeRun: null, clears: 0, bestRung: 0, completionPackCredits: 0, completionPackCreditsBySet: blankSetCounters(), firstClearSuperstarPending: false, ...(p.ladder ?? {}) };
  p.ladder.completionPackCreditsBySet = { ...blankSetCounters(), ...(p.ladder.completionPackCreditsBySet ?? {}) };
  p.championshipRoad = { activeRun: null, clears: 0, bestStage: 0, championshipPackCredits: 0, championshipPackCreditsBySet: blankSetCounters(), completedBy: [], ...(p.championshipRoad ?? {}) };
  p.championshipRoad.championshipPackCreditsBySet = { ...blankSetCounters(), ...(p.championshipRoad.championshipPackCreditsBySet ?? {}) };
  p.championshipRoad.completedBy ??= [];
  p.challenges ??= {};
  p.seasons ??= {};
  p.seasons["season-1"] = { ...defaultSeasonState(), ...(p.seasons["season-1"] ?? {}) };
  p.seasons["season-1"].claimedTiers ??= [];
  p.setProgress = { ...defaultSetProgress(), ...(p.setProgress ?? {}) };
  for (const [setId, state] of Object.entries(defaultSetProgress())) p.setProgress[setId] = { ...state, ...(p.setProgress[setId] ?? {}) };
  p.storePurchases ??= [];
  p.pendingUnlockCelebrations ??= [];
  // Existing profiles should not be forced back through the first-match coach.
  p.onboarding = { complete: true, step: 0, ...(p.onboarding ?? {}) };
  p.createdAt ??= new Date().toISOString();

  // Preserve identity/Entrance ownership, but never let a saved deck contain
  // more copies than the Collection actually owns. Older builds auto-installed
  // recommended 55-card lists, so migration trims those phantom copies.
  for (const sid of p.unlockedSuperstars) {
    const star = starById.get(sid);
    addOwnedCard(p, `superstar-${sid}`, { foil: true });
    if (star?.entranceId) addOwnedCard(p, star.entranceId, { foil: true });
    if (!p.selectedEntrances[sid] && star?.entranceId) p.selectedEntrances[sid] = star.entranceId;
    const saved = Array.isArray(p.savedDecks?.[sid]) ? p.savedDecks[sid] : null;
    if (saved) {
      const used = new Map();
      p.savedDecks[sid] = saved.filter(entry => {
        const id = typeof entry === "string" ? entry : entry?.id;
        if (!id) return false;
        const n = used.get(id) ?? 0;
        const owned = totalOwnedCopies(p,id);
        if (n >= owned) return false;
        used.set(id,n+1); return true;
      }).map(entry => typeof entry === "string" ? {id:entry,foil:false} : entry);
    }
  }
  if (!p.unlockedSuperstars.includes("logan-paul")) grantSuperstarUnlockPackage(p, "logan-paul");
  grantSuperstarUnlockPackage(p, "sol-ruca");
  grantSuperstarUnlockPackage(p, "chad-gable");
  grantSuperstarUnlockPackage(p, "raquel-rodriguez");
  grantSuperstarUnlockPackage(p, "rey-mysterio");
  grantSuperstarUnlockPackage(p, "dominik-mysterio");
  grantSuperstarUnlockPackage(p, "penta");
  grantSuperstarUnlockPackage(p, "el-grande-americano");
  grantSuperstarUnlockPackage(p, "jey-uso");
  grantSuperstarUnlockPackage(p, "la-knight");
  grantSuperstarUnlockPackage(p, "alexa-bliss");
  grantSuperstarUnlockPackage(p, "finn-balor");
  grantSuperstarUnlockPackage(p, "danhausen");
  grantSuperstarUnlockPackage(p, "tiffany-stratton");
  grantSuperstarUnlockPackage(p, "chelsea-green");
  return p;
}

export function loadProfile(storage = globalThis.localStorage) {
  try {
    if (!storage) return null;
    const raw = storage.getItem(PROFILE_KEY) ?? storage.getItem("wa-modern-profile-v1");
    return raw ? migrateProfile(JSON.parse(raw)) : null;
  } catch { return null; }
}
export function saveProfile(p, storage = globalThis.localStorage) {
  storage?.setItem(PROFILE_KEY, JSON.stringify(p));
  storage?.removeItem("wa-modern-profile-v1");
  return p;
}
export function resetProfile(storage = globalThis.localStorage) {
  storage?.removeItem(PROFILE_KEY);
  storage?.removeItem("wa-modern-profile-v1");
}
export function buildBestOwnedDeck(_p, sid) { return decks[sid] ?? []; }
