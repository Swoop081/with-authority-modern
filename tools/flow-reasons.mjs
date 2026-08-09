import { MatchEngine } from '../js/engine/MatchEngine.js';
import { superstars } from '../js/data/superstars.js';
import { decks } from '../js/data/decks.js';
import { cpuDecision, executeCpuDecision, decisionOwner } from '../js/ai/WrestlingAI.js';
import { effectiveTotalMomentum, moveEligibility } from '../js/engine/rules.js';
function seededRng(seed){let x=seed>>>0;return()=>((x=(1664525*x+1013904223)>>>0)/4294967296)}
const reasons={}; let dead=0, total=0;
const rs=Object.values(superstars);
for(let rep=0;rep<20;rep++) for(let i=0;i<4;i++)for(let j=0;j<4;j++)if(i!==j){
 const a=rs[i],b=rs[j],g=new MatchEngine({superstarA:a,superstarB:b,deckA:decks[a.id],deckB:decks[b.id],rng:seededRng(5000+rep*100+i*10+j)});
 let steps=0;
 while(g.state().phase!=='MATCH_OVER'&&steps<500){
   const st=g.state(); const o=decisionOwner(st); if(!o)break;
   const d=cpuDecision(st,o);
   if(st.phase==='ACTION' && effectiveTotalMomentum(st.players[o])>=3 && ['move','pass','returnToRing'].includes(d.type)){
     total++;
     if(d.type==='pass'){
       const moves=st.players[o].hand.filter(c=>c.kind==='move');
       if(moves.length){dead++;
         for(const c of moves){
           const e=moveEligibility(st,o,c);
           if(!e.legal){const key=e.reason ?? 'unknown';reasons[key]=(reasons[key]??0)+1;}
         }
       }
     }
   }
   executeCpuDecision(g,o);steps++;
 }
}
console.log({total,dead,rate:dead/total,reasons});
