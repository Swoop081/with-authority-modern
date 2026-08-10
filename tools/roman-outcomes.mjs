
import {MatchEngine} from "../js/engine/MatchEngine.js";
import {superstars} from "../js/data/superstars.js";
import {decks} from "../js/data/decks.js";
import {executeCpuDecision,decisionOwner} from "../js/ai/WrestlingAI.js";
const f="roman-reigns", all=["cody-rhodes","cm-punk","seth-rollins","oba-femi","brock-lesnar","kevin-owens","gunther","hulk-hogan","andre-the-giant","randy-savage","ultimate-warrior","stone-cold-steve-austin","the-undertaker","mankind","kane","rhea-ripley","liv-morgan","becky-lynch","bayley","charlotte-flair","iyo-sky","paige","stephanie-vaquer","the-rock"];
const S=id=>Object.values(superstars).find(s=>s.id===id),rng=s=>{let x=s>>>0;return()=>((x=(1664525*x+1013904223)>>>0)/4294967296)};
let m=0,w=0,pins=0,subs=0,attempts=0,spearConn=0,spConn=0,guiConn=0;
for(let r=0;r<12;r++)for(const o of all){
 const g=new MatchEngine({superstarA:S(f),superstarB:S(o),deckA:decks[f],deckB:decks[o],rng:rng(991000+r*1000+all.indexOf(o))});let li=0,k=0;
 while(g.state().phase!=="MATCH_OVER"&&k++<900){const owner=decisionOwner(g.state());if(!owner)break;executeCpuDecision(g,owner);for(const e of g.state().log.slice(li)){
  if(e.playerId==="p1"&&e.type==="PIN_ATTEMPTED")attempts++;
  if(e.attackerId==="p1"&&e.type==="MOVE_CONNECTED"){if(e.cardId==="spear")spearConn++;if(e.cardId==="superman-punch")spConn++;if(e.cardId==="guillotine")guiConn++;}
 }li=g.state().log.length;}
 m++;const x=g.state();if(x.winner==="p1"){w++;if(x.finish?.type==="pin")pins++;if(x.finish?.type==="submission")subs++;}}
console.log({m,w,rate:100*w/m,pins,subs,attempts,spearConn,spConn,guiConn});
