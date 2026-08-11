import { canPlayMomentum, canPlayAction, canPlaySupport, canPlayManager, moveEligibility, canCounter, canAttemptPin, canPlayPinEscape, pinChancePercent, submissionThreshold, canReturnToRing, canFollowOutside } from "../engine/rules.js?v=0.11.37";
import { totalMomentum } from "../engine/utils.js?v=0.11.37";
import { isOffensiveMove } from "../data/move-types.js?v=0.11.37";

function effectValue(effect = {}) {
  const amount = effect.amount ?? 1;
  if (effect.type === "draw") return 4 * amount;
  if (effect.type === "discard" && effect.target === "opponent") return 5 * amount;
  if (effect.type === "searchDeck") return 7;
  if (effect.type === "gainMomentum") return (effect.method === "attitude" ? 3 : 4) * amount;
  if (effect.type === "loseMomentum" && effect.target === "opponent") return 3 * amount;
  if (effect.type === "recoverHp") return 2 * amount;
  return 0;
}

function moveScore(match, playerId, card) {
  const opponent = match.players[match.opponentOf(playerId)];
  let score = (card.damage ?? 0) * 4 - (card.cost ?? 0) * 0.35;
  if (card.finisher) score += 30;
  if (card.submission) {
    const part = card.submission.bodyPart;
    const existing = opponent.submissionDamage?.[part] ?? 0;
    const pressure = card.submission.damage ?? 0;
    const threshold = submissionThreshold(opponent);
    const projected = existing + pressure;
    score += 10 + pressure * 1.4 + existing * 0.9 + Math.max(0, 18 - opponent.hp) * 0.35;
    // A hold that can force a tap now or after one maintained squeeze should
    // become a priority instead of losing to a generic high-damage move.
    if (projected >= threshold) score += 55;
    else if (projected + pressure >= threshold) score += 32;
    else if (projected >= threshold * 0.6) score += 14;
    if (card.trademark) score += 5;
  }
  if (card.setOpponentPosture === "on-mat") score += 5;
  if (card.stunTurns) score += 4;
  if (card.requiresPosture && opponent.posture === card.requiresPosture) score += 4;
  score += (card.onConnect ?? []).reduce((sum, effect) => sum + effectValue(effect), 0);
  return score;
}

function chooseMomentum(match, playerId) {
  const p = match.players[playerId];
  const legal = p.hand.filter(c => canPlayMomentum(match, playerId, c));
  if (!legal.length) return null;
  const lockedMoves = p.hand.filter(c => isOffensiveMove(c) && !moveEligibility(match, playerId, c).legal);
  const need = Object.fromEntries(legal.map(c => [c.method, 0]));
  for (const move of lockedMoves) {
    for (const [method, amount] of Object.entries(move.requirements ?? {})) {
      if (method in need) need[method] += Math.max(0, amount - (p.momentum[method] ?? 0)) * ((move.finisher ? 6 : 1) + (move.damage ?? 0));
    }
  }
  const unlocksNow = card => {
    p.momentum[card.method] = (p.momentum[card.method] ?? 0) + (card.amount ?? 1);
    const count = p.hand.filter(c => isOffensiveMove(c) && moveEligibility(match, playerId, c).legal).length;
    p.momentum[card.method] -= (card.amount ?? 1);
    return count;
  };
  legal.sort((a, b) => {
    const immediate = unlocksNow(b) - unlocksNow(a);
    if (immediate) return immediate;
    return (need[b.method] ?? 0) - (need[a.method] ?? 0);
  });
  return legal[0];
}


function chooseSupport(match, playerId) {
  const p = match.players[playerId];
  const legal = p.hand.filter(c => canPlaySupport(match, playerId, c));
  if (!legal.length) return null;
  const score = c => {
    if (c.passive?.totalMomentumBonus) return 18;
    if (c.passive?.damageReduction) return p.hp <= p.maxHp * 0.65 ? 20 : 12;
    if (c.passive?.counterDraw) return 15;
    if (c.passive?.connectedAttitudeBonus) return 14;
    return 5;
  };
  return legal.sort((a,b) => score(b)-score(a))[0];
}

