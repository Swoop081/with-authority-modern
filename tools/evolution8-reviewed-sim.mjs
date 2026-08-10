
import {MatchEngine} from "../js/engine/MatchEngine.js";
import {superstars} from "../js/data/superstars.js";
import {decks} from "../js/data/decks.js";
import {executeCpuDecision,decisionOwner} from "../js/ai/WrestlingAI.js";
const ids=["rhea-ripley","liv-morgan","becky-lynch","bayley","charlotte-flair","iyo-sky","paige","stephanie-vaquer"];
const S=id=>Object.values(superstars).find(s=>s.id===id);
const rng=s=>{let x=s>>>0;return()=>((x=(1664525*x+1013904223)>>>0)/4294967296)};
const st=Object.fromEntries(ids.map(id=>[id,{m:0,w:0,turns:0,fin:0,subs:0}]));
let total={m:0,draws:0,stalls:0,turns:0,pins:0,subs:0};
for(let rep=0;rep<30;rep++)for(const aId of ids)for(const bId of ids){
 const g=new MatchEngine({superstarA:S(aId),superstarB:S(bId),deckA:decks[aId],deckB:decks[bId],startingControl:rep%2?"p2":"p1",rng:rng(900000+rep*10000+ids.indexOf(aId)*100+ids.indexOf(bId))});
 let k=0;while(g.state().phase!=="MATCH_OVER"&&k++<900){const o=decisionOwner(g.state());if(!o)break;executeCpuDecision(g,o);}
 total.m++;st[aId].m++;st[bId].m++;
 const x=g.state();if(x.phase!=="MATCH_OVER"){total.stalls++;continue}
 total.turns+=x.turnNumber;st[aId].turns+=x.turnNumber;st[bId].turns+=x.turnNumber;
 if(x.winner==="p1")st[aId].w++;else if(x.winner==="p2")st[bId].w++;else total.draws++;
 if(x.finish?.type==="pin")total.pins++;if(x.finish?.type==="submission")total.subs++;
}
console.log(JSON.stringify({total,st,names:Object.fromEntries(ids.map(id=>[id,S(id).name]))}));
