
import { MatchEngine } from "../js/engine/MatchEngine.js";
import { superstars } from "../js/data/superstars.js";
import { decks } from "../js/data/decks.js";
import { executeCpuDecision, decisionOwner } from "../js/ai/WrestlingAI.js";

const summer=["cody-rhodes","cm-punk","roman-reigns","seth-rollins","oba-femi","brock-lesnar","kevin-owens","gunther"];
const hall=["hulk-hogan","andre-the-giant","randy-savage","ultimate-warrior","stone-cold-steve-austin","the-undertaker","mankind","kane"];
const ids=[...summer,...hall];
const roster=Object.fromEntries(ids.map(id=>[id,Object.values(superstars).find(s=>s.id===id)]));
const rng=(seed)=>{let x=seed>>>0;return()=>((x=(1664525*x+1013904223)>>>0)/4294967296)};
const reps=20;
const stat=Object.fromEntries(ids.map(id=>[id,{m:0,w:0,vsSummer:{m:0,w:0},vsHall:{m:0,w:0},turns:0,passes:0,moves:0,counters:0,specials:0}]));
const pairs={}; let total={m:0,draws:0,stalls:0,turns:0,passes:0,moves:0,counters:0,pins:0,subs:0};
function setOf(id){return summer.includes(id)?"SummerSlam":"Hall of Fame"}
for(let rep=0;rep<reps;rep++) for(let i=0;i<ids.length;i++) for(let j=0;j<ids.length;j++){
 const aid=ids[i],bid=ids[j],a=roster[aid],b=roster[bid];
 const g=new MatchEngine({superstarA:a,superstarB:b,deckA:decks[aid],deckB:decks[bid],startingControl:rep%2?"p2":"p1",rng:rng(2600000+rep*100000+i*1000+j)});
 let li=0,steps=0;
 while(g.state().phase!=="MATCH_OVER"&&steps++<900){
   const owner=decisionOwner(g.state()); if(!owner) break;
   executeCpuDecision(g,owner);
   const fresh=g.state().log.slice(li); li=g.state().log.length;
   for(const e of fresh){
     const sid=e.playerId==="p1"?aid:e.playerId==="p2"?bid:e.attackerId==="p1"?aid:e.attackerId==="p2"?bid:null;
     if(e.type==="CONTROL_PASSED"){total.passes++;if(sid)stat[sid].passes++}
     if(e.type==="MOVE_DECLARED"){total.moves++;if(sid)stat[sid].moves++}
     if(e.type==="MOVE_COUNTERED"||e.type==="AUTO_COUNTER"){total.counters++;if(sid)stat[sid].counters++}
     if(e.type==="SUPERSTAR_SPECIAL_PLAYED"&&sid)stat[sid].specials++;
   }
 }
 total.m++; stat[aid].m++; stat[bid].m++;
 const st=g.state();
 if(st.phase!=="MATCH_OVER"){total.stalls++;continue}
 total.turns+=st.turnNumber;stat[aid].turns+=st.turnNumber;stat[bid].turns+=st.turnNumber;
 const oppA=setOf(bid)==="SummerSlam"?"vsSummer":"vsHall";
 const oppB=setOf(aid)==="SummerSlam"?"vsSummer":"vsHall";
 stat[aid][oppA].m++; stat[bid][oppB].m++;
 if(st.winner==="p1"){stat[aid].w++;stat[aid][oppA].w++}
 else if(st.winner==="p2"){stat[bid].w++;stat[bid][oppB].w++}
 else total.draws++;
 if(st.finish?.type==="pin")total.pins++;
 if(st.finish?.type==="submission")total.subs++;
 const key=[aid,bid].sort().join("|"); if(!pairs[key])pairs[key]={m:0,a:aid,b:bid,wins:{}};
 pairs[key].m++; if(st.winner){const wid=st.winner==="p1"?aid:bid;pairs[key].wins[wid]=(pairs[key].wins[wid]??0)+1}
}
console.log(JSON.stringify({total,stat,pairs,names:Object.fromEntries(ids.map(id=>[id,roster[id].name])),summer,hall}));
