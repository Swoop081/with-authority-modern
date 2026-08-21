import { allGameplayCards } from "./content.js?v=0.13.90"; export const attitudeEraCards=Object.fromEntries(allGameplayCards.filter(c=>c.setId==="attitude-era-series-1").map(c=>[c.id,c]));
