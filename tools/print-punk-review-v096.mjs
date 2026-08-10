
import { decks } from "../js/data/decks.js";
import { superstars } from "../js/data/superstars.js";
import { entranceForSuperstar } from "../js/data/entrances.js";
const deck=decks["cm-punk"];
const unique=[];
const seen=new Set();
for(const c of deck){if(!seen.has(c.id)){seen.add(c.id);unique.push({
 id:c.id,name:c.name,kind:c.kind,cost:c.cost??null,damage:c.damage??null,method:c.method??null,
 requirements:c.requirements??{},moveType:c.moveType??null,counters:c.counters??[],
 finisher:!!c.finisher,trademark:!!c.trademark,superstarId:c.superstarId??null,
 defensiveOnly:!!c.defensiveOnly,submission:c.submission??null,onConnect:c.onConnect??[],
 abilityText:c.abilityText??null,requiresPosture:c.requiresPosture??null,stunTurns:c.stunTurns??0,
 count:deck.filter(x=>x.id===c.id).length
});}}
console.log(JSON.stringify({star:superstars.cmPunk,entrance:entranceForSuperstar("cm-punk"),unique},null,2));
