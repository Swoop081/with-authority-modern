import { createProfile } from "../js/data/profile.js";
import { openBooster, grantBooster } from "../js/data/boosters.js";
import { cardsForSet, setCollectionFor } from "../js/data/collection.js";
import { collectionProgress } from "../js/data/set-progression.js";
import { ownershipCapFor } from "../js/data/card-limits.js";

const TRIALS = Number(process.env.TRIALS ?? 300);
const MAX_PACKS = Number(process.env.MAX_PACKS ?? 1000);
const SET_IDS = ["summerslam-series-1", "hall-of-fame-series-1", "evolution-series-1"];
const SET_SEED_OFFSET = { "summerslam-series-1": 0, "hall-of-fame-series-1": 55555, "evolution-series-1": 111111 };

function rngFor(seed) { let x = seed >>> 0; return () => ((x = (1664525 * x + 1013904223) >>> 0) / 4294967296); }
function percentile(values, pct) { const sorted=[...values].filter(Number.isFinite).sort((a,b)=>a-b); if(!sorted.length)return null; return sorted[Math.min(sorted.length-1,Math.max(0,Math.round((sorted.length-1)*pct)))]; }
function mean(values) { const v=values.filter(Number.isFinite); return v.length ? v.reduce((a,b)=>a+b,0)/v.length : null; }
function stats(values) { return { mean:mean(values), p25:percentile(values,.25), median:percentile(values,.5), p75:percentile(values,.75), p90:percentile(values,.9) }; }
function ownedSetSuperstars(profile,setCards){const ids=new Set(setCards.filter(c=>c.kind==="superstar").map(c=>c.superstarId));return profile.unlockedSuperstars.filter(id=>ids.has(id)).length;}
function totalAtCap(profile,setCards){return setCards.filter(card=>{const c=profile.ownedCards?.[card.id]??{normal:0,foil:0};return c.normal+c.foil>=ownershipCapFor(card);}).length;}
function foilCopyProgress(profile,setCards){const cap=setCards.reduce((sum,c)=>sum+ownershipCapFor(c),0);const count=setCards.reduce((sum,c)=>sum+Math.min(ownershipCapFor(c),profile.ownedCards?.[c.id]?.foil??0),0);return cap?Math.floor((count/cap)*100):0;}

function simulateSet(setId) {
  const setCards=cardsForSet(setId), starTotal=setCards.filter(c=>c.kind==="superstar").length;
  const metrics={ firstSetSuperstar:[], secondSetSuperstar:[], fourthSetSuperstar:[], allSetSuperstars:[], unique25:[], unique50:[], unique75:[], unique100:[], foilUnique25:[], foilUnique50:[], foilUnique100:[], allCardsAtPlayableCap:[], foilCopies50:[], foilCopies75:[], foilCopies90:[], foilCopies95:[] };
  for(let t=0;t<TRIALS;t++){
    const p=createProfile(t%2?"roman-reigns":"cm-punk"); grantBooster(p,MAX_PACKS+5,setId); const rng=rngFor(100003+t*7919+(SET_SEED_OFFSET[setId] ?? 0)); const hit={};
    for(let pack=1;pack<=MAX_PACKS;pack++){
      try{openBooster(p,rng,setId);}catch{break;}
      const prog=collectionProgress(p,setId),foilCopies=foilCopyProgress(p,setCards),u=ownedSetSuperstars(p,setCards);
      if(!hit.firstSetSuperstar&&u>=1)hit.firstSetSuperstar=pack;
      if(!hit.secondSetSuperstar&&u>=2)hit.secondSetSuperstar=pack;
      if(!hit.fourthSetSuperstar&&u>=4)hit.fourthSetSuperstar=pack;
      if(!hit.allSetSuperstars&&u>=starTotal)hit.allSetSuperstars=pack;
      for(const pct of [25,50,75,100])if(!hit[`unique${pct}`]&&prog.percent>=pct)hit[`unique${pct}`]=pack;
      for(const pct of [25,50,100])if(!hit[`foilUnique${pct}`]&&prog.foilPercent>=pct)hit[`foilUnique${pct}`]=pack;
      for(const pct of [50,75,90,95])if(!hit[`foilCopies${pct}`]&&foilCopies>=pct)hit[`foilCopies${pct}`]=pack;
      if(!hit.allCardsAtPlayableCap&&totalAtCap(p,setCards)===setCards.length)hit.allCardsAtPlayableCap=pack;
    }
    for(const key of Object.keys(metrics))metrics[key].push(hit[key]??Infinity);
  }
  console.log(`\n${setCollectionFor(setId)?.displayName ?? setId}: ${setCards.length} cards · ${starTotal} Superstars`);
  for(const [key,values] of Object.entries(metrics)){const complete=values.filter(Number.isFinite).length,st=stats(values);console.log(`${key.padEnd(24)} complete ${String(complete).padStart(3)}/${TRIALS}  mean ${st.mean?.toFixed(1)??'—'}  p25 ${st.p25??'—'}  median ${st.median??'—'}  p75 ${st.p75??'—'}  p90 ${st.p90??'—'}`);}
}

console.log(`Economy simulation: ${TRIALS} pack-only trials per set, max ${MAX_PACKS} packs each`);
for(const setId of SET_IDS)simulateSet(setId);
