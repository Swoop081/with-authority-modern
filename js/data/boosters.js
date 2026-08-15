import { cardsForSet } from "./collection.js?v=0.12.44";
import { addOwnedCard, addUniversePoints, cardOwnershipCap, grantSuperstarUnlockPackage, totalOwnedCopies } from "./profile.js?v=0.12.44";
import { DUPLICATE_UNIVERSE_POINTS } from "./store.js?v=0.12.44";
import { sets } from "./sets.js?v=0.12.44";
import { isLaunchLiveSetId } from "./release.js?v=0.12.44";

export const BOOSTER_SIZE = 5;
export const GUARANTEED_FOILS = 1;
export const RARITY_WEIGHTS = { 1: .5, 2: .3, 3: .15, 4: .05 };
export const SUPERSTAR_PITY_PACKS = 20;
export const DEFAULT_BOOSTER_SET_ID = "summerslam-series-1";

export function boosterCreditsFor(p, setId = DEFAULT_BOOSTER_SET_ID) { return p?.boosterCreditsBySet?.[setId] ?? p?.boosterCredits ?? 0; }
export function boosterEligible(card) { return !!card && isLaunchLiveSetId(card.setId) && sets[card.setId]?.type !== "season-exclusive" && card.boosterEligible !== false && (card.kind !== "entrance" || !card.superstarId); }
export function underOwnershipCap(profile, card) { return totalOwnedCopies(profile, card.id) < cardOwnershipCap(card); }

function weighted(pool, rng = Math.random) {
  if (!pool.length) return null;
  const total = pool.reduce((s, c) => s + (RARITY_WEIGHTS[c.rarity] ?? .01), 0);
  const r = rng() * total;
  let a = 0;
  for (const c of pool) { a += RARITY_WEIGHTS[c.rarity] ?? .01; if (r <= a) return c; }
  return pool.at(-1);
}

function normalizeArgs(rngOrSetId, maybeSetId) {
  if (typeof rngOrSetId === "function") return { rng: rngOrSetId, setId: maybeSetId ?? DEFAULT_BOOSTER_SET_ID };
  return { rng: Math.random, setId: typeof rngOrSetId === "string" ? rngOrSetId : (maybeSetId ?? DEFAULT_BOOSTER_SET_ID) };
}

export function grantBooster(p, n = 1, setId = DEFAULT_BOOSTER_SET_ID) {
  p.boosterCreditsBySet ??= {};
  p.boosterCreditsBySet[setId] = (p.boosterCreditsBySet[setId] ?? 0) + n;
  if (setId === DEFAULT_BOOSTER_SET_ID) p.boosterCredits = p.boosterCreditsBySet[setId];
  return p.boosterCreditsBySet[setId];
}

function buildPack(profile, rng, setId) {
  const base = cardsForSet(setId).filter(boosterEligible);
  if (!base.length) throw new Error("No active cards for this set");
  const underCap = base.filter(card => underOwnershipCap(profile, card));
  const pack = [];

  for (let i = 0; i < BOOSTER_SIZE; i += 1) {
    const foil = i < GUARANTEED_FOILS;
    let slotPool = base.filter(card => foil || card.kind !== "superstar");
    // The first slot is the guaranteed-progress slot whenever any card in the
    // active set remains below its ownership cap. Because it is also Foil, an
    // unowned Superstar can still satisfy the guarantee.
    if (i === 0 && underCap.length) slotPool = underCap.filter(card => foil || card.kind !== "superstar");
    const card = weighted(slotPool, rng);
    if (!card) continue;
    const beforeTotal = totalOwnedCopies(profile, card.id);
    const wasUnlocked = card.kind === "superstar" && profile.unlockedSuperstars?.includes(card.superstarId);
    const result = addOwnedCard(profile, card.id, { foil, amount: 1 });
    let superstarUnlocked = false;
    if (card.kind === "superstar" && !wasUnlocked && result.added > 0) {
      grantSuperstarUnlockPackage(profile, card.superstarId);
      superstarUnlocked = true;
    }
    pack.push({
      card,
      foil,
      isNewCard: beforeTotal === 0 && result.added > 0,
      replacedNormal: result.replacedNormal > 0,
      superstarUnlocked,
      overflowCopies: result.overflowed,
      universePointsValue: result.overflowed * DUPLICATE_UNIVERSE_POINTS,
      universePointsCredited: false,
      ownershipBefore: beforeTotal,
      ownershipCap: result.cap
    });
  }
  return pack;
}

function recordOpenedPack(p, setId) {
  p.packsOpened = (p.packsOpened ?? 0) + 1;
  p.packsOpenedBySet ??= {};
  p.packsOpenedBySet[setId] = (p.packsOpenedBySet[setId] ?? 0) + 1;
}

export function openBooster(p, rngOrSetId = DEFAULT_BOOSTER_SET_ID, maybeSetId) {
  const { rng, setId } = normalizeArgs(rngOrSetId, maybeSetId);
  if (boosterCreditsFor(p, setId) < 1) throw new Error("No booster available for this set.");
  const pack = buildPack(p, rng, setId);
  p.boosterCreditsBySet ??= {};
  p.boosterCreditsBySet[setId] = Math.max(0, (p.boosterCreditsBySet[setId] ?? 0) - 1);
  if (setId === DEFAULT_BOOSTER_SET_ID) p.boosterCredits = p.boosterCreditsBySet[setId];
  recordOpenedPack(p, setId);
  return pack;
}

export function openLadderCompletionPack(p, rngOrSetId = DEFAULT_BOOSTER_SET_ID, maybeSetId) {
  const { rng, setId } = normalizeArgs(rngOrSetId, maybeSetId);
  const pool = p?.ladder?.completionPackCreditsBySet ?? {};
  if ((pool[setId] ?? 0) < 1) throw new Error("No Climb the Ladder Completion Pack available for this set.");
  const pack = buildPack(p, rng, setId);
  pool[setId] = Math.max(0, (pool[setId] ?? 0) - 1);
  recordOpenedPack(p, setId);
  return pack;
}

export function openChampionshipPack(p, rngOrSetId = DEFAULT_BOOSTER_SET_ID, maybeSetId) {
  const { rng, setId } = normalizeArgs(rngOrSetId, maybeSetId);
  const pool = p?.championshipRoad?.championshipPackCreditsBySet ?? {};
  if ((pool[setId] ?? 0) < 1) throw new Error("No Championship Pack available for this set.");
  const pack = buildPack(p, rng, setId);
  pool[setId] = Math.max(0, (pool[setId] ?? 0) - 1);
  recordOpenedPack(p, setId);
  return pack;
}

export function finalizePackUniversePoints(profile, pack = []) {
  let credited = 0;
  for (const pull of pack) {
    if (!pull || pull.universePointsCredited || !pull.universePointsValue) continue;
    credited += pull.universePointsValue;
    pull.universePointsCredited = true;
  }
  if (credited) addUniversePoints(profile, credited);
  return credited;
}
