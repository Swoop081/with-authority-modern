
import {cards} from "../js/data/cards.js";
import {hallCards as H} from "../js/data/hall-of-fame-cards.js";
import {evolutionCards as E} from "../js/data/evolution-cards.js";
import {rockCards as R} from "../js/data/season1-rock-cards.js";
import {decks} from "../js/data/decks.js";
function flat(o){const a=[];for(const v of Object.values(o)){if(v?.id)a.push(v);else if(v&&typeof v==="object")for(const n of Object.values(v))if(n?.id)a.push(n);}return a;}
const fields=["kind","name","method","cost","damage","setOpponentPosture","requiresPosture","requiresLocation","moveType","defensiveOnly","trademark","finisher","counterAny","stunTurns","selfDamage"];
const stable=x=>Array.isArray(x)?x.map(stable):(x&&typeof x==="object"?Object.fromEntries(Object.keys(x).sort().map(k=>[k,stable(x[k])])):x??null);
function sig(c){const o={};for(const f of fields)o[f]=stable(c[f]);for(const f of ["requirements","onConnect","onCounter","effects","submission","counterMethods","counters"])o[f]=stable(c[f]??(f==="submission"?null:[]));return JSON.stringify(o);}
const prior=[];for(const [set,obj] of [["SummerSlam",cards],["Hall",H],["Evolution",E]])for(const c of flat(obj))prior.push({set,c,sig:sig(c)});
const used=new Set(decks["the-rock"].map(c=>c.id));
for(const c of flat(R).filter(c=>used.has(c.id))){
 const hit=prior.find(p=>p.sig===sig(c));
 if(hit) console.log(JSON.stringify({from:c.id,name:c.name,to:hit.c.id,priorSet:hit.set}));
}
