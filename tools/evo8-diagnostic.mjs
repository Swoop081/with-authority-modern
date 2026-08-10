
import {MatchEngine} from "../js/engine/MatchEngine.js";
import {superstars} from "../js/data/superstars.js";
import {decks} from "../js/data/decks.js";
import {executeCpuDecision,decisionOwner} from "../js/ai/WrestlingAI.js";
import {moveEligibility} from "../js/engine/rules.js";
const ids=["rhea-ripley","liv-morgan","becky-lynch","bayley","charlotte-flair","iyo-sky","paige","stephanie-vaquer"];
const S=id=>Object.values(superstars).find(s=>s.id===id);
const rng=s=>{let x=s>>>0;return()=>((x=(1664525*x+1013904223)>>>0)/4294967296)};
const O=Object.fromEntries(ids.map(id=>[id,{off:0,legal:0,reasons:{},decl:{},conn:{},search:{}}]));
for(let rep=0;rep<10;rep++)for(const a of ids)for(const b of ids){
 const g=new MatchEngine({superstarA:S(a),superstarB:S(b),deckA:decks[a],deckB:decks[b],rng:rng(190000+rep*10000+ids.indexOf(a)*100+ids.indexOf(b))});let li=0,k=0;
 while(g.state().phase!=="MATCH_OVER"&&k++<900){
  const x=g.state(),o=decisionOwner(x);if(!o)break;
  if(x.phase==="ACTION"&&x.playerInControl===o){const id=o==="p1"?a:b,p=x.players[o],z=O[id];
   for(const c of p.hand.filter(c=>c.kind==="move"&&!c.defensiveOnly)){z.off++;let e=moveEligibility(x,o,c);if(e.legal)z.legal++;else{let q=c.id+"|"+e.reason;z.reasons[q]=(z.reasons[q]??0)+1;}}
  }
  executeCpuDecision(g,o);const fresh=g.state().log.slice(li);li=g.state().log.length;
  for(const e of fresh){let id=e.attackerId==="p1"?a:e.attackerId==="p2"?b:e.playerId==="p1"?a:e.playerId==="p2"?b:null;if(!id)continue;let z=O[id];
   if(e.type==="MOVE_DECLARED")z.decl[e.cardId]=(z.decl[e.cardId]??0)+1;
   if(e.type==="MOVE_CONNECTED")z.conn[e.cardId]=(z.conn[e.cardId]??0)+1;
   if(e.type==="CARD_SEARCHED")z.search[e.sourceCardId+"->"+e.cardId]=(z.search[e.sourceCardId+"->"+e.cardId]??0)+1;
  }
 }
}
console.log(JSON.stringify(O));
