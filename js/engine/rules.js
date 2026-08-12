import { totalMomentum } from "./utils.js?v=0.11.44";

export function supportPassive(player, key) {
  return (player.activeSupports ?? []).reduce((sum, card) => sum + (card.passive?.[key] ?? 0), 0);
}

export function effectiveTotalMomentum(player) {
  return totalMomentum(player) + supportPassive(player, "totalMomentumBonus");
}

export function canPlayMomentum(match, playerId, card) {
  const player = match.players[playerId];
  return match.phase === "ACTION" && match.playerInControl === playerId && card.kind === "momentum" && player.turn.momentumPlayed < player.turn.momentumPlayLimit;
}

export function canPlayEntrance() {
  // Entrances are linked Lead Off cards that resolve automatically in the PRE-MATCH phase.
  return false;
}

export function canPlayAction(match, playerId, card) {
  const player = match.players[playerId];
  const opponent = match.players[match.opponentOf(playerId)];
  if (player.specialFlags?.blockActionUntilMove) return false;
  if (!(match.phase === "ACTION" && match.playerInControl === playerId && card.kind === "action" && player.turn.actionPlayed < 1 && (!card.superstarId || card.superstarId === player.superstar.id))) return false;
  if (card.requiresLocation && player.location !== card.requiresLocation) return false;
  if (card.requiresOpponentLocation && opponent.location !== card.requiresOpponentLocation) return false;
  if (card.requiresSameLocation && player.location !== opponent.location) return false;
  return true;
}

export function canPlaySupport(match, playerId, card) {
  const player = match.players[playerId];
  return match.phase === "ACTION" && match.playerInControl === playerId && card.kind === "support" && player.turn.supportPlayed < 1 && (!card.superstarId || card.superstarId === player.superstar.id);
}

export function canPlayManager(match, playerId, card) {
  const player = match.players[playerId];
  if (!(match.phase === "ACTION" && match.playerInControl === playerId && card.kind === "manager" && !player.activeManager)) return false;
  const allowed = card.allowedSuperstarIds ?? [];
  return !allowed.length || allowed.includes(player.superstar.id);
}

function moveStateAndResourceEligibility(match, playerId, card, { counterContext = false } = {}) {
  const player = match.players[playerId];
  if (card.kind !== "move") return { legal: false, reason: "Not a move" };
  const opponent = match.players[match.opponentOf(playerId)];

  if (!counterContext && card.defensiveOnly) return { legal: false, reason: "Defensive counter only" };
  if (!card.crossLocation && player.location !== opponent.location) return { legal: false, reason: "Wrestlers must be at the same location" };
  if (card.requiresLocation && player.location !== card.requiresLocation) return { legal: false, reason: `You must be ${card.requiresLocation}` };
  if (card.requiresOpponentLocation && opponent.location !== card.requiresOpponentLocation) return { legal: false, reason: `Opponent must be ${card.requiresOpponentLocation}` };
  if (card.requiresSameLocation && player.location !== opponent.location) return { legal: false, reason: "Wrestlers must be at the same location" };
  if (card.superstarId && card.superstarId !== player.superstar.id) return { legal: false, reason: "Wrong Superstar" };
  if (player.status.stunnedTurns > 0 && !card.playableWhileStunned) return { legal: false, reason: "Stunned" };

  // Lead Off is a one-time first-Move discount and applies equally if that
  // first Move is used as a legal counter-attack. Printed method gates remain.
  const leadOffDiscount = player.leadOffActive && (card.cost ?? 0) <= 2 ? 1 : 0;
  // Turn-only action modifiers are only generated while that wrestler has
  // Control. They must not leak into an out-of-Control counter window.
  const turnModifier = counterContext ? 0 : (player.turn.nextMoveCostModifier ?? 0);
  const cardModifier = counterContext ? 0 : (player.pendingCardCostModifiers?.[card.id] ?? 0);
  const methodModifier = (!counterContext && player.specialFlags?.nextMethodMoveCostModifier?.method === card.method)
    ? (player.specialFlags.nextMethodMoveCostModifier.amount ?? 0) : 0;
  const threshold = Math.max(0, (card.cost ?? 0) + turnModifier + cardModifier + methodModifier - leadOffDiscount);

  if (effectiveTotalMomentum(player) < threshold) {
    return { legal: false, reason: `Not enough total momentum (need ${threshold})`, threshold };
  }
  for (const [method, amount] of Object.entries(card.requirements ?? {})) {
    if ((player.momentum[method] ?? 0) < amount) {
      return { legal: false, reason: `Requires ${amount} ${method}`, threshold };
    }
  }
  if (card.requiresPosture && opponent.posture !== card.requiresPosture) {
    return { legal: false, reason: `Opponent must be ${card.requiresPosture}`, threshold };
  }
  return { legal: true, threshold };
}

export function moveEligibility(match, playerId, card) {
  if (match.phase !== "ACTION") return { legal: false, reason: "Wrong phase" };
  if (match.playerInControl !== playerId) return { legal: false, reason: "Not in control" };
  return moveStateAndResourceEligibility(match, playerId, card);
}

