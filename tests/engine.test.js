import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { MatchEngine } from "../js/engine/MatchEngine.js";
import { superstars } from "../js/data/superstars.js";
import { cards } from "../js/data/cards.js";
import { hallCards } from "../js/data/hall-of-fame-cards.js";
import { evolutionCards } from "../js/data/evolution-cards.js";
import { decks } from "../js/data/decks.js";
import { collectionCards, setCollection, cardsForSet, setCollectionFor } from "../js/data/collection.js";
import { STARTER_CHOICES, createProfile, hasSuperstar, unlockSuperstar, addOwnedCard, ownedCount, setDeckAssistance } from "../js/data/profile.js";
import { openBooster, openLadderCompletionPack, grantBooster, BOOSTER_SIZE, GUARANTEED_FOILS, RARITY_WEIGHTS, finishEligible } from "../js/data/boosters.js";
import { buildPlayableDeck, findSafeUpgrade, applyUpgrade } from "../js/data/deck-assistant.js";
import { moveEligibility, canAttemptPin, canReturnToRing, effectiveTotalMomentum, submissionThreshold } from "../js/engine/rules.js";
import { cpuDecision, executeCpuDecision, decisionOwner } from "../js/ai/WrestlingAI.js";
import { advanceCpuUntilHuman } from "../js/ui/turn-driver.js";
import { isOffensiveMove, MOVE_TYPES } from "../js/data/move-types.js";
import { LADDER_LIVES, startLadderRun, currentLadderOpponent, recordLadderMatch, ladderState } from "../js/data/ladder.js";
import { artworkFor } from "../js/data/artwork.js";

function game() {
  return new MatchEngine({
    superstarA: superstars.codyRhodes,
    superstarB: superstars.cmPunk,
    deckA: decks["cody-rhodes"],
    deckB: decks["cm-punk"]
  });
}

function putInHand(g, playerId, card) {
  g.state().players[playerId].hand.unshift(structuredClone(card));
  return g.state().players[playerId].hand[0];
}


test("CPU opening Control is advanced until the human has a decision", () => {
  const g = new MatchEngine({
    superstarA: superstars.romanReigns,
    superstarB: superstars.codyRhodes,
    deckA: decks["roman-reigns"],
    deckB: decks["cody-rhodes"],
    startingControl: "p2"
  });
  assert.equal(decisionOwner(g.state()), "p2");
  const beforeLog = g.state().log.length;
  const result = advanceCpuUntilHuman(g, "p2");
  assert.ok(result.steps > 0, "CPU should take at least one opening decision");
  assert.ok(g.state().log.length > beforeLog, "CPU opening turn must advance game state");
  assert.notEqual(decisionOwner(g.state()), "p2", "CPU must not remain stuck as decision owner after its opening sequence");
  assert.ok(["p1", null].includes(decisionOwner(g.state())), "human should own the next response/action unless the match ended");
});

test("move costs are eligibility thresholds and are never spent", () => {
  const g = game();
  const p = g.state().players.p1;
  p.momentum.technical = 2;
  p.momentum.strength = 1;
  p.momentum.attitude = 4;
  const move = putInHand(g, "p1", cards.crossRhodes);
  const before = structuredClone(p.momentum);
  g.declareMove("p1", move);
  g.passCounter("p2");
  assert.equal(p.momentum.technical, before.technical);
  assert.equal(p.momentum.strength, before.strength);
  assert.equal(p.momentum.attitude, before.attitude + 1);
});

test("specific method requirements are additional eligibility checks", () => {
  const g = game();
  const p = g.state().players.p1;
  p.momentum.attitude = 10;
  const move = putInHand(g, "p1", cards.crossRhodes);
  assert.throws(() => g.declareMove("p1", move), /Requires 2 technical/);
});

test("successful counter consumes both cards and transfers control", () => {
  const g = game();
  g.state().players.p1.momentum.strike = 1;
  const jab = putInHand(g, "p1", cards.jab);
  const dodge = putInHand(g, "p2", cards.duck);
  const p1DiscardBefore = g.state().players.p1.discard.length;
  const p2DiscardBefore = g.state().players.p2.discard.length;
  g.declareMove("p1", jab);
  g.counter("p2", dodge);
  assert.equal(g.state().playerInControl, "p2");
  assert.equal(g.state().proposedMove, null);
  assert.equal(g.state().players.p2.hp, superstars.cmPunk.hp);
  assert.equal(g.state().players.p1.discard.length, p1DiscardBefore + 1);
  assert.equal(g.state().players.p2.discard.length, p2DiscardBefore + 1);
});

test("original-style Move Type is separate from Momentum method", () => {
  assert.equal(cards.clothesline.method, "strike");
  assert.equal(cards.clothesline.moveType, "mad-rush");
  assert.deepEqual(cards.clothesline.counters, ["hit-or-miss", "leg-extended"]);
  assert.equal(cards.armDrag.method, "technical");
  assert.equal(cards.armDrag.moveType, "arm-extended");
  assert.ok(cards.armDrag.counters.includes("mad-rush"));
  assert.equal(cards.ddt.moveType, "victim-below");
  assert.equal(cards.dropkick.moveType, "hit-or-miss");
  assert.equal(cards.sideHeadlock.moveType, "back-to-foe");
  assert.equal(cards.duck.moveType, "defensive");
  assert.equal(cards.stomp.moveType, "standing-above");
  assert.ok(cards.slingBlade.counters.includes("scoop"));
});

test("every collectible resolves to a local artwork file", () => {
  assert.equal(collectionCards.length, 537);
  for (const card of collectionCards) {
    const art = artworkFor(card);
    assert.ok(art, `${card.id} has no artwork path`);
    const local = new URL(`../${art}`, import.meta.url);
    assert.ok(existsSync(local), `${card.id} artwork file missing: ${art}`);
  }
});

test("every collectible Move has a valid tactical Move Type and method", () => {
  for (const card of collectionCards.filter(c => c.kind === "move")) {
    assert.ok(MOVE_TYPES.includes(card.moveType), `${card.id} has invalid Move Type ${card.moveType}`);
    assert.ok(["agility","knowledge","strength","strike","technical"].includes(card.method), `${card.id} has invalid method ${card.method}`);
    for (const target of card.counters ?? []) assert.ok(MOVE_TYPES.includes(target), `${card.id} counters invalid type ${target}`);
  }
});

test("auto counter requires seven pages from hand and transfers control", () => {
  const g = game();
  g.state().players.p1.momentum.strike = 1;
  const jab = putInHand(g, "p1", cards.jab);
  g.state().players.p2.hand = Array.from({ length: 7 }, () => structuredClone(cards.jab));
  g.declareMove("p1", jab);
  assert.throws(() => g.autoCounter("p2", g.state().players.p2.hand.slice(0, 6)), /7/);
  g.autoCounter("p2", [...g.state().players.p2.hand]);
  assert.equal(g.state().playerInControl, "p2");
  assert.equal(g.state().players.p2.hand.length, 0); // first Control uses the fixed Lead Off hand; no random draw is added
});

test("one momentum page per control turn and played Momentum leaves hand", () => {
  const g = game();
  const strike = putInHand(g, "p1", cards.momentum.strike);
  const strength = putInHand(g, "p1", cards.momentum.strength);
  const beforeHand = g.state().players.p1.hand.length;
  g.playMomentum("p1", strike);
  assert.equal(g.state().players.p1.hand.length, beforeHand - 1);
  assert.throws(() => g.playMomentum("p1", strength));
});

test("connected move opens a post-move window, then ending offense retains Control and starts a fresh turn", () => {
  const g = game();
  g.state().players.p1.momentum.strike = 1;
  const jab = putInHand(g, "p1", cards.jab);
  const turnBefore = g.state().turnNumber;
  g.declareMove("p1", jab);
  g.passCounter("p2");
  assert.equal(g.state().phase, "POST_MOVE");
  assert.equal(g.state().playerInControl, "p1");
  const handBeforeFreshTurn = g.state().players.p1.hand.length;
  g.endPostMove("p1");
  assert.equal(g.state().playerInControl, "p1");
  assert.equal(g.state().turnNumber, turnBefore + 1);
  assert.equal(g.state().players.p1.hand.length, handBeforeFreshTurn + 1);
  assert.equal(g.state().log.some(e => e.type === "CONTROL_RETAINED" && e.playerId === "p1"), true);
});

test("submission can be maintained by ditching one page", () => {
  const g = new MatchEngine({ superstarA: superstars.cmPunk, superstarB: superstars.codyRhodes, deckA: decks["cm-punk"], deckB: decks["cody-rhodes"] });
  const p = g.state().players.p1;
  p.momentum.technical = 2;
  p.momentum.attitude = 4;
  g.state().players.p2.posture = "on-mat";
  const sub = putInHand(g, "p1", cards.anacondaVise);
  g.declareMove("p1", sub);
  g.passCounter("p2");
  assert.equal(g.state().phase, "SUBMISSION_MAINTAIN");
  const ditch = g.state().players.p1.hand[0];
  g.maintainSubmission("p1", ditch);
  assert.equal(g.state().playerInControl, "p1");
  assert.equal(g.state().players.p1.discard.some(c => c.id === ditch.id), true);
});

test("releasing a submission keeps control", () => {
  const g = new MatchEngine({ superstarA: superstars.cmPunk, superstarB: superstars.codyRhodes, deckA: decks["cm-punk"], deckB: decks["cody-rhodes"] });
  const p = g.state().players.p1;
  p.momentum.technical = 2;
  p.momentum.attitude = 4;
  g.state().players.p2.posture = "on-mat";
  const sub = putInHand(g, "p1", cards.anacondaVise);
  g.declareMove("p1", sub);
  g.passCounter("p2");
  g.releaseSubmission("p1");
  assert.equal(g.state().playerInControl, "p1");
  assert.equal(g.state().submission, null);
});

test("all 24 linked Entrances resolve automatically pre-match outside the five-card Lead Off hand", () => {
  for (const star of Object.values(superstars)) {
    const opponent = star.id === "cody-rhodes" ? superstars.cmPunk : superstars.codyRhodes;
    const g = new MatchEngine({ superstarA: star, superstarB: opponent, deckA: decks[star.id], deckB: decks[opponent.id], startingControl: "p1" });
    const p = g.state().players.p1;
    assert.equal(p.entrancePlayed, true, star.id);
    assert.equal(p.hand.some(card => card.kind === "entrance"), false, `${star.id} Entrance must never occupy the hand`);
    assert.deepEqual(p.hand.map(card => card.id), star.leadOffIds, `${star.id} must begin with its exact five playable Lead Off pages`);
    assert.equal(p.hand.length, 5);
    assert.equal(g.state().players.p2.hand.length, 5, "both wrestlers begin with five fixed playable pages");
    const entranceLog = g.state().log.find(e => e.type === "ENTRANCE_PREMATCH" && e.playerId === "p1");
    assert.equal(entranceLog?.cardId, star.entranceId, `${star.id} linked Entrance should resolve from the Superstar card`);
  }
});

test("neither wrestler receives a random draw on their first Control turn", () => {
  const g = game();
  assert.equal(g.state().players.p1.hand.length, 5);
  assert.equal(g.state().players.p2.hand.length, 5);
  g.passTurn("p1");
  assert.equal(g.state().players.p2.hand.length, 5);
});

test("Cody Entrance registers delayed Turn 5 Agility Momentum without changing the pre-match hand size", () => {
  const g = game();
  const cody = g.state().players.p1;
  assert.equal(cody.hand.length, 5);
  assert.equal(g.state().log.some(e => e.type === "ENTRANCE_EFFECT" && e.cardId === "entrance-cody-rhodes"), false);
  g.passTurn("p1"); // 2
  g.passTurn("p2"); // 3
  g.passTurn("p1"); // 4
  g.passTurn("p2"); // 5
  assert.equal(g.state().turnNumber, 5);
  assert.equal(g.state().log.some(e => e.type === "ENTRANCE_EFFECT" && e.cardId === "entrance-cody-rhodes"), true);
});

test("Punk Entrance grants Technical Momentum during PRE-MATCH", () => {
  const g = new MatchEngine({ superstarA: superstars.cmPunk, superstarB: superstars.codyRhodes, deckA: decks["cm-punk"], deckB: decks["cody-rhodes"] });
  assert.equal(g.state().players.p1.momentum.technical, 1);
  assert.equal(g.state().players.p1.hand.some(card => card.kind === "entrance"), false);
});

test("Roman Entrance waits until Turn 6 to grant Attitude", () => {
  const g = new MatchEngine({ superstarA: superstars.romanReigns, superstarB: superstars.codyRhodes, deckA: decks["roman-reigns"], deckB: decks["cody-rhodes"] });
  const roman = g.state().players.p1;
  assert.equal(roman.momentum.attitude, 0);
  for (let i = 0; i < 5; i += 1) g.passTurn(g.state().playerInControl);
  assert.equal(g.state().turnNumber, 6);
  assert.equal(roman.momentum.attitude, 1);
  assert.equal(roman.momentum.strength >= 1, true);
});

test("Seth Entrance grants Technical Momentum during PRE-MATCH without changing the normal Momentum play limit", () => {
  const g = new MatchEngine({ superstarA: superstars.sethRollins, superstarB: superstars.codyRhodes, deckA: decks["seth-rollins"], deckB: decks["cody-rhodes"], startingControl: "p1" });
  const seth = g.state().players.p1;
  assert.equal(seth.momentum.technical, 1);
  assert.equal(seth.turn.momentumPlayLimit, 1);
  const first = seth.hand.find(card => card.kind === "momentum");
  g.playMomentum("p1", first);
  const second = seth.hand.find(card => card.kind === "momentum") ?? putInHand(g, "p1", cards.momentum.technical);
  assert.throws(() => g.playMomentum("p1", second), /Illegal momentum/);
});

