
import { MatchEngine } from "../js/engine/MatchEngine.js";
import { superstars } from "../js/data/superstars.js";
import { decks } from "../js/data/decks.js";
import { executeCpuDecision, decisionOwner } from "../js/ai/WrestlingAI.js";
import { moveEligibility } from "../js/engine/rules.js";
const ids=["hulk-hogan","andre-the-giant","randy-savage","ultimate-warrior","stone-cold-steve-austin","the-undertaker","mankind","kane"];
const rs=ids.map(id=>Object.values(superstars).find(s=>s.id===id));
const rng=s=>{let x=s>>>0;return()=>((x=(1664525*x+1013904223)>>>0)/4294967296)};
const out=Object.fromEntries(ids.map(id=>[id,{samples:0,off:0,legal:0,reasons:{},search:{},decl:{},conn:{},passes:0}]));
for(let rep=0;rep<12;rep++)for(let i=0;i<8;i++)for(let j=0;j<8;j++){
 const a=rs[i],b=rs[j],g=new MatchEngine({superstarA:a,superstarB:b,deckA:decks[a.id],deckB:decks[b.id],rng:rng(500000+rep*10000+i*100+j)});let li=0,k=0;
 while(g.state().phase!=="MATCH_OVER"&&k++<800){
  let st=g.state(),o=decisionOwner(st);if(!o)break;
  if(st.phase==="ACTION"&&st.playerInControl===o){let sid=o==="p1"?a.id:b.id,p=st.players[o],x=out[sid];x.samples++;
   for(const c of p.hand.filter(c=>c.kind==="move"&&!c.defensiveOnly)){x.off++;let e=moveEligibility(st,o,c);if(e.legal)x.legal++;else{x.reasons[c.id+"|"+e.reason]=(x.reasons[c.id+"|"+e.reason]??0)+1;}}
  }
  executeCpuDecision(g,o);let fresh=g.state().log.slice(li);li=g.state().log.length;
  for(const e of fresh){
   let sid=e.playerId==="p1"?a.id:e.playerId==="p2"?b.id:e.attackerId==="p1"?a.id:e.attackerId==="p2"?b.id:null;if(!sid)continue;let x=out[sid];
   if(e.type==="CARD_SEARCHED")x.search[e.sourceCardId+"->"+e.cardId]=(x.search[e.sourceCardId+"->"+e.cardId]??0)+1;
   if(e.type==="MOVE_DECLARED")x.decl[e.cardId]=(x.decl[e.cardId]??0)+1;
   if(e.type==="MOVE_CONNECTED")x.conn[e.cardId]=(x.conn[e.cardId]??0)+1;
   if(e.type==="CONTROL_PASSED")x.passes++;
  }
 }
}
console.log(JSON.stringify(out));
