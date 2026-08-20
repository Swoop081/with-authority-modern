import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { sets } from '../js/data/sets.js?v=0.13.81';
import { superstars } from '../js/data/superstars.js?v=0.13.81';
import { decks } from '../js/data/decks.js?v=0.13.81';
import { allGameplayCards } from '../js/data/content.js?v=0.13.81';
import { CARD_NUMBER_BY_ID, CARD_IDS_BY_SET } from '../js/data/card-number-manifest.js?v=0.13.81';
import { boosterEligible } from '../js/data/boosters.js?v=0.13.81';
import { MatchEngine } from '../js/engine/MatchEngine.js?v=0.13.81';
import { canAttemptPin, canPlaySpecial } from '../js/engine/rules.js?v=0.13.81';
await import('../js/data/superstar-nameplates.js?v=0.13.81');

const owen=Object.values(superstars).find(s=>s.id==='owen-hart');
const byId=Object.fromEntries(allGameplayCards.map(c=>[c.id,c]));
const shared=[
 ['fisherman-suplex','Fisherman Suplex','NG1-055',1,3,5,'technical',{technical:1},'body-elevated'],
 ['wheel-kick','Wheel Kick','NG1-056',1,3,5,'agility',{agility:1},'leg-extended'],
 ['gutbuster','Gutbuster','NG1-057',1,3,5,'strength',{strength:1},'torso-trapped'],
 ['dropkick-to-the-knee','Dropkick to the Knee','NG1-058',1,2,3,'agility',{agility:1},'leg-extended'],
 ['bridging-german-suplex','Bridging German Suplex','NG1-059',2,4,7,'technical',{technical:2},'rear-control'],
 ['step-up-enzuigiri','Step-Up Enzuigiri','NG1-060',2,4,7,'strike',{strike:2},'leg-extended'],
];

function opponentFor(star){return Object.values(superstars).find(s=>s.id!==star.id&&!s.developmentOnly);}

test('v0.13.80 adds Owen Hart as the seventh authored New Generation Superstar with the approved all-rounder profile',()=>{
  assert.deepEqual(sets['new-generation-series-1'].plannedSuperstarIds,['bret-hart','shawn-michaels','diesel','razor-ramon','doink-the-clown','yokozuna','owen-hart','british-bulldog']);
  assert.ok(owen); assert.equal(owen.hp,62); assert.equal(owen.nickname,'The King of Harts'); assert.equal(owen.developmentOnly,false);
  assert.deepEqual(owen.starterMomentum,{technical:5,agility:3,strike:3,strength:1});
  assert.deepEqual(owen.methodLimits,{technical:null,agility:4,strike:4,strength:2});
  assert.equal(owen.ability.name,'King of Harts'); assert.deepEqual(owen.ability.trigger,{type:'retainControlAfterFailedPin',maxUses:1});
  assert.equal(decks['owen-hart'].length,60); assert.equal(decks['owen-hart'].filter(c=>c.kind==='momentum').length,12);
  assert.deepEqual(decks['owen-hart'].slice(0,5).map(c=>c.id),['momentum-technical','momentum-agility','fisherman-suplex','dropkick-to-the-knee','schoolboy-roll-up']);
  assert.equal(decks['owen-hart'].filter(c=>['standing-switch','rollover-counter','catch-the-foot','arm-drag-counter','jawbreaker','sidestep','dodge'].includes(c.id)).length,10);
});

test('v0.13.80 adds the six approved shared New Generation Commons/Uncommons as NG1-055 through NG1-060',()=>{
  const releaseDay=new Date(2026,8,5,12);
  for(const [id,name,code,rarity,cost,damage,method,requirements,counterState] of shared){
    const c=byId[id]; assert.ok(c,id); assert.equal(c.name,name); assert.equal(c.setId,'new-generation-series-1'); assert.equal(c.superstarId,null); assert.equal(c.boosterOnly,true);
    assert.equal(c.rarity,rarity); assert.equal(c.cost,cost); assert.equal(c.damage,damage); assert.equal(c.method,method); assert.deepEqual(c.requirements,requirements); assert.equal(c.counterState,counterState);
    assert.equal(CARD_NUMBER_BY_ID[id]?.cardCode,code); assert.equal(boosterEligible(c,releaseDay),true);
  }
  assert.deepEqual(byId.gutbuster.bodyDamage,{bodyPart:'back',amount:1});
  assert.deepEqual(byId['dropkick-to-the-knee'].bodyDamage,{bodyPart:'legs',amount:1});
  assert.equal(byId['bridging-german-suplex'].groundOpponent,true);
});

