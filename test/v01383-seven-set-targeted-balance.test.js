import test from 'node:test';
import assert from 'node:assert/strict';
import { allGameplayCards } from '../js/data/content.js?v=0.14.00';
import { superstars } from '../js/data/superstars.js?v=0.14.00';
import { decks } from '../js/data/decks.js?v=0.14.00';
import { MatchEngine } from '../js/engine/MatchEngine.js?v=0.14.00';
import { autoCounterEligibility } from '../js/engine/rules.js?v=0.14.00';

const card = id => allGameplayCards.find(c => c.id === id);
const star = id => Object.values(superstars).find(s => s.id === id);
const rng = () => 0.41;

function engineFor(p1Id, p2Id='cm-punk') {
  const p1 = star(p1Id), p2 = star(p2Id);
  return new MatchEngine({ p1, p2, decks, rng });
}
function moveExistingCardToHand(player, id) {
  for (const zone of ['deck','discard','outOfPlay']) {
    const idx = player[zone].findIndex(c => c.id === id);
    if (idx >= 0) return player.hand.push(player[zone].splice(idx,1)[0]), player.hand.at(-1);
  }
  const existing = player.hand.find(c => c.id === id);
  if (existing) return existing;
  throw new Error(`Card ${id} is not present in player zones`);
}

test('v0.13.83 locks the approved targeted numerical balance changes', () => {
  assert.equal(star('roman-reigns').ability.trigger.adrenaline ?? 0, 0);
  assert.equal(card('special-oba-femi').special.type, 'nextStrengthNoAutoCounter');
  assert.equal(star('iyo-sky').entrance.preMatchAdrenaline, 2);
  assert.equal(card('entrance-iyo-sky').preMatchAdrenaline, 2);
  assert.equal(card('charlotte-flair-figure-eight-leglock').submission.pressure, 7);
  assert.equal(card('austin-theory-a-town-down').damage, 16);
  assert.equal(card('montez-ford-from-the-heavens').cost, 8);
  assert.equal(card('roxanne-perez-pop-rox').damage, 16);
  assert.equal(star('el-grande-americano').ability.maxUses, 2);
  assert.equal(star('lola-vice').ability.trigger.adrenaline, 1);
  assert.equal(card('lola-vice-305').damage, 16);
  assert.equal(card('doink-stump-puller').submission.pressure, 5);
  assert.equal(card('doink-whoopee-cushion').cost, 9);
  assert.equal(card('owen-hart-sharpshooter').submission.pressure, 6);
  assert.equal(star('andre-the-giant').ability.trigger.discount, 1);
  assert.equal(star('andre-the-giant').ability.trigger.damage, 2);
  assert.equal(card('randy-savage-flying-elbow-drop').cost, 9);
  assert.equal(card('rowdy-roddy-piper-bulldog').searchOnConnectDiscount, 2);
  assert.equal(card('rowdy-roddy-piper-sleeper-hold').submission.pressure, 6);
  assert.equal(star('mr-perfect').ability.trigger.discount, 2);
  assert.equal(card('special-mr-perfect').special.look, 7);
  assert.equal(star('chyna').ability.trigger.maxUses, 2);
});

test('v0.13.83 Oba Destroyer blocks Auto Counter but preserves the normal Counter window', () => {
  const g = engineFor('oba-femi');
  const s = g.state(), p = s.players.p1;
  const special = moveExistingCardToHand(p, 'special-oba-femi');
  assert.equal(special.special.type, 'nextStrengthNoAutoCounter');
  g._triggerConnectSpecial('p1', card('body-slam'));
  assert.equal(p.events.nextStrengthNoAutoCounter, true);
  p.hand.push(card('body-slam'));
  p.momentum.strength = 10; p.adrenaline = 10;
  s.phase='ACTION'; s.playerInControl='p1';
  assert.equal(g.declareMove('p1', p.hand.at(-1)), true);
  assert.equal(s.phase, 'COUNTER');
  assert.equal(s.proposedMove.noAutoCounter, true);
  const eligibility = autoCounterEligibility(s, 'p2', s.proposedMove.card);
  assert.equal(eligibility.legal, false);
});

