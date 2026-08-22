import { assetUrl } from "../config/build.js?v=0.13.97";
import { cardArtOverrides, superstarArtOverrides } from "./card-art-overrides.js?v=0.13.97";
import { finishedFrontKeys } from "./finished-front-keys.js?v=0.13.97";

const SUMMERSLAM_ROOT = "assets/images/art-summerslam-series-1";
const WWE_PROFILE_ROOT = "assets/images/art-wwe-profile-portraits";
const WWE_MENU_SUPERSTAR_ROOT = "assets/images/art-wwe-menu-superstars";
const FINAL_BOSS_MENU_ART = "assets/images/art-season-1-final-boss-the-rock-final-boss-menu.png";
const TEMP_GENERIC_ART = "assets/images/card-temp-superstar-placeholder.svg";


// Official WWE.com Superstar profile renders used only for menu/presentation surfaces.
// These are kept separate from collectible card art so menus can compose clean
// wrestler photography without awkwardly cropping a finished card front.
const rawMenuSuperstarArtwork = {
  "cm-punk": `${WWE_MENU_SUPERSTAR_ROOT}-cm-punk.webp`,
  "roman-reigns": `${WWE_MENU_SUPERSTAR_ROOT}-roman-reigns.webp`,
  "cody-rhodes": `${WWE_MENU_SUPERSTAR_ROOT}-cody-rhodes.webp`,
  "seth-rollins": `${WWE_MENU_SUPERSTAR_ROOT}-seth-rollins.webp`,
  "stone-cold-steve-austin": `${WWE_MENU_SUPERSTAR_ROOT}-stone-cold-steve-austin.webp`,
  "the-undertaker": `${WWE_MENU_SUPERSTAR_ROOT}-the-undertaker.webp`,
  "hulk-hogan": `${WWE_MENU_SUPERSTAR_ROOT}-hulk-hogan.webp`,
  "ultimate-warrior": `${WWE_MENU_SUPERSTAR_ROOT}-ultimate-warrior.webp`,
  "liv-morgan": `${WWE_MENU_SUPERSTAR_ROOT}-liv-morgan.webp`,
  "rhea-ripley": `${WWE_MENU_SUPERSTAR_ROOT}-rhea-ripley.webp`,
  "paige": `${WWE_MENU_SUPERSTAR_ROOT}-paige.webp`,
  "becky-lynch": `${WWE_MENU_SUPERSTAR_ROOT}-becky-lynch.webp`,
};

