import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { superstars } from '../js/data/superstars.js?v=0.14.00';
import { decks } from '../js/data/decks.js?v=0.14.00';
import { allGameplayCards } from '../js/data/content.js?v=0.14.00';
import { CARD_NUMBER_BY_ID, CARD_IDS_BY_SET } from '../js/data/card-number-manifest.js?v=0.14.00';
import { boosterEligible } from '../js/data/boosters.js?v=0.14.00';
import { MatchEngine } from '../js/engine/MatchEngine.js?v=0.14.00';
import { canPlaySpecial } from '../js/engine/rules.js?v=0.14.00';
await import('../js/data/superstar-nameplates.js?v=0.14.00');

const yoko=Object.values(superstars).find(s=>s.id==='yokozuna');
const byId=Object.fromEntries(allGameplayCards.map(c=>[c.id,c]));
const shared=[
 ['forearm-club','Forearm Club','NG1-042',1,2,3,'strike',{strike:1},'arm-extended'],
 ['running-shoulder-block','Running Shoulder Block','NG1-043',1,3,5,'strength',{strength:1},'running-aerial'],
 ['side-suplex','Side Suplex','NG1-044',1,3,5,'technical',{technical:1},'rear-control'],
 ['club-to-the-back','Club to the Back','NG1-045',1,2,3,'strike',{strike:1},'arm-extended'],
 ['running-body-avalanche','Running Body Avalanche','NG1-046',2,4,7,'strength',{strength:2},'running-aerial'],
 ['nerve-hold','Nerve Hold','NG1-047',2,4,0,'strength',{strength:2},'rear-control'],
];

test('v0.13.79 adds Yokozuna as the sixth authored New Generation Superstar with the approved super-heavyweight profile',()=>{
  assert.ok(yoko); assert.equal(yoko.hp,71); assert.equal(yoko.nickname,'The Great Yokozuna'); assert.equal(yoko.developmentOnly,false);
  assert.deepEqual(yoko.starterMomentum,{strength:8,strike:3,technical:1});
  assert.deepEqual(yoko.methodLimits,{strength:null,strike:3,technical:1,agility:0});
  assert.equal(yoko.ability.name,'Super Heavyweight'); assert.deepEqual(yoko.ability.trigger,{type:'superHeavyweightGroundResist',maxUses:2});
  assert.equal(decks.yokozuna.length,60); assert.equal(decks.yokozuna.filter(c=>c.kind==='momentum').length,12);
  assert.deepEqual(decks.yokozuna.slice(0,5).map(c=>c.id),['momentum-strength','momentum-strike','forearm-club','running-shoulder-block','body-slam']);
  assert.equal(decks.yokozuna.filter(c=>c.id==='block').length,2);
  assert.equal(decks.yokozuna.filter(c=>['block','dodge','sidestep','standing-switch','rollover-counter','jawbreaker'].includes(c.id)).length,7);
});

test('v0.13.79 adds six approved shared New Generation Commons/Uncommons as NG1-042 through NG1-047',()=>{
  const releaseDay=new Date(2026,8,5,12);
  for(const [id,name,code,rarity,cost,damage,method,requirements,counterState] of shared){
    const c=byId[id]; assert.ok(c,id); assert.equal(c.name,name); assert.equal(c.setId,'new-generation-series-1'); assert.equal(c.superstarId,null); assert.equal(c.boosterOnly,true);
    assert.equal(c.rarity,rarity); assert.equal(c.cost,cost); assert.equal(c.damage,damage); assert.equal(c.method,method); assert.deepEqual(c.requirements,requirements); assert.equal(c.counterState,counterState);
    assert.equal(CARD_NUMBER_BY_ID[id]?.cardCode,code); assert.equal(boosterEligible(c,releaseDay),true);
  }
  assert.deepEqual(byId['club-to-the-back'].bodyDamage,{bodyPart:'back',amount:1});
  assert.equal(byId['nerve-hold'].groundedOnly,true); assert.deepEqual(byId['nerve-hold'].submission,{bodyPart:'arms',pressure:3}); assert.equal(byId['nerve-hold'].submissionTarget,'arms');
});

