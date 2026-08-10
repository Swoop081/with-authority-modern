
import {MatchEngine} from "../js/engine/MatchEngine.js";
import {superstars} from "../js/data/superstars.js";
import {decks} from "../js/data/decks.js";
import {executeCpuDecision,decisionOwner} from "../js/ai/WrestlingAI.js";
import {moveEligibility} from "../js/engine/rules.js";
const focus=["iyo-sky","the-rock","liv-morgan"];
const all=["cody-rhodes","cm-punk","roman-reigns","seth-rollins","oba-femi","brock-lesnar","kevin-owens","gunther","hulk-hogan","andre-the-giant","randy-savage","ultimate-warrior","stone-cold-steve-austin","the-undertaker","mankind","kane","rhea-ripley","liv-morgan","becky-lynch","bayley","charlotte-flair","iyo-sky","paige","stephanie-vaquer","the-rock"];
const S=id=>Object.values(superstars).find(s=>s.id===id),rng=s=>{let x=s>>>0;return()=>((x=(1664525*x+1013904223)>>>0)/4294967296)};
const O=Object.fromEntries(focus.map(id=>[id,{off:0,legal:0,reasons:{},search:{},decl:{},conn:{},special:0,ability:0}]));
for(let r=0;r<8;r++)for(const f of focus)for(const o of all){
 const g=new MatchEngine({superstarA:S(f),superstarB:S(o),deckA:decks[f],deckB:decks[o],rng:rng(880000+r*10000+focus.indexOf(f)*100+all.indexOf(o))});let li=0,k=0;
 while(g.state().phase!=="MATCH_OVER"&&k++<900){let x=g.state(),p=decisionOwner(x);if(!p)break;if(x.phase==="ACTION"&&x.playerInControl==="p1"){for(const c of x.players.p1.hand.filter(c=>c.kind==="move"&&!c.defensiveOnly)){O[f].off++;let e=moveEligibility(x,"p1",c);if(e.legal)O[f].legal++;else{let q=c.id+"|"+e.reason;O[f].reasons[q]=(O[f].reasons[q]??0)+1;}}}executeCpuDecision(g,p);for(const e of g.state().log.slice(li)){if(e.attackerId==="p1"&&e.type==="MOVE_DECLARED")O[f].decl[e.cardId]=(O[f].decl[e.cardId]??0)+1;if(e.attackerId==="p1"&&e.type==="MOVE_CONNECTED")O[f].conn[e.cardId]=(O[f].conn[e.cardId]??0)+1;if(e.playerId==="p1"&&e.type==="CARD_SEARCHED")O[f].search[e.sourceCardId+"->"+e.cardId]=(O[f].search[e.sourceCardId+"->"+e.cardId]??0)+1;if(e.playerId==="p1"&&e.type==="SUPERSTAR_SPECIAL_PLAYED")O[f].special++;if(e.playerId==="p1"&&e.type==="SUPERSTAR_ABILITY")O[f].ability++;}li=g.state().log.length;}
}
console.log(JSON.stringify(O));
