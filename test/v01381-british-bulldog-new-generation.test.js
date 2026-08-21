import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { sets } from '../js/data/sets.js?v=0.13.92';
import { superstars } from '../js/data/superstars.js?v=0.13.92';
import { decks } from '../js/data/decks.js?v=0.13.92';
import { allGameplayCards } from '../js/data/content.js?v=0.13.92';
import { CARD_NUMBER_BY_ID, CARD_IDS_BY_SET } from '../js/data/card-number-manifest.js?v=0.13.92';
import { boosterEligible } from '../js/data/boosters.js?v=0.13.92';
import { MatchEngine } from '../js/engine/MatchEngine.js?v=0.13.92';
import { canPlaySpecial } from '../js/engine/rules.js?v=0.13.92';
await import('../js/data/superstar-nameplates.js?v=0.13.92');

const bulldog=Object.values(superstars).find(s=>s.id==='british-bulldog');
const byId=Object.fromEntries(allGameplayCards.map(c=>[c.id,c]));
const shared=[
 ['standing-dropkick','Standing Dropkick','NG1-068',1,3,5,'agility',{agility:1},'leg-extended'],
 ['hammerlock-takedown','Hammerlock Takedown','NG1-069',1,2,3,'technical',{technical:1},'rear-control'],
 ['running-knee-lift','Running Knee Lift','NG1-070',1,3,5,'strike',{strike:1},'leg-extended'],
 ['shoulder-breaker','Shoulder Breaker','NG1-071',1,3,5,'strength',{strength:1},'body-elevated'],
 ['front-powerslam','Front Powerslam','NG1-072',2,4,7,'strength',{strength:2},'body-elevated'],
 ['full-nelson','Full Nelson','NG1-073',2,4,0,'strength',{strength:2},'rear-control'],
];
function opponentFor(star){return Object.values(superstars).find(s=>s.id!==star.id&&!s.developmentOnly);}

test('v0.13.81 completes New Generation Series 1 with British Bulldog as the eighth authored Superstar',()=>{
  assert.deepEqual(sets['new-generation-series-1'].plannedSuperstarIds,['bret-hart','shawn-michaels','diesel','razor-ramon','doink-the-clown','yokozuna','owen-hart','british-bulldog']);
  assert.ok(bulldog); assert.equal(bulldog.hp,67); assert.equal(bulldog.developmentOnly,false);
  assert.deepEqual(bulldog.starterMomentum,{strength:6,technical:4,strike:1,agility:1});
  assert.deepEqual(bulldog.methodLimits,{strength:null,technical:4,strike:2,agility:2});
  assert.equal(bulldog.ability.name,'Power & Technique'); assert.deepEqual(bulldog.ability.trigger,{type:'bulldogPowerAndTechnique',discount:1});
  assert.equal(decks['british-bulldog'].length,60); assert.equal(decks['british-bulldog'].filter(c=>c.kind==='momentum').length,12);
  assert.deepEqual(decks['british-bulldog'].slice(0,5).map(c=>c.id),['momentum-strength','momentum-technical','hammerlock-takedown','running-shoulder-block','side-suplex']);
  assert.equal(decks['british-bulldog'].filter(c=>['standing-switch','block','rollover-counter','catch-the-foot','sidestep','dodge','jawbreaker'].includes(c.id)).length,9);
});

test('v0.13.81 adds the six approved shared New Generation Commons/Uncommons as NG1-068 through NG1-073',()=>{
  const releaseDay=new Date(2026,8,5,12);
  for(const [id,name,code,rarity,cost,damage,method,requirements,counterState] of shared){
    const c=byId[id]; assert.ok(c,id); assert.equal(c.name,name); assert.equal(c.setId,'new-generation-series-1'); assert.equal(c.superstarId,null); assert.equal(c.boosterOnly,true);
    assert.equal(c.rarity,rarity); assert.equal(c.cost,cost); assert.equal(c.damage,damage); assert.equal(c.method,method); assert.deepEqual(c.requirements,requirements); assert.equal(c.counterState,counterState);
    assert.equal(CARD_NUMBER_BY_ID[id]?.cardCode,code); assert.equal(boosterEligible(c,releaseDay),true);
  }
  assert.deepEqual(byId['hammerlock-takedown'].bodyDamage,{bodyPart:'arms',amount:1});
  assert.deepEqual(byId['shoulder-breaker'].bodyDamage,{bodyPart:'arms',amount:1});
  assert.equal(byId['full-nelson'].standingOnly,true); assert.deepEqual(byId['full-nelson'].submission,{bodyPart:'arms',pressure:3}); assert.equal(byId['full-nelson'].submissionTarget,'arms');
});