function chooseAction(match, playerId) {
  const p = match.players[playerId];
  const opponent = match.players[match.opponentOf(playerId)];
  const legal = p.hand.filter(c => canPlayAction(match, playerId, c));
  if (!legal.length) return null;
  const legalMoves = p.hand.filter(c => isOffensiveMove(c) && moveEligibility(match, playerId, c).legal);
  const score = c => {
    if (c.id === "catch-breath") return p.hp <= p.maxHp * 0.65 ? 22 : 0;
    if (c.id === "fire-up") return p.momentum.attitude <= 2 ? 18 : 8;
    if (c.id === "create-opening") return legalMoves.length ? 17 : 3;
    if (c.id === "game-plan") return legalMoves.length ? 7 : 19;
    if (c.id === "cut-off-ring") return match.countOut.count >= 4 ? 24 : 8;
    return 5;
  };
  const best = legal.sort((a,b) => score(b)-score(a))[0];
  return score(best) > 0 ? best : null;
}

function chooseMove(match, playerId) {
  return match.players[playerId].hand
    .filter(c => isOffensiveMove(c) && moveEligibility(match, playerId, c).legal)
    .sort((a, b) => moveScore(match, playerId, b) - moveScore(match, playerId, a))[0] ?? null;
}


function passReason(match, playerId) {
  const p = match.players[playerId];
  const offensive = p.hand.filter(isOffensiveMove);
  if (!offensive.length) return "no-move-in-hand";
  const reasons = offensive.map(c => moveEligibility(match, playerId, c).reason).filter(Boolean);
  if (reasons.some(r => r.startsWith("Not enough total momentum"))) return "insufficient-total-momentum";
  if (reasons.some(r => r.startsWith("Requires "))) return "missing-method-momentum";
  if (reasons.some(r => r.includes("same location") || r.includes("must be ring") || r.includes("must be ringside"))) return "location-restriction";
  if (reasons.some(r => r.includes("Opponent must be"))) return "posture-restriction";
  if (reasons.some(r => r === "Stunned")) return "stunned";
  return "no-legal-move";
}

function chooseCounter(match, defenderId) {
  if (match.proposedMove?.uncounterable) return null;
  const incoming = match.proposedMove.card;
  const valid = match.players[defenderId].hand.filter(c => canCounter(match, defenderId, incoming, c));
  if (!valid.length) return null;
  // Preserve broader counters when a narrower counter will do.
  valid.sort((a, b) => {
    const value = c => c.kind === "special" ? 99 : (c.counters?.length ?? 0);
    return value(a) - value(b);
  });
  return valid[0];
}

