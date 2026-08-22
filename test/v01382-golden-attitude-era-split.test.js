import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { sets } from '../js/data/sets.js?v=0.13.98';
import { superstars } from '../js/data/superstars.js?v=0.13.98';
import { decks } from '../js/data/decks.js?v=0.13.98';
import { allGameplayCards } from '../js/data/content.js?v=0.13.98';
import { collectionCards } from '../js/data/collection.js?v=0.13.98';
import { CARD_NUMBER_BY_ID, CARD_IDS_BY_SET } from '../js/data/card-number-manifest.js?v=0.13.98';
import { LAUNCH_LIVE_SET_IDS } from '../js/data/release.js?v=0.13.98';
import { MatchEngine } from '../js/engine/MatchEngine.js?v=0.13.98';
import { cpuDecision } from '../js/ai/WrestlingAI.js?v=0.13.98';
await import('../js/data/superstar-nameplates.js?v=0.13.98');

const G='golden-era-series-1', A='attitude-era-series-1', H='hall-of-fame-series-1';
const golden=['hulk-hogan','andre-the-giant','randy-savage','ultimate-warrior','rowdy-roddy-piper','ted-dibiase','jake-roberts','mr-perfect'];
const attitude=['stone-cold-steve-austin','the-undertaker','kane','mankind','triple-h','chris-jericho','the-rock-attitude','kurt-angle'];
const byId=Object.fromEntries(allGameplayCards.map(c=>[c.id,c]));

test('v0.13.82 retires Hall of Fame and creates complete eight-Superstar Golden and Attitude sets',()=>{
  assert.equal(sets[H],undefined);
  assert.deepEqual(new Set(sets[G].plannedSuperstarIds),new Set(golden));
  assert.deepEqual(new Set(sets[A].plannedSuperstarIds),new Set(attitude));
  assert.ok(LAUNCH_LIVE_SET_IDS.includes(G)); assert.ok(LAUNCH_LIVE_SET_IDS.includes(A)); assert.ok(!LAUNCH_LIVE_SET_IDS.includes(H));
  for(const id of golden) assert.equal(Object.values(superstars).find(s=>s.id===id)?.setId,G,id);
  for(const id of attitude) assert.equal(Object.values(superstars).find(s=>s.id===id)?.setId,A,id);
  assert.equal(collectionCards.some(c=>c.setId===H),false);
});

test('v0.13.82 preserves former HOF card IDs while issuing gap-free GE1 and AE1 collector identities',()=>{
  assert.equal(byId['hulk-hogan-atomic-leg-drop'].setId,G);
  assert.equal(byId['stone-cold-steve-austin-stone-cold-stunner'].setId,A);
  assert.equal(CARD_NUMBER_BY_ID['hulk-hogan-atomic-leg-drop'].cardCode.startsWith('GE1-'),true);
  assert.equal(CARD_NUMBER_BY_ID['stone-cold-steve-austin-stone-cold-stunner'].cardCode.startsWith('AE1-'),true);
  for(const [setId,prefix] of [[G,'GE1'],[A,'AE1']]) {
    const ids=CARD_IDS_BY_SET[setId];
    const codes=ids.map(id=>CARD_NUMBER_BY_ID[id].cardCode);
    assert.deepEqual(codes,Array.from({length:ids.length},(_,i)=>`${prefix}-${String(i+1).padStart(3,'0')}`));
  }
});

test('v0.13.82 new era Superstars have locked 60-page decks and 12 Momentum',()=>{
  const expected={
    'rowdy-roddy-piper':{strike:6,technical:4,strength:2},
    'ted-dibiase':{technical:7,strength:3,strike:2},
    'jake-roberts':{technical:6,strike:4,strength:2},
    'mr-perfect':{technical:7,strike:3,agility:2},
    'triple-h':{technical:6,strength:4,strike:2},
    'chris-jericho':{technical:6,agility:4,strike:2},
    'the-rock-attitude':{strength:5,strike:5,technical:2},
    'kurt-angle':{technical:8,strength:2,strike:1,agility:1},
  };
  for(const [id,want] of Object.entries(expected)){
    const d=decks[id]; assert.equal(d.length,60,id); assert.equal(d.filter(c=>c.kind==='momentum').length,12,id);
    const got={}; for(const c of d.filter(c=>c.kind==='momentum')) got[c.method]=(got[c.method]??0)+1;
    assert.deepEqual(got,want,id);
  }
});

