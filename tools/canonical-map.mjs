
import {cards} from "../js/data/cards.js";
import {hallCards as H} from "../js/data/hall-of-fame-cards.js";
import {evolutionCards as E} from "../js/data/evolution-cards.js";
import {decks} from "../js/data/decks.js";
import {superstars} from "../js/data/superstars.js";
function flat(o){const a=[];for(const v of Object.values(o)){if(v?.id)a.push(v);else if(v&&typeof v==="object")for(const n of Object.values(v))if(n?.id)a.push(n);}return a;}
const src=[["SummerSlam",flat(cards)],["Hall of Fame",flat(H)],["Evolution",flat(E)]];
const rosters={
"SummerSlam":["cody-rhodes","cm-punk","roman-reigns","seth-rollins","oba-femi","brock-lesnar","kevin-owens","gunther"],
"Hall of Fame":["hulk-hogan","andre-the-giant","randy-savage","ultimate-warrior","stone-cold-steve-austin","the-undertaker","mankind","kane"],
"Evolution":["rhea-ripley","liv-morgan","becky-lynch","bayley","charlotte-flair","iyo-sky","paige","stephanie-vaquer"]};
const star=Object.fromEntries(Object.values(superstars).map(s=>[s.id,s]));
const usedBySet={};
for(const [set,ids] of Object.entries(rosters)){const u=new Set();for(const id of ids){for(const c of decks[id])u.add(c.id);if(star[id]?.entranceId)u.add(star[id].entranceId);}usedBySet[set]=u;}
const fields=["kind","name","method","cost","damage","setOpponentPosture","requiresPosture","requiresLocation","moveType","defensiveOnly","trademark","finisher","counterAny","stunTurns","selfDamage"];
const stable=x=>{
 if(Array.isArray(x)) return x.map(stable);
 if(x&&typeof x==="object") return Object.fromEntries(Object.keys(x).sort().map(k=>[k,stable(x[k])]));
 return x??null;
};
function sig(c){
 const o={};for(const f of fields)o[f]=stable(c[f]);
 o.requirements=stable(c.requirements??{});
 o.onConnect=stable(c.onConnect??[]);
 o.onCounter=stable(c.onCounter??[]);
 o.effects=stable(c.effects??[]);
 o.submission=stable(c.submission??null);
 o.counterMethods=stable(c.counterMethods??[]);
 o.counters=stable(c.counters??[]);
 return JSON.stringify(o);
}
const prior=new Map();
const replacements=[];
for(const [set,list] of src){
 for(const c of list){
  if(!usedBySet[set].has(c.id))continue;
  const s=sig(c);
  if(prior.has(s)){
    const p=prior.get(s);
    if(p.id!==c.id) replacements.push({set,from:c.id,to:p.id,name:c.name,priorSet:p.set});
  } else prior.set(s,{id:c.id,set,name:c.name});
 }
}
for(const x of replacements)console.log(JSON.stringify(x));
