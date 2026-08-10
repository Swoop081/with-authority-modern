import { cardArtOverrides, superstarArtOverrides } from "./card-art-overrides.js";

const SUMMERSLAM_ROOT = "assets/art/summerslam-series-1";
const TEMP_SUPERSTAR_ROOT = "assets/cards/art/superstars";
const WWE_PROFILE_ROOT = "assets/art/wwe-profile-portraits";
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
  "hulk-hogan": `${WWE_PROFILE_ROOT}/hulk-hogan.png`,
  "andre-the-giant": `${WWE_PROFILE_ROOT}/andre-the-giant.png`,
  "randy-savage": `${WWE_PROFILE_ROOT}/randy-savage.png`,
  "ultimate-warrior": `${WWE_PROFILE_ROOT}/ultimate-warrior.png`,
  "stone-cold-steve-austin": `${WWE_PROFILE_ROOT}/stone-cold-steve-austin.png`,
  "the-undertaker": `${WWE_PROFILE_ROOT}/the-undertaker.png`,
  "mankind": `${WWE_PROFILE_ROOT}/mankind.png`,
  "kane": `${WWE_PROFILE_ROOT}/kane.png`,

  // Evolution — Series 1 temporary sourced portraits.
  "rhea-ripley": `${WWE_PROFILE_ROOT}/rhea-ripley.png`,
  "liv-morgan": `${WWE_PROFILE_ROOT}/liv-morgan.png`,
  "becky-lynch": `${WWE_PROFILE_ROOT}/becky-lynch.png`,
  "bayley": `${WWE_PROFILE_ROOT}/bayley.png`,
  "charlotte-flair": `${WWE_PROFILE_ROOT}/charlotte-flair.png`,
  "iyo-sky": `${WWE_PROFILE_ROOT}/iyo-sky.png`,
  "paige": `${WWE_PROFILE_ROOT}/paige.png`,
  "stephanie-vaquer": `${WWE_PROFILE_ROOT}/stephanie-vaquer.png`,
  "the-rock": `${WWE_PROFILE_ROOT}/the-rock.png`,
  ...superstarArtOverrides
};
// Finished Superstar collectible fronts exported by Superstar Art Studio.
// These are intentionally separate from wrestler portraits: move/Entrance cards
// can continue using action/profile art while every Superstar-facing UI surface
// can prefer the finished collectible card. Missing custom files fall back in
// the UI to superstarArtwork without breaking the game.
export const superstarCardArtwork = Object.fromEntries(
  Object.keys(superstarArtwork).map(id => [id, `assets/cards/art/custom/superstars/${id}.webp`])
);

export function superstarCardArtFor(superstarId) {
  return superstarCardArtwork[superstarId] ?? null;
}

// Finished Move collectible fronts exported by Move Card Studio. As with
// Superstar fronts, these are a separate presentation layer from the older
// action-photo artwork resolver. Missing files fall back in the UI without
// changing gameplay data or the legacy card-art manifest.
export function moveCardArtFor(cardId) {
  return cardId ? `assets/cards/art/custom/moves/${cardId}.webp` : null;
}

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
  // All current Superstar cards now use sourced local profile portraits.
  // Inherited move/entrance usage is still temporary until exact action art exists.
  if (card.kind === "superstar" && superstarArtwork[card.superstarId]) return false;
  return true;
}
