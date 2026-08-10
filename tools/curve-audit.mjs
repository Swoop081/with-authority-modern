
import {decks} from "../js/data/decks.js";
import {superstars} from "../js/data/superstars.js";
const ids=["cody-rhodes","cm-punk","roman-reigns","seth-rollins","oba-femi","brock-lesnar","kevin-owens","gunther"];
for(const id of ids){
 const d=decks[id], moves=d.filter(c=>c.kind==="move"&&!c.defensiveOnly);
 const bins={low:0,mid:0,high:0,finisher:0,submission:0};
 const req={};
 for(const c of moves){
   if(c.finisher)bins.finisher++;
   else if(c.submission)bins.submission++;
   else if((c.cost??0)<=3)bins.low++;
   else if((c.cost??0)<=5)bins.mid++;
   else bins.high++;
   for(const [m,n] of Object.entries(c.requirements??{})) if(n>0) req[m]=(req[m]??0)+1;
 }
 const moms={};for(const c of d.filter(c=>c.kind==="momentum"))moms[c.method]=(moms[c.method]??0)+1;
 console.log(id,JSON.stringify({bins,req,moms}));
}
