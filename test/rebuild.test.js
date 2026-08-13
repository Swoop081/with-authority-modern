import test from "node:test";
import assert from "node:assert/strict";
import { superstars } from "../js/data/superstars.js";
import { decks } from "../js/data/decks.js";
import { allGameplayCards } from "../js/data/content.js";
import { collectionCards } from "../js/data/collection.js";
import { CARD_NUMBER_BY_ID } from "../js/data/card-number-manifest.js";
import { createProfile, unlockSuperstar, addOwnedCard, addUniversePoints, totalOwnedCopies, cardOwnershipCap, hasSuperstar } from "../js/data/profile.js";
import { grantBooster, openBooster, finalizePackUniversePoints } from "../js/data/boosters.js";
import { STORE_BOOSTER_PRICE, STORE_SUPERSTAR_PRICE, storeRotation, storeLeadOffCards, purchaseStoreBooster, purchaseStoreSuperstar } from "../js/data/store.js";
import { exhibitionOpponentIds, randomExhibitionOpponent } from "../js/data/matchmaking.js";
import { tierReward, claimSeasonTier } from "../js/data/seasons.js";
import { MatchEngine } from "../js/engine/MatchEngine.js";
import { moveEligibility, canPlayMomentum } from "../js/engine/rules.js";
import { decisionOwner, cpuDecision, executeCpuDecision } from "../js/ai/WrestlingAI.js";

const stars=Object.values(superstars);
const starById=new Map(stars.map(s=>[s.id,s]));
const byName=n=>allGameplayCards.find(c=>c.name===n);
function rng(seed=1){let x=seed>>>0;return()=>{x=(x*1664525+1013904223)>>>0;return x/4294967296;};}

test("reviewed decks are 55 pages with 12 Momentum and no orphan gameplay cards",()=>{
  assert.equal(Object.keys(decks).length,stars.length);
  const used=new Set();
  for(const [sid,d] of Object.entries(decks)){
    assert.equal(d.length,55,sid);
    assert.equal(d.filter(c=>c.kind==='momentum').length,12,sid);
    for(const c of d) used.add(c.id);
    const counts={}; for(const c of d) if(c.kind!=='momentum') counts[c.id]=(counts[c.id]||0)+1;
    assert.ok(Object.values(counts).every(n=>n<=5),sid);
    assert.equal(starById.get(sid)?.leadOffIds.length,5,sid);
    const lead=d.slice(0,5); assert.equal(lead.filter(c=>c.kind==='momentum').length,2,`${sid} Lead Off Momentum`); assert.equal(lead.filter(c=>c.kind==='move').length,3,`${sid} Lead Off Moves`);
  }
  assert.equal(allGameplayCards.filter(c=>c.kind!=='entrance'&&!used.has(c.id)).length,0);
});

test("profile, Foil replacement, Entrance ownership and boosters use rebuilt rules",()=>{
  const starter=stars.find(s=>['cm-punk','roman-reigns'].includes(s.id))?.id; assert.ok(starter);
  const p=createProfile(starter);
  for(const s of stars) unlockSuperstar(p,s.id);
  assert.equal(p.unlockedSuperstars.length,stars.length);
  for(const s of stars) assert.equal(p.ownedCards[s.entranceId]?.foil,1,s.id);
  const c=collectionCards.find(x=>x.kind==='move'&&!x.superstarId); assert.ok(c);
  p.ownedCards[c.id]={normal:5,foil:0}; addOwnedCard(p,c.id,{foil:true});
  assert.deepEqual(p.ownedCards[c.id],{normal:4,foil:1});
  grantBooster(p,1,'summerslam-series-1'); const pack=openBooster(p,'summerslam-series-1');
  assert.ok(pack.length>0); assert.equal(pack[0].foil,true); assert.equal(pack.some(x=>x.card.kind==='entrance'),false);
});

test("later locked native sequences are present whenever their set is active",()=>{
  const roman=starById.get('roman-reigns'); if(roman) assert.ok(roman.entrance.rulesText.includes('Turn 6'));
  if(starById.has('stone-cold-steve-austin')){
    assert.ok(byName('Kick to the Gut').rulesText.includes('immediately following'));
    assert.equal(byName('Stone Cold Stunner').damage,17);
    assert.deepEqual(byName('Stone Cold Stunner').requirements,{});
    const boot=byName('Hogan’s Big Boot'); assert.equal(boot.superstarId,'hulk-hogan'); assert.equal(boot.groundOpponent,true); assert.equal(boot.effects[0].name,'Atomic Leg Drop');
    const leg=byName('Atomic Leg Drop'); assert.equal(leg.groundedOnly,true); assert.equal(leg.pinBonus,3);
    const press=allGameplayCards.find(c=>c.superstarId==='ultimate-warrior'&&c.name==="Warrior's Gorilla Press Slam"); assert.equal(press.effects[0].name,'Warrior Splash'); assert.equal(press.groundOpponent,true);
    const splash=byName('Warrior Splash'); assert.equal(splash.groundedOnly,true); assert.equal(splash.pinBonus,3);
  }
  if(starById.has('the-rock')){
    assert.equal(byName('Rock Bottom').effects.find(e=>e.type==='search').discount,2);
    assert.equal(byName("People's Elbow").pinBonus,5);
    assert.equal(byName("People's Elbow").damage,18);
  }
});

test("engine completes a deterministic cycle of roster matchups without stalling",()=>{
  for(let i=0;i<stars.length;i++){
    const a=stars[i],b=stars[(i+1)%stars.length]; const g=new MatchEngine({p1:a,p2:b,decks,rng:rng(100+i)});
    let steps=0; while(g.state().phase!=='MATCH_OVER'&&steps++<1200){const pid=decisionOwner(g.state());const d=cpuDecision(g,pid);assert.ok(executeCpuDecision(g,d,pid),`${a.id} vs ${b.id} ${g.state().phase}`);}
    assert.equal(g.state().phase,'MATCH_OVER',`${a.id} vs ${b.id}`);
  }
});


test("0 HP does not cause an automatic knockout and Critical Exhaustion passes Control",()=>{
  const g=new MatchEngine({p1:stars[0],p2:stars[1],decks,rng:rng(991)});
  const s=g.state();
  s.playerInControl='p1'; s.phase='POST_MOVE'; s.postMove={attackerId:'p1',defenderId:'p2',cardId:null};
  s.players.p1.hp=0;
  assert.equal(g.endPostMove('p1'),true);
  assert.notEqual(s.phase,'MATCH_OVER');
  assert.equal(s.playerInControl,'p2');
  assert.equal(s.finish,null);
  assert.ok(s.log.some(e=>e.type==='CRITICAL_EXHAUSTION'&&e.playerId==='p1'));
});



test("Momentum refreshes after a connected Move, not after Specials or utility within the same turn",()=>{
  const p1=starById.get('roman-reigns') ?? stars[0], p2=starById.get('andre-the-giant') ?? stars[1];
  const g=new MatchEngine({p1,p2,decks,rng:rng(1162)}), s=g.state(), p=s.players.p1;
  const momentumA=allGameplayCards.find(c=>c.kind==='momentum'&&c.method==='strike');
  const momentumB={...momentumA,id:`${momentumA.id}-test-copy`};
  const move=byName('Shoulder Tackle') ?? allGameplayCards.find(c=>c.kind==='move'&&!c.defensiveOnly&&!c.groundedOnly);
  assert.ok(momentumA&&move);
  s.playerInControl='p1'; s.phase='ACTION';
  p.hand=[momentumA,momentumB,move];
  p.momentum.strength=10; p.momentum.strike=10; p.momentum.technical=10; p.momentum.agility=10;
  const startTurn=s.turnNumber;
  assert.equal(canPlayMomentum(s,'p1',momentumA),true);
  assert.equal(g.playMomentum('p1',momentumA),true);
  assert.equal(canPlayMomentum(s,'p1',momentumB),false,'second Momentum cannot be played before a Move');

  // Specials/utility do not create a fresh Momentum window.
  const testSpecial={id:'test-special',name:'Test Special',kind:'special',special:{type:'test-special'}};
  p.hand.push(testSpecial);
  assert.ok(g._consumeSpecial('p1','test-special'));
  assert.equal(canPlayMomentum(s,'p1',momentumB),false,'Special must not refresh Momentum');
  p.specialUsed=false;

  assert.equal(g.declareMove('p1',move),true);
  if(s.phase==='COUNTER') assert.equal(g.passCounter('p2'),true);
  assert.equal(s.phase,'POST_MOVE');
  assert.equal(g.endPostMove('p1'),true);
  assert.equal(s.phase,'ACTION');
  assert.equal(s.playerInControl,'p1');
  assert.equal(s.turnNumber,startTurn+1,'connected Move advances the turn while Control is retained');
  assert.equal(canPlayMomentum(s,'p1',momentumB),true,'new Move cycle immediately refreshes Momentum');
  assert.equal(g.playMomentum('p1',momentumB),true);
});
test("offensive counter Moves become counter-attacks and can be countered again",()=>{
  const boot=byName('Big Boot'), shortArm=byName('Short-Arm Clothesline'), enzuigiri=byName('Enzuigiri');
  if(!(boot&&shortArm&&enzuigiri)) return;
  const g=new MatchEngine({p1:stars[0],p2:stars[1],decks,rng:rng(992)}); const s=g.state();
  s.playerInControl='p1'; s.phase='ACTION';
  s.players.p1.hand=[boot,enzuigiri]; s.players.p2.hand=[shortArm];
  s.players.p1.momentum.strike=10; s.players.p2.momentum.strike=10;
  assert.equal(g.declareMove('p1',boot),true);
  assert.equal(s.phase,'COUNTER'); assert.equal(s.proposedMove.defenderId,'p2');
  assert.equal(g.counter('p2',shortArm),true);
  assert.equal(s.phase,'COUNTER'); assert.equal(s.proposedMove.attackerId,'p2'); assert.equal(s.proposedMove.defenderId,'p1');
  assert.equal(g.counter('p1',enzuigiri),true);
  assert.equal(s.phase,'COUNTER'); assert.equal(s.proposedMove.attackerId,'p1'); assert.equal(s.proposedMove.defenderId,'p2');
  assert.equal(s.log.filter(e=>e.type==='COUNTER_ATTACK_DECLARED').length,2);
  assert.equal(g.passCounter('p2'),true);
  assert.equal(s.phase,'POST_MOVE');
  assert.equal(s.players.p2.hp,Math.max(0,s.players.p2.maxHp-(enzuigiri.damage??0)));
});


