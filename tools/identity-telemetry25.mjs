
import {MatchEngine} from "../js/engine/MatchEngine.js";
import {superstars} from "../js/data/superstars.js";
import {decks} from "../js/data/decks.js";
import {executeCpuDecision,decisionOwner} from "../js/ai/WrestlingAI.js";
const focus=["the-rock","stone-cold-steve-austin","rhea-ripley","cody-rhodes"];
const opps=["cody-rhodes","cm-punk","roman-reigns","seth-rollins","oba-femi","brock-lesnar","kevin-owens","gunther","hulk-hogan","andre-the-giant","randy-savage","ultimate-warrior","stone-cold-steve-austin","the-undertaker","mankind","kane","rhea-ripley","liv-morgan","becky-lynch","bayley","charlotte-flair","iyo-sky","paige","stephanie-vaquer"];
const S=id=>Object.values(superstars).find(s=>s.id===id),rng=s=>{let x=s>>>0;return()=>((x=(1664525*x+1013904223)>>>0)/4294967296)};
const O=Object.fromEntries(focus.map(id=>[id,{m:0,w:0,moves:0,conn:0,dmg:0,counters:0,pins:0,turns:0}]));
for(let r=0;r<10;r++)for(const f of focus)for(const o of opps){
 const g=new MatchEngine({superstarA:S(f),superstarB:S(o),deckA:decks[f],deckB:decks[o],rng:rng(550000+r*10000+focus.indexOf(f)*100+opps.indexOf(o))});let li=0,k=0;
 while(g.state().phase!=="MATCH_OVER"&&k++<900){const p=decisionOwner(g.state());if(!p)break;executeCpuDecision(g,p);for(const e of g.state().log.slice(li)){if(e.playerId==="p1"&&e.type==="MOVE_DECLARED")O[f].moves++;if(e.attackerId==="p1"&&e.type==="MOVE_CONNECTED"){O[f].conn++;O[f].dmg+=e.damage??0;}if(e.defenderId==="p1"&&e.type==="MOVE_COUNTERED")O[f].counters++;if(e.attackerId==="p1"&&e.type==="PIN_ATTEMPTED")O[f].pins++;}li=g.state().log.length;}
 const x=g.state();O[f].m++;O[f].turns+=x.turnNumber;if(x.winner==="p1")O[f].w++;
}
console.log(JSON.stringify(O));
