
import {decks} from "../js/data/decks.js";
const ids=["cody-rhodes","cm-punk","roman-reigns","seth-rollins","oba-femi","brock-lesnar","kevin-owens","gunther"];
for(const id of ids){
 const d=decks[id], counts={};
 for(const c of d) counts[c.id]=(counts[c.id]??0)+1;
 const over=Object.entries(counts).filter(([k,v])=>v>5);
 console.log(id,d.length,JSON.stringify(over));
}
