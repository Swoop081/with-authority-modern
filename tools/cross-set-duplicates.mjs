
import { cards } from "../js/data/cards.js";
import { hallCards } from "../js/data/hall-of-fame-cards.js";
import { evolutionCards } from "../js/data/evolution-cards.js";
import { decks } from "../js/data/decks.js";
import { superstars } from "../js/data/superstars.js";

function flatten(obj){const o=[];for(const v of Object.values(obj)){if(v?.id)o.push(v);else if(v&&typeof v==="object")for(const n of Object.values(v))if(n?.id)o.push(n);}return o;}
const src={"SummerSlam":flatten(cards),"Hall of Fame":flatten(hallCards),"Evolution":flatten(evolutionCards)};
const roster={
 "SummerSlam":["cody-rhodes","cm-punk","roman-reigns","seth-rollins","oba-femi","brock-lesnar","kevin-owens","gunther"],
 "Hall of Fame":["hulk-hogan","andre-the-giant","randy-savage","ultimate-warrior","stone-cold-steve-austin","the-undertaker","mankind","kane"],
 "Evolution":["rhea-ripley","liv-morgan","becky-lynch","bayley","charlotte-flair","iyo-sky","paige","stephanie-vaquer"]
};
const starBy=Object.fromEntries(Object.values(superstars).map(s=>[s.id,s]));
const norm=x=>(x??"").toLowerCase().replace(/[’']/g,"'").replace(/[^a-z0-9]+/g," ").trim();
function sig(c){return JSON.stringify({kind:c.kind,method:c.method??null,cost:c.cost??null,req:c.requirements??{},damage:c.damage??null,post:c.setOpponentPosture??null,rpost:c.requiresPosture??null,loc:c.requiresLocation??null,sub:c.submission??null,tm:!!c.trademark,fin:!!c.finisher,def:!!c.defensiveOnly,counter:c.counterMethods??[],on:c.onConnect??null,effects:c.effects??null});}
const used={};
for(const [set,ids] of Object.entries(roster)){
 const u=new Set();
 for(const id of ids){for(const c of decks[id])u.add(c.id);if(starBy[id]?.entranceId)u.add(starBy[id].entranceId);}
 used[set]=src[set].filter(c=>u.has(c.id));
}
const byName={};
for(const [set,list] of Object.entries(used))for(const c of list){const k=norm(c.name);(byName[k]??=[]).push({set,c});}
for(const [name,arr] of Object.entries(byName)){
 const sets=[...new Set(arr.map(x=>x.set))];
 if(sets.length<2)continue;
 const exact=new Set(arr.map(x=>sig(x.c))).size===1;
 console.log(JSON.stringify({name,exact,items:arr.map(x=>({set:x.set,id:x.c.id,name:x.c.name,kind:x.c.kind,method:x.c.method,cost:x.c.cost,damage:x.c.damage,requirements:x.c.requirements}))}));
}
