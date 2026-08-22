import test from 'node:test';
import assert from 'node:assert/strict';
import { allGameplayCards } from '../js/data/content.js?v=0.13.98';
import { superstars } from '../js/data/superstars.js?v=0.13.98';
import { decks } from '../js/data/decks.js?v=0.13.98';
import { MatchEngine } from '../js/engine/MatchEngine.js?v=0.13.98';
import { counterEligibility } from '../js/engine/rules.js?v=0.13.98';

const card=id=>allGameplayCards.find(c=>c.id===id);
const star=id=>Object.values(superstars).find(s=>s.id===id);
const rng=()=>0.41;

function engineFor(p1Id,p2Id='cm-punk'){
  return new MatchEngine({p1:star(p1Id),p2:star(p2Id),decks,rng});
}
function moveExistingCardToHand(player,id){
  for(const zone of ['deck','discard','outOfPlay']){
    const idx=player[zone].findIndex(c=>c.id===id);
    if(idx>=0){player.hand.push(player[zone].splice(idx,1)[0]);return player.hand.at(-1);}
  }
  const existing=player.hand.find(c=>c.id===id);
  if(existing)return existing;
  throw new Error(`Card ${id} is not present in player zones`);
}

test('v0.13.84 locks Balance Pass 2 numerical changes',()=>{
  assert.equal(card('andre-the-giant-sitdown-splash').cost,12);
  assert.equal(star('randy-savage').ability.trigger.maxUses,2);
  assert.equal(card('chyna-bomb').damage,16);
  assert.equal(star('penta').ability.trigger.adrenaline,0);
  assert.equal(star('penta').ability.trigger.bonusDamage,2);
  assert.equal(card('mr-perfect-perfect-plex').cost,7);
  assert.equal(card('mr-perfect-perfect-plex').damage,15);
  assert.equal(card('ted-dibiase-million-dollar-dream').cost,8);
  assert.equal(card('lola-vice-305').cost,8);
  assert.equal(card('lola-vice-305').damage,16);
  assert.equal(card('paige-paige-turner').damage,10);
  assert.equal(card('entrance-paige').preMatchAdrenaline,2);
  assert.equal(star('paige').entrance.preMatchAdrenaline,2);
  assert.equal(card('special-rowdy-roddy-piper').special.nextUseAdrenalineTax,2);
});

test('v0.13.84 Piper Pit converts the locked Counter into a one-use +2 Adrenaline tax after control changes',()=>{
  const g=engineFor('rowdy-roddy-piper','hulk-hogan');
  const s=g.state(),p=s.players.p1,d=s.players.p2;
  moveExistingCardToHand(p,'special-rowdy-roddy-piper');
  // Guarantee a known Counter is the first eligible Counter in Punk's hand.
  const known=moveExistingCardToHand(d,'punch');
  d.hand=[known,...d.hand.filter(c=>c!==known)];
  s.phase='ACTION'; s.playerInControl='p1';
  const special=p.hand.find(c=>c.id==='special-rowdy-roddy-piper');
  assert.equal(g.playSpecial('p1',special),true);
  assert.equal(d.events.pipersPitLockedCounterId,'punch');
  assert.equal(d.events.pipersPitLockedCounterTax,2);
  g._setControl('p2');
  assert.equal(d.events.pipersPitLockedCounterId,undefined);
  assert.equal(d.events.pipersPitTaxCounterId,'punch');
  assert.equal(d.events.pipersPitCounterAdrenalineTax,2);

  // After Punk's control ends, the tax remains for the next defensive use.
  g._setControl('p1');
  d.adrenaline=1; d.momentum.attitude=1;
  s.phase='COUNTER'; s.proposedMove={attackerId:'p1',defenderId:'p2',card:card('elbow-strike')??card('body-slam'),isCounterAttack:false,counterDepth:0};
  const incoming=s.proposedMove.card;
  // Punch needs an incoming state it can answer; use an Elbow/Strike exchange card if available.
  if(!counterEligibility(s,'p2',incoming,known).legal){
    const answerable=allGameplayCards.find(c=>c.kind==='move'&&c.id!==known.id&&known.counterStates?.includes(c.counterState));
    assert.ok(answerable,'Expected a Move answerable by Punch');
    s.proposedMove.card=answerable;
  }
  let e=counterEligibility(s,'p2',s.proposedMove.card,known);
  assert.equal(e.legal,false);
  assert.match(e.reason,/2 Adrenaline/);
  d.adrenaline=2; d.momentum.attitude=2;
  e=counterEligibility(s,'p2',s.proposedMove.card,known);
  assert.equal(e.legal,true);
  assert.equal(e.adrenalineCost,2);
  assert.equal(g.counter('p2',known),true);
  assert.equal(d.adrenaline,0);
  assert.equal(d.events.pipersPitTaxCounterId,undefined);
});
