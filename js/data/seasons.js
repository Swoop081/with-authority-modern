import { grantSuperstarIdentityUnlockPackage, addOwnedCard, addUniversePoints } from "./profile.js?v=0.13.90";
import { isUnreleasedSetId, isPlayerReleasedSetId } from "./release.js?v=0.13.90";
export const SEASON_ID = "season-1";
export const SEASON_START = "2026-08-10T00:00:00";
export const SEASON_END = "2026-11-28T00:00:00";
export const SEASON_TIER_COUNT = 100;
export const XP_PER_TIER = 100;
export const MAX_SEASON_XP = SEASON_TIER_COUNT * XP_PER_TIER;
export const MATCH_XP = { win: 5, loss: 0 };
export const DAILY_CHALLENGE_XP = 10;
export const WEEKLY_CHALLENGE_XP = 25;
export const SEASON_1_COMPLETION_SUPERSTAR = "the-rock";
export const SEASON_2_COMPLETION_SUPERSTAR = "goldberg";
export const FEATURED_SET_IDS = ["summerslam-series-1", "evolution-series-1", "new-generation-series-1", "golden-era-series-1", "attitude-era-series-1"];

// Season 1 prestige chase: The Rock — Final Boss is assembled across the road
// across a 100-tier road. Repeatable Rock cards are earned one copy at a time
// up to the normal five-copy collection cap; his one-off Support, Action and
// Entrance are spaced between them. Tier 100 is the Ruby Superstar identity.
export const FINAL_BOSS_TIER_REWARDS = Object.freeze({
  5:   { cardId: "the-rock-lay-the-smack-down", name: "Lay The Smack Down", amount: 1, rewardType: "exclusive-move", label: "EXCLUSIVE MOVE" },
  10:  { cardId: "the-rock-belt-whip", name: "Belt Whip", amount: 1, rewardType: "exclusive-move", label: "EXCLUSIVE MOVE" },
  15:  { cardId: "people-championship", name: "People's Championship", amount: 1, rewardType: "support", label: "EXCLUSIVE SUPPORT" },
  20:  { cardId: "the-rock-rock-bottom", name: "Rock Bottom", amount: 1, rewardType: "signature", label: "SIGNATURE · TRADEMARK" },
  25:  { cardId: "the-rock-lay-the-smack-down", name: "Lay The Smack Down", amount: 1, rewardType: "exclusive-move", label: "EXCLUSIVE MOVE" },
  30:  { cardId: "the-rock-people-s-elbow", name: "People's Elbow", amount: 1, rewardType: "finisher", label: "FINISHER" },
  35:  { cardId: "special-the-rock", name: "Bloodline Rules", amount: 1, rewardType: "action", label: "ACTION" },
  40:  { cardId: "the-rock-rock-bottom", name: "Rock Bottom", amount: 1, rewardType: "signature", label: "SIGNATURE · TRADEMARK" },
  45:  { cardId: "the-rock-belt-whip", name: "Belt Whip", amount: 1, rewardType: "exclusive-move", label: "EXCLUSIVE MOVE" },
  50:  { cardId: "the-rock-rock-bottom", name: "Rock Bottom", amount: 1, rewardType: "signature", label: "SIGNATURE · TRADEMARK" },
  55:  { cardId: "the-rock-lay-the-smack-down", name: "Lay The Smack Down", amount: 1, rewardType: "exclusive-move", label: "EXCLUSIVE MOVE" },
  60:  { cardId: "the-rock-people-s-elbow", name: "People's Elbow", amount: 1, rewardType: "finisher", label: "FINISHER" },
  65:  { cardId: "the-rock-belt-whip", name: "Belt Whip", amount: 1, rewardType: "exclusive-move", label: "EXCLUSIVE MOVE" },
  70:  { cardId: "the-rock-rock-bottom", name: "Rock Bottom", amount: 1, rewardType: "signature", label: "SIGNATURE · TRADEMARK" },
  75:  { cardId: "the-rock-lay-the-smack-down", name: "Lay The Smack Down", amount: 1, rewardType: "exclusive-move", label: "EXCLUSIVE MOVE" },
  80:  { cardId: "the-rock-people-s-elbow", name: "People's Elbow", amount: 1, rewardType: "finisher", label: "FINISHER" },
  82:  { cardId: "the-rock-belt-whip", name: "Belt Whip", amount: 1, rewardType: "exclusive-move", label: "EXCLUSIVE MOVE" },
  85:  { cardId: "entrance-the-rock", name: "Final Boss", amount: 1, rewardType: "entrance", label: "RUBY ENTRANCE", tier: "ruby" },
  88:  { cardId: "the-rock-lay-the-smack-down", name: "Lay The Smack Down", amount: 1, rewardType: "exclusive-move", label: "EXCLUSIVE MOVE" },
  90:  { cardId: "the-rock-rock-bottom", name: "Rock Bottom", amount: 1, rewardType: "signature", label: "SIGNATURE · TRADEMARK" },
  92:  { cardId: "the-rock-belt-whip", name: "Belt Whip", amount: 1, rewardType: "exclusive-move", label: "EXCLUSIVE MOVE" },
  94:  { cardId: "the-rock-people-s-elbow", name: "People's Elbow", amount: 1, rewardType: "finisher", label: "FINISHER" },
  98:  { cardId: "the-rock-people-s-elbow", name: "People's Elbow", amount: 1, rewardType: "finisher", label: "FINISHER" },
  100: { cardId: "superstar-the-rock", name: "The Rock — Final Boss", amount: 1, rewardType: "superstar", label: "RUBY SUPERSTAR", tier: "ruby", superstarId: SEASON_1_COMPLETION_SUPERSTAR }
});

