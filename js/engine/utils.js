// Rebuilt WWE Legacy gameplay core from the approved Dev audits.
export const METHODS = ["strength","strike","technical","agility"];
export const emptyMomentum = () => ({strength:0,strike:0,technical:0,agility:0,attitude:0});
export function totalMomentum(p){ return METHODS.reduce((n,m)=>n+(p?.momentum?.[m]??0),0); }
export function cloneCard(c){ return c ? structuredClone(c) : c; }
export function drawPages(player,n=1){ const out=[]; while(n-->0 && player.deck.length){ const c=player.deck.shift(); player.hand.push(c); out.push(c.id); } return out; }
export function shuffle(a,rng=Math.random){ const x=[...a]; for(let i=x.length-1;i>0;i--){const j=Math.floor(rng()*(i+1)); [x[i],x[j]]=[x[j],x[i]];} return x; }