// Superstar art is deliberately centralized. Replacing a portrait later only
// requires changing one path here (or using superstarArtOverrides below).
const rawSuperstarArtwork = {
  "cody-rhodes": `${SUMMERSLAM_ROOT}-superstars-cody-rhodes.webp`,
  "cm-punk": `${SUMMERSLAM_ROOT}-superstars-cm-punk.webp`,
  "roman-reigns": `${SUMMERSLAM_ROOT}-superstars-roman-reigns.webp`,
  "seth-rollins": `${SUMMERSLAM_ROOT}-superstars-seth-rollins.webp`,
  "oba-femi": `${SUMMERSLAM_ROOT}-superstars-oba-femi.webp`,
  "brock-lesnar": `${SUMMERSLAM_ROOT}-superstars-brock-lesnar.webp`,
  "kevin-owens": `${SUMMERSLAM_ROOT}-superstars-kevin-owens.webp`,
  "gunther": `${SUMMERSLAM_ROOT}-superstars-gunther.webp`,

  // Temporary Golden / Attitude era photos. These are intentionally easy to replace
  // when final era/move-specific art is sourced in Card Studio.
  "hulk-hogan": `${WWE_PROFILE_ROOT}-hulk-hogan.png`,
  "andre-the-giant": `${WWE_PROFILE_ROOT}-andre-the-giant.png`,
  "randy-savage": `${WWE_PROFILE_ROOT}-randy-savage.png`,
  "ultimate-warrior": `${WWE_PROFILE_ROOT}-ultimate-warrior.png`,
  "stone-cold-steve-austin": `${WWE_PROFILE_ROOT}-stone-cold-steve-austin.png`,
  "the-undertaker": `${WWE_PROFILE_ROOT}-the-undertaker.png`,
  "mankind": `${WWE_PROFILE_ROOT}-mankind.png`,
  "kane": `${WWE_PROFILE_ROOT}-kane.png`,

  // Evolution — Series 1 temporary sourced portraits.
  "rhea-ripley": `${WWE_PROFILE_ROOT}-rhea-ripley.png`,
  "liv-morgan": `${WWE_PROFILE_ROOT}-liv-morgan.png`,
  "becky-lynch": `${WWE_PROFILE_ROOT}-becky-lynch.png`,
  "bayley": `${WWE_PROFILE_ROOT}-bayley.png`,
  "charlotte-flair": `${WWE_PROFILE_ROOT}-charlotte-flair.png`,
  "iyo-sky": `${WWE_PROFILE_ROOT}-iyo-sky.png`,
  "paige": `${WWE_PROFILE_ROOT}-paige.png`,
  "stephanie-vaquer": `${WWE_PROFILE_ROOT}-stephanie-vaquer.png`,
  "the-rock": `${WWE_PROFILE_ROOT}-the-rock.png`,
  "rey-mysterio": `${WWE_PROFILE_ROOT}-rey-mysterio.jpg`,
  "dominik-mysterio": TEMP_GENERIC_ART,
  "penta": TEMP_GENERIC_ART,
  "el-grande-americano": TEMP_GENERIC_ART,
  "jey-uso": TEMP_GENERIC_ART,
  "la-knight": TEMP_GENERIC_ART,
  "alexa-bliss": TEMP_GENERIC_ART,
  "finn-balor": TEMP_GENERIC_ART,
  "danhausen": TEMP_GENERIC_ART,
  "tiffany-stratton": TEMP_GENERIC_ART,
  "chelsea-green": TEMP_GENERIC_ART,
  "bret-hart": TEMP_GENERIC_ART,
  "shawn-michaels": TEMP_GENERIC_ART,
  ...superstarArtOverrides
};

export const superstarArtwork = Object.fromEntries(
  Object.entries(rawSuperstarArtwork).map(([id, path]) => [id, assetUrl(path)])
);

export const menuSuperstarArtwork = Object.fromEntries(
  Object.entries(rawMenuSuperstarArtwork).map(([id, path]) => [id, assetUrl(path)])
);

export function menuSuperstarPhotoFor(superstarId) {
  return menuSuperstarArtwork[superstarId] ?? superstarArtwork[superstarId] ?? null;
}

// Dedicated Season 1 Final Boss presentation art supplied for reward/menu surfaces.
// This intentionally stays separate from the 12-person general menu-render pool and
// from Rock's collectible-card artwork.
export const finalBossRockMenuArtwork = assetUrl(FINAL_BOSS_MENU_ART);
// Finished Superstar collectible fronts exported by the unified Card Art Studio.
// These are intentionally separate from wrestler portraits: move/Entrance cards
// can continue using action/profile art while every Superstar-facing UI surface
// can prefer the finished collectible card. Missing custom files fall back in
// the UI to superstarArtwork without breaking the game.
// Card Studio is the naming authority for Superstar exports. It writes both
// finished Superstar fronts and HUD headshots using the canonical Superstar ID
// (for example `roxanne-perez.webp`). Do not derive these paths from the older
// portrait registry: newer/future roster members must resolve automatically.
function canonicalSuperstarArtId(superstarId) {
  const id = String(superstarId ?? "").trim();
  return id || null;
}

export const superstarCardArtwork = Object.fromEntries(
  Object.keys(superstarArtwork).map(id => [id, assetUrl(`assets/images/card-custom-superstar-${id}.webp`)])
);

export function superstarCardArtFor(superstarId) {
  const id = canonicalSuperstarArtId(superstarId);
  return id ? assetUrl(`assets/images/card-custom-superstar-${id}.webp`) : null;
}