export const SEASON_1 = {
  id: SEASON_ID,
  number: 1,
  name: "Season 1",
  subtitle: "Legacy Begins",
  start: SEASON_START,
  end: SEASON_END,
  tierCount: SEASON_TIER_COUNT,
  xpPerTier: XP_PER_TIER,
  rotationPreview: [],
  roadmap: []
};

function ensure(profile) {
  profile.seasons ??= {};
  profile.seasons[SEASON_ID] ??= {
    xp: 0,
    claimedTiers: [],
    freePackLastClaimAt: null,
    freePacksClaimed: 0,
    matchXpEarned: 0,
    challengeXpEarned: 0
  };
  const state = profile.seasons[SEASON_ID];
  state.xp = Math.max(0, Number(state.xp) || 0);
  state.claimedTiers ??= [];
  state.freePackLastClaimAt ??= null;
  state.freePacksClaimed ??= 0;
  state.matchXpEarned ??= 0;
  state.challengeXpEarned ??= 0;
  return state;
}

export function seasonState(profile) { return ensure(profile); }
export function seasonTier(profile) { return Math.min(SEASON_TIER_COUNT, Math.floor(ensure(profile).xp / XP_PER_TIER)); }
export function seasonLevelProgress(profile) {
  const xp = ensure(profile).xp;
  const tier = seasonTier(profile);
  if (tier >= SEASON_TIER_COUNT) return { tier, xp, intoTier: XP_PER_TIER, needed: XP_PER_TIER, percent: 100 };
  const intoTier = xp % XP_PER_TIER;
  return { tier, xp, intoTier, needed: XP_PER_TIER, percent: Math.floor((intoTier / XP_PER_TIER) * 100) };
}
export function seasonTimeRemaining(now = new Date()) {
  const end = new Date(SEASON_END);
  const ms = Math.max(0, end.getTime() - now.getTime());
  return { ms, days: Math.ceil(ms / 86400000), ended: ms <= 0, end };
}
export function nextRoadmapNode(_now = new Date()) { return null; }
export function roadmapNodeStatus(_node, _now = new Date()) { return "unpublished"; }

export function awardSeasonXp(profile, amount, source = "other") {
  const state = ensure(profile);
  const add = Math.max(0, Number(amount) || 0);
  const before = state.xp;
  state.xp = Math.min(MAX_SEASON_XP, state.xp + add);
  const actual = state.xp - before;
  if (source === "match") state.matchXpEarned += actual;
  if (source === "challenge") state.challengeXpEarned += actual;
  return { awarded: actual, before, after: state.xp, tierBefore: Math.floor(before / XP_PER_TIER), tierAfter: seasonTier(profile) };
}
export function awardMatchSeasonXp(profile, result) {
  const amount = MATCH_XP[result] ?? MATCH_XP.loss;
  return awardSeasonXp(profile, amount, "match");
}

const SEASON_1_PACK_SET_IDS = Object.freeze([
  "summerslam-series-1",
  "golden-era-series-1",
  "attitude-era-series-1",
  "evolution-series-1",
  "raw-series-1",
  "new-generation-series-1",
  "worlds-collide-series-1",
  "money-in-the-bank-series-1",
  "smackdown-series-1"
]);

function seasonPackPoolForTier(tier, now = new Date()) {
  const authored = tier <= 20
    ? SEASON_1_PACK_SET_IDS.slice(0, 4)
    : tier <= 35
      ? SEASON_1_PACK_SET_IDS.slice(0, 5)
      : tier <= 50
        ? SEASON_1_PACK_SET_IDS.slice(0, 6)
        : tier <= 65
          ? SEASON_1_PACK_SET_IDS.slice(0, 7)
          : SEASON_1_PACK_SET_IDS;
  const released = authored.filter(setId => !isUnreleasedSetId(setId, now));
  return released.length ? released : SEASON_1_PACK_SET_IDS.slice(0, 4);
}

