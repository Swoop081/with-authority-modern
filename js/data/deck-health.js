import { superstars } from "./superstars.js";
import { ownershipCapFor } from "./card-limits.js";
import { isOffensiveMove, isCounterMove } from "./move-types.js";
export const DECK_SIZE = 55;
export const OPENING_SIZE = 5;

// Hard floors keep a deck functional; targets steer auto-building without forcing every
// Superstar into the same exact list. Buckets intentionally overlap only where noted.
export const RECOMMENDED_DECK_SHAPE = Object.freeze({
  // v0.11.x decks deliberately moved to an offense-forward 55-page shape. These
  // guardrails describe that reviewed architecture rather than the older utility-heavy lists.
  momentum: { min: 10, target: 12, max: 16 },
  offensiveMoves: { min: 28, target: 34, max: 40 },
  lowCostMoves: { min: 10, target: 16, max: 26 },       // printed Cost 1–3
  midCostMoves: { min: 5, target: 12, max: 20 },        // printed Cost 4–6
  highCostMoves: { min: 2, target: 6, max: 10 },        // printed Cost 7+
  counters: { min: 12, target: 30, max: 42 },           // Offensive/defensive Moves that can reverse a tactical Move Type
  utility: { min: 1, target: 4, max: 8 },               // Actions + Supports + Managers
  defensiveSpecials: { min: 0, target: 1, max: 4 },
  finishers: { min: 1, target: 3, max: 6 },
  entrance: { min: 0, target: 0, max: 0 }
});

export function cardRoles(card) {
  if (!card) return [];
  const roles = [];
  if (card.kind === "momentum") roles.push("momentum");
  if (card.kind === "entrance") roles.push("entrance");
  if (card.kind === "action" || card.kind === "support" || card.kind === "manager") roles.push("utility");
  if (card.kind === "special" && (card.pinEscape || card.counterAny)) roles.push("defensiveSpecials");
  if (card.kind === "move") {
    if (isCounterMove(card)) roles.push("counters");
    if (isOffensiveMove(card)) {
      roles.push("offensiveMoves");
      const cost = card.cost ?? 0;
      if (cost <= 3) roles.push("lowCostMoves");
      else if (cost <= 6) roles.push("midCostMoves");
      else roles.push("highCostMoves");
      if (card.finisher) roles.push("finishers");
    }
  }
  return roles;
}

function distancePenalty(value, rule) {
  if (value < rule.min) return (rule.min - value) * 12;
  if (value > rule.max) return (value - rule.max) * 5;
  return Math.abs(value - rule.target) * 0.65;
}

export function evaluateDeck(deck, { superstarId = null } = {}) {
  const counts = Object.fromEntries(Object.keys(RECOMMENDED_DECK_SHAPE).map(k => [k, 0]));
  const methodSupply = { agility: 0, knowledge: 0, strength: 0, strike: 0, technical: 0 };
  const methodDemand = { agility: 0, knowledge: 0, strength: 0, strike: 0, technical: 0 };
  const maxMethodRequirement = { agility: 0, knowledge: 0, strength: 0, strike: 0, technical: 0 };

  for (const card of deck) {
    for (const role of cardRoles(card)) counts[role] += 1;
    if (card.kind === "momentum" && card.method in methodSupply) methodSupply[card.method] += card.amount ?? 1;
    if (isOffensiveMove(card)) {
      for (const [method, amount] of Object.entries(card.requirements ?? {})) {
        if (!(method in methodDemand)) continue;
        methodDemand[method] += 1;
        maxMethodRequirement[method] = Math.max(maxMethodRequirement[method], amount ?? 0);
      }
    }
  }

  const opening = deck.slice(0, OPENING_SIZE);
  const openingCounts = {
    entrance: opening.filter(c => c.kind === "entrance").length,
    momentum: opening.filter(c => c.kind === "momentum").length,
    offensiveMoves: opening.filter(c => isOffensiveMove(c)).length
  };

  const violations = [];
  const warnings = [];
  const idCounts = new Map();
  for (const card of deck) idCounts.set(card.id, (idCounts.get(card.id) ?? 0) + 1);
  for (const [cardId, count] of idCounts) {
    const card = deck.find(c => c.id === cardId);
    const cap = ownershipCapFor(card ?? cardId);
    if (count > cap) violations.push(`${card?.name ?? cardId} exceeds its ${cap}-copy deck limit.`);
  }

  if (deck.length !== DECK_SIZE) violations.push(`Deck must contain exactly ${DECK_SIZE} pages.`);
  if (opening.length !== OPENING_SIZE || openingCounts.entrance !== 0 || openingCounts.momentum < 2 || openingCounts.offensiveMoves < 3) {
    violations.push("Lead Off five must contain no Entrance, at least two Momentum pages, and at least three offensive/counter Moves.");
  }
  const managerCount = deck.filter(card => card.kind === "manager").length;
  if (managerCount > 1) violations.push("Deck may contain at most one Manager.");

  for (const [role, rule] of Object.entries(RECOMMENDED_DECK_SHAPE)) {
    const value = counts[role];
    if (value < rule.min) violations.push(`${role} is below the functional floor (${value}/${rule.min}).`);
    else if (value > rule.max) warnings.push(`${role} is above the recommended range (${value}/${rule.max}).`);
  }

  for (const method of Object.keys(methodSupply)) {
    if (methodDemand[method] > 0 && methodSupply[method] < maxMethodRequirement[method]) {
      violations.push(`${method} Momentum cannot satisfy the deck's highest ${method} requirement (${methodSupply[method]}/${maxMethodRequirement[method]}).`);
    }
    if (methodDemand[method] >= 3 && methodSupply[method] === 0) {
      violations.push(`${method} is required by multiple Moves but the deck contains no ${method} Momentum.`);
    }
  }

  if (superstarId) {
    const illegal = deck.filter(c => c.superstarId && c.superstarId !== superstarId);
    if (illegal.length) violations.push(`${illegal.length} page(s) belong to another Superstar.`);
    const illegalManagers = deck.filter(c => c.kind === "manager" && (c.allowedSuperstarIds?.length ?? 0) > 0 && !c.allowedSuperstarIds.includes(superstarId));
    if (illegalManagers.length) violations.push(`${illegalManagers.length} Manager card(s) are not eligible for this Superstar.`);
    const linked = Object.values(superstars).find(s => s.id === superstarId)?.leadOffIds ?? [];
    const actual = deck.slice(0, OPENING_SIZE).map(c => c.id);
    if (linked.length === OPENING_SIZE && actual.join("|") !== linked.join("|")) violations.push("Opening five must match the Superstar-linked Lead Off package.");
  }

  let penalty = Math.abs(deck.length - DECK_SIZE) * 20;
  for (const [role, rule] of Object.entries(RECOMMENDED_DECK_SHAPE)) penalty += distancePenalty(counts[role], rule);
  penalty += violations.length * 25;
  const score = Math.max(0, Math.round((100 - penalty) * 10) / 10);

  return {
    healthy: violations.length === 0,
    score,
    counts,
    openingCounts,
    methodSupply,
    methodDemand,
    maxMethodRequirement,
    violations,
    warnings
  };
}

export function isDeckSwapSafe(beforeDeck, afterDeck, options = {}) {
  const before = evaluateDeck(beforeDeck, options);
  const after = evaluateDeck(afterDeck, options);
  if (after.violations.length > before.violations.length) return false;
  if (after.score + 0.01 < before.score) return false;
  return true;
}
