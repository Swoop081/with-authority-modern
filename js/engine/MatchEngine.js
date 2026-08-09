import { PHASES } from "./constants.js";
import { clone } from "./utils.js";
import {
  canPlayMomentum,
  canPlayEntrance,
  canPlayAction,
  canPlaySupport,
  canPlayManager,
  supportPassive,
  moveEligibility,
  canCounter,
  canAttemptPin,
  canPlayPinEscape,
  pinChancePercent,
  submissionThreshold
} from "./rules.js";

export class MatchEngine {
  constructor({ superstarA, superstarB, deckA = [], deckB = [], startingControl = "p1", rng = Math.random }) {
    this.rng = rng;
    this.match = {
      phase: PHASES.PRE_MATCH,
      playerInControl: startingControl,
      turnNumber: 1,
      proposedMove: null,
      postMove: null,
      submission: null,
      pin: null,
      winner: null,
      finish: null,
      pinBlockedUntilTurn: 0,
      preMatchComplete: false,
      countOut: { count: 0, limit: 10 },
      log: [],
      players: {
        p1: this.#makePlayer("p1", superstarA, deckA),
        p2: this.#makePlayer("p2", superstarB, deckB)
      }
    };
    this.match.opponentOf = (id) => id === "p1" ? "p2" : "p1";
    this.#log("PRE_MATCH_STARTED");
    this.#resolvePreMatchEntrance("p1");
    this.#resolvePreMatchEntrance("p2");
    this.match.preMatchComplete = true;
    this.match.phase = PHASES.ACTION;
    this.#log("BELL_RANG", { control: startingControl });
    this.#log("MATCH_STARTED", { control: startingControl });
    this.#startFreshControl(startingControl, { draw: true, triggerTurnStart: true, triggerControlStart: true });
  }

  #makePlayer(id, superstar, deck) {
    const opening = clone(deck.slice(0, 5));
    const shuffled = clone(deck.slice(5));
    for (let i = shuffled.length - 1; i > 0; i -= 1) {
      const j = Math.floor(this.rng() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return {
      id,
      superstar: clone(superstar),
      hp: superstar.hp,
      maxHp: superstar.hp,
      momentum: { agility: 0, knowledge: 0, strength: 0, strike: 0, technical: 0, attitude: 0 },
      posture: "standing",
      location: "ring",
      status: { stunnedTurns: 0, returnBlockedTurns: 0 },
      submissionDamage: { head: 0, arm: 0, back: 0, leg: 0 },
      hand: opening,
      deck: shuffled,
      discard: [],
      turn: { momentumPlayed: 0, momentumPlayLimit: 1, actionPlayed: 0, supportPlayed: 0, nextMoveCostModifier: 0, nextMoveDamageBonus: 0 },
      activeSupports: [],
      activeManager: null,
      managerAbilityUsed: false,
      entrancePlayed: false,
      entranceSchedules: [],
      abilityUses: 0,
      abilityUsed: false,
      passiveFlags: { firstStunIgnored: false },
      history: { connectedMoveTypes: [], connectedMethods: [] },
      pendingExtraMomentum: 0,
      pendingMoveDamageBonus: 0,
      pinAttempts: 0
    };
  }

  #log(type, data = {}) { this.match.log.push({ type, turn: this.match.turnNumber, ...data }); }
  state() { return this.match; }
  opponentOf(id) { return this.match.opponentOf(id); }

  #assertMatchActive() {
    if (this.match.phase === PHASES.MATCH_OVER) throw new Error("Match is over");
  }

