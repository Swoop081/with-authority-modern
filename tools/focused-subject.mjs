
import {MatchEngine} from "../js/engine/MatchEngine.js";
import {superstars} from "../js/data/superstars.js";
import {decks} from "../js/data/decks.js";
import {executeCpuDecision,decisionOwner} from "../js/ai/WrestlingAI.js";
const subject=process.argv[2];
const all=["cody-rhodes","cm-punk","roman-reigns","seth-rollins","oba-femi","brock-lesnar","kevin-owens","gunther",
"hulk-hogan","andre-the-giant","randy-savage","ultimate-warrior","stone-cold-steve-austin","the-undertaker","mankind","kane",
"rhea-ripley","liv-morgan","becky-lynch","bayley","charlotte-flair","iyo-sky","paige","stephanie-vaquer","the-rock"];
const opps=all.filter(x=>x!==subject);
const S=id=>Object.values(superstars).find(s=>s.id===id);
const rng=s=>{let x=s>>>0;return()=>((x=(1664525*x+1013904223)>>>0)/4294967296)};
let m=0,w=0,stalls=0,turns=0;
for(let rep=0;rep<16;rep++)for(let j=0;j<opps.length;j++)for(const flip of [0,1]){
 const oid=opps[j], aid=flip?oid:subject, bid=flip?subject:oid;
 const g=new MatchEngine({superstarA:S(aid),superstarB:S(bid),deckA:decks[aid],deckB:decks[bid],startingControl:rep%2?"p2":"p1",rng:rng(7100000+rep*10000+j*10+flip)});
 let k=0;while(g.state().phase!=="MATCH_OVER"&&k++<900){const o=decisionOwner(g.state());if(!o)break;executeCpuDecision(g,o);}
 m++; const x=g.state(); if(x.phase!=="MATCH_OVER"){stalls++;continue;} turns+=x.turnNumber;
 if((x.winner==="p1"&&aid===subject)||(x.winner==="p2"&&bid===subject))w++;
}
console.log(JSON.stringify({subject,m,w,rate:100*w/m,stalls,avgTurns:turns/(m-stalls)}));
