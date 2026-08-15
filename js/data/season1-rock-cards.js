import { allGameplayCards } from "./content.js?v=0.12.45"; export const season1RockCards=Object.fromEntries(allGameplayCards.filter(c=>c.setId==="season-1-final-boss").map(c=>[c.id,c]));
