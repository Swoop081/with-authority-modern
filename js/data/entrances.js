import { cards } from "./cards.js?v=0.11.37";
import { hallCards } from "./hall-of-fame-cards.js?v=0.11.37";
import { evolutionCards } from "./evolution-cards.js?v=0.11.37";
import { rockCards } from "./season1-rock-cards.js?v=0.11.37";

function flatten(source) {
  const out = [];
  for (const value of Object.values(source)) {
    if (value?.id) out.push(value);
    else if (value && typeof value === "object") {
      for (const nested of Object.values(value)) if (nested?.id) out.push(nested);
    }
  }
  return out;
}

const all = [...flatten(cards), ...flatten(hallCards), ...flatten(evolutionCards), ...flatten(rockCards)];
const bySuperstar = new Map(all.filter(card => card.kind === "entrance" && card.superstarId).map(card => [card.superstarId, card]));

export function entranceForSuperstar(superstarId) {
  return bySuperstar.get(superstarId) ?? null;
}
