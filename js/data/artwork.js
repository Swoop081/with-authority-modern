import { cardArtOverrides, superstarArtOverrides } from "./card-art-overrides.js";

const SUMMERSLAM_ROOT = "assets/art/summerslam-series-1";
const TEMP_SUPERSTAR_ROOT = "assets/cards/art/superstars";
const EVOLUTION_ROOT = "assets/art/evolution-series-1";
const TEMP_GENERIC_ART = "assets/cards/art/temp/generic-wrestling-action.webp";

// Superstar art is deliberately centralized. Replacing a portrait later only
// requires changing one path here (or using superstarArtOverrides below).
export const superstarArtwork = {
  "cody-rhodes": `${SUMMERSLAM_ROOT}/superstars/cody-rhodes.webp`,
  "cm-punk": `${SUMMERSLAM_ROOT}/superstars/cm-punk.webp`,
  "roman-reigns": `${SUMMERSLAM_ROOT}/superstars/roman-reigns.webp`,
  "seth-rollins": `${SUMMERSLAM_ROOT}/superstars/seth-rollins.webp`,
  "oba-femi": `${SUMMERSLAM_ROOT}/superstars/oba-femi.webp`,
  "brock-lesnar": `${SUMMERSLAM_ROOT}/superstars/brock-lesnar.webp`,
  "kevin-owens": `${SUMMERSLAM_ROOT}/superstars/kevin-owens.webp`,
  "gunther": `${SUMMERSLAM_ROOT}/superstars/gunther.webp`,

  // Temporary Hall of Fame photos. These are intentionally easy to replace
  // when final era/move-specific art is sourced.
  "hulk-hogan": `${TEMP_SUPERSTAR_ROOT}/hulk-hogan.webp`,
  "andre-the-giant": `${TEMP_SUPERSTAR_ROOT}/andre-the-giant.webp`,
  "randy-savage": `${TEMP_SUPERSTAR_ROOT}/randy-savage.webp`,
  "ultimate-warrior": `${TEMP_SUPERSTAR_ROOT}/ultimate-warrior.webp`,
  "stone-cold-steve-austin": `${TEMP_SUPERSTAR_ROOT}/stone-cold-steve-austin.webp`,
  "the-undertaker": `${TEMP_SUPERSTAR_ROOT}/the-undertaker.webp`,
  "mankind": `${TEMP_SUPERSTAR_ROOT}/mankind.webp`,
  "kane": `${TEMP_SUPERSTAR_ROOT}/kane.webp`,

  // Evolution — Series 1 temporary sourced portraits.
  "rhea-ripley": `${EVOLUTION_ROOT}/superstars/rhea-ripley.webp`,
  "liv-morgan": `${EVOLUTION_ROOT}/superstars/liv-morgan.webp`,
  "becky-lynch": `${EVOLUTION_ROOT}/superstars/becky-lynch.webp`,
  "bayley": `${EVOLUTION_ROOT}/superstars/bayley.webp`,
  "charlotte-flair": `${EVOLUTION_ROOT}/superstars/charlotte-flair.webp`,
  "iyo-sky": `${EVOLUTION_ROOT}/superstars/iyo-sky.webp`,
  "paige": `${EVOLUTION_ROOT}/superstars/paige.webp`,
  "stephanie-vaquer": `${EVOLUTION_ROOT}/superstars/stephanie-vaquer.webp`,
  ...superstarArtOverrides
};

// Exact card-photo replacements always win. This is the long-term migration
// path from temporary fallback art to a unique photo for every individual card.
export const cardArtwork = cardArtOverrides;

export function artworkFor(card) {
  if (!card) return null;

  // 1. Exact card photo supplied by the user / final sourcing pass.
  if (cardArtwork[card.id]) return cardArtwork[card.id];

  // 2. Superstar card, or any wrestler-specific card awaiting its own action
  //    shot, uses that wrestler's local portrait as temporary art.
  if (card.superstarId && superstarArtwork[card.superstarId]) {
    return superstarArtwork[card.superstarId];
  }

  // 3. Every remaining collectible receives a local wrestling-action image so
  //    there are no blank ARTWORK SLOT cards in the playable build.
  return TEMP_GENERIC_ART;
}

export function artworkRequirement(card) {
  if (card.kind === "superstar") return "unique-superstar-photo";
  if (card.kind === "entrance") return "unique-entrance-photo";
  if (card.kind === "momentum") return "graphic-momentum-art";
  if (card.superstarId && card.kind === "move") return "unique-move-photo";
  return "generic-wwe-concept-photo";
}

export function isTemporaryArtwork(card) {
  if (!card) return true;
  if (cardArtwork[card.id]) return false;
  // The eight existing SummerSlam Superstar portraits are treated as sourced
  // base assets; all inherited move/entrance uses remain temporary until an
  // exact card override is supplied.
  return card.kind !== "superstar" || card.setId !== "summerslam-series-1";
}
