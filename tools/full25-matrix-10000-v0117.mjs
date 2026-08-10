
import {MatchEngine} from "../js/engine/MatchEngine.js";
import {superstars} from "../js/data/superstars.js";
import {decks} from "../js/data/decks.js";
import {executeCpuDecision,decisionOwner} from "../js/ai/WrestlingAI.js";

const summer=["cody-rhodes","cm-punk","roman-reigns","seth-rollins","oba-femi","brock-lesnar","kevin-owens","gunther"];
const hall=["hulk-hogan","andre-the-giant","randy-savage","ultimate-warrior","stone-cold-steve-austin","the-undertaker","mankind","kane"];
const evo=["rhea-ripley","liv-morgan","becky-lynch","bayley","charlotte-flair","iyo-sky","paige","stephanie-vaquer"];
const reward=["the-rock"];
const ids=[...summer,...hall,...evo,...reward];
const S=id=>Object.values(superstars).find(s=>s.id===id);
const set=id=>summer.includes(id)?"SummerSlam":hall.includes(id)?"Hall of Fame":evo.includes(id)?"Evolution":"Rewards";
const rng=s=>{let x=s>>>0;return()=>((x=(1664525*x+1013904223)>>>0)/4294967296)};
const st=Object.fromEntries(ids.map(id=>[id,{m:0,w:0,by:{},turns:0}]));
const pair={};let total={m:0,draws:0,stalls:0,turns:0,pins:0,subs:0};
for(let rep=0;rep<16;rep++)for(let i=0;i<ids.length;i++)for(let j=0;j<ids.length;j++){
 const aId=ids[i],bId=ids[j],g=new MatchEngine({superstarA:S(aId),superstarB:S(bId),deckA:decks[aId],deckB:decks[bId],startingControl:rep%2?"p2":"p1",rng:rng(3300000+rep*100000+i*1000+j)});
 let k=0;while(g.state().phase!=="MATCH_OVER"&&k++<900){const o=decisionOwner(g.state());if(!o)break;executeCpuDecision(g,o);}
 total.m++;st[aId].m++;st[bId].m++;
 for(const [id,opp] of [[aId,bId],[bId,aId]]){const q=set(opp);st[id].by[q]??={m:0,w:0};st[id].by[q].m++;}
 const x=g.state();if(x.phase!=="MATCH_OVER"){total.stalls++;continue}
 total.turns+=x.turnNumber;st[aId].turns+=x.turnNumber;st[bId].turns+=x.turnNumber;
 if(x.winner==="p1"){st[aId].w++;st[aId].by[set(bId)].w++;}
 else if(x.winner==="p2"){st[bId].w++;st[bId].by[set(aId)].w++;}
 else total.draws++;
 if(x.finish?.type==="pin")total.pins++;if(x.finish?.type==="submission")total.subs++;
 const key=[aId,bId].sort().join("|");pair[key]??={m:0,wins:{}};pair[key].m++;if(x.winner){const w=x.winner==="p1"?aId:bId;pair[key].wins[w]=(pair[key].wins[w]??0)+1;}
}
console.log(JSON.stringify({total,st,pair,names:Object.fromEntries(ids.map(id=>[id,S(id).name])),sets:{summer,hall,evo,reward}}));