test('v0.13.80 Owen owns NG1-061 through NG1-067 with the approved Sharpshooter package',()=>{
  const ids=['owen-hart-enzuigiri','owen-hart-dragon-suplex','owen-hart-missile-dropkick','owen-hart-sharpshooter','entrance-owen-hart','special-owen-hart','superstar-owen-hart'];
  assert.deepEqual(ids.map(id=>CARD_NUMBER_BY_ID[id]?.cardCode),['NG1-061','NG1-062','NG1-063','NG1-064','NG1-065','NG1-066','NG1-067']);
  for(const id of ids.slice(0,3)){assert.equal(byId[id].rarity,3,id); assert.equal(byId[id].trademark,true,id); assert.equal(byId[id].superstarId,'owen-hart',id);}
  assert.deepEqual(byId['owen-hart-enzuigiri'].effects,[{type:'discountNextByName',name:'Owen’s Sharpshooter',amount:1}]);
  assert.deepEqual(byId['owen-hart-dragon-suplex'].effects,[{type:'search',name:'Owen’s Sharpshooter',discount:1}]);
  assert.equal(byId['owen-hart-missile-dropkick'].standingOnly,true); assert.deepEqual(byId['owen-hart-missile-dropkick'].effects,[{type:'gainAdrenaline',amount:1}]);
  const fin=byId['owen-hart-sharpshooter']; assert.equal(fin.rarity,4); assert.equal(fin.finisher,true); assert.equal(fin.cost,9); assert.equal(fin.damage,0); assert.deepEqual(fin.requirements,{}); assert.equal(fin.method,null); assert.equal(fin.groundedOnly,true); assert.deepEqual(fin.submission,{bodyPart:'legs',pressure:5}); assert.equal(fin.submissionTarget,'legs');
  assert.equal(byId['entrance-owen-hart'].name,'The King of Harts'); assert.deepEqual(byId['entrance-owen-hart'].preMatchMomentum,{technical:1,agility:1}); assert.equal(byId['entrance-owen-hart'].preMatchAdrenaline,1);
  assert.equal(byId['special-owen-hart'].name,'Two-Time Slammy Award Winner'); assert.deepEqual(byId['special-owen-hart'].special,{type:'owenSlammyAwards',look:7,maxChoices:2,maxRarity:2});
  assert.ok(CARD_IDS_BY_SET['new-generation-series-1'].length>=67);
});

test('v0.13.80 King of Harts retains Control after Owen first fails a Pin, but the second failure transfers Control normally',()=>{
  const opp=opponentFor(owen); const g=new MatchEngine({p1:owen,p2:opp,decks,rng:()=>0.99}); const st=g.state(),a=st.players.p1,d=st.players.p2;
  d.hp=Math.max(16,Math.floor(d.maxHp*.5));
  const armPinWindow=()=>{st.phase='ACTION';st.playerInControl='p1';st.postMove={attackerId:'p1',defenderId:'p2',cardId:'schoolboy-roll-up'};a.turn.momentumPlayed=0;a.turn.specialPlayed=0;};
  armPinWindow(); assert.equal(g.attemptPin('p1'),true); assert.equal(g.passPinResponse('p2'),true);
  assert.equal(a.abilityUses,1); assert.equal(st.playerInControl,'p1'); assert.equal(st.phase,'ACTION');
  armPinWindow(); assert.equal(g.attemptPin('p1'),true); assert.equal(g.passPinResponse('p2'),true);
  assert.equal(a.abilityUses,1); assert.equal(st.playerInControl,'p2');
});