test('v0.13.83 Lola Counter Striker grants Adrenaline as well as the pending Strike buff', () => {
  const g = engineFor('lola-vice');
  const s = g.state(), p = s.players.p1;
  p.adrenaline = 1;
  assert.equal(g._ability('p1','counter',{incoming:card('body-slam'),counter:card('punch')}), true);
  assert.equal(p.adrenaline, 2);
  assert.deepEqual(p.events.lolaCounterStrikerPending, {discount:1,damage:1});
});

test('v0.13.83 Owen King of Harts draws once per Control sequence on a different-method Technical/Agility chain and still retains one failed Pin', () => {
  const g = engineFor('owen-hart');
  const s = g.state(), p = s.players.p1;
  const before = p.hand.length;
  assert.equal(g._ability('p1','connect',{card:card('fisherman-suplex'),damage:6}), false);
  assert.equal(g._ability('p1','connect',{card:card('dropkick'),damage:3}), true);
  assert.equal(p.hand.length, before + 1);
  assert.equal(g._ability('p1','connect',{card:card('dragon-suplex'),damage:8}), false);
  g._resetControlSequenceState('p1');
  const before2 = p.hand.length;
  assert.equal(g._ability('p1','connect',{card:card('dropkick'),damage:3}), false);
  assert.equal(g._ability('p1','connect',{card:card('fisherman-suplex'),damage:6}), true);
  assert.equal(p.hand.length, before2 + 1);
  assert.equal(g._ability('p1','failedPin',{}), true);
  assert.equal(g._ability('p1','failedPin',{}), false);
});

test('v0.13.83 Becky Tap or Snap can route to Manhandle Slam or Dis-arm-her', () => {
  {
    const g=engineFor('becky-lynch'); const s=g.state(),p=s.players.p1,d=s.players.p2;
    moveExistingCardToHand(p,'special-becky-lynch');
    d.posture='standing';
    g._triggerCounterSpecial('p1',false);
    assert.ok(p.hand.some(c=>c.name==='Manhandle Slam'));
    assert.equal(p.namedDiscount['Manhandle Slam'],2);
  }
  {
    const g=engineFor('becky-lynch'); const s=g.state(),p=s.players.p1,d=s.players.p2;
    moveExistingCardToHand(p,'special-becky-lynch');
    d.posture='on-mat';
    g._triggerCounterSpecial('p1',false);
    assert.ok(p.hand.some(c=>c.name==='Dis-arm-her'));
    assert.equal(p.namedDiscount['Dis-arm-her'],2);
  }
});

test('v0.13.83 Million Dollar Championship can convert an existing Trademark into the Million Dollar Dream route', () => {
  const g=engineFor('ted-dibiase'); const s=g.state(),p=s.players.p1;
  moveExistingCardToHand(p,'special-ted-dibiase');
  moveExistingCardToHand(p,'ted-dibiase-backbreaker');
  s.phase='ACTION'; s.playerInControl='p1';
  const special=p.hand.find(c=>c.id==='special-ted-dibiase');
  assert.equal(g.playSpecial('p1',special),true);
  assert.ok(p.hand.some(c=>c.id==='ted-dibiase-million-dollar-dream'));
  assert.equal(p.namedDiscount['Million Dollar Dream'],1);
});

test('v0.13.83 Triple H Cerebral Assassin accepts a Technical setup and Chyna Ninth Wonder caps at two match uses', () => {
  {
    const g=engineFor('triple-h'); const s=g.state(),a=s.players.p1,d=s.players.p2;
    a.events.connectedMethodsThisControl.technical=true;
    const move=card('body-slam'); const hp=d.hp;
    s.phase='RESOLVE_MOVE'; s.proposedMove={attackerId:'p1',defenderId:'p2',card:move};
    g._connect();
    assert.equal(hp-d.hp, (move.damage??0)+1);
    assert.equal(a.abilityUses,1);
  }
  {
    const g=engineFor('chyna'); const s=g.state(),a=s.players.p1;
    const move=card('chyna-gorilla-press-slam');
    for(let i=0;i<3;i++){
      g._resetControlSequenceState('p1');
      s.phase='RESOLVE_MOVE'; s.proposedMove={attackerId:'p1',defenderId:'p2',card:move};
      g._connect();
      if(s.phase==='MATCH_OVER') break;
    }
    assert.equal(a.abilityUses,2);
  }
});
