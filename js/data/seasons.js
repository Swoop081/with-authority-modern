import { grantSuperstarIdentityUnlockPackage, addOwnedCard, addUniversePoints } from "./profile.js?v=0.12.69";
export const SEASON_ID = "season-1";
export const SEASON_START = "2026-08-10T00:00:00";
export const SEASON_END = "2026-11-28T00:00:00";
export const SEASON_TIER_COUNT = 50;
export const XP_PER_TIER = 100;
export const MAX_SEASON_XP = SEASON_TIER_COUNT * XP_PER_TIER;
export const MATCH_XP = { win: 15, loss: 3 };
export const DAILY_CHALLENGE_XP = 25;
export const WEEKLY_CHALLENGE_XP = 100;
export const SEASON_1_COMPLETION_SUPERSTAR = "the-rock";
export const SEASON_2_COMPLETION_SUPERSTAR = "goldberg";
export const FEATURED_SET_IDS = ["summerslam-series-1", "hall-of-fame-series-1", "evolution-series-1"];

// Season 1 prestige chase: The Rock — Final Boss is assembled across the road
// instead of being dumped into Collection as a complete deck at Tier 50.
// Move quantities match the authored Final Boss CPU deck so each milestone
// awards the complete usable playset of that exclusive card. Existing UP values
// at milestone tiers are retained as bonus currency rather than being removed.
export const FINAL_BOSS_TIER_REWARDS = Object.freeze({
  5:  { cardId: "the-rock-final-boss-slap", name: "Final Boss Slap", amount: 1, rewardType: "exclusive-move", label: "EXCLUSIVE MOVE", bonusUniversePoints: 100 },
  10: { cardId: "the-rock-rock-bottom", name: "Rock Bottom", amount: 3, rewardType: "signature", label: "SIGNATURE · TRADEMARK", bonusUniversePoints: 100 },
  15: { cardId: "the-rock-belt-whip", name: "Belt Whip", amount: 3, rewardType: "exclusive-move", label: "EXCLUSIVE MOVE", bonusUniversePoints: 100 },
  20: { cardId: "special-the-rock", name: "Bloodline Rules", amount: 1, rewardType: "special", label: "SPECIAL", bonusUniversePoints: 100 },
  25: { cardId: "people-championship", name: "People's Championship", amount: 1, rewardType: "support", label: "EXCLUSIVE SUPPORT", bonusUniversePoints: 200 },
  30: { cardId: "the-rock-people-s-elbow", name: "People's Elbow", amount: 2, rewardType: "finisher", label: "FINISHER", bonusUniversePoints: 200 },
  40: { cardId: "entrance-the-rock", name: "Final Boss", amount: 1, rewardType: "entrance", label: "ENTRANCE", foil: true, bonusUniversePoints: 200 },
  50: { cardId: "superstar-the-rock", name: "The Rock — Final Boss", amount: 1, rewardType: "superstar", label: "SUPERSTAR", foil: true, superstarId: SEASON_1_COMPLETION_SUPERSTAR }
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
  rotationPreview: [
    { setId: "summerslam-series-1", from: "featured", to: "vaulted", note: "Leaves the standard Featured pool when the Season 2 content update arrives." },
    { setId: "hall-of-fame-series-1", from: "featured", to: "returning", note: "Moves into Legacy/event rotation rather than disappearing from owned decks." },
    { setId: "evolution-series-1", from: "featured", to: "returning", note: "Moves into Legacy/event rotation and can return alongside future women's content." }
  ],
  roadmap: [
    {
      id: "launch",
      date: "2026-08-10T00:00:00",
      dateLabel: "10 AUG",
      title: "Season 1 Launch",
      kicker: "LIVE NOW",
      description: "SummerSlam — Series 1, Hall of Fame — Series 1 and Evolution — Series 1 launch the collection.",
      superstarCount: 24,
      type: "launch"
    },
    {
      id: "raw-series-1",
      date: "2026-09-05T00:00:00",
      dateLabel: "05 SEP",
      title: "Raw — Series 1",
      kicker: "NEW SUBSET",
      description: "Four-Superstar RAW subset joins Season 1. Roster reveal coming closer to release.",
      superstarCount: 4,
      type: "subset",
      setId: "raw-series-1"
    },
    {
      id: "worlds-collide",
      date: "2026-09-26T00:00:00",
      dateLabel: "26 SEP",
      title: "Worlds Collide — Series 1",
      kicker: "NEW SUBSET",
      description: "Four-Superstar WWE × AAA lucha subset joins Season 1. Roster reveal coming closer to release.",
      superstarCount: 4,
      type: "subset",
      setId: "worlds-collide-series-1"
    },
    {
      id: "money-in-the-bank",
      date: "2026-10-10T00:00:00",
      dateLabel: "10 OCT",
      title: "Money in the Bank — Series 1",
      kicker: "NEW SUBSET",
      description: "Four-Superstar Money in the Bank subset joins Season 1. Roster reveal coming closer to release.",
      superstarCount: 4,
      type: "subset",
      setId: "money-in-the-bank-series-1"
    },
    {
      id: "smackdown-series-1",
      date: "2026-10-31T00:00:00",
      dateLabel: "31 OCT",
      title: "SmackDown — Series 1",
      kicker: "HALLOWEEN SUBSET",
      description: "Four-Superstar SmackDown subset joins Season 1. Roster reveal coming closer to release.",
      superstarCount: 4,
      type: "subset",
      setId: "smackdown-series-1"
    },
    {
      id: "season-2",
      date: "2026-11-28T00:00:00",
      dateLabel: "28 NOV",
      title: "Season 2 · Survivor Series",
      kicker: "NEXT SEASON",
      description: "Season 2 launches with an 8-Superstar Survivor Series set and a fresh 50-tier Season Road with a new prestige reward. Selected Season 1 sets move out of the Featured pool while owned cards remain playable.",
      superstarCount: 8,
      type: "season"
    }
  ]
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
export function nextRoadmapNode(now = new Date()) {
  return SEASON_1.roadmap.find(node => new Date(node.date).getTime() > now.getTime()) ?? SEASON_1.roadmap.at(-1);
}
export function roadmapNodeStatus(node, now = new Date()) {
  const time = new Date(node.date).getTime();
  if (node.id === "launch" && now.getTime() >= time) return "live";
  if (now.getTime() >= time) return node.id === "season-2" ? "live" : "released";
  return "upcoming";
}

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

export function tierReward(tier) {
  const n = Math.max(1, Math.min(SEASON_TIER_COUNT, Number(tier) || 1));
  const finalBoss = FINAL_BOSS_TIER_REWARDS[n];
  if (finalBoss) return { tier: n, kind: "final-boss-card", exclusive: true, ...finalBoss };
  // Universe Points remain on the unused five-tier milestones. Final Boss card
  // milestones preserve their previous currency value through bonusUniversePoints.
  if (n % 5 === 0) return { tier: n, kind: "universe-points", amount: n < 25 ? 100 : 200 };
  const setId = FEATURED_SET_IDS[(n - 1) % FEATURED_SET_IDS.length];
  return { tier: n, setId, amount: 1, kind: "booster" };
}
function grantSetBooster(profile, setId, amount = 1) {
  profile.boosterCreditsBySet ??= {};
  profile.boosterCreditsBySet[setId] = (profile.boosterCreditsBySet[setId] ?? 0) + amount;
  if (setId === "summerslam-series-1") profile.boosterCredits = profile.boosterCreditsBySet[setId];
}
export function claimSeasonTier(profile, tier) {
  const state = ensure(profile), current = seasonTier(profile), n = Number(tier);
  if (!Number.isInteger(n) || n < 1 || n > SEASON_TIER_COUNT) throw new Error("Invalid Season tier");
  if (n > current) throw new Error("Season tier not reached");
  if (state.claimedTiers.includes(n)) throw new Error("Season tier already claimed");
  const reward = tierReward(n);
  if (reward.kind === "final-boss-card") {
    if (reward.rewardType === "superstar") {
      // Tier 50 is now the Superstar identity only. Shared deck cards must come
      // from the player's Collection; all Rock-exclusive cards are earned on
      // earlier Season milestones.
      grantSuperstarIdentityUnlockPackage(profile, reward.superstarId);
      state.completionRewardClaimed = true;
      state.completionSuperstarId = reward.superstarId;
    } else {
      addOwnedCard(profile, reward.cardId, { amount: reward.amount ?? 1, foil: !!reward.foil });
    }
    if (reward.bonusUniversePoints) addUniversePoints(profile, reward.bonusUniversePoints);
  } else if (reward.kind === "universe-points") addUniversePoints(profile, reward.amount);
  else grantSetBooster(profile, reward.setId, reward.amount);
  state.claimedTiers.push(n);
  state.claimedTiers.sort((a,b) => a-b);
  return reward;
}
export function claimAllSeasonTiers(profile) {
  const current = seasonTier(profile), rewards = [];
  for (let tier = 1; tier <= current; tier += 1) {
    if (ensure(profile).claimedTiers.includes(tier)) continue;
    rewards.push(claimSeasonTier(profile, tier));
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
  const activeSets = FEATURED_SET_IDS.filter(setId => (profile.setProgress?.[setId]?.lifecycle ?? "featured") === "featured");
  const pool = activeSets.length ? activeSets : FEATURED_SET_IDS;
  const index = Math.min(pool.length - 1, Math.floor(rng() * pool.length));
  const setId = pool[index];
  grantSetBooster(profile, setId, 1);
  const state = ensure(profile);
  state.freePackLastClaimAt = now.toISOString();
  state.freePacksClaimed += 1;
  return { setId, amount: 1, nextAt: new Date(now.getTime() + FREE_PACK_MS) };
}
