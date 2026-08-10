
import {MatchEngine} from "../js/engine/MatchEngine.js";
import {superstars} from "../js/data/superstars.js";
import {decks} from "../js/data/decks.js";
import {executeCpuDecision,decisionOwner} from "../js/ai/WrestlingAI.js";
const all=["cody-rhodes","cm-punk","roman-reigns","seth-rollins","oba-femi","brock-lesnar","kevin-owens","gunther","hulk-hogan","andre-the-giant","randy-savage","ultimate-warrior","stone-cold-steve-austin","the-undertaker","mankind","kane","rhea-ripley","liv-morgan","becky-lynch","bayley","charlotte-flair","iyo-sky","paige","stephanie-vaquer"];
const base=Object.values(superstars).find(s=>s.id==="the-rock"), S=id=>Object.values(superstars).find(s=>s.id===id);
const rng=s=>{let x=s>>>0;return()=>((x=(1664525*x+1013904223)>>>0)/4294967296)};
for(const hp of [64,68,72,76,80]){
 let m=0,w=0;
 const rock={...base,hp};
 for(let rep=0;rep<8;rep++)for(const oid of all)for(const flip of [0,1]){
  const a=flip?S(oid):rock,b=flip?rock:S(oid),aid=flip?oid:"the-rock",bid=flip?"the-rock":oid;
  const g=new MatchEngine({superstarA:a,superstarB:b,deckA:decks[aid],deckB:decks[bid],startingControl:rep%2?"p2":"p1",rng:rng(990000+hp*10000+rep*1000+all.indexOf(oid)*2+flip)});
  let k=0;while(g.state().phase!=="MATCH_OVER"&&k++<900){const o=decisionOwner(g.state());if(!o)break;executeCpuDecision(g,o);}
  m++;const x=g.state();if((x.winner==="p1"&&aid==="the-rock")||(x.winner==="p2"&&bid==="the-rock"))w++;
 }
 console.log(hp,(100*w/m).toFixed(1));
}
