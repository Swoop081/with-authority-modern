
import { collectionCards } from "../js/data/collection.js";
const moves=collectionCards.filter(c=>c.kind==="move");
const counters=moves.filter(c=>(c.counters??[]).length);
const offensive=moves.filter(c=>!c.defensiveOnly);
const offensiveCounters=offensive.filter(c=>(c.counters??[]).length);
const restricted=counters.filter(c=>c.superstarId).length;
const location=counters.filter(c=>c.requiresLocation).length;
const posture=counters.filter(c=>c.requiresPosture).length;
const method=counters.filter(c=>Object.values(c.requirements??{}).some(n=>n>0)).length;
const cost=counters.filter(c=>(c.cost??0)>0).length;
console.log(JSON.stringify({moves:moves.length,counters:counters.length,offensive:offensive.length,offensiveCounters:offensiveCounters.length,restricted,location,posture,method,cost},null,2));
