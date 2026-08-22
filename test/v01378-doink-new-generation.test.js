import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { sets } from '../js/data/sets.js?v=0.14.00';
import { superstars } from '../js/data/superstars.js?v=0.14.00';
import { decks } from '../js/data/decks.js?v=0.14.00';
import { allGameplayCards } from '../js/data/content.js?v=0.14.00';
import { CARD_NUMBER_BY_ID, CARD_IDS_BY_SET } from '../js/data/card-number-manifest.js?v=0.14.00';
import { boosterEligible } from '../js/data/boosters.js?v=0.14.00';
import { MatchEngine } from '../js/engine/MatchEngine.js?v=0.14.00';
import { canAttemptPin, canPlaySpecial } from '../js/engine/rules.js?v=0.14.00';

const doink=Object.values(superstars).find(s=>s.id==='doink-the-clown');
const byId=Object.fromEntries(allGameplayCards.map(c=>[c.id,c]));
await import('../js/data/superstar-nameplates.js?v=0.14.00');

const shared=[
 ['monkey-flip','Monkey Flip','NG1-029',1,3,5,'agility',{agility:1},'front-control'],
 ['headlock-takeover','Headlock Takeover','NG1-030',1,2,3,'technical',{technical:1},'front-control'],
 ['eye-rake','Eye Rake','NG1-031',1,2,3,'strike',{strike:1},'arm-extended'],
 ['hair-pull-takedown','Hair-Pull Takedown','NG1-032',1,2,3,'technical',{technical:1},'rear-control'],
 ['schoolboy-roll-up','Schoolboy Roll-Up','NG1-033',2,3,4,'technical',{technical:1},'front-control'],
 ['reverse-chinlock','Reverse Chinlock','NG1-034',2,4,0,'technical',{technical:2},'rear-control'],
];

test('v0.13.78 expands the scheduled New Generation plan to eight and adds Doink as the fifth authored Superstar',()=>{
  assert.deepEqual(sets['new-generation-series-1'].plannedSuperstarIds,['bret-hart','shawn-michaels','diesel','razor-ramon','doink-the-clown','yokozuna','owen-hart','british-bulldog']);
  assert.ok(doink); assert.equal(doink.hp,60); assert.equal(doink.nickname,'The Evil Clown'); assert.equal(doink.developmentOnly,false);
  assert.deepEqual(doink.starterMomentum,{technical:6,agility:4,strike:2});
  assert.deepEqual(doink.methodLimits,{technical:null,agility:4,strike:2,strength:0});
  assert.equal(doink.ability.name,'The Joke’s on You!'); assert.deepEqual(doink.ability.trigger,{type:'counterDraw',maxUses:2,draw:1});
  assert.equal(decks['doink-the-clown'].length,60); assert.equal(decks['doink-the-clown'].filter(c=>c.kind==='momentum').length,12);
  assert.deepEqual(decks['doink-the-clown'].slice(0,5).map(c=>c.id),['momentum-technical','momentum-agility','headlock-takeover','monkey-flip','eye-rake']);
});

test('v0.13.78 adds the six approved shared Common/Uncommon New Generation cards as NG1-029 through NG1-034',()=>{
  const releaseDay=new Date(2026,8,5,12);
  for(const [id,name,code,rarity,cost,damage,method,requirements,counterState] of shared){
    const c=byId[id]; assert.ok(c,id); assert.equal(c.name,name); assert.equal(c.setId,'new-generation-series-1'); assert.equal(c.superstarId,null); assert.equal(c.boosterOnly,true);
    assert.equal(c.rarity,rarity); assert.equal(c.cost,cost); assert.equal(c.damage,damage); assert.equal(c.method,method); assert.deepEqual(c.requirements,requirements); assert.equal(c.counterState,counterState);
    assert.equal(CARD_NUMBER_BY_ID[id]?.cardCode,code); assert.equal(boosterEligible(c,releaseDay),true);
  }
  assert.equal(byId['reverse-chinlock'].groundedOnly,true); assert.deepEqual(byId['reverse-chinlock'].submission,{bodyPart:'head',pressure:3});
});