test("Exhibition CPU matchmaking uses every complete roster deck except the selected player and never needs a second owned Superstar",()=>{
  const starter=stars.find(s=>s.id==='cm-punk')?.id ?? stars[0].id;
  const p=createProfile(starter);
  // Simulate a future live profile with exactly one owned Superstar; internal dev builds also unlock Logan.
  p.unlockedSuperstars=[starter];
  assert.equal(p.unlockedSuperstars.length,1);
  const pool=exhibitionOpponentIds(starter);
  assert.equal(pool.length,stars.length-1);
  assert.equal(pool.includes(starter),false);
  assert.ok(pool.every(id=>(decks[id]?.length??0)===55));
  assert.notEqual(randomExhibitionOpponent(starter,()=>0),starter);
  assert.notEqual(randomExhibitionOpponent(starter,()=>0.999999),starter);
});

test("Daily Store rotates SS to HOF to EVO, charges UP, blocks repurchase and grants only the Store unlock collection package",()=>{
  const epoch=new Date('2026-08-13T00:00:00.000Z');
  assert.equal(storeRotation(epoch).setId,'summerslam-series-1');
  assert.equal(storeRotation(new Date(epoch.getTime()+86400000)).setId,'hall-of-fame-series-1');
  assert.equal(storeRotation(new Date(epoch.getTime()+2*86400000)).setId,'evolution-series-1');
  assert.equal(storeRotation(new Date(epoch.getTime()+3*86400000)).setId,'summerslam-series-1');

  const p=createProfile('cm-punk');
  const target=stars.find(s=>s.setId==='summerslam-series-1'&&!hasSuperstar(p,s.id)); assert.ok(target);
  addUniversePoints(p,STORE_SUPERSTAR_PRICE+STORE_BOOSTER_PRICE);
  const before=p.universePoints;
  const buy=purchaseStoreSuperstar(p,target.id,epoch);
  assert.equal(before-buy.balance,STORE_SUPERSTAR_PRICE);
  assert.equal(hasSuperstar(p,target.id),true);
  assert.equal(p.savedDecks[target.id].length,55);
  assert.equal(totalOwnedCopies(p,`superstar-${target.id}`),1);
  if(target.entranceId) assert.equal(totalOwnedCopies(p,target.entranceId),1);
  for(const card of storeLeadOffCards(target.id)) assert.ok(totalOwnedCopies(p,card.id)>=1,card.id);
  const lead=new Set(target.leadOffIds??[]);
  const nonLead=(decks[target.id]??[]).find(c=>c.kind==='move'&&!lead.has(c.id)&&c.superstarId===target.id);
  if(nonLead) assert.equal(totalOwnedCopies(p,nonLead.id),0,`${nonLead.name} should remain uncollected`);
  assert.throws(()=>purchaseStoreSuperstar(p,target.id,epoch),/already owned/i);
  const creditsBefore=p.boosterCreditsBySet['summerslam-series-1']??0;
  const packBuy=purchaseStoreBooster(p,'summerslam-series-1',epoch);
  assert.equal(packBuy.price,STORE_BOOSTER_PRICE);
  assert.equal(packBuy.balance,0);
  assert.equal(p.boosterCreditsBySet['summerslam-series-1'],creditsBefore+1);
});

test("Boosters guarantee one under-cap card when possible and convert only excess copies to Universe Points at review",()=>{
  const p=createProfile('cm-punk');
  const setId='summerslam-series-1';
  const eligible=collectionCards.filter(c=>c.setId===setId&&c.kind!=='entrance');
  for(const c of eligible) p.ownedCards[c.id]={normal:0,foil:cardOwnershipCap(c)};
  const target=eligible.find(c=>c.kind==='move'); assert.ok(target);
  p.ownedCards[target.id]={normal:0,foil:cardOwnershipCap(target)-1};
  p.universePoints=0;
  grantBooster(p,1,setId);
  const pack=openBooster(p,()=>0.314159,setId);
  assert.equal(pack.length,5);
  assert.equal(pack[0].card.id,target.id,'only under-cap card must occupy guaranteed progress slot');
  assert.equal(pack[0].universePointsValue,0);
  const pending=pack.reduce((sum,pull)=>sum+pull.universePointsValue,0);
  assert.equal(pending,40);
  assert.equal(p.universePoints,0,'UP is not silently credited during reveal');
  assert.equal(finalizePackUniversePoints(p,pack),40);
  assert.equal(p.universePoints,40);
  assert.equal(finalizePackUniversePoints(p,pack),0,'pack review conversion is idempotent');
  assert.equal(p.universePoints,40);
});

test("Season milestone tiers mix 100/200 Universe Points into the reward road while Tier 50 stays Final Boss",()=>{
  assert.equal(tierReward(1).kind,'booster');
  assert.deepEqual(tierReward(5),{tier:5,kind:'universe-points',amount:100});
  assert.deepEqual(tierReward(25),{tier:25,kind:'universe-points',amount:200});
  assert.equal(tierReward(50).kind,'full-deck-superstar');
  const p=createProfile('cm-punk');
  p.seasons['season-1'].xp=500;
  const reward=claimSeasonTier(p,5);
  assert.equal(reward.amount,100);
  assert.equal(p.universePoints,100);
});

test("A completely maxed five-card booster converts to 50 Universe Points on Pack Complete",()=>{
  const p=createProfile('cm-punk');
  const setId='summerslam-series-1';
  const eligible=collectionCards.filter(c=>c.setId===setId&&c.kind!=='entrance');
  for(const c of eligible) p.ownedCards[c.id]={normal:0,foil:cardOwnershipCap(c)};
  p.universePoints=0;
  grantBooster(p,1,setId);
  const pack=openBooster(p,()=>0.42,setId);
  assert.equal(pack.length,5);
  assert.equal(pack.reduce((n,pull)=>n+pull.universePointsValue,0),50);
  assert.equal(finalizePackUniversePoints(p,pack),50);
  assert.equal(p.universePoints,50);
});

test("canonical collector manifest is gap-free and matches Collection plus Card Art Studio for every active card", async()=>{
  const fs = await import("node:fs");
  const { CARD_NUMBER_MANIFEST, CARD_NUMBER_BY_ID } = await import("../js/data/card-number-manifest.js");
  assert.equal(CARD_NUMBER_MANIFEST.length, collectionCards.length);
  assert.equal(new Set(CARD_NUMBER_MANIFEST.map(entry=>entry.id)).size, CARD_NUMBER_MANIFEST.length);
  assert.equal(new Set(CARD_NUMBER_MANIFEST.map(entry=>entry.cardCode)).size, CARD_NUMBER_MANIFEST.length);
  for (const card of collectionCards) {
    const entry = CARD_NUMBER_BY_ID[card.id];
    assert.ok(entry, card.id);
    assert.equal(card.cardNumber, entry.cardNumber, card.id);
    assert.equal(card.cardCode, entry.cardCode, card.id);
    assert.equal(card.setId, entry.setId, card.id);
  }
  const bySet = new Map();
  for (const entry of CARD_NUMBER_MANIFEST) {
    if (!bySet.has(entry.setId)) bySet.set(entry.setId, []);
    bySet.get(entry.setId).push(entry);
  }
  for (const entries of bySet.values()) {
    entries.sort((a,b)=>a.cardNumber-b.cardNumber);
    assert.deepEqual(entries.map(e=>e.cardNumber), Array.from({length:entries.length},(_,i)=>i+1));
  }
  const studioSource = fs.readFileSync(new URL("../js/tools/card-art-studio-data.js", import.meta.url), "utf8");
  const match = studioSource.match(/const STUDIO_CARDS = (\[.*\]);\nconst STUDIO_SUPERSTARS/s);
  assert.ok(match, "generated Studio card dataset is readable");
  const studioCards = JSON.parse(match[1]);
  assert.equal(studioCards.length, collectionCards.length);
  const studioById = new Map(studioCards.map(card=>[card.id,card]));
  for (const card of collectionCards) {
    const studio = studioById.get(card.id);
    assert.ok(studio, `Studio missing ${card.id}`);
    assert.equal(studio.cardCode, card.cardCode, `${card.id} Studio code`);
    assert.equal(studio.cardNumber, card.cardNumber, `${card.id} Studio number`);
    assert.equal(studio.name, card.name, `${card.id} Studio name`);
    assert.equal(studio.setId, card.setId, `${card.id} Studio set`);
  }
  const studioHtml = fs.readFileSync(new URL("../tools/card-art-studio.html", import.meta.url), "utf8");
  assert.ok(studioHtml.indexOf("card-art-studio-data.js") < studioHtml.indexOf("card-art-studio.js"));
});