test('v0.13.80 King of Harts also treats a played Pin Escape as a failed Owen Pin attempt',()=>{
  const opp=opponentFor(owen); const g=new MatchEngine({p1:owen,p2:opp,decks,rng:()=>0.99}); const st=g.state(),a=st.players.p1,d=st.players.p2;
  d.hp=Math.max(16,Math.floor(d.maxHp*.5)); st.phase='ACTION'; st.playerInControl='p1'; st.postMove={attackerId:'p1',defenderId:'p2',cardId:'schoolboy-roll-up'}; a.turn.momentumPlayed=0; a.turn.specialPlayed=0;
  const escape={...byId['shoulder-up'],instanceId:'escape'}; d.hand=[escape]; assert.equal(g.attemptPin('p1'),true); assert.equal(g.playPinEscape('p2',escape),true);
  assert.equal(a.abilityUses,1); assert.equal(st.playerInControl,'p1'); assert.equal(st.phase,'ACTION');
});

test('v0.13.80 Two-Time Slammy Award Winner reveals seven and can take up to two different 1★/2★ Moves',()=>{
  const opp=opponentFor(owen); const g=new MatchEngine({p1:owen,p2:opp,decks,rng:()=>0.42}); const st=g.state(),p=st.players.p1;
  const special={...byId['special-owen-hart'],instanceId:'slammy'};
  p.hand=[special]; p.deck=[
    {...byId['fisherman-suplex'],instanceId:'fish-a'},
    {...byId['fisherman-suplex'],instanceId:'fish-b'},
    {...byId['wheel-kick'],instanceId:'wheel'},
    {...byId['owen-hart-enzuigiri'],instanceId:'rare'},
    {...byId['fire-up'],instanceId:'action'},
    {...byId['step-up-enzuigiri'],instanceId:'step'},
    {...byId['gutbuster'],instanceId:'gut'},
  ];
  p.usedSpecialIds=[]; p.specialUsed=false; st.phase='ACTION'; st.playerInControl='p1';
  assert.equal(canPlaySpecial(st,'p1',special),true); assert.equal(g.playSpecial('p1',special),true);
  assert.ok(st.pendingTopDeckTutorChoice); assert.equal(st.pendingTopDeckTutorChoice.maxChoices,2); assert.deepEqual(new Set(st.pendingTopDeckTutorChoice.eligibleIds),new Set(['fisherman-suplex','wheel-kick','step-up-enzuigiri','gutbuster']));
  assert.equal(g.resolveTopDeckTutorChoice('p1','fisherman-suplex'),true); assert.ok(st.pendingTopDeckTutorChoice); assert.equal(st.pendingTopDeckTutorChoice.eligibleIds.includes('fisherman-suplex'),false);
  assert.equal(g.resolveTopDeckTutorChoice('p1','wheel-kick'),true); assert.equal(st.pendingTopDeckTutorChoice,null);
  assert.equal(p.hand.filter(c=>['fisherman-suplex','wheel-kick'].includes(c.id)).length,2); assert.equal(p.deck.length,5);
});

test('v0.13.80 Bridging German preserves the normal Amber/Red Pin window and Owen is available in Studio/nameplates',()=>{
  const opp=opponentFor(owen); const g=new MatchEngine({p1:owen,p2:opp,decks,rng:()=>0.42}); const st=g.state(),a=st.players.p1,d=st.players.p2,bridge={...byId['bridging-german-suplex'],instanceId:'bridge'};
  a.momentum.technical=5; a.adrenaline=5; d.hp=Math.floor(d.maxHp*.5); st.phase='RESOLVE_MOVE'; st.playerInControl='p1'; st.proposedMove={attackerId:'p1',defenderId:'p2',card:bridge}; g._connect(); assert.equal(canAttemptPin(st,'p1').legal,true);
  const studio=fs.readFileSync(new URL('../js/tools/card-art-studio-data.js',import.meta.url),'utf8');
  assert.match(studio,/"id":"superstar-owen-hart"[\s\S]{0,260}"cardCode":"NG1-067"/); assert.match(studio,/"id":"owen-hart","name":"Owen Hart","setId":"new-generation-series-1"/);
  assert.ok(globalThis.WWE_LEGACY_SUPERSTAR_NAMEPLATES['owen-hart']);
});
