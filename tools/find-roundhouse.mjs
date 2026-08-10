
import { collectionCards } from "../js/data/collection.js";
console.log(collectionCards.filter(c=>c.kind==="move" && c.name.toLowerCase().includes("roundhouse")).map(c=>({id:c.id,name:c.name,set:c.setId,superstarId:c.superstarId,cost:c.cost,requirements:c.requirements,counters:c.counters,moveType:c.moveType})));
