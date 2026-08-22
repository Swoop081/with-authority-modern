import { allGameplayCards } from "./content.js?v=0.14.00"; export const goldenEraCards=Object.fromEntries(allGameplayCards.filter(c=>c.setId==="golden-era-series-1").map(c=>[c.id,c]));
