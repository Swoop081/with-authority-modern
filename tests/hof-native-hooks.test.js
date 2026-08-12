import test from "node:test";
import assert from "node:assert/strict";
import { MatchEngine } from "../js/engine/MatchEngine.js";
import { superstars } from "../js/data/superstars.js";
import { cards } from "../js/data/cards.js";
import { hallCards } from "../js/data/hall-of-fame-cards.js";
import { decks } from "../js/data/decks.js";
import { moveEligibility } from "../js/engine/rules.js";
import { cpuDecision } from "../js/ai/WrestlingAI.js";

function putInHand(g, playerId, card) {
  g.state().players[playerId].hand.unshift(structuredClone(card));
  return g.state().players[playerId].hand[0];
}
function make(a,b) {
  return new MatchEngine({ superstarA:a, superstarB:b, deckA:decks[a.id], deckB:decks[b.id], rng:()=>0.99 });
}

test("HOF native hook: Hulk Up arms only the next Big Boot in that Control sequence", () => {
  const g=make(superstars.hulkHogan,superstars.andreTheGiant); const h=g.state().players.p1;
  h.hp=Math.floor(h.maxHp/2); h.status.stunnedTurns=2; putInHand(g,"p1",hallCards.hoganSpecial);
  g.passTurn("p1"); g.passTurn("p2");
  assert.equal(h.status.stunnedTurns,0); assert.equal(h.specialFlags.hoganBigBootUncounterableByMove,true);
  h.momentum.strike=2; h.momentum.attitude=9;
  const boot=putInHand(g,"p1",hallCards.hoganBigBootReviewed); g.declareMove("p1",boot);
  assert.equal(g.state().proposedMove.uncounterableByMove,true);
  assert.throws(()=>g.counter("p2",putInHand(g,"p2",hallCards.jab)),/cannot be Countered by a Move/);
  assert.doesNotThrow(()=>g.counter("p2",putInHand(g,"p2",hallCards.hofDesperationCounter)));
});

test("HOF native hook: Hogan's Big Boot directly draws Atomic Leg Drop on connect", () => {
  const g=make(superstars.hulkHogan,superstars.andreTheGiant); const h=g.state().players.p1;
  h.momentum.strike=2; h.momentum.attitude=9;
  h.hand=h.hand.filter(c=>c.id!==hallCards.hoganAtomicLegDropReviewed.id);
  if(!h.deck.some(c=>c.id===hallCards.hoganAtomicLegDropReviewed.id)) h.deck.unshift(structuredClone(hallCards.hoganAtomicLegDropReviewed));
  const boot=putInHand(g,"p1",hallCards.hoganBigBootReviewed); g.declareMove("p1",boot); g.passCounter("p2");
  assert.equal(h.hand.some(c=>c.id===hallCards.hoganAtomicLegDropReviewed.id),true);
});

test("HOF native hook: Rise From the Flames ignores Kane's first Special-triggered Stun and grants Adrenaline", () => {
  const g=make(superstars.hulkHogan,superstars.kane); const kane=g.state().players.p2; const hogan=g.state().players.p1;
  putInHand(g,"p2",hallCards.kaneSpecial); hogan.momentum.strength=2; hogan.momentum.attitude=6;
  const hit=putInHand(g,"p1",{...hallCards.bodyslam,id:"kane-stun-hook",cost:3,damage:5,stunTurns:2});
  const before=kane.momentum.attitude; g.declareMove("p1",hit); g.passCounter("p2");
  assert.equal(kane.status.stunnedTurns,0); assert.equal(kane.momentum.attitude,before); // +1 Special offsets universal -1
  assert.equal(g.state().log.some(e=>e.type==="SUPERSTAR_SPECIAL_PLAYED"&&e.cardName==="Rise From the Flames"),true);
});

test("HOF native hook: Mr. Socko draws and discounts Mandible Claw only for the current Control sequence", () => {
  const g=make(superstars.mankind,superstars.kane); const m=g.state().players.p1; const k=g.state().players.p2;
  putInHand(g,"p1",hallCards.mankindSpecial); const claw=putInHand(g,"p1",hallCards.mankindClawReviewed); k.posture="on-mat";
  g.passTurn("p1"); const before=m.hand.length; g.passTurn("p2");
  assert.equal(m.hand.length,before+1); assert.equal(m.pendingCardCostModifiers[claw.id],-2);
  m.momentum.attitude=7; assert.equal(moveEligibility(g.state(),"p1",m.hand.find(c=>c.id===claw.id)).legal,true);
  g.passTurn("p1"); assert.equal(m.pendingCardCostModifiers[claw.id],undefined);
});

test("HOF native hook: Shake the Ropes triggers on Warrior losing Control below half and clears Stun on his next Control", () => {
  const g=make(superstars.ultimateWarrior,superstars.randySavage); const w=g.state().players.p1;
  w.hp=Math.floor(w.maxHp/2); w.status.stunnedTurns=2; putInHand(g,"p1",hallCards.warriorSpecial);
  const before=w.momentum.attitude; g.passTurn("p1");
  assert.equal(w.momentum.attitude,before+2); assert.equal(w.status.stunnedTurns,2);
  g.passTurn("p2"); assert.equal(w.status.stunnedTurns,0);
});

