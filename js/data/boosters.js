import { cardsForSet } from "./collection.js?v=0.12.78";
import { addOwnedCard, addUniversePoints, cardOwnershipCap, grantSuperstarUnlockPackage, totalOwnedCopies } from "./profile.js?v=0.12.78";
import { DUPLICATE_UNIVERSE_POINTS } from "./store.js?v=0.12.78";
import { sets } from "./sets.js?v=0.12.78";
import { isLaunchLiveSetId } from "./release.js?v=0.12.78";

export const BOOSTER_SIZE = 5;
export const GUARANTEED_FOILS = 1;
export const MAX_VERY_RARE_PULLS = 1;
export const RARITY_WEIGHTS = { 1: .5, 2: .3, 3: .15, 4: .05 };
export const SUPERSTAR_PITY_PACKS = 50;
export const SUPERSTAR_CHASE_CHANCE = .05;
export const DEFAULT_BOOSTER_SET_ID = "summerslam-series-1";

export function boosterCreditsFor(p, setId = DEFAULT_BOOSTER_SET_ID) { return p?.boosterCreditsBySet?.[setId] ?? p?.boosterCredits ?? 0; }
export function boosterEligible(card) { return !!card && isLaunchLiveSetId(card.setId) && sets[card.setId]?.type !== "season-exclusive" && card.boosterEligible !== false; }
export function underOwnershipCap(profile, card) { return totalOwnedCopies(profile, card.id) < cardOwnershipCap(card); }

function availableRarityWeights(pool) {
  const rarities = [...new Set(pool.map(card => Number(card.rarity) || 1))].sort((a,b)=>a-b);
  return rarities.map(rarity => [rarity, RARITY_WEIGHTS[rarity] ?? .01]);
}

function rollRarity(pool, rng = Math.random) {
  if (!pool.length) return null;
  const weights = availableRarityWeights(pool);
  const total = weights.reduce((sum, [,weight]) => sum + weight, 0);
  let roll = rng() * total;
  for (const [rarity, weight] of weights) {
    roll -= weight;
    if (roll <= 0) return rarity;
  }
  return weights.at(-1)?.[0] ?? null;
}

function rarityFirstPick(pool, rng = Math.random) {
  if (!pool.length) return null;
  const rarity = rollRarity(pool, rng);
  const bucket = pool.filter(card => (Number(card.rarity) || 1) === rarity);
  if (!bucket.length) return null;
  return bucket[Math.min(bucket.length - 1, Math.floor(rng() * bucket.length))];
}

function superstarPity(profile, setId) {
  profile.packsSinceSuperstarUnlockBySet ??= {};
  return Math.max(0, Number(profile.packsSinceSuperstarUnlockBySet[setId]) || 0);
}

function recordSuperstarChase(profile, setId, hadAvailableSuperstar, hit) {
  profile.packsSinceSuperstarUnlockBySet ??= {};
  if (!hadAvailableSuperstar) profile.packsSinceSuperstarUnlockBySet[setId] = 0;
  else profile.packsSinceSuperstarUnlockBySet[setId] = hit ? 0 : Math.min(SUPERSTAR_PITY_PACKS - 1, superstarPity(profile, setId) + 1);
  profile.packsSinceSuperstarUnlock = hit ? 0 : Math.max(0, Number(profile.packsSinceSuperstarUnlock) || 0) + 1;
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

  // Superstar cards are a separate pack-level chase. They never distort the
  // normal Common/Uncommon/Rare/Very Rare slot distribution.
  const unownedSuperstars = base.filter(card => card.kind === "superstar" && underOwnershipCap(profile, card));
  const pityBefore = superstarPity(profile, setId);
  const superstarHit = unownedSuperstars.length > 0 && (pityBefore >= SUPERSTAR_PITY_PACKS - 1 || rng() < SUPERSTAR_CHASE_CHANCE);
  const superstarCard = superstarHit
    ? unownedSuperstars[Math.min(unownedSuperstars.length - 1, Math.floor(rng() * unownedSuperstars.length))]
    : null;

  const normalBase = base.filter(card => card.kind !== "superstar" && (card.kind !== "entrance" || underOwnershipCap(profile, card)));
  const underCapNormal = normalBase.filter(card => underOwnershipCap(profile, card));
  const pack = [];
  let superstarAdded = false;
  // A five-card pack may contain at most one 4★ Very Rare. The Superstar
  // chase counts toward this ceiling so a chase Superstar cannot stack with
  // additional Very Rare Finishers, Specials or Entrances in the same pack.
  let veryRarePulls = superstarCard?.rarity === 4 ? 1 : 0;

  for (let i = 0; i < BOOSTER_SIZE; i += 1) {
    const guaranteedFoil = i < GUARANTEED_FOILS;
    let card = null;
    let pullFoil = guaranteedFoil;

    if (i === 0 && superstarCard) {
      card = superstarCard;
      pullFoil = true;
    } else {
      // Preserve the guaranteed-progress first ordinary slot when possible,
      // but roll rarity first and only then choose uniformly inside that bucket.
      let slotPool = normalBase.filter(c => c.kind !== "entrance" || underOwnershipCap(profile, c));
      if (i === 0 && underCapNormal.length) slotPool = underCapNormal.filter(c => c.kind !== "entrance" || underOwnershipCap(profile, c));
      if (veryRarePulls >= MAX_VERY_RARE_PULLS) slotPool = slotPool.filter(c => Number(c.rarity) !== 4);
      card = rarityFirstPick(slotPool, rng);
      if (card?.rarity === 4) veryRarePulls += 1;
      if (card?.kind === "entrance") pullFoil = true;
    }

    if (!card) continue;
    const beforeTotal = totalOwnedCopies(profile, card.id);
    const wasUnlocked = card.kind === "superstar" && profile.unlockedSuperstars?.includes(card.superstarId);
    const result = addOwnedCard(profile, card.id, { foil: pullFoil, amount: 1 });
    let superstarUnlocked = false;
    if (card.kind === "superstar" && result.added > 0) {
      superstarAdded = true;
      if (!wasUnlocked) {
        grantSuperstarUnlockPackage(profile, card.superstarId);
        superstarUnlocked = true;
      }
    }
    pack.push({
      card,
      foil: pullFoil,
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

  recordSuperstarChase(profile, setId, unownedSuperstars.length > 0, superstarAdded);
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
