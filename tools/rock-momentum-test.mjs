
import {MatchEngine} from "../js/engine/MatchEngine.js";
import {superstars} from "../js/data/superstars.js";
import {decks} from "../js/data/decks.js";
import {rockCards as R} from "../js/data/season1-rock-cards.js";
import {executeCpuDecision,decisionOwner} from "../js/ai/WrestlingAI.js";
const all=["cody-rhodes","cm-punk","roman-reigns","seth-rollins","oba-femi","brock-lesnar","kevin-owens","gunther","hulk-hogan","andre-the-giant","randy-savage","ultimate-warrior","stone-cold-steve-austin","the-undertaker","mankind","kane","rhea-ripley","liv-morgan","becky-lynch","bayley","charlotte-flair","iyo-sky","paige","stephanie-vaquer"];
const S=id=>Object.values(superstars).find(s=>s.id===id),rng=s=>{let x=s>>>0;return()=>((x=(1664525*x+1013904223)>>>0)/4294967296)};
for(const mode of ["base","swap1","swap2"]){
 let rd=[...decks["the-rock"]];
 let swaps=mode==="swap1"?1:mode==="swap2"?2:0;
 for(let i=5;i<rd.length&&swaps;i++)if(rd[i].id==="s1rock-momentum-strength"){rd[i]=R.momentum.strike;swaps--;}
 let w=0,m=0;
 for(let r=0;r<20;r++)for(const o of all)for(const flip of [0,1]){
  const a=flip?S(o):S("the-rock"),b=flip?S("the-rock"):S(o),da=flip?decks[o]:rd,db=flip?rd:decks[o];
  const g=new MatchEngine({superstarA:a,superstarB:b,deckA:da,deckB:db,startingControl:r%2?"p2":"p1",rng:rng(2200000+r*1000+all.indexOf(o)*2+flip+(mode==="swap1"?100000:mode==="swap2"?200000:0))});
  let k=0;while(g.state().phase!=="MATCH_OVER"&&k++<900){const p=decisionOwner(g.state());if(!p)break;executeCpuDecision(g,p);}
  const x=g.state();m++;if((x.winner==="p1"&&a.id==="the-rock")||(x.winner==="p2"&&b.id==="the-rock"))w++;
 }
 console.log(mode,w/m);
}
