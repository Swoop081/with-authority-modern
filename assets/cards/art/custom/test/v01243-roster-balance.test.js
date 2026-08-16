import test from 'node:test';
import assert from 'node:assert/strict';
import { allGameplayCards } from '../js/data/content.js?v=0.12.55';
import { superstars } from '../js/data/superstars.js?v=0.12.55';
import { decks } from '../js/data/decks.js?v=0.12.55';
import { MatchEngine } from '../js/engine/MatchEngine.js?v=0.12.55';

const stars=Object.values(superstars);
const star=id=>stars.find(s=>s.id===id);
const card=id=>allGameplayCards.find(c=>c.id===id);

test('v0.12.43 roster durability locks preserve prestige hierarchy and balanced normal range tuning',()=>{
  const hp={
    'the-rock':70,'goldberg':68,'mankind':68,'ultimate-warrior':67,'brock-lesnar':67,
    'andre-the-giant':66,'stephanie-vaquer':66,'danhausen':66,'charlotte-flair':65,
    'gunther':65,'bron-breakker':65,'paige':64,'becky-lynch':64,'cm-punk':63,
    'rhea-ripley':63,'randy-orton':63,'kevin-owens':62,'oba-femi':62,'jacob-fatu':62,
    'jade-cargill':62,'logan-paul':61,'chad-gable':61,'damian-priest':61,'solo-sikoa':61,
    'rey-mysterio':60,'randy-savage':59,'raquel-rodriguez':59
  };
  for(const [id,value] of Object.entries(hp))assert.equal(star(id)?.hp,value,id);
  assert.ok(star('the-rock').hp>star('andre-the-giant').hp);
  assert.ok(star('goldberg').hp>star('andre-the-giant').hp);
});

test('v0.12.43 submission-specialist identity tuning matches persistent-body-part system',()=>{
  const pressure={
    'paige-pto':5,'charlotte-flair-figure-eight-leglock':6,'chad-gable-ankle-lock':6,
    'gunther-gojira-clutch':6,'brock-lesnar-kimura-lock':6,'bron-breakker-steiner-recliner':6,
    'rhea-ripley-prism-trap':5
  };
  for(const [id,value] of Object.entries(pressure)){
    const c=card(id); assert.equal(c.damage,0,id); assert.equal(c.submission.pressure,value,id);
    assert.ok(c.rulesText.includes(`+${value} persistent`),`${id} rules text must match pressure`);
  }
  const punk=star('cm-punk');
  assert.equal(punk.ability.trigger.maxUses,3);
  assert.equal(punk.ability.trigger.draw,1);
  assert.equal(punk.ability.trigger.adrenaline,1);
  assert.deepEqual(card('cm-punk-anaconda-vise').effects,[{type:'drawSelf',amount:1}]);
});

test('v0.12.43 identity engines keep refined card-flow and signature setup tuning',()=>{
  const mankind=star('mankind');
  assert.deepEqual(mankind.ability.trigger,{type:'reduceIncoming',minDamage:7,maxUses:3,reduce:3});
  const warrior=star('ultimate-warrior');
  assert.equal(warrior.ability.trigger.maxUses,2); assert.equal(warrior.ability.trigger.draw,1); assert.equal(warrior.ability.trigger.adrenaline,1);
  const logan=star('logan-paul');
  assert.equal(logan.ability.trigger.drawAfterStrikeAgility,1); assert.equal(logan.ability.trigger.drawUses,1); assert.equal(logan.ability.maxUses,2);
  assert.deepEqual([card('logan-paul-knockout-punch').cost,card('logan-paul-knockout-punch').damage],[9,8]);
  assert.deepEqual([card('logan-paul-paulverizer').cost,card('logan-paul-paulverizer').damage],[11,13]);
  assert.equal(star('danhausen').ability.trigger.maxUses,3);
  const knee=card('danhausen-very-nice-knee-vil');
  const search=knee.effects.find(e=>e.type==='search'); assert.deepEqual(search,{type:'search',name:'Triple D',discount:3});
  assert.equal(star('chad-gable').ability.trigger.drawUses,2);
});

test('v0.12.43 Mr. Socko applies +2 real Mandible Claw submission damage, not a cost discount',()=>{
  const m=star('mankind'),opp=star('cm-punk');
  const g=new MatchEngine({p1:m,p2:opp,decks,rng:()=>0.42});
  const s=g.state(),a=s.players.p1,d=s.players.p2,c=card('mankind-mandible-claw');
  a.events.sockoMandiblePressure=2;
  s.phase='COUNTER'; s.playerInControl='p1';
  s.proposedMove={attackerId:'p1',defenderId:'p2',card:c};
  const before=d.submissionDamage.head;
  g._connect();
  assert.equal(d.submissionDamage.head,before+7);
  assert.equal(s.submission.damage,7);
  assert.equal(a.namedDiscount?.['Mandible Claw'],undefined);
});