export function counterEligibility(match, defenderId, incomingMove, counterCard) {
  if (match.phase !== "COUNTER") return { legal: false, reason: "Wrong phase" };
  if (!match.proposedMove || match.proposedMove.defenderId !== defenderId) return { legal: false, reason: "No counter window" };

  // Bloodline Rules taxes the first Counter of any kind, including Counter Any Specials.
  const bloodlineDefender = match.players[defenderId];
  if ((bloodlineDefender?.specialFlags?.bloodlineCounterTax ?? 0) > 0 && (bloodlineDefender?.specialFlags?.bloodlineCounterTaxRemaining ?? 0) > 0) {
    if ((bloodlineDefender.momentum.attitude ?? 0) < bloodlineDefender.specialFlags.bloodlineCounterTax) {
      return { legal: false, reason: "Bloodline Rules: need +1 Attitude to Counter" };
    }
  }

  // Counter Any Specials are purpose-built defensive pages and do not inherit
  // Move resource gates.
  if (counterCard.kind === "special" && counterCard.counterAny) {
    if (counterCard.superstarId && match.players[defenderId]?.superstar?.id !== counterCard.superstarId) return { legal: false, reason: "Wrong Superstar" };
    return { legal: true };
  }

  if (counterCard.kind !== "move") return { legal: false, reason: "Not a counter Move" };
  const targets = counterCard.counters ?? [];
  const methodTargets = counterCard.counterMethods ?? [];
  const matchesType = targets.includes("any") || targets.includes(incomingMove.moveType);
  const matchesMethod = methodTargets.includes("any") || methodTargets.includes(incomingMove.method);
  if (!matchesType && !matchesMethod) {
    return { legal: false, reason: methodTargets.length ? `Does not counter ${incomingMove.method ?? "this"} Moves` : "Does not counter this Move Type" };
  }

  // A Move does not become free simply because it is being used as a counter.
  // It must satisfy the same Superstar, Momentum, method, location, posture and
  // stun gates as a normal Move, with only phase/Control bypassed for the
  // response window.
  return moveStateAndResourceEligibility(match, defenderId, counterCard, { counterContext: true });
}

export function canCounter(match, defenderId, incomingMove, counterCard) {
  return counterEligibility(match, defenderId, incomingMove, counterCard).legal;
}

export function pinAttemptCost(match, playerId) { return match.players[playerId].pinAttempts; }

export function canAttemptPin(match, playerId) {
  const post = match.postMove;
  if (match.phase !== "POST_MOVE" || !post || post.attackerId !== playerId) return { legal: false, reason: "No pin opportunity" };
  const attacker = match.players[playerId];
  const defender = match.players[post.defenderId];
  if (match.turnNumber < (match.pinBlockedUntilTurn ?? 0)) return { legal: false, reason: `Pins are blocked until Turn ${match.pinBlockedUntilTurn}` };
  if (attacker.location !== "ring" || defender.location !== "ring") return { legal: false, reason: "Pins must happen in the ring" };
  if (defender.posture !== "on-mat") return { legal: false, reason: "Opponent must be on-mat" };
  const cost = pinAttemptCost(match, playerId);
  if (match.players[playerId].momentum.attitude < cost) return { legal: false, reason: `Need ${cost} Attitude` };
  return { legal: true, cost };
}

export function canPlayPinEscape(match, playerId, card) {
  if (!(match.phase === "PIN_RESPONSE" && match.pin?.defenderId === playerId && card.kind === "special" && card.pinEscape === true)) return false;
  if (card.superstarId && match.players[playerId]?.superstar?.id !== card.superstarId) return false;
  if (match.pin?.noGenericPinEscape && !card.superstarId) return false;
  return true;
}

export function pinChancePercent(match) {
  const pin = match.pin;
  if (!pin) return 0;
  const defender = match.players[pin.defenderId];
  const hpRatio = Math.max(0, defender.hp) / Math.max(1, defender.maxHp);
  const missingHpRatio = 1 - hpRatio;
  const finisherBonus = pin.finisher ? 8 : 0;
  // Critical-state pressure: 0 HP is not an automatic KO, but a wrestler who
  // has been completely depleted should be in genuine danger of being pinned.
  // This scales in before 0 so the intended 0-10% finishing window matters.
  const criticalBonus = hpRatio <= 0 ? 23 : hpRatio <= 0.05 ? 16 : hpRatio <= 0.10 ? 10 : hpRatio <= 0.15 ? 5 : 0;
  const lateMatchBonus = match.turnNumber >= 45 ? 50 : match.turnNumber >= 35 ? 25 : 0;
  return Math.max(5, Math.min(95, Math.round(1 + missingHpRatio * 15 + finisherBonus + criticalBonus + lateMatchBonus + (pin.chanceModifier ?? 0))));
}

export function submissionThreshold(player) {
  // Submission resilience is based on both the Superstar's durability and their
  // current condition. At full health a fresh opponent is difficult to submit,
  // but accumulated match damage lowers the pressure required to force a tap.
  // Body-part pressure persists independently, so repeated attacks to one limb
  // create a genuine alternate finishing route rather than a one-card lottery.
  const maxHp = Math.max(1, player.maxHp ?? player.hp ?? 1);
  const hp = Math.max(0, Math.min(maxHp, player.hp ?? maxHp));
  return Math.max(12, Math.ceil(maxHp * 0.45 + hp * 0.20));
}

export function canReturnToRing(match, playerId) {
  const p = match.players[playerId];
  return match.phase === "ACTION" && match.playerInControl === playerId && p.location === "ringside" && p.status.stunnedTurns <= 0 && (p.status.returnBlockedTurns ?? 0) <= 0;
}

export function canFollowOutside(match, playerId) {
  const post = match.postMove;
  if (match.phase !== "POST_MOVE" || !post || post.attackerId !== playerId) return false;
  const attacker = match.players[playerId];
  const defender = match.players[post.defenderId];
  return attacker.location === "ring" && defender.location === "ringside";
}
