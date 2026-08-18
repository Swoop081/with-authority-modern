// WWE Legacy Layered Card Front registry — v0.13.2
//
// IMPORTANT MIGRATION RULE:
// Existing finished fronts are FLAT by default and must never receive a live
// data overlay. A card only uses the Layered v1 renderer after its clean art
// plate has been installed and its id is explicitly listed below.
//
// This lets the existing art library migrate gradually without ever producing
// doubled names, Cost/Damage figures, requirements or rarity stars.
export const LAYERED_FRONT_IDS = new Set([
  // Example after a clean plate is installed:
  // "gunther-last-symphony",
]);

export function usesLayeredFront(card) {
  return Boolean(card?.id && LAYERED_FRONT_IDS.has(card.id));
}