test("Liv Morgan uses Jersey Codebreaker as her exclusive Trademark and the superseded generic variant is absent",()=>{
  const jersey=allGameplayCards.find(c=>c.id==='liv-morgan-jersey-codebreaker');
  assert.ok(jersey);
  assert.equal(jersey.name,'Jersey Codebreaker');
  assert.equal(jersey.superstarId,'liv-morgan');
  assert.equal(jersey.trademark,true);
  assert.equal(jersey.cost,5);
  assert.equal(jersey.damage,8);
  assert.deepEqual(jersey.requirements,{strike:2});
  assert.equal(jersey.groundOpponent,true);
  assert.equal(jersey.stun,1);
  const retiredGenericId=['code','breaker'].join(''); const retiredGenericName=['Code','breaker'].join('');
  assert.equal(allGameplayCards.some(c=>c.id===retiredGenericId||c.name===retiredGenericName),false);
  assert.equal(decks['liv-morgan'].filter(c=>c.id===jersey.id).length,4);
  assert.ok(starById.get('liv-morgan').signatures.includes(jersey.id));
  assert.equal(byName('Revenge Tour').special.name,'Jersey Codebreaker');
});


test("Logan Paul RAW Series 1 package is locked, playable and wired to its bespoke mechanics",()=>{
  const logan=starById.get('logan-paul'); assert.ok(logan);
  assert.deepEqual(logan.starterMomentum,{agility:8,strike:4});
  assert.deepEqual(logan.entrance.preMatchMomentum,{agility:1,strength:1});
  assert.equal(logan.entrance.preMatchAdrenaline,1);
  assert.equal(decks['logan-paul'].length,55);
  assert.equal(decks['logan-paul'].filter(c=>c.kind==='momentum'&&c.method==='strength').length,0);
  assert.equal(decks['logan-paul'].filter(c=>c.kind==='momentum'&&c.method==='agility').length,8);
  assert.equal(decks['logan-paul'].filter(c=>c.kind==='momentum'&&c.method==='strike').length,4);
  const fin=byName('Paulverizer'); assert.equal(fin.finisher,true); assert.deepEqual(fin.requirements,{}); assert.equal(fin.pinBonus,4);
  const tm=byName('Knockout Punch'); assert.equal(tm.trademark,true); assert.equal(tm.superstarId,'logan-paul'); assert.deepEqual(tm.requirements,{strike:3});
  const standing=byName('Standing Moonsault'); assert.equal(standing.kickoutRetainControlDraw,1);
  const spring=byName('Springboard Crossbody'); assert.equal(spring.effects[0].type,'drawThenDiscardSelf'); assert.equal(spring.effects[0].ifAfterMethod,'strike');
  const asai=byName('Asai Moonsault'); assert.equal(asai.selfStunIfCountered,1); assert.equal(asai.groundedOnly,false);
  const splash=byName('450 Splash'); assert.equal(splash.selfStunIfCountered,1); assert.equal(splash.pinBonus,2);

  const opponent=stars.find(s=>s.id!=='logan-paul');
  const g=new MatchEngine({p1:logan,p2:opponent,decks,rng:rng(1201)}),st=g.state();
  assert.equal(st.players.p1.momentum.agility,1); assert.equal(st.players.p1.momentum.strength,1); assert.equal(st.players.p1.adrenaline,1);
  const punch=byName('Punch'); st.players.p1.hand=[punch, allGameplayCards.find(c=>c.id==='special-logan-paul')]; st.players.p1.momentum.strike=5; st.players.p1.momentum.agility=5;
  st.phase='ACTION'; st.playerInControl='p1';
  assert.equal(g.declareMove('p1',punch),true); if(st.phase==='COUNTER') g.passCounter('p2');
  assert.equal(st.players.p1.momentum.strength,2,'first connected Strike supplies second Strength Momentum');
  const special=st.players.p1.hand.find(c=>c.id==='special-logan-paul'); assert.ok(special); const hp=st.players.p2.hp;
  assert.equal(g.playSpecial('p1',special),true); assert.equal(st.players.p2.hp,Math.max(0,hp-3)); assert.equal(st.playerInControl,'p2');
});

test("RAW aerial mechanics execute: Standing Moonsault kickout retains Control and Springboard Crossbody rewards a prior Strike",()=>{
  const standing=byName('Standing Moonsault'), spring=byName('Springboard Crossbody'), punch=byName('Punch');
  const logan=starById.get('logan-paul'), opp=stars.find(s=>s.id!=='logan-paul');
  const g=new MatchEngine({p1:logan,p2:opp,decks,rng:()=>0.999}), s=g.state();
  s.playerInControl='p1'; s.phase='PIN_RESPONSE'; s.postMove={attackerId:'p1',defenderId:'p2',cardId:standing.id};
  s.proposedPin={attackerId:'p1',defenderId:'p2'}; s.players.p1.discard.push(standing);
  const handBefore=s.players.p1.hand.length;
  assert.equal(g.passPinResponse('p2'),true);
  assert.equal(s.playerInControl,'p1'); assert.equal(s.phase,'ACTION'); assert.equal(s.players.p1.hand.length,handBefore+1);

  const iyo=starById.get('iyo-sky');
  const g2=new MatchEngine({p1:iyo,p2:opp,decks,rng:rng(1302)}), q=g2.state();
  q.playerInControl='p1'; q.phase='ACTION'; q.players.p1.hand=[punch,spring]; q.players.p2.hand=[];
  q.players.p1.momentum.strike=5; q.players.p1.momentum.agility=5;
  assert.equal(g2.declareMove('p1',punch),true); assert.equal(g2.passCounter('p2'),true); assert.equal(g2.endPostMove('p1'),true);
  assert.equal(g2.declareMove('p1',spring),true); assert.equal(g2.passCounter('p2'),true);
  assert.equal(q.players.p1.hand.length,1,'Springboard draw 2 / ditch 1 creates net +1 page after a prior Strike');
});


test("Sol Ruca RAW Series 1 package is locked, playable and wired to counter/high-risk mechanics",()=>{
  const sol=starById.get('sol-ruca'); assert.ok(sol);
  assert.equal(sol.hp,48);
  assert.deepEqual(sol.starterMomentum,{agility:8,technical:2,strength:2});
  assert.deepEqual(sol.methodLimits,{agility:null,strength:2,strike:1,technical:2});
  assert.deepEqual(sol.entrance.preMatchMomentum,{agility:1}); assert.equal(sol.entrance.preMatchAdrenaline,1);
  assert.equal(decks['sol-ruca'].length,55);
  assert.equal(decks['sol-ruca'].filter(c=>c.kind==='momentum'&&c.method==='agility').length,8);
  assert.equal(decks['sol-ruca'].filter(c=>c.kind==='momentum'&&c.method==='technical').length,2);
  assert.equal(decks['sol-ruca'].filter(c=>c.kind==='momentum'&&c.method==='strength').length,2);
  assert.equal(decks['sol-ruca'].filter(c=>c.id==='special-sol-ruca').length,1);
  const stf=byName('STF'); assert.deepEqual(stf.requirements,{technical:2}); assert.equal(stf.submission.pressure,4);
  const tm=byName('Avalanche X-Factor'); assert.equal(tm.trademark,true); assert.equal(tm.superstarId,'sol-ruca'); assert.deepEqual(tm.priorConnectedMethodBonus,{method:'agility',damage:2});
  const fin=byName('Sol Snatcher'); assert.equal(fin.finisher,true); assert.deepEqual(fin.requirements,{}); assert.equal(fin.pinBonus,5); assert.equal(fin.discountAfterCounter,2);
  const rawCodes=['RAW1-012','RAW1-013','RAW1-014','RAW1-015','RAW1-016','RAW1-017'];
  for(const code of rawCodes) assert.ok(collectionCards.some(c=>c.cardCode===code),code);

  const opp=stars.find(s=>s.id!=='sol-ruca');
  const g=new MatchEngine({p1:sol,p2:opp,decks,rng:rng(1401)}),s=g.state();
  assert.equal(s.players.p1.momentum.agility,1); assert.equal(s.players.p1.adrenaline,1);
  // Successful defensive Counter triggers Daredevil Instincts draw and enables the Sol Snatcher sequence discount.
  const incoming=byName('Running Powerslam'), sidestep=byName('Sidestep'), finisher=byName('Sol Snatcher');
  s.phase='COUNTER'; s.playerInControl='p2'; s.proposedMove={attackerId:'p2',defenderId:'p1',card:incoming};
  s.players.p1.hand=[sidestep,finisher]; s.players.p1.momentum.agility=10; s.players.p1.momentum.strength=10; s.players.p1.momentum.technical=10; s.players.p1.momentum.strike=10;
  const before=s.players.p1.hand.length; assert.equal(g.counter('p1',sidestep),true);
  assert.equal(s.players.p1.abilityUses,1); assert.ok(s.players.p1.hand.length>=before,'counter ability draws 1 before Counter is discarded');
  assert.equal(s.players.p1.events.counteredThisControl,true);
  const eligible=moveEligibility(s,'p1',finisher); assert.equal(eligible.legal,true); assert.equal(eligible.effectiveCost,8,'Sol Snatcher costs 2 less after a successful Counter in this Control sequence');
});

test("No Wipeout prevents self-Stun when Sol's high-risk Agility Move is Countered",()=>{
  const sol=starById.get('sol-ruca'), opp=stars.find(s=>s.id!=='sol-ruca');
  const g=new MatchEngine({p1:sol,p2:opp,decks,rng:rng(1402)}),s=g.state();
  const splash=byName('450 Splash'), sidestep=byName('Sidestep'), special=allGameplayCards.find(c=>c.id==='special-sol-ruca');
  s.playerInControl='p1'; s.phase='COUNTER'; s.proposedMove={attackerId:'p1',defenderId:'p2',card:splash};
  s.players.p1.hand=[special]; s.players.p1.deck=[byName('Dropkick')]; s.players.p2.hand=[sidestep]; s.players.p2.momentum.agility=5;
  assert.equal(g.counter('p2',sidestep),true);
  assert.equal(s.players.p1.stun,0); assert.equal(s.players.p1.specialUsed,true);
  assert.ok(s.players.p1.hand.some(c=>c.name==='Dropkick'),'No Wipeout draws 1 page');
});


