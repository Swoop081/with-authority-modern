
import { decks } from "../js/data/decks.js";
import { superstars } from "../js/data/superstars.js";
import { entranceForSuperstar } from "../js/data/entrances.js";
const d=decks["cm-punk"];
console.log("len",d.length);
console.log("ability",superstars.cmPunk.ability);
console.log("entrance",entranceForSuperstar("cm-punk"));
const ids={};
for(const c of d) ids[c.id]=(ids[c.id]??0)+1;
for(const [id,n] of Object.entries(ids)) {
 const c=d.find(x=>x.id===id);
 if(["chain-wrestling","duck-strike","punk-best-in-the-world","reversal","scramble","shoulder-up"].includes(id))
   console.log(n,id,c.name,c.cost,c.requirements,c.counterMethods,c.counters,c.superstarId,c.abilityText);
}
