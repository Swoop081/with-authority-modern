import { superstars } from '../js/data/superstars.js';
import { decks } from '../js/data/decks.js';
import { isPlayerReleasedSetId } from '../js/data/release.js';
import { applyCardTier } from '../js/data/variants.js';
import { MatchEngine } from '../js/engine/MatchEngine.js';
import { decisionOwner, cpuDecision, executeCpuDecision } from '../js/ai/WrestlingAI.js';

const LIVE_GAMES_PER_PAIR = Math.max(2, Number(process.env.GAMES_PER_PAIR || 20));
const STARTER_MATCHES = Math.max(100, Number(process.env.STARTER_MATCHES || 5000));
const MAX_STEPS = 2500;

function seededRng(seed){ let x=seed>>>0; return ()=>{ x=(x*1664525+1013904223)>>>0; return x/4294967296; }; }
function quantile(values,p){ if(!values.length)return null; const a=[...values].sort((x,y)=>x-y); const pos=(a.length-1)*p,lo=Math.floor(pos),hi=Math.ceil(pos); return lo===hi?a[lo]:a[lo]+(a[hi]-a[lo])*(pos-lo); }
function round(n,d=3){ return Number(Number(n).toFixed(d)); }
const normalDecks=Object.fromEntries(Object.entries(decks).map(([id,deck])=>[id,deck.map(card=>applyCardTier(card,'normal'))]));

function play(p1,p2,seed){
  const engine=new MatchEngine({p1,p2,decks:normalDecks,rng:seededRng(seed)});
  let steps=0,lastLog=0,recycleEvents=0,firstRecycleTurn=null;
  const minDeck={p1:engine.state().players.p1.deck.length,p2:engine.state().players.p2.deck.length};
  while(engine.state().phase!=='MATCH_OVER'&&steps++<MAX_STEPS){
    const before=engine.state();
    for(const pid of ['p1','p2']) minDeck[pid]=Math.min(minDeck[pid],before.players[pid].deck.length);
    const pid=decisionOwner(before), decision=cpuDecision(engine,pid);
    if(!decision||!executeCpuDecision(engine,decision,pid)) break;
    const after=engine.state();
    for(const side of ['p1','p2']) minDeck[side]=Math.min(minDeck[side],after.players[side].deck.length);
    for(let i=lastLog;i<after.log.length;i++) if(after.log[i].type==='PLAYBOOK_RECYCLED'){
      recycleEvents++;
      if(firstRecycleTurn==null) firstRecycleTurn=after.turnNumber;
    }
    lastLog=after.log.length;
  }
  const state=engine.state();
  return {finished:state.phase==='MATCH_OVER',turns:state.turnNumber,recycleEvents,firstRecycleTurn,minDeck,finalDeck:{p1:state.players.p1.deck.length,p2:state.players.p2.deck.length},finish:state.finish?.type??null};
}

const liveStars=Object.values(superstars).filter(s=>isPlayerReleasedSetId(s.setId)&&(decks[s.id]?.length??0)===60);
const live={matches:0,stalls:0,recycledMatches:0,recycleEvents:0,turns:[],finalDecks:[],minDecks:[],firstRecycleTurns:[]};
for(let i=0;i<liveStars.length;i++) for(let j=i+1;j<liveStars.length;j++) for(let k=0;k<LIVE_GAMES_PER_PAIR;k++){
  const flip=k%2===1,p1=flip?liveStars[j]:liveStars[i],p2=flip?liveStars[i]:liveStars[j];
  const r=play(p1,p2,1388000+i*100003+j*1009+k*37);
  live.matches++; if(!r.finished)live.stalls++; if(r.recycleEvents){live.recycledMatches++;live.recycleEvents+=r.recycleEvents;live.firstRecycleTurns.push(r.firstRecycleTurn);}
  live.turns.push(r.turns); live.finalDecks.push(r.finalDeck.p1,r.finalDeck.p2);live.minDecks.push(r.minDeck.p1,r.minDeck.p2);
}

const punk=Object.values(superstars).find(s=>s.id==='cm-punk');
const roman=Object.values(superstars).find(s=>s.id==='roman-reigns');
if(!punk||!roman) throw new Error('Starter Superstar fixture missing');
const starter={matches:0,stalls:0,recycledMatches:0,turns:0,finalDecks:[],minDecks:[]};
for(let k=0;k<STARTER_MATCHES;k++){
  const flip=k%2===1,p1=flip?roman:punk,p2=flip?punk:roman;
  const r=play(p1,p2,13887000+k*97);
  starter.matches++;if(!r.finished)starter.stalls++;if(r.recycleEvents)starter.recycledMatches++;starter.turns+=r.turns;starter.finalDecks.push(r.finalDeck.p1,r.finalDeck.p2);starter.minDecks.push(r.minDeck.p1,r.minDeck.p2);
}
const sum=a=>a.reduce((x,y)=>x+y,0);
const output={
  tier:'Normal',damageOffset:-2,
  livePool:{
    releasedSuperstars:liveStars.length,gamesPerPair:LIVE_GAMES_PER_PAIR,matches:live.matches,stalls:live.stalls,
    finishBeforeRecyclePct:round(100*(live.matches-live.recycledMatches)/live.matches),
    recycledMatches:live.recycledMatches,recycleRatePct:round(100*live.recycledMatches/live.matches),recycleEvents:live.recycleEvents,
    firstRecycleTurnMin:live.firstRecycleTurns.length?Math.min(...live.firstRecycleTurns):null,firstRecycleTurnMedian:quantile(live.firstRecycleTurns,.5),
    averageTurns:round(sum(live.turns)/live.turns.length,2),turnP95:quantile(live.turns,.95),maxTurns:Math.max(...live.turns),
    averageFinalDeck:round(sum(live.finalDecks)/live.finalDecks.length,2),finalDeckP10:quantile(live.finalDecks,.1),finalDeckP5:quantile(live.finalDecks,.05),
    minimumDeckObserved:Math.min(...live.minDecks)
  },
  starterPunkVsRoman:{
    matches:starter.matches,stalls:starter.stalls,recycledMatches:starter.recycledMatches,recycleRatePct:round(100*starter.recycledMatches/starter.matches),
    averageTurns:round(starter.turns/starter.matches,2),averageFinalDeck:round(sum(starter.finalDecks)/starter.finalDecks.length,2),minimumFinalDeck:Math.min(...starter.finalDecks),minimumDeckObserved:Math.min(...starter.minDecks)
  }
};
console.log(JSON.stringify(output,null,2));
if(live.stalls||starter.stalls)process.exitCode=1;
