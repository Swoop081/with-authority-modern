// WWE Legacy card-art manifest.
//
// FINAL / USER-SOURCED PHOTO REPLACEMENT LAYER
// --------------------------------------------
// To replace any card image later, add or change ONE entry here and place the
// image file under assets/cards/art (WebP preferred). The shared card template,
// boosters, Collection, Play Pile and match hand all update automatically.
//
// Example:
//   "spear": "assets/cards/art/moves/roman-spear.webp",
//
// Exact card entries always override the temporary wrestler/generic fallbacks.
export const cardArtOverrides = {
  // Temporary Manager portraits (replace the path later without touching rules).
  "hof1-manager-bobby-heenan": "assets/cards/art/temp/bobby-heenan.webp",
  "hof1-manager-miss-elizabeth": "assets/cards/art/temp/miss-elizabeth.webp",
  "hof1-manager-paul-bearer": "assets/cards/art/temp/paul-bearer.webp",
};

// Optional Superstar portrait overrides. Use these when a better Superstar
// image is sourced without changing any Superstar/card data.
export const superstarArtOverrides = {
  // "the-undertaker": "assets/cards/art/superstars/the-undertaker-final.webp",
};
