const ROOT = "assets/art/summerslam-series-1";

export const superstarArtwork = {
  "cody-rhodes": `${ROOT}/superstars/cody-rhodes.webp`,
  "cm-punk": `${ROOT}/superstars/cm-punk.webp`,
  "roman-reigns": `${ROOT}/superstars/roman-reigns.webp`,
  "seth-rollins": `${ROOT}/superstars/seth-rollins.webp`,
  "oba-femi": `${ROOT}/superstars/oba-femi.webp`,
  "brock-lesnar": `${ROOT}/superstars/brock-lesnar.webp`,
  "kevin-owens": `${ROOT}/superstars/kevin-owens.webp`,
  "gunther": `${ROOT}/superstars/gunther.webp`
};

// Filled progressively as real match photography is sourced.
export const cardArtwork = {};

export function artworkFor(card) {
  if (!card) return null;
  if (card.kind === "superstar") return superstarArtwork[card.superstarId] ?? null;
  return cardArtwork[card.id] ?? null;
}

export function artworkRequirement(card) {
  if (card.kind === "superstar") return "unique-superstar-photo";
  if (card.kind === "entrance") return "unique-entrance-photo";
  if (card.kind === "momentum") return "graphic-momentum-art";
  if (card.superstarId && card.kind === "move") return "unique-move-photo";
  return "generic-wwe-concept-photo";
}