export function cpuDecision(match, playerId) {
  if (match.phase === "MATCH_OVER") return { type: "none" };
  const p = match.players[playerId];
  const opponent = match.players[match.opponentOf(playerId)];

  if (match.phase === "ACTION" && match.playerInControl === playerId) {
    if (canReturnToRing(match, playerId) && match.countOut.count >= 6) return { type: "returnToRing" };
    const manager = p.hand.find(c => canPlayManager(match, playerId, c));
    if (manager) return { type: "manager", card: manager };

    const support = chooseSupport(match, playerId);
    if (support) return { type: "support", card: support };

    const action = chooseAction(match, playerId);
    if (action) return { type: "action", card: action };

    const momentum = chooseMomentum(match, playerId);
    if (momentum) return { type: "momentum", card: momentum };

    const move = chooseMove(match, playerId);
    if (move) return { type: "move", card: move };
    if (canReturnToRing(match, playerId)) return { type: "returnToRing" };
    return { type: "pass", reason: passReason(match, playerId) };
  }

  if (match.phase === "COUNTER" && match.proposedMove?.defenderId === playerId) {
    const counter = chooseCounter(match, playerId);
    if (counter) return { type: "counter", card: counter };
    const incoming = match.proposedMove.card;
    const danger = (incoming.damage ?? 0) + (incoming.finisher ? 12 : 0) + (incoming.submission ? 8 : 0);
    if (!match.proposedMove.uncounterable && p.hand.length >= 8 && danger >= 16) return { type: "autoCounter", cards: p.hand.slice(0, 7) };
    return { type: "passCounter" };
  }

  if (match.phase === "POST_MOVE" && match.postMove?.attackerId === playerId) {
    if (canFollowOutside(match, playerId) && opponent.hp <= opponent.maxHp * 0.7) return { type: "followOutside" };
    const check = canAttemptPin(match, playerId);
    if (check.legal) {
      // Create pin state temporarily only through the engine; estimate from HP here.
      const hpRatio = opponent.hp / opponent.maxHp;
      const explicitPinPressure = match.postMove.pinAtHpRatio != null && hpRatio <= match.postMove.pinAtHpRatio;
      if ((match.postMove.finisher && hpRatio <= 0.15) || explicitPinPressure || hpRatio <= 0.08 || (hpRatio <= 0.12 && p.momentum.attitude >= check.cost + 2)) return { type: "pin" };
    }
    return { type: "endPostMove" };
  }

  if (match.phase === "PIN_RESPONSE" && match.pin?.defenderId === playerId) {
    const escape = p.hand.find(c => canPlayPinEscape(match, playerId, c));
    const chance = pinChancePercent(match);
    if (escape && (match.pin.finisher || chance >= 42)) return { type: "pinEscape", card: escape };
    return { type: "passPin" };
  }

  if (match.phase === "SUBMISSION_MAINTAIN" && match.submission?.attackerId === playerId) {
    const sub = match.submission;
    const total = opponent.submissionDamage[sub.bodyPart];
    const threshold = submissionThreshold(opponent);
    const nextTotal = total + sub.damage;
    const remaining = Math.max(0, threshold - total);
    const squeezesNeeded = sub.damage > 0 ? Math.ceil(remaining / sub.damage) : 99;
    const canDitch = p.hand.length >= 1;
    const identityHold = sub.finisher || sub.trademark;
    // Finishers and Trademarks should never be voluntarily released while an
    // eligible page exists to pay the maintain cost. Other submissions remain
    // strategic and are maintained when pressure is meaningfully advanced.
    const worthMaintaining = identityHold || nextTotal >= threshold || squeezesNeeded <= 2 || (p.hand.length >= 3 && total >= threshold * 0.35);
    if (canDitch && worthMaintaining) {
      // Ditch the least valuable page: excess Momentum first, then a low-damage move.
      const sorted = [...p.hand].sort((a, b) => {
        const value = c => c.kind === "momentum" ? 2 : c.kind === "entrance" ? 30 : c.kind === "special" ? 25 : (c.finisher ? 40 : (c.damage ?? 0) * 3);
        return value(a) - value(b);
      });
      return { type: "maintain", card: sorted[0] };
    }
    return { type: "release" };
  }

  return { type: "none" };
}

export function executeCpuDecision(engine, playerId) {
  const decision = cpuDecision(engine.state(), playerId);
  switch (decision.type) {
    case "momentum": engine.playMomentum(playerId, decision.card); break;
    case "action": engine.playAction(playerId, decision.card); break;
    case "support": engine.playSupport(playerId, decision.card); break;
    case "manager": engine.playManager(playerId, decision.card); break;
    case "move": engine.declareMove(playerId, decision.card); break;
    case "pass": engine.passTurn(playerId, decision.reason); break;
    case "counter": engine.counter(playerId, decision.card); break;
    case "autoCounter": engine.autoCounter(playerId, decision.cards); break;
    case "passCounter": engine.passCounter(playerId); break;
    case "pin": engine.attemptPin(playerId); break;
    case "endPostMove": engine.endPostMove(playerId); break;
    case "pinEscape": engine.playPinEscape(playerId, decision.card); break;
    case "passPin": engine.passPinResponse(playerId); break;
    case "maintain": engine.maintainSubmission(playerId, decision.card); break;
    case "release": engine.releaseSubmission(playerId); break;
    case "returnToRing": engine.returnToRing(playerId); break;
    case "followOutside": engine.followOutside(playerId); break;
    default: break;
  }
  return decision;
}

export function decisionOwner(match) {
  if (match.phase === "ACTION") return match.playerInControl;
  if (match.phase === "COUNTER") return match.proposedMove?.defenderId ?? null;
  if (match.phase === "POST_MOVE") return match.postMove?.attackerId ?? null;
  if (match.phase === "PIN_RESPONSE") return match.pin?.defenderId ?? null;
  if (match.phase === "SUBMISSION_MAINTAIN") return match.submission?.attackerId ?? null;
  return null;
}