test("HOF native hook: Oh Yeah discounts Savage's next Agility Move after a successful Counter", () => {
  const g=make(superstars.hulkHogan,superstars.randySavage); const h=g.state().players.p1; const s=g.state().players.p2;
  h.momentum.strike=1; h.momentum.attitude=2; putInHand(g,"p2",hallCards.savageSpecial);
  const incoming=putInHand(g,"p1",hallCards.jab); const counter=putInHand(g,"p2",hallCards.hofDesperationCounter);
  g.declareMove("p1",incoming); g.counter("p2",counter);
  assert.deepEqual(s.specialFlags.nextMethodMoveCostModifier,{method:"agility",amount:-2});
  s.momentum.agility=2; s.momentum.attitude=2;
  const aerial=putInHand(g,"p2",{...hallCards.savageCrossbodyReviewed,id:"oh-yeah-aerial",cost:6,requirements:{agility:1},method:"agility"});
  assert.equal(moveEligibility(g.state(),"p2",aerial).legal,true);
  g.declareMove("p2",aerial); assert.equal(s.specialFlags.nextMethodMoveCostModifier,null);
});

test("HOF native hook: Nobody Slams André prevents Strength grounding but not damage", () => {
  const g=make(superstars.hulkHogan,superstars.andreTheGiant); const h=g.state().players.p1; const a=g.state().players.p2;
  putInHand(g,"p2",hallCards.andreSpecial); h.momentum.strength=2; h.momentum.attitude=5; a.posture="standing";
  const hp=a.hp; const hit=putInHand(g,"p1",{...hallCards.bodyslam,id:"andre-ground-test",cost:3,damage:6,method:"strength",requirements:{strength:1},setOpponentPosture:"on-mat"});
  g.declareMove("p1",hit); g.passCounter("p2");
  assert.equal(a.hp,hp-6); assert.equal(a.posture,"standing");
  assert.equal(g.state().log.some(e=>e.type==="SUPERSTAR_SPECIAL_PLAYED"&&e.cardName==="Nobody Slams André"),true);
});

test("HOF native hook: Snake Eyes gives only the next Running Big Boot +2 in the same Control sequence", () => {
  const g=make(superstars.undertaker,superstars.kane); const t=g.state().players.p1;
  t.momentum.strength=3; t.momentum.strike=2; t.momentum.attitude=8;
  const snake=putInHand(g,"p1",hallCards.takerSnakeEyesReviewed); g.declareMove("p1",snake); g.passCounter("p2"); g.endPostMove("p1");
  const boot=putInHand(g,"p1",hallCards.runningBigBootReviewed); g.declareMove("p1",boot);
  assert.equal(g.state().proposedMove.damageBonus,2); assert.equal(t.specialFlags.takerBigBootDamageBonus,0);
});

test("HOF native hook: Two-Handed Choke Lift gives next Chokeslam From Hell +1 in same Control", () => {
  const g=make(superstars.kane,superstars.undertaker); const k=g.state().players.p1;
  k.momentum.strength=4; k.momentum.attitude=9;
  const lift=putInHand(g,"p1",hallCards.kaneChokeLift); g.declareMove("p1",lift); g.passCounter("p2"); g.endPostMove("p1");
  const slam=putInHand(g,"p1",hallCards.kaneChokeslamReviewed); g.declareMove("p1",slam);
  assert.equal(g.state().proposedMove.damageBonus,1); assert.equal(k.specialFlags.kaneChokeslamDamageBonus,0);
});

test("HOF native hook: Deranged Resilience reduces only Mankind's first two incoming 8+ damage Moves", () => {
  const g=make(superstars.hulkHogan,superstars.mankind); const h=g.state().players.p1; const m=g.state().players.p2;
  h.momentum.strength=5; h.momentum.attitude=15; const start=m.hp;
  for(let i=0;i<3;i++){
    const hit=putInHand(g,"p1",{...hallCards.bodyslam,id:`mankind-heavy-${i}`,cost:2,damage:8,method:"strength",requirements:{strength:1}});
    g.declareMove("p1",hit); g.passCounter("p2"); if(i<2) g.endPostMove("p1");
  }
  assert.equal(m.hp,start-(6+6+8)); assert.equal(m.passiveFlags.damageReductionUses,2);
  assert.equal(g.state().log.filter(e=>e.type==="SUPERSTAR_PASSIVE"&&e.effect==="DAMAGE_REDUCTION").length,2);
});

test("HOF native hook: Feel the Power draws on the second connected Move in a Control sequence, max two sequences", () => {
  const g=make(superstars.ultimateWarrior,superstars.randySavage); const w=g.state().players.p1;
  w.momentum.strike=3; w.momentum.attitude=12;
  for(let seq=0;seq<2;seq++){
    for(let i=0;i<2;i++){
      const hit=putInHand(g,"p1",{...hallCards.jab,id:`warrior-combo-${seq}-${i}`,cost:1,damage:2});
      g.declareMove("p1",hit); g.passCounter("p2"); g.endPostMove("p1");
    }
    if(seq===0){ g.passTurn("p1"); g.passTurn("p2"); }
  }
  assert.equal(w.passiveFlags.warriorComboUses,2);
});