test('v0.13.78 Doink owns NG1-035 through NG1-041 with the approved two-chain trickster package',()=>{
  const ids=['doink-drop-toe-hold','doink-stump-puller','doink-flying-body-press','doink-whoopee-cushion','entrance-doink-the-clown','special-doink-the-clown','superstar-doink-the-clown'];
  assert.deepEqual(ids.map(id=>CARD_NUMBER_BY_ID[id]?.cardCode),['NG1-035','NG1-036','NG1-037','NG1-038','NG1-039','NG1-040','NG1-041']);
  for(const id of ids.slice(0,3)){assert.equal(byId[id].rarity,3,id); assert.equal(byId[id].trademark,true,id); assert.equal(byId[id].superstarId,'doink-the-clown',id);}
  assert.deepEqual(byId['doink-drop-toe-hold'].effects,[{type:'discountNextByName',name:'Stump Puller',amount:1}]);
  assert.deepEqual(byId['doink-stump-puller'].submission,{bodyPart:'legs',pressure:5});
  assert.deepEqual(byId['doink-flying-body-press'].effects,[{type:'search',name:'Whoopee Cushion',discount:1}]);
  const fin=byId['doink-whoopee-cushion']; assert.equal(fin.rarity,4); assert.equal(fin.finisher,true); assert.equal(fin.cost,9); assert.equal(fin.damage,17); assert.deepEqual(fin.requirements,{}); assert.equal(fin.method,null); assert.equal(fin.groundedOnly,true);
  assert.equal(byId['entrance-doink-the-clown'].name,'Send in the Clown'); assert.deepEqual(byId['entrance-doink-the-clown'].preMatchMomentum,{technical:1,agility:1}); assert.equal(byId['entrance-doink-the-clown'].preMatchAdrenaline,1);
  assert.equal(byId['special-doink-the-clown'].name,'Clowning Around'); assert.deepEqual(byId['special-doink-the-clown'].special,{type:'doinkClowningAround',look:5});
  assert.equal(CARD_IDS_BY_SET['new-generation-series-1'].slice(0,41).at(-1),'superstar-doink-the-clown');
  assert.ok(CARD_IDS_BY_SET['new-generation-series-1'].length>=41);
});

test('v0.13.78 The Joke’s on You and Clowning Around execute through player/CPU-safe engine paths',()=>{
  const opp=Object.values(superstars).find(s=>s.id!==doink.id&&!s.developmentOnly);
  const g=new MatchEngine({p1:doink,p2:opp,decks,rng:()=>0.42}); const st=g.state(),p=st.players.p1;
  p.deck=[{...byId['headlock-takeover'],instanceId:'filler'}]; const before=p.hand.length; assert.equal(g._ability('p1','counter',{incoming:byId['eye-rake'],counter:byId['jawbreaker']}),true); assert.equal(p.hand.length,before+1); assert.equal(g._ability('p1','counter',{incoming:byId['eye-rake'],counter:byId['jawbreaker']}),true); assert.equal(g._ability('p1','counter',{incoming:byId['eye-rake'],counter:byId['jawbreaker']}),false);
  const special={...byId['special-doink-the-clown'],instanceId:'clowning'}; p.hand=[special]; p.deck=[{...byId['doink-drop-toe-hold'],instanceId:'tm'},{...byId['jawbreaker'],instanceId:'counter'},{...byId['eye-rake'],instanceId:'x1'},{...byId['headlock-takeover'],instanceId:'x2'},{...byId['monkey-flip'],instanceId:'x3'}]; p.usedSpecialIds=[]; p.specialUsed=false; st.phase='ACTION'; st.playerInControl='p1';
  assert.equal(canPlaySpecial(st,'p1',special),true); assert.equal(g.playSpecial('p1',special),true); assert.ok(st.pendingTopDeckTutorChoice); assert.deepEqual(new Set(st.pendingTopDeckTutorChoice.eligibleIds),new Set(['doink-drop-toe-hold','jawbreaker']));
  assert.equal(g.resolveTopDeckTutorChoice('p1','doink-drop-toe-hold'),true); assert.ok(p.hand.some(c=>c.id==='doink-drop-toe-hold')); assert.equal(st.pendingTopDeckTutorChoice,null);
});

test('v0.13.78 Schoolboy Roll-Up preserves the immediate legal pin window and Doink is in Studio/nameplates',()=>{
  const opp=Object.values(superstars).find(s=>s.id!==doink.id&&!s.developmentOnly);
  const g=new MatchEngine({p1:doink,p2:opp,decks,rng:()=>0.42}); const st=g.state(),a=st.players.p1,d=st.players.p2,roll={...byId['schoolboy-roll-up'],instanceId:'roll'};
  a.momentum.technical=5; a.adrenaline=5; d.hp=10; st.phase='RESOLVE_MOVE'; st.playerInControl='p1'; st.proposedMove={attackerId:'p1',defenderId:'p2',card:roll}; g._connect(); assert.equal(canAttemptPin(st,'p1').legal,true);
  const studio=fs.readFileSync(new URL('../js/tools/card-art-studio-data.js',import.meta.url),'utf8');
  assert.match(studio,/"id":"superstar-doink-the-clown"[\s\S]{0,260}"cardCode":"NG1-041"/); assert.match(studio,/"id":"doink-the-clown","name":"Doink the Clown","setId":"new-generation-series-1"/);
  assert.ok(globalThis.WWE_LEGACY_SUPERSTAR_NAMEPLATES['doink-the-clown']);
});