test("Chad Gable RAW Series 1 package is locked, playable and wired to Olympic Pedigree / Shoosh",()=>{
  const chad=starById.get('chad-gable'); assert.ok(chad);
  assert.equal(chad.hp,50); assert.equal(chad.methodLimits.technical,null); assert.equal(chad.methodLimits.strength,4); assert.equal(chad.methodLimits.agility,2); assert.equal(chad.methodLimits.strike,0);
  assert.equal(decks['chad-gable'].length,55);
  assert.equal(decks['chad-gable'].filter(c=>c.kind==='momentum'&&c.method==='technical').length,7);
  assert.equal(decks['chad-gable'].filter(c=>c.kind==='momentum'&&c.method==='strength').length,5);
  assert.equal(decks['chad-gable'].filter(c=>c.kind==='momentum'&&c.method==='agility').length,0);
  const tm=byName('Chaos Theory'); assert.equal(tm.trademark,true); assert.equal(tm.superstarId,'chad-gable'); assert.equal(tm.pinBonus,2); assert.equal(tm.kickoutRetainControl,true);
  const fin=byName('Ankle Lock'); assert.equal(fin.finisher,true); assert.deepEqual(fin.requirements,{}); assert.equal(fin.submission.pressure,6); assert.equal(fin.groundedOnly,true);
  assert.equal(CARD_NUMBER_BY_ID['chad-gable-chaos-theory']?.cardCode,'RAW1-018'); assert.equal(CARD_NUMBER_BY_ID['superstar-chad-gable']?.cardCode,'RAW1-022');
  const opp=stars.find(s=>s.id!=='chad-gable');
  const e=new MatchEngine({p1:chad,p2:opp,decks,rng:()=>0.99}); const st=e.state();
  assert.equal(st.players.p1.momentum.technical,1); assert.equal(st.players.p1.momentum.agility,1); assert.equal(st.players.p1.adrenaline,1);
  const tech=byName('Double Leg Takedown'); st.players.p1.hand=[tech]; st.players.p1.momentum.technical=5; st.players.p1.momentum.strength=5; assert.equal(e.declareMove('p1',tech),true); e.passCounter('p2'); assert.equal(st.players.p1.momentum.agility,2);
  e.endPostMove('p1');
});




test("starting HP roster uses the locked durability spread",()=>{
  const expected = {"iyo-sky": 48, "mankind": 52, "the-rock": 58, "hulk-hogan": 52, "bayley": 50, "cm-punk": 49, "paige": 49, "seth-rollins": 50, "andre-the-giant": 56, "stephanie-vaquer": 49, "randy-savage": 50, "roman-reigns": 53, "charlotte-flair": 52, "kevin-owens": 52, "kane": 54, "the-undertaker": 54, "ultimate-warrior": 52, "rhea-ripley": 52, "cody-rhodes": 51, "oba-femi": 55, "stone-cold-steve-austin": 51, "liv-morgan": 48, "brock-lesnar": 55, "gunther": 53, "becky-lynch": 51, "logan-paul": 48, "sol-ruca": 48, "chad-gable": 50, "raquel-rodriguez": 53, "rey-mysterio": 48, "dominik-mysterio": 49, "penta": 50};
  for (const [id,hp] of Object.entries(expected)) assert.equal(starById.get(id)?.hp,hp,`${id} starting HP`);
  const values=[...new Set(stars.map(s=>s.hp))].sort((a,b)=>a-b);
  assert.deepEqual(values,[48,49,50,51,52,53,54,55,56,58]);
  assert.equal(starById.get('the-rock').hp,Math.max(...stars.map(s=>s.hp)),'Final Boss remains the clear HP ceiling');
});

test("Raquel Rodriguez RAW Series 1 package is locked, playable, and all four RAW decks are exactly 55 pages",()=>{
  const raquel=starById.get('raquel-rodriguez'); assert.ok(raquel);
  assert.equal(raquel.hp,53); assert.equal(raquel.methodLimits.strength,null); assert.equal(raquel.methodLimits.strike,3); assert.equal(raquel.methodLimits.agility,1); assert.equal(raquel.methodLimits.technical,0);
  for(const sid of ['logan-paul','sol-ruca','chad-gable','raquel-rodriguez']){
    assert.equal(decks[sid].length,55,`${sid} must have exactly 55 pages`);
    assert.equal(decks[sid].filter(c=>c.kind==='momentum').length,12,`${sid} must have exactly 12 Momentum`);
  }
  assert.equal(decks['raquel-rodriguez'].filter(c=>c.kind==='momentum'&&c.method==='strength').length,8);
  assert.equal(decks['raquel-rodriguez'].filter(c=>c.kind==='momentum'&&c.method==='strike').length,4);
  assert.equal(decks['raquel-rodriguez'].filter(c=>c.kind==='momentum'&&c.method==='agility').length,0);
  const tm=byName('Corkscrew Splash'); assert.equal(tm.trademark,true); assert.equal(tm.superstarId,'raquel-rodriguez'); assert.deepEqual(tm.requirements,{strength:2,agility:1}); assert.equal(tm.pinBonus,2); assert.equal(tm.selfStunIfCountered,1);
  const fin=byName('Tejana Bomb'); assert.equal(fin.finisher,true); assert.deepEqual(fin.requirements,{}); assert.equal(fin.pinBonus,5); assert.equal(fin.damage,17);
  assert.equal(CARD_NUMBER_BY_ID['raquel-rodriguez-corkscrew-splash']?.cardCode,'RAW1-023'); assert.equal(CARD_NUMBER_BY_ID['superstar-raquel-rodriguez']?.cardCode,'RAW1-027');
  const opp=stars.find(s=>s.id!=='raquel-rodriguez');
  const e=new MatchEngine({p1:raquel,p2:opp,decks,rng:()=>0.99}); const st=e.state();
  assert.equal(st.players.p1.momentum.strength,1); assert.equal(st.players.p1.momentum.agility,1); assert.equal(st.players.p1.adrenaline,1);
  const run=byName('Running Powerslam'); st.players.p1.hand=[run]; st.players.p1.momentum.strength=5; st.players.p2.hand=[]; const hp=st.players.p2.hp; assert.equal(e.declareMove('p1',run),true); e.passCounter('p2'); assert.equal(hp-st.players.p2.hp,10,'Unmatched Power adds +2 to qualifying Strength move');
  const e2=new MatchEngine({p1:opp,p2:raquel,decks,rng:()=>0.99}); const s2=e2.state();
  const big=byName('Running Powerslam'), backup=allGameplayCards.find(c=>c.id==='special-raquel-rodriguez');
  s2.playerInControl='p1'; s2.phase='ACTION'; s2.players.p1.hand=[big]; s2.players.p1.momentum.strength=5; s2.players.p1.adrenaline=3; s2.players.p1.momentum.attitude=3; s2.players.p2.hand=[backup]; const rhp=s2.players.p2.hp;
  assert.equal(e2.declareMove('p1',big),true); e2.passCounter('p2'); assert.equal(rhp-s2.players.p2.hp,5,'Judgment Day Backup reduces 8 damage to 5'); assert.equal(s2.players.p2.specialUsed,true); assert.equal(s2.players.p1.adrenaline,2,'Judgment Day Backup drains 1 opponent Adrenaline');
});


test("Rey Mysterio Worlds Collide Series 1 package is locked, family-gated and playable",()=>{
  const rey=starById.get('rey-mysterio'); assert.ok(rey);
  assert.equal(rey.hp,48);
  assert.deepEqual(rey.methodLimits,{agility:null,strength:0,strike:2,technical:3});
  assert.deepEqual(rey.starterMomentum,{agility:8,technical:2,strike:2});
  assert.equal(decks['rey-mysterio'].length,55);
  assert.equal(decks['rey-mysterio'].filter(c=>c.kind==='momentum').length,12);
  assert.equal(decks['rey-mysterio'].filter(c=>c.id==='619').length,3);
  assert.equal(decks['rey-mysterio'].filter(c=>c.id==='shoulder-up').length,2,'55-page correction preserves the locked deck by adding a second Shoulder Up');
  const six=allGameplayCards.find(c=>c.id==='619'); assert.ok(six);
  assert.deepEqual(six.allowedSuperstarIds,['rey-mysterio','dominik-mysterio']);
  assert.equal(six.superstarId,null); assert.equal(six.stun,1); assert.equal(six.groundedOnly,true);
  const pop=allGameplayCards.find(c=>c.id==='rey-mysterio-west-coast-pop'); assert.equal(pop.finisher,true); assert.deepEqual(pop.requirements,{}); assert.equal(pop.pinBonus,4); assert.deepEqual(pop.pinBonusAfterNamed,{name:'619',pinBonus:6});
  const mex=allGameplayCards.find(c=>c.id==='rey-mysterio-mysterio-express'); assert.equal(mex.trademark,true); assert.equal(mex.kickoutRetainControl,true); assert.equal(mex.pinBonus,2);
  const tilt=allGameplayCards.find(c=>c.id==='tilt-a-whirl-headscissors'); assert.ok(tilt.counters.includes('grapple')); assert.equal(tilt.drawOnCounter,1);
  assert.equal(CARD_NUMBER_BY_ID['tilt-a-whirl-headscissors']?.cardCode,'WC1-001');
  assert.equal(CARD_NUMBER_BY_ID['619']?.cardCode,'WC1-002');
  assert.equal(CARD_NUMBER_BY_ID['superstar-rey-mysterio']?.cardCode,'WC1-007');
  assert.equal(CARD_NUMBER_BY_ID['drop-toe-hold']?.cardCode,'WC1-008');
  const nonFamily=stars.find(s=>!['rey-mysterio','dominik-mysterio'].includes(s.id));
  const bad=new MatchEngine({p1:nonFamily,p2:rey,decks,rng:rng(1601)}),bs=bad.state(); bs.playerInControl='p1';bs.phase='ACTION';bs.players.p1.hand=[six];bs.players.p1.momentum.agility=10;bs.players.p1.momentum.strike=10;bs.players.p1.momentum.technical=10;bs.players.p1.momentum.strength=10;bs.players.p2.posture='on-mat';assert.equal(moveEligibility(bs,'p1',six).legal,false);
  const opp=stars.find(s=>s.id!=='rey-mysterio');
  const g=new MatchEngine({p1:rey,p2:opp,decks,rng:rng(1602)}),st=g.state();
  assert.equal(st.players.p1.momentum.agility,1); assert.equal(st.players.p1.adrenaline,1);
  st.playerInControl='p1';st.phase='ACTION';st.players.p2.posture='on-mat';st.players.p1.hand=[six];st.players.p1.deck.unshift(pop);st.players.p1.momentum.agility=10;st.players.p1.momentum.strike=10;
  assert.equal(g.declareMove('p1',six),true); if(st.phase==='COUNTER')g.passCounter('p2');
  assert.ok(st.players.p1.hand.some(c=>c.id===pop.id),'Rey 619 searches West Coast Pop');
  const searched=st.players.p1.hand.find(c=>c.id===pop.id); g.endPostMove('p1');
  assert.equal(moveEligibility(st,'p1',searched).effectiveCost,7,'searched West Coast Pop costs 2 less');
  st.players.p2.posture='on-mat'; assert.equal(g.declareMove('p1',searched),true); if(st.phase==='COUNTER')g.passCounter('p2'); assert.equal(st.postMove.pinBonus,6,'West Coast Pop gets Pin +6 immediately after 619');
});

