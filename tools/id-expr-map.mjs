
import {cards} from "../js/data/cards.js";
import {hallCards as H} from "../js/data/hall-of-fame-cards.js";
import {evolutionCards as E} from "../js/data/evolution-cards.js";
function pairs(o,prefix){
 for(const [k,v] of Object.entries(o)){
   if(v?.id) console.log(JSON.stringify({id:v.id,expr:`${prefix}.${k}`}));
   else if(v&&typeof v==="object") for(const [nk,n] of Object.entries(v)) if(n?.id) console.log(JSON.stringify({id:n.id,expr:`${prefix}.${k}.${nk}`}));
 }
}
pairs(cards,"cards");pairs(H,"hallCards");pairs(E,"evolutionCards");