test("Cody's Superstar ability rewards the first new Move Type once", () => {
  const g = game();
  const cody = g.state().players.p1;
  cody.momentum.strike = 3; cody.momentum.technical = 3; cody.momentum.attitude = 4;
  const first = putInHand(g, "p1", cards.clothesline);
  g.declareMove("p1", first); g.passCounter("p2");
  assert.equal(cody.abilityUses, 1);
  g.endPostMove("p1");
  const second = putInHand(g, "p1", cards.ddt);
  g.declareMove("p1", second); g.passCounter("p2");
  assert.equal(cody.abilityUses, 1);
  assert.equal(cody.abilityUsed, true);
});

test("Punk's Counter Culture triggers once and grants Technical Momentum", () => {
  const g = new MatchEngine({ superstarA: superstars.codyRhodes, superstarB: superstars.cmPunk, deckA: decks["cody-rhodes"], deckB: decks["cm-punk"] });
  g.state().players.p1.momentum.strike = 2;
  let incoming = putInHand(g, "p1", cards.jab);
  let counter = putInHand(g, "p2", cards.duck);
  g.declareMove("p1", incoming); g.counter("p2", counter);
  assert.equal(g.state().players.p2.abilityUses, 1);
  assert.equal(g.state().players.p2.momentum.technical >= 2, true);
  g.passTurn("p2");
  incoming = putInHand(g, "p1", cards.jab);
  counter = putInHand(g, "p2", cards.duck);
  g.declareMove("p1", incoming); g.counter("p2", counter);
  assert.equal(g.state().players.p2.abilityUses, 1);
  assert.equal(g.state().players.p2.abilityUsed, true);
});

test("Roman's Head of the Table grants extra Attitude on 7+ damage Moves", () => {
  const g = new MatchEngine({ superstarA: superstars.romanReigns, superstarB: superstars.codyRhodes, deckA: decks["roman-reigns"], deckB: decks["cody-rhodes"] });
  const roman = g.state().players.p1;
  roman.momentum.strength = 2; roman.momentum.attitude = 3;
  const move = putInHand(g, "p1", cards.samoanDrop);
  g.declareMove("p1", move); g.passCounter("p2");
  assert.equal(roman.abilityUses, 1);
  assert.equal(roman.momentum.attitude, 5); // +1 normal connection, +1 Superstar ability
});

test("Seth's Architect rewards first-time Methods without adding setup requirements", () => {
  const g = new MatchEngine({ superstarA: superstars.sethRollins, superstarB: superstars.codyRhodes, deckA: decks["seth-rollins"], deckB: decks["cody-rhodes"] });
  const seth = g.state().players.p1;
  seth.momentum.agility = 1; seth.momentum.attitude = 2;
  const move = putInHand(g, "p1", cards.slingBlade);
  const before = seth.hand.length;
  g.declareMove("p1", move); g.passCounter("p2");
  assert.equal(seth.abilityUses, 1);
  assert.equal(seth.hand.length >= before, true); // Move leaves, ability draws one.
});

test("Undertaker draws when a cost-6+ Move is Countered", () => {
  const g = new MatchEngine({ superstarA: superstars.undertaker, superstarB: superstars.codyRhodes, deckA: decks["the-undertaker"], deckB: decks["cody-rhodes"] });
  const taker = g.state().players.p1;
  taker.momentum.strength = 5; taker.momentum.attitude = 5;
  const heavy = putInHand(g, "p1", { ...hallCards.takerChokeslam, cost: 6 });
  const counter = putInHand(g, "p2", cards.desperationCounter);
  g.declareMove("p1", heavy); g.counter("p2", counter);
  assert.equal(taker.abilityUses, 1);
  assert.equal(g.state().log.some(e => e.type === "SUPERSTAR_ABILITY" && e.playerId === "p1"), true);
});

test("Kane's Superstar card passively reduces High Risk damage and ignores his first Stun", () => {
  const g = new MatchEngine({ superstarA: superstars.codyRhodes, superstarB: superstars.kane, deckA: decks["cody-rhodes"], deckB: decks["kane"] });
  const cody = g.state().players.p1;
  cody.momentum.strike = 3; cody.momentum.attitude = 3;
  const incoming = putInHand(g, "p1", { ...cards.clothesline, damage: 6, stunTurns: 1, moveType: "high-risk" });
  const before = g.state().players.p2.hp;
  g.declareMove("p1", incoming); g.passCounter("p2");
  assert.equal(g.state().players.p2.hp, before - 5);
  assert.equal(g.state().players.p2.status.stunnedTurns, 0);
  assert.equal(g.state().players.p2.passiveFlags.firstStunIgnored, true);
});

test("a knockdown Move opens a legal first pin attempt at zero Attitude cost", () => {
  const g = game();
  const cody = g.state().players.p1;
  cody.momentum.technical = 1;
  cody.momentum.attitude = 2;
  const move = putInHand(g, "p1", cards.codyPowerslam);
  g.declareMove("p1", move);
  g.passCounter("p2");
  assert.equal(g.state().phase, "POST_MOVE");
  const before = cody.momentum.attitude;
  const chance = g.attemptPin("p1");
  assert.equal(g.state().phase, "PIN_RESPONSE");
  assert.equal(cody.pinAttempts, 1);
  assert.equal(cody.momentum.attitude, before);
  assert.equal(chance >= 5 && chance <= 95, true);
});

test("repeat pin attempts spend escalating Attitude but never Ability Momentum", () => {
  const g = game();
  const cody = g.state().players.p1;
  cody.pinAttempts = 2;
  cody.momentum.attitude = 5;
  cody.momentum.technical = 1;
  const beforeTech = cody.momentum.technical;
  const move = putInHand(g, "p1", cards.codyPowerslam);
  g.declareMove("p1", move);
  g.passCounter("p2");
  g.attemptPin("p1");
  assert.equal(cody.pinAttempts, 3);
  assert.equal(cody.momentum.attitude, 4); // +1 from move, then 2 spent on third pin attempt
  assert.equal(cody.momentum.technical, beforeTech);
});

test("pin-escape Special stops the pin and gives the defender Control", () => {
  const g = game();
  const cody = g.state().players.p1;
  cody.momentum.technical = 1;
  cody.momentum.attitude = 2;
  const move = putInHand(g, "p1", cards.codyPowerslam);
  const escape = putInHand(g, "p2", cards.shoulderUp);
  g.declareMove("p1", move);
  g.passCounter("p2");
  g.attemptPin("p1");
  g.playPinEscape("p2", escape);
  assert.equal(g.state().phase, "ACTION");
  assert.equal(g.state().playerInControl, "p2");
  assert.equal(g.state().players.p2.discard.some(c => c.id === "shoulder-up"), true);
});

test("successful pin ends the match and blocks further play", () => {
  const g = new MatchEngine({
    superstarA: superstars.codyRhodes,
    superstarB: superstars.cmPunk,
    deckA: decks["cody-rhodes"],
    deckB: decks["cm-punk"],
    rng: () => 0
  });
  const cody = g.state().players.p1;
  cody.momentum.technical = 2;
  cody.momentum.strength = 1;
  cody.momentum.attitude = 4;
  const finisher = putInHand(g, "p1", cards.crossRhodes);
  g.declareMove("p1", finisher);
  g.passCounter("p2");
  g.attemptPin("p1");
  const result = g.passPinResponse("p2");
  assert.equal(result.success, true);
  assert.equal(g.state().phase, "MATCH_OVER");
  assert.equal(g.state().winner, "p1");
  assert.equal(g.state().finish.type, "pin");
  assert.throws(() => g.passTurn("p1"), /Match is over/);
});

test("failed pin gives the defender Control rather than causing a KO", () => {
  const g = new MatchEngine({
    superstarA: superstars.codyRhodes,
    superstarB: superstars.cmPunk,
    deckA: decks["cody-rhodes"],
    deckB: decks["cm-punk"],
    rng: () => 0.999
  });
  const cody = g.state().players.p1;
  cody.momentum.technical = 1;
  cody.momentum.attitude = 2;
  const move = putInHand(g, "p1", cards.codyPowerslam);
  g.declareMove("p1", move);
  g.passCounter("p2");
  g.attemptPin("p1");
  const result = g.passPinResponse("p2");
  assert.equal(result.success, false);
  assert.equal(g.state().winner, null);
  assert.equal(g.state().playerInControl, "p2");
});

test("pin-escape Special ends the failed pin and transfers Control to the defender", () => {
  const g = game();
  const p1 = g.state().players.p1;
  p1.momentum.technical = 1;
  p1.momentum.attitude = 2;
  const move = putInHand(g, "p1", cards.codyPowerslam);
  const escape = putInHand(g, "p2", cards.shoulderUp);
  g.declareMove("p1", move);
  g.passCounter("p2");
  g.attemptPin("p1");
  g.playPinEscape("p2", escape);
  assert.equal(g.state().playerInControl, "p2");
  assert.equal(g.state().phase, "ACTION");
});

test("maintained submissions apply repeated body-part pressure and can win", () => {
  const g = new MatchEngine({ superstarA: superstars.cmPunk, superstarB: superstars.codyRhodes, deckA: decks["cm-punk"], deckB: decks["cody-rhodes"] });
  const punk = g.state().players.p1;
  const cody = g.state().players.p2;
  punk.momentum.technical = 2;
  punk.momentum.attitude = 4;
  cody.hp = 12;
  cody.posture = "on-mat";
  const sub = putInHand(g, "p1", cards.anacondaVise);
  g.declareMove("p1", sub);
  g.passCounter("p2");
  assert.equal(cody.submissionDamage.head, 4);
  assert.equal(g.state().phase, "SUBMISSION_MAINTAIN");
  let squeezes = 0;
  while (g.state().phase === "SUBMISSION_MAINTAIN" && squeezes < 10) {
    const ditch = punk.hand[0];
    g.maintainSubmission("p1", ditch);
    squeezes += 1;
  }
  assert.ok(cody.submissionDamage.head >= 8);
  assert.equal(g.state().phase, "MATCH_OVER");
  assert.equal(g.state().winner, "p1");
  assert.equal(g.state().finish.type, "submission");
});

function seededRng(seed) {
  let x = seed >>> 0;
  return () => ((x = (1664525 * x + 1013904223) >>> 0) / 4294967296);
}

test("all 24 strategy decks contain exactly 55 pages with fixed five-card openings", () => {
  for (const deck of Object.values(decks)) assert.equal(deck.length, 55);
});

test("CPU can complete all 552 non-mirror roster matchups without stalling", () => {
  const roster = Object.values(superstars);
  for (let i = 0; i < roster.length; i += 1) {
    for (let j = 0; j < roster.length; j += 1) {
      if (i === j) continue;
      const a = roster[i], b = roster[j];
      const g = new MatchEngine({ superstarA: a, superstarB: b, deckA: decks[a.id], deckB: decks[b.id], rng: seededRng(100 + i * 10 + j) });
      let steps = 0;
      while (g.state().phase !== "MATCH_OVER" && steps < 500) {
        const owner = decisionOwner(g.state());
        assert.ok(owner, `${a.id} vs ${b.id} lost decision owner at ${g.state().phase}`);
        const decision = executeCpuDecision(g, owner);
        assert.notEqual(decision.type, "none", `${a.id} vs ${b.id} stalled at ${g.state().phase}`);
        steps += 1;
      }
      assert.equal(g.state().phase, "MATCH_OVER", `${a.id} vs ${b.id} did not finish`);
      assert.ok(g.state().winner === "p1" || g.state().winner === "p2" || g.state().winner === null);
      assert.ok(["pin", "submission", "time-limit-draw"].includes(g.state().finish.type));
      assert.ok(g.state().turnNumber <= 50, `${a.id} vs ${b.id} exceeded the Turn-50 safety limit`);
    }
  }
});

test("Actions resolve immediately and only one may be played per Control turn", () => {
  const g = game();
  const p = g.state().players.p1;
  p.momentum.attitude = 0;
  const fire = putInHand(g, "p1", cards.fireUp);
  const heal = putInHand(g, "p1", cards.catchBreath);
  g.playAction("p1", fire);
  assert.equal(p.momentum.attitude, 2);
  assert.equal(p.discard.some(c => c.id === "fire-up"), true);
  assert.throws(() => g.playAction("p1", heal), /Illegal Action/);
});

test("Game Plan lowers only the next Move eligibility threshold and spends no Momentum", () => {
  const g = game();
  const p = g.state().players.p1;
  p.momentum.technical = 1;
  p.momentum.attitude = 1; // raw total 2; Arm Drag normally costs 2, so use a cost-4 clone
  const setup = putInHand(g, "p1", cards.gamePlan);
  const move = putInHand(g, "p1", { ...cards.armDrag, id: "test-cost-four", cost: 4 });
  assert.throws(() => g.declareMove("p1", move), /Not enough total momentum/);
  g.playAction("p1", setup);
  const before = structuredClone(p.momentum);
  g.declareMove("p1", move);
  assert.deepEqual(p.momentum, before);
  assert.equal(p.turn.nextMoveCostModifier, 0);
});

