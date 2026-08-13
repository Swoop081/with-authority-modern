import { allGameplayCards } from "./content.js"; export const entrances=Object.fromEntries(allGameplayCards.filter(c=>c.kind==="entrance").map(c=>[c.id,c]));
