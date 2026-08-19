import { allGameplayCards } from "./content.js?v=0.13.46"; export const hallOfFameCards=Object.fromEntries(allGameplayCards.filter(c=>c.setId==="hall-of-fame-series-1").map(c=>[c.id,c]));
