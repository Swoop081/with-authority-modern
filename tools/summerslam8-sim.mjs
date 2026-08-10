
import { MatchEngine } from "../js/engine/MatchEngine.js";
import { superstars } from "../js/data/superstars.js";
import { decks } from "../js/data/decks.js";
import { collectionCards } from "../js/data/collection.js";
import { executeCpuDecision, decisionOwner } from "../js/ai/WrestlingAI.js";

const ids=["cody-rhodes","cm-punk","roman-reigns","seth-rollins","oba-femi","brock-lesnar","kevin-owens","gunther"];
const roster=ids.map(id=>Object.values(superstars).find(s=>s.id===id));
const cardById=new Map(collectionCards.map(c=>[c.id,c]));
for(const deck of Object.values(decks)) for(const c of deck) if(!cardById.has(c.id)) cardById.set(c.id,c);
const seededRng=(seed)=>{let x=seed>>>0;return()=>((x=(1664525*x+1013904223)>>>0)/4294967296);};
const reps=30;
const total={matches:0,wins:0,draws:0,turns:0,stalls:0,moves:0,counters:0,auto:0,pin:0,submission:0,winnerHp:0,loserHp:0,passes:0};
const stars=new Map(ids.map(id=>[id,{matches:0,wins:0,turns:0,moves:0,counters:0,submissionWins:0,passes:0}]));
const matchups={};
for(let rep=0;rep<reps;rep++) for(let i=0;i<roster.length;i++) for(let j=0;j<roster.length;j++){
 const a=roster[i],b=roster[j];
 const g=new MatchEngine({superstarA:a,superstarB:b,deckA:decks[a.id],deckB:decks[b.id],startingControl:rep%2===0?"p1":"p2",rng:seededRng(910000+rep*10000+i*100+j)});
 let steps=0,logIndex=0;
 while(g.state().phase!=="MATCH_OVER"&&steps<700){
   const owner=decisionOwner(g.state()); if(!owner)break;
   executeCpuDecision(g,owner);steps++;
   const fresh=g.state().log.slice(logIndex);logIndex=g.state().log.length;
   for(const e of fresh){
     if(e.type==="MOVE_DECLARED"){total.moves++;stars.get(e.playerId==="p1"?a.id:b.id).moves++;}
     else if(e.type==="MOVE_COUNTERED"||e.type==="AUTO_COUNTER"){total.counters++;if(e.type==="AUTO_COUNTER")total.auto++;}
     else if(e.type==="CONTROL_PASSED"){total.passes++;stars.get(e.playerId==="p1"?a.id:b.id).passes++;}
   }
 }
 total.matches++;stars.get(a.id).matches++;stars.get(b.id).matches++;
 const st=g.state();
 if(st.phase!=="MATCH_OVER"){total.stalls++;total.draws++;continue;}
 total.turns+=st.turnNumber;stars.get(a.id).turns+=st.turnNumber;stars.get(b.id).turns+=st.turnNumber;
 const key=`${a.id}|${b.id}`;matchups[key]??={matches:0,aWins:0,bWins:0,draws:0,turns:0};matchups[key].matches++;matchups[key].turns+=st.turnNumber;
 if(st.winner==="p1"){stars.get(a.id).wins++;matchups[key].aWins++;}
 else if(st.winner==="p2"){stars.get(b.id).wins++;matchups[key].bWins++;}
 else {total.draws++;matchups[key].draws++;}
 if(st.finish?.type==="pin")total.pin++;
 if(st.finish?.type==="submission"){total.submission++;if(st.winner)stars.get(st.winner==="p1"?a.id:b.id).submissionWins++;}
 if(st.winner){const loser=st.winner==="p1"?"p2":"p1";total.winnerHp+=st.players[st.winner].hp;total.loserHp+=st.players[loser].hp;}
}
const out={
 total:{
  matches:total.matches,stalls:total.stalls,draws:total.draws,
  avgTurns:total.turns/Math.max(1,total.matches-total.stalls),
  counterRate:total.counters/Math.max(1,total.moves),
  autoCounters:total.auto,
  pinRate:total.pin/total.matches,submissionRate:total.submission/total.matches,
  avgWinnerHp:total.winnerHp/Math.max(1,total.matches-total.stalls),
  avgLoserHp:total.loserHp/Math.max(1,total.matches-total.stalls),
  passesPerMatch:total.passes/total.matches
 },
 stars:Object.fromEntries(ids.map(id=>{
   const x=stars.get(id);return [id,{name:Object.values(superstars).find(s=>s.id===id).name,
    winRate:x.wins/x.matches,wins:x.wins,matches:x.matches,
    avgTurns:x.turns/Math.max(1,x.matches/2),
    movesPerMatch:x.moves/Math.max(1,x.matches/2),
    passesPerMatch:x.passes/Math.max(1,x.matches/2),
    submissionWins:x.submissionWins
   }];
 })),
 matchups
};
console.log(JSON.stringify(out));