test("Rey Ultimate Underdog and Lucha Libre Legend mechanics execute",()=>{
  const rey=starById.get('rey-mysterio'),opp=stars.find(s=>s.id!=='rey-mysterio');
  const g=new MatchEngine({p1:rey,p2:opp,decks,rng:()=>0.999}),s=g.state();
  s.phase='PIN_RESPONSE';s.playerInControl='p2';s.postMove={attackerId:'p2',defenderId:'p1',cardId:null,pinBonus:0};s.proposedPin={attackerId:'p2',defenderId:'p1'};s.players.p1.deck=[byName('Dropkick'),byName('Arm Drag')];const before=s.players.p1.hand.length;assert.equal(g.passPinResponse('p1'),true);assert.equal(s.players.p1.abilityUses,1);assert.equal(s.players.p1.adrenaline,2,'Entrance + first kickout = 2 Adrenaline');assert.ok(s.players.p1.hand.length>=before+2,'kickout ability draw plus normal control draw');
  const g2=new MatchEngine({p1:opp,p2:rey,decks,rng:rng(1603)}),q=g2.state();const incoming=byName('Bulldog'),tilt=allGameplayCards.find(c=>c.id==='tilt-a-whirl-headscissors'),special=allGameplayCards.find(c=>c.id==='special-rey-mysterio');q.phase='COUNTER';q.playerInControl='p1';q.proposedMove={attackerId:'p1',defenderId:'p2',card:incoming};q.players.p2.hand=[tilt,special];q.players.p2.deck=[byName('Dropkick')];q.players.p2.momentum.agility=10;q.players.p2.momentum.technical=10;assert.equal(g2.counter('p2',tilt),true);assert.equal(q.players.p2.specialUsed,true);assert.equal(q.proposedMove.abilityBonusDamage,2);assert.ok(q.players.p2.hand.some(c=>c.name==='Dropkick'),'Tilt-a-Whirl counter draws 1 page');
});


test("Dominik Mysterio Worlds Collide package is locked and playable",()=>{
  const dom=starById.get('dominik-mysterio'); assert.ok(dom);
  assert.equal(dom.hp,49); assert.deepEqual(dom.starterMomentum,{agility:7,strike:3,technical:2});
  assert.equal(decks['dominik-mysterio'].length,55);
  assert.equal(decks['dominik-mysterio'].filter(c=>c.kind==='momentum').length,12);
  assert.equal(decks['dominik-mysterio'].filter(c=>c.id==='momentum-strength').length,0);
  assert.equal(decks['dominik-mysterio'].filter(c=>c.id==='619').length,3);
  assert.equal(decks['dominik-mysterio'].filter(c=>c.id==='dominik-mysterio-frog-splash').length,3);
  const six=allGameplayCards.find(c=>c.id==='619');
  assert.deepEqual(six.allowedSuperstarIds,['rey-mysterio','dominik-mysterio']);
  assert.ok(six.effects.some(e=>e.name==='Dominik’s Frog Splash'&&e.discount===2&&e.ifSuperstarIds?.includes('dominik-mysterio')));
  const fin=allGameplayCards.find(c=>c.id==='dominik-mysterio-frog-splash');
  assert.equal(fin.finisher,true); assert.equal(fin.cost,9); assert.equal(fin.damage,15); assert.deepEqual(fin.requirements,{}); assert.equal(fin.pinBonus,4); assert.deepEqual(fin.pinBonusAfterNamed,{name:'619',pinBonus:5});
  assert.equal(CARD_NUMBER_BY_ID['low-blow']?.cardCode,'WC1-009');
  assert.equal(CARD_NUMBER_BY_ID['three-amigos']?.cardCode,'WC1-010');
  assert.equal(CARD_NUMBER_BY_ID['dominik-mysterio-frog-splash']?.cardCode,'WC1-011');
  assert.equal(CARD_NUMBER_BY_ID['superstar-dominik-mysterio']?.cardCode,'WC1-014');
  const opp=stars.find(s=>!['rey-mysterio','dominik-mysterio'].includes(s.id));
  const g=new MatchEngine({p1:dom,p2:opp,decks,rng:rng(1801)}),q=g.state();
  assert.equal(q.players.p1.momentum.agility,1); assert.equal(q.players.p1.momentum.strength,1); assert.equal(q.players.p1.adrenaline,1);
  const sixCard=allGameplayCards.find(c=>c.id==='619'),finCard=fin; q.players.p1.hand=[sixCard]; q.players.p1.deck=[finCard]; q.players.p1.momentum.agility=10;q.players.p1.momentum.strike=10;q.players.p1.adrenaline=20;q.players.p2.posture='on-mat';
  assert.equal(g.declareMove('p1',sixCard),true); g.passCounter('p2');
  assert.ok(q.players.p1.hand.some(c=>c.id==='dominik-mysterio-frog-splash')); assert.equal(q.players.p1.namedDiscount['Dominik’s Frog Splash'],2);
});

test("Penta Worlds Collide package is locked and playable",()=>{
  const penta=starById.get('penta'); assert.ok(penta);
  assert.equal(penta.hp,50); assert.deepEqual(penta.starterMomentum,{agility:6,strike:4,technical:2});
  assert.equal(decks.penta.length,55); assert.equal(decks.penta.filter(c=>c.kind==='momentum').length,12); assert.equal(decks.penta.filter(c=>c.id==='momentum-strength').length,0);
  assert.equal(decks.penta.filter(c=>c.id==='penta-mexican-destroyer').length,3); assert.equal(decks.penta.filter(c=>c.id==='special-penta').length,1);
  const back=allGameplayCards.find(c=>c.id==='backstabber'),tope=allGameplayCards.find(c=>c.id==='tope-con-hilo'),sac=allGameplayCards.find(c=>c.id==='penta-the-sacrifice'),driver=allGameplayCards.find(c=>c.id==='penta-driver'),fin=allGameplayCards.find(c=>c.id==='penta-mexican-destroyer'),sp=allGameplayCards.find(c=>c.id==='special-penta');
  assert.ok(back.counters.includes('aerial')); assert.equal(back.counterBonusDamage,2); assert.equal(tope.selfStunIfCountered,1);
  assert.equal(driver.trademark,true); assert.equal(fin.finisher,true); assert.equal(fin.damage,16); assert.deepEqual(fin.requirements,{}); assert.equal(fin.pinBonus,4); assert.equal(sp.name,'Fearless Assault');
  assert.equal(CARD_NUMBER_BY_ID.backstabber.cardCode,'WC1-015'); assert.equal(CARD_NUMBER_BY_ID['superstar-penta'].cardCode,'WC1-022');
  const opp=stars.find(s=>s.id!=='penta'); const g=new MatchEngine({p1:penta,p2:opp,decks,rng:rng(1901)}),q=g.state();
  assert.equal(q.players.p1.momentum.agility,1); assert.equal(q.players.p1.momentum.strength,1); assert.equal(q.players.p1.adrenaline,1);
  q.playerInControl='p1';q.phase='ACTION';q.players.p1.hand=[sac];q.players.p1.deck=[driver];q.players.p1.momentum.technical=10;q.players.p1.momentum.strength=10;q.players.p1.adrenaline=20;
  assert.equal(g.declareMove('p1',sac),true); if(q.phase==='COUNTER')g.passCounter('p2'); assert.ok(q.players.p1.hand.some(c=>c.id==='penta-driver')); assert.equal(q.players.p1.namedDiscount['Penta Driver'],1);
  g.endPostMove('p1');
  const agility=allGameplayCards.find(c=>c.id==='dropkick'),strike=allGameplayCards.find(c=>c.id==='superkick'); q.players.p1.hand=[agility,sp,strike];q.players.p1.momentum.agility=10;q.players.p1.momentum.strike=10;q.players.p1.adrenaline=20;q.players.p2.posture='standing';
  assert.equal(g.declareMove('p1',agility),true); if(q.phase==='COUNTER')g.passCounter('p2'); assert.equal(q.players.p1.specialUsed,true); g.endPostMove('p1'); assert.equal(moveEligibility(q,'p1',strike).effectiveCost,Math.max(0,strike.cost-2));
});



