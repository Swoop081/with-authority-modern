import { allGameplayCards } from "./content.js?v=0.13.23"; export const entrances=Object.fromEntries(allGameplayCards.filter(c=>c.kind==="entrance").map(c=>[c.id,c]));
