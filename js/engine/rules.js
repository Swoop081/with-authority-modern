import { totalMomentum } from "./utils.js";

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

export function moveEligibility(match, playerId, card) {
  const player = match.players[playerId];
  if (match.phase !== "ACTION") return { legal: false, reason: "Wrong phase" };
  if (match.playerInControl !== playerId) return { legal: false, reason: "Not in control" };
  if (card.kind !== "move") return { legal: false, reason: "Not a move" };
  if (card.defensiveOnly) return { legal: false, reason: "Defensive counter only" };
  const opponent = match.players[match.opponentOf(playerId)];
  if (!card.crossLocation && player.location !== opponent.location) return { legal: false, reason: "Wrestlers must be at the same location" };
  if (card.requiresLocation && player.location !== card.requiresLocation) return { legal: false, reason: `You must be ${card.requiresLocation}` };
  if (card.superstarId && card.superstarId !== player.superstar.id) return { legal: false, reason: "Wrong Superstar" };
  if (player.status.stunnedTurns > 0 && !card.playableWhileStunned) return { legal: false, reason: "Stunned" };
  const threshold = Math.max(0, (card.cost ?? 0) + (player.turn.nextMoveCostModifier ?? 0));
  if (effectiveTotalMomentum(player) < threshold) return { legal: false, reason: `Not enough total momentum (need ${threshold})` };
  for (const [method, amount] of Object.entries(card.requirements ?? {})) {
    if ((player.momentum[method] ?? 0) < amount) return { legal: false, reason: `Requires ${amount} ${method}` };
  }
  if (card.requiresPosture && opponent.posture !== card.requiresPosture) return { legal: false, reason: `Opponent must be ${card.requiresPosture}` };
  return { legal: true, threshold };
}

export function canCounter(incomingMove, counterCard) {
  if (counterCard.kind === "special" && counterCard.counterAny) return true;
  if (counterCard.kind !== "move") return false;
  const targets = counterCard.counters ?? [];
  return targets.includes("any") || targets.includes(incomingMove.moveType);
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
  return match.phase === "PIN_RESPONSE" && match.pin?.defenderId === playerId && card.kind === "special" && card.pinEscape === true;
}

export function pinChancePercent(match) {
  const pin = match.pin;
  if (!pin) return 0;
  const defender = match.players[pin.defenderId];
  const missingHpRatio = 1 - (defender.hp / defender.maxHp);
  const finisherBonus = pin.finisher ? 15 : 0;
  return Math.max(5, Math.min(95, Math.round(15 + missingHpRatio * 65 + finisherBonus)));
}

export function submissionThreshold(player) { return Math.max(6, Math.ceil(player.hp / 2)); }

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
