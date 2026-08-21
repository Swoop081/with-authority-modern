import { createProfile } from '../js/data/profile.js';
import { grantRandomBoosters, openBooster, finalizePackUniversePoints, boosterCreditsFor, boosterEligible } from '../js/data/boosters.js';
import { activeLiveEventTowers } from '../js/data/live-events.js';
import { awardMatchSeasonXp, awardSeasonXp, claimAllSeasonTiers, claimFreeSeasonBooster, seasonTier } from '../js/data/seasons.js';
import { STORE_SET_ROTATION, STORE_SUPERSTAR_PRICE, storeRotation, storeSuperstars, purchaseStoreSuperstar } from '../js/data/store.js';
import { collectionCards } from '../js/data/collection.js';

const DAY=86400000;
// v0.13.85 milestone-pack economy model. Individual match wins pay 5 XP;
// pack income comes from free packs, weekly challenges, Exhibition 5-win
// milestones and full Live Event clears. Season Road remains unchanged.
const START=new Date(2026,7,21,12,0,0);
const HORIZONS=new Set([7,30,60,90]);
const styles={
 casual:{active:.43,dailyClear:.60,threeDay:.30,weekly:.30,birthday:.30,dailyChallenges:1,weeklyChallenges:1,otherMatches:5,winRate:.52},
 regular:{active:.86,dailyClear:.85,threeDay:.80,weekly:.85,birthday:.75,dailyChallenges:2,weeklyChallenges:2,otherMatches:15,winRate:.55},
 heavy:{active:1,dailyClear:1,threeDay:1,weekly:1,birthday:1,dailyChallenges:3,weeklyChallenges:3,otherMatches:25,winRate:.58},
};
function rng(seed){let a=seed>>>0;return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function openAll(p,r,stats,now){
 const setIds=[...new Set([...STORE_SET_ROTATION,...Object.keys(p.boosterCreditsBySet??{})])];
 for(const setId of setIds){
  while(boosterCreditsFor(p,setId)>0){
   const beforeStars=p.unlockedSuperstars.length; const pack=openBooster(p,r,setId,now); stats.packs++;
   const dup=finalizePackUniversePoints(p,pack); stats.dupUp+=dup; stats.totalUpEarned+=dup;
   stats.packStarUnlocks += Math.max(0,p.unlockedSuperstars.length-beforeStars);
  }
 }
}
function snapshot(p,stats,now){
 const releasedCards=collectionCards.filter(c=>boosterEligible(c,now));
 let capped=0; for(const c of releasedCards){ const own=p.ownedCards?.[c.id]; const n=(own?.normal||0)+(own?.foil||0); const cap=(c.kind==='superstar'||c.kind==='entrance'||c.kind==='manager')?1:(c.kind==='momentum'?15:(c.maxCopies??5)); if(n>=cap)capped++; }
 return {balance:p.universePoints,earned:stats.totalUpEarned,directLive:stats.liveUp,duplicate:stats.dupUp,season:stats.seasonUp,spentStars:stats.starSpend,storeStars:stats.storeStars,packStarUnlocks:stats.packStarUnlocks,unlocked:p.unlockedSuperstars.length,packs:stats.packs,tier:seasonTier(p),cappedPct:+(100*capped/Math.max(1,releasedCards.length)).toFixed(1)};
}
function simulate(kind,seed){
 const cfg=styles[kind],r=rng(seed),p=createProfile('cm-punk');
 const stats={packs:0,dupUp:0,totalUpEarned:0,liveUp:0,seasonUp:0,starSpend:0,storeStars:0,packStarUnlocks:0};
 const seenTowerKeys=new Set(); const out={}; let exhibitionWins=0;
 for(let di=1;di<=90;di++){
  const now=new Date(START.getTime()+(di-1)*DAY); const active=r()<cfg.active;
  if(active){
   claimFreeSeasonBooster(p,r,now);
   // Daily challenges pay XP only.
   for(let i=0;i<cfg.dailyChallenges;i++) awardSeasonXp(p,10,'challenge');
   // Other matches are modeled as Exhibition: 5 XP on wins and one random pack every fifth win.
   for(let i=0;i<cfg.otherMatches;i++){
    const result=r()<cfg.winRate?'win':'loss'; awardMatchSeasonXp(p,result);
    if(result==='win' && ++exhibitionWins%5===0) grantRandomBoosters(p,1,r,now);
   }
   // Live Event clears pay one random pack after five wins, with no per-match packs or direct UP.
   for(const tower of activeLiveEventTowers(now)){
    if(seenTowerKeys.has(tower.key)) continue;
    const prob=tower.cadence==='daily'?cfg.dailyClear:tower.cadence==='three-day'?cfg.threeDay:tower.cadence==='weekly'?cfg.weekly:cfg.birthday;
    if(r()<prob){
      for(let m=0;m<5;m++) awardMatchSeasonXp(p,'win');
      grantRandomBoosters(p,1,r,now);
    }
    seenTowerKeys.add(tower.key);
   }
  }
  // Each completed weekly challenge pays 25 XP plus one random released-set pack.
  if(now.getDay()===0 && r()<cfg.active){
    for(let i=0;i<cfg.weeklyChallenges;i++){grantRandomBoosters(p,1,r,now); awardSeasonXp(p,25,'challenge');}
  }
  // Season Road remains unchanged.
  const before=p.universePoints; claimAllSeasonTiers(p,now); const seasonGain=p.universePoints-before; stats.seasonUp+=seasonGain; stats.totalUpEarned+=seasonGain;
  openAll(p,r,stats,now);
  const rot=storeRotation(now); let guard=0;
  while(p.universePoints>=STORE_SUPERSTAR_PRICE && guard++<8){const candidate=storeSuperstars(rot.setId,now).find(s=>!p.unlockedSuperstars.includes(s.id)); if(!candidate)break; purchaseStoreSuperstar(p,candidate.id,now); stats.starSpend+=STORE_SUPERSTAR_PRICE; stats.storeStars++;}
  if(HORIZONS.has(di)) out[di]=snapshot(p,stats,now);
 }
 return out;
}
function q(arr,p){const s=[...arr].sort((a,b)=>a-b);return s[Math.floor((s.length-1)*p)];}
for(const kind of Object.keys(styles)){
 const reps=[]; for(let i=0;i<80;i++)reps.push(simulate(kind,1000+i*7919+kind.length*17));
 console.log('\n'+kind.toUpperCase());
 for(const d of [7,30,60,90]){
  const fields=['balance','earned','directLive','duplicate','season','spentStars','storeStars','packStarUnlocks','unlocked','packs','tier','cappedPct'];
  const row={day:d}; for(const f of fields){const a=reps.map(x=>x[d][f]); row[f]={mean:+(a.reduce((s,v)=>s+v,0)/a.length).toFixed(1),p10:q(a,.1),p90:q(a,.9)};} console.log(JSON.stringify(row));
 }
}