test("Supports remain active, cap at two, and replace the oldest Support", () => {
  const g = game();
  const p = g.state().players.p1;
  const a = putInHand(g, "p1", cards.ringGeneralship);
  g.playSupport("p1", a);
  assert.equal(p.activeSupports.length, 1);
  g.passTurn("p1"); g.passTurn("p2");
  const b = putInHand(g, "p1", cards.fightingSpirit);
  g.playSupport("p1", b);
  g.passTurn("p1"); g.passTurn("p2");
  const c = putInHand(g, "p1", cards.crowdConnection);
  g.playSupport("p1", c);
  assert.equal(p.activeSupports.length, 2);
  assert.equal(p.activeSupports.some(x => x.id === "ring-generalship"), false);
  assert.equal(p.discard.some(x => x.id === "ring-generalship"), true);
});

test("Ring Generalship contributes virtual Total Momentum without satisfying method requirements", () => {
  const g = game();
  const p = g.state().players.p1;
  p.momentum.technical = 1;
  p.momentum.attitude = 1;
  const support = putInHand(g, "p1", cards.ringGeneralship);
  g.playSupport("p1", support);
  const costThree = putInHand(g, "p1", { ...cards.armDrag, id: "cost-three-arm-drag", cost: 3 });
  g.declareMove("p1", costThree); // 2 real + 1 virtual total
  g.counter("p2", putInHand(g, "p2", cards.duck));

  // A virtual total bonus does not create Strength Momentum for specific requirements.
  g.passTurn("p2");
  p.momentum.attitude = 10;
  const needsStrength = putInHand(g, "p1", { ...cards.armDrag, id: "needs-strength", requirements: { strength: 1 }, cost: 1 });
  assert.throws(() => g.declareMove("p1", needsStrength), /Requires 1 strength/);
});

test("Fighting Spirit reduces Move damage and Crowd Connection adds Attitude", () => {
  const g = game();
  const attacker = g.state().players.p1;
  const defender = g.state().players.p2;
  attacker.momentum.strike = 1;
  attacker.activeSupports.push(structuredClone(cards.crowdConnection));
  defender.activeSupports.push(structuredClone(cards.fightingSpirit));
  const jab = putInHand(g, "p1", cards.jab);
  const hpBefore = defender.hp;
  const attitudeBefore = attacker.momentum.attitude;
  g.declareMove("p1", jab);
  g.passCounter("p2");
  assert.equal(defender.hp, hpBefore - 1);
  assert.equal(attacker.momentum.attitude, attitudeBefore + 2);
});

test("Desperation Counter is a Special that can counter any Move", () => {
  const g = game();
  g.state().players.p1.momentum.technical = 1;
  g.state().players.p1.momentum.attitude = 1;
  const incoming = putInHand(g, "p1", cards.armDrag);
  const special = putInHand(g, "p2", cards.desperationCounter);
  g.declareMove("p1", incoming);
  g.counter("p2", special);
  assert.equal(g.state().playerInControl, "p2");
  assert.equal(g.state().players.p2.discard.some(c => c.id === "desperation-counter"), true);
});


test("SummerSlam Series 1 contains the eight launch Superstars", () => {
  const ids = Object.values(superstars).filter(s => s.setId === "summerslam-series-1").map(s => s.id).sort();
  assert.deepEqual(ids, ["brock-lesnar", "cm-punk", "cody-rhodes", "gunther", "kevin-owens", "oba-femi", "roman-reigns", "seth-rollins"]);
});

test("signature Moves no longer need corner, ropes, orientation, barricade or apron setup", () => {
  const punkGame = new MatchEngine({ superstarA: superstars.cmPunk, superstarB: superstars.codyRhodes, deckA: decks["cm-punk"], deckB: decks["cody-rhodes"] });
  const punk = punkGame.state().players.p1;
  punk.momentum.strike = 1; punk.momentum.technical = 1; punk.momentum.attitude = 2;
  const knee = putInHand(punkGame, "p1", cards.runningKnee);
  assert.equal(moveEligibility(punkGame.state(), "p1", knee).legal, true);

  const codyGame = game();
  const cody = codyGame.state().players.p1;
  cody.momentum.agility = 2; cody.momentum.attitude = 3;
  const cutter = putInHand(codyGame, "p1", cards.codyCutter);
  assert.equal(moveEligibility(codyGame.state(), "p1", cutter).legal, true);
});

test("on-mat remains the only positional prerequisite for grounded attacks", () => {
  const g = new MatchEngine({ superstarA: superstars.cmPunk, superstarB: superstars.codyRhodes, deckA: decks["cm-punk"], deckB: decks["cody-rhodes"] });
  const punk = g.state().players.p1;
  punk.momentum.agility = 1; punk.momentum.technical = 1; punk.momentum.attitude = 3;
  const elbow = putInHand(g, "p1", cards.divingElbow);
  assert.equal(moveEligibility(g.state(), "p1", elbow).legal, false);
  g.state().players.p2.posture = "on-mat";
  assert.equal(moveEligibility(g.state(), "p1", elbow).legal, true);
});

test("Throw Over the Ropes sends the opponent outside and prevents an in-ring pin", () => {
  const g = game();
  const p1 = g.state().players.p1;
  p1.momentum.attitude = 3;
  const toss = putInHand(g, "p1", cards.throwOverRopes);
  g.declareMove("p1", toss);
  g.passCounter("p2");
  assert.equal(g.state().players.p2.location, "ringside");
  assert.equal(g.state().phase, "POST_MOVE");
  assert.equal(g.state().players.p2.posture, "standing");
  assert.equal(g.state().players.p1.location, "ring");
  assert.equal(canAttemptPin(g.state(), "p1").legal, false);
});

test("attacker may follow a wrestler sent outside, but cannot leave voluntarily", () => {
  const g = game();
  assert.throws(() => g.followOutside("p1"), /No follow-out opportunity/);
  const toss = putInHand(g, "p1", cards.throwOverRopes);
  g.state().players.p1.momentum.attitude = 3;
  g.declareMove("p1", toss);
  g.passCounter("p2");
  g.followOutside("p1");
  assert.equal(g.state().players.p1.location, "ringside");
  assert.equal(g.state().players.p2.location, "ringside");
});

test("a non-stunned wrestler in Control can always return to the ring", () => {
  const g = game();
  const p1 = g.state().players.p1;
  p1.location = "ringside";
  g.returnToRing("p1");
  assert.equal(p1.location, "ring");
  assert.equal(p1.posture, "standing");
});

test("count-out advances on Control changes and ends the match at ten", () => {
  const g = game();
  g.state().players.p2.location = "ringside";
  for (let i = 0; i < 10 && g.state().phase !== "MATCH_OVER"; i += 1) {
    g.passTurn(g.state().playerInControl);
  }
  assert.equal(g.state().phase, "MATCH_OVER");
  assert.equal(g.state().finish.type, "count-out");
  assert.equal(g.state().winner, "p1");
  assert.equal(g.state().countOut.count, 10);
});

test("ringside Moves are directly playable outside without a separate setup card", () => {
  const g = game();
  const p1 = g.state().players.p1, p2 = g.state().players.p2;
  p1.location = p2.location = "ringside";
  p1.momentum.strength = 1; p1.momentum.attitude = 3;
  const slam = putInHand(g, "p1", cards.ringsideSlam);
  assert.equal(moveEligibility(g.state(), "p1", slam).legal, true);
  g.declareMove("p1", slam); g.passCounter("p2");
  assert.equal(p2.status.stunnedTurns, 1);
});

test("Cut Off the Ring remains a tactical ringside Action, not a Move setup requirement", () => {
  const g = game();
  const p1 = g.state().players.p1, p2 = g.state().players.p2;
  p1.location = p2.location = "ringside";
  g.playAction("p1", putInHand(g, "p1", cards.cutOffRing));
  g.passTurn("p1");
  assert.equal(g.state().playerInControl, "p2");
  assert.equal(canReturnToRing(g.state(), "p2"), false);
  assert.throws(() => g.returnToRing("p2"), /blocked/);
  g.passTurn("p2"); g.passTurn("p1");
  assert.equal(canReturnToRing(g.state(), "p2"), true);
});


test("decks contain no setup-only positional dependencies beyond posture and ring/ringside location", () => {
  const forbidden = ["requiresSelfRingPosition", "requiresOpponentRingPosition", "requiresOpponentOrientation", "setSelfRingPosition", "setOpponentRingPosition", "setOpponentOrientation"];
  for (const [deckId, deck] of Object.entries(decks)) {
    for (const card of deck) {
      for (const key of forbidden) assert.equal(card[key], undefined, `${deckId}:${card.id} still uses ${key}`);
      if (card.requiresPosture) assert.ok(["standing", "on-mat"].includes(card.requiresPosture), `${card.id} has unsupported posture`);
      if (card.requiresLocation) assert.ok(["ring", "ringside"].includes(card.requiresLocation), `${card.id} has unsupported location`);
    }
  }
});


test("flow guard keeps mature 3+ Momentum dead-Move passes below 20 percent", () => {
  const roster = Object.values(superstars);
  const seededRng = (seed) => { let x = seed >>> 0; return () => ((x = (1664525 * x + 1013904223) >>> 0) / 4294967296); };
  let terminal = 0, deadPass = 0;
  for (let rep = 0; rep < 3; rep += 1) {
    for (let i = 0; i < roster.length; i += 1) for (let j = 0; j < roster.length; j += 1) if (i !== j) {
      const a = roster[i], b = roster[j];
      const g = new MatchEngine({ superstarA: a, superstarB: b, deckA: decks[a.id], deckB: decks[b.id], rng: seededRng(7000 + rep * 100 + i * 10 + j) });
      let steps = 0;
      while (g.state().phase !== "MATCH_OVER" && steps < 500) {
        const owner = decisionOwner(g.state());
        if (!owner) break;
        const d = cpuDecision(g.state(), owner);
        const st = g.state();
        if (st.phase === "ACTION" && effectiveTotalMomentum(st.players[owner]) >= 3 && ["move", "pass", "returnToRing"].includes(d.type)) {
          terminal += 1;
          if (d.type === "pass" && st.players[owner].hand.some(c => isOffensiveMove(c))) deadPass += 1;
        }
        executeCpuDecision(g, owner);
        steps += 1;
      }
    }
  }
  assert.ok(deadPass / terminal < 0.20, `dead-Move pass rate ${(deadPass / terminal * 100).toFixed(1)}% exceeded 20%`);
});


test("SummerSlam Series 1 now contains at least 130 distinct Move cards", () => {
  const moveCards = cardsForSet("summerslam-series-1").filter(card => card.kind === "move");
  assert.ok(moveCards.length >= 130, `expected at least 130 Moves, got ${moveCards.length}`);
});

test("all 24 recommended decks respect the five-copy per-card cap", () => {
  for (const [id, deck] of Object.entries(decks)) {
    const counts = new Map();
    for (const card of deck) counts.set(card.id, (counts.get(card.id) ?? 0) + 1);
    for (const [cardId, count] of counts) assert.ok(count <= 5, `${id}: ${cardId} appears ${count} times`);
  }
});

test("SummerSlam Series 1 collection has stable sequential numbering and rarity metadata", () => {
  const summer = cardsForSet("summerslam-series-1");
  assert.equal(setCollection.id, "summerslam-series-1");
  assert.equal(setCollection.displayName, "SummerSlam — Series 1");
  assert.equal(summer.length, setCollection.cardCount);
  summer.forEach((card, index) => {
    assert.equal(card.cardNumber, index + 1);
    assert.equal(card.setId, "summerslam-series-1");
    assert.equal(card.rarity >= 1 && card.rarity <= 4, true);
  });
});

test("SummerSlam Series 1 catalogue includes one Superstar card for each launch wrestler", () => {
  const summer = cardsForSet("summerslam-series-1");
  const superstarIds = summer.filter(card => card.kind === "superstar").map(card => card.superstarId).sort();
  assert.deepEqual(superstarIds, ["brock-lesnar", "cm-punk", "cody-rhodes", "gunther", "kevin-owens", "oba-femi", "roman-reigns", "seth-rollins"]);
  assert.equal(summer.filter(card => card.kind === "superstar").every(card => card.rarity === 4), true);
});


test("new saves offer only CM Punk or Roman Reigns as starter choices", () => {
  assert.deepEqual(STARTER_CHOICES, ["cm-punk", "roman-reigns"]);
  assert.throws(() => createProfile("cody-rhodes"), /CM Punk or Roman Reigns/);
});

test("starter profile unlocks exactly the chosen Champion", () => {
  const punk = createProfile("cm-punk");
  assert.equal(hasSuperstar(punk, "cm-punk"), true);
  assert.equal(hasSuperstar(punk, "roman-reigns"), false);
  assert.equal(punk.unlockedSuperstars.length, 1);
});

test("collecting a Superstar card can unlock another wrestler without changing the starter", () => {
  const p = createProfile("roman-reigns");
  unlockSuperstar(p, "gunther");
  assert.equal(p.starterId, "roman-reigns");
  assert.equal(hasSuperstar(p, "gunther"), true);
  assert.equal(p.unlockedSuperstars.length, 2);
});


test("starter profile owns its full normal starter deck and begins with three boosters", () => {
  const p = createProfile("cm-punk");
  assert.equal(p.boosterCredits, 3);
  assert.equal(p.savedDecks["cm-punk"].length, 55);
  assert.equal(ownedCount(p, "superstar-cm-punk", "normal"), 0);
  assert.equal(ownedCount(p, "superstar-cm-punk", "foil"), 1);
  const expectedRoundhouse = decks["cm-punk"].filter(c => c.id === "punk-roundhouse").length;
  assert.equal(ownedCount(p, "punk-roundhouse"), expectedRoundhouse);
});