  #takeFromHand(playerId, card) {
    const p = this.match.players[playerId];
    const index = p.hand.findIndex(c => c === card || c.id === card.id);
    if (index < 0) throw new Error("Card is not in hand");
    return p.hand.splice(index, 1)[0];
  }

  #draw(playerId, amount = 1) {
    const p = this.match.players[playerId];
    const drawn = [];
    for (let i = 0; i < amount && p.deck.length; i += 1) {
      const card = p.deck.shift();
      p.hand.push(card);
      drawn.push(card.id);
    }
    if (drawn.length) this.#log("CARDS_DRAWN", { playerId, cardIds: drawn });
    return drawn;
  }

  #effectTarget(sourcePlayerId, effect) {
    return effect.target === "opponent" ? this.opponentOf(sourcePlayerId) : sourcePlayerId;
  }

  #discardRandom(playerId, amount = 1, sourceCardId = null) {
    const p = this.match.players[playerId];
    const discarded = [];
    for (let i = 0; i < amount && p.hand.length; i += 1) {
      const index = Math.min(p.hand.length - 1, Math.floor(this.rng() * p.hand.length));
      const [card] = p.hand.splice(index, 1);
      p.discard.push(card);
      discarded.push(card.id);
    }
    if (discarded.length) this.#log("CARDS_DISCARDED", { playerId, cardIds: discarded, sourceCardId });
    return discarded;
  }

  #searchDeck(playerId, effect, sourceCardId = null) {
    const p = this.match.players[playerId];
    const ids = effect.cardIds ?? (effect.cardId ? [effect.cardId] : []);
    const index = p.deck.findIndex(card =>
      (ids.length && ids.includes(card.id)) ||
      (!ids.length && effect.kind && card.kind === effect.kind) ||
      (!ids.length && effect.finisher === true && card.finisher === true)
    );
    if (index < 0) {
      this.#log("CARD_SEARCH_MISSED", { playerId, sourceCardId, cardIds: ids });
      return null;
    }
    const [card] = p.deck.splice(index, 1);
    p.hand.push(card);
    this.#log("CARD_SEARCHED", { playerId, cardId: card.id, sourceCardId });
    return card;
  }

  #applyEffects(playerId, effects = [], context = {}) {
    for (const effect of effects) {
      const targetId = this.#effectTarget(playerId, effect);
      const target = this.match.players[targetId];
      if (effect.type === "draw") this.#draw(targetId, effect.amount ?? 1);
      if (effect.type === "discard") this.#discardRandom(targetId, effect.amount ?? 1, context.sourceCardId ?? null);
      if (effect.type === "searchDeck") this.#searchDeck(targetId, effect, context.sourceCardId ?? null);
      if (effect.type === "gainMomentum") {
        target.momentum[effect.method] = (target.momentum[effect.method] ?? 0) + (effect.amount ?? 1);
        this.#log("MOMENTUM_EFFECT", { playerId: targetId, method: effect.method, amount: effect.amount ?? 1, sourceCardId: context.sourceCardId ?? null });
      }
      if (effect.type === "loseMomentum") {
        const before = target.momentum[effect.method] ?? 0;
        const amount = Math.min(before, effect.amount ?? 1);
        target.momentum[effect.method] = Math.max(0, before - amount);
        if (amount) this.#log("MOMENTUM_EFFECT", { playerId: targetId, method: effect.method, amount: -amount, sourceCardId: context.sourceCardId ?? null });
      }
      if (effect.type === "extraMomentumPlay") target.turn.momentumPlayLimit += effect.amount ?? 1;
      if (effect.type === "extraMomentumNextControl") target.pendingExtraMomentum += effect.amount ?? 1;
      if (effect.type === "nextConnectedMoveDamageBonus") target.pendingMoveDamageBonus += effect.amount ?? 0;
      if (effect.type === "blockPinsUntilTurn") this.match.pinBlockedUntilTurn = Math.max(this.match.pinBlockedUntilTurn ?? 0, effect.turn ?? this.match.turnNumber);
      if (effect.type === "recoverHp") {
        const before = target.hp;
        target.hp = Math.min(target.maxHp, target.hp + (effect.amount ?? 0));
        if (target.hp !== before) this.#log("HP_RECOVERED", { playerId: targetId, amount: target.hp - before, sourceCardId: context.sourceCardId ?? null });
      }
      if (effect.type === "nextMoveCostModifier") target.turn.nextMoveCostModifier += effect.amount ?? 0;
      if (effect.type === "nextMoveDamageBonus") target.turn.nextMoveDamageBonus += effect.amount ?? 0;
      if (effect.type === "blockOpponentReturn") {
        const opponent = this.match.players[this.opponentOf(playerId)];
        opponent.status.returnBlockedTurns = Math.max(opponent.status.returnBlockedTurns ?? 0, effect.amount ?? 2);
      }
    }
  }

  #whenMatches(playerId, when = {}, context = {}) {
    const p = this.match.players[playerId];
    const opponent = this.match.players[this.opponentOf(playerId)];
    const turn = context.turnNumber ?? this.match.turnNumber;
    if (when.hpAtOrBelowPercent != null && (p.hp / p.maxHp) * 100 > when.hpAtOrBelowPercent) return false;
    if (when.minDamage != null && (context.damage ?? 0) < when.minDamage) return false;
    if (when.minCost != null && ((context.card?.cost ?? context.incomingMove?.cost ?? 0) < when.minCost)) return false;
    if (when.moveTypes && !when.moveTypes.includes(context.moveType ?? context.card?.moveType)) return false;
    if (when.methods && !when.methods.includes(context.method ?? context.card?.method)) return false;
    if (when.finisher === true && !context.card?.finisher) return false;
    if (when.minTurn != null && turn < when.minTurn) return false;
    if (when.maxTurn != null && turn > when.maxTurn) return false;
    if (when.startAt != null && turn < when.startAt) return false;
    if (when.every != null && ((turn - (when.startAt ?? when.every)) % when.every !== 0)) return false;
    if (when.turns && !when.turns.includes(turn)) return false;
    if (when.behindHp === true && !(p.hp < opponent.hp)) return false;
    if (when.opponentStunned === true && !(opponent.status.stunnedTurns > 0)) return false;
    if (when.opponentAttitudeAtLeast != null && opponent.momentum.attitude < when.opponentAttitudeAtLeast) return false;
    if (when.firstTimeMoveType === true && p.history.connectedMoveTypes.includes(context.moveType)) return false;
    if (when.firstTimeMethod === true && p.history.connectedMethods.includes(context.method)) return false;
    return true;
  }

  #abilityMatches(playerId, trigger, context = {}) {
    const p = this.match.players[playerId];
    const ability = p.superstar.ability;
    if (!ability || ability.passive || ability.trigger !== trigger) return false;
    const maxUses = ability.maxUses ?? 1;
    if (p.abilityUses >= maxUses) return false;
    return this.#whenMatches(playerId, ability.when ?? {}, context);
  }

  #triggerManager(playerId, trigger, context = {}) {
    const p = this.match.players[playerId];
    const manager = p.activeManager;
    if (!manager || p.managerAbilityUsed || manager.trigger !== trigger) return false;
    if (!this.#whenMatches(playerId, manager.when ?? {}, context)) return false;
    p.managerAbilityUsed = true;
    this.#applyEffects(playerId, manager.effects ?? [], { ...context, sourceCardId: manager.id });
    this.#log("MANAGER_ABILITY", { playerId, managerId: manager.id, managerName: manager.name, trigger });
    return true;
  }

  #triggerAbility(playerId, trigger, context = {}) {
    if (!this.#abilityMatches(playerId, trigger, context)) return false;
    const p = this.match.players[playerId];
    const ability = p.superstar.ability;
    p.abilityUses += 1;
    p.abilityUsed = p.abilityUses >= (ability.maxUses ?? 1);
    this.#applyEffects(playerId, ability.effects ?? [], { ...context, sourceCardId: p.superstar.cardId ?? ability.id });
    this.#log("SUPERSTAR_ABILITY", { playerId, abilityId: ability.id, abilityName: ability.name, trigger, use: p.abilityUses, maxUses: ability.maxUses ?? 1 });
    return true;
  }

  #resolvePreMatchEntrance(playerId) {
    const p = this.match.players[playerId];
    const index = p.hand.findIndex(card => card.kind === "entrance" && card.superstarId === p.superstar.id);
    if (index < 0) throw new Error(`Missing linked Entrance for ${p.superstar.name}`);
    const [entrance] = p.hand.splice(index, 1);
    p.entrancePlayed = true;
    this.#applyEffects(playerId, entrance.effects ?? [], { sourceCardId: entrance.id, preMatch: true });
    p.entranceSchedules = (entrance.scheduled ?? []).map((schedule, i) => ({
      ...clone(schedule),
      id: schedule.id ?? `${entrance.id}-schedule-${i + 1}`,
      sourceCardId: entrance.id,
      sourceName: entrance.name,
      triggerCount: 0
    }));
    p.discard.push(entrance);
    this.#log("ENTRANCE_PREMATCH", { playerId, cardId: entrance.id, cardName: entrance.name, scheduledCount: p.entranceSchedules.length });
  }

  #entranceScheduleTimingMatches(schedule, turn) {
    if (schedule.atTurn != null && turn !== schedule.atTurn) return false;
    if (schedule.minTurn != null && turn < schedule.minTurn) return false;
    if (schedule.maxTurn != null && turn > schedule.maxTurn) return false;
    if (schedule.every != null) {
      const startAt = schedule.startAt ?? schedule.every;
      if (turn < startAt || (turn - startAt) % schedule.every !== 0) return false;
    }
    return true;
  }

  #triggerEntranceSchedules(playerId, trigger, context = {}) {
    const p = this.match.players[playerId];
    let triggered = 0;
    for (const schedule of p.entranceSchedules ?? []) {
      if (schedule.trigger !== trigger) continue;
      if (schedule.triggerCount >= (schedule.maxTriggers ?? 1)) continue;
      const turn = context.turnNumber ?? this.match.turnNumber;
      if (!this.#entranceScheduleTimingMatches(schedule, turn)) continue;
      if (!this.#whenMatches(playerId, schedule.when ?? {}, { ...context, turnNumber: turn })) continue;
      schedule.triggerCount += 1;
      this.#applyEffects(playerId, schedule.effects ?? [], { ...context, sourceCardId: schedule.sourceCardId, entranceScheduleId: schedule.id });
      this.#log("ENTRANCE_EFFECT", { playerId, cardId: schedule.sourceCardId, cardName: schedule.sourceName, scheduleId: schedule.id, trigger, triggerCount: schedule.triggerCount });
      triggered += 1;
    }
    return triggered;
  }

  #runTurnStartTriggers() {
    const context = { turnNumber: this.match.turnNumber };
    for (const playerId of ["p1", "p2"]) {
      this.#triggerEntranceSchedules(playerId, "TURN_START", context);
      this.#triggerAbility(playerId, "TURN_START", context);
    }
  }

  #superstarDamageReduction(player, card) {
    const rule = player.superstar.ability?.passive?.damageReduction;
    if (!rule) return 0;
    if (rule.methods && !rule.methods.includes(card.method)) return 0;
    if (rule.moveTypes && !rule.moveTypes.includes(card.moveType)) return 0;
    return rule.amount ?? 0;
  }

  playMomentum(playerId, card) {
    this.#assertMatchActive();
    if (!canPlayMomentum(this.match, playerId, card)) throw new Error("Illegal momentum play");
    const p = this.match.players[playerId];
    const played = this.#takeFromHand(playerId, card);
    p.momentum[played.method] += played.amount ?? 1;
    p.turn.momentumPlayed += 1;
    p.discard.push(played);
    this.#log("MOMENTUM_PLAYED", { playerId, cardId: played.id, method: played.method });
  }

  playEntrance(playerId, card) {
    this.#assertMatchActive();
    if (!canPlayEntrance(this.match, playerId, card)) throw new Error("Illegal Entrance play");
    const p = this.match.players[playerId];
    const played = this.#takeFromHand(playerId, card);
    p.entrancePlayed = true;
    this.#applyEffects(playerId, played.effects ?? []);
    p.discard.push(played);
    this.#log("ENTRANCE_PLAYED", { playerId, cardId: played.id });
  }


  playAction(playerId, card) {
    this.#assertMatchActive();
    if (!canPlayAction(this.match, playerId, card)) throw new Error("Illegal Action play");
    const p = this.match.players[playerId];
    const played = this.#takeFromHand(playerId, card);
    p.turn.actionPlayed += 1;
    this.#applyEffects(playerId, played.effects ?? []);
    p.discard.push(played);
    this.#log("ACTION_PLAYED", { playerId, cardId: played.id });
  }

  playSupport(playerId, card) {
    this.#assertMatchActive();
    if (!canPlaySupport(this.match, playerId, card)) throw new Error("Illegal Support play");
    const p = this.match.players[playerId];
    const played = this.#takeFromHand(playerId, card);
    p.turn.supportPlayed += 1;
    if (p.activeSupports.length >= 2) {
      const replaced = p.activeSupports.shift();
      p.discard.push(replaced);
      this.#log("SUPPORT_REPLACED", { playerId, cardId: replaced.id });
    }
    p.activeSupports.push(played);
    this.#log("SUPPORT_PLAYED", { playerId, cardId: played.id });
  }

  playManager(playerId, card) {
    this.#assertMatchActive();
    if (!canPlayManager(this.match, playerId, card)) throw new Error("Illegal Manager play");
    const p = this.match.players[playerId];
    const played = this.#takeFromHand(playerId, card);
    p.activeManager = played;
    p.managerAbilityUsed = false;
    this.#log("MANAGER_PLAYED", { playerId, cardId: played.id, managerName: played.name });
  }

  declareMove(playerId, card) {
    this.#assertMatchActive();
    const check = moveEligibility(this.match, playerId, card);
    if (!check.legal) throw new Error(check.reason);
    const p = this.match.players[playerId];
    const played = this.#takeFromHand(playerId, card);
    const damageBonus = (p.turn.nextMoveDamageBonus ?? 0) + (p.pendingMoveDamageBonus ?? 0);
    p.turn.nextMoveCostModifier = 0;
    p.turn.nextMoveDamageBonus = 0;
    p.pendingMoveDamageBonus = 0;
    this.match.proposedMove = { attackerId: playerId, defenderId: this.opponentOf(playerId), card: clone(played), damageBonus };
    this.match.phase = PHASES.COUNTER;
    this.#log("MOVE_DECLARED", { playerId, cardId: played.id });
  }

  counter(defenderId, card) {
    this.#assertMatchActive();
    const pending = this.match.proposedMove;
    if (this.match.phase !== PHASES.COUNTER || !pending || pending.defenderId !== defenderId) throw new Error("No counter window");
    if (!canCounter(pending.card, card)) throw new Error("Invalid counter");
    const counterCard = this.#takeFromHand(defenderId, card);
    this.match.players[pending.attackerId].discard.push(pending.card);
    this.match.players[defenderId].discard.push(counterCard);
    this.#log("MOVE_COUNTERED", { defenderId, incomingCardId: pending.card.id, counterCardId: counterCard.id });
    this.match.proposedMove = null;
    if (counterCard.onCounter?.length) {
      this.#applyEffects(defenderId, counterCard.onCounter, { sourceCardId: counterCard.id, incomingCardId: pending.card.id });
      this.#log("COUNTER_EFFECTS_RESOLVED", { defenderId, counterCardId: counterCard.id, effectCount: counterCard.onCounter.length });
    }
    this.#triggerAbility(pending.attackerId, "ON_MOVE_COUNTERED", { card: pending.card, incomingMove: pending.card, counterCard });
    this.#triggerAbility(defenderId, "ON_COUNTER_SUCCESS", { incomingMove: pending.card, counterCard });
    this.#triggerManager(defenderId, "ON_COUNTER_SUCCESS", { incomingMove: pending.card, counterCard });
    const bonusDraw = supportPassive(this.match.players[defenderId], "counterDraw");
    if (bonusDraw) this.#draw(defenderId, bonusDraw);
    this.#transferControl(defenderId, { incrementTurn: true, draw: true });
  }

  autoCounter(defenderId, discardedCards) {
    this.#assertMatchActive();
    if (discardedCards.length !== 7) throw new Error("Auto Counter requires exactly 7 discarded pages");
    const pending = this.match.proposedMove;
    if (this.match.phase !== PHASES.COUNTER || !pending || pending.defenderId !== defenderId) throw new Error("No counter window");
    const p = this.match.players[defenderId];
    const removed = discardedCards.map(card => this.#takeFromHand(defenderId, card));
    p.discard.push(...removed);
    this.match.players[pending.attackerId].discard.push(pending.card);
    this.#log("AUTO_COUNTER", { defenderId, incomingCardId: pending.card.id });
    this.match.proposedMove = null;
    this.#triggerAbility(pending.attackerId, "ON_MOVE_COUNTERED", { card: pending.card, incomingMove: pending.card, auto: true });
    this.#triggerAbility(defenderId, "ON_COUNTER_SUCCESS", { incomingMove: pending.card, auto: true });
    this.#triggerManager(defenderId, "ON_COUNTER_SUCCESS", { incomingMove: pending.card, auto: true });
    const bonusDraw = supportPassive(this.match.players[defenderId], "counterDraw");
    if (bonusDraw) this.#draw(defenderId, bonusDraw);
    this.#transferControl(defenderId, { incrementTurn: true, draw: true });
  }

  passCounter(defenderId) {
    this.#assertMatchActive();
    const pending = this.match.proposedMove;
    if (this.match.phase !== PHASES.COUNTER || !pending || pending.defenderId !== defenderId) throw new Error("No counter window");
    this.#log("COUNTER_PASSED", { defenderId });
    this.#resolveMove(pending);
  }

  #resolveMove(pending) {
    const { attackerId, defenderId, card } = pending;
    const attacker = this.match.players[attackerId];
    const defender = this.match.players[defenderId];
    const rawDamage = (card.damage ?? 0) + (pending.damageBonus ?? 0);
    const supportReduction = supportPassive(defender, "damageReduction");
    const superstarReduction = this.#superstarDamageReduction(defender, card);
    const reduction = supportReduction + superstarReduction;
    const damage = Math.max(0, rawDamage - reduction);
    defender.hp = Math.max(0, defender.hp - damage);
    attacker.momentum.attitude += 1 + supportPassive(attacker, "connectedAttitudeBonus");
    defender.momentum.attitude = Math.max(0, defender.momentum.attitude - 1);
    if (card.stunTurns) {
      const ignoresFirstStun = defender.superstar.ability?.passive?.ignoreFirstStun === true;
      if (ignoresFirstStun && !defender.passiveFlags.firstStunIgnored) {
        defender.passiveFlags.firstStunIgnored = true;
        this.#log("SUPERSTAR_PASSIVE", { playerId: defenderId, abilityName: defender.superstar.ability.name, effect: "IGNORE_STUN", sourceCardId: card.id });
      } else {
        defender.status.stunnedTurns = Math.max(defender.status.stunnedTurns, card.stunTurns);
      }
    }
    if (card.setOpponentPosture) {
      defender.posture = card.setOpponentPosture;
    }
    if (card.sendOpponentOutside) {
      defender.location = "ringside";
      defender.posture = "standing";
      this.match.countOut.count = 0;
      this.#log("SENT_TO_RINGSIDE", { attackerId, defenderId, cardId: card.id });
    }
    attacker.discard.push(card);
    this.#log("MOVE_CONNECTED", { attackerId, defenderId, cardId: card.id, damage, rawDamage, damageReduction: reduction, method: card.method, moveType: card.moveType, finisher: !!card.finisher });
    this.match.proposedMove = null;

    if (card.onConnect?.length) {
      this.#applyEffects(attackerId, card.onConnect, { sourceCardId: card.id, attackerId, defenderId, damage });
      this.#log("MOVE_EFFECTS_RESOLVED", { attackerId, defenderId, cardId: card.id, effectCount: card.onConnect.length });
    }

    this.#triggerAbility(attackerId, "ON_MOVE_CONNECTED", { damage, method: card.method, moveType: card.moveType, card });
    this.#triggerManager(attackerId, "ON_MOVE_CONNECTED", { damage, method: card.method, moveType: card.moveType, card });
    this.#triggerAbility(defenderId, "ON_DAMAGE_TAKEN", { damage, method: card.method, moveType: card.moveType, card });
    this.#triggerManager(defenderId, "ON_DAMAGE_TAKEN", { damage, method: card.method, moveType: card.moveType, card });
    if (card.moveType && !attacker.history.connectedMoveTypes.includes(card.moveType)) attacker.history.connectedMoveTypes.push(card.moveType);
    if (card.method && !attacker.history.connectedMethods.includes(card.method)) attacker.history.connectedMethods.push(card.method);

    if (card.submission) {
      this.match.submission = {
        attackerId,
        defenderId,
        bodyPart: card.submission.bodyPart,
        damage: card.submission.damage,
        cardId: card.id
      };
      this.#applySubmissionDamage();
      return;
    }

    this.match.postMove = { attackerId, defenderId, cardId: card.id, finisher: !!card.finisher };
    this.match.phase = PHASES.POST_MOVE;
    this.#log("POST_MOVE_WINDOW", { attackerId, defenderId, cardId: card.id });
  }

  endPostMove(attackerId) {
    this.#assertMatchActive();
    const post = this.match.postMove;
    if (this.match.phase !== PHASES.POST_MOVE || !post || post.attackerId !== attackerId) throw new Error("No post-move window");
    this.#log("POST_MOVE_ENDED", { attackerId });
    this.match.postMove = null;
    this.#endOffense(attackerId);
  }

  attemptPin(attackerId) {
    this.#assertMatchActive();
    const check = canAttemptPin(this.match, attackerId);
    if (!check.legal) throw new Error(check.reason);
    const post = this.match.postMove;
    const attacker = this.match.players[attackerId];
    const cost = check.cost ?? 0;
    attacker.momentum.attitude -= cost;
    attacker.pinAttempts += 1;
    this.match.pin = {
      attackerId,
      defenderId: post.defenderId,
      sourceMoveId: post.cardId,
      finisher: !!post.finisher,
      attemptNumber: attacker.pinAttempts,
      cost
    };
    this.match.postMove = null;
    this.match.phase = PHASES.PIN_RESPONSE;
    const chance = pinChancePercent(this.match);
    this.#log("PIN_ATTEMPTED", { attackerId, defenderId: this.match.pin.defenderId, attemptNumber: attacker.pinAttempts, cost, chance });
    return chance;
  }

  playPinEscape(defenderId, card) {
    this.#assertMatchActive();
    if (!canPlayPinEscape(this.match, defenderId, card)) throw new Error("Illegal pin response");
    const played = this.#takeFromHand(defenderId, card);
    this.match.players[defenderId].discard.push(played);
    const attackerId = this.match.pin.attackerId;
    this.#log("PIN_ESCAPED_SPECIAL", { defenderId, attackerId, cardId: played.id });
    this.match.pin = null;
    this.#transferControl(defenderId, { incrementTurn: true, draw: true });
  }

  passPinResponse(defenderId) {
    this.#assertMatchActive();
    if (this.match.phase !== PHASES.PIN_RESPONSE || this.match.pin?.defenderId !== defenderId) throw new Error("No pin response window");
    this.#log("PIN_RESPONSE_PASSED", { defenderId });
    return this.#resolvePinCheck();
  }

  #resolvePinCheck() {
    const pin = this.match.pin;
    const chance = pinChancePercent(this.match);
    const roll = Math.floor(this.rng() * 100) + 1;
    this.#log("PIN_CHECK", { attackerId: pin.attackerId, defenderId: pin.defenderId, chance, roll });
    if (roll <= chance) {
      this.#endMatch(pin.attackerId, "pin", { chance, roll, sourceMoveId: pin.sourceMoveId });
      return { success: true, chance, roll };
    }
    const defenderId = pin.defenderId;
    const attackerId = pin.attackerId;
    this.#log("KICK_OUT", { defenderId, attackerId, chance, roll });
    this.match.pin = null;
    this.#transferControl(defenderId, { incrementTurn: true, draw: true });
    return { success: false, chance, roll };
  }

  #applySubmissionDamage() {
    const sub = this.match.submission;
    if (!sub) return;
    const defender = this.match.players[sub.defenderId];
    defender.submissionDamage[sub.bodyPart] += sub.damage;
    const total = defender.submissionDamage[sub.bodyPart];
    const threshold = submissionThreshold(defender);
    this.#log("SUBMISSION_DAMAGE", {
      attackerId: sub.attackerId,
      defenderId: sub.defenderId,
      bodyPart: sub.bodyPart,
      damage: sub.damage,
      total,
      threshold
    });
    if (total >= threshold) {
      this.#endMatch(sub.attackerId, "submission", { bodyPart: sub.bodyPart, total, threshold, sourceMoveId: sub.cardId });
      return;
    }
    this.match.phase = PHASES.SUBMISSION_MAINTAIN;
  }

  maintainSubmission(attackerId, cardToDitch) {
    this.#assertMatchActive();
    const sub = this.match.submission;
    if (this.match.phase !== PHASES.SUBMISSION_MAINTAIN || !sub || sub.attackerId !== attackerId) throw new Error("No submission to maintain");
    const ditched = this.#takeFromHand(attackerId, cardToDitch);
    this.match.players[attackerId].discard.push(ditched);
    this.#log("SUBMISSION_MAINTAINED", { attackerId, ditchedCardId: ditched.id });
    this.match.turnNumber += 1;
    this.match.playerInControl = attackerId;
    this.#startFreshControl(attackerId, { draw: true, preservePhase: true, triggerTurnStart: true, triggerControlStart: false });
    this.#applySubmissionDamage();
  }

  releaseSubmission(attackerId) {
    this.#assertMatchActive();
    const sub = this.match.submission;
    if (this.match.phase !== PHASES.SUBMISSION_MAINTAIN || !sub || sub.attackerId !== attackerId) throw new Error("No submission to release");
    this.#log("SUBMISSION_RELEASED", { attackerId });
    this.match.submission = null;
    this.match.playerInControl = attackerId;
    this.#startFreshControl(attackerId, { draw: false, triggerTurnStart: false, triggerControlStart: false });
  }


  followOutside(attackerId) {
    this.#assertMatchActive();
    const post = this.match.postMove;
    if (this.match.phase !== PHASES.POST_MOVE || !post || post.attackerId !== attackerId) throw new Error("No follow-out opportunity");
    const attacker = this.match.players[attackerId];
    const defender = this.match.players[post.defenderId];
    if (attacker.location !== "ring" || defender.location !== "ringside") throw new Error("Cannot follow outside now");
    attacker.location = "ringside"; attacker.posture = "standing";
    this.#log("FOLLOWED_OUTSIDE", { attackerId, defenderId: post.defenderId });
  }

  returnToRing(playerId) {
    this.#assertMatchActive();
    const p = this.match.players[playerId];
    if (this.match.phase !== PHASES.ACTION || this.match.playerInControl !== playerId || p.location !== "ringside") throw new Error("Cannot return to ring now");
    if (p.status.stunnedTurns > 0) throw new Error("Cannot return while stunned");
    if ((p.status.returnBlockedTurns ?? 0) > 0) throw new Error("Return to ring is blocked");
    p.location = "ring"; p.posture = "standing";
    this.#log("RETURNED_TO_RING", { playerId });
    if (Object.values(this.match.players).every(x => x.location === "ring")) {
      if (this.match.countOut.count) this.#log("COUNT_OUT_RESET", { count: this.match.countOut.count });
      this.match.countOut.count = 0;
    }
  }

  passTurn(playerId) {
    this.#assertMatchActive();
    if (this.match.phase !== PHASES.ACTION || this.match.playerInControl !== playerId) throw new Error("Cannot pass now");
    const opponent = this.opponentOf(playerId);
    this.#log("CONTROL_PASSED", { from: playerId, to: opponent });
    this.#transferControl(opponent, { incrementTurn: true, draw: true });
  }


  #advanceCountOut() {
    const outside = Object.values(this.match.players).filter(p => p.location === "ringside");
    if (!outside.length) { this.match.countOut.count = 0; return; }
    this.match.countOut.count += 1;
    this.#log("COUNT_OUT_TICK", { count: this.match.countOut.count, outside: outside.map(p => p.id) });
    if (this.match.countOut.count < this.match.countOut.limit) return;
    if (outside.length === 1) {
      this.#endMatch(this.opponentOf(outside[0].id), "count-out", { countedOutId: outside[0].id, count: this.match.countOut.count });
    } else {
      this.match.winner = null;
      this.match.finish = { type: "double-count-out", count: this.match.countOut.count };
      this.match.phase = PHASES.MATCH_OVER;
      this.#log("MATCH_ENDED", { winnerId: null, finishType: "double-count-out", count: this.match.countOut.count });
    }
  }

  #endMatch(winnerId, finishType, details = {}) {
    this.match.winner = winnerId;
    this.match.finish = { type: finishType, ...details };
    this.match.phase = PHASES.MATCH_OVER;
    this.match.proposedMove = null;
    this.match.postMove = null;
    this.match.pin = null;
    this.match.submission = null;
    this.#log("MATCH_ENDED", { winnerId, finishType, ...details });
  }

  #endOffense(playerId) {
    const opponent = this.opponentOf(playerId);
    this.#transferControl(opponent, { incrementTurn: true, draw: true });
  }

  #transferControl(playerId, { incrementTurn = false, draw = false } = {}) {
    if (incrementTurn) this.match.turnNumber += 1;
    this.match.playerInControl = playerId;
    this.#startFreshControl(playerId, { draw, triggerTurnStart: incrementTurn, triggerControlStart: true });
    if (this.match.phase !== PHASES.MATCH_OVER) this.#advanceCountOut();
  }

  #startFreshControl(playerId, { draw = false, preservePhase = false, triggerTurnStart = false, triggerControlStart = false } = {}) {
    if (!preservePhase) this.match.phase = PHASES.ACTION;
    const p = this.match.players[playerId];
    p.turn.momentumPlayed = 0;
    p.turn.actionPlayed = 0;
    p.turn.supportPlayed = 0;
    p.turn.nextMoveCostModifier = 0;
    p.turn.nextMoveDamageBonus = 0;
    p.turn.momentumPlayLimit = 1 + (p.pendingExtraMomentum ?? 0);
    p.pendingExtraMomentum = 0;
    if (p.status.stunnedTurns > 0) p.status.stunnedTurns -= 1;
    if (p.status.returnBlockedTurns > 0) p.status.returnBlockedTurns -= 1;
    if (draw) this.#draw(playerId, 1);
    if (triggerTurnStart) this.#runTurnStartTriggers();
    if (triggerControlStart) {
      this.#triggerEntranceSchedules(playerId, "CONTROL_START", { turnNumber: this.match.turnNumber });
      this.#triggerAbility(playerId, "ON_CONTROL_START", { turnNumber: this.match.turnNumber });
    }
  }
}
