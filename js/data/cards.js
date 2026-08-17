import { allGameplayCards } from "./content.js?v=0.12.71"; export const cards=Object.fromEntries(allGameplayCards.filter(c=>c.setId==="summerslam-series-1").map(c=>[c.id,c]));
