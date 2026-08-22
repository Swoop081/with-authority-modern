// Legacy compatibility bridge. Live WWE Legacy uses Normal / Emerald /
// Sapphire / Ruby print tiers; "Foil" no longer exists as a player-facing tier.
import { applyCardTier, tierDamageOffsetFor } from "./variants.js?v=0.13.95";
export const FOIL_DAMAGE_BONUS = 1;
export function foilDamageBonusFor(card) { return Math.max(0, tierDamageOffsetFor(card, "ruby")); }
export function applyFoilGameplay(card, foil = false) { return applyCardTier(card, foil ? "ruby" : "sapphire"); }
