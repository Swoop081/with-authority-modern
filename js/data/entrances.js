import { allGameplayCards } from "./content.js?v=0.12.71"; export const entrances=Object.fromEntries(allGameplayCards.filter(c=>c.kind==="entrance").map(c=>[c.id,c]));
