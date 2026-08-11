import { PHASES } from "./constants.js?v=0.11.35";
import { clone } from "./utils.js?v=0.11.35";
import { entranceForSuperstar } from "../data/entrances.js?v=0.11.35";
import {
  canPlayMomentum,
  canPlayEntrance,
  canPlayAction,
  canPlaySupport,
  canPlayManager,
  supportPassive,
  moveEligibility,
  canCounter,
  counterEligibility,
  canAttemptPin,
  canPlayPinEscape,
  pinChancePercent,
  submissionThreshold
} from "./rules.js?v=0.11.35";

export class MatchEngine {
  constructor({ superstarA, superstarB, deckA = [], deckB = [], startingControl = "p1", rng = Math.random }) {
    this.rng = rng;
    this.match = {
      phase: PHASES.PRE_MATCH,
      playerInControl: startingControl,
      turnNumber: 1,
      turnLimit: 50,
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
    let openingManager = null;
    const managerIndex = opening.findIndex(c => c.kind === "manager");
    if (managerIndex >= 0) {
      openingManager = opening.splice(managerIndex, 1)[0];
      if (shuffled.length) opening.push(shuffled.shift());
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
      activeManager: openingManager,
      managerAbilityUsed: false,
      entrancePlayed: false,
      hasHadControl: false,
      leadOffActive: true,
      entranceSchedules: [],
      abilityUses: 0,
      abilityUsed: false,
      passiveFlags: { firstStunIgnored: false },
      history: { connectedMoveTypes: [], connectedMethods: [] },
      controlMethods: [],
      pendingExtraMomentum: 0,
      pendingMoveDamageBonus: 0,
      pendingMoveCostModifier: 0,
      pendingCardCostModifiers: {},
      lastDamageTaken: 0,
      pinAttempts: 0,
      specialFlags: { used: false, uncounterableStrength: false, blockActionUntilMove: false }
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

  #specialInHand(playerId, flag) {
    return this.match.players[playerId].hand.find(c => c.kind === "special" && c[flag] === true);
  }

  #consumeSpecial(playerId, card, trigger, extra = {}) {
    const played = this.#takeFromHand(playerId, card);
    this.match.players[playerId].discard.push(played);
    this.#log("SUPERSTAR_SPECIAL_PLAYED", { playerId, cardId: played.id, cardName: played.name, trigger, ...extra });
    return played;
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
      (!ids.length && effect.finisher === true && card.finisher === true) ||
      (!ids.length && effect.trademark === true && card.trademark === true) ||
      (!ids.length && effect.method && card.method === effect.method && (effect.maxCost == null || (card.cost ?? 0) <= effect.maxCost)) ||
      (!ids.length && effect.counterOrSubmission === true && (card.submission || card.defensiveOnly || (card.counterMethods?.length ?? 0) > 0))
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

  #searchTop(playerId, effect = {}, sourceCardId = null) {
    const p = this.match.players[playerId];
    const look = Math.max(1, Math.min(p.deck.length, effect.look ?? 2));
    const top = p.deck.slice(0, look);
    const matches = card =>
      (!effect.kind || card.kind === effect.kind) &&
      (!effect.method || card.method === effect.method) &&
      (!effect.counterOrSubmission || card.submission || card.defensiveOnly || (card.counterMethods?.length ?? 0) > 0);
    const relative = top.findIndex(matches);
    if (relative < 0) {
      if (effect.bottomRest) p.deck = [...p.deck.slice(look), ...top];
      this.#log("TOP_SEARCH_MISSED",{playerId,sourceCardId,look});
      return null;
    }
    const [found] = p.deck.splice(relative,1);
    p.hand.push(found);
    if (effect.bottomRest) {
      const remainingLook = look - 1;
      const rest = p.deck.splice(0, remainingLook);
      p.deck.push(...rest);
    }
    this.#log("CARD_SEARCHED",{playerId,cardId:found.id,sourceCardId,topSearch:look});
    return found;
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
      if (effect.type === "limbDamage") {
        const part = effect.bodyPart ?? "leg";
        target.submissionDamage[part] = (target.submissionDamage[part] ?? 0) + (effect.amount ?? 1);
        this.#log("SUBMISSION_DAMAGE",{playerId:targetId,bodyPart:part,amount:effect.amount??1,sourceCardId:context.sourceCardId??null});
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
      if (effect.type === "nextControlMoveCostModifier") target.pendingMoveCostModifier = (target.pendingMoveCostModifier ?? 0) + (effect.amount ?? 0);
      if (effect.type === "cardCostModifier") {
        target.pendingCardCostModifiers ??= {};
        const id = effect.cardId;
        if (id) target.pendingCardCostModifiers[id] = (target.pendingCardCostModifiers[id] ?? 0) + (effect.amount ?? 0);
      }
      if (effect.type === "nextMoveDamageBonus") target.turn.nextMoveDamageBonus += effect.amount ?? 0;
      if (effect.type === "ignoreNextStun") target.passiveFlags.ignoreNextStun = (target.passiveFlags.ignoreNextStun ?? 0) + (effect.amount ?? 1);
      if (effect.type === "mankindThresholds") {
        if (!target.passiveFlags.mankindHalfTriggered && target.hp <= target.maxHp * 0.5) {
          target.passiveFlags.mankindHalfTriggered = true;
          this.#draw(targetId, 2);
        }
        if (!target.passiveFlags.mankindQuarterTriggered && target.hp <= target.maxHp * 0.25) {
          target.passiveFlags.mankindQuarterTriggered = true;
          target.momentum.attitude += 1;
          this.#log("MOMENTUM_EFFECT", { playerId: targetId, method: "attitude", amount: 1, sourceCardId: context.sourceCardId ?? null });
        }
      }
      if (effect.type === "setOpponentPosture") {
        this.match.players[this.opponentOf(playerId)].posture = effect.posture ?? "standing";
      }
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
    if (when.cardIds && !when.cardIds.includes(context.card?.id ?? context.incomingMove?.id)) return false;
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
    const entrance = clone(entranceForSuperstar(p.superstar.id));
    if (!entrance) throw new Error(`Missing linked Entrance for ${p.superstar.name}`);
    p.entrancePlayed = true;
    this.#applyEffects(playerId, entrance.effects ?? [], { sourceCardId: entrance.id, preMatch: true });
    p.entranceSchedules = (entrance.scheduled ?? []).map((schedule, i) => ({
      ...clone(schedule),
      id: schedule.id ?? `${entrance.id}-schedule-${i + 1}`,
      sourceCardId: entrance.id,
      sourceName: entrance.name,
      triggerCount: 0
    }));
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
    const opponentId = this.opponentOf(playerId);
    const koShow = this.#specialInHand(opponentId, "koShow");
    if (koShow) {
      p.discard.push(played);
      this.#consumeSpecial(opponentId, koShow, "OPPONENT_ACTION", { cancelledCardId: played.id });
      this.#log("SPECIAL_CANCELLED_CARD", { playerId: opponentId, targetPlayerId: playerId, cardId: played.id, cardKind: "action" });
      this.#transferControl(opponentId, { incrementTurn: true, draw: true });
      return;
    }
    this.#applyEffects(playerId, played.effects ?? []);
    if (played.id === "evo1-rhea-eradicate") p.specialFlags.rheaEradicateStrip = true;
    if (played.id === "s1rock-bloodline-rules") {
      const taxed=this.match.players[opponentId];
      taxed.specialFlags.bloodlineCounterTax = 1;
      taxed.specialFlags.bloodlineCounterTaxRemaining = 1;
      this.#log("ACTION_EFFECT",{playerId,cardId:played.id,effect:"COUNTER_TAX"});
    }
    if (played.selfDamage) {
      p.hp = Math.max(0, p.hp - played.selfDamage);
      this.#log("SELF_DAMAGE", { playerId, amount: played.selfDamage, sourceCardId: played.id });
    }
    p.discard.push(played);
    this.#log("ACTION_PLAYED", { playerId, cardId: played.id });
  }

  playSupport(playerId, card) {
    this.#assertMatchActive();
    if (!canPlaySupport(this.match, playerId, card)) throw new Error("Illegal Support play");
    const p = this.match.players[playerId];
    const played = this.#takeFromHand(playerId, card);
    p.turn.supportPlayed += 1;
    const opponentId = this.opponentOf(playerId);
    const koShow = this.#specialInHand(opponentId, "koShow");
    if (koShow) {
      p.discard.push(played);
      this.#consumeSpecial(opponentId, koShow, "OPPONENT_SUPPORT", { cancelledCardId: played.id });
      this.#log("SPECIAL_CANCELLED_CARD", { playerId: opponentId, targetPlayerId: playerId, cardId: played.id, cardKind: "support" });
      this.#transferControl(opponentId, { incrementTurn: true, draw: true });
      return;
    }
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
    if (p.pendingCardCostModifiers?.[played.id]) delete p.pendingCardCostModifiers[played.id];
    p.leadOffActive = false;
    p.specialFlags.blockActionUntilMove = false;
    let damageBonus = (p.turn.nextMoveDamageBonus ?? 0) + (p.pendingMoveDamageBonus ?? 0);
    if (p.superstar.id === "charlotte-flair" && played.id === "evo1-charlotte-big-boot" && p.passiveFlags.charlotteChopConnected) damageBonus += 1;
    if (p.superstar.id === "the-rock") {
      const rockOpp=this.match.players[this.opponentOf(playerId)];
      if (played.id === "s1rock-final-boss-punches" && p.momentum.attitude > rockOpp.momentum.attitude) damageBonus += 1;
      if (played.id === "s1rock-belt-whip" && rockOpp.momentum.attitude === 0) damageBonus += 2;
    }
    if (p.specialFlags.hoganPunchBonus && (played.id.includes("punch") || played.id.includes("big-boot"))) {
      damageBonus += 2;
      p.specialFlags.hoganPunchBonus = false;
    }
    if (p.specialFlags.kaneStrikeBonus && played.method === "strike") {
      damageBonus += 1;
      p.specialFlags.kaneStrikeBonus = false;
    }
    if ((p.turn.nextMoveCostModifier ?? 0) < 0 && (played.cost ?? 0) < 6) {
      p.pendingMoveCostModifier = p.turn.nextMoveCostModifier;
    }
    p.turn.nextMoveCostModifier = 0;
    p.turn.nextMoveDamageBonus = 0;
    p.pendingMoveDamageBonus = 0;
    const specialUncounterable = !!(p.specialFlags.uncounterableStrength && played.method === "strength" && !played.finisher);
    if (specialUncounterable) p.specialFlags.uncounterableStrength = false;
    this.match.proposedMove = { attackerId: playerId, defenderId: this.opponentOf(playerId), card: clone(played), damageBonus, uncounterable: specialUncounterable };
    this.match.phase = PHASES.COUNTER;
    this.#log("MOVE_DECLARED", { playerId, cardId: played.id, uncounterable: specialUncounterable });
  }

  counter(defenderId, card) {
    this.#assertMatchActive();
    const pending = this.match.proposedMove;
    if (this.match.phase !== PHASES.COUNTER || !pending || pending.defenderId !== defenderId) throw new Error("No counter window");
    if (pending.uncounterable) throw new Error("This Move cannot be Countered");
    const taxedDefender=this.match.players[defenderId];
    if ((taxedDefender.specialFlags.bloodlineCounterTax ?? 0) > 0 && (taxedDefender.specialFlags.bloodlineCounterTaxRemaining ?? 0) > 0) {
      if ((taxedDefender.momentum.attitude ?? 0) < taxedDefender.specialFlags.bloodlineCounterTax) throw new Error("Bloodline Rules: need +1 Attitude to Counter");
    }
    const counterCheck = counterEligibility(this.match, defenderId, pending.card, card);
    if (!counterCheck.legal) throw new Error(counterCheck.reason || "Invalid counter");
    const counterCard = this.#takeFromHand(defenderId, card);
    if ((taxedDefender.specialFlags.bloodlineCounterTax ?? 0) > 0 && (taxedDefender.specialFlags.bloodlineCounterTaxRemaining ?? 0) > 0) {
      taxedDefender.momentum.attitude -= taxedDefender.specialFlags.bloodlineCounterTax;
      taxedDefender.specialFlags.bloodlineCounterTaxRemaining = Math.max(0,(taxedDefender.specialFlags.bloodlineCounterTaxRemaining??0)-1);
      this.#log("MOMENTUM_EFFECT",{playerId:defenderId,method:"attitude",amount:-1,sourceCardId:"s1rock-bloodline-rules"});
    }

    // The incoming Move has been stopped, so it is always discarded now.
    this.match.players[pending.attackerId].discard.push(pending.card);
    this.#log("MOVE_COUNTERED", {
      defenderId,
      incomingCardId: pending.card.id,
      counterCardId: counterCard.id,
      counterDepth: pending.counterDepth ?? 0
    });

    if (counterCard.onCounter?.length) {
      this.#applyEffects(defenderId, counterCard.onCounter, { sourceCardId: counterCard.id, incomingCardId: pending.card.id });
      this.#log("COUNTER_EFFECTS_RESOLVED", { defenderId, counterCardId: counterCard.id, effectCount: counterCard.onCounter.length });
    }
    this.#triggerAbility(pending.attackerId, "ON_MOVE_COUNTERED", { card: pending.card, incomingMove: pending.card, counterCard });
    this.#triggerAbility(defenderId, "ON_COUNTER_SUCCESS", { incomingMove: pending.card, counterCard });
    const counterDefender = this.match.players[defenderId];

    // Liv Morgan — Extreme: turn a dangerous counter into speed and Attitude.
    const livExtreme = counterDefender.superstar.id === "liv-morgan" && (pending.card.cost ?? 0) >= 7
      ? this.#specialInHand(defenderId, "livExtreme") : null;
    if (livExtreme) {
      this.#consumeSpecial(defenderId, livExtreme, "HIGH_COST_COUNTER", { incomingCardId: pending.card.id });
      counterDefender.momentum.attitude += 2;
      counterDefender.turn.nextMoveCostModifier = Math.min(counterDefender.turn.nextMoveCostModifier ?? 0, -2);
      this.#log("MOMENTUM_EFFECT",{playerId:defenderId,method:"attitude",amount:2,sourceCardId:livExtreme.id});
    }

    // Evolution counter identities.
    if (counterDefender.superstar.id === "paige" && (pending.card.cost ?? 0) >= 7 && !counterDefender.passiveFlags.paigeBigCounterDraw) {
      counterDefender.passiveFlags.paigeBigCounterDraw = true;
      this.#draw(defenderId,1);
      this.#log("SUPERSTAR_ABILITY",{playerId:defenderId,abilityName:"This Is My House",trigger:"HIGH_COST_COUNTER_DRAW"});
    }
    if (counterDefender.superstar.id === "becky-lynch" && !counterDefender.passiveFlags.bigTimeCounterDraw) {
      counterDefender.passiveFlags.bigTimeCounterDraw = true;
      this.#draw(defenderId, 1);
      this.#log("ENTRANCE_EFFECT", { playerId:defenderId, entranceName:"Big Time Becks", effect:"COUNTER_DRAW" });
    }
    const counterBoost = this.#specialInHand(defenderId, "counterBoost");
    if (counterBoost) {
      this.#consumeSpecial(defenderId, counterBoost, "COUNTER_SUCCESS", { incomingCardId:pending.card.id });
      this.#draw(defenderId, 1);
      counterDefender.turn.nextMoveDamageBonus += 2;
    }
    const bigCounterSpecial = this.#specialInHand(defenderId, "bigCounterSpecial");
    if (bigCounterSpecial && (pending.card.trademark || pending.card.finisher)) {
      this.#consumeSpecial(defenderId, bigCounterSpecial, "TRADEMARK_FINISHER_COUNTER", { incomingCardId:pending.card.id });
      this.#draw(defenderId, bigCounterSpecial.superstarId === "charlotte-flair" ? 2 : 1);
      counterDefender.momentum.attitude += 1;
      const opp=this.match.players[pending.attackerId];
      if (bigCounterSpecial.superstarId === "paige") opp.momentum.attitude=Math.max(0,(opp.momentum.attitude??0)-1);
    }

    if (counterDefender.superstar.id === "stone-cold-steve-austin" && !counterDefender.passiveFlags.glassShattersCounterDraw) {
      counterDefender.passiveFlags.glassShattersCounterDraw = true;
      this.#draw(defenderId, 1);
      this.#log("ENTRANCE_EFFECT", { playerId: defenderId, entranceName: "Glass Shatters", effect: "COUNTER_DRAW" });
    }

    // Austin 3:16 — successful Counter reloads a low-cost Strike.
    const a316 = this.#specialInHand(defenderId, "austinSpecial");
    if (a316) {
      this.#consumeSpecial(defenderId, a316, "COUNTER_SUCCESS");
      this.match.players[defenderId].momentum.attitude += 1;
      this.#searchDeck(defenderId, { method: "strike", maxCost: 5 }, a316.id);
    }

    // Mankind — Bang Bang! Reload after his Move is Countered.
    const bangBang = this.#specialInHand(pending.attackerId, "mankindSpecial");
    const mankindP = this.match.players[pending.attackerId];
    if (bangBang && mankindP.hand.length > 1) {
      this.#consumeSpecial(pending.attackerId, bangBang, "MOVE_COUNTERED", { incomingCardId: pending.card.id });
      const ditched = mankindP.hand.shift();
      mankindP.discard.push(ditched);
      this.#searchDeck(pending.attackerId, { kind: "move", maxCost: 5 }, bangBang.id);
      this.#log("SPECIAL_DITCHED_PAGE", { playerId: pending.attackerId, cardId: ditched.id, sourceCardId: bangBang.id });
    }

    // Bobby Heenan — protect an important countered Move.
    const heenanOwner = this.match.players[pending.attackerId];
    const heenan = heenanOwner.activeManager;
    if (heenan?.managerChoice === "heenan" && !heenanOwner.managerAbilityUsed && ((pending.card.cost ?? 0) >= 7 || pending.card.trademark || pending.card.finisher)) {
      const idx = heenanOwner.discard.findIndex(c => c.id === pending.card.id);
      if (idx >= 0) {
        const [recovered] = heenanOwner.discard.splice(idx,1);
        heenanOwner.hand.push(recovered);
        heenanOwner.managerAbilityUsed = true;
        this.#log("MANAGER_ABILITY", { playerId: pending.attackerId, managerId: heenan.id, managerName: heenan.name, trigger: "COUNTERED_MOVE_RECOVERY", cardId: recovered.id });
      }
    }
    this.#triggerManager(defenderId, "ON_COUNTER_SUCCESS", { incomingMove: pending.card, counterCard });
    const bonusDraw = supportPassive(this.match.players[defenderId], "counterDraw");
    if (bonusDraw) this.#draw(defenderId, bonusDraw);

    // Gunther — The Mat Is Sacred: punish the opponent after a successful Counter.
    const matSacred = this.#specialInHand(defenderId, "matSacred");
    if (matSacred) {
      this.#consumeSpecial(defenderId, matSacred, "COUNTER_SUCCESS", { incomingCardId: pending.card.id });
      const punished = this.match.players[pending.attackerId];
      const lost = Math.min(2, punished.momentum.attitude ?? 0);
      punished.momentum.attitude = Math.max(0, (punished.momentum.attitude ?? 0) - 2);
      punished.specialFlags.blockActionUntilMove = true;
      if (lost) this.#log("MOMENTUM_EFFECT", { playerId: pending.attackerId, method: "attitude", amount: -lost, sourceCardId: matSacred.id });
    }

    // Offensive Moves are genuine counter-attacks, not disposable reversal text.
    // They now become the next proposed Move, which gives the original attacker
    // the same legal Counter window. This applies recursively to every Move Type
    // relationship in the card data (including future cards), so counter chains
    // such as Move -> European Uppercut -> counter-to-counter work naturally.
    const offensiveCounter = counterCard.kind === "move" && !counterCard.defensiveOnly &&
      ((counterCard.damage ?? 0) > 0 || !!counterCard.submission || (counterCard.onConnect?.length ?? 0) > 0);
    if (offensiveCounter) {
      this.match.playerInControl = defenderId;
      this.match.proposedMove = {
        attackerId: defenderId,
        defenderId: pending.attackerId,
        card: clone(counterCard),
        damageBonus: 0,
        counterDepth: (pending.counterDepth ?? 0) + 1,
        counterAttack: true
      };
      this.match.phase = PHASES.COUNTER;
      this.#log("COUNTER_ATTACK_DECLARED", {
        attackerId: defenderId,
        defenderId: pending.attackerId,
        cardId: counterCard.id,
        counterDepth: (pending.counterDepth ?? 0) + 1
      });
      return;
    }

    // Pure defensive counters normally transfer Control.
    this.match.players[defenderId].discard.push(counterCard);
    this.match.proposedMove = null;

    // Seth Rollins — The Visionary: turn the successful defensive Counter
    // directly into an offensive Control window without advancing the turn.
    const visionary = this.#specialInHand(defenderId, "counterFollowup");
    if (visionary) {
      this.#consumeSpecial(defenderId, visionary, "COUNTER_SUCCESS");
      this.match.playerInControl = defenderId;
      this.#startFreshControl(defenderId, { draw: false, triggerTurnStart: false, triggerControlStart: false });
      this.#log("SPECIAL_IMMEDIATE_OFFENSE", { playerId: defenderId, cardId: visionary.id });
      return;
    }

    this.#transferControl(defenderId, { incrementTurn: true, draw: true });
  }

  autoCounter(defenderId, discardedCards) {
    this.#assertMatchActive();
    if (discardedCards.length !== 7) throw new Error("Auto Counter requires exactly 7 discarded pages");
    const pending = this.match.proposedMove;
    if (pending?.uncounterable) throw new Error("This Move cannot be AutoCountered");
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

    const matSacred = this.#specialInHand(defenderId, "matSacred");
    if (matSacred) {
      this.#consumeSpecial(defenderId, matSacred, "AUTO_COUNTER_SUCCESS", { incomingCardId: pending.card.id });
      const punished = this.match.players[pending.attackerId];
      const lost = Math.min(2, punished.momentum.attitude ?? 0);
      punished.momentum.attitude = Math.max(0, (punished.momentum.attitude ?? 0) - 2);
      punished.specialFlags.blockActionUntilMove = true;
      if (lost) this.#log("MOMENTUM_EFFECT", { playerId: pending.attackerId, method: "attitude", amount: -lost, sourceCardId: matSacred.id });
    }

    const visionary = this.#specialInHand(defenderId, "counterFollowup");
    if (visionary) {
      this.#consumeSpecial(defenderId, visionary, "AUTO_COUNTER_SUCCESS");
      this.match.playerInControl = defenderId;
      this.#startFreshControl(defenderId, { draw: false, triggerTurnStart: false, triggerControlStart: false });
      this.#log("SPECIAL_IMMEDIATE_OFFENSE", { playerId: defenderId, cardId: visionary.id });
      return;
    }

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
    let specialReduction = 0;
    const beast = rawDamage >= 10 ? this.#specialInHand(defenderId, "beastIncarnate") : null;
    if (beast) {
      this.#consumeSpecial(defenderId, beast, "INCOMING_10_PLUS_DAMAGE", { incomingCardId: card.id });
      specialReduction = 5;
      defender.momentum.strength = (defender.momentum.strength ?? 0) + 1;
      this.#log("MOMENTUM_EFFECT", { playerId: defenderId, method: "strength", amount: 1, sourceCardId: beast.id });
    }
    const reduction = supportReduction + superstarReduction + specialReduction;
    const damage = Math.max(0, rawDamage - reduction);
    const beforeHp = defender.hp;
    defender.hp = Math.max(0, defender.hp - damage);
    defender.lastDamageTaken = damage;

    // Undertaker — Deadman Walking.
    if (defender.hp <= 0 && defender.superstar.ability?.passive?.surviveAtOneOnce && !defender.passiveFlags.surviveAtOneUsed) {
      defender.hp = 1;
      defender.passiveFlags.surviveAtOneUsed = true;
      const deadmanBoost = defender.superstar.ability?.passive?.deadmanComeback === true;
      defender.momentum.attitude += deadmanBoost ? 2 : 1;
      if (deadmanBoost) this.#draw(defenderId, 1);
      this.#log("SUPERSTAR_PASSIVE", { playerId: defenderId, abilityName: defender.superstar.ability.name, effect: "SURVIVE_AT_ONE", sourceCardId: card.id });
    }

    // André — Unstoppable Giant.
    const giantSpecial = rawDamage >= 10 ? this.#specialInHand(defenderId, "giantSpecial") : null;
    let giantProtected = false;
    if (giantSpecial) {
      this.#consumeSpecial(defenderId, giantSpecial, "INCOMING_10_PLUS_DAMAGE", { incomingCardId: card.id });
      this.#draw(defenderId, 1);
      giantProtected = true;
    }

    // Kane — Through Hellfire.
    const kaneSpecial = rawDamage >= 10 ? this.#specialInHand(defenderId, "kaneSpecial") : null;
    if (kaneSpecial) {
      this.#consumeSpecial(defenderId, kaneSpecial, "INCOMING_10_PLUS_DAMAGE", { incomingCardId: card.id });
      defender.pendingMoveCostModifier = Math.min(defender.pendingMoveCostModifier ?? 0, -2);
      defender.specialFlags.kaneRevenge = true;
    }

    // Miss Elizabeth / Paul Bearer Manager Zone decisions.
    const manager = defender.activeManager;
    if (manager && !defender.managerAbilityUsed && defender.hp <= defender.maxHp * 0.5) {
      if (manager.managerChoice === "elizabeth") {
        this.#draw(defenderId, 2);
        if (defender.hand.length) {
          const bottomed = defender.hand.shift();
          defender.deck.push(bottomed);
          this.#log("MANAGER_BOTTOMED_PAGE", { playerId: defenderId, managerId: manager.id, cardId: bottomed.id });
        }
        defender.managerAbilityUsed = true;
        this.#log("MANAGER_ABILITY", { playerId: defenderId, managerId: manager.id, managerName: manager.name, trigger: "BELOW_HALF_HP" });
      } else if (manager.managerChoice === "bearer") {
        const idx = defender.discard.findIndex(c => c.superstarId === "the-undertaker" && !c.finisher);
        if (idx >= 0) {
          const [recovered] = defender.discard.splice(idx,1);
          defender.hand.push(recovered);
          this.#log("MANAGER_RECOVERED_CARD", { playerId: defenderId, managerId: manager.id, cardId: recovered.id });
        } else {
          defender.momentum.strength += 1;
          defender.momentum.attitude += 1;
          this.#log("MOMENTUM_EFFECT", { playerId: defenderId, method: "strength", amount: 1, sourceCardId: manager.id });
          this.#log("MOMENTUM_EFFECT", { playerId: defenderId, method: "attitude", amount: 1, sourceCardId: manager.id });
        }
        defender.managerAbilityUsed = true;
        this.#log("MANAGER_ABILITY", { playerId: defenderId, managerId: manager.id, managerName: manager.name, trigger: "BELOW_HALF_HP" });
      }
    }

    // Mankind's two threshold comeback.
    if (defender.superstar.id === "mankind") {
      if (!defender.passiveFlags.mankindHalfTriggered && defender.hp <= defender.maxHp * 0.5) {
        defender.passiveFlags.mankindHalfTriggered = true;
        this.#draw(defenderId, 2);
        this.#log("SUPERSTAR_ABILITY", { playerId: defenderId, abilityName: "Have a Nice Day!", trigger: "BELOW_HALF_HP" });
      }
      if (!defender.passiveFlags.mankindQuarterTriggered && defender.hp <= defender.maxHp * 0.25) {
        defender.passiveFlags.mankindQuarterTriggered = true;
        defender.momentum.attitude += 1;
        this.#log("MOMENTUM_EFFECT", { playerId: defenderId, method: "attitude", amount: 1, sourceCardId: "have-a-nice-day" });
      }
    }

    attacker.momentum.attitude += 1 + supportPassive(attacker, "connectedAttitudeBonus");
    defender.momentum.attitude = Math.max(0, defender.momentum.attitude - 1);
    if (card.stunTurns) {
      const ignoresFirstStun = defender.superstar.ability?.passive?.ignoreFirstStun === true;
      if (giantProtected) {
        this.#log("SUPERSTAR_SPECIAL_EFFECT", { playerId: defenderId, effect: "IGNORE_STUN", sourceCardId: card.id });
      } else if ((defender.passiveFlags.ignoreNextStun ?? 0) > 0) {
        defender.passiveFlags.ignoreNextStun -= 1;
        this.#log("SUPERSTAR_PASSIVE", { playerId: defenderId, abilityName: defender.superstar.ability?.name, effect: "IGNORE_STUN", sourceCardId: card.id });
      } else if (ignoresFirstStun && !defender.passiveFlags.firstStunIgnored) {
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
      const ignoreFirstRingside = defender.superstar.ability?.passive?.ignoreFirstRingside === true && !defender.passiveFlags.firstRingsideIgnored;
      if (giantProtected || ignoreFirstRingside) {
        if (ignoreFirstRingside) defender.passiveFlags.firstRingsideIgnored = true;
        this.#log("SUPERSTAR_PASSIVE", { playerId: defenderId, abilityName: defender.superstar.ability?.name, effect: "IGNORE_RINGSIDE", sourceCardId: card.id });
      } else {
        defender.location = "ringside";
        defender.posture = "standing";
        this.match.countOut.count = 0;
        this.#log("SENT_TO_RINGSIDE", { attackerId, defenderId, cardId: card.id });
      }
    }
    attacker.discard.push(card);
    if (card.selfDamage) {
      attacker.hp = Math.max(0, attacker.hp - card.selfDamage);
      this.#log("SELF_DAMAGE", { playerId: attackerId, amount: card.selfDamage, sourceCardId: card.id });
    }
    if (card.id === "hof1-mankind-claw-reviewed" && attacker.activeSupports.some(c => c.socko)) {
      card.submission = { ...card.submission, damage: (card.submission?.damage ?? 0) + 1 };
    }
    this.#log("MOVE_CONNECTED", { attackerId, defenderId, cardId: card.id, damage, rawDamage, damageReduction: reduction, method: card.method, moveType: card.moveType, finisher: !!card.finisher });
    this.match.proposedMove = null;

    if (card.onConnect?.length) {
      this.#applyEffects(attackerId, card.onConnect, { sourceCardId: card.id, attackerId, defenderId, damage });
      this.#log("MOVE_EFFECTS_RESOLVED", { attackerId, defenderId, cardId: card.id, effectCount: card.onConnect.length });
    }
    if (attacker.specialFlags.kaneRevenge) {
      attacker.specialFlags.kaneRevenge = false;
      attacker.momentum.attitude += 1;
      this.#log("MOMENTUM_EFFECT", { playerId: attackerId, method: "attitude", amount: 1, sourceCardId: "hof1-kane-through-hellfire" });
    }
    const savageSpecial = damage >= 8 ? this.#specialInHand(attackerId, "savageSpecial") : null;
    if (savageSpecial) {
      this.#consumeSpecial(attackerId, savageSpecial, "CONNECTED_8_PLUS", { sourceMoveId: card.id });
      if (attacker.hand.some(c => c.trademark)) this.#draw(attackerId, 2);
      else this.#searchDeck(attackerId, { trademark: true }, savageSpecial.id);
    }

    this.#triggerEntranceSchedules(attackerId, "ON_MOVE_CONNECTED", { damage, method: card.method, moveType: card.moveType, card });
    const finalBossOppAttitudeBefore = attacker.superstar.id === "the-rock" ? (defender.momentum.attitude ?? 0) : null;
    const abilityTriggered = this.#triggerAbility(attackerId, "ON_MOVE_CONNECTED", { damage, method: card.method, moveType: card.moveType, card });
    if (abilityTriggered && attacker.superstar.id === "kane" && card.setOpponentPosture === "on-mat") attacker.specialFlags.kaneStrikeBonus = true;
    if (attacker.superstar.id === "the-rock") {
      if (abilityTriggered && finalBossOppAttitudeBefore === 0) {
        attacker.momentum.attitude += 1;
        this.#log("MOMENTUM_EFFECT",{playerId:attackerId,method:"attitude",amount:1,sourceCardId:"superstar-the-rock"});
      } else if (abilityTriggered && finalBossOppAttitudeBefore > 0 && defender.momentum.attitude === 0 && !attacker.passiveFlags.finalBossZeroDraw) {
        attacker.passiveFlags.finalBossZeroDraw = true;
        this.#draw(attackerId,2);
        this.#log("SUPERSTAR_ABILITY",{playerId:attackerId,abilityName:"The Final Boss",trigger:"REDUCED_OPPONENT_TO_ZERO_ATTITUDE"});
      }
      if (card.id === "s1rock-belt-whip" && defender.momentum.attitude === 0) {
        this.#searchDeck(attackerId,{cardId:"s1rock-final-boss-combination"},card.id);
      }
      if (card.id === "s1rock-final-boss-combination" && attacker.momentum.attitude < defender.momentum.attitude) {
        attacker.momentum.attitude += 1;
        this.#log("MOMENTUM_EFFECT",{playerId:attackerId,method:"attitude",amount:1,sourceCardId:card.id});
      }
      if (card.id === "s1rock-final-boss-slap" && defender.momentum.attitude === 0) {
        this.#draw(attackerId,1);
        attacker.momentum.attitude += 1;
        this.#log("MOMENTUM_EFFECT",{playerId:attackerId,method:"attitude",amount:1,sourceCardId:card.id});
      }
    }
    this.#triggerManager(attackerId, "ON_MOVE_CONNECTED", { damage, method: card.method, moveType: card.moveType, card });

    if (attacker.superstar.id === "randy-savage") {
      if (card.method && !attacker.controlMethods.includes(card.method)) attacker.controlMethods.push(card.method);
      if (!attacker.passiveFlags.madnessTriggered && attacker.controlMethods.length >= 2) {
        attacker.passiveFlags.madnessTriggered = true;
        this.#draw(attackerId, 1);
        attacker.momentum.attitude += 1;
        this.#log("SUPERSTAR_ABILITY", { playerId: attackerId, abilityName: "Madness", trigger: "TWO_METHOD_CONTROL" });
      }
    }

    if (attacker.superstar.id === "rhea-ripley" && card.method === "strength" && attacker.specialFlags.rheaEradicateStrip) {
      attacker.specialFlags.rheaEradicateStrip = false;
      const lost=Math.min(1,defender.momentum.attitude??0);
      defender.momentum.attitude=Math.max(0,(defender.momentum.attitude??0)-1);
      if(lost)this.#log("MOMENTUM_EFFECT",{playerId:defenderId,method:"attitude",amount:-1,sourceCardId:"evo1-rhea-eradicate"});
    }
    if (attacker.superstar.id === "charlotte-flair" && card.id === "evo1-charlotte-chops") {
      attacker.passiveFlags.charlotteChopConnected = true;
      if (!attacker.passiveFlags.charlotteChopAttitudeThisControl && attacker.momentum.attitude < defender.momentum.attitude) {
        attacker.passiveFlags.charlotteChopAttitudeThisControl = true;
        attacker.momentum.attitude += 1;
        this.#log("MOMENTUM_EFFECT",{playerId:attackerId,method:"attitude",amount:1,sourceCardId:card.id});
      }
    }

    if (attacker.superstar.id === "ultimate-warrior" && damage >= 6 && !attacker.passiveFlags.warriorFirstPowerDraw) {
      attacker.passiveFlags.warriorFirstPowerDraw = true;
      this.#draw(attackerId,1);
      this.#log("SUPERSTAR_ABILITY",{playerId:attackerId,abilityName:"Feel the Power",trigger:"FIRST_POWER_DRAW"});
    }

    if (attacker.superstar.id === "brock-lesnar" && card.id === "brock-german-suplex" && !attacker.passiveFlags.brockFirstGermanDraw) {
      attacker.passiveFlags.brockFirstGermanDraw = true;
      this.#draw(attackerId,1);
      this.#log("SUPERSTAR_ABILITY",{playerId:attackerId,abilityName:"Suplex City",trigger:"FIRST_GERMAN_DRAW"});
    }

    // Evolution entrance identities that require match context beyond static scheduled effects.
    if (attacker.superstar.id === "bayley" && card.method === "technical" && (attacker.passiveFlags.roleModelUses ?? 0) < 2) {
      const use=attacker.passiveFlags.roleModelUses ?? 0;
      attacker.passiveFlags.roleModelUses=use+1;
      this.#searchTop(attackerId,{look:use===0?2:1,kind:"move",bottomRest:true},"superstar-bayley");
      this.#log("SUPERSTAR_ABILITY",{playerId:attackerId,abilityName:"Role Model",trigger:use===0?"TECHNICAL_TOP_TWO":"TECHNICAL_TOP_ONE"});
    }
    if (attacker.superstar.id === "bayley" && card.setOpponentPosture && !attacker.passiveFlags.bayleyEntranceDraw) {
      attacker.passiveFlags.bayleyEntranceDraw = true;
      this.#draw(attackerId,1);
      this.#log("ENTRANCE_EFFECT",{playerId:attackerId,entranceName:"Ding Dong, Hello!",effect:"POSTURE_CHANGE_DRAW"});
    }
    if (attacker.superstar.id === "charlotte-flair" && !attacker.passiveFlags.charlotteEntranceAttitude) {
      const reqMethods=Object.entries(card.requirements??{}).filter(([m,n])=>["agility","strength","strike","technical"].includes(m)&&n>0);
      if (reqMethods.length >= 2) {
        attacker.passiveFlags.charlotteEntranceAttitude = true;
        attacker.momentum.attitude += 1;
        this.#draw(attackerId,1);
        this.#log("ENTRANCE_EFFECT",{playerId:attackerId,entranceName:"All Hail The Queen",effect:"MULTI_METHOD_ATTITUDE_DRAW"});
      }
    }
    if (attacker.superstar.id === "paige" && card.method === "technical" && !attacker.passiveFlags.paigeEntranceSearch) {
      attacker.passiveFlags.paigeEntranceSearch = true;
      this.#searchTop(attackerId,{look:3,counterOrSubmission:true,bottomRest:true},"evo1-entrance-paige");
      this.#log("ENTRANCE_EFFECT",{playerId:attackerId,entranceName:"Scream for Me",effect:"COUNTER_SUBMISSION_SEARCH"});
    }
    if (attacker.superstar.id === "stephanie-vaquer") {
      if (attacker.passiveFlags.vaquerPostureChanged && !attacker.passiveFlags.vaquerEntranceDraw) {
        attacker.passiveFlags.vaquerEntranceDraw = true;
        attacker.passiveFlags.vaquerPostureChanged = false;
        this.#draw(attackerId,1);
        this.#log("ENTRANCE_EFFECT",{playerId:attackerId,entranceName:"The Dark Angel",effect:"POSTURE_TRANSITION_DRAW"});
      }
      if (card.setOpponentPosture) attacker.passiveFlags.vaquerPostureChanged = true;
    }

    // Evolution method-combination identities.
    if (attacker.superstar.id === "rhea-ripley" && card.method === "strength" && damage >= 7 && card.setOpponentPosture === "on-mat" && !attacker.passiveFlags.rheaPowerDraw) {
      attacker.passiveFlags.rheaPowerDraw = true;
      this.#draw(attackerId,1);
      this.#log("SUPERSTAR_ABILITY",{playerId:attackerId,abilityName:"Mami’s Always on Top",trigger:"POWER_DRAW"});
    }
    if (card.method && !attacker.controlMethods.includes(card.method)) attacker.controlMethods.push(card.method);
    const sid = attacker.superstar.id;
    if ((sid === "becky-lynch" || sid === "stephanie-vaquer") && attacker.superstar.ability?.passive?.methodCombo) {
      const last=attacker.passiveFlags.lastComboMethod;
      if (last && last !== card.method && (attacker.passiveFlags.methodComboUses ?? 0) < 2) {
        attacker.passiveFlags.methodComboUses=(attacker.passiveFlags.methodComboUses??0)+1;
        attacker.momentum.attitude += 1;
        this.#log("SUPERSTAR_ABILITY",{playerId:attackerId,abilityName:attacker.superstar.ability.name,trigger:"METHOD_CHANGE"});
      }
      attacker.passiveFlags.lastComboMethod=card.method;
    }
    if (sid === "stephanie-vaquer" && (attacker.passiveFlags.methodComboUses ?? 0) === 1 && !attacker.passiveFlags.vaquerFirstComboDraw) {
      attacker.passiveFlags.vaquerFirstComboDraw = true;
      this.#draw(attackerId,1);
      this.#log("SUPERSTAR_ABILITY",{playerId:attackerId,abilityName:"La Primera",trigger:"FIRST_METHOD_CHANGE_DRAW"});
    }
    if (sid === "charlotte-flair" && attacker.superstar.ability?.passive?.threeMethodQueen && !attacker.passiveFlags.queenTriggered) {
      const methods=[...attacker.history.connectedMethods];
      if (card.method && !methods.includes(card.method)) methods.push(card.method);
      for (const [m,n] of Object.entries(card.requirements??{})) {
        if (n>0 && ["technical","strength","agility"].includes(m) && !methods.includes(m)) methods.push(m);
      }
      if (["technical","strength","agility"].every(m=>methods.includes(m))) {
        attacker.passiveFlags.queenTriggered=true; attacker.momentum.attitude+=2; this.#draw(attackerId,2);
        this.#log("SUPERSTAR_ABILITY",{playerId:attackerId,abilityName:"The Queen",trigger:"THREE_METHODS"});
      }
    }
    if (sid === "iyo-sky" && attacker.superstar.ability?.passive?.iyoCombo) {
      attacker.passiveFlags.iyoAgilityInControl = (attacker.passiveFlags.iyoAgilityInControl ?? 0) + (card.method==="agility"?1:0);
      if (card.method==="agility" && attacker.passiveFlags.iyoAgilityInControl>=2 && (attacker.passiveFlags.iyoComboUses??0)<1) {
        attacker.passiveFlags.iyoComboUses=(attacker.passiveFlags.iyoComboUses??0)+1;
        attacker.momentum.attitude+=1;
        this.#log("SUPERSTAR_ABILITY",{playerId:attackerId,abilityName:"Genius of the Sky",trigger:"AGILITY_CHAIN"});
      }
    }
    const iyoSpecial = (card.method==="agility" && (card.cost??0)>=7) ? this.#specialInHand(attackerId,"iyoSkyLimit") : null;
    if (iyoSpecial) {
      this.#consumeSpecial(attackerId,iyoSpecial,"HIGH_AGILITY_CONNECTED",{sourceMoveId:card.id});
      attacker.momentum.attitude+=1; this.#draw(attackerId,1);
      attacker.pendingMoveCostModifier=Math.min(attacker.pendingMoveCostModifier??0,-2);
    }
    const bayleyGrandSlam=this.#specialInHand(attackerId,"bayleyGrandSlam");
    if (bayleyGrandSlam && attacker.controlMethods.length>=2) {
      this.#consumeSpecial(attackerId,bayleyGrandSlam,"TWO_METHOD_CONTROL",{sourceMoveId:card.id});
      attacker.momentum.attitude+=1;
      this.#searchTop(attackerId,{look:4,kind:"move",bottomRest:true},bayleyGrandSlam.id);
    }
    const methodSpecial=this.#specialInHand(attackerId,"methodMixSpecial");
    if (methodSpecial && attacker.controlMethods.length>=3) {
      this.#consumeSpecial(attackerId,methodSpecial,"THREE_METHOD_CONTROL",{sourceMoveId:card.id});
      attacker.momentum.attitude+=1; this.#draw(attackerId,2); attacker.pendingMoveCostModifier=Math.min(attacker.pendingMoveCostModifier??0,-1);
    }
    const mama = card.trademark ? this.#specialInHand(attackerId,"mamaRhodes") : null;
    if (mama) {
      this.#consumeSpecial(attackerId,mama,"TRADEMARK_CONNECTED",{sourceMoveId:card.id});
      this.#discardRandom(defenderId,1,mama.id);
      defender.momentum.attitude=Math.max(0,(defender.momentum.attitude??0)-1);
      attacker.turn.nextMoveDamageBonus += 1;
    }

    if (attacker.superstar.id === "the-undertaker" && !attacker.passiveFlags.restInPeaceTriggered && (card.submission || (card.cost ?? 0) >= 7)) {
      attacker.passiveFlags.restInPeaceTriggered = true;
      attacker.momentum.attitude += 1;
      this.#log("ENTRANCE_EFFECT", { playerId: attackerId, entranceName: "Rest in Peace", effect: "HIGH_LEVEL_ATTITUDE" });
    }
    if (card.method === "strength") {
      const destroyer = this.#specialInHand(attackerId, "destroyerSpecial");
      if (destroyer && !attacker.specialFlags.uncounterableStrength) {
        this.#consumeSpecial(attackerId, destroyer, "STRENGTH_MOVE_CONNECTED", { sourceMoveId: card.id });
        attacker.specialFlags.uncounterableStrength = true;
      }
    }
    this.#triggerEntranceSchedules(defenderId, "ON_DAMAGE_TAKEN", { damage, method: card.method, moveType: card.moveType, card });
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
        cardId: card.id,
        finisher: !!card.finisher,
        trademark: !!card.trademark,
        signature: !!card.signature
      };
      this.#applySubmissionDamage();
      return;
    }

    this.match.postMove = { attackerId, defenderId, cardId: card.id, finisher: !!card.finisher, noGenericPinEscape: !!card.noGenericPinEscape, pinBonus: card.pinBonus ?? 0, pinAtHpRatio: card.pinAtHpRatio ?? null };
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
    const defender = this.match.players[post.defenderId];
    let managerPinPenalty = 0;
    const mgr = defender.activeManager;
    if (mgr?.managerChoice === "heenan" && !defender.managerAbilityUsed) {
      defender.managerAbilityUsed = true;
      managerPinPenalty = -10;
      this.#log("MANAGER_ABILITY", { playerId: post.defenderId, managerId: mgr.id, managerName: mgr.name, trigger: "PIN_INTERFERENCE" });
    }
    this.match.pin = {
      attackerId,
      defenderId: post.defenderId,
      sourceMoveId: post.cardId,
      finisher: !!post.finisher,
      noGenericPinEscape: !!post.noGenericPinEscape,
      chanceModifier: managerPinPenalty + (post.pinBonus ?? 0),
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
    const sitUp = this.#specialInHand(defenderId, "takerSpecial");
    if (sitUp) {
      this.#consumeSpecial(defenderId, sitUp, "SURVIVED_PIN");
      this.#draw(defenderId, 1);
    }
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
    if (this.#enforceTurnLimit()) return;
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

  passTurn(playerId, reason = "unspecified") {
    this.#assertMatchActive();
    if (this.match.phase !== PHASES.ACTION || this.match.playerInControl !== playerId) throw new Error("Cannot pass now");
    const opponent = this.opponentOf(playerId);
    this.match.players[playerId].leadOffActive = false;
    this.#log("CONTROL_PASSED", { from: playerId, to: opponent, reason });
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
    // A connected Move normally retains Control. At 0 HP the wrestler is in a
    // critical/exhausted state: they can still mount a comeback, but cannot
    // sustain an unanswered offensive run unless they finish the match.
    this.match.turnNumber += 1;
    if (this.#enforceTurnLimit()) return;
    const player = this.match.players[playerId];
    if (player.hp <= 0) {
      const opponent = this.opponentOf(playerId);
      this.#log("CRITICAL_EXHAUSTION", { playerId, hp: player.hp, controlTo: opponent });
      this.#transferControl(opponent, { incrementTurn: false, draw: true });
      return;
    }
    this.match.playerInControl = playerId;
    this.#startFreshControl(playerId, { draw: true, triggerTurnStart: true, triggerControlStart: false });
    if (this.match.phase !== PHASES.MATCH_OVER) this.#advanceCountOut();
    this.#log("CONTROL_RETAINED", { playerId, reason: "successful-move" });
  }

  #transferControl(playerId, { incrementTurn = false, draw = false } = {}) {
    const previousControl = this.match.playerInControl;
    if (incrementTurn) {
      this.match.turnNumber += 1;
      if (this.#enforceTurnLimit()) return;
    }
    this.match.playerInControl = playerId;
    if (previousControl !== playerId) {
      this.match.players[playerId].controlMethods = [];
      this.match.players[playerId].passiveFlags.iyoAgilityInControl = 0;
      this.match.players[playerId].passiveFlags.lastComboMethod = null;
      this.match.players[playerId].passiveFlags.charlotteChopConnected = false;
      this.match.players[playerId].passiveFlags.charlotteChopAttitudeThisControl = false;
      for (const px of Object.values(this.match.players)) {
        px.specialFlags.bloodlineCounterTax = 0;
        px.specialFlags.bloodlineCounterTaxRemaining = 0;
      }
    }
    this.#startFreshControl(playerId, { draw, triggerTurnStart: incrementTurn, triggerControlStart: true });
    if (this.match.phase === PHASES.MATCH_OVER) return;

    // Roman Reigns — Tribal Chief: first time Control is taken from Roman,
    // immediately assert Control again. The opponent keeps any card already drawn.
    if (previousControl && previousControl !== playerId) {
      const tribalChief = this.#specialInHand(previousControl, "controlRecovery");
      if (tribalChief) {
        this.#consumeSpecial(previousControl, tribalChief, "CONTROL_LOST", { controlTakenBy: playerId });
        this.match.playerInControl = previousControl;
        this.#startFreshControl(previousControl, { draw: false, triggerTurnStart: false, triggerControlStart: false });
        this.#log("SPECIAL_CONTROL_RECOVERED", { playerId: previousControl, cardId: tribalChief.id });
        if (this.match.phase !== PHASES.MATCH_OVER) this.#advanceCountOut();
        return;
      }
    }

    const newController = this.match.players[playerId];

    // Hulk Hogan — Hulking Up.
    const hoganSpecial = this.#specialInHand(playerId, "hoganSpecial");
    if (hoganSpecial && newController.hp <= newController.maxHp * 0.40) {
      this.#consumeSpecial(playerId, hoganSpecial, "GAIN_CONTROL_BELOW_30_PERCENT_HP");
      this.#draw(playerId, 2);
      newController.specialFlags.hoganPunchBonus = true;
    }

    // Ultimate Warrior — Warrior's Comeback.
    const warriorSpecial = this.#specialInHand(playerId, "warriorSpecial");
    if (warriorSpecial && (newController.lastDamageTaken ?? 0) >= 8) {
      this.#consumeSpecial(playerId, warriorSpecial, "GAIN_CONTROL_AFTER_8_PLUS_DAMAGE");
      newController.momentum.attitude += 1;
      newController.turn.nextMoveDamageBonus += 2;
      this.#draw(playerId, 1);
    }

    // Cody Rhodes — Finish the Story: late-match comeback card.
    const finishStory = this.#specialInHand(playerId, "comebackSpecial");
    if (finishStory && newController.hp <= newController.maxHp * 0.25) {
      this.#consumeSpecial(playerId, finishStory, "GAIN_CONTROL_BELOW_25_PERCENT_HP");
      this.#draw(playerId, 1);
      this.#searchDeck(playerId, { cardIds: ["cody-cutter", "cross-rhodes"] }, finishStory.id);
      this.#log("SPECIAL_COMEBACK", { playerId, cardId: finishStory.id });
    }

    if (this.match.phase !== PHASES.MATCH_OVER) this.#advanceCountOut();
  }


  #enforceTurnLimit() {
    // Turn 50 is playable. Attempting to advance to Turn 51 ends the match as
    // a time-limit draw so pathological loops can never run forever.
    if (this.match.turnNumber <= (this.match.turnLimit ?? 50)) return false;
    this.match.turnNumber = this.match.turnLimit ?? 50;
    this.match.winner = null;
    this.match.finish = { type: "time-limit-draw", turnLimit: this.match.turnLimit ?? 50 };
    this.match.phase = PHASES.MATCH_OVER;
    this.match.proposedMove = null;
    this.match.postMove = null;
    this.match.pin = null;
    this.match.submission = null;
    this.#log("MATCH_ENDED", { winnerId: null, finishType: "time-limit-draw", turnLimit: this.match.turnLimit ?? 50 });
    return true;
  }

  #startFreshControl(playerId, { draw = false, preservePhase = false, triggerTurnStart = false, triggerControlStart = false } = {}) {
    if (!preservePhase) this.match.phase = PHASES.ACTION;
    const p = this.match.players[playerId];
    if (!p.hasHadControl) {
      draw = false;
      p.hasHadControl = true;
    }
    p.turn.momentumPlayed = 0;
    p.turn.actionPlayed = 0;
    p.turn.supportPlayed = 0;
    p.turn.nextMoveCostModifier = p.pendingMoveCostModifier ?? 0;
    p.pendingMoveCostModifier = 0;
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