test('v0.13.81 British Bulldog owns NG1-074 through NG1-080 with the approved Running Powerslam package',()=>{
  const ids=['british-bulldog-delayed-vertical-suplex','british-bulldog-crucifix','british-bulldog-military-press-slam','british-bulldog-running-powerslam','entrance-british-bulldog','special-british-bulldog','superstar-british-bulldog'];
  assert.deepEqual(ids.map(id=>CARD_NUMBER_BY_ID[id]?.cardCode),['NG1-074','NG1-075','NG1-076','NG1-077','NG1-078','NG1-079','NG1-080']);
  for(const id of ids.slice(0,3)){assert.equal(byId[id].rarity,3,id); assert.equal(byId[id].trademark,true,id); assert.equal(byId[id].superstarId,'british-bulldog',id);}
  assert.deepEqual(byId['british-bulldog-delayed-vertical-suplex'].effects,[{type:'discountNextMethod',method:'technical',amount:1}]);
  assert.deepEqual(byId['british-bulldog-military-press-slam'].effects,[{type:'search',name:'Bulldog’s Running Powerslam',discount:1}]);
  const fin=byId['british-bulldog-running-powerslam']; assert.equal(fin.rarity,4); assert.equal(fin.finisher,true); assert.equal(fin.cost,10); assert.equal(fin.damage,17); assert.deepEqual(fin.requirements,{}); assert.equal(fin.method,null); assert.equal(fin.counterState,'body-elevated');
  assert.equal(byId['entrance-british-bulldog'].name,'Rule Britannia'); assert.deepEqual(byId['entrance-british-bulldog'].preMatchMomentum,{strength:1,technical:1}); assert.equal(byId['entrance-british-bulldog'].preMatchAdrenaline,1);
  assert.equal(byId['special-british-bulldog'].name,'Made in Britain'); assert.deepEqual(byId['special-british-bulldog'].special,{type:'bulldogMadeInBritain',methods:['strength','technical'],maxRarity:2});
  assert.equal(CARD_IDS_BY_SET['new-generation-series-1'].length,80);
});

test('v0.13.81 Power & Technique discounts only the next Strength Move and only once per Control sequence',()=>{
  const opp=opponentFor(bulldog); const g=new MatchEngine({p1:bulldog,p2:opp,decks,rng:()=>0.42}); const st=g.state(),p=st.players.p1;
  const tech={...byId['hammerlock-takedown'],instanceId:'tech'};
  const tech2={...byId['side-suplex'],instanceId:'tech2'};
  st.phase='RESOLVE_MOVE'; st.playerInControl='p1'; st.proposedMove={attackerId:'p1',defenderId:'p2',card:tech}; g._connect();
  assert.equal(p.methodDiscount.strength,1); assert.equal(p.events.bulldogPowerTechniqueUsedThisControl,true);
  st.players.p2.posture='standing'; st.phase='RESOLVE_MOVE'; st.proposedMove={attackerId:'p1',defenderId:'p2',card:tech2}; g._connect();
  assert.equal(p.methodDiscount.strength,1,'second Technical connection in the same sequence must not stack the ability');
  const strength={...byId['front-powerslam'],instanceId:'strength'}; st.players.p2.posture='standing'; st.phase='RESOLVE_MOVE'; st.proposedMove={attackerId:'p1',defenderId:'p2',card:strength}; g._connect();
  assert.equal(p.methodDiscount.strength,undefined,'the next Strength Move consumes the discount');
  g._restartControlSequence('p1'); assert.equal(p.events.bulldogPowerTechniqueUsedThisControl,undefined);
});

test('v0.13.81 Made in Britain searches one low-rarity Strength and one low-rarity Technical Move, then shuffles',()=>{
  const opp=opponentFor(bulldog); const g=new MatchEngine({p1:bulldog,p2:opp,decks,rng:()=>0.42}); const st=g.state(),p=st.players.p1;
  const special={...byId['special-british-bulldog'],instanceId:'made'};
  p.hand=[special]; p.deck=[
    {...byId['front-powerslam'],instanceId:'strength'},
    {...byId['bridging-german-suplex'],instanceId:'technical'},
    {...byId['british-bulldog-delayed-vertical-suplex'],instanceId:'rare'},
    {...byId['standing-dropkick'],instanceId:'agility'},
  ];
  p.usedSpecialIds=[]; p.specialUsed=false; st.phase='ACTION'; st.playerInControl='p1';
  assert.equal(canPlaySpecial(st,'p1',special),true); assert.equal(g.playSpecial('p1',special),true);
  assert.ok(p.hand.some(c=>c.id==='front-powerslam')); assert.ok(p.hand.some(c=>c.id==='bridging-german-suplex'));
  assert.equal(p.hand.some(c=>c.id==='british-bulldog-delayed-vertical-suplex'),false); assert.equal(p.deck.length,2);
  assert.ok(st.log.some(e=>e.type==='SPECIAL_EFFECT'&&e.effect==='made-in-britain'&&e.searchedCardIds?.length===2));
});

test('v0.13.81 British Bulldog completes the New Generation Studio/nameplate roster and the set is gap-free through NG1-080',()=>{
  const studio=fs.readFileSync(new URL('../js/tools/card-art-studio-data.js',import.meta.url),'utf8');
  assert.match(studio,/"id":"superstar-british-bulldog"[\s\S]{0,260}"cardCode":"NG1-080"/); assert.match(studio,/"id":"british-bulldog","name":"British Bulldog","setId":"new-generation-series-1"/);
  assert.ok(globalThis.WWE_LEGACY_SUPERSTAR_NAMEPLATES['british-bulldog']);
  const codes=CARD_IDS_BY_SET['new-generation-series-1'].map(id=>CARD_NUMBER_BY_ID[id].cardCode);
  assert.deepEqual(codes,Array.from({length:80},(_,i)=>`NG1-${String(i+1).padStart(3,'0')}`));
});
