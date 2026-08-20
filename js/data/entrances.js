import { allGameplayCards } from "./content.js?v=0.13.81"; export const entrances=Object.fromEntries(allGameplayCards.filter(c=>c.kind==="entrance").map(c=>[c.id,c]));