test("El Grande Americano completes Worlds Collide Series 1 and is fully playable",()=>{
  const ega=starById.get('el-grande-americano'); assert.ok(ega);
  assert.equal(ega.hp,51);
  assert.deepEqual(ega.methodLimits,{agility:3,strength:4,strike:3,technical:null});
  assert.deepEqual(ega.starterMomentum,{technical:4,strength:3,agility:3,strike:2});
  assert.deepEqual(ega.leadOffIds,['momentum-technical','momentum-strike','headbutt','german-suplex','dropkick']);
  assert.equal(decks['el-grande-americano'].length,55);
  assert.equal(decks['el-grande-americano'].filter(c=>c.kind==='momentum').length,12);
  assert.equal(decks['el-grande-americano'].filter(c=>c.id==='el-grande-americano-loaded-mask-headbutt').length,3);
  assert.equal(decks['el-grande-americano'].filter(c=>c.id==='special-el-grande-americano').length,1);
  const jump=allGameplayCards.find(c=>c.id==='el-grande-americano-jumping-headbutt');
  const fin=allGameplayCards.find(c=>c.id==='el-grande-americano-loaded-mask-headbutt');
  const sp=allGameplayCards.find(c=>c.id==='special-el-grande-americano');
  assert.equal(jump.trademark,true); assert.equal(jump.damage,11); assert.equal(jump.stun,1); assert.equal(jump.pinBonus,2); assert.deepEqual(jump.requirements,{strike:2,agility:1});
  assert.equal(fin.finisher,true); assert.equal(fin.cost,9); assert.equal(fin.damage,16); assert.deepEqual(fin.requirements,{}); assert.equal(fin.stun,1); assert.equal(fin.pinBonus,4);
  assert.equal(sp.name,'Steel Plate');
  assert.equal(CARD_NUMBER_BY_ID['el-grande-americano-jumping-headbutt']?.cardCode,'WC1-023');
  assert.equal(CARD_NUMBER_BY_ID['el-grande-americano-loaded-mask-headbutt']?.cardCode,'WC1-024');
  assert.equal(CARD_NUMBER_BY_ID['entrance-el-grande-americano']?.cardCode,'WC1-025');
  assert.equal(CARD_NUMBER_BY_ID['special-el-grande-americano']?.cardCode,'WC1-026');
  assert.equal(CARD_NUMBER_BY_ID['superstar-el-grande-americano']?.cardCode,'WC1-027');

  const opp=stars.find(s=>s.id!=='el-grande-americano');
  const g=new MatchEngine({p1:ega,p2:opp,decks,rng:rng(2001)}),q=g.state();
  assert.equal(q.players.p1.momentum.technical,1); assert.equal(q.players.p1.adrenaline,1);
  const head=byName('Headbutt'), drop=byName('Dropkick');
  q.playerInControl='p1';q.phase='ACTION';q.players.p1.hand=[head,sp,drop];q.players.p1.deck=[fin,byName('Arm Drag'),byName('Duck')];
  q.players.p1.momentum.strike=10;q.players.p1.momentum.agility=10;q.players.p1.momentum.technical=10;q.players.p1.momentum.strength=10;q.players.p1.adrenaline=20;q.players.p2.hand=[];
  assert.equal(g.declareMove('p1',head),true); if(q.phase==='COUNTER')g.passCounter('p2');
  assert.equal(q.players.p1.specialUsed,true); assert.ok(q.players.p1.hand.some(c=>c.id===fin.id),'Steel Plate tutors Loaded Mask Headbutt'); assert.equal(q.players.p1.namedDiscount['Loaded Mask Headbutt'],2);
  assert.equal(q.players.p1.abilityUses,0,'first move in a Control sequence cannot trigger Masked Opportunist');
  g.endPostMove('p1');
  assert.equal(g.declareMove('p1',drop),true); if(q.phase==='COUNTER')g.passCounter('p2');
  assert.equal(q.players.p1.abilityUses,1,'different Method on second connected move triggers Masked Opportunist');
  assert.ok(q.players.p1.adrenaline>=21,'Masked Opportunist gains 1 Adrenaline');
});


test("Momentum is once per turn and refreshes on normal new-turn Control progression",()=>{
  const a=stars[0], b=stars[1];
  const g=new MatchEngine({p1:a,p2:b,decks,rng:rng(1162)});
  const s=g.state();
  const p1Momentum=(decks[a.id]??[]).filter(c=>c.kind==='momentum').slice(0,2);
  assert.equal(p1Momentum.length,2);
  s.players.p1.hand=[...p1Momentum];
  const firstTurn=s.turnNumber;
  assert.equal(g.playMomentum('p1',s.players.p1.hand[0]),true);
  assert.equal(g.playMomentum('p1',s.players.p1.hand[0]),false,'second Momentum in same turn must be blocked');
  assert.equal(g.passTurn('p1'),true);
  assert.equal(s.playerInControl,'p2');
  assert.equal(s.turnNumber,firstTurn+1);
  assert.equal(g.passTurn('p2'),true);
  assert.equal(s.playerInControl,'p1');
  assert.equal(s.turnNumber,firstTurn+2);
  assert.equal(g.playMomentum('p1',s.players.p1.hand[0]),true,'Momentum refreshes when a genuinely new turn begins for p1');
});

test("v0.11.63 Exhibition and match UI source contains the locked cinematic flow and removes the old opponent preview", async()=>{
  const fs=await import('node:fs');
  const ui=fs.readFileSync(new URL('../js/ui/app.js',import.meta.url),'utf8');
  const css=fs.readFileSync(new URL('../css/game.css',import.meta.url),'utf8');
  assert.ok(ui.includes('TONIGHT’S'));
  assert.ok(ui.includes('MAIN EVENT'));
  assert.ok(ui.includes('YOUR ENTRANCE'));
  assert.ok(ui.includes('OPPONENT ENTRANCE'));
  assert.equal(ui.includes('CPU OPPONENT · RANDOM'),false);
  assert.equal(ui.includes('CPU ownership is not restricted by your collection.'),false);
  assert.ok(ui.includes('data-open-superstar'));
  assert.ok(ui.includes('SUBMISSION DAMAGE'));
  assert.ok(css.includes('.ccg-card.type-momentum .ccg-card-art img.momentum-set-logo'));
  assert.ok(css.includes('.hud-hp-number.healthy'));
  assert.ok(css.includes('.hud-resource.adrenaline'));
});

test("turn advancement preserves Control-sequence combo memory until Control actually changes",()=>{
  const g=new MatchEngine({p1:stars[0],p2:stars[1],decks,rng:rng(1163)}),s=g.state();
  const p=s.players.p1;
  p.lastConnectedMethod='strike'; p.lastConnectedCardName='Punch'; p.controlMoveCount=2;
  p.events.strikeConnectedThisControl=true; p.events.counteredThisControl=true;
  p.methodDiscount.agility=2; p.namedDiscount['Test Move']=2; p.namedDamageBuff['Test Move']=3;
  p.turn.momentumPlayed=1;
  s.playerInControl='p1'; s.phase='POST_MOVE'; s.postMove={attackerId:'p1',defenderId:'p2',cardId:null};
  const beforeTurn=s.turnNumber, beforeSeq=s.controlSequence;
  assert.equal(g.endPostMove('p1'),true);
  assert.equal(s.turnNumber,beforeTurn+1);
  assert.equal(s.controlSequence,beforeSeq,'same wrestler retaining Control stays in the same Control sequence');
  assert.equal(p.turn.momentumPlayed,0,'new Move cycle refreshes Momentum');
  assert.equal(p.lastConnectedMethod,'strike');
  assert.equal(p.controlMoveCount,2);
  assert.equal(p.methodDiscount.agility,2);
  assert.equal(p.namedDiscount['Test Move'],2);
  assert.equal(p.namedDamageBuff['Test Move'],3);
  assert.equal(g.passTurn('p1'),true);
  assert.equal(p.lastConnectedMethod,null,'Control loss clears previous Method memory');
  assert.equal(p.lastConnectedCardName,null);
  assert.equal(p.controlMoveCount,0);
  assert.equal(p.events.strikeConnectedThisControl,false);
  assert.equal(p.events.counteredThisControl,false);
  assert.deepEqual(p.methodDiscount,{});
  assert.deepEqual(p.namedDiscount,{});
  assert.deepEqual(p.namedDamageBuff,{});
});

test("retained-Control kickouts advance the turn and refresh Momentum without erasing the Control sequence",()=>{
  const sol=starById.get('sol-ruca'), opp=stars.find(x=>x.id!=='sol-ruca');
  const g=new MatchEngine({p1:sol,p2:opp,decks,rng:()=>0.99}),s=g.state();
  const standing=byName('Standing Moonsault');
  s.playerInControl='p1'; s.phase='PIN_RESPONSE';
  s.players.p1.discard=[standing]; s.players.p1.turn.momentumPlayed=1;
  s.players.p1.lastConnectedMethod='agility'; s.players.p1.lastConnectedCardName='Standing Moonsault'; s.players.p1.controlMoveCount=2;
  s.postMove={attackerId:'p1',defenderId:'p2',cardId:standing.id,pinBonus:standing.pinBonus??0};
  s.proposedPin={attackerId:'p1',defenderId:'p2'};
  const beforeTurn=s.turnNumber,beforeSeq=s.controlSequence;
  assert.equal(g.passPinResponse('p2'),true);
  assert.equal(s.playerInControl,'p1');
  assert.equal(s.turnNumber,beforeTurn+1);
  assert.equal(s.controlSequence,beforeSeq);
  assert.equal(s.players.p1.turn.momentumPlayed,0);
  assert.equal(s.players.p1.lastConnectedMethod,'agility');
  assert.equal(s.players.p1.controlMoveCount,2);
});