test("booster configuration is five cards with one guaranteed foil and 50/30/15/5 rarity", () => {
  assert.equal(BOOSTER_SIZE, 5);
  assert.equal(GUARANTEED_FOILS, 1);
  assert.deepEqual(RARITY_WEIGHTS, { 1: 0.50, 2: 0.30, 3: 0.15, 4: 0.05 });
});

test("opening a booster consumes one credit and records five owned pulls", () => {
  const p = createProfile("roman-reigns");
  const before = p.boosterCredits;
  const pulls = openBooster(p, () => 0);
  assert.equal(pulls.length, 5);
  assert.equal(p.boosterCredits, before - 1);
  assert.equal(p.packsOpened, 1);
  assert.equal(pulls.reduce((sum,x) => sum + (x.foil ? 1 : 0), 0), 1);
});

test("pulling a locked Superstar unlocks them with an ownership-backed deck and essential package", () => {
  const p = createProfile("cm-punk");
  p.packsSinceSuperstarUnlock = 19;
  p.packsSinceSuperstarUnlockBySet = { "summerslam-series-1": 19 };
  // foil slot = 4, pity slot = 0, locked Superstar choice = final locked star (Gunther).
  const seq = [.99, 0, .99, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  let call = 0;
  const pulls = openBooster(p, () => seq[call++] ?? 0, "summerslam-series-1");
  assert.equal(pulls[0].card.id, "superstar-gunther");
  assert.equal(pulls[0].superstarUnlocked, true);
  assert.equal(hasSuperstar(p, "gunther"), true);
  assert.equal(p.savedDecks.gunther.length <= 55, true);
  assert.equal(p.savedDecks.gunther.length >= 5, true);
  assert.deepEqual(p.savedDecks.gunther.slice(0,5).map(e=>e.id), superstars.gunther.leadOffIds);
  for (const entry of p.savedDecks.gunther) {
    const used = p.savedDecks.gunther.filter(e => e.id === entry.id).length;
    const owned = ownedCount(p, entry.id, "normal") + ownedCount(p, entry.id, "foil");
    assert.equal(used <= owned, true, `${entry.id} must be genuinely owned`);
  }
});

test("card ownership caps at five total copies and Foils replace Normals at the cap", () => {
  const p = createProfile("cm-punk");
  p.ownedCards["test-card"] = { normal: 5, foil: 0 };
  let result = addOwnedCard(p, "test-card", { foil: true });
  assert.deepEqual({ normal: result.normal, foil: result.foil }, { normal: 4, foil: 1 });
  for (let i = 0; i < 4; i += 1) addOwnedCard(p, "test-card", { foil: true });
  assert.equal(ownedCount(p, "test-card", "normal"), 0);
  assert.equal(ownedCount(p, "test-card", "foil"), 5);
  assert.equal(finishEligible(p, "test-card", false), false);
  assert.equal(finishEligible(p, "test-card", true), false);
});

test("Normal booster copies stop at five total while Foils remain eligible until five Foils", () => {
  const p = createProfile("roman-reigns");
  p.ownedCards["generic-bodyslam"] = { normal: 4, foil: 1 };
  assert.equal(finishEligible(p, "generic-bodyslam", false), false);
  assert.equal(finishEligible(p, "generic-bodyslam", true), true);
  addOwnedCard(p, "generic-bodyslam", { foil: true });
  assert.deepEqual(p.ownedCards["generic-bodyslam"], { normal: 3, foil: 2 });
});

test("Foil Move is a safe same-card upgrade and deals exactly one extra damage", () => {
  const p = createProfile("cm-punk");
  addOwnedCard(p, "punk-roundhouse", { foil: true });
  const card = collectionCards.find(c => c.id === "punk-roundhouse");
  const upgrade = findSafeUpgrade(p, "cm-punk", { card, foil: true });
  assert.equal(upgrade.type, "foil-swap");
  applyUpgrade(p, upgrade);
  const built = buildPlayableDeck(p, "cm-punk");
  const foil = built.find(c => c.id === "punk-roundhouse" && c.foil);
  assert.ok(foil);
  assert.equal(foil.damage, cards.punkRoundhouse.damage + 1);
  assert.deepEqual(foil.requirements, cards.punkRoundhouse.requirements);
  assert.equal(foil.cost, cards.punkRoundhouse.cost);
});

test("Deck Assistance supports ask, auto-upgrade and manual modes", () => {
  const p = createProfile("roman-reigns");
  for (const mode of ["ask", "auto", "manual"]) { setDeckAssistance(p, mode); assert.equal(p.deckAssistance, mode); }
  assert.throws(() => setDeckAssistance(p, "reckless"), /Invalid/);
});

test("all 24 recommended decks satisfy shared deck-health floors", async () => {
  const { evaluateDeck } = await import("../js/data/deck-health.js");
  for (const [superstarId, deck] of Object.entries(decks)) {
    const health = evaluateDeck(deck, { superstarId });
    assert.equal(health.healthy, true, `${superstarId}: ${health.violations.join(" | ")}`);
    assert.equal(health.counts.lowCostMoves >= 6, true);
    assert.equal(health.counts.midCostMoves >= 5, true);
    assert.equal(health.counts.counters >= 5, true);
    assert.equal(health.openingCounts.entrance, 0);
    assert.equal(health.openingCounts.momentum >= 2, true);
    assert.equal(health.openingCounts.offensiveMoves >= 3, true);
  }
});

test("deck health rejects swaps that damage functional deck shape", async () => {
  const { isDeckSwapSafe, evaluateDeck } = await import("../js/data/deck-health.js");
  const before = structuredClone(decks["cm-punk"]);
  const lowIndex = before.findIndex((c, i) => i >= 5 && isOffensiveMove(c) && (c.cost ?? 0) <= 3);
  assert.ok(lowIndex >= 0);
  const after = structuredClone(before);
  // Replace every tail low-cost offensive Move until the floor is broken with an expensive Finisher.
  let replaced = 0;
  for (let i = 5; i < after.length && evaluateDeck(after, { superstarId: "cm-punk" }).counts.lowCostMoves >= 6; i += 1) {
    const c = after[i];
    if (isOffensiveMove(c) && (c.cost ?? 0) <= 3) { after[i] = structuredClone(cards.gts); replaced += 1; }
  }
  assert.ok(replaced > 0);
  assert.equal(isDeckSwapSafe(before, after, { superstarId: "cm-punk" }), false);
});

test("recommended deck shape exposes role targets used by auto-building", async () => {
  const { RECOMMENDED_DECK_SHAPE } = await import("../js/data/deck-health.js");
  assert.deepEqual(RECOMMENDED_DECK_SHAPE.lowCostMoves, { min: 6, target: 10, max: 16 });
  assert.deepEqual(RECOMMENDED_DECK_SHAPE.midCostMoves, { min: 5, target: 9, max: 14 });
  assert.deepEqual(RECOMMENDED_DECK_SHAPE.counters, { min: 12, target: 18, max: 28 });
  assert.deepEqual(RECOMMENDED_DECK_SHAPE.momentum, { min: 12, target: 14, max: 16 });
});


test("Climb the Ladder creates an eight-opponent run including the selected Superstar mirror", () => {
  const p = createProfile("cm-punk");
  const ids = Object.values(superstars).map(s => s.id);
  const run = startLadderRun(p, "cm-punk", ids, () => 0.42);
  assert.equal(run.opponents.length, 8);
  assert.equal(new Set(run.opponents).size, 8);
  assert.equal(run.opponents.includes("cm-punk"), true);
  assert.equal(run.lives, LADDER_LIVES);
  assert.equal(run.rung, 0);
});

test("ladder losses consume lives, retry the same rung and third loss ends the run", () => {
  const p = createProfile("roman-reigns");
  startLadderRun(p, "roman-reigns", Object.values(superstars).map(s => s.id), () => 0.2);
  const firstOpponent = currentLadderOpponent(p);
  assert.equal(recordLadderMatch(p, "loss").status, "retry");
  assert.equal(ladderState(p).activeRun.lives, 2);
  assert.equal(currentLadderOpponent(p), firstOpponent);
  recordLadderMatch(p, "loss");
  const third = recordLadderMatch(p, "loss");
  assert.equal(third.status, "failed");
  assert.equal(ladderState(p).activeRun.lives, 0);
  assert.equal(ladderState(p).activeRun.rung, 0);
});

test("eight ladder wins clear the run and award a Completion Pack", () => {
  const p = createProfile("cm-punk");
  startLadderRun(p, "cm-punk", Object.values(superstars).map(s => s.id), () => 0.1);
  let result;
  for (let i = 0; i < 8; i += 1) result = recordLadderMatch(p, "win");
  assert.equal(result.status, "cleared");
  assert.equal(ladderState(p).clears, 1);
  assert.equal(ladderState(p).completionPackCredits, 1);
  assert.equal(ladderState(p).firstClearSuperstarPending, true);
});

test("Climb the Ladder Completion Pack guarantees one Foil, a Very Rare and a locked Superstar on first clear", () => {
  const p = createProfile("cm-punk");
  startLadderRun(p, "cm-punk", Object.values(superstars).map(s => s.id), () => 0.1);
  for (let i = 0; i < 8; i += 1) recordLadderMatch(p, "win");
  const beforeUnlocked = p.unlockedSuperstars.length;
  const pulls = openLadderCompletionPack(p, () => 0);
  assert.equal(pulls.length, 5);
  assert.equal(pulls.filter(x => x.foil).length >= 1, true);
  assert.equal(pulls.some(x => x.card.rarity === 4), true);
  assert.equal(p.unlockedSuperstars.length, beforeUnlocked + 1);
  assert.equal(ladderState(p).completionPackCredits, 0);
  assert.equal(ladderState(p).firstClearSuperstarPending, false);
});

test("ladder draws do not consume a life or advance the rung", () => {
  const p = createProfile("roman-reigns");
  startLadderRun(p, "roman-reigns", Object.values(superstars).map(s => s.id), () => 0.3);
  const before = structuredClone(ladderState(p).activeRun);
  const out = recordLadderMatch(p, "draw");
  assert.equal(out.status, "retry");
  assert.equal(ladderState(p).activeRun.lives, before.lives);
  assert.equal(ladderState(p).activeRun.rung, before.rung);
});


test("all 24 Superstar mirror matches can complete without AI stalls", () => {
  const seededRng = (seed) => { let x = seed >>> 0; return () => ((x = (1664525 * x + 1013904223) >>> 0) / 4294967296); };
  for (const [index, star] of Object.values(superstars).entries()) {
    const g = new MatchEngine({ superstarA: star, superstarB: star, deckA: decks[star.id], deckB: decks[star.id], rng: seededRng(9000 + index) });
    let steps = 0;
    while (g.state().phase !== "MATCH_OVER" && steps < 600) {
      const owner = decisionOwner(g.state());
      if (!owner) break;
      executeCpuDecision(g, owner);
      steps += 1;
    }
    assert.equal(g.state().phase, "MATCH_OVER", `${star.id} mirror stalled after ${steps} decisions`);
  }
});

test("daily challenges rotate deterministically and can be claimed for boosters", async () => {
  const { challengeState, recordChallengeMetric, claimChallenge } = await import("../js/data/challenges.js");
  const p = createProfile("cm-punk");
  const when = new Date(2026, 7, 10, 12, 0, 0);
  const state = challengeState(p, when);
  assert.equal(state.daily.length, 3);
  const challenge = state.daily[0];
  recordChallengeMetric(p, challenge.metric, challenge.target, when);
  const before = p.boosterCredits;
  const reward = claimChallenge(p, challenge.id, when);
  assert.equal(p.boosterCredits, before + reward);
  assert.equal(challenge.claimed, true);
  const same = challengeState(p, when).daily.map(c => c.id);
  assert.deepEqual(same, state.daily.map(c => c.id));
});

test("weekly challenges persist within the same Monday-to-Sunday period", async () => {
  const { challengeState } = await import("../js/data/challenges.js");
  const p = createProfile("roman-reigns");
  const monday = challengeState(p, new Date(2026, 7, 10, 9)).weekly.map(c => c.id);
  const sunday = challengeState(p, new Date(2026, 7, 16, 20)).weekly.map(c => c.id);
  assert.deepEqual(sunday, monday);
  const nextMonday = challengeState(p, new Date(2026, 7, 17, 9)).weekly.map(c => c.id);
  assert.notDeepEqual(nextMonday, monday);
});

test("completed matches feed win, finisher, counter and ladder-rung challenge metrics", async () => {
  const { challengeState, recordCompletedMatchChallenges } = await import("../js/data/challenges.js");
  const p = createProfile("cm-punk");
  const when = new Date(2026, 7, 10, 12);
  challengeState(p, when);
  const fake = { winner: "p1", log: [
    { type: "MOVE_CONNECTED", attackerId: "p1", finisher: true },
    { type: "MOVE_COUNTERED", defenderId: "p1" }
  ]};
  recordCompletedMatchChallenges(p, fake, "p1", "ladder", when);
  const all = [...p.challenges.daily, ...p.challenges.weekly];
  for (const [metric, expected] of [["wins",1],["finishers",1],["counters",1],["ladderRungs",1],["matches",1]]) {
    const matching = all.filter(c => c.metric === metric);
    if (matching.length) assert.equal(matching.every(c => c.progress >= Math.min(expected,c.target)), true, metric);
  }
});

test("SummerSlam Series 1 lifecycle supports Featured, Vaulted and Returning", async () => {
  const { setProgressState, setLifecycle, boosterSetAvailable } = await import("../js/data/set-progression.js");
  const p = createProfile("cm-punk");
  assert.equal(setProgressState(p).lifecycle, "featured");
  setLifecycle(p, "vaulted");
  assert.equal(boosterSetAvailable(p), false);
  setLifecycle(p, "returning");
  assert.equal(boosterSetAvailable(p), true);
});

test("collection milestone rewards are based on unique owned cards and cannot be claimed twice", async () => {
  const { collectionProgress, availableMilestoneRewards, claimMilestone } = await import("../js/data/set-progression.js");
  const { addOwnedCard } = await import("../js/data/profile.js");
  const { collectionCards } = await import("../js/data/collection.js");
  const p = createProfile("cm-punk");
  for (const card of collectionCards.slice(0, Math.ceil(collectionCards.length * .25))) addOwnedCard(p, card.id, { amount: 5 });
  const progress = collectionProgress(p);
  assert.equal(progress.percent >= 25, true);
  const reward = availableMilestoneRewards(p).collection.find(m => m.percent === 25);
  assert.ok(reward);
  const before = p.boosterCredits;
  claimMilestone(p, "collection", 25);
  assert.equal(p.boosterCredits, before + reward.reward);
  assert.throws(() => claimMilestone(p, "collection", 25), /already claimed/);
});


test("each Superstar card is linked to the exact fixed five-card Lead Off package", async () => {
  for (const star of Object.values(superstars)) {
    assert.equal(star.cardId, `superstar-${star.id}`);
    assert.deepEqual(star.leadOffIds, decks[star.id].slice(0, 5).map(c => c.id), star.id);
    assert.equal(star.entranceId.includes("entrance-"), true, star.id);
    assert.equal(star.leadOffIds.some(id => id.includes("entrance-")), false, star.id);
  }
});

test("Entrance cards are unique one-copy collectibles and Foil replaces the Normal", async () => {
  const { ownershipCapFor } = await import("../js/data/card-limits.js");
  const p = createProfile("cm-punk");
  const entrance = cards.punkEntrance;
  assert.equal(ownershipCapFor(entrance), 1);
  assert.equal(ownedCount(p, entrance.id, "normal"), 0);
  assert.equal(ownedCount(p, entrance.id, "foil"), 1);
  assert.equal(finishEligible(p, entrance.id, false), false);
  assert.equal(finishEligible(p, entrance.id, true), false);
  addOwnedCard(p, entrance.id, { foil: true });
  assert.equal(ownedCount(p, entrance.id, "normal"), 0);
  assert.equal(ownedCount(p, entrance.id, "foil"), 1);
  assert.equal(finishEligible(p, entrance.id, false), false);
  assert.equal(finishEligible(p, entrance.id, true), false);
});

test("Deck Builder locks Lead Off identities and only edits the remaining 50 cards", async () => {
  const { createDeckDraft, removeCardFromDraft, validateDeckDraft } = await import("../js/data/deck-builder.js");
  const p = createProfile("cm-punk");
  const draft = createDeckDraft(p, "cm-punk");
  assert.deepEqual(draft.slice(0, 5).map(e => e.id), superstars.cmPunk.leadOffIds);
  assert.throws(() => removeCardFromDraft("cm-punk", draft, 0), /Lead Off/);
  const edited = removeCardFromDraft("cm-punk", draft, 5);
  assert.equal(edited.length, 54);
  assert.equal(validateDeckDraft(p, "cm-punk", edited).healthy, false);
});

test("Optimize Deck preserves the Superstar-linked Lead Off five and legal deck shape", async () => {
  const { createDeckDraft, optimizeDeck, validateDeckDraft } = await import("../js/data/deck-builder.js");
  const p = createProfile("roman-reigns");
  const draft = createDeckDraft(p, "roman-reigns");
  const optimized = optimizeDeck(p, "roman-reigns", draft);
  assert.equal(optimized.length, 55);
  assert.deepEqual(optimized.slice(0, 5).map(e => e.id), superstars.romanReigns.leadOffIds);
  assert.equal(validateDeckDraft(p, "roman-reigns", optimized).healthy, true);
});

test("Entrance cards are always Foil unlock rewards and never appear in boosters", async () => {
  const { boosterEligible } = await import("../js/data/boosters.js");
  const p = createProfile("cm-punk");
  const codyEntrance = collectionCards.find(c => c.id === "entrance-cody-rhodes");
  assert.equal(boosterEligible(p, codyEntrance, false), false);
  assert.equal(boosterEligible(p, codyEntrance, true), false);
  unlockSuperstar(p, "cody-rhodes");
  assert.equal(ownedCount(p, codyEntrance.id, "normal"), 0);
  assert.equal(ownedCount(p, codyEntrance.id, "foil"), 1);
  assert.equal(boosterEligible(p, codyEntrance, false), false);
  assert.equal(boosterEligible(p, codyEntrance, true), false);
});

test("Superstar cards are always Foil and have no Normal version", async () => {
  const { boosterEligible } = await import("../js/data/boosters.js");
  const p = createProfile("cm-punk");
  const superstar = collectionCards.find(c => c.id === "superstar-cm-punk");
  assert.deepEqual(p.ownedCards[superstar.id], { normal: 0, foil: 1 });
  assert.equal(boosterEligible(p, superstar, false), false);
  assert.equal(boosterEligible(p, superstar, true), false);
});

test("Championship Road creates three unique contenders then a World Champion final", async () => {
  const { startChampionshipRoad, currentChampionshipOpponent, CHAMPIONSHIP_ROAD_LENGTH } = await import("../js/data/championship-road.js");
  const p = createProfile("cm-punk");
  const run = startChampionshipRoad(p, "cm-punk", Object.values(superstars).map(s => s.id), () => 0.42);
  assert.equal(run.opponents.length, CHAMPIONSHIP_ROAD_LENGTH);
  assert.equal(new Set(run.opponents).size, CHAMPIONSHIP_ROAD_LENGTH);
  assert.equal(run.opponents.includes("cm-punk"), false);
  assert.equal(run.opponents.at(-1), "roman-reigns");
  assert.equal(currentChampionshipOpponent(p), run.opponents[0]);
});

test("Championship Road losses and draws retry the same stage while wins advance", async () => {
  const { startChampionshipRoad, recordChampionshipMatch, championshipRoadState } = await import("../js/data/championship-road.js");
  const p = createProfile("roman-reigns");
  startChampionshipRoad(p, "roman-reigns", Object.values(superstars).map(s => s.id), () => 0.2);
  assert.equal(recordChampionshipMatch(p, "loss").status, "retry");
  assert.equal(championshipRoadState(p).activeRun.stage, 0);
  assert.equal(recordChampionshipMatch(p, "draw").status, "retry");
  assert.equal(championshipRoadState(p).activeRun.stage, 0);
  assert.equal(recordChampionshipMatch(p, "win").status, "advance");
  assert.equal(championshipRoadState(p).activeRun.stage, 1);
});

test("four Championship Road wins award a Championship Pack and a one-time clear flag for that Superstar", async () => {
  const { startChampionshipRoad, recordChampionshipMatch, championshipRoadState, resetChampionshipRoad } = await import("../js/data/championship-road.js");
  const p = createProfile("cm-punk");
  const ids = Object.values(superstars).map(s => s.id);
  startChampionshipRoad(p, "cm-punk", ids, () => 0.3);
  let result;
  for (let i = 0; i < 4; i += 1) result = recordChampionshipMatch(p, "win");
  assert.equal(result.status, "cleared");
  assert.equal(result.firstWithSuperstar, true);
  assert.equal(championshipRoadState(p).championshipPackCredits, 1);
  assert.deepEqual(championshipRoadState(p).completedBy, ["cm-punk"]);
  resetChampionshipRoad(p);
  startChampionshipRoad(p, "cm-punk", ids, () => 0.4);
  for (let i = 0; i < 4; i += 1) result = recordChampionshipMatch(p, "win");
  assert.equal(result.firstWithSuperstar, false);
  assert.equal(championshipRoadState(p).championshipPackCredits, 2);
});

test("Championship Pack contains five cards, at least one Foil and at least one Rare+", async () => {
  const { startChampionshipRoad, recordChampionshipMatch, championshipRoadState } = await import("../js/data/championship-road.js");
  const { openChampionshipPack } = await import("../js/data/boosters.js");
  const p = createProfile("cm-punk");
  startChampionshipRoad(p, "cm-punk", Object.values(superstars).map(s => s.id), () => 0.25);
  for (let i = 0; i < 4; i += 1) recordChampionshipMatch(p, "win");
  const pulls = openChampionshipPack(p, () => 0.1);
  assert.equal(pulls.length, 5);
  assert.equal(pulls.filter(x => x.foil).length >= 1, true);
  assert.equal(pulls.some(x => x.card.rarity >= 3), true);
  assert.equal(championshipRoadState(p).championshipPackCredits, 0);
});

test("standard booster Superstar bad-luck protection guarantees a locked Superstar by pack 20 without one", async () => {
  const { openBooster, SUPERSTAR_PITY_PACKS } = await import("../js/data/boosters.js");
  const p = createProfile("cm-punk");
  p.boosterCredits = 1;
  p.packsSinceSuperstarUnlock = SUPERSTAR_PITY_PACKS - 1;
  const before = p.unlockedSuperstars.length;
  const pulls = openBooster(p, () => 0.99);
  assert.equal(p.unlockedSuperstars.length >= before + 1, true);
  assert.equal(pulls.some(x => x.superstarUnlocked), true);
  assert.equal(p.packsSinceSuperstarUnlock, 0);
});

test("Championship Road wins feed Championship challenge metrics", async () => {
  const { challengeState, recordCompletedMatchChallenges } = await import("../js/data/challenges.js");
  const p = createProfile("cm-punk");
  const when = new Date(2026, 7, 10, 12);
  const state = challengeState(p, when);
  const matching = [...state.daily, ...state.weekly].filter(c => c.metric === "championshipWins");
  recordCompletedMatchChallenges(p, { winner: "p1", log: [] }, "p1", "championship", when);
  assert.equal(matching.every(c => c.progress >= 1), true);
});


test("Hall of Fame Series 1 contains eight legends, two eras and three Managers", () => {
  const hall = cardsForSet("hall-of-fame-series-1");
  const info = setCollectionFor("hall-of-fame-series-1");
  assert.equal(info.displayName, "Hall of Fame — Series 1");
  assert.equal(hall.length, 167);
  assert.equal(hall.filter(c => c.kind === "superstar").length, 8);
  assert.equal(hall.filter(c => c.kind === "manager").length, 3);
  assert.deepEqual(
    hall.filter(c => c.kind === "superstar" && c.era === "golden-era").map(c => c.superstarId).sort(),
    ["andre-the-giant", "hulk-hogan", "randy-savage", "ultimate-warrior"]
  );
  assert.deepEqual(
    hall.filter(c => c.kind === "superstar" && c.era === "attitude-era").map(c => c.superstarId).sort(),
    ["kane", "mankind", "stone-cold-steve-austin", "the-undertaker"]
  );
  hall.forEach((card, index) => {
    assert.equal(card.cardNumber, index + 1);
    assert.equal(card.setId, "hall-of-fame-series-1");
  });
});

test("Managers are unique, Superstar-restricted and only one may be included in a deck", async () => {
  const { ownershipCapFor } = await import("../js/data/card-limits.js");
  const { evaluateDeck } = await import("../js/data/deck-health.js");
  assert.equal(ownershipCapFor(hallCards.bobbyHeenan), 1);
  assert.deepEqual(hallCards.bobbyHeenan.allowedSuperstarIds, ["andre-the-giant"]);
  assert.deepEqual(hallCards.missElizabeth.allowedSuperstarIds, ["randy-savage"]);
  assert.deepEqual(hallCards.paulBearer.allowedSuperstarIds, ["the-undertaker", "kane"]);
  const illegal = [...decks["andre-the-giant"]];
  illegal[5] = hallCards.missElizabeth;
  illegal[6] = hallCards.bobbyHeenan;
  const health = evaluateDeck(illegal, { superstarId: "andre-the-giant" });
  assert.equal(health.healthy, false);
  assert.equal(health.violations.some(v => v.includes("at most one Manager")), true);
});

test("Bobby Heenan triggers once after Andre successfully Counters a Move", () => {
  const g = new MatchEngine({ superstarA: superstars.andreTheGiant, superstarB: superstars.hulkHogan, deckA: decks["andre-the-giant"], deckB: decks["hulk-hogan"], rng: () => 0 });
  const andre = g.state().players.p1;
  const heenan = putInHand(g, "p1", hallCards.bobbyHeenan);
  g.playManager("p1", heenan);
  assert.equal(andre.activeManager.id, hallCards.bobbyHeenan.id);
  g.passTurn("p1");
  g.state().players.p2.momentum.attitude = 1;
  let incoming = putInHand(g, "p2", hallCards.jab);
  let counter = putInHand(g, "p1", hallCards.duck);
  g.declareMove("p2", incoming);
  g.counter("p1", counter);
  assert.equal(andre.managerAbilityUsed, true);
  assert.equal(andre.momentum.attitude, 1);
  assert.equal(g.state().log.filter(e => e.type === "MANAGER_ABILITY" && e.managerId === hallCards.bobbyHeenan.id).length, 1);
  g.passTurn("p1");
  g.state().players.p2.momentum.attitude = 1;
  incoming = putInHand(g, "p2", hallCards.jab);
  counter = putInHand(g, "p1", hallCards.duck);
  g.declareMove("p2", incoming);
  g.counter("p1", counter);
  assert.equal(g.state().log.filter(e => e.type === "MANAGER_ABILITY" && e.managerId === hallCards.bobbyHeenan.id).length, 1);
});

test("a Manager cannot be played for an unrelated Superstar", () => {
  const g = new MatchEngine({ superstarA: superstars.hulkHogan, superstarB: superstars.andreTheGiant, deckA: decks["hulk-hogan"], deckB: decks["andre-the-giant"] });
  const heenan = putInHand(g, "p1", hallCards.bobbyHeenan);
  assert.throws(() => g.playManager("p1", heenan), /Illegal Manager/);
});

test("Stone Cold's Kick to the Gut searches the Playbook for Stone Cold Stunner", () => {
  const g = new MatchEngine({ superstarA: superstars.stoneCold, superstarB: superstars.mankind, deckA: decks["stone-cold-steve-austin"], deckB: decks.mankind, rng: () => 0.4 });
  const austin = g.state().players.p1;
  austin.momentum.strike = 1;
  austin.momentum.attitude = 2;
  const kick = austin.hand.find(c => c.id === hallCards.austinKickGut.id) ?? putInHand(g, "p1", hallCards.austinKickGut);
  assert.equal(austin.hand.some(c => c.id === hallCards.austinStunner.id), false);
  g.declareMove("p1", kick);
  g.passCounter("p2");
  assert.equal(austin.hand.some(c => c.id === hallCards.austinStunner.id), true);
  assert.equal(g.state().log.some(e => e.type === "CARD_SEARCHED" && e.playerId === "p1" && e.cardId === hallCards.austinStunner.id), true);
});

test("Move secondary effects can draw, discard and add extra Attitude without extra setup cards", () => {
  const g = new MatchEngine({ superstarA: superstars.brockLesnar, superstarB: superstars.romanReigns, deckA: decks["brock-lesnar"], deckB: decks["roman-reigns"], rng: () => 0 });
  const brock = g.state().players.p1;
  const roman = g.state().players.p2;

  // Draw effect.
  brock.momentum.strength = 2;
  brock.momentum.attitude = 3;
  const handBeforeDraw = brock.hand.length;
  const suplexCity = putInHand(g, "p1", cards.brockTripleGermans);
  g.declareMove("p1", suplexCity);
  g.passCounter("p2");
  assert.equal(brock.hand.length >= handBeforeDraw, true); // played card leaves, then effect draws
  assert.equal(g.state().log.some(e => e.type === "CARDS_DRAWN" && e.playerId === "p1"), true);

  // Discard effect.
  g.endPostMove("p1");
  brock.momentum.strength = 3; brock.momentum.attitude = 7;
  const romanHandBefore = roman.hand.length;
  const f5 = putInHand(g, "p1", cards.f5);
  g.declareMove("p1", f5);
  g.passCounter("p2");
  assert.equal(roman.hand.length, romanHandBefore - 1);
  assert.equal(g.state().log.some(e => e.type === "CARDS_DISCARDED" && e.playerId === "p2"), true);

  // Extra Attitude effect beyond the universal +1 on a connected Move.
  g.endPostMove("p1");
  brock.momentum.strength = 1; brock.momentum.attitude = 3;
  const belly = putInHand(g, "p1", cards.bellyToBelly);
  const beforeAttitude = brock.momentum.attitude;
  g.declareMove("p1", belly);
  g.passCounter("p2");
  assert.equal(brock.momentum.attitude, beforeAttitude + 2);
});

test("Hall of Fame boosters stay inside their own set and still guarantee exactly one Foil", () => {
  const p = createProfile("cm-punk");
  grantBooster(p, 1, "hall-of-fame-series-1");
  const pulls = openBooster(p, seededRng(4242), "hall-of-fame-series-1");
  assert.equal(pulls.length, 5);
  assert.equal(pulls.every(pull => pull.card.setId === "hall-of-fame-series-1"), true);
  assert.equal(pulls.filter(pull => pull.foil).length, 1);
});

test("Climb the Ladder branches into Golden Era, Attitude Era and full Hall of Fame runs", async () => {
  const { LADDER_BRANCHES } = await import("../js/data/ladder.js");
  const p = createProfile("cm-punk");
  const allIds = Object.values(superstars).map(s => s.id);
  const golden = startLadderRun(p, "cm-punk", allIds, seededRng(5), "golden-era");
  assert.equal(golden.setId, "hall-of-fame-series-1");
  assert.equal(golden.opponents.length, 4);
  assert.equal(golden.opponents.every(id => Object.values(superstars).find(s => s.id === id)?.era === "golden-era"), true);
  const attitude = startLadderRun(p, "cm-punk", allIds, seededRng(6), "attitude-era");
  assert.equal(attitude.opponents.length, 4);
  assert.equal(attitude.opponents.every(id => Object.values(superstars).find(s => s.id === id)?.era === "attitude-era"), true);
  const full = startLadderRun(p, "cm-punk", allIds, seededRng(7), "hall-of-fame");
  assert.equal(full.opponents.length, 8);
  assert.equal(LADDER_BRANCHES["hall-of-fame"].length, 8);
});

test("Championship Road has Golden Era and Attitude Era Hall of Fame finals", async () => {
  const { startChampionshipRoad, CHAMPIONSHIP_BRANCHES } = await import("../js/data/championship-road.js");
  const p = createProfile("cm-punk");
  const ids = Object.values(superstars).map(s => s.id);
  const golden = startChampionshipRoad(p, "cm-punk", ids, () => 0, "golden-era");
  assert.equal(golden.setId, "hall-of-fame-series-1");
  assert.equal(CHAMPIONSHIP_BRANCHES["golden-era"].finals.includes(golden.opponents.at(-1)), true);
  const attitude = startChampionshipRoad(p, "cm-punk", ids, () => 0, "attitude-era");
  assert.equal(attitude.setId, "hall-of-fame-series-1");
  assert.equal(CHAMPIONSHIP_BRANCHES["attitude-era"].finals.includes(attitude.opponents.at(-1)), true);
});

test("Miss Elizabeth triggers once when Randy Savage falls to half HP or less", () => {
  const g = new MatchEngine({ superstarA: superstars.randySavage, superstarB: superstars.hulkHogan, deckA: decks["randy-savage"], deckB: decks["hulk-hogan"], rng: () => 0 });
  const savage = g.state().players.p1;
  const elizabeth = putInHand(g, "p1", hallCards.missElizabeth);
  g.playManager("p1", elizabeth);
  savage.hp = 21;
  g.passTurn("p1");
  g.state().players.p2.momentum.attitude = 1;
  const jab = putInHand(g, "p2", hallCards.jab);
  g.declareMove("p2", jab);
  g.passCounter("p1");
  assert.equal(savage.managerAbilityUsed, true);
  assert.equal(savage.hp, 21); // 21 -> 19 from the hit, then Elizabeth recovers 2.
  assert.equal(g.state().log.filter(e => e.type === "MANAGER_ABILITY" && e.managerId === hallCards.missElizabeth.id).length, 1);
});

test("Paul Bearer triggers once after Undertaker connects a qualifying Power Move", () => {
  const g = new MatchEngine({ superstarA: superstars.undertaker, superstarB: superstars.mankind, deckA: decks["the-undertaker"], deckB: decks.mankind, rng: () => 0 });
  const taker = g.state().players.p1;
  const bearer = putInHand(g, "p1", hallCards.paulBearer);
  g.playManager("p1", bearer);
  taker.momentum.strength = 1;
  taker.momentum.attitude = 4;
  const chokeslam = putInHand(g, "p1", hallCards.takerChokeslam);
  g.declareMove("p1", chokeslam);
  g.passCounter("p2");
  assert.equal(taker.managerAbilityUsed, true);
  assert.equal(taker.momentum.attitude, 6); // +1 normal connection, +1 from Bearer.
  assert.equal(g.state().log.filter(e => e.type === "MANAGER_ABILITY" && e.managerId === hallCards.paulBearer.id).length, 1);
});

test("deck health rejects a single Manager that is not eligible for the selected Superstar", async () => {
  const { evaluateDeck } = await import("../js/data/deck-health.js");
  const illegal = [...decks["andre-the-giant"]];
  const managerIndex = illegal.findIndex(card => card.kind === "manager");
  assert.notEqual(managerIndex, -1);
  illegal[managerIndex] = hallCards.missElizabeth;
  const health = evaluateDeck(illegal, { superstarId: "andre-the-giant" });
  assert.equal(health.healthy, false);
  assert.equal(health.violations.some(v => v.includes("not eligible")), true);
});


test("mobile booster reveal has a single-card phone layout and Next Card navigation", () => {
  const css = readFileSync(new URL("../css/game.css", import.meta.url), "utf8");
  const app = readFileSync(new URL("../js/ui/app.js", import.meta.url), "utf8");
  assert.equal(css.includes(".booster-flip-card.is-current{display:block}"), true);
  assert.equal(css.includes(".booster-flip-card.is-revealed .card-back{display:none}"), true);
  assert.equal(app.includes("Next Card"), true);
  assert.equal(app.includes("nextBoosterCard"), true);
});


test("mobile Deck Assistance suggestions cannot force horizontal overflow", () => {
  const css = readFileSync(new URL("../css/game.css", import.meta.url), "utf8");
  assert.equal(css.includes(".upgrade-row b,.upgrade-row span{display:block;max-width:100%;white-space:normal;overflow-wrap:anywhere;word-break:break-word}"), true);
  assert.equal(css.includes(".upgrade-row>div:last-child{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}"), true);
  assert.equal(css.includes("@media(max-width:420px){\n  .upgrade-row>div:last-child{grid-template-columns:1fr}"), true);
});

test("mobile match screen uses compact wrestler HUDs, one play pile, player-only hand and collapsible log", () => {
  const css = readFileSync(new URL("../css/game.css", import.meta.url), "utf8");
  const app = readFileSync(new URL("../js/ui/app.js", import.meta.url), "utf8");
  assert.equal(app.includes("renderMatchHud()"), true);
  assert.equal(app.includes("renderPlayPile()"), true);
  assert.equal(app.includes("renderHumanHand()"), true);
  assert.equal(app.includes("renderMatchLog()"), true);
  assert.equal(app.includes("cpu-hand"), false);
  assert.equal(css.includes(".match-hud-grid{display:grid;grid-template-columns:1fr 1fr"), true);
  assert.equal(css.includes(".play-pile-card{width:min(240px,70vw)"), true);
  assert.equal(css.includes(".compact-log>summary"), true);
});

test("WWE Legacy splash, Champion onboarding and Main Menu are wired as the front-door flow", () => {
  const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
  const css = readFileSync(new URL("../css/game.css", import.meta.url), "utf8");
  const app = readFileSync(new URL("../js/ui/app.js", import.meta.url), "utf8");
  assert.equal(html.includes("WWE Legacy: Collectible Card Game"), true);
  assert.equal(app.includes('let screen = "splash"'), true);
  assert.equal(app.includes("function renderSplash()"), true);
  assert.equal(app.includes("function renderMainMenu()"), true);
  assert.equal(app.includes("function renderPlayMenu()"), true);
  assert.equal(app.includes("START WITH ${star.name.toUpperCase()}"), true);
  assert.equal(app.includes('screen = "menu";'), true);
  assert.equal(css.includes(".splash-screen{"), true);
  assert.equal(css.includes(".main-menu-grid{"), true);
});

test("collectible card fronts are artwork-first and flip to a shared rules back", () => {
  const css = readFileSync(new URL("../css/game.css", import.meta.url), "utf8");
  const app = readFileSync(new URL("../js/ui/app.js", import.meta.url), "utf8");
  assert.equal(app.includes("function collectibleCardMarkup"), true);
  assert.equal(app.includes("cardFrontBottom(card)"), true);
  assert.equal(app.includes("data-flip-hand"), true);
  assert.equal(app.includes("data-play-hand"), true);
  assert.equal(app.includes("data-flip-play-pile"), true);
  assert.equal(css.includes(".ccg-card-art{position:absolute;inset:0"), true);
  assert.equal(css.includes(".ccg-card-title{position:absolute"), true);
  assert.equal(css.includes(".ccg-card-stats{position:absolute"), true);
  assert.equal(css.includes(".ccg-card.is-flipped .ccg-card-inner{transform:rotateY(180deg)"), true);
});

test("card artwork can be swapped through one manifest without changing gameplay data", () => {
  const artwork = readFileSync(new URL("../js/data/artwork.js", import.meta.url), "utf8");
  const overrides = readFileSync(new URL("../js/data/card-art-overrides.js", import.meta.url), "utf8");
  const guide = readFileSync(new URL("../assets/cards/README.md", import.meta.url), "utf8");
  assert.equal(artwork.includes('import { cardArtOverrides, superstarArtOverrides }'), true);
  assert.equal(artwork.includes("if (cardArtwork[card.id]) return cardArtwork[card.id]"), true);
  assert.equal(overrides.includes("export const cardArtOverrides"), true);
  assert.equal(guide.includes("Replacing a card photo"), true);
});

test("Card Art Studio supports URL/upload crop, WebP export and manifest automation", () => {
  const html = readFileSync(new URL("../tools/card-art-studio.html", import.meta.url), "utf8");
  const css = readFileSync(new URL("../css/card-art-studio.css", import.meta.url), "utf8");
  const js = readFileSync(new URL("../js/tools/card-art-studio.js", import.meta.url), "utf8");
  const app = readFileSync(new URL("../js/ui/app.js", import.meta.url), "utf8");
  assert.equal(html.includes('id="image-url"'), true);
  assert.equal(html.includes('accept="image/*"'), true);
  assert.equal(html.includes('id="crop-canvas"'), true);
  assert.equal(html.includes('680 × 1000'), true);
  assert.equal(js.includes('"image/webp"'), true);
  assert.equal(js.includes('showDirectoryPicker'), true);
  assert.equal(js.includes('writeProjectFile("js/data/card-art-overrides.js"'), true);
  assert.equal(js.includes('assets/cards/art/custom/${state.card.id}.webp'), true);
  assert.equal(js.includes('event.clipboardData'), true);
  assert.equal(css.includes('touch-action:none'), true);
  assert.equal(app.includes('./tools/card-art-studio.html'), true);
});


test("Evolution Series 1 contains eight women and a launch-sized 172-card collection", () => {
  const evo = cardsForSet("evolution-series-1");
  const info = setCollectionFor("evolution-series-1");
  assert.equal(info.displayName, "Evolution — Series 1");
  assert.equal(evo.length, 172);
  assert.equal(evo.filter(c => c.kind === "superstar").length, 8);
  assert.equal(evo.filter(c => c.kind === "move" && !c.superstarId).length, 53);
  assert.deepEqual(evo.filter(c => c.kind === "superstar").map(c => c.superstarId), ["rhea-ripley","liv-morgan","becky-lynch","bayley","charlotte-flair","iyo-sky","paige","stephanie-vaquer"]);
});

test("Evolution named Entrances, Signatures, Trademarks and Finishers are Superstar-locked", () => {
  const evo = cardsForSet("evolution-series-1");
  const named = evo.filter(c => c.kind === "entrance" || c.signature || c.trademark || c.finisher);
  assert.ok(named.length >= 32);
  for (const card of named) assert.ok(card.superstarId, `${card.id} should be locked to its named Superstar`);
  assert.equal(evolutionCards.riptide.finisher, true);
  assert.equal(evolutionCards.oblivion.finisher, true);
  assert.equal(evolutionCards.disarmher.trademark, true);
  assert.equal(evolutionCards.bayleyToBelly.trademark, true);
  assert.equal(evolutionCards.naturalSelection.trademark, true);
  assert.equal(evolutionCards.bulletTrain.trademark, true);
  assert.equal(evolutionCards.pto.trademark, true);
  assert.equal(evolutionCards.devilsKiss.trademark, true);
});

test("Evolution shared common Moves are legal cross-roster while named Moves are restricted", async () => {
  const { legalForSuperstar } = await import("../js/data/deck-builder.js");
  assert.equal(legalForSuperstar(evolutionCards.dropkick, "rhea-ripley"), true);
  assert.equal(legalForSuperstar(evolutionCards.dropkick, "cm-punk"), true);
  assert.equal(legalForSuperstar(evolutionCards.riptide, "rhea-ripley"), true);
  assert.equal(legalForSuperstar(evolutionCards.riptide, "cm-punk"), false);
});

test("Evolution adds an eight-opponent Ladder path and four-stage Championship Road", async () => {
  const { LADDER_BRANCHES } = await import("../js/data/ladder.js");
  const { CHAMPIONSHIP_BRANCHES, startChampionshipRoad } = await import("../js/data/championship-road.js");
  const p = createProfile("cm-punk");
  const ids = Object.values(superstars).map(s => s.id);
  const ladder = startLadderRun(p, "cm-punk", ids, seededRng(88), "evolution");
  assert.equal(ladder.opponents.length, 8);
  assert.equal(ladder.opponents.every(id => Object.values(superstars).find(s => s.id === id)?.setId === "evolution-series-1"), true);
  assert.equal(LADDER_BRANCHES.evolution.length, 8);
  const road = startChampionshipRoad(p, "cm-punk", ids, seededRng(89), "evolution");
  assert.equal(road.opponents.length, 4);
  assert.equal(road.setId, "evolution-series-1");
  assert.equal(CHAMPIONSHIP_BRANCHES.evolution.finals.includes(road.opponents.at(-1)), true);
});

test("starter onboarding remains Punk or Roman after Evolution expansion", () => {
  assert.deepEqual(STARTER_CHOICES, ["cm-punk", "roman-reigns"]);
  assert.equal(Object.values(superstars).length, 25);
});

test("Season 1 roadmap runs from August 10 to Survivor Series on November 28 with 50 tiers", async () => {
  const { SEASON_1, SEASON_TIER_COUNT, XP_PER_TIER, seasonTimeRemaining } = await import("../js/data/seasons.js");
  assert.equal(SEASON_TIER_COUNT, 50);
  assert.equal(XP_PER_TIER, 100);
  assert.equal(SEASON_1.roadmap.find(n => n.id === "worlds-collide")?.date.startsWith("2026-09-26"), true);
  assert.equal(SEASON_1.roadmap.find(n => n.id === "money-in-the-bank")?.date.startsWith("2026-10-10"), true);
  assert.equal(SEASON_1.roadmap.find(n => n.id === "season-2")?.date.startsWith("2026-11-28"), true);
  const remaining = seasonTimeRemaining(new Date("2026-08-10T00:00:00"));
  assert.equal(Math.round(remaining.ms / 86400000), 110);
});

test("Season XP rewards wins, participation and unlocks claimable tier boosters", async () => {
  const { awardMatchSeasonXp, seasonTier, claimSeasonTier } = await import("../js/data/seasons.js");
  const p = createProfile("cm-punk");
  assert.equal(awardMatchSeasonXp(p, "win").awarded, 25);
  assert.equal(awardMatchSeasonXp(p, "loss").awarded, 5);
  for (let i = 0; i < 3; i += 1) awardMatchSeasonXp(p, "win");
  assert.equal(seasonTier(p), 1);
  const before = Object.values(p.boosterCreditsBySet).reduce((a,b)=>a+b,0);
  const reward = claimSeasonTier(p, 1);
  const after = Object.values(p.boosterCreditsBySet).reduce((a,b)=>a+b,0);
  assert.equal(after, before + reward.amount);
  assert.throws(() => claimSeasonTier(p, 1), /already claimed/);
});

test("Free Season booster is available immediately then returns after a rolling 24 hours", async () => {
  const { freePackStatus, claimFreeSeasonBooster } = await import("../js/data/seasons.js");
  const p = createProfile("roman-reigns");
  const start = new Date("2026-08-10T10:00:00");
  assert.equal(freePackStatus(p, start).available, true);
  const reward = claimFreeSeasonBooster(p, () => 0, start);
  assert.equal(reward.setId, "summerslam-series-1");
  assert.equal(freePackStatus(p, new Date("2026-08-11T09:59:59")).available, false);
  assert.equal(freePackStatus(p, new Date("2026-08-11T10:00:00")).available, true);
});

test("Main Menu exposes Seasons with roadmap, live free-pack countdown and 50-tier mobile road", () => {
  const css = readFileSync(new URL("../css/game.css", import.meta.url), "utf8");
  const app = readFileSync(new URL("../js/ui/app.js", import.meta.url), "utf8");
  assert.equal(app.includes('id="menu-seasons"'), true);
  assert.equal(app.includes("function renderSeasons()"), true);
  assert.equal(app.includes("data-free-pack-countdown"), true);
  assert.equal(app.includes("Season 1 Content Roadmap"), true);
  assert.equal(app.includes("50-Tier Season Road"), true);
  assert.equal(css.includes(".season-tier-road"), true);
  assert.equal(css.includes("@media(max-width:760px)"), true);
});


test("submission tap threshold falls as overall health is worn down", () => {
  const g = game();
  const defender = g.state().players.p2;
  defender.hp = defender.maxHp;
  const fresh = submissionThreshold(defender);
  defender.hp = Math.floor(defender.maxHp / 2);
  const hurt = submissionThreshold(defender);
  defender.hp = 1;
  const critical = submissionThreshold(defender);
  assert.ok(fresh > hurt, `fresh threshold ${fresh} should exceed hurt threshold ${hurt}`);
  assert.ok(hurt >= critical, `hurt threshold ${hurt} should not be below critical threshold ${critical}`);
  assert.ok(critical >= 12, "tap threshold keeps the stronger late-match resilience floor");
});

test("CPU maintains a submission when the next squeeze can force a tap even with one page left", () => {
  const g = new MatchEngine({
    superstarA: superstars.romanReigns,
    superstarB: superstars.codyRhodes,
    deckA: decks["roman-reigns"],
    deckB: decks["cody-rhodes"],
    startingControl: "p1"
  });
  const attacker = g.state().players.p1;
  const defender = g.state().players.p2;
  attacker.momentum.strength = 1;
  attacker.momentum.attitude = 6;
  defender.hp = 12;
  const hold = putInHand(g, "p1", cards.guillotine);
  g.declareMove("p1", hold);
  g.passCounter("p2");
  assert.equal(g.state().phase, "SUBMISSION_MAINTAIN");
  // Put the defender exactly one squeeze away from the current dynamic tap threshold.
  defender.submissionDamage[g.state().submission.bodyPart] = Math.max(0, submissionThreshold(defender) - g.state().submission.damage);
  attacker.hand = [structuredClone(cards.momentum.strength)];
  const decision = cpuDecision(g.state(), "p1");
  assert.equal(decision.type, "maintain");
});

test("premium UI exposes distinct mode identities and graphical submission pressure", () => {
  const app = readFileSync(new URL("../js/ui/app.js", import.meta.url), "utf8");
  const css = readFileSync(new URL("../css/game.css", import.meta.url), "utf8");
  for (const mode of ["exhibition", "ladder", "championship", "seasons", "challenges", "collection", "boosters", "decks", "profile"]) {
    assert.ok(app.includes(`modeLogoMarkup("${mode}"`), `missing ${mode} mode logo`);
  }
  assert.match(app, /hud-sub-limb/);
  assert.match(app, /SUBMISSION · TAP/);
  assert.match(css, /premium-menu-tile/);
  assert.match(css, /feature-hero/);
  assert.match(css, /premium-submission/);
});

test("premium mobile shell provides persistent primary navigation outside live matches", () => {
  const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
  const app = readFileSync(new URL("../js/ui/app.js", import.meta.url), "utf8");
  const css = readFileSync(new URL("../css/game.css", import.meta.url), "utf8");
  for (const target of ["menu", "play-menu", "collection", "boosters", "seasons"]) {
    assert.ok(html.includes(`data-mobile-nav="${target}"`), `missing ${target} mobile nav target`);
  }
  assert.match(app, /mobile-game-nav/);
  assert.match(app, /navScreens/);
  assert.match(css, /\.mobile-game-nav/);
  assert.match(css, /body\[data-screen="match"\] \.mobile-game-nav/);
});

test("European Uppercut used as a counter becomes a real counter-attack and deals its printed damage", () => {
  const g = new MatchEngine({ superstarA: superstars.rheaRipley, superstarB: superstars.beckyLynch, deckA: decks["rhea-ripley"], deckB: decks["becky-lynch"], startingControl: "p1" });
  g.state().players.p1.momentum.strike = 4;
  const incoming = putInHand(g, "p1", evolutionCards.rheaShortArmClothesline); // Mad Rush
  const uppercut = putInHand(g, "p2", evolutionCards.europeanUppercut);       // Arm Extended counters Mad Rush
  const hpBefore = g.state().players.p1.hp;

  g.declareMove("p1", incoming);
  g.counter("p2", uppercut);

  assert.equal(g.state().phase, "COUNTER");
  assert.equal(g.state().proposedMove?.card.id, evolutionCards.europeanUppercut.id);
  assert.equal(g.state().proposedMove?.attackerId, "p2");
  assert.equal(g.state().proposedMove?.defenderId, "p1");
  assert.equal(g.state().players.p1.hp, hpBefore, "damage waits until the counter-to-counter window closes");

  g.passCounter("p1");
  assert.equal(g.state().players.p1.hp, hpBefore - evolutionCards.europeanUppercut.damage);
  assert.equal(g.state().phase, "POST_MOVE");
  assert.equal(g.state().postMove?.attackerId, "p2");
});

test("Rhea receives a legal counter-to-counter window against European Uppercut", () => {
  const g = new MatchEngine({ superstarA: superstars.rheaRipley, superstarB: superstars.beckyLynch, deckA: decks["rhea-ripley"], deckB: decks["becky-lynch"], startingControl: "p1" });
  g.state().players.p1.momentum.strike = 5;
  g.state().players.p1.momentum.strength = 5;
  const clothesline = putInHand(g, "p1", evolutionCards.rheaShortArmClothesline); // Mad Rush
  const uppercut = putInHand(g, "p2", evolutionCards.europeanUppercut);           // Arm Extended
  const ripcord = putInHand(g, "p1", evolutionCards.rheaRipcordKnee);             // Leg Extended counters Arm Extended
  const beckyHpBefore = g.state().players.p2.hp;

  g.declareMove("p1", clothesline);
  g.counter("p2", uppercut);
  assert.equal(g.state().proposedMove?.defenderId, "p1", "Rhea must get the response window");

  g.counter("p1", ripcord);
  assert.equal(g.state().proposedMove?.card.id, evolutionCards.rheaRipcordKnee.id);
  assert.equal(g.state().proposedMove?.defenderId, "p2");
  g.passCounter("p2");

  assert.equal(g.state().players.p2.hp, beckyHpBefore - evolutionCards.rheaRipcordKnee.damage);
  assert.equal(g.state().log.some(e => e.type === "COUNTER_ATTACK_DECLARED" && e.cardId === evolutionCards.europeanUppercut.id), true);
  assert.equal(g.state().log.some(e => e.type === "COUNTER_ATTACK_DECLARED" && e.cardId === evolutionCards.rheaRipcordKnee.id), true);
});

test("every collectible offensive Move with a counter relationship opens a counter-attack response window", () => {
  const qualifying = collectionCards.filter(card =>
    card.kind === "move" && !card.defensiveOnly && (card.counters?.length ?? 0) > 0 &&
    ((card.damage ?? 0) > 0 || !!card.submission || (card.onConnect?.length ?? 0) > 0)
  );
  assert.ok(qualifying.length > 100, "expected the rule to cover the full offensive Move pool, not a hand-written shortlist");

  for (const counterCard of qualifying) {
    const g = game();
    const targetType = counterCard.counters[0];
    const incoming = { id: `test-incoming-${counterCard.id}`, name: "Test Incoming Move", kind: "move", method: "strike", moveType: targetType, damage: 1 };
    g.state().players.p1.hand.unshift(structuredClone(incoming));
    g.state().players.p2.hand.unshift(structuredClone(counterCard));
    g.state().proposedMove = { attackerId: "p1", defenderId: "p2", card: structuredClone(incoming), damageBonus: 0 };
    g.state().phase = "COUNTER";
    g.state().playerInControl = "p1";

    g.counter("p2", g.state().players.p2.hand[0]);
    assert.equal(g.state().phase, "COUNTER", `${counterCard.id} should create a response window`);
    assert.equal(g.state().proposedMove?.card.id, counterCard.id, `${counterCard.id} should become the proposed counter-attack`);
    assert.equal(g.state().proposedMove?.attackerId, "p2", `${counterCard.id} should attack back`);
    assert.equal(g.state().proposedMove?.defenderId, "p1", `${counterCard.id} should be counterable by the original attacker`);
  }
});

test("Turn 50 is playable and attempting to advance beyond it produces a time-limit draw", () => {
  const g = game();
  g.state().turnNumber = 50;
  const controller = g.state().playerInControl;
  g.passTurn(controller);
  assert.equal(g.state().phase, "MATCH_OVER");
  assert.equal(g.state().winner, null);
  assert.equal(g.state().finish.type, "time-limit-draw");
  assert.equal(g.state().turnNumber, 50);
});

test("recommended starter decks contain no ringside-only Moves", () => {
  for (const [superstarId, deck] of Object.entries(decks)) {
    const offenders = deck.filter(card => card.kind === "move" && card.requiresLocation === "ringside");
    assert.deepEqual(offenders.map(card => card.id), [], `${superstarId} starter contains ringside-only Moves`);
  }
});

test("a wrestler at 0 HP loses retained Control through Critical Exhaustion after completing offense", () => {
  const g = game();
  const p1 = g.state().players.p1;
  p1.hp = 0;
  p1.momentum.strike = 1;
  const jab = putInHand(g, "p1", cards.jab);
  g.declareMove("p1", jab);
  g.passCounter("p2");
  assert.equal(g.state().phase, "POST_MOVE");
  g.endPostMove("p1");
  assert.equal(g.state().playerInControl, "p2");
  assert.equal(g.state().phase, "ACTION");
  assert.equal(g.state().log.some(e => e.type === "CRITICAL_EXHAUSTION" && e.playerId === "p1"), true);
});

test("CPU never voluntarily releases a Finisher submission while it has a page to ditch", () => {
  const g = new MatchEngine({
    superstarA: superstars.charlotteFlair,
    superstarB: superstars.rheaRipley,
    deckA: decks["charlotte-flair"],
    deckB: decks["rhea-ripley"],
    startingControl: "p1"
  });
  const attacker = g.state().players.p1;
  const defender = g.state().players.p2;
  attacker.momentum.technical = 7;
  attacker.momentum.attitude = 7;
  defender.posture = "on-mat";
  const hold = putInHand(g, "p1", evolutionCards.figureEight);
  g.declareMove("p1", hold);
  g.passCounter("p2");
  assert.equal(g.state().phase, "SUBMISSION_MAINTAIN");
  attacker.hand = [structuredClone(cards.momentum.strength)];
  const decision = cpuDecision(g.state(), "p1");
  assert.equal(decision.type, "maintain");
  assert.equal(decision.card.id, cards.momentum.strength.id);
});

test("all 24 Superstars can play Momentum then an immediate Lead Off Move on first Control", () => {
  const roster = Object.values(superstars);
  for (let i = 0; i < roster.length; i += 1) {
    const star = roster[i];
    const opponent = roster[(i + 1) % roster.length];
    const g = new MatchEngine({ superstarA: star, superstarB: opponent, deckA: decks[star.id], deckB: decks[opponent.id], startingControl: "p1", rng: () => 0.5 });
    assert.equal(g.state().players.p1.hand.length, 5, star.id);
    assert.deepEqual(g.state().players.p1.hand.map(c => c.id), star.leadOffIds, star.id);
    const first = cpuDecision(g.state(), "p1");
    assert.equal(first.type, "momentum", `${star.id} should open with Momentum`);
    executeCpuDecision(g, "p1");
    const second = cpuDecision(g.state(), "p1");
    assert.equal(second.type, "move", `${star.id} should have an immediate legal Lead Off Move after Momentum`);
  }
});

test("attached Entrances never count toward the 55 playable deck pages", () => {
  for (const star of Object.values(superstars)) {
    assert.equal(decks[star.id].length, 55, star.id);
    assert.equal(decks[star.id].some(card => card.kind === "entrance"), false, star.id);
    assert.equal(star.leadOffIds.length, 5, star.id);
    assert.equal(star.leadOffIds.some(id => id === star.entranceId), false, star.id);
  }
});


test("unlocking a new Superstar grants only the essential identity package and builds from real ownership", async () => {
  const { buildBestOwnedDeck } = await import("../js/data/profile.js");
  const p = createProfile("cm-punk");
  // Simulate having already collected a couple of Cody cards from boosters.
  addOwnedCard(p, cards.disasterKick.id, { amount: 1 });
  addOwnedCard(p, cards.codyCutter.id, { amount: 1 });
  const beforeDisaster = ownedCount(p, cards.disasterKick.id, "normal");
  unlockSuperstar(p, "cody-rhodes");

  assert.equal(ownedCount(p, "superstar-cody-rhodes", "normal") + ownedCount(p, "superstar-cody-rhodes", "foil"), 1);
  assert.equal(ownedCount(p, superstars.codyRhodes.entranceId, "normal") + ownedCount(p, superstars.codyRhodes.entranceId, "foil"), 1);
  assert.equal(ownedCount(p, cards.disasterKick.id, "normal"), beforeDisaster, "existing booster ownership is preserved, not replaced");

  const leadCounts = new Map();
  for (const id of superstars.codyRhodes.leadOffIds) leadCounts.set(id, (leadCounts.get(id) ?? 0) + 1);
  for (const [id, count] of leadCounts) {
    assert.equal(ownedCount(p, id, "normal") + ownedCount(p, id, "foil") >= count, true, `Lead Off ownership: ${id}`);
  }

  const signatureIds = [...new Set(decks["cody-rhodes"].filter(c => c.finisher || c.trademark).map(c => c.id))];
  assert.equal(signatureIds.length > 0, true);
  for (const id of signatureIds) assert.equal(ownedCount(p, id, "normal") + ownedCount(p, id, "foil") >= 1, true, `signature ownership: ${id}`);

  // A full recommended deck is NOT silently granted.
  const recommendedCounts = new Map();
  for (const card of decks["cody-rhodes"]) recommendedCounts.set(card.id, (recommendedCounts.get(card.id) ?? 0) + 1);
  assert.equal([...recommendedCounts].some(([id, count]) => (ownedCount(p, id, "normal") + ownedCount(p, id, "foil")) < count), true);

  const built = buildBestOwnedDeck(p, "cody-rhodes");
  assert.deepEqual(built.slice(0, 5).map(e => e.id), superstars.codyRhodes.leadOffIds);
  for (const [id] of new Set(built.map(e => e.id)).entries()) {
    const used = built.filter(e => e.id === id).length;
    const owned = ownedCount(p, id, "normal") + ownedCount(p, id, "foil");
    assert.equal(used <= owned, true, `${id}: used ${used}, owned ${owned}`);
  }
});

test("unlock package does not award extra copies of Finishers or Trademarks already owned", () => {
  const p = createProfile("cm-punk");
  const signatures = [...new Set(decks["rhea-ripley"].filter(c => c.finisher || c.trademark).map(c => c.id))];
  for (const id of signatures) addOwnedCard(p, id, { amount: 1 });
  const before = Object.fromEntries(signatures.map(id => [id, ownedCount(p, id, "normal") + ownedCount(p, id, "foil")]));
  unlockSuperstar(p, "rhea-ripley");
  for (const id of signatures) assert.equal(ownedCount(p, id, "normal") + ownedCount(p, id, "foil"), before[id]);
});


test("Superstar and Entrance cards are intrinsically Foil while Entrances are never booster eligible", async () => {
  const { boosterEligible } = await import("../js/data/boosters.js");
  const p = createProfile("roman-reigns");
  assert.deepEqual(p.ownedCards["superstar-roman-reigns"], { normal: 0, foil: 1 });
  assert.deepEqual(p.ownedCards[superstars.romanReigns.entranceId], { normal: 0, foil: 1 });
  for (const entrance of collectionCards.filter(c => c.kind === "entrance")) {
    assert.equal(boosterEligible(p, entrance, false, entrance.setId), false);
    assert.equal(boosterEligible(p, entrance, true, entrance.setId), false);
  }
});

test("Season 1 Tier 50 is The Rock full-deck completion exclusive instead of boosters", async () => {
  const { tierReward, claimSeasonTier, awardSeasonXp, MAX_SEASON_XP } = await import("../js/data/seasons.js");
  const p = createProfile("cm-punk");
  const reward = tierReward(50);
  assert.equal(reward.kind, "full-deck-superstar");
  assert.equal(reward.superstarId, "the-rock");
  awardSeasonXp(p, MAX_SEASON_XP);
  const claimed = claimSeasonTier(p, 50);
  assert.equal(claimed.superstarId, "the-rock");
  assert.equal(p.seasons["season-1"].completionRewardClaimed, true);
  assert.equal(p.seasons["season-1"].completionSuperstarId, "the-rock");
});

test("unlocking queues a sequential celebration containing Superstar, Entrance, Lead Off and signatures", () => {
  const p = createProfile("cm-punk");
  unlockSuperstar(p, "cody-rhodes");
  const event = p.pendingUnlockCelebrations.at(-1);
  assert.equal(event.superstarId, "cody-rhodes");
  assert.equal(event.cardIds[0], "superstar-cody-rhodes");
  assert.equal(event.cardIds.includes(superstars.codyRhodes.entranceId), true);
  for (const id of superstars.codyRhodes.leadOffIds) assert.equal(event.cardIds.includes(id), true);
  for (const card of decks["cody-rhodes"].filter(c => c.finisher || c.trademark)) assert.equal(event.cardIds.includes(card.id), true);
});


test("Season 1 Tier 50 Final Boss Rock is a distinct 55-card season-exclusive persona", async () => {
  const { rockCards } = await import("../js/data/season1-rock-cards.js");
  const rock = superstars.theRock;
  assert.equal(rock.nickname, "The Final Boss");
  assert.equal(rock.era, "final-boss");
  assert.equal(rock.seasonExclusive, true);
  assert.equal(decks["the-rock"].length, 55);
  assert.deepEqual(decks["the-rock"].slice(0,5).map(c=>c.id), rock.leadOffIds);
  assert.equal(rock.signatures.includes(rockCards.rockBottomFinalBoss.id), true);
  assert.equal(rock.signatures.includes(rockCards.peoplesElbowFinalBoss.id), true);
  assert.equal(rock.signatures.includes(rockCards.finalBossSpinebuster.id), true);
  assert.equal(rock.signatures.includes(rockCards.finalBossSharpshooter.id), true);
});

test("claiming Season 1 Tier 50 awards Final Boss Rock and his complete owned deck", async () => {
  const { claimSeasonTier, MAX_SEASON_XP } = await import("../js/data/seasons.js");
  const p = createProfile("cm-punk");
  p.seasons["season-1"].xp = MAX_SEASON_XP;
  const reward = claimSeasonTier(p, 50);
  assert.equal(reward.superstarId, "the-rock");
  assert.equal(hasSuperstar(p, "the-rock"), true);
  assert.equal(p.savedDecks["the-rock"].length, 55);
  assert.equal(p.deckNeedsCards["the-rock"], 0);
  for (const entry of p.savedDecks["the-rock"]) {
    const used = p.savedDecks["the-rock"].filter(e => e.id === entry.id).length;
    const owned = ownedCount(p, entry.id, "normal") + ownedCount(p, entry.id, "foil");
    assert.equal(used <= owned, true, `${entry.id}: full Season reward must be genuinely owned`);
  }
  assert.equal(ownedCount(p, "superstar-the-rock", "foil"), 1);
  assert.equal(ownedCount(p, superstars.theRock.entranceId, "foil"), 1);
});