test('v0.13.82 locks canonical Pedigree and Ankle Lock ownership names',()=>{
  assert.equal(byId.pedigree.name,'Seth’s Pedigree');
  assert.equal(byId['triple-h-the-pedigree'].name,'The Pedigree');
  assert.equal(byId['chad-gable-ankle-lock'].name,'Gable’s Ankle Lock');
  assert.equal(byId['kurt-angle-ankle-lock'].name,'Ankle Lock');
});

test('v0.13.82 adds Angle Three I actions and the approved shared era booster additions',()=>{
  for(const id of ['kurt-angle-intensity','kurt-angle-integrity','kurt-angle-intelligence']) { assert.equal(byId[id].rarity,3,id); assert.equal(byId[id].superstarId,'kurt-angle',id); }
  for(const id of ['fist-drop','elbow-smash','arm-wringer','turnbuckle-smash','knee-breaker','front-facelock','backhand-chop']) assert.equal(byId[id].setId,G,id);
  for(const id of ['high-knee','knee-facebuster','springboard-dropkick','tilt-a-whirl-backbreaker','single-leg-takedown','waistlock-takedown']) assert.equal(byId[id].setId,A,id);
});


test('v0.13.82 keeps the corrected new-era openings playable and counter density in target range',()=>{
  const ted=Object.values(superstars).find(s=>s.id==='ted-dibiase');
  assert.deepEqual(ted.leadOffIds,['momentum-technical','momentum-strength','arm-wringer','short-arm-clothesline','backbreaker']);
  assert.deepEqual(byId['kurt-angle-moonsault'].requirements,{agility:1});
  const counterCapable=c=>c?.kind==='move'&&((c.counters?.length??0)||(c.counterStates?.length??0)||(c.counterSubmissionTargets?.length??0)||(c.countersCardIds?.length??0));
  for(const id of [...golden.slice(4),...attitude.slice(4)]){
    const count=decks[id].filter(counterCapable).length;
    assert.ok(count>=7&&count<=10,`${id} counter density ${count}`);
  }
});


test('v0.13.82 CPU understands Kurt Angle’s Three I action package',()=>{
  const star=id=>Object.values(superstars).find(s=>s.id===id);
  const g=new MatchEngine({p1:star('cm-punk'),p2:star('kurt-angle'),decks,rng:()=>.99});
  const s=g.state(),p=s.players.p2;
  s.phase='ACTION'; s.playerInControl='p2'; s.proposedMove=null; s.postMove=null;
  p.turn={momentumPlayed:0,momentumPlayLimit:1,actionPlayed:0,supportPlayed:0,specialPlayed:0};
  p.momentum={strength:2,strike:1,technical:8,agility:1,attitude:3}; p.adrenaline=3;
  p.hand=[byId['kurt-angle-intensity'],byId['kurt-angle-three-german-suplexes']];
  const d=cpuDecision(g,'p2');
  assert.equal(d?.type,'action'); assert.equal(d?.card?.id,'kurt-angle-intensity');
});

test('v0.13.82 Card Studio and full-art templates expose both replacement era identities',()=>{
  const studio=fs.readFileSync(new URL('../tools/card-art-studio.html',import.meta.url),'utf8');
  const studioJs=fs.readFileSync(new URL('../js/tools/card-art-studio.js',import.meta.url),'utf8');
  assert.match(studio,/golden-era-series-1/); assert.match(studio,/attitude-era-series-1/); assert.doesNotMatch(studio,/value="hall-of-fame-series-1"/);
  assert.match(studioJs,/wwf-classic-block-card\.svg/); assert.match(studioJs,/wwf-scratch-logo-card\.png/);
  for(const p of ['assets/images/template-move-golden-era-series-1.svg','assets/images/template-superstar-golden-era-series-1.svg','assets/images/template-move-attitude-era-series-1.svg','assets/images/template-superstar-attitude-era-series-1.svg']) assert.equal(fs.existsSync(new URL(`../${p}`,import.meta.url)),true,p);
  for(const p of ['assets/images/template-move-hall-of-fame-series-1.svg','assets/images/template-superstar-hall-of-fame-series-1.svg','assets/art/hall-of-fame-series-1']) assert.equal(fs.existsSync(new URL(`../${p}`,import.meta.url)),false,p);
  for(const id of [...golden,...attitude]) assert.equal(globalThis.WWE_LEGACY_SUPERSTAR_NAMEPLATES[id]?.setId,golden.includes(id)?G:A,id);
});