export function tierReward(tier, now = new Date()) {
  const n = Math.max(1, Math.min(SEASON_TIER_COUNT, Number(tier) || 1));
  const finalBoss = FINAL_BOSS_TIER_REWARDS[n];
  if (finalBoss) return { tier: n, kind: "final-boss-card", exclusive: true, ...finalBoss };
  // Currency breaks up the pack cadence so the 100-tier road never feels like
  // ninety-nine booster buttons. Later tiers pay more UP as the chase intensifies.
  if (n % 4 === 0) {
    const amount = n < 25 ? 100 : n < 50 ? 150 : n < 75 ? 200 : 250;
    return { tier: n, kind: "universe-points", amount };
  }
  const pool = seasonPackPoolForTier(n, now);
  const setId = pool[(n - 1) % pool.length];
  return { tier: n, setId, amount: 1, kind: "booster" };
}
function grantSetBooster(profile, setId, amount = 1) {
  profile.boosterCreditsBySet ??= {};
  profile.boosterCreditsBySet[setId] = (profile.boosterCreditsBySet[setId] ?? 0) + amount;
  if (setId === "summerslam-series-1") profile.boosterCredits = profile.boosterCreditsBySet[setId];
}
export function claimSeasonTier(profile, tier, now = new Date()) {
  const state = ensure(profile), current = seasonTier(profile), n = Number(tier);
  if (!Number.isInteger(n) || n < 1 || n > SEASON_TIER_COUNT) throw new Error("Invalid Season tier");
  if (n > current) throw new Error("Season tier not reached");
  if (state.claimedTiers.includes(n)) throw new Error("Season tier already claimed");
  const reward = tierReward(n, now);
  if (reward.kind === "final-boss-card") {
    if (reward.rewardType === "superstar") {
      // Tier 100 is the Ruby Superstar identity only. Shared deck cards must come
      // from the player's Collection; all Rock-exclusive cards are earned one
      // at a time across the preceding Season milestones.
      grantSuperstarIdentityUnlockPackage(profile, reward.superstarId);
      state.completionRewardClaimed = true;
      state.completionSuperstarId = reward.superstarId;
    } else {
      addOwnedCard(profile, reward.cardId, { amount: reward.amount ?? 1, tier: reward.tier ?? "normal" });
    }
    if (reward.bonusUniversePoints) addUniversePoints(profile, reward.bonusUniversePoints);
  } else if (reward.kind === "universe-points") addUniversePoints(profile, reward.amount);
  else grantSetBooster(profile, reward.setId, reward.amount);
  state.claimedTiers.push(n);
  state.claimedTiers.sort((a,b) => a-b);
  return reward;
}
export function claimAllSeasonTiers(profile, now = new Date()) {
  const current = seasonTier(profile), rewards = [];
  for (let tier = 1; tier <= current; tier += 1) {
    if (ensure(profile).claimedTiers.includes(tier)) continue;
    rewards.push(claimSeasonTier(profile, tier, now));
  }
  return rewards;
}

const FREE_PACK_MS = 24 * 60 * 60 * 1000;
export function freePackStatus(profile, now = new Date()) {
  const state = ensure(profile);
  if (!state.freePackLastClaimAt) return { available: true, msRemaining: 0, nextAt: now };
  const last = new Date(state.freePackLastClaimAt).getTime();
  const nextAt = new Date(last + FREE_PACK_MS);
  const msRemaining = Math.max(0, nextAt.getTime() - now.getTime());
  return { available: msRemaining <= 0, msRemaining, nextAt };
}
export function claimFreeSeasonBooster(profile, rng = Math.random, now = new Date()) {
  const status = freePackStatus(profile, now);
  if (!status.available) throw new Error("Your next free booster is still counting down.");
  const releasedSets = FEATURED_SET_IDS.filter(setId => isPlayerReleasedSetId(setId, now));
  const activeSets = releasedSets.filter(setId => (profile.setProgress?.[setId]?.lifecycle ?? "featured") === "featured");
  const pool = activeSets.length ? activeSets : releasedSets;
  const index = Math.min(pool.length - 1, Math.floor(rng() * pool.length));
  const setId = pool[index];
  grantSetBooster(profile, setId, 1);
  const state = ensure(profile);
  state.freePackLastClaimAt = now.toISOString();
  state.freePacksClaimed += 1;
  return { setId, amount: 1, nextAt: new Date(now.getTime() + FREE_PACK_MS) };
}
