
import { MatchEngine } from "../js/engine/MatchEngine.js";
import { superstars } from "../js/data/superstars.js";
import { decks } from "../js/data/decks.js";
import { executeCpuDecision, decisionOwner } from "../js/ai/WrestlingAI.js";

const ids=["hulk-hogan","andre-the-giant","randy-savage","ultimate-warrior","stone-cold-steve-austin","the-undertaker","mankind","kane"];
const roster=ids.map(id=>Object.values(superstars).find(s=>s.id===id));
const rng=(seed)=>{let x=seed>>>0;return()=>((x=(1664525*x+1013904223)>>>0)/4294967296)};
const reps=30;
const total={matches:0,draws:0,stalls:0,turns:0,passes:0,moves:0,counters:0,auto:0,pins:0,subs:0,winnerHp:0,loserHp:0};
const stars=Object.fromEntries(ids.map(id=>[id,{matches:0,wins:0,turns:0,passes:0,moves:0,specials:0,managerUses:0}]));
for(let rep=0;rep<reps;rep++)for(let i=0;i<8;i++)for(let j=0;j<8;j++){
 const a=roster[i],b=roster[j];
 const g=new MatchEngine({superstarA:a,superstarB:b,deckA:decks[a.id],deckB:decks[b.id],startingControl:rep%2?"p2":"p1",rng:rng(1100000+rep*10000+i*100+j)});
 let li=0,steps=0;
 while(g.state().phase!=="MATCH_OVER"&&steps++<800){
  const owner=decisionOwner(g.state()); if(!owner) break;
  executeCpuDecision(g,owner);
  const fresh=g.state().log.slice(li); li=g.state().log.length;
  for(const e of fresh){
   const sid=e.playerId==="p1"?a.id:e.playerId==="p2"?b.id:null;
   if(e.type==="CONTROL_PASSED"){total.passes++; if(sid)stars[sid].passes++;}
   if(e.type==="MOVE_DECLARED"){total.moves++; if(sid)stars[sid].moves++;}
   if(e.type==="MOVE_COUNTERED"||e.type==="AUTO_COUNTER"){total.counters++;if(e.type==="AUTO_COUNTER")total.auto++;}
   if(e.type==="SUPERSTAR_SPECIAL_PLAYED"&&sid)stars[sid].specials++;
   if(e.type==="MANAGER_ABILITY"&&sid)stars[sid].managerUses++;
  }
 }
 total.matches++;stars[a.id].matches++;stars[b.id].matches++;
 const st=g.state();
 if(st.phase!=="MATCH_OVER"){total.stalls++;continue;}
 total.turns+=st.turnNumber;stars[a.id].turns+=st.turnNumber;stars[b.id].turns+=st.turnNumber;
 if(st.winner==="p1")stars[a.id].wins++;
 else if(st.winner==="p2")stars[b.id].wins++;
 else total.draws++;
 if(st.finish?.type==="pin")total.pins++;
 if(st.finish?.type==="submission")total.subs++;
 if(st.winner){
  const loser=st.winner==="p1"?"p2":"p1";
  total.winnerHp+=st.players[st.winner].hp; total.loserHp+=st.players[loser].hp;
 }
}
console.log(JSON.stringify({
 total:{matches:total.matches,draws:total.draws,stalls:total.stalls,avgTurns:total.turns/Math.max(1,total.matches-total.stalls),passesPerMatch:total.passes/total.matches,counterRate:total.counters/Math.max(1,total.moves),autoCounters:total.auto,pinRate:total.pins/total.matches,submissionRate:total.subs/total.matches,avgWinnerHp:total.winnerHp/Math.max(1,total.matches-total.stalls),avgLoserHp:total.loserHp/Math.max(1,total.matches-total.stalls)},
 stars:Object.fromEntries(ids.map(id=>[id,{name:Object.values(superstars).find(s=>s.id===id).name,winRate:stars[id].wins/stars[id].matches,wins:stars[id].wins,matches:stars[id].matches,passesPerMatch:stars[id].passes/Math.max(1,stars[id].matches/2),movesPerMatch:stars[id].moves/Math.max(1,stars[id].matches/2),specials:stars[id].specials,managerUses:stars[id].managerUses}]))
}));
