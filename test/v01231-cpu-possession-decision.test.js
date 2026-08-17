import test from 'node:test';
import assert from 'node:assert/strict';
import { superstars } from '../js/data/superstars.js?v=0.12.74';
import { decks } from '../js/data/decks.js?v=0.12.74';
import { allGameplayCards } from '../js/data/content.js?v=0.12.74';
import { MatchEngine } from '../js/engine/MatchEngine.js?v=0.12.74';
import { cpuDecision } from '../js/ai/WrestlingAI.js?v=0.12.74';
import { submissionThreshold } from '../js/engine/rules.js?v=0.12.74';
import { healthOnlyPinChance } from '../js/engine/health.js?v=0.12.74';

const byId=new Map(allGameplayCards.map(c=>[c.id,c]));
const star=id=>Object.values(superstars).find(s=>s.id===id);
const rng=()=>0.999;

function actionState(cpuId='roman-reigns'){
  const game=new MatchEngine({p1:star('cm-punk'),p2:star(cpuId),decks,rng});
  const s=game.state(),p=s.players.p2;
  s.phase='ACTION';s.playerInControl='p2';s.proposedMove=null;s.postMove=null;
  p.turn={momentumPlayed:0,momentumPlayLimit:1,actionPlayed:0,supportPlayed:0,specialPlayed:0};
  p.momentum={strength:3,strike:3,technical:3,agility:3,attitude:6};p.adrenaline=6;p.momentumPlayedThisTurn=false;
  return {game,s,p};
}

test('v0.12.31 CPU sequences useful Actions before an already-legal Move',()=>{
  const {game,p}=actionState();
  p.hand=[byId.get('fire-up'),byId.get('punch')];
  const d=cpuDecision(game,'p2');
  assert.equal(d?.type,'action');
  assert.equal(d?.card?.id,'fire-up');
});

test('v0.12.31 CPU installs Support before attacking instead of waiting until the sequence is empty',()=>{
  const {game,p}=actionState();
  p.hand=[byId.get('crowd-support'),byId.get('punch')];
  const d=cpuDecision(game,'p2');
  assert.equal(d?.type,'support');
  assert.equal(d?.card?.id,'crowd-support');
});

test('v0.12.31 CPU releases a mathematically impossible Submission instead of emptying its hand',()=>{
  const {game,s,p}=actionState('chad-gable');
  const defender=s.players.p1;
  p.hand=[byId.get('momentum-strength')];
  defender.submissionDamage.arms=0;
  s.phase='SUBMISSION_MAINTAIN';
  s.submission={attackerId:'p2',defenderId:'p1',cardId:'test-hold',bodyPart:'arms',damage:2,holdTurn:1,priorWorked:false};
  assert.ok(submissionThreshold(defender)>2);
  assert.equal(cpuDecision(game,'p2')?.type,'release');
  assert.equal(p.hand.length,1,'decision does not throw away the final page just to prolong a doomed hold');
});

test('v0.12.31 CPU commits to a winnable Submission but ditches the least valuable page',()=>{
  const {game,s,p}=actionState('chad-gable');
  const defender=s.players.p1,threshold=submissionThreshold(defender);
  const finisher=byId.get('seth-rollins-curb-stomp'),momentum=byId.get('momentum-strength');
  p.hand=[finisher,momentum];
  defender.submissionDamage.arms=threshold-5;
  s.phase='SUBMISSION_MAINTAIN';
  s.submission={attackerId:'p2',defenderId:'p1',cardId:'test-hold',bodyPart:'arms',damage:5,holdTurn:1,priorWorked:true};
  const d=cpuDecision(game,'p2');
  assert.equal(d?.type,'maintain');
  assert.equal(d?.index,1,'Momentum is ditched instead of the Finisher when either page can maintain the hold');
});

test('v0.12.31 CPU saves Pin Escape on weak covers and spends it once the cover is genuinely dangerous',()=>{
  const game=new MatchEngine({p1:star('roman-reigns'),p2:star('cm-punk'),decks,rng});
  const s=game.state(),p=s.players.p2;
  s.phase='PIN_RESPONSE';s.playerInControl='p1';s.proposedPin={attackerId:'p1',defenderId:'p2'};
  p.hand=[byId.get('shoulder-up')];
  p.hp=16;
  assert.equal(healthOnlyPinChance(p),5);
  assert.equal(cpuDecision(game,'p2')?.type,'passPin');
  p.hp=15;
  assert.equal(healthOnlyPinChance(p),20);
  const d=cpuDecision(game,'p2');
  assert.equal(d?.type,'pinEscape');
  assert.equal(d?.card?.id,'shoulder-up');
});
