// WWE Legacy four-tier collectible printing system.
// Authored card data is the Sapphire balance baseline. Normal/Emerald step
// down offensive strength; Ruby is the premium +1 chase. Cost, requirements,
// Counter states and authored secondary effects do not change by tier.
export const CARD_TIERS = Object.freeze(["normal", "emerald", "sapphire", "ruby"]);
export const TIER_LABELS = Object.freeze({ normal: "Normal", emerald: "Emerald", sapphire: "Sapphire", ruby: "Ruby" });
export const TIER_RANK = Object.freeze({ normal: 0, emerald: 1, sapphire: 2, ruby: 3 });
export const TIER_DAMAGE_OFFSETS = Object.freeze({ normal: -2, emerald: -1, sapphire: 0, ruby: 1 });
// Pull odds are separate from the underlying card's authored 1★–4★ rarity.
export const TIER_PULL_WEIGHTS = Object.freeze({ normal: .65, emerald: .25, sapphire: .08, ruby: .02 });
export const DEFAULT_AUTHORED_TIER = "sapphire";
export const DEFAULT_STARTER_TIER = "normal";

export function normalizeCardTier(value, fallback = "normal") {
  const key = String(value ?? "").toLowerCase();
  return CARD_TIERS.includes(key) ? key : fallback;
}
export function tierLabel(value) { return TIER_LABELS[normalizeCardTier(value)] ?? TIER_LABELS.normal; }
export function tierRank(value) { return TIER_RANK[normalizeCardTier(value)] ?? 0; }
export function isTierHigher(a, b) { return tierRank(a) > tierRank(b); }

export function tierDamageOffsetFor(card, tier = DEFAULT_AUTHORED_TIER) {
  if (!card || card.kind !== "move") return 0;
  const base = Number(card.authoredDamage ?? card.damage ?? 0);
  if (!(base > 0)) return 0;
  const wanted = TIER_DAMAGE_OFFSETS[normalizeCardTier(tier, DEFAULT_AUTHORED_TIER)] ?? 0;
  return Math.max(0, base + wanted) - base;
}

export function tierSubmissionPressureOffsetFor(card, tier = DEFAULT_AUTHORED_TIER) {
  const base = Number(card?.authoredSubmissionPressure ?? card?.submission?.pressure ?? 0);
  if (!(base > 0)) return 0;
  const wanted = TIER_DAMAGE_OFFSETS[normalizeCardTier(tier, DEFAULT_AUTHORED_TIER)] ?? 0;
  // Submission pressure is a primary offensive stat just like Damage. Keep a
  // +1 floor so a low-pressure hold never becomes a zero-pressure hold.
  return Math.max(1, base + wanted) - base;
}

export function applyCardTier(card, tier = DEFAULT_AUTHORED_TIER) {
  if (!card) return card;
  const resolvedTier = normalizeCardTier(tier, DEFAULT_AUTHORED_TIER);
  const authoredDamage = Number(card.authoredDamage ?? card.damage ?? 0);
  const damageOffset = tierDamageOffsetFor({ ...card, damage: authoredDamage, authoredDamage }, resolvedTier);
  const authoredSubmissionPressure = Number(card.authoredSubmissionPressure ?? card.submission?.pressure ?? 0);
  const pressureOffset = tierSubmissionPressureOffsetFor({ ...card, authoredSubmissionPressure }, resolvedTier);
  const tieredSubmission = card.submission && authoredSubmissionPressure > 0
    ? { ...card.submission, pressure: Math.max(1, authoredSubmissionPressure + pressureOffset) }
    : card.submission;
  return {
    ...card,
    tier: resolvedTier,
    ...(card.kind === "move" ? {
      authoredDamage,
      tierDamageOffset: damageOffset,
      damage: Math.max(0, authoredDamage + damageOffset),
      ...(card.submission ? { authoredSubmissionPressure, tierSubmissionPressureOffset: pressureOffset, submission: tieredSubmission } : {})
    } : {})
  };
}

export function rollCardTier(rng = Math.random, allowedTiers = CARD_TIERS, weights = TIER_PULL_WEIGHTS) {
  const tiers = CARD_TIERS.filter(tier => allowedTiers.includes(tier));
  if (!tiers.length) return "normal";
  const total = tiers.reduce((sum, tier) => sum + Math.max(0, Number(weights[tier]) || 0), 0);
  if (!(total > 0)) return tiers[0];
  let roll = rng() * total;
  for (const tier of tiers) {
    roll -= Math.max(0, Number(weights[tier]) || 0);
    if (roll <= 0) return tier;
  }
  return tiers.at(-1);
}

export function highestOwnedTier(owned = {}, preferred = CARD_TIERS) {
  const ordered = [...preferred].sort((a,b)=>tierRank(b)-tierRank(a));
  return ordered.find(tier => Math.max(0, Number(owned?.[tier]) || 0) > 0) ?? null;
}
