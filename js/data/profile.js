import { decks } from "./decks.js?v=0.12.51";
import { collectionCards } from "./collection.js?v=0.12.51";
import { superstars } from "./superstars.js?v=0.12.51";
import { isUnreleasedSetId } from "./release.js?v=0.12.51";

export const PROFILE_KEY = "wa-modern-profile-v2";
export const STARTER_CHOICES = ["cm-punk", "roman-reigns"];
export const DECK_ASSISTANCE_MODES = ["ask", "auto", "manual"];
export const PROFILE_VERSION = 25;

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
  if (d.length !== 60) return false;
  profile.savedDecks ??= {};
  profile.savedDecks[sid] = d.map(c => ({ id: c.id, foil: false }));
  return true;
}

export function grantSuperstarUnlockPackage(profile, sid) {
  const star = starById.get(sid), d = decks[sid] ?? [];
  if (!star || d.length !== 60) return { leadOff: [], signatures: [], rewardCards: [], deckSize: d.length, missing: 60 - d.length };
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

// Store Superstar unlocks deliberately do not grant all 60 owned copies. They
// provide the identity + Entrance + Lead Off 5, while a complete recommended
// deck remains available for immediate play and boosters continue building the
// owned collection around it.
export function grantStoreSuperstarUnlockPackage(profile, sid) {
  const star = starById.get(sid), d = decks[sid] ?? [];
  if (!star || d.length !== 60) throw new Error("That Superstar deck is not available.");
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
  profile.deckNeedsCards[sid] = 60;
  return { alreadyOwned: false, superstarId: sid, entranceId: star.entranceId, deckSize: d.length, missing: 60 };
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
  return p;
}

export function hasSuperstar(p, id) { return !!p?.unlockedSuperstars?.includes(id); }
export function unlockSuperstar(p, id) { grantSuperstarUnlockPackage(p, id); return p; }
export function ownedCount(p, id, finish = "normal") { return p?.ownedCards?.[id]?.[finish] ?? 0; }
export function getSavedDeck(p, id) { return p?.savedDecks?.[id] ?? []; }
export function ensureSavedDeck(p, id) { p.savedDecks ??= {}; return p.savedDecks[id] ??= []; }
export function setDeckAssistance(p, m) { if (DECK_ASSISTANCE_MODES.includes(m)) p.deckAssistance = m; return p; }

const V01224_RECOMMENDED_FINGERPRINTS = Object.freeze({
  "iyo-sky": "768a8df7",
  "mankind": "b16f75b8",
  "the-rock": "51f89c26",
  "hulk-hogan": "4fb173fd",
  "bayley": "7b480e2c",
  "cm-punk": "cfa69091",
  "paige": "ecf80682",
  "seth-rollins": "3820d602",
  "andre-the-giant": "b131c91a",
  "stephanie-vaquer": "07e0a677",
  "randy-savage": "420c6920",
  "roman-reigns": "1c711559",
  "charlotte-flair": "8ee120f1",
  "kevin-owens": "3f30cf5a",
  "kane": "322d158a",
  "the-undertaker": "66361de6",
  "ultimate-warrior": "f6d33bda",
  "rhea-ripley": "8e7323eb",
  "cody-rhodes": "f4a0ed12",
  "oba-femi": "bdfbead2",
  "stone-cold-steve-austin": "bb56bf38",
  "liv-morgan": "94aa8b51",
  "brock-lesnar": "9b205881",
  "gunther": "0a387de7",
  "becky-lynch": "1f0ecac1",
  "logan-paul": "d6c4f128",
  "sol-ruca": "192f579a",
  "chad-gable": "40f37cd5",
  "raquel-rodriguez": "b4cce210",
  "rey-mysterio": "ea9431b3",
  "dominik-mysterio": "87cc04c7",
  "penta": "07781db6",
  "el-grande-americano": "7a5c4768",
  "jey-uso": "fb16fe69",
  "la-knight": "9e2e8953",
  "alexa-bliss": "6168d5da",
  "finn-balor": "c89ba29d",
  "danhausen": "e29c059e",
  "tiffany-stratton": "842ab8ac",
  "chelsea-green": "93f0f14c",
  "damian-priest": "98c2fc6a",
  "bron-breakker": "26007f5c",
  "drew-mcintyre": "d9acb838",
  "randy-orton": "da649882",
  "sami-zayn": "ab6c5045",
  "jacob-fatu": "a8dfddbd",
  "solo-sikoa": "00b6f38e",
  "jade-cargill": "543fcd93",
  "nia-jax": "20fd8c70",
  "goldberg": "a71f5b82",
});


const V01223_RECOMMENDED_FINGERPRINTS = Object.freeze({
  "iyo-sky": "768a8df7",
  "mankind": "b16f75b8",
  "the-rock": "51f89c26",
  "hulk-hogan": "4fb173fd",
  "bayley": "7b480e2c",
  "cm-punk": "cfa69091",
  "paige": "434ba678",
  "seth-rollins": "ea987305",
  "andre-the-giant": "cfc0b7c3",
  "stephanie-vaquer": "07e0a677",
  "randy-savage": "251d76ed",
  "roman-reigns": "1c711559",
  "charlotte-flair": "8ee120f1",
  "kevin-owens": "3f30cf5a",
  "kane": "322d158a",
  "the-undertaker": "66361de6",
  "ultimate-warrior": "f6d33bda",
  "rhea-ripley": "8e7323eb",
  "cody-rhodes": "5a2dd531",
  "oba-femi": "bdfbead2",
  "stone-cold-steve-austin": "bb56bf38",
  "liv-morgan": "94aa8b51",
  "brock-lesnar": "9b205881",
  "gunther": "832d71eb",
  "becky-lynch": "1f0ecac1",
  "logan-paul": "d6c4f128",
  "sol-ruca": "192f579a",
  "chad-gable": "40f37cd5",
  "raquel-rodriguez": "b4cce210",
  "rey-mysterio": "c013e338",
  "dominik-mysterio": "87cc04c7",
  "penta": "07781db6",
  "el-grande-americano": "7a5c4768",
  "jey-uso": "fb16fe69",
  "la-knight": "9e2e8953",
  "alexa-bliss": "6168d5da",
  "finn-balor": "c89ba29d",
  "danhausen": "e29c059e",
  "tiffany-stratton": "842ab8ac",
  "chelsea-green": "93f0f14c",
  "damian-priest": "98c2fc6a",
  "bron-breakker": "26007f5c",
  "drew-mcintyre": "d9acb838",
  "randy-orton": "5f36a09c",
  "sami-zayn": "b1f90846",
  "jacob-fatu": "a8dfddbd",
  "solo-sikoa": "00b6f38e",
  "jade-cargill": "543fcd93",
  "nia-jax": "20fd8c70",
  "goldberg": "a71f5b82"
});

const V01217_RECOMMENDED_FINGERPRINTS = Object.freeze({
  "iyo-sky": "e1945d01",
  "mankind": "40285002",
  "the-rock": "3230842a",
  "hulk-hogan": "572663b4",
  "bayley": "022fe1de",
  "cm-punk": "3f4c2901",
  "paige": "31f92592",
  "seth-rollins": "b3fe942e",
  "andre-the-giant": "7dd41d74",
  "stephanie-vaquer": "9eba48ee",
  "randy-savage": "704ed879",
  "roman-reigns": "3a1bc5b6",
  "charlotte-flair": "344a1460",
  "kevin-owens": "0652c47a",
  "kane": "febbaa35",
  "the-undertaker": "dbb5e1ea",
  "ultimate-warrior": "a9ced08b",
  "rhea-ripley": "f68b0f2d",
  "cody-rhodes": "66e6cb43",
  "oba-femi": "6dabc630",
  "stone-cold-steve-austin": "c9c84373",
  "liv-morgan": "56b08852",
  "brock-lesnar": "f35c9053",
  "gunther": "95a4e9a2",
  "becky-lynch": "8558acb8",
  "logan-paul": "8e815ef8",
  "sol-ruca": "42e69c90",
  "chad-gable": "455a051e",
  "raquel-rodriguez": "64d2a576",
  "rey-mysterio": "747be523",
  "dominik-mysterio": "b9f8462c",
  "penta": "64399d70",
  "el-grande-americano": "2a006daf",
  "jey-uso": "36f5a1e3",
  "la-knight": "a3790ac2",
  "alexa-bliss": "06f0c07b",
  "finn-balor": "09669d5e",
  "danhausen": "022d0736",
  "tiffany-stratton": "af7af3db",
  "chelsea-green": "432d399d",
  "damian-priest": "d23c781d",
  "bron-breakker": "c17982de",
  "drew-mcintyre": "3161448e",
  "randy-orton": "3349f999",
  "sami-zayn": "3c2b2862",
  "jacob-fatu": "83c2d7ba",
  "solo-sikoa": "1c7d1845",
  "jade-cargill": "9fdf9a8d",
  "nia-jax": "1c249537",
  "goldberg": "68409807"
});
const deckFingerprint = ids => {
  let h = 2166136261 >>> 0;
  const text = ids.join('|');
  for (let i=0;i<text.length;i+=1) { h ^= text.charCodeAt(i); h = Math.imul(h,16777619) >>> 0; }
  return h.toString(16).padStart(8,'0');
};

export function migrateProfile(old) {
  const sourceVersion = Number(old?.version) || 0;
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
  // recommended 60-card lists, so migration trims those phantom copies.
  for (const sid of p.unlockedSuperstars) {
    const star = starById.get(sid);
    addOwnedCard(p, `superstar-${sid}`, { foil: true });
    if (star?.entranceId) addOwnedCard(p, star.entranceId, { foil: true });
    if (!p.selectedEntrances[sid] && star?.entranceId) p.selectedEntrances[sid] = star.entranceId;
    let saved = Array.isArray(p.savedDecks?.[sid]) ? p.savedDecks[sid] : null;
    // v0.12.25: migrate only untouched v0.12.24 recommended 60-page lists to
    // the CPU recovery-curve package. Custom 60-page decks remain untouched.
    if (saved?.length === 60 && sourceVersion <= 24 && V01224_RECOMMENDED_FINGERPRINTS[sid]) {
      const savedIds = saved.map(entry => typeof entry === 'string' ? entry : entry?.id);
      if (deckFingerprint(savedIds) === V01224_RECOMMENDED_FINGERPRINTS[sid]) {
        const needed = new Map();
        for (const card of decks[sid] ?? []) needed.set(card.id,(needed.get(card.id)??0)+1);
        for (const [id, amount] of needed) {
          const missing = Math.max(0, amount - totalOwnedCopies(p,id));
          if (missing) addOwnedCard(p,id,{amount:missing});
        }
        saved = (decks[sid] ?? []).map(card => ({id:card.id,foil:false}));
        p.savedDecks[sid] = saved;
      }
    }
    // v0.12.24: migrate only untouched v0.12.23 recommended 60-page lists to
    // the targeted roster-balance package. Custom 60-page decks remain untouched.
    if (saved?.length === 60 && sourceVersion <= 23 && V01223_RECOMMENDED_FINGERPRINTS[sid]) {
      const savedIds = saved.map(entry => typeof entry === 'string' ? entry : entry?.id);
      if (deckFingerprint(savedIds) === V01223_RECOMMENDED_FINGERPRINTS[sid]) {
        const needed = new Map();
        for (const card of decks[sid] ?? []) needed.set(card.id,(needed.get(card.id)??0)+1);
        for (const [id, amount] of needed) {
          const missing = Math.max(0, amount - totalOwnedCopies(p,id));
          if (missing) addOwnedCard(p,id,{amount:missing});
        }
        saved = (decks[sid] ?? []).map(card => ({id:card.id,foil:false}));
        p.savedDecks[sid] = saved;
      }
    }
    // v0.12.18: untouched v0.12.17 60-page recommended lists migrate to the
    // expanded counter package; custom 60-page decks remain untouched.
    if (saved?.length === 60 && sourceVersion <= 22 && V01217_RECOMMENDED_FINGERPRINTS[sid]) {
      const savedIds = saved.map(entry => typeof entry === 'string' ? entry : entry?.id);
      if (deckFingerprint(savedIds) === V01217_RECOMMENDED_FINGERPRINTS[sid]) {
        const needed = new Map();
        for (const card of decks[sid] ?? []) needed.set(card.id,(needed.get(card.id)??0)+1);
        for (const [id, amount] of needed) {
          const missing = Math.max(0, amount - totalOwnedCopies(p,id));
          if (missing) addOwnedCard(p,id,{amount:missing});
        }
        saved = (decks[sid] ?? []).map(card => ({id:card.id,foil:false}));
        p.savedDecks[sid] = saved;
      }
    }
    // v0.12.17: seamlessly extend untouched v0.12.16 recommended 55-page saves
    // to the new 60-page standard. Custom 55-page decks are left untouched so
    // the player can revise them manually in Deck Lab rather than having edits overwritten.
    if (saved?.length === 55 && (decks[sid]?.length ?? 0) === 60) {
      const savedIds = saved.map(entry => typeof entry === "string" ? entry : entry?.id);
      const oldRecommendedIds = decks[sid].slice(0,55).map(card => card.id);
      if (savedIds.every((id,index) => id === oldRecommendedIds[index])) {
        const additions = decks[sid].slice(55);
        for (const card of additions) {
          addOwnedCard(p, card.id, { amount: 1 });
          saved.push({ id: card.id, foil: false });
        }
      }
    }
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
  // Public launch-state migration: unreleased development content is kept in
  // the authored data files, but it must not leak into a player profile.
  const releasedStarIds = new Set(Object.values(superstars).filter(star => !star.developmentOnly && !isUnreleasedSetId(star.setId)).map(star => star.id));
  p.unlockedSuperstars = p.unlockedSuperstars.filter(id => releasedStarIds.has(id));
  if (!p.unlockedSuperstars.includes(p.starterId)) p.unlockedSuperstars.unshift(p.starterId);
  p.favouriteSuperstars = p.favouriteSuperstars.filter(id => p.unlockedSuperstars.includes(id));
  for (const id of Object.keys(p.ownedCards)) {
    const card = cardById.get(id);
    if (card && isUnreleasedSetId(card.setId)) delete p.ownedCards[id];
  }
  for (const sid of Object.keys(p.savedDecks)) {
    const star = starById.get(sid);
    if (!star || isUnreleasedSetId(star.setId)) { delete p.savedDecks[sid]; continue; }
    p.savedDecks[sid] = (p.savedDecks[sid] ?? []).filter(entry => {
      const card = cardById.get(typeof entry === "string" ? entry : entry?.id);
      return card && !isUnreleasedSetId(card.setId);
    });
  }
  for (const sid of Object.keys(p.selectedEntrances)) {
    const star = starById.get(sid);
    if (!star || isUnreleasedSetId(star.setId)) delete p.selectedEntrances[sid];
  }
  for (const setId of Object.keys(p.boosterCreditsBySet ?? {})) if (isUnreleasedSetId(setId)) p.boosterCreditsBySet[setId] = 0;
  for (const setId of Object.keys(p.ladder?.completionPackCreditsBySet ?? {})) if (isUnreleasedSetId(setId)) p.ladder.completionPackCreditsBySet[setId] = 0;
  for (const setId of Object.keys(p.championshipRoad?.championshipPackCreditsBySet ?? {})) if (isUnreleasedSetId(setId)) p.championshipRoad.championshipPackCreditsBySet[setId] = 0;
  p.pendingUnlockCelebrations = (p.pendingUnlockCelebrations ?? []).filter(event => releasedStarIds.has(event?.superstarId));
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