test("HOF native hook: Macho Madness rewards Strike into Agility within the same Control sequence", () => {
  const g=make(superstars.randySavage,superstars.hulkHogan); const s=g.state().players.p1;
  s.momentum.strike=2; s.momentum.agility=2; s.momentum.attitude=8;
  const strike=putInHand(g,"p1",hallCards.jab); g.declareMove("p1",strike); g.passCounter("p2"); g.endPostMove("p1");
  const aerial=putInHand(g,"p1",{...hallCards.savageCrossbodyReviewed,id:"macho-agility",cost:4,method:"agility",requirements:{agility:1}});
  g.declareMove("p1",aerial); g.passCounter("p2");
  assert.equal(s.passiveFlags.savageMadnessUses,1);
});

test("HOF native hook: Giant's Reach discounts André's next Strength Move by 1 after a Strike connects", () => {
  const g=make(superstars.andreTheGiant,superstars.hulkHogan); const a=g.state().players.p1;
  a.momentum.strike=1; a.momentum.strength=2; a.momentum.attitude=2;
  const strike=putInHand(g,"p1",hallCards.jab); g.declareMove("p1",strike); g.passCounter("p2"); g.endPostMove("p1");
  assert.deepEqual(a.specialFlags.nextMethodMoveCostModifier,{method:"strength",amount:-1});
  const power=putInHand(g,"p1",{...hallCards.bodyslam,id:"giant-reach-power",cost:5,requirements:{strength:1},method:"strength"});
  assert.equal(moveEligibility(g.state(),"p1",power).legal,true);
  g.declareMove("p1",power); assert.equal(a.specialFlags.nextMethodMoveCostModifier,null);
});

test("HOF native hook: Entrance-supplied tertiary Momentum counts toward deck-health legality", async () => {
  const { evaluateDeck }=await import("../js/data/deck-health.js");
  const health=evaluateDeck(decks.kane,{superstarId:"kane"});
  assert.equal(health.entranceSupply.agility,1);
  assert.equal(health.effectiveMethodSupply.agility>=1,true);
  assert.equal(health.violations.some(v=>v.startsWith("agility Momentum cannot satisfy")),false);
});


test("HOF native hook: CPU never chooses a Move counter against Hulk Up's protected Big Boot", () => {
  const g=make(superstars.hulkHogan,superstars.andreTheGiant); const h=g.state().players.p1; const a=g.state().players.p2;
  h.hp=Math.floor(h.maxHp/2); putInHand(g,"p1",hallCards.hoganSpecial);
  g.passTurn("p1"); g.passTurn("p2");
  h.momentum.strike=2; h.momentum.attitude=9;
  a.hand=[]; putInHand(g,"p2",{...hallCards.jab,id:"ai-move-counter",counters:[hallCards.hoganBigBootReviewed.moveType],requirements:{},cost:0});
  g.declareMove("p1",putInHand(g,"p1",hallCards.hoganBigBootReviewed));
  const decision=cpuDecision(g.state(),"p2");
  assert.notEqual(decision.type,"counter");
});

test("HOF native hook: Bobby Heenan does not recover Control when André's Finisher is Countered", () => {
  const g=make(superstars.andreTheGiant,superstars.hulkHogan); const a=g.state().players.p1;
  g.playManager("p1",putInHand(g,"p1",hallCards.bobbyHeenan)); a.momentum.attitude=20;
  const finisher=putInHand(g,"p1",{...hallCards.andreGiantSplash,id:"andre-finisher-counter-test",requiresPosture:null,requirements:{},cost:1,finisher:true});
  g.declareMove("p1",finisher); g.counter("p2",putInHand(g,"p2",hallCards.hofDesperationCounter));
  assert.equal(a.managerAbilityUsed,false); assert.equal(g.state().playerInControl,"p2");
});

test("HOF native hook: Sit Up adds 1 Adrenaline on a natural Undertaker kickout before Control transfers", () => {
  const g=new MatchEngine({superstarA:superstars.hulkHogan,superstarB:superstars.undertaker,deckA:decks["hulk-hogan"],deckB:decks["the-undertaker"],rng:()=>0.99});
  const h=g.state().players.p1; const t=g.state().players.p2;
  putInHand(g,"p2",hallCards.takerSpecial); h.momentum.strength=2; h.momentum.attitude=5;
  const knock=putInHand(g,"p1",{...hallCards.bodyslam,id:"sit-up-knockdown",cost:2,damage:1,setOpponentPosture:"on-mat"});
  g.declareMove("p1",knock); g.passCounter("p2"); const before=t.momentum.attitude;
  g.attemptPin("p1"); const result=g.passPinResponse("p2");
  assert.equal(result.success,false); assert.equal(t.momentum.attitude,before+1); assert.equal(g.state().playerInControl,"p2");
  assert.equal(g.state().log.some(e=>e.type==="SUPERSTAR_SPECIAL_PLAYED"&&e.cardName==="Sit Up"),true);
});
