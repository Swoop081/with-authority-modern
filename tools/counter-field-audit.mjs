
import { collectionCards } from "../js/data/collection.js";
const moves=collectionCards.filter(c=>c.kind==="move");
const fields=["cost","requirements","requiresPosture","requiresLocation","requiresOpponentLocation","requiresSameLocation","crossLocation","superstarId","playableWhileStunned","defensiveOnly","counters"];
for(const f of fields){
 const vals=moves.filter(c=>c[f]!=null && (Array.isArray(c[f])?c[f].length:true));
 console.log(f, vals.length);
 if(["requiresOpponentLocation","requiresSameLocation"].includes(f)) console.log(vals.map(c=>[c.id,c[f]]));
}
console.log("counter moves",moves.filter(c=>(c.counters??[]).length).length);
