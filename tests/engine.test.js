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
import { moveEligibility, counterEligibility, canAttemptPin, canPlayPinEscape, canReturnToRing, effectiveTotalMomentum, submissionThreshold } from "../js/engine/rules.js";
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
  p.momentum.attitude = 6;
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
  assert.equal(collectionCards.length, 387);
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
  p.momentum.attitude = 5;
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
  p.momentum.attitude = 5;
  g.state().players.p2.posture = "on-mat";
  const sub = putInHand(g, "p1", cards.anacondaVise);
  g.declareMove("p1", sub);
  g.passCounter("p2");
  g.releaseSubmission("p1");
  assert.equal(g.state().playerInControl, "p1");
  assert.equal(g.state().submission, null);
});

test("all 25 linked Entrances resolve automatically pre-match outside the five-card Lead Off hand", () => {
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

test("Undertaker's Deadman Walking survives a lethal Move once and triggers the comeback", () => {
  const g = new MatchEngine({ superstarA: superstars.codyRhodes, superstarB: superstars.undertaker, deckA: decks["cody-rhodes"], deckB: decks["the-undertaker"] });
  const cody = g.state().players.p1;
  const taker = g.state().players.p2;
  cody.momentum.strike = 1;
  const beforeAttitude = taker.momentum.attitude;
  const beforeHand = taker.hand.length;
  const lethal = putInHand(g, "p1", { ...cards.jab, id: "deadman-lethal-test", damage: taker.hp + 20 });
  g.declareMove("p1", lethal); g.passCounter("p2");
  assert.equal(taker.hp, 1);
  assert.equal(taker.passiveFlags.surviveAtOneUsed, true);
  assert.equal(taker.momentum.attitude, beforeAttitude + 1); // +2 comeback, then the connected Move removes 1 Attitude
  assert.equal(taker.hand.length, beforeHand + 1);
  assert.equal(g.state().log.some(e => e.type === "SUPERSTAR_PASSIVE" && e.playerId === "p2" && e.effect === "SURVIVE_AT_ONE"), true);
});

test("Kane's Big Red Machine rewards his first two 8+ damage connections", () => {
  const g = new MatchEngine({ superstarA: superstars.kane, superstarB: superstars.codyRhodes, deckA: decks["kane"], deckB: decks["cody-rhodes"] });
  const kane = g.state().players.p1;
  kane.momentum.strike = 1;
  const beforeAttitude = kane.momentum.attitude;
  const heavy = putInHand(g, "p1", { ...hallCards.jab, id: "kane-heavy-test", superstarId: "kane", requirements: { strike: 1 }, damage: 8, setOpponentPosture: "on-mat" });
  const beforeHand = kane.hand.length;
  g.declareMove("p1", heavy); g.passCounter("p2");
  assert.equal(kane.abilityUses, 1);
  assert.equal(kane.momentum.attitude, beforeAttitude + 2); // universal connection + Superstar ability
  assert.equal(kane.hand.length, beforeHand); // played one, ability drew one
  assert.equal(kane.specialFlags.kaneStrikeBonus, true);
  assert.equal(g.state().log.some(e => e.type === "SUPERSTAR_ABILITY" && e.playerId === "p1" && e.abilityId === "big-red-machine"), true);
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
  cody.momentum.attitude = 6;
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
  punk.momentum.attitude = 5;
  cody.hp = 12;
  cody.posture = "on-mat";
  const sub = putInHand(g, "p1", cards.anacondaVise);
  g.declareMove("p1", sub);
  g.passCounter("p2");
  const initialPressure = cards.anacondaVise.submission.damage;
  assert.equal(cody.submissionDamage.head, initialPressure);
  assert.equal(g.state().phase, "SUBMISSION_MAINTAIN");
  let squeezes = 0;
  while (g.state().phase === "SUBMISSION_MAINTAIN" && squeezes < 10) {
    const ditch = punk.hand[0];
    g.maintainSubmission("p1", ditch);
    squeezes += 1;
  }
  assert.ok(cody.submissionDamage.head >= initialPressure * 2);
  assert.equal(g.state().phase, "MATCH_OVER");
  assert.equal(g.state().winner, "p1");
  assert.equal(g.state().finish.type, "submission");
});

function seededRng(seed) {
  let x = seed >>> 0;
  return () => ((x = (1664525 * x + 1013904223) >>> 0) / 4294967296);
}

test("all 25 strategy decks contain exactly 55 pages with fixed five-card openings", () => {
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
  assert.equal(defender.hp, hpBefore - Math.max(0, cards.jab.damage - 1));
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
  cody.momentum.agility = 2; cody.momentum.attitude = 5;
  const cutter = putInHand(codyGame, "p1", cards.codyCutter);
  assert.equal(moveEligibility(codyGame.state(), "p1", cutter).legal, true);
});

test("on-mat remains the only positional prerequisite for grounded attacks", () => {
  const g = new MatchEngine({ superstarA: superstars.cmPunk, superstarB: superstars.codyRhodes, deckA: decks["cm-punk"], deckB: decks["cody-rhodes"] });
  const punk = g.state().players.p1;
  punk.momentum.agility = 2; punk.momentum.technical = 1; punk.momentum.attitude = 4;
  const elbow = putInHand(g, "p1", cards.divingElbowDrop);
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


test("SummerSlam Series 1 matches the audited active card pool", () => {
  const summer = cardsForSet("summerslam-series-1");
  assert.equal(summer.length, 152);
  assert.equal(summer.filter(card => card.kind === "move").length, 118);
  assert.equal(summer.filter(card => card.kind === "superstar").length, 8);
});

test("SummerSlam fundamentals cover the core shared wrestling vocabulary and exclusive punches remain better family members", () => {
  const summer = cardsForSet("summerslam-series-1");
  const fundamentals = ["punch","front-kick","basic-stomp","hip-toss","elbow-drop","knee-drop","leg-drop","vertical-suplex","russian-leg-sweep","bulldog","sleeper-common","irish-whip","knife-edge-chop-common","drop-toe-hold","firemans-carry","schoolboy","small-package"];
  for (const id of fundamentals) assert.ok(summer.some(card => card.id === id), `${id} should be active in SummerSlam`);
  assert.equal(cards.punch.moveFamily, "punch");
  assert.equal(hallCards.jab.moveFamily, "punch");
  assert.equal(cards.punch.cost, 2);
  assert.equal(cards.punch.damage, 4);
  assert.equal(cards.codyDropDownPunch.moveFamily, "punch");
  assert.ok(cards.codyDropDownPunch.onConnect?.length, "Cody's punch should be better than the shared baseline via card advantage");
  assert.equal(cards.supermanPunch.moveFamily, "punch");
  assert.ok(cards.supermanPunch.damage > cards.punch.damage);
  assert.equal(cards.elbowDrop.moveType, "standing-above");
  assert.equal(cards.kneeDrop.moveType, "standing-above");
  assert.equal(cards.schoolboy.pinBonus, 5);
  assert.equal(cards.smallPackage.pinBonus, 7);
});

test("all 25 recommended decks respect the five-copy per-card cap", () => {
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

test("all 25 recommended decks satisfy shared deck-health floors", async () => {
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
  assert.deepEqual(RECOMMENDED_DECK_SHAPE.lowCostMoves, { min: 10, target: 16, max: 26 });
  assert.deepEqual(RECOMMENDED_DECK_SHAPE.midCostMoves, { min: 5, target: 12, max: 20 });
  assert.deepEqual(RECOMMENDED_DECK_SHAPE.counters, { min: 12, target: 30, max: 42 });
  assert.deepEqual(RECOMMENDED_DECK_SHAPE.momentum, { min: 10, target: 12, max: 16 });
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


test("all 25 Superstar mirror matches can complete without AI stalls", () => {
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


test("Hall of Fame Series 1 contains the audited active pool, eight legends, two eras and three Managers", () => {
  const hall = cardsForSet("hall-of-fame-series-1");
  const info = setCollectionFor("hall-of-fame-series-1");
  assert.equal(info.displayName, "Hall of Fame — Series 1");
  assert.equal(hall.length, 104);
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
  assert.equal(hall.some(card => card.cardCode === "HOF1-092"), false);
  assert.equal(hall.some(card => card.cardCode === "HOF1-100"), false);
  assert.equal(hall.find(card => card.id === "hof1-flying-shoulder-reviewed")?.cardCode, "HOF1-101");
  assert.equal(hall.find(card => card.id === "hof1-tilt-whirl-reviewed")?.cardCode, "HOF1-106");
  for (const card of hall) {
    assert.equal(card.setId, "hall-of-fame-series-1");
    assert.equal(card.rarity >= 1 && card.rarity <= 4, true);
  }
});

test("Double Sledge is consolidated into shared Double Axe Handle without changing Warrior's deck structure", () => {
  const hall = cardsForSet("hall-of-fame-series-1");
  const warrior = decks["ultimate-warrior"];
  assert.equal(hall.some(card => card.id === "hof1-double-sledge-reviewed"), false);
  assert.equal("doubleSledgeReviewed" in hallCards, false);
  assert.equal(warrior.filter(card => card.id === hallCards.axeHandle.id).length, 2);
  assert.equal(hallCards.axeHandle.name, "Double Axe Handle");
  assert.equal(hallCards.savageDoubleAxeReviewed.name, "Diving Double Axe Handle");
});

test("Hall of Fame duplicate Spinebuster is consolidated into the canonical SummerSlam card", () => {
  const hall = cardsForSet("hall-of-fame-series-1");
  const stoneCold = decks["stone-cold-steve-austin"];
  assert.equal("spinebuster" in hallCards, false);
  assert.equal(hall.some(card => card.id === "hof1-spinebuster"), false);
  assert.equal(hall.some(card => card.cardCode === "HOF1-092"), false);
  assert.equal(stoneCold.filter(card => card.id === cards.spinebuster.id).length, 2);
  assert.equal(cards.spinebuster.name, "Spinebuster");
  assert.equal(cards.spinebuster.cost, 4);
  assert.equal(cards.spinebuster.damage, 7);
  assert.deepEqual(cards.spinebuster.requirements, { strength: 1 });
  assert.equal(cards.spinebuster.onConnect?.some(effect => effect.type === "loseMomentum" && effect.method === "attitude" && effect.amount === 1), true);
});

test("Managers are unique, Superstar-restricted and only one may be included in a deck", async () => {
  const { ownershipCapFor } = await import("../js/data/card-limits.js");
  const { evaluateDeck } = await import("../js/data/deck-health.js");
  assert.equal(ownershipCapFor(hallCards.bobbyHeenan), 1);
  assert.deepEqual(hallCards.bobbyHeenan.allowedSuperstarIds, ["andre-the-giant"]);
  assert.deepEqual(hallCards.missElizabeth.allowedSuperstarIds, ["randy-savage"]);
  assert.deepEqual(hallCards.paulBearer.allowedSuperstarIds, ["the-undertaker"]);
  const illegal = [...decks["andre-the-giant"]];
  illegal[5] = hallCards.missElizabeth;
  illegal[6] = hallCards.bobbyHeenan;
  const health = evaluateDeck(illegal, { superstarId: "andre-the-giant" });
  assert.equal(health.healthy, false);
  assert.equal(health.violations.some(v => v.includes("at most one Manager")), true);
});

test("Bobby Heenan recovers Andre's first important Move that gets Countered", () => {
  const g = new MatchEngine({ superstarA: superstars.andreTheGiant, superstarB: superstars.hulkHogan, deckA: decks["andre-the-giant"], deckB: decks["hulk-hogan"], rng: () => 0 });
  const andre = g.state().players.p1;
  g.playManager("p1", putInHand(g, "p1", hallCards.bobbyHeenan));
  andre.momentum.strike = 1;
  andre.momentum.attitude = 6;
  const important = putInHand(g, "p1", { ...hallCards.andreHeadbuttReviewed, id: "heenan-important-test", cost: 7 });
  const counter = putInHand(g, "p2", cards.desperationCounter);
  g.declareMove("p1", important);
  g.counter("p2", counter);
  assert.equal(andre.managerAbilityUsed, true);
  assert.equal(andre.hand.some(c => c.id === important.id), true);
  assert.equal(andre.discard.some(c => c.id === important.id), false);
  assert.equal(g.state().log.filter(e => e.type === "MANAGER_ABILITY" && e.managerId === hallCards.bobbyHeenan.id && e.trigger === "COUNTERED_MOVE_RECOVERY").length, 1);
});

test("a Manager cannot be played for an unrelated Superstar", () => {
  const g = new MatchEngine({ superstarA: superstars.hulkHogan, superstarB: superstars.andreTheGiant, deckA: decks["hulk-hogan"], deckB: decks["andre-the-giant"] });
  const heenan = putInHand(g, "p1", hallCards.bobbyHeenan);
  assert.throws(() => g.playManager("p1", heenan), /Illegal Manager/);
});

test("Stone Cold's reviewed Kick to the Gut searches the Playbook for the reviewed Stone Cold Stunner", () => {
  const g = new MatchEngine({ superstarA: superstars.stoneCold, superstarB: superstars.mankind, deckA: decks["stone-cold-steve-austin"], deckB: decks.mankind, rng: () => 0.4 });
  const austin = g.state().players.p1;
  austin.momentum.strike = 2;
  austin.momentum.attitude = 4;
  const kick = austin.hand.find(c => c.id === hallCards.austinKickReviewed.id) ?? putInHand(g, "p1", hallCards.austinKickReviewed);
  assert.equal(austin.hand.some(c => c.id === hallCards.austinStunnerReviewed.id), false);
  assert.equal(austin.deck.some(c => c.id === hallCards.austinStunnerReviewed.id), true);
  g.declareMove("p1", kick);
  g.passCounter("p2");
  assert.equal(austin.hand.some(c => c.id === hallCards.austinStunnerReviewed.id), true);
  assert.equal(g.state().log.some(e => e.type === "CARD_SEARCHED" && e.playerId === "p1" && e.cardId === hallCards.austinStunnerReviewed.id), true);
});

test("active shared Move secondary effects can draw, discard and add extra Attitude", () => {
  const g = new MatchEngine({ superstarA: superstars.brockLesnar, superstarB: superstars.cmPunk, deckA: decks["brock-lesnar"], deckB: decks["cm-punk"], rng: () => 0 });
  const cody = g.state().players.p1;
  const punk = g.state().players.p2;

  // Draw effect.
  cody.momentum.technical = 1; cody.momentum.attitude = 1;
  const drawMove = putInHand(g, "p1", cards.armDrag);
  const handBeforeDraw = cody.hand.length;
  g.declareMove("p1", drawMove);
  g.passCounter("p2");
  assert.equal(cody.hand.length, handBeforeDraw); // played one, then drew one
  assert.equal(g.state().log.some(e => e.type === "CARDS_DRAWN" && e.playerId === "p1"), true);

  // Discard effect.
  g.endPostMove("p1");
  cody.momentum.technical = 1; cody.momentum.attitude = 1;
  const punkHandBefore = punk.hand.length;
  const discardMove = putInHand(g, "p1", cards.snapmare);
  g.declareMove("p1", discardMove);
  g.passCounter("p2");
  assert.equal(punk.hand.length, punkHandBefore - 1);
  assert.equal(g.state().log.some(e => e.type === "CARDS_DISCARDED" && e.playerId === "p2"), true);

  // Extra Attitude effect beyond the universal +1 on a connected Move.
  g.endPostMove("p1");
  cody.momentum.strike = 1; cody.momentum.attitude = 1;
  const attitudeMove = putInHand(g, "p1", cards.runningForearm);
  const beforeAttitude = cody.momentum.attitude;
  g.declareMove("p1", attitudeMove);
  g.passCounter("p2");
  assert.equal(cody.momentum.attitude, beforeAttitude + 2);
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

test("Miss Elizabeth triggers once below half HP: draw 2, then bottom 1", () => {
  const g = new MatchEngine({ superstarA: superstars.randySavage, superstarB: superstars.hulkHogan, deckA: decks["randy-savage"], deckB: decks["hulk-hogan"], rng: () => 0 });
  const savage = g.state().players.p1;
  g.playManager("p1", putInHand(g, "p1", hallCards.missElizabeth));
  savage.hp = 21;
  g.passTurn("p1");
  g.state().players.p2.momentum.attitude = 1;
  const beforeHand = savage.hand.length;
  const beforeHp = savage.hp;
  const jab = putInHand(g, "p2", hallCards.jab);
  g.declareMove("p2", jab);
  g.passCounter("p1");
  assert.equal(savage.managerAbilityUsed, true);
  assert.equal(savage.hp, beforeHp - hallCards.jab.damage);
  assert.equal(savage.hand.length, beforeHand + 1);
  assert.equal(g.state().log.some(e => e.type === "MANAGER_BOTTOMED_PAGE" && e.managerId === hallCards.missElizabeth.id), true);
  assert.equal(g.state().log.filter(e => e.type === "MANAGER_ABILITY" && e.managerId === hallCards.missElizabeth.id).length, 1);
});

test("Paul Bearer triggers once below half HP and grants Urn momentum when no card can be recovered", () => {
  const g = new MatchEngine({ superstarA: superstars.undertaker, superstarB: superstars.mankind, deckA: decks["the-undertaker"], deckB: decks.mankind, rng: () => 0 });
  const taker = g.state().players.p1;
  g.playManager("p1", putInHand(g, "p1", hallCards.paulBearer));
  taker.hp = 38;
  taker.discard = [];
  const strengthBefore = taker.momentum.strength;
  const attitudeBefore = taker.momentum.attitude;
  g.passTurn("p1");
  g.state().players.p2.momentum.attitude = 1;
  g.declareMove("p2", putInHand(g, "p2", hallCards.jab));
  g.passCounter("p1");
  assert.equal(taker.hp <= taker.maxHp * 0.5, true);
  assert.equal(taker.managerAbilityUsed, true);
  assert.equal(taker.momentum.strength, strengthBefore + 1);
  assert.equal(taker.momentum.attitude, attitudeBefore); // Bearer +1 offsets the connected Move’s universal -1
  assert.equal(g.state().log.some(e => e.type === "MOMENTUM_EFFECT" && e.playerId === "p1" && e.sourceCardId === hallCards.paulBearer.id && e.method === "attitude" && e.amount === 1), true);
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
  assert.equal(artwork.includes("if (cardArtwork[card.id]) return assetUrl(cardArtwork[card.id])"), true);
  assert.equal(overrides.includes("export const cardArtOverrides"), true);
  assert.equal(guide.includes("Replacing a card photo"), true);
});

test("unified Card Art Studio exports finished set-branded fronts without manifest edits", () => {
  const html = readFileSync(new URL("../tools/card-art-studio.html", import.meta.url), "utf8");
  const css = readFileSync(new URL("../css/card-art-studio.css", import.meta.url), "utf8");
  const js = readFileSync(new URL("../js/tools/card-art-studio.js", import.meta.url), "utf8");
  const app = readFileSync(new URL("../js/ui/app.js", import.meta.url), "utf8");
  assert.equal(html.includes('CARD ART STUDIO'), true);
  assert.equal(html.includes('id="art-file"'), true);
  assert.equal(html.includes('id="type-select"'), true);
  assert.equal(html.includes('accept="image/*"'), true);
  assert.equal(html.includes('id="card-canvas"'), true);
  assert.equal(html.includes('680 × 1000'), true);
  assert.equal(html.includes('Export Card WebP'), true);
  assert.equal(js.includes('"image/webp"'), true);
  assert.equal(js.includes('EMBEDDED_SET_LOGOS'), true);
  assert.equal(js.includes('KIND_FOLDERS'), true);
  assert.equal(js.includes('readAsDataURL'), true);
  assert.equal(js.includes('drawBottomIdentity'), true);
  assert.equal(css.includes('touch-action:none'), true);
  assert.equal(app.includes('./tools/card-art-studio.html'), true);
  assert.equal(app.includes('Card Art Studio'), true);
  assert.equal(app.includes('Superstar Art Studio'), false);
});


test("Evolution Series 1 contains the audited active pool and eight women", () => {
  const evo = cardsForSet("evolution-series-1");
  const info = setCollectionFor("evolution-series-1");
  assert.equal(info.displayName, "Evolution — Series 1");
  assert.equal(evo.length, 110);
  assert.equal(evo.filter(c => c.kind === "move").length, 78);
  assert.equal(evo.filter(c => c.kind === "superstar").length, 8);
  assert.deepEqual(evo.filter(c => c.kind === "superstar").map(c => c.superstarId), ["rhea-ripley","liv-morgan","becky-lynch","bayley","charlotte-flair","iyo-sky","paige","stephanie-vaquer"]);
});

test("Evolution linked Entrances and every active Superstar signature are locked to the correct wrestler", () => {
  const evo = cardsForSet("evolution-series-1");
  const evoStars = Object.values(superstars).filter(star => star.setId === "evolution-series-1");
  for (const star of evoStars) {
    const entrance = evo.find(card => card.id === star.entranceId);
    assert.ok(entrance, `${star.id}: linked Entrance must remain active`);
    assert.equal(entrance.superstarId, star.id, `${entrance.id} should be locked to ${star.id}`);
    for (const signatureId of star.signatures) {
      const signature = evo.find(card => card.id === signatureId);
      assert.ok(signature, `${star.id}: active signature ${signatureId} missing from Evolution pool`);
      assert.equal(signature.superstarId, star.id, `${signatureId} should be locked to ${star.id}`);
    }
  }
  for (const card of evo.filter(c => c.kind === "entrance" || c.signature || c.trademark || c.finisher)) {
    assert.ok(card.superstarId, `${card.id} should be Superstar-locked`);
  }
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

test("Main Menu exposes the Season 1 hub through its LED countdown and 50-tier road", () => {
  const css = readFileSync(new URL("../css/game.css", import.meta.url), "utf8");
  const app = readFileSync(new URL("../js/ui/app.js", import.meta.url), "utf8");
  assert.equal(app.includes('id="menu-season-countdown"'), true);
  assert.equal(app.includes('data-season-countdown'), true);
  assert.equal(app.includes('$("#menu-season-countdown")?.addEventListener("click", showSeasons)'), true);
  assert.equal(app.includes("function renderSeasons()"), true);
  assert.equal(app.includes("Season 1 Content Roadmap"), true);
  assert.equal(app.includes("50-Tier Season Road"), true);
  assert.equal(css.includes(".season-led-strip"), true);
  assert.equal(css.includes(".season-tier-road"), true);
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
  attacker.momentum.technical = 1;
  attacker.momentum.attitude = 6;
  defender.hp = 12;
  defender.posture = "on-mat";
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
  assert.match(app, /SUB \$\{submissionThreshold\(p\)\}/);
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
  g.state().players.p2.momentum.strike = 1;
  g.state().players.p2.momentum.attitude = 1;
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
  g.state().players.p1.momentum.agility = 1;
  g.state().players.p2.momentum.strike = 1;
  g.state().players.p2.momentum.attitude = 1;
  const clothesline = putInHand(g, "p1", evolutionCards.rheaShortArmClothesline); // Mad Rush
  const uppercut = putInHand(g, "p2", evolutionCards.europeanUppercut);           // Arm Extended
  const ripcord = putInHand(g, "p1", evolutionCards.enzuigiri);                    // Leg Extended counters Arm Extended
  const beckyHpBefore = g.state().players.p2.hp;

  g.declareMove("p1", clothesline);
  g.counter("p2", uppercut);
  assert.equal(g.state().proposedMove?.defenderId, "p1", "Rhea must get the response window");

  g.counter("p1", ripcord);
  assert.equal(g.state().proposedMove?.card.id, evolutionCards.enzuigiri.id);
  assert.equal(g.state().proposedMove?.defenderId, "p2");
  g.passCounter("p2");

  assert.equal(g.state().players.p2.hp, beckyHpBefore - evolutionCards.enzuigiri.damage);
  assert.equal(g.state().log.some(e => e.type === "COUNTER_ATTACK_DECLARED" && e.cardId === evolutionCards.europeanUppercut.id), true);
  assert.equal(g.state().log.some(e => e.type === "COUNTER_ATTACK_DECLARED" && e.cardId === evolutionCards.enzuigiri.id), true);
});

test("every collectible offensive Move with a counter relationship opens a counter-attack response window when fully legal", () => {
  const qualifying = collectionCards.filter(card =>
    card.kind === "move" && !card.defensiveOnly && (card.counters?.length ?? 0) > 0 &&
    ((card.damage ?? 0) > 0 || !!card.submission || (card.onConnect?.length ?? 0) > 0)
  );
  assert.ok(qualifying.length > 100, "expected the rule to cover the full offensive Move pool, not a hand-written shortlist");

  for (const counterCard of qualifying) {
    const counterStar = counterCard.superstarId
      ? Object.values(superstars).find(s => s.id === counterCard.superstarId)
      : superstars.cmPunk;
    assert.ok(counterStar, `missing Superstar for ${counterCard.id}`);
    const attackerStar = counterStar.id === "roman-reigns" ? superstars.cmPunk : superstars.romanReigns;
    const g = new MatchEngine({
      superstarA: attackerStar,
      superstarB: counterStar,
      deckA: decks[attackerStar.id],
      deckB: decks[counterStar.id],
      rng: () => 0
    });
    const targetType = counterCard.counters[0];
    const incoming = { id: `test-incoming-${counterCard.id}`, name: "Test Incoming Move", kind: "move", method: "strike", moveType: targetType === "any" ? "standing-strike" : targetType, damage: 1 };
    const defender = g.state().players.p2;
    defender.leadOffActive = false;
    for (const method of Object.keys(defender.momentum)) defender.momentum[method] = 20;
    if (counterCard.requiresLocation) {
      defender.location = counterCard.requiresLocation;
      g.state().players.p1.location = counterCard.requiresLocation;
    }
    if (counterCard.requiresPosture) g.state().players.p1.posture = counterCard.requiresPosture;

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
  attacker.momentum.agility = 1;
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

test("all 25 Superstars can play Momentum then an immediate Lead Off Move on first Control", () => {
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
  assert.equal(rockCards.finalBossSharpshooter, undefined, "retired Final Boss Sharpshooter should not remain in production card data");
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


test("Season 1 entry is a clean Final Boss splash followed by three-card-set discovery", () => {
  const app = readFileSync(new URL("../js/ui/app.js", import.meta.url), "utf8");
  assert.equal(app.includes("THE FINAL<br>BOSS AWAITS."), true);
  assert.equal(app.includes("Complete Season 1 and reach Tier 50 to unlock <b>The Rock</b> and his complete 55-page deck."), true);
  assert.equal(app.includes("function renderLaunchReleases()"), true);
  assert.equal(app.includes('stars: ["cody-rhodes","brock-lesnar"]'), true);
  assert.equal(app.includes('stars: ["hulk-hogan","stone-cold-steve-austin"]'), true);
  assert.equal(app.includes('stars: ["rhea-ripley","becky-lynch"]'), true);
  assert.equal(app.includes("TAKE ME THERE"), true);
  assert.equal(app.includes("Continue to WWE Legacy"), true);
});


test("Season 1 campaign is carried through menu, Seasons hub and booster releases", () => {
  const app = readFileSync(new URL("../js/ui/app.js", import.meta.url), "utf8");
  assert.equal(app.includes('id="menu-season-campaign"'), true);
  assert.equal(app.includes("THE ROAD TO THE FINAL BOSS"), true);
  assert.equal(app.includes("Season 1 · Featured Releases"), true);
  assert.equal(app.includes('data-season-booster-set="summerslam-series-1"'), true);
  assert.equal(app.includes('data-season-booster-set="hall-of-fame-series-1"'), true);
  assert.equal(app.includes('data-season-booster-set="evolution-series-1"'), true);
  assert.equal(app.includes("SEASON 1 · NOW AVAILABLE"), true);
});


test("primary navigation is fixed on menu screens, hidden in matches, and exposes Options", () => {
  const css = readFileSync(new URL("../css/game.css", import.meta.url), "utf8");
  const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
  const app = readFileSync(new URL("../js/ui/app.js", import.meta.url), "utf8");
  assert.equal(css.includes("position:fixed"), true);
  assert.equal(css.includes('body[data-screen="match"] .mobile-game-nav'), true);
  assert.equal(html.includes('data-mobile-nav="options"'), true);
  assert.equal(app.includes('screen = "options"'), true);
  assert.equal(app.includes("function renderOptions()"), true);
});

test("Options provides an explicit two-step local progress reset for testing", () => {
  const app = readFileSync(new URL("../js/ui/app.js", import.meta.url), "utf8");
  assert.equal(app.includes('id="reset-progress"'), true);
  assert.equal(app.includes('id="confirm-reset-progress"'), true);
  assert.equal(app.includes('id="cancel-reset-progress"'), true);
  assert.equal(app.includes("resetProfile();"), true);
  assert.equal(app.includes("This cannot be undone on this device."), true);
});


test("card backs explicitly communicate Superstar play restrictions", () => {
  const app = readFileSync(new URL("../js/ui/app.js", import.meta.url), "utf8");
  assert.equal(app.includes("function cardPlayRestrictionText(card)"), true);
  assert.equal(app.includes("SUPERSTAR RESTRICTION"), true);
  assert.equal(app.includes("Only playable by"), true);
  assert.equal(app.includes("Playable by any Superstar."), true);
  assert.equal(app.includes("LINKED SUPERSTAR"), true);
});

test("booster flow reveals exactly one focused card at a time then shows summary before upgrades", () => {
  const app = readFileSync(new URL("../js/ui/app.js", import.meta.url), "utf8");
  assert.equal(app.includes("single-card-reveal-stage"), true);
  assert.equal(app.includes("View Pack Summary"), true);
  assert.equal(app.includes("function preparePackSummary()"), true);
  assert.equal(app.includes('packStage = "summary"'), true);
  assert.equal(app.includes("Your New Cards"), true);
  assert.equal(app.includes("Review Roster & Deck Upgrades"), true);
  assert.equal(app.includes("function beginPackUpgradeReview()"), true);
  assert.equal(app.includes('packStage = "upgrades"'), true);
});

test("booster pull metadata distinguishes the first-ever owned copy for NEW badges", () => {
  const boosters = readFileSync(new URL("../js/data/boosters.js", import.meta.url), "utf8");
  assert.equal(boosters.includes("isNewCard:(before.normal+before.foil)===0"), true);
  const app = readFileSync(new URL("../js/ui/app.js", import.meta.url), "utf8");
  assert.equal(app.includes("new-card-symbol"), true);
  assert.equal(app.includes("First time owned"), true);
});


test("all non-SummerSlam launch Superstars use local WWE profile portrait assets", async () => {
  const { superstarArtwork } = await import("../js/data/artwork.js");
  const ids = [
    "hulk-hogan","andre-the-giant","randy-savage","ultimate-warrior",
    "stone-cold-steve-austin","the-undertaker","mankind","kane",
    "rhea-ripley","liv-morgan","becky-lynch","bayley",
    "charlotte-flair","iyo-sky","paige","stephanie-vaquer","the-rock"
  ];
  for (const id of ids) {
    const path = superstarArtwork[id];
    assert.equal(path.startsWith("assets/art/wwe-profile-portraits/"), true, id);
    assert.equal(existsSync(new URL(`../${path}`, import.meta.url)), true, `${id} portrait exists locally`);
  }
});

test("home-screen icon and web app manifest are bundled", () => {
  const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
  assert.equal(html.includes('rel="apple-touch-icon"'), true);
  assert.equal(html.includes('rel="manifest"'), true);
  assert.equal(existsSync(new URL("../assets/icons/apple-touch-icon.png", import.meta.url)), true);
  assert.equal(existsSync(new URL("../assets/icons/icon-192.png", import.meta.url)), true);
  assert.equal(existsSync(new URL("../assets/icons/icon-512.png", import.meta.url)), true);
  assert.equal(existsSync(new URL("../manifest.webmanifest", import.meta.url)), true);
});

test("card rarity uses gold star count without hollow filler stars or RARITY label", () => {
  const app = readFileSync(new URL("../js/ui/app.js", import.meta.url), "utf8");
  const css = readFileSync(new URL("../css/game.css", import.meta.url), "utf8");
  assert.equal(app.includes('"☆"'), false);
  assert.equal(app.includes("<small>STARS</small>"), true);
  assert.equal(css.includes(".rarity-stars"), true);
  assert.equal(css.includes("#e5b84b"), true);
});

test("first-time starter selection routes to the Season 1 release discovery screen", () => {
  const app = readFileSync(new URL("../js/ui/app.js", import.meta.url), "utf8");
  assert.equal(app.includes('screen = "launch-releases";'), true);
  assert.equal(app.includes("renderLaunchReleases();"), true);
  assert.equal(app.includes("showBoosterSet(btn.dataset.launchSet)"), true);
});


test("match HUD uses compact two-wrestler status cards", () => {
  const app = readFileSync(new URL("../js/ui/app.js", import.meta.url), "utf8");
  const css = readFileSync(new URL("../css/game.css", import.meta.url), "utf8");
  assert.equal(app.includes("compact-match-hud"), true);
  assert.equal(app.includes("compact-wrestler-hud"), true);
  assert.equal(app.includes("compact-methods"), true);
  assert.equal(css.includes(".compact-hud-top"), true);
  assert.equal(css.includes("grid-template-columns:42px minmax(0,1fr) 34px"), true);
});

test("human hand is horizontal and sorted by current playability without changing original hand indexes", () => {
  const app = readFileSync(new URL("../js/ui/app.js", import.meta.url), "utf8");
  const css = readFileSync(new URL("../css/game.css", import.meta.url), "utf8");
  assert.equal(app.includes("horizontal-card-hand"), true);
  assert.equal(app.includes("p.turn.momentumPlayed < p.turn.momentumPlayLimit"), true);
  assert.equal(app.includes('card.kind === "momentum" && legal && momentumAvailable'), true);
  assert.equal(app.includes('else if (legal) priority = 1'), true);
  assert.equal(app.includes('else if (card.kind !== "momentum") priority = 2'), true);
  assert.equal(app.includes('data-play-hand="${index}"'), true);
  assert.equal(css.includes("overflow-x:auto!important"), true);
  assert.equal(css.includes("scroll-snap-type:x mandatory"), true);
});

test("remaining Momentum moves to the rear after Momentum has been played this turn", () => {
  const app = readFileSync(new URL("../js/ui/app.js", import.meta.url), "utf8");
  assert.equal(app.includes("Once Momentum has been played this turn, all remaining Momentum moves to the end."), true);
  assert.equal(app.includes("else priority = 3"), true);
  assert.equal(app.includes("Momentum returns to front next turn"), true);
});


test("Roundhouse Kick cannot counter on Turn 1 without its printed Momentum gates", () => {
  const roundhouse = collectionCards.find(c => c.id === "punk-roundhouse");
  assert.ok(roundhouse);
  assert.equal(roundhouse.cost, 3);
  assert.equal(roundhouse.requirements?.strike, 1);

  const g = new MatchEngine({
    superstarA: superstars.romanReigns,
    superstarB: superstars.cmPunk,
    deckA: decks["roman-reigns"],
    deckB: decks["cm-punk"],
    rng: () => 0
  });
  const defender = g.state().players.p2;
  defender.leadOffActive = false;
  for (const method of Object.keys(defender.momentum)) defender.momentum[method] = 0;
  const incoming = { id: "audit-arm-extended", name: "Audit Arm Extended", kind: "move", moveType: "arm-extended", damage: 1 };
  g.state().proposedMove = { attackerId: "p1", defenderId: "p2", card: incoming, damageBonus: 0 };
  g.state().phase = "COUNTER";
  g.state().playerInControl = "p1";

  let check = counterEligibility(g.state(), "p2", incoming, roundhouse);
  assert.equal(check.legal, false);
  assert.match(check.reason, /Not enough total momentum/);

  defender.momentum.attitude = 3;
  check = counterEligibility(g.state(), "p2", incoming, roundhouse);
  assert.equal(check.legal, false);
  assert.match(check.reason, /Requires 1 strike/);

  defender.momentum.strike = 1;
  check = counterEligibility(g.state(), "p2", incoming, roundhouse);
  assert.equal(check.legal, true);
});

test("full collectible Move counter audit enforces relation, Superstar, Momentum, method, location, posture and stun gates", () => {
  const counterMoves = collectionCards.filter(card => card.kind === "move" && (card.counters?.length ?? 0) > 0);
  assert.ok(counterMoves.length > 0, "active card pool must contain counter-capable Moves");

  let costGates = 0, methodGates = 0, superstarGates = 0, locationGates = 0, postureGates = 0, stunGates = 0;

  for (const card of counterMoves) {
    const counterStar = card.superstarId
      ? Object.values(superstars).find(s => s.id === card.superstarId)
      : superstars.cmPunk;
    assert.ok(counterStar, `missing Superstar for ${card.id}`);
    const attackerStar = counterStar.id === "roman-reigns" ? superstars.cmPunk : superstars.romanReigns;
    const g = new MatchEngine({
      superstarA: attackerStar,
      superstarB: counterStar,
      deckA: decks[attackerStar.id],
      deckB: decks[counterStar.id],
      rng: () => 0
    });
    const state = g.state();
    const defender = state.players.p2;
    const attacker = state.players.p1;
    defender.leadOffActive = false;

    const targetType = card.counters.includes("any") ? "arm-extended" : card.counters[0];
    const incoming = { id: `audit-incoming-${card.id}`, name: "Audit Incoming", kind: "move", moveType: targetType, damage: 1 };
    state.proposedMove = { attackerId: "p1", defenderId: "p2", card: incoming, damageBonus: 0 };
    state.phase = "COUNTER";
    state.playerInControl = "p1";
    // Put state/location gates in their valid configuration before auditing
    // resource gates so the failure reason is unambiguous.
    if (card.requiresLocation) {
      defender.location = card.requiresLocation;
      attacker.location = card.requiresLocation;
    } else {
      defender.location = "ring";
      attacker.location = "ring";
    }
    attacker.posture = card.requiresPosture ?? "standing";

    // Relationship gate.
    if (!card.counters.includes("any")) {
      const badIncoming = { ...incoming, moveType: "__not-countered__" };
      assert.equal(counterEligibility(state, "p2", badIncoming, card).legal, false, `${card.id}: relationship gate`);
    }

    // Superstar gate.
    if (card.superstarId) {
      const correct = defender.superstar;
      defender.superstar = counterStar.id === "cm-punk" ? structuredClone(superstars.romanReigns) : structuredClone(superstars.cmPunk);
      for (const method of Object.keys(defender.momentum)) defender.momentum[method] = 20;
      assert.equal(counterEligibility(state, "p2", incoming, card).legal, false, `${card.id}: Superstar gate`);
      defender.superstar = correct;
      superstarGates += 1;
    }

    // Printed total Momentum gate (Lead Off disabled so this is the printed threshold).
    for (const method of Object.keys(defender.momentum)) defender.momentum[method] = 0;
    if ((card.cost ?? 0) > 0) {
      const check = counterEligibility(state, "p2", incoming, card);
      assert.equal(check.legal, false, `${card.id}: zero Momentum must fail cost ${card.cost}`);
      assert.match(check.reason, /Not enough total momentum/, `${card.id}: total Momentum reason`);
      costGates += 1;
    }

    // Method requirements are independent of total Momentum.
    for (const method of Object.keys(defender.momentum)) defender.momentum[method] = 0;
    defender.momentum.attitude = 50;
    for (const [method, amount] of Object.entries(card.requirements ?? {})) {
      if (amount <= 0) continue;
      defender.momentum[method] = Math.max(0, amount - 1);
      const check = counterEligibility(state, "p2", incoming, card);
      assert.equal(check.legal, false, `${card.id}: missing ${method} must fail`);
      assert.match(check.reason, new RegExp(`Requires ${amount} ${method}`), `${card.id}: method reason`);
      defender.momentum[method] = amount;
      methodGates += 1;
    }

    // Fully fund before state-specific checks.
    for (const method of Object.keys(defender.momentum)) defender.momentum[method] = 20;

    if (card.requiresLocation) {
      const required = card.requiresLocation;
      const wrong = required === "ring" ? "ringside" : "ring";
      defender.location = wrong;
      attacker.location = wrong;
      assert.equal(counterEligibility(state, "p2", incoming, card).legal, false, `${card.id}: location gate`);
      defender.location = required;
      attacker.location = required;
      locationGates += 1;
    } else {
      defender.location = "ring";
      attacker.location = "ring";
    }

    if (card.requiresPosture) {
      const required = card.requiresPosture;
      const wrong = required === "on-mat" ? "standing" : "on-mat";
      attacker.posture = wrong;
      assert.equal(counterEligibility(state, "p2", incoming, card).legal, false, `${card.id}: posture gate`);
      attacker.posture = required;
      postureGates += 1;
    } else {
      attacker.posture = "standing";
    }

    if (!card.playableWhileStunned) {
      defender.status.stunnedTurns = 1;
      assert.equal(counterEligibility(state, "p2", incoming, card).legal, false, `${card.id}: stunned gate`);
      defender.status.stunnedTurns = 0;
      stunGates += 1;
    }

    const fullyLegal = counterEligibility(state, "p2", incoming, card);
    assert.equal(fullyLegal.legal, true, `${card.id}: fully funded legal counter should pass (${fullyLegal.reason ?? ""})`);
  }

  assert.equal(costGates, counterMoves.filter(card => (card.cost ?? 0) > 0).length, `cost gates audited: ${costGates}`);
  assert.equal(methodGates, counterMoves.reduce((sum, card) => sum + Object.values(card.requirements ?? {}).filter(amount => amount > 0).length, 0), `method gates audited: ${methodGates}`);
  assert.equal(superstarGates, counterMoves.filter(card => !!card.superstarId).length, `Superstar gates audited: ${superstarGates}`);
  assert.equal(locationGates, counterMoves.filter(card => !!card.requiresLocation).length, `location gates audited: ${locationGates}`);
  assert.equal(postureGates, counterMoves.filter(card => !!card.requiresPosture).length, `posture gates audited: ${postureGates}`);
  assert.equal(stunGates, counterMoves.filter(card => !card.playableWhileStunned).length, `stun gates audited: ${stunGates}`);
});


test("active generic wrestling techniques remain shared while pruned duplicates stay dormant", () => {
  const activeShared = [
    "punk-roundhouse","running-knee","punk-snap-suplex","samoan-drop","seth-superkick",
    "oba-powerbomb","oba-chokeslam"
  ];
  for (const id of activeShared) {
    const card = collectionCards.find(c => c.id === id);
    assert.ok(card, `${id} should remain in the active pool`);
    assert.equal(card.superstarId ?? null, null, `${id} should be shared`);
  }
  const prunedDuplicates = [
    "german-suplex","brock-powerbomb","owens-superkick","owens-ddt","gunther-german",
    "hof1-mankind-knee","s1rock-samoan-drop","s1rock-neckbreaker"
  ];
  for (const id of prunedDuplicates) assert.equal(collectionCards.some(c => c.id === id), false, `${id} should stay outside the active pool`);
});

test("CM Punk identity keeps GTS exclusive Finisher and Anaconda Vise exclusive Trademark", () => {
  const gts = collectionCards.find(c => c.id === "gts");
  const vise = collectionCards.find(c => c.id === "anaconda-vise");
  assert.equal(gts.superstarId, "cm-punk");
  assert.equal(gts.finisher, true);
  assert.equal(vise.superstarId, "cm-punk");
  assert.equal(vise.trademark, true);
});


test("CM Punk branding and exclusive pin Special are updated", async () => {
  const { entranceForSuperstar } = await import("../js/data/entrances.js");
  assert.equal(superstars.cmPunk.ability.name, "Pipe Bomb");
  assert.equal(superstars.cmPunk.ability.id, "pipe-bomb");
  assert.equal(entranceForSuperstar("cm-punk").name, "It's Clobbering Time!");
  const punkDeck = decks["cm-punk"];
  const special = punkDeck.find(c => c.id === "punk-best-in-the-world");
  assert.ok(special);
  assert.equal(special.name, "Best in the World");
  assert.equal(special.superstarId, "cm-punk");
  assert.equal(special.pinEscape, true);
  assert.equal(punkDeck.some(c => c.id === "shoulder-up"), false);
});

test("Chain Wrestling counters any Technical Move but still pays its own gates", () => {
  const g = new MatchEngine({ superstarA: superstars.romanReigns, superstarB: superstars.cmPunk, deckA: decks["roman-reigns"], deckB: decks["cm-punk"], rng: () => 0 });
  const defender = g.state().players.p2;
  const incoming = { id:"method-tech", name:"Technical Attack", kind:"move", method:"technical", moveType:"scoop", damage:4 };
  const chain = cards.chainWrestling;
  g.state().phase="COUNTER"; g.state().playerInControl="p1";
  g.state().proposedMove={ attackerId:"p1", defenderId:"p2", card:incoming, damageBonus:0 };
  defender.leadOffActive=false;
  for (const method of Object.keys(defender.momentum)) defender.momentum[method]=0;
  let check=counterEligibility(g.state(),"p2",incoming,chain);
  assert.equal(check.legal,false);
  assert.match(check.reason,/Not enough total momentum/);
  defender.momentum.attitude=3;
  check=counterEligibility(g.state(),"p2",incoming,chain);
  assert.equal(check.legal,false);
  assert.match(check.reason,/Requires 1 technical/);
  defender.momentum.technical=1;
  check=counterEligibility(g.state(),"p2",incoming,chain);
  assert.equal(check.legal,true);
  const strikeIncoming={...incoming,method:"strike"};
  assert.equal(counterEligibility(g.state(),"p2",strikeIncoming,chain).legal,false);
});

test("Duck counters any Strike Move and Punk starter no longer uses Technical Reversal or Scramble Free", () => {
  const punkDeck=decks["cm-punk"];
  assert.equal(punkDeck.filter(c=>c.id==="chain-wrestling").length,1);
  assert.equal(punkDeck.filter(c=>c.id==="duck-strike").length,1);
  assert.equal(punkDeck.some(c=>c.id==="reversal"||c.id==="scramble"),false);
  const g = new MatchEngine({ superstarA: superstars.romanReigns, superstarB: superstars.cmPunk, deckA: decks["roman-reigns"], deckB: punkDeck, rng:()=>0 });
  const defender=g.state().players.p2;
  const incoming={id:"method-strike",name:"Strike Attack",kind:"move",method:"strike",moveType:"in-close",damage:4};
  g.state().phase="COUNTER"; g.state().playerInControl="p1"; g.state().proposedMove={attackerId:"p1",defenderId:"p2",card:incoming,damageBonus:0};
  defender.leadOffActive=false;
  for(const method of Object.keys(defender.momentum)) defender.momentum[method]=0;
  defender.momentum.attitude=3; defender.momentum.strike=1;
  assert.equal(counterEligibility(g.state(),"p2",incoming,cards.duckStrike).legal,true);
});

test("Best in the World pin escape is only playable by CM Punk", () => {
  const punkSpecial=cards.bestInTheWorld;
  const g = new MatchEngine({ superstarA: superstars.cmPunk, superstarB: superstars.romanReigns, deckA: decks["cm-punk"], deckB: decks["roman-reigns"], rng:()=>0 });
  g.state().phase="PIN_RESPONSE"; g.state().pin={attackerId:"p2",defenderId:"p1"};
  assert.equal(canPlayPinEscape(g.state(),"p1",punkSpecial),true);
  const g2 = new MatchEngine({ superstarA: superstars.romanReigns, superstarB: superstars.cmPunk, deckA: decks["roman-reigns"], deckB: decks["cm-punk"], rng:()=>0 });
  g2.state().phase="PIN_RESPONSE"; g2.state().pin={attackerId:"p2",defenderId:"p1"};
  assert.equal(canPlayPinEscape(g2.state(),"p1",punkSpecial),false);
});

test("finished Superstar card fronts are the canonical UI visual with portrait fallback", async () => {
  const { superstarCardArtwork, superstarArtwork } = await import("../js/data/artwork.js");
  assert.equal(Object.keys(superstarCardArtwork).length, Object.keys(superstarArtwork).length);
  assert.equal(Object.keys(superstarCardArtwork).length, 25);
  for (const id of Object.keys(superstarArtwork)) {
    assert.equal(superstarCardArtwork[id], `assets/cards/art/custom/superstars/${id}.webp?v=0.11.35`);
  }
  const app = readFileSync(new URL("../js/ui/app.js", import.meta.url), "utf8");
  assert.equal(app.includes("const portraitMarkup = superstarVisualMarkup"), true);
  assert.equal(app.includes('card.kind === "superstar" && card.superstarId'), true);
  assert.equal(app.includes("superstarCardArtFor"), true);
  const css = readFileSync(new URL("../css/game.css", import.meta.url), "utf8");
  assert.equal(css.includes("finished Superstar collectible art is the canonical UI visual"), true);
  assert.equal(css.includes(".season-ad-rock img.superstar-card-visual"), true);
  assert.equal(css.includes(".tile-bg-art img.superstar-card-visual"), true);
  assert.equal(css.includes(".season-release-art .mode-portrait img.superstar-card-visual"), true);
});

test("production data has no dormant Superstar-specific Move definitions", async () => {
  const { rockCards } = await import("../js/data/season1-rock-cards.js");
  const flatten = source => {
    const out = [];
    for (const value of Object.values(source)) {
      if (value?.id) out.push(value);
      else if (value && typeof value === "object") {
        for (const nested of Object.values(value)) if (nested?.id) out.push(nested);
      }
    }
    return out;
  };
  const activeIds = new Set(collectionCards.map(card => card.id));
  const sourceCards = [...flatten(cards), ...flatten(hallCards), ...flatten(evolutionCards), ...flatten(rockCards)];
  const phantomExclusives = sourceCards.filter(card => card.kind === "move" && card.superstarId && !activeIds.has(card.id));
  assert.deepEqual(phantomExclusives.map(card => card.id), []);
});

test("active Superstar-specific cards belong to and are used by their owning Superstar", () => {
  const usage = new Map();
  for (const [superstarId, deck] of Object.entries(decks)) {
    for (const card of deck) {
      if (!usage.has(card.id)) usage.set(card.id, new Set());
      usage.get(card.id).add(superstarId);
    }
  }
  for (const card of collectionCards.filter(card => card.superstarId && !["superstar", "entrance"].includes(card.kind))) {
    const users = [...(usage.get(card.id) ?? [])];
    assert.equal(users.includes(card.superstarId), true, `${card.id} is active but absent from ${card.superstarId}'s deck`);
    assert.deepEqual(users.filter(id => id !== card.superstarId), [], `${card.id} is used by the wrong Superstar: ${users.join(", ")}`);
  }
});

test("launch screen fills the visible viewport and keeps Final Boss copy clear of the card art", () => {
  const css = readFileSync(new URL("../css/game.css", import.meta.url), "utf8");
  assert.match(css, /body\[data-screen="splash"\] #game\{padding-top:0;min-height:100svh\}/);
  assert.match(css, /\.clean-launch-splash\{[\s\S]*?height:100svh;[\s\S]*?align-items:stretch;[\s\S]*?overflow:hidden;/);
  assert.match(css, /\.clean-splash-content\{[\s\S]*?height:100%;[\s\S]*?grid-template-rows:auto minmax\(0,1fr\) auto auto auto;[\s\S]*?align-content:stretch;/);
  assert.match(css, /\.season-ad-copy\{[^}]*justify-items:end;[^}]*text-align:right/);
  assert.match(css, /\.season-ad-copy p\{[^}]*margin:0 0 0 auto/);
  assert.match(css, /@media\(max-width:760px\)\{[\s\S]*?\.season-one-ad\{min-height:0;height:clamp\(292px,37svh,360px\);max-height:100%;align-self:center/);
  assert.match(css, /@media\(max-width:760px\)\{[\s\S]*?\.season-ad-title\{font-size:clamp\(2\.02rem,9\.3vw,3rem\)/);
  assert.match(css, /@media\(max-height:720px\) and \(max-width:760px\)\{[\s\S]*?\.season-ad-title\{font-size:1\.72rem\}/);
});


test("launch logo fills its reserved mobile top-third brand area", () => {
  const css = readFileSync(new URL("../css/game.css", import.meta.url), "utf8");
  assert.match(css, /@media\(max-width:760px\)\{[\s\S]*?\.clean-splash-content\{[^}]*grid-template-rows:clamp\(210px,28svh,290px\) minmax\(0,1fr\) auto auto auto/);
  assert.match(css, /@media\(max-width:760px\)\{[\s\S]*?\.clean-splash-brand\{[^}]*height:100%;[^}]*transform:none;[^}]*place-items:center/);
  assert.match(css, /\.clean-splash-brand \.legacy-word\{font-size:clamp\(5\.25rem,23vw,6\.45rem\);line-height:\.79;letter-spacing:\.045em\}/);
  assert.match(css, /@media\(max-height:720px\) and \(max-width:760px\)\{[\s\S]*?grid-template-rows:clamp\(150px,23svh,178px\)/);
});

test('v0.11.30 champion onboarding has no header or ability-pill overlays', async () => {
  const css = readFileSync(new URL('../css/game.css', import.meta.url), 'utf8');
  assert.match(css, /body\[data-screen="starter"\] \.topbar\{display:none!important\}/);
  assert.match(css, /\.starter-choice > b:last-child\{/);
  assert.doesNotMatch(css, /\.starter-choice b:last-child\{/);
  assert.match(css, /\.champion-starter em b\{display:inline;background:transparent!important/);
});


test('v0.11.32 home hub removes the global banner and separates owned Collection from the full Catalogue', () => {
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  const app = readFileSync(new URL('../js/ui/app.js', import.meta.url), 'utf8');
  const css = readFileSync(new URL('../css/game.css', import.meta.url), 'utf8');
  assert.equal(html.includes('id="app-topbar"'), false);
  assert.match(css, /\.topbar\{display:none!important\}/);
  assert.equal(app.includes('id="menu-owned-collection"'), true);
  assert.equal(app.includes('id="menu-catalogue"'), true);
  assert.equal(app.includes('function showOwnedCollection()'), true);
  assert.equal(app.includes('function showCardCatalogue()'), true);
  assert.match(app, /activeCollectionSetId = "all"/);
  assert.match(app, /collectionView === "owned"/);
  assert.equal(app.includes('id="menu-seasons"'), false);
  const menuBlock = app.slice(app.indexOf('function renderMainMenu()'), app.indexOf('function renderPlayMenu()'));
  assert.equal(menuBlock.includes('Game & Testing'), false);
});

test('v0.11.32 bottom hub uses oversized scrollable icon buttons with Collection and Catalogue separated', () => {
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  const css = readFileSync(new URL('../css/game.css', import.meta.url), 'utf8');
  for (const target of ['menu','play-menu','collection','catalogue','boosters','seasons','profile','options']) {
    assert.ok(html.includes(`data-mobile-nav="${target}"`), `missing ${target} hub target`);
  }
  assert.match(html, /class="nav-icon"><svg/);
  assert.match(css, /grid-auto-columns:92px!important/);
  assert.match(css, /overflow-x:auto!important/);
  assert.match(css, /min-height:78px!important/);
});

test('v0.11.31 every app screen transition resets viewport to the top', () => {
  const app = readFileSync(new URL('../js/ui/app.js', import.meta.url), 'utf8');
  assert.match(app, /if \("scrollRestoration" in history\) history\.scrollRestoration = "manual";/);
  assert.match(app, /function scrollNewScreenToTop\(\) \{[\s\S]*?if \(lastChromeScreen === screen\) return;[\s\S]*?window\.scrollTo\(0, 0\);[\s\S]*?requestAnimationFrame/);
  assert.match(app, /document\.body\.dataset\.mode = activeMode \?\? "";\n  scrollNewScreenToTop\(\);/);
});


test('v0.11.33 keeps important phone content below the iPhone status area and centers the Season countdown', () => {
  const app = readFileSync(new URL('../js/ui/app.js', import.meta.url), 'utf8');
  const css = readFileSync(new URL('../css/game.css', import.meta.url), 'utf8');
  assert.match(app, /<span class="season-led-live"><i><\/i><b>SEASON ONE LIVE<\/b><i><\/i><\/span>/);
  assert.match(app, /<span class="season-led-label">ENDS IN<\/span>/);
  assert.match(app, /class="season-led-countdown" data-season-countdown/);
  assert.match(css, /body:not\(\[data-screen="splash"\]\) main\{[\s\S]*?padding-top:max\(calc\(env\(safe-area-inset-top,0px\) \+ 12px\),58px\)!important/);
  assert.match(css, /\.season-led-strip\{[\s\S]*?grid-template-columns:1fr;[\s\S]*?place-items:center;[\s\S]*?text-align:center/);
  assert.match(css, /\.season-led-countdown\{font:1000 clamp\(2rem,6vw,3\.25rem\)/);
  const studioCss = readFileSync(new URL('../css/card-art-studio.css', import.meta.url), 'utf8');
  assert.match(studioCss, /\.studio-topbar\{padding-top:max\(calc\(env\(safe-area-inset-top,0px\) \+ 12px\),58px\)\}/);
});

test('v0.11.33 restores a normal Options tile to Home without restoring Game & Testing', () => {
  const app = readFileSync(new URL('../js/ui/app.js', import.meta.url), 'utf8');
  const menuBlock = app.slice(app.indexOf('function renderMainMenu()'), app.indexOf('function renderPlayMenu()'));
  assert.equal(menuBlock.includes('id="menu-options"'), true);
  assert.equal(menuBlock.includes('SETTINGS'), true);
  assert.equal(menuBlock.includes('Game & Testing'), false);
  assert.match(menuBlock, /\$\("#menu-options"\)\?\.addEventListener\("click", showOptions\)/);
  assert.equal(app.includes('<h2>Game Options</h2>'), true);
});


test('v0.11.35 stamps the full browser dependency graph and runtime artwork URLs with one build version', async () => {
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  const app = readFileSync(new URL('../js/ui/app.js', import.meta.url), 'utf8');
  const profileSource = readFileSync(new URL('../js/data/profile.js', import.meta.url), 'utf8');
  const buildSource = readFileSync(new URL('../js/config/build.js', import.meta.url), 'utf8');
  const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
  assert.equal(pkg.version, '0.11.35');
  assert.match(html, /css\/game\.css\?v=0\.11\.35/);
  assert.match(html, /js\/ui\/app\.js\?v=0\.11\.35/);
  assert.match(html, /manifest\.webmanifest\?v=0\.11\.35/);
  assert.match(app, /data\/superstars\.js\?v=0\.11\.35/);
  assert.match(profileSource, /\.\/decks\.js\?v=0\.11\.35/);
  assert.match(buildSource, /BUILD_VERSION = "0\.11\.35"/);
  const { artworkFor } = await import('../js/data/artwork.js');
  assert.match(artworkFor(cards.crossRhodes), /\?v=0\.11\.35$/);
  assert.equal(pkg.scripts['stamp-cache'], 'node tools/stamp-cache-version.mjs');
});


test('v0.11.35 gives Options Superstar art and tightens the persistent hub without shrinking tap targets too far', () => {
  const app = readFileSync(new URL('../js/ui/app.js', import.meta.url), 'utf8');
  const css = readFileSync(new URL('../css/game.css', import.meta.url), 'utf8');
  const menuBlock = app.slice(app.indexOf('function renderMainMenu()'), app.indexOf('function renderPlayMenu()'));
  assert.match(menuBlock, /id="menu-options"[\s\S]*?portraitMarkup\("cody-rhodes","Cody Rhodes"\)/);
  assert.doesNotMatch(menuBlock, /options-tile-gear/);
  assert.match(css, /grid-auto-columns:92px!important/);
  assert.match(css, /min-height:78px!important/);
  assert.match(css, /gap:2px!important/);
  assert.match(css, /@media\(max-width:760px\)\{[\s\S]*?grid-auto-columns:88px!important[\s\S]*?min-height:76px!important/);
});