export const superstarHeadshotArtwork = Object.fromEntries(
  Object.keys(superstarArtwork).map(id => [id, assetUrl(`assets/images/headshot-${id}.webp`)])
);

export function superstarHeadshotFor(superstarId) {
  const id = canonicalSuperstarArtId(superstarId);
  return id ? assetUrl(`assets/images/headshot-${id}.webp`) : null;
}

// Finished collectible fronts exported by the unified Card Art Studio.
// Each type gets a predictable folder, so installing an exported WebP never
// requires a manifest edit. Missing finished fronts fall back to legacy art.
const finishedFrontFolders = {
  superstar: "superstars",
  move: "moves",
  entrance: "entrances",
  manager: "managers",
  action: "actions",
  support: "supports",
  momentum: "momentum",
};

export function layeredCardArtFor(card) {
  // Layered fronts are automatic for every collectible type except Method
  // Momentum, whose authored live front remains the explicit presentation
  // exception. The renderer tries the layered plate first and falls back to
  // the existing flat/custom/generated treatment when it is not installed.
  if (!card || card.kind === "momentum") return null;
  const folder = finishedFrontFolders[card.kind];
  // Superstar layered fronts intentionally use the Superstar ID because that is
  // the filename Card Art Studio exports. Other card families retain their
  // stable finished-front key / card-ID convention.
  const key = card.kind === "superstar"
    ? (canonicalSuperstarArtId(card.superstarId) ?? (String(card.id ?? "").replace(/^superstar-/, "") || null))
    : (card.id ? (finishedFrontKeys[card.id] ?? card.id) : null);
  return folder && key ? assetUrl(`assets/images/card-layered-${({superstars:"superstar",moves:"move",entrances:"entrance",managers:"manager",actions:"action",supports:"support",momentum:"momentum"}[folder] ?? String(folder).replace(/s$/, ""))}-${key}.webp`) : null;
}

export function finishedCardArtFor(card) {
  if (!card) return null;
  if (card.kind === "superstar") return superstarCardArtFor(card.superstarId);
  const folder = finishedFrontFolders[card.kind];
  const key = card.id ? (finishedFrontKeys[card.id] ?? card.id) : null;
  return folder && key ? assetUrl(`assets/images/card-custom-${({superstars:"superstar",moves:"move",entrances:"entrance",managers:"manager",actions:"action",supports:"support",momentum:"momentum"}[folder] ?? String(folder).replace(/s$/, ""))}-${key}.webp`) : null;
}

// v0.11.18–v0.11.22 documentation sometimes described raw card-ID filenames.
// Keep that location as a secondary candidate so any art already installed there
// continues to work while the Studio uses stable collector-code filenames.
export function legacyFinishedCardArtFor(card) {
  if (!card) return null;
  // Superstar presentation historically fell back to the standard Superstar
  // artwork rather than a rules-only face. Keep that behavior after layered
  // Superstar fronts become eligible.
  if (card.kind === "superstar") return card.superstarId ? (superstarArtwork[card.superstarId] ?? null) : null;
  const folder = finishedFrontFolders[card.kind];
  return folder && card.id ? assetUrl(`assets/images/card-custom-${({superstars:"superstar",moves:"move",entrances:"entrance",managers:"manager",actions:"action",supports:"support",momentum:"momentum"}[folder] ?? String(folder).replace(/s$/, ""))}-${card.id}.webp`) : null;
}

// Backwards-compatible helper retained for existing Move-specific callers/tests.
export function moveCardArtFor(cardId) {
  return cardId ? assetUrl(`assets/images/card-custom-move-${cardId}.webp`) : null;
}

// Exact card-photo replacements always win. This is the long-term migration
// path from temporary fallback art to a unique photo for every individual card.
export const cardArtwork = cardArtOverrides;

export function artworkFor(card) {
  if (!card) return null;
  if (cardArtwork[card.id]) return assetUrl(cardArtwork[card.id]);
  if (card.kind === "superstar" && card.superstarId && superstarArtwork[card.superstarId]) return superstarArtwork[card.superstarId];
  return null;
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
