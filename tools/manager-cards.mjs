
import {hallCards as H} from "../js/data/hall-of-fame-cards.js";
function flat(o){const a=[];for(const v of Object.values(o)){if(v?.id)a.push(v);else if(v&&typeof v==="object")for(const n of Object.values(v))if(n?.id)a.push(n);}return a;}
for(const c of flat(H).filter(c=>c.kind==="manager")) console.log(JSON.stringify(c));