test('v0.13.79 Yokozuna owns NG1-048 through NG1-054 with the approved Banzai package',()=>{
  const ids=['yokozuna-savate-kick','yokozuna-belly-to-belly-suplex','yokozuna-running-leg-drop','yokozuna-banzai-drop','entrance-yokozuna','special-yokozuna','superstar-yokozuna'];
  assert.deepEqual(ids.map(id=>CARD_NUMBER_BY_ID[id]?.cardCode),['NG1-048','NG1-049','NG1-050','NG1-051','NG1-052','NG1-053','NG1-054']);
  for(const id of ids.slice(0,3)){assert.equal(byId[id].rarity,3,id); assert.equal(byId[id].trademark,true,id); assert.equal(byId[id].superstarId,'yokozuna',id);}
  assert.deepEqual(byId['yokozuna-savate-kick'].effects,[{type:'discountNextMethod',method:'strength',amount:1}]);
  assert.deepEqual(byId['yokozuna-belly-to-belly-suplex'].effects,[{type:'search',name:'Yokozuna’s Running Leg Drop',discount:1}]);
  assert.deepEqual(byId['yokozuna-running-leg-drop'].effects,[{type:'gainAdrenaline',amount:1}]); assert.equal(byId['yokozuna-running-leg-drop'].groundedOnly,true);
  const fin=byId['yokozuna-banzai-drop']; assert.equal(fin.rarity,4); assert.equal(fin.finisher,true); assert.equal(fin.cost,11); assert.equal(fin.damage,19); assert.deepEqual(fin.requirements,{}); assert.equal(fin.method,null); assert.equal(fin.groundedOnly,true); assert.equal(fin.counterState,'diving-aerial');
  assert.equal(byId['entrance-yokozuna'].name,'The Great Yokozuna'); assert.deepEqual(byId['entrance-yokozuna'].preMatchMomentum,{strength:1,strike:1}); assert.equal(byId['entrance-yokozuna'].preMatchAdrenaline,1);
  assert.equal(byId['special-yokozuna'].name,'Banzai!'); assert.deepEqual(byId['special-yokozuna'].special,{type:'yokozunaBanzai',name:'Banzai Drop',discount:2});
  assert.ok(CARD_IDS_BY_SET['new-generation-series-1'].length>=54);
  assert.equal(CARD_NUMBER_BY_ID['superstar-yokozuna']?.cardCode,'NG1-054');
});

test('v0.13.79 Super Heavyweight prevents the first two non-Finisher groundings but never stops a Finisher',()=>{
  const opp=Object.values(superstars).find(s=>s.id!==yoko.id&&!s.developmentOnly);
  const g=new MatchEngine({p1:opp,p2:yoko,decks,rng:()=>0.42}); const st=g.state(),d=st.players.p2;
  const hit={...byId['running-shoulder-block'],instanceId:'hit'};
  for(let i=1;i<=3;i++){
    d.posture='standing'; st.phase='RESOLVE_MOVE'; st.proposedMove={attackerId:'p1',defenderId:'p2',card:{...hit,instanceId:`hit-${i}`}}; g._connect();
    assert.equal(d.posture,i<=2?'standing':'on-mat'); assert.equal(d.abilityUses,Math.min(i,2));
  }
  d.posture='standing'; st.phase='RESOLVE_MOVE'; st.proposedMove={attackerId:'p1',defenderId:'p2',card:{...byId['doink-whoopee-cushion'],instanceId:'fin'}}; g._connect();
  assert.equal(d.posture,'on-mat'); assert.equal(d.abilityUses,2);
});

test('v0.13.79 Banzai! requires a grounded opponent, tutors Banzai Drop with -2 cost, and Yokozuna is in Studio/nameplates',()=>{
  const opp=Object.values(superstars).find(s=>s.id!==yoko.id&&!s.developmentOnly);
  const g=new MatchEngine({p1:yoko,p2:opp,decks,rng:()=>0.42}); const st=g.state(),p=st.players.p1,d=st.players.p2,special={...byId['special-yokozuna'],instanceId:'sp'},fin={...byId['yokozuna-banzai-drop'],instanceId:'fin'};
  p.hand=[special]; p.deck=[fin]; p.usedSpecialIds=[]; p.specialUsed=false; st.phase='ACTION'; st.playerInControl='p1'; d.posture='standing';
  assert.equal(canPlaySpecial(st,'p1',special),false);
  d.posture='on-mat'; assert.equal(canPlaySpecial(st,'p1',special),true); assert.equal(g.playSpecial('p1',special),true);
  assert.ok(p.hand.some(c=>c.id==='yokozuna-banzai-drop')); assert.equal(p.namedDiscount['Banzai Drop'],2);
  const studio=fs.readFileSync(new URL('../js/tools/card-art-studio-data.js',import.meta.url),'utf8');
  assert.match(studio,/"id":"superstar-yokozuna"[\s\S]{0,260}"cardCode":"NG1-054"/); assert.match(studio,/"id":"yokozuna","name":"Yokozuna","setId":"new-generation-series-1"/);
  assert.ok(globalThis.WWE_LEGACY_SUPERSTAR_NAMEPLATES.yokozuna);
});