test("queued Method/name discounts and named damage buffs survive unrelated Moves and are consumed by their matching Move",()=>{
  const g=new MatchEngine({p1:stars[0],p2:stars[1],decks,rng:rng(2163)}),s=g.state(),p=s.players.p1;
  const unrelated=byName('Headbutt')??byName('Punch'), target=byName('Dropkick');
  p.methodDiscount.agility=2; p.namedDiscount[target.name]=2; p.namedDamageBuff[target.name]=3;
  s.playerInControl='p1'; s.proposedMove={attackerId:'p1',defenderId:'p2',card:unrelated}; s.phase='RESOLVE_MOVE';
  g._connect();
  assert.equal(p.methodDiscount.agility,2);
  assert.equal(p.namedDiscount[target.name],2);
  assert.equal(p.namedDamageBuff[target.name],3);
  g.endPostMove('p1');
  s.proposedMove={attackerId:'p1',defenderId:'p2',card:target}; s.phase='RESOLVE_MOVE';
  g._connect();
  assert.equal(p.methodDiscount.agility,undefined);
  assert.equal(p.namedDiscount[target.name],undefined);
  assert.equal(p.namedDamageBuff[target.name],undefined);
});

test("The Mat Is Sacred Action lock survives Control changes and clears only when the affected wrestler commits a Move",()=>{
  const g=new MatchEngine({p1:stars[0],p2:stars[1],decks,rng:rng(3163)}),s=g.state();
  s.playerInControl='p2'; s.phase='ACTION'; s.players.p1.actionLocked=true;
  assert.equal(g.passTurn('p2'),true);
  assert.equal(s.playerInControl,'p1');
  assert.equal(s.players.p1.actionLocked,true,'lock must survive gaining a new turn');
  const move=byName('Punch')??allGameplayCards.find(c=>c.kind==='move'&&!c.defensiveOnly);
  s.players.p1.hand=[move]; s.players.p1.adrenaline=99;
  for(const m of ['agility','strength','strike','technical'])s.players.p1.momentum[m]=99;
  assert.equal(g.declareMove('p1',move),true);
  assert.equal(s.players.p1.actionLocked,false,'committing the Move clears the Action lock');
});

test("counterattack return paths advance the turn and start a fresh Control sequence for the wrestler who regains Control",()=>{
  const dom=starById.get('dominik-mysterio'), opp=stars.find(x=>x.id!=='dominik-mysterio');
  const g=new MatchEngine({p1:dom,p2:opp,decks,rng:rng(4163)}),s=g.state();
  const move=byName('Dropkick');
  s.playerInControl='p2'; s.phase='RESOLVE_MOVE'; s.players.p1.turn.momentumPlayed=1;
  s.players.p1.lastConnectedMethod='strike'; s.players.p1.controlMoveCount=2;
  const beforeTurn=s.turnNumber,beforeSeq=s.controlSequence;
  s.proposedMove={attackerId:'p2',defenderId:'p1',card:move,isCounterAttack:true,returnControlAfterResolve:'p1'};
  g._connect();
  assert.equal(s.playerInControl,'p1');
  assert.equal(s.phase,'ACTION');
  assert.equal(s.turnNumber,beforeTurn+1);
  assert.ok(s.controlSequence>beforeSeq);
  assert.equal(s.players.p1.turn.momentumPlayed,0);
  assert.equal(s.players.p1.lastConnectedMethod,null);
  assert.equal(s.players.p1.controlMoveCount,0);
});

test("Turn 5 and Turn 6 delayed Entrances fire exactly on corrected Move-cycle turn advancement",()=>{
  const cody=starById.get('cody-rhodes'),seth=starById.get('seth-rollins');
  const g5=new MatchEngine({p1:cody,p2:seth,decks,rng:rng(5163)}),s5=g5.state();
  const codyTech=s5.players.p1.momentum.technical,sethHand=s5.players.p2.hand.length,sethAd=s5.players.p2.adrenaline;
  s5.turnNumber=4;s5.playerInControl='p1';s5.phase='POST_MOVE';s5.postMove={attackerId:'p1',defenderId:'p2',cardId:null};
  g5.endPostMove('p1');
  assert.equal(s5.turnNumber,5);
  assert.equal(s5.players.p1.momentum.technical,codyTech+1);
  assert.equal(s5.players.p2.adrenaline,sethAd+1);
  assert.ok(s5.players.p2.hand.length>=sethHand+1);
  g5.passTurn('p1');
  assert.equal(s5.players.p1.events.turn5EntranceDone,true); assert.equal(s5.players.p2.events.turn5EntranceDone,true);

  const roman=starById.get('roman-reigns'),otherStar=stars.find(x=>x.id!=='roman-reigns');
  const g6=new MatchEngine({p1:roman,p2:otherStar,decks,rng:rng(6163)}),s6=g6.state(),before=s6.players.p1.adrenaline;
  s6.turnNumber=5;s6.playerInControl='p1';s6.phase='POST_MOVE';s6.postMove={attackerId:'p1',defenderId:'p2',cardId:null};
  g6.endPostMove('p1');
  assert.equal(s6.turnNumber,6); assert.equal(s6.players.p1.adrenaline,before+1); assert.equal(s6.players.p1.events.romanTurn6EntranceDone,true);
});

test("v0.11.63 wording audit uses turn and Control sequence consistently",()=>{
  const seth=starById.get('seth-rollins'),roman=starById.get('roman-reigns');
  assert.ok(seth.ability.text.includes('next Move this turn'));
  assert.equal(seth.ability.text.includes('Control turn'),false);
  assert.equal((roman.entrance.rulesText.match(/At the start of Turn 6/g)??[]).length,1);
});

test("Seth's The Visionary opens Control after a defensive Counter without advancing the turn",()=>{
  const seth=starById.get('seth-rollins'),opp=stars.find(x=>x.id!=='seth-rollins');
  const g=new MatchEngine({p1:opp,p2:seth,decks,rng:rng(7163)}),s=g.state();
  const incoming=allGameplayCards.find(c=>c.kind==='move'&&!c.defensiveOnly&&(c.moveType||c.tacticalType));
  const counter=allGameplayCards.find(c=>c.kind==='move'&&c.defensiveOnly&&(c.counters??[]).some(t=>[incoming.moveType,incoming.tacticalType].includes(t)));
  assert.ok(incoming&&counter,'need a defensive Counter pair');
  s.playerInControl='p1';s.phase='COUNTER';s.proposedMove={attackerId:'p1',defenderId:'p2',card:incoming};
  s.players.p1.hand=[incoming];s.players.p2.hand=[counter,allGameplayCards.find(c=>c.id==='special-seth-rollins')].filter(Boolean);
  for(const m of ['agility','strength','strike','technical'])s.players.p2.momentum[m]=99;
  s.players.p2.turn.momentumPlayed=1;
  const beforeTurn=s.turnNumber,beforeSeq=s.controlSequence;
  assert.equal(g.counter('p2',counter),true);
  assert.equal(s.playerInControl,'p2');
  assert.equal(s.phase,'ACTION');
  assert.equal(s.turnNumber,beforeTurn,'The Visionary must not advance the turn');
  assert.ok(s.controlSequence>beforeSeq,'Seth still begins a new Control sequence');
  assert.equal(s.players.p2.turn.momentumPlayed,1,'no turn advance means Momentum allowance is not refreshed');
  assert.equal(s.players.p2.specialUsed,true);
});


test("Money in the Bank Series 1 Jey Uso package is locked and playable",()=>{
  const jey=starById.get('jey-uso'); assert.ok(jey); assert.equal(jey.hp,52);
  assert.deepEqual(jey.starterMomentum,{strike:6,strength:4,agility:2});
  assert.equal(decks['jey-uso'].length,55); assert.equal(decks['jey-uso'].filter(c=>c.kind==='momentum').length,12);
  const splash=byName('Uso Splash'); assert.ok(splash); assert.equal(splash.finisher,true); assert.equal(splash.damage,16); assert.deepEqual(splash.requirements,{}); assert.deepEqual(splash.allowedSuperstarIds,['jey-uso']); assert.equal(splash.pinBonusAfterNamed.name,'Spear'); assert.equal(splash.pinBonusAfterNamed.pinBonus,5);
  assert.equal(CARD_NUMBER_BY_ID['running-hip-attack'].cardCode,'MITB1-001'); assert.equal(CARD_NUMBER_BY_ID['uso-splash'].cardCode,'MITB1-002'); assert.equal(CARD_NUMBER_BY_ID['superstar-jey-uso'].cardCode,'MITB1-005');
  const opp=stars.find(x=>x.id!=='jey-uso'); const g=new MatchEngine({p1:jey,p2:opp,decks,rng:rng(1164)}),st=g.state(),p1=st.players.p1;
  // Entrance applies.
  assert.equal(p1.momentum.strike,1); assert.equal(p1.adrenaline,1);
  // Strike ability queues Strength discount/adrenaline in same Control sequence.
  const strike=byName('Punch'), strength=byName('Spear'); p1.hand=[strike,strength,allGameplayCards.find(c=>c.id==='special-jey-uso'),splash].filter(Boolean); p1.adrenaline=99; for(const m of ['agility','strength','strike','technical'])p1.momentum[m]=99;
  st.playerInControl='p1'; st.phase='RESOLVE_MOVE'; st.proposedMove={attackerId:'p1',defenderId:'p2',card:strike}; g._connect();
  assert.equal(p1.methodDiscount.strength,1); assert.equal(p1.events.jeyStrengthAdrenaline,1);
  g.endPostMove('p1'); const ad=p1.adrenaline; st.phase='RESOLVE_MOVE'; st.proposedMove={attackerId:'p1',defenderId:'p2',card:strength}; g._connect(); assert.equal(p1.adrenaline,ad+1);
});


