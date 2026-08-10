
import {MatchEngine} from "../js/engine/MatchEngine.js";
import {superstars} from "../js/data/superstars.js";
import {decks} from "../js/data/decks.js";
import {executeCpuDecision,decisionOwner} from "../js/ai/WrestlingAI.js";
const ids=["cody-rhodes","cm-punk","roman-reigns","seth-rollins","oba-femi","brock-lesnar","kevin-owens","gunther"];
const rs=ids.map(id=>Object.values(superstars).find(s=>s.id===id));
const rng=s=>{let x=s>>>0;return()=>((x=(1664525*x+1013904223)>>>0)/4294967296)};
const out=Object.fromEntries(ids.map(id=>[id,{specials:{},matches:0,wins:0}]));
for(let rep=0;rep<12;rep++)for(let i=0;i<8;i++)for(let j=0;j<8;j++){
 const a=rs[i],b=rs[j],g=new MatchEngine({superstarA:a,superstarB:b,deckA:decks[a.id],deckB:decks[b.id],startingControl:rep%2?"p2":"p1",rng:rng(700000+rep*10000+i*100+j)});
 out[a.id].matches++;out[b.id].matches++;let li=0,k=0;
 while(g.state().phase!=="MATCH_OVER"&&k++<700){
  const o=decisionOwner(g.state());if(!o)break;executeCpuDecision(g,o);
  const f=g.state().log.slice(li);li=g.state().log.length;
  for(const e of f) if(e.type==="SUPERSTAR_SPECIAL_PLAYED"){
    const sid=e.playerId==="p1"?a.id:b.id;out[sid].specials[e.cardId]=(out[sid].specials[e.cardId]??0)+1;
  }
 }
 if(g.state().winner==="p1")out[a.id].wins++;
 else if(g.state().winner==="p2")out[b.id].wins++;
}
console.log(JSON.stringify(out));
