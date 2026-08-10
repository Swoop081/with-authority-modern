
import {MatchEngine} from "../js/engine/MatchEngine.js";
import {superstars} from "../js/data/superstars.js";
import {decks} from "../js/data/decks.js";
import {executeCpuDecision,decisionOwner} from "../js/ai/WrestlingAI.js";
const subject=process.argv[2];
const all=["cody-rhodes","cm-punk","roman-reigns","seth-rollins","oba-femi","brock-lesnar","kevin-owens","gunther","hulk-hogan","andre-the-giant","randy-savage","ultimate-warrior","stone-cold-steve-austin","the-undertaker","mankind","kane","rhea-ripley","liv-morgan","becky-lynch","bayley","charlotte-flair","iyo-sky","paige","stephanie-vaquer","the-rock"].filter(x=>x!==subject);
const S=id=>Object.values(superstars).find(s=>s.id===id),rng=s=>{let x=s>>>0;return()=>((x=(1664525*x+1013904223)>>>0)/4294967296)};
let res={p1:{m:0,w:0},p2:{m:0,w:0}};
for(let rep=0;rep<16;rep++)for(let j=0;j<all.length;j++)for(const flip of [0,1]){
 const oid=all[j], aid=flip?oid:subject, bid=flip?subject:oid;
 const g=new MatchEngine({superstarA:S(aid),superstarB:S(bid),deckA:decks[aid],deckB:decks[bid],startingControl:rep%2?"p2":"p1",rng:rng(8130000+rep*10000+j*10+flip)});
 let k=0;while(g.state().phase!=="MATCH_OVER"&&k++<900){const o=decisionOwner(g.state());if(!o)break;executeCpuDecision(g,o);}
 const x=g.state(),q=flip?"p2":"p1";res[q].m++;if((q==="p1"&&x.winner==="p1")||(q==="p2"&&x.winner==="p2"))res[q].w++;
}
console.log(JSON.stringify(res));