test("Money in the Bank Series 1 LA Knight package is locked and playable",()=>{
  const knight=starById.get('la-knight'); assert.ok(knight); assert.equal(knight.hp,52);
  assert.deepEqual(knight.starterMomentum,{strike:5,strength:3,technical:2,agility:2});
  assert.equal(decks['la-knight'].length,55); assert.equal(decks['la-knight'].filter(c=>c.kind==='momentum').length,12);
  const bft=byName('BFT'), jump=byName('Jumping Neckbreaker'), hammer=byName('Burning Hammer');
  assert.ok(bft&&jump&&hammer); assert.equal(bft.finisher,true); assert.equal(bft.damage,16); assert.deepEqual(bft.requirements,{}); assert.equal(bft.superstarId,'la-knight'); assert.equal(bft.pinBonusAfterNamed.name,'Diving Elbow Drop'); assert.equal(bft.pinBonusAfterNamed.pinBonus,5);
  assert.equal(CARD_NUMBER_BY_ID['jumping-neckbreaker'].cardCode,'MITB1-006'); assert.equal(CARD_NUMBER_BY_ID['la-knight-bft'].cardCode,'MITB1-008'); assert.equal(CARD_NUMBER_BY_ID['superstar-la-knight'].cardCode,'MITB1-011');
  const opp=stars.find(x=>x.id!=='la-knight'); const g=new MatchEngine({p1:knight,p2:opp,decks,rng:rng(1165)}),st=g.state(),p=st.players.p1;
  assert.equal(p.momentum.strike,1); assert.equal(p.adrenaline,1);
  // Megastar: qualifying 8+ printed Damage gives Adrenaline, and at 4+ pre-connect also draws.
  p.adrenaline=4; const beforeHand=p.hand.length; const heavy=hammer; st.playerInControl='p1';st.phase='RESOLVE_MOVE';st.proposedMove={attackerId:'p1',defenderId:'p2',card:heavy};g._connect(); assert.equal(p.adrenaline,5); assert.ok(p.hand.length>=beforeHand+1);
  // Jumping Neckbreaker only draws when the immediately previous connected Method was Strike.
  g.endPostMove('p1'); p.lastConnectedMethod='strike'; const before=p.hand.length; st.phase='RESOLVE_MOVE';st.proposedMove={attackerId:'p1',defenderId:'p2',card:jump};g._connect(); assert.ok(p.hand.length>=before+1);
});

test("Money in the Bank Series 1 Alexa Bliss package is locked and playable",()=>{
  const alexa=starById.get('alexa-bliss'); assert.ok(alexa); assert.equal(alexa.hp,48);
  assert.deepEqual(alexa.starterMomentum,{agility:6,strike:3,technical:3});
  assert.equal(decks['alexa-bliss'].length,55); assert.equal(decks['alexa-bliss'].filter(c=>c.kind==='momentum').length,12);
  const knees=byName('Double Knees'), code=byName('Code Red'), sister=byName('Sister Abigail'), twisted=byName('Twisted Bliss');
  assert.ok(knees&&code&&sister&&twisted); assert.equal(sister.trademark,true); assert.equal(twisted.finisher,true); assert.equal(twisted.damage,15); assert.deepEqual(twisted.requirements,{}); assert.equal(twisted.superstarId,'alexa-bliss'); assert.equal(twisted.pinBonusAfterNamed.name,'Sister Abigail'); assert.equal(twisted.pinBonusAfterNamed.pinBonus,6);
  assert.equal(CARD_NUMBER_BY_ID['double-knees'].cardCode,'MITB1-012'); assert.equal(CARD_NUMBER_BY_ID['alexa-bliss-twisted-bliss'].cardCode,'MITB1-015'); assert.equal(CARD_NUMBER_BY_ID['superstar-alexa-bliss'].cardCode,'MITB1-018');
  const opp=stars.find(x=>x.id!=='alexa-bliss'); const g=new MatchEngine({p1:alexa,p2:opp,decks,rng:rng(1166)}),st=g.state(),p=st.players.p1,d=st.players.p2;
  assert.equal(p.momentum.agility,1); assert.equal(p.adrenaline,1);
  // Five Feet of Fury only rewards a Move that begins while the opponent is already Stunned.
  p.adrenaline=5; d.status.stunnedTurns=1; d.stun=1; const beforeHand=p.hand.length; st.playerInControl='p1';st.phase='RESOLVE_MOVE';st.proposedMove={attackerId:'p1',defenderId:'p2',card:code};g._connect(); assert.equal(p.adrenaline,6); assert.ok(p.hand.length>=beforeHand+1);
  // Sister Abigail tutors/discounts Twisted Bliss and its combo pin bonus is +6.
  g.endPostMove('p1'); d.status.stunnedTurns=0; d.stun=0; p.deck=[twisted]; st.phase='RESOLVE_MOVE';st.proposedMove={attackerId:'p1',defenderId:'p2',card:sister};g._connect(); assert.ok(p.hand.some(c=>c.id==='alexa-bliss-twisted-bliss')); assert.equal(p.namedDiscount['Twisted Bliss'],1);
});

test("Alexa Bliss Mind Games reduces one Pin and rewards a successful kickout",()=>{
  const alexa=starById.get('alexa-bliss'),opp=stars.find(x=>x.id!=='alexa-bliss'); const g=new MatchEngine({p1:opp,p2:alexa,decks,rng:()=>0.99}),st=g.state(),a=st.players.p1,d=st.players.p2;
  const special=allGameplayCards.find(c=>c.id==='special-alexa-bliss'); d.hand=[special]; d.adrenaline=2; const beforeHand=d.hand.length;
  st.playerInControl='p1'; st.phase='POST_MOVE'; st.postMove={attackerId:'p1',defenderId:'p2',cardId:'test',pinBonus:4};
  assert.equal(g.attemptPin('p1'),true); assert.equal(st.proposedPin.pinBonusModifier,-2); assert.equal(d.specialUsed,true);
  assert.equal(g.passPinResponse('p2'),true); assert.equal(d.adrenaline,3); assert.ok(d.hand.length>=beforeHand); assert.equal(d.events.mindGamesPending,undefined);
});



test("Money in the Bank Series 1 Finn Bálor package is locked and playable",()=>{
  const finn=starById.get('finn-balor'); assert.ok(finn); assert.equal(finn.hp,50);
  assert.deepEqual(finn.starterMomentum,{agility:6,strike:4,technical:2});
  assert.equal(decks['finn-balor'].length,55); assert.equal(decks['finn-balor'].filter(c=>c.kind==='momentum').length,12);
  const shotgun=byName('Shotgun Dropkick'), move1916=byName('1916'), coup=byName('Coup de Grâce');
  assert.ok(shotgun&&move1916&&coup); assert.equal(move1916.trademark,true); assert.equal(coup.finisher,true); assert.equal(coup.damage,16); assert.deepEqual(coup.requirements,{}); assert.equal(coup.superstarId,'finn-balor'); assert.equal(coup.pinBonusAfterNamed.name,'Shotgun Dropkick'); assert.equal(coup.pinBonusAfterNamed.pinBonus,5);
  assert.equal(CARD_NUMBER_BY_ID['shotgun-dropkick'].cardCode,'MITB1-019'); assert.equal(CARD_NUMBER_BY_ID['finn-balor-coup-de-grace'].cardCode,'MITB1-021'); assert.equal(CARD_NUMBER_BY_ID['superstar-finn-balor'].cardCode,'MITB1-024');
  const opp=stars.find(x=>x.id!=='finn-balor'); const g=new MatchEngine({p1:finn,p2:opp,decks,rng:rng(1167)}),st=g.state(),p=st.players.p1;
  assert.equal(p.momentum.strength,1); assert.equal(p.adrenaline,1);
  // Relentless Pace triggers on the second and later connected Move in a Control sequence.
  p.adrenaline=5; const first=byName('Dropkick'),second=byName('Enzuigiri'); for(const m of ['agility','strength','strike','technical'])p.momentum[m]=99;
  st.playerInControl='p1';st.phase='RESOLVE_MOVE';st.proposedMove={attackerId:'p1',defenderId:'p2',card:first};g._connect(); const afterFirstAd=p.adrenaline; const afterFirstHand=p.hand.length;
  g.endPostMove('p1'); st.phase='RESOLVE_MOVE';st.proposedMove={attackerId:'p1',defenderId:'p2',card:second};g._connect(); assert.equal(p.adrenaline,afterFirstAd+1); assert.ok(p.hand.length>=afterFirstHand+1);
});

test("Finn Bálor Bálor Club and Shotgun Dropkick chain into Coup de Grâce",()=>{
  const finn=starById.get('finn-balor'),opp=stars.find(x=>x.id!=='finn-balor'); const g=new MatchEngine({p1:finn,p2:opp,decks,rng:rng(2167)}),st=g.state(),p=st.players.p1;
  const sling=byName('Sling Blade'),shotgun=byName('Shotgun Dropkick'),coup=byName('Coup de Grâce'),special=allGameplayCards.find(c=>c.id==='special-finn-balor');
  p.hand=[sling,special]; p.deck=[shotgun,byName('Punch'),coup]; p.adrenaline=99; for(const m of ['agility','strength','strike','technical'])p.momentum[m]=99;
  st.playerInControl='p1';st.phase='RESOLVE_MOVE';st.proposedMove={attackerId:'p1',defenderId:'p2',card:sling};g._connect(); assert.ok(p.hand.some(c=>c.id==='shotgun-dropkick')); assert.equal(p.namedDiscount['Shotgun Dropkick'],2); assert.equal(p.specialUsed,true);
  g.endPostMove('p1'); const sg=p.hand.find(c=>c.id==='shotgun-dropkick'); st.phase='RESOLVE_MOVE';st.proposedMove={attackerId:'p1',defenderId:'p2',card:sg};g._connect(); assert.ok(p.hand.some(c=>c.id==='finn-balor-coup-de-grace')); assert.equal(p.namedDiscount['Coup de Grâce'],1);
});
