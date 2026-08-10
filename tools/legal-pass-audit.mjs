
import {MatchEngine} from "../js/engine/MatchEngine.js";
import {superstars} from "../js/data/superstars.js";
import {decks} from "../js/data/decks.js";
import {cpuDecision,executeCpuDecision,decisionOwner} from "../js/ai/WrestlingAI.js";
import {moveEligibility} from "../js/engine/rules.js";
import {isOffensiveMove} from "../js/data/move-types.js";
const rs=Object.values(superstars);
const rng=s=>{let x=s>>>0;return()=>((x=(1664525*x+1013904223)>>>0)/4294967296)};
const by=Object.fromEntries(rs.map(s=>[s.id,{actions:0,passes:0,passesWithLegal:0,examples:{}}]));
let total={actions:0,passes:0,passesWithLegal:0};
for(let rep=0;rep<4;rep++)for(let i=0;i<rs.length;i++)for(let j=0;j<rs.length;j++)if(i!==j){
 const a=rs[i],b=rs[j],g=new MatchEngine({superstarA:a,superstarB:b,deckA:decks[a.id],deckB:decks[b.id],rng:rng(440000+rep*10000+i*100+j)});
 let steps=0;
 while(g.state().phase!=="MATCH_OVER"&&steps++<700){
  const state=g.state(),o=decisionOwner(state);if(!o)break;
  const d=cpuDecision(state,o);
  if(state.phase==="ACTION"&&state.playerInControl===o){
    const sid=state.players[o].superstar.id;
    total.actions++;by[sid].actions++;
    if(d.type==="pass"){
      total.passes++;by[sid].passes++;
      const legal=state.players[o].hand.filter(c=>isOffensiveMove(c)&&moveEligibility(state,o,c).legal);
      if(legal.length){
        total.passesWithLegal++;by[sid].passesWithLegal++;
        for(const c of legal){const k=c.id;by[sid].examples[k]=(by[sid].examples[k]??0)+1;}
      }
    }
  }
  executeCpuDecision(g,o);
 }
}
console.log(JSON.stringify({total,by}));
