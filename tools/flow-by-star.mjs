import { MatchEngine } from "../js/engine/MatchEngine.js";
import { superstars } from "../js/data/superstars.js";
import { decks } from "../js/data/decks.js";
import { effectiveTotalMomentum } from "../js/engine/rules.js";
import { cpuDecision, executeCpuDecision, decisionOwner } from "../js/ai/WrestlingAI.js";
import { isOffensiveMove } from "../js/data/move-types.js";
const roster=Object.values(superstars); const seededRng=(seed)=>{let x=seed>>>0;return()=>((x=(1664525*x+1013904223)>>>0)/4294967296)};
const m=new Map(roster.map(s=>[s.id,{t:0,d:0}]));
for(let rep=0;rep<3;rep++)for(let i=0;i<roster.length;i++)for(let j=0;j<roster.length;j++)if(i!==j){const a=roster[i],b=roster[j];const g=new MatchEngine({superstarA:a,superstarB:b,deckA:decks[a.id],deckB:decks[b.id],rng:seededRng(7000+rep*100+i*10+j)});let steps=0;while(g.state().phase!=="MATCH_OVER"&&steps<500){const owner=decisionOwner(g.state());if(!owner)break;const d=cpuDecision(g.state(),owner),st=g.state();if(st.phase==="ACTION"&&effectiveTotalMomentum(st.players[owner])>=3&&["move","pass","returnToRing"].includes(d.type)){const sid=st.players[owner].superstar.id;m.get(sid).t++;if(d.type==="pass"&&st.players[owner].hand.some(c=>isOffensiveMove(c)))m.get(sid).d++;}executeCpuDecision(g,owner);steps++;}}
for(const s of roster){const x=m.get(s.id);console.log(`${s.name.padEnd(24)} ${x.d}/${x.t} ${(100*x.d/x.t).toFixed(1)}%`)}
