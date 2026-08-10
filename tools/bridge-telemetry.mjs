
import {MatchEngine} from "../js/engine/MatchEngine.js";
import {superstars} from "../js/data/superstars.js";
import {decks} from "../js/data/decks.js";
import {executeCpuDecision,decisionOwner} from "../js/ai/WrestlingAI.js";
const focus=["rhea-ripley","charlotte-flair","iyo-sky","paige","stephanie-vaquer","the-rock"];
const all=["cody-rhodes","cm-punk","roman-reigns","seth-rollins","oba-femi","brock-lesnar","kevin-owens","gunther","hulk-hogan","andre-the-giant","randy-savage","ultimate-warrior","stone-cold-steve-austin","the-undertaker","mankind","kane","rhea-ripley","liv-morgan","becky-lynch","bayley","charlotte-flair","iyo-sky","paige","stephanie-vaquer","the-rock"];
const S=id=>Object.values(superstars).find(s=>s.id===id),rng=s=>{let x=s>>>0;return()=>((x=(1664525*x+1013904223)>>>0)/4294967296)};
const T=Object.fromEntries(focus.map(id=>[id,{m:0,w:0,decl:{},conn:{},search:0,mods:0}]));
for(let rep=0;rep<8;rep++)for(const f of focus)for(const o of all){
 const g=new MatchEngine({superstarA:S(f),superstarB:S(o),deckA:decks[f],deckB:decks[o],rng:rng(1510000+rep*10000+focus.indexOf(f)*100+all.indexOf(o))});let li=0,k=0;
 while(g.state().phase!=="MATCH_OVER"&&k++<900){const owner=decisionOwner(g.state());if(!owner)break;executeCpuDecision(g,owner);for(const ev of g.state().log.slice(li)){
   if(ev.attackerId==="p1"&&ev.type==="MOVE_DECLARED")T[f].decl[ev.cardId]=(T[f].decl[ev.cardId]??0)+1;
   if(ev.attackerId==="p1"&&ev.type==="MOVE_CONNECTED")T[f].conn[ev.cardId]=(T[f].conn[ev.cardId]??0)+1;
   if(ev.playerId==="p1"&&ev.type==="CARD_SEARCHED")T[f].search++;
 }li=g.state().log.length;}
 T[f].m++;const x=g.state();if(x.winner==="p1")T[f].w++;
}
console.log(JSON.stringify(T));
