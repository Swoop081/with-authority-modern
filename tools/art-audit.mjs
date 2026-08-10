import { existsSync } from "node:fs";
import { collectionCards } from "../js/data/collection.js";
import { artworkFor, cardArtwork, superstarArtwork } from "../js/data/artwork.js";

const rows = collectionCards.map(card => {
  const art = artworkFor(card);
  const exists = art ? existsSync(new URL(`../${art}`, import.meta.url)) : false;
  return { card, art, exists, exact: Boolean(cardArtwork[card.id]) };
});

const missing = rows.filter(r => !r.art || !r.exists);
const exact = rows.filter(r => r.exact);
const unique = new Set(rows.map(r => r.art));
const superstarImages = new Set(Object.values(superstarArtwork));
const inherited = rows.filter(r => !r.exact && superstarImages.has(r.art));
const generic = rows.filter(r => !r.exact && !superstarImages.has(r.art));

console.log(`WWE Legacy artwork audit`);
console.log(`Collectibles: ${rows.length}`);
console.log(`Cards with a valid local image: ${rows.length - missing.length}/${rows.length}`);
console.log(`Unique local image files in active use: ${unique.size}`);
console.log(`Exact card-specific overrides: ${exact.length}`);
console.log(`Temporary Superstar-image fallbacks: ${inherited.length}`);
console.log(`Temporary generic fallbacks: ${generic.length}`);
if (missing.length) {
  console.log(`\nMissing:`);
  for (const row of missing) console.log(`- ${row.card.id}: ${row.art ?? "NO PATH"}`);
  process.exitCode = 1;
}
